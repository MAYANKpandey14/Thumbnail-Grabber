import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useFolders } from "@/hooks/useFolders";
import { ThumbnailFolder } from "@/types";

interface CreateFolderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    folderToEdit?: ThumbnailFolder | null;
    onSuccess?: () => void;
}

export function CreateFolderDialog({ open, onOpenChange, folderToEdit, onSuccess }: CreateFolderDialogProps) {
    const [name, setName] = useState("");
    const [tag, setTag] = useState("");
    const { createFolder, updateFolder } = useFolders();
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (open) {
            if (folderToEdit) {
                setName(folderToEdit.name);
                setTag(folderToEdit.tag || "");
            } else {
                setName("");
                setTag("");
            }
        }
    }, [open, folderToEdit]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        let success = false;

        if (folderToEdit) {
            const result = await updateFolder(folderToEdit.id, name, tag || undefined);
            if (result) success = true;
        } else {
            const result = await createFolder(name, tag || undefined);
            if (result) success = true;
        }

        setIsSubmitting(false);

        if (success) {
            onSuccess?.();
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{folderToEdit ? "Edit Folder" : "Create Folder"}</DialogTitle>
                    <DialogDescription>
                        {folderToEdit ? "Update your folder details." : "Add a new folder to organize your saved videos."}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="col-span-3"
                                placeholder="e.g. Music, Tutorials"
                                required
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="tag" className="text-right">
                                Tag
                            </Label>
                            <Input
                                id="tag"
                                value={tag}
                                onChange={(e) => setTag(e.target.value)}
                                className="col-span-3"
                                placeholder="Optional tag"
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Saving..." : (folderToEdit ? "Save Changes" : "Create Folder")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
