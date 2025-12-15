import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useFolders } from "@/hooks/useFolders";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabaseClient";


interface AddToFolderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    video: { id: string; url: string; title: string } | null;
}

export function AddToFolderDialog({ open, onOpenChange, video }: AddToFolderDialogProps) {
    const { folders, loading: foldersLoading } = useFolders();
    const [selectedFolderId, setSelectedFolderId] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        if (!selectedFolderId || !video) return;
        setIsSaving(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error("Not authenticated");

            const { error } = await supabase
                .from('folder_videos')
                .insert({
                    user_id: user.id,
                    folder_id: selectedFolderId,
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
            } else {
                toast.success("Added to folder");
                onOpenChange(false);
            }
        } catch (err: any) {
            console.error(err);
            toast.error(err.message || "Failed to add to folder");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add to Folder</DialogTitle>
                    <DialogDescription>
                        Save "{video?.title || video?.id}" to a folder.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Select Folder</Label>
                        <Select value={selectedFolderId} onValueChange={setSelectedFolderId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a folder" />
                            </SelectTrigger>
                            <SelectContent>
                                {foldersLoading ? (
                                    <div className="flex items-center justify-center p-2">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    </div>
                                ) : folders.length === 0 ? (
                                    <div className="p-2 text-sm text-muted-foreground">No folders found</div>
                                ) : (
                                    folders.map(f => (
                                        <SelectItem key={f.id} value={f.id}>{f.name}</SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSave} disabled={isSaving || !selectedFolderId}>
                        {isSaving ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
