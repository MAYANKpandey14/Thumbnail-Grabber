import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { FolderVideo } from "@/types";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useFolderVideos(folderId: string) {
    const { user } = useAuth();
    const [videos, setVideos] = useState<FolderVideo[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !folderId) return;
        fetchVideos();
    }, [user, folderId]);

    const fetchVideos = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('folder_videos')
                .select('*')
                .eq('folder_id', folderId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setVideos(data || []);
        } catch (err: any) {
            console.error("Error fetching folder videos:", err);
            toast.error("Failed to load videos");
        } finally {
            setLoading(false);
        }
    };

    const addVideoToFolder = async (video_id: string, video_url: string, video_title?: string) => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('folder_videos')
                .insert({
                    user_id: user.id,
                    folder_id: folderId,
                    video_id,
                    video_url,
                    video_title
                })
                .select()
                .single();

            if (error) {
                if (error.code === '23505') { // Unique violation
                    toast.error("Video already in this folder");
                    return null;
                }
                throw error;
            }

            setVideos([data, ...videos]);
            toast.success("Video added to folder");
            return data;
        } catch (err: any) {
            console.error("Error adding video to folder:", err);
            toast.error(err.message || "Failed to add video");
            return null;
        }
    };

    const removeVideoFromFolder = async (id: string) => {
        try {
            const { error } = await supabase
                .from('folder_videos')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setVideos(videos.filter(v => v.id !== id));
            toast.success("Video removed");
            return true;
        } catch (err: any) {
            console.error("Error removing video:", err);
            toast.error("Failed to remove video");
            return false;
        }
    };

    return { videos, loading, addVideoToFolder, removeVideoFromFolder, refresh: fetchVideos };
}
