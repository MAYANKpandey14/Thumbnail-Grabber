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
import { useFolderMutations } from "@/hooks/useFolderMutations";
import { EmptyState } from "@/components/ui/empty-state";


interface AddToFolderDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    video: { id: string; url: string; title: string } | null;
}

export function AddToFolderDialog({ open, onOpenChange, video }: AddToFolderDialogProps) {
    const { folders, loading: foldersLoading } = useFolders();
    const { addVideoToFolder, isMutating } = useFolderMutations();
    const [selectedFolderId, setSelectedFolderId] = useState("");

    const handleSave = async () => {
        if (!selectedFolderId || !video) return;

        const success = await addVideoToFolder(selectedFolderId, video);

        if (success) {
            onOpenChange(false);
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
                                    <div className="p-4">
                                        <EmptyState title="No folders" description="Create a folder in the dashboard first." />
                                    </div>
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
                    <Button onClick={handleSave} disabled={isMutating || !selectedFolderId}>
                        {isMutating ? "Saving..." : "Save"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

