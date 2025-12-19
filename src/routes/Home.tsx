import { useState, useCallback } from "react";
import Navbar from "@/components/Navbar";
import HeroInput from "@/components/HeroInput";
import ThumbnailGrid from "@/components/ThumbnailGrid";
import SEOContent from "@/components/SEOContent";
import FAQ from "@/components/FAQ";
import { Thumbnail, ThumbnailResponse } from "@/types";
import { toast } from "sonner";
import { getThumbnails } from "@/lib/youtube";
import { useGuestLimit } from "@/hooks/useGuestLimit";
import { useAuth } from "@/hooks/useAuth";
import { useDownloads } from "@/hooks/useDownloads";

export default function Home() {
    const [results, setResults] = useState<ThumbnailResponse[]>([]);
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();
    const { incrementCount, remaining } = useGuestLimit(!!user);
    const { recordSearchHistory, saveDownloadToStorage } = useDownloads();

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
                // Use hook
                await recordSearchHistory(validData);

            } else {
                toast.info("No thumbnails found.");
            }

        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const checkDownloadAllowed = useCallback((): boolean => {
        if (!incrementCount()) {
            toast.error("Daily limit reached. Login for more!");
            return false;
        }
        return true;
    }, [incrementCount]);

    const handleDownloadComplete = useCallback(async (blob: Blob, thumb: Thumbnail, videoId: string) => {
        const videoData = results.find(r => r.videoId === videoId);
        await saveDownloadToStorage(blob, thumb, videoId, videoData?.videoTitle);
    }, [results, saveDownloadToStorage]);

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

                    <div className="mt-20">
                        <SEOContent />
                        <FAQ />
                    </div>
                </div>
            </main>
        </div>
    );
}

