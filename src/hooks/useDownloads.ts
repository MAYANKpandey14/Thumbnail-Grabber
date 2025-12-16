import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ThumbnailResponse, Thumbnail } from "@/types";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useDownloads() {
    const { user } = useAuth();
    const [isRecording, setIsRecording] = useState(false);

    const recordSearchHistory = async (videos: ThumbnailResponse[]) => {
        if (!user || videos.length === 0) return;

        try {
            const historyInserts = videos.map(v => ({
                user_id: user.id,
                video_id: v.videoId,
                video_url: `https://youtube.com/watch?v=${v.videoId}`,
                video_title: v.videoTitle || `Video ${v.videoId}`
            }));

            const { error } = await supabase
                .from('user_downloads')
                .insert(historyInserts);

            if (error) {
                console.error("Failed to record history:", error);
            }
        } catch (err) {
            console.error("History recording error:", err);
        }
    };

    const saveDownloadToStorage = async (blob: Blob, thumb: Thumbnail, videoId: string, videoTitle?: string) => {
        if (!user) return;
        setIsRecording(true);
        try {
            // 1. Upload to Storage
            const fileName = `${user.id}/${videoId}/${thumb.quality}.jpg`;
            const { error: uploadError } = await supabase.storage
                .from('thumbnails')
                .upload(fileName, blob, { upsert: true });

            if (uploadError) throw uploadError;

            // 2. Insert into History
            const { error: dbError } = await supabase
                .from('user_downloads')
                .insert({
                    user_id: user.id,
                    video_id: videoId,
                    video_url: `https://youtube.com/watch?v=${videoId}`,
                    video_title: videoTitle || `Video ${videoId}`
                });

            if (dbError) throw dbError;

        } catch (e: any) {
            console.error("Failed to track download", e);
            toast.error("Failed to save download record");
        } finally {
            setIsRecording(false);
        }
    };

    return {
        recordSearchHistory,
        saveDownloadToStorage,
        isRecording
    };
}
