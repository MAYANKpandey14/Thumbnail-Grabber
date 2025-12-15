import { useState } from "react";
import Navbar from "@/components/Navbar";
import HeroInput from "@/components/HeroInput";
import ThumbnailGrid from "@/components/ThumbnailGrid";
import { Thumbnail, ThumbnailResponse } from "@/types";
import { toast } from "sonner";
import { getThumbnails } from "@/lib/youtube";
import { useGuestLimit } from "@/hooks/useGuestLimit";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";

export default function Home() {
    const [results, setResults] = useState<ThumbnailResponse[]>([]);
    const [loading, setLoading] = useState(false);

    // Use useAuth hook instead of local state + createClient
    const { user } = useAuth();
    const { incrementCount, remaining } = useGuestLimit(!!user);

    const handleSearch = async (urls: string[], previewOnly: boolean) => {
        if (urls.length === 0) return;

        setLoading(true);
        setResults([]);

        const newResults: ThumbnailResponse[] = [];
        let errorCount = 0;

        try {
            const fetchPromises = urls.map(async (url) => {
                const data = await getThumbnails(url);
                if (!data) {
                    errorCount++;
                    return null;
                }
                return data;
            });

            const settled = await Promise.all(fetchPromises);
            const validData = settled.filter((item): item is ThumbnailResponse => item !== null && item.thumbnails.length > 0);

            setResults(validData);

            if (validData.length === 0 && errorCount > 0) {
                toast.error("Failed to fetch thumbnails for the provided URLs.");
            } else if (validData.length > 0) {
                if (errorCount > 0) {
                    toast.warning(`Found thumbnails for ${validData.length} videos. ${errorCount} failed.`);
                } else {
                    toast.success(`Successfully loaded ${validData.length} video(s)!`);
                }

                // RECORD HISTORY FOR AUTHENTICATED USERS
                if (user) {
                    try {
                        const historyInserts = validData.map(v => ({
                            user_id: user.id,
                            video_id: v.videoId,
                            video_url: `https://youtube.com/watch?v=${v.videoId}`,
                            video_title: v.videoTitle || `Video ${v.videoId}`
                        }));

                        const { error: historyError } = await supabase
                            .from('user_downloads')
                            .insert(historyInserts);

                        if (historyError) {
                            console.error("Failed to record history:", historyError);
                            // Optional: toast.error("Could not save to history");
                        }
                    } catch (err) {
                        console.error("History recording error:", err);
                    }
                }

            } else {
                toast.info("No thumbnails found.");
            }

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const checkDownloadAllowed = (): boolean => {
        if (!incrementCount()) {
            toast.error("Daily limit reached. Login for more!");
            return false;
        }
        return true;
    };

    const handleDownloadComplete = async (blob: Blob, thumb: Thumbnail, videoId: string) => {
        // If user is logged in, save to Supabase
        if (user) {
            try {
                const videoData = results.find(r => r.videoId === videoId);

                // 1. Upload to Storage
                const fileName = `${user.id}/${videoId}/${thumb.quality}.jpg`;
                const { error: uploadError } = await supabase.storage
                    .from('thumbnails')
                    .upload(fileName, blob, { upsert: true });

                if (!uploadError) {
                    // 2. Insert into History (Minimal data)
                    await supabase
                        .from('user_downloads')
                        .insert({
                            user_id: user.id,
                            video_id: videoId,
                            video_url: `https://youtube.com/watch?v=${videoId}`,
                            video_title: `Video ${videoId}`
                        });

                    // Logic for "Saved Thumbnails" is removed as we now use Folders.
                    // Users can manually organize history into folders.
                }
            } catch (e) {
                console.error("Failed to track download", e);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-1 bg-gradient-to-b from-red-50/50 to-background dark:from-red-950/20 dark:to-background">
                <HeroInput onSearch={handleSearch} isLoading={loading} />

                <div className="container px-4 pb-20">
                    {!user && (
                        <div className="text-center mb-8 text-sm text-muted-foreground">
                            Guest Downloads Remaining: <span className="font-bold text-primary">{remaining}</span> / 10
                        </div>
                    )}

                    {results.length > 0 && (
                        <ThumbnailGrid
                            results={results}
                            checkDownloadAllowed={checkDownloadAllowed}
                            onDownloadComplete={handleDownloadComplete}
                        />
                    )}
                </div>
            </main>
        </div>
    );
}
