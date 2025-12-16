import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useFolderMutations() {
    const { user } = useAuth();
    const [isMutating, setIsMutating] = useState(false);

    const addVideoToFolder = async (folderId: string, video: { id: string; url: string; title: string }) => {
        if (!user) {
            toast.error("You must be logged in");
            return false;
        }
        setIsMutating(true);
        try {
            const { error } = await supabase
                .from('folder_videos')
                .insert({
                    user_id: user.id,
                    folder_id: folderId,
                    video_id: video.id,
                    video_url: video.url,
                    video_title: video.title
                });

            if (error) {
                if (error.code === '23505') { // Unique violation
                    toast.error("Video already in this folder");
                } else {
                    throw error;
                }
                return false;
            }

            toast.success("Added to folder");
            return true;
        } catch (err: any) {
            console.error("Error adding to folder:", err);
            toast.error(err.message || "Failed to add to folder");
            return false;
        } finally {
            setIsMutating(false);
        }
    };

    return {
        addVideoToFolder,
        isMutating
    };
}
