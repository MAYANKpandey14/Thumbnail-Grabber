import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { ThumbnailFolder } from "@/types";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export function useFolders() {
    const { user } = useAuth();
    const [folders, setFolders] = useState<ThumbnailFolder[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;
        fetchFolders();
    }, [user]);

    const fetchFolders = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('thumbnail_folders')
                .select('*')
                .eq('user_id', user!.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setFolders(data || []);
        } catch (err: any) {
            console.error("Error fetching folders:", err);
            toast.error("Failed to load folders");
        } finally {
            setLoading(false);
        }
    };

    const createFolder = async (name: string, tag?: string) => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('thumbnail_folders')
                .insert({ user_id: user.id, name, tag })
                .select()
                .single();

            if (error) throw error;
            setFolders([data, ...folders]);
            toast.success("Folder created");
            return data;
        } catch (err: any) {
            console.error("Error creating folder:", err);
            toast.error(err.message || "Failed to create folder");
            return null;
        }
    };

    const updateFolder = async (id: string, name: string, tag?: string) => {
        try {
            const { data, error } = await supabase
                .from('thumbnail_folders')
                .update({ name, tag })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            setFolders(folders.map(f => f.id === id ? data : f));
            toast.success("Folder updated");
            return data;
        } catch (err: any) {
            console.error("Error updating folder:", err);
            toast.error("Failed to update folder");
            return null;
        }
    };

    const deleteFolder = async (id: string) => {
        try {
            const { error } = await supabase
                .from('thumbnail_folders')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setFolders(folders.filter(f => f.id !== id));
            toast.success("Folder deleted");
            return true;
        } catch (err: any) {
            console.error("Error deleting folder:", err);
            toast.error("Failed to delete folder");
            return false;
        }
    };

    return { folders, loading, createFolder, updateFolder, deleteFolder, refresh: fetchFolders };
}
