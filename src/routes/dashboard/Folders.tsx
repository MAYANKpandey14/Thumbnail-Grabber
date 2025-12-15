import { useState } from "react";
import { useFolders } from "@/hooks/useFolders";
import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Folder as FolderIcon, MoreVertical, Pencil, Trash2 } from "lucide-react";
import { CreateFolderDialog } from "@/components/dashboard/CreateFolderDialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Folders() {
    const { folders, loading, deleteFolder, refresh } = useFolders();
    const [createOpen, setCreateOpen] = useState(false);
    const [editingFolder, setEditingFolder] = useState<any>(null); // For rename
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const handleDelete = async () => {
        if (deleteId) {
            await deleteFolder(deleteId);
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">Folders</h2>
                <Button onClick={() => setCreateOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> New Folder
                </Button>
            </div>

            {loading ? (
                <div className="grid gap-4 md:grid-cols-3">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-muted animate-pulse rounded-lg" />)}
                </div>
            ) : folders.length === 0 ? (
                <div className="text-center p-12 border-2 border-dashed rounded-lg">
                    <FolderIcon className="mx-auto h-12 w-12 text-muted-foreground opacity-50" />
                    <h3 className="mt-4 text-lg font-semibold">No folders yet</h3>
                    <p className="text-muted-foreground mb-4">Organize your saved videos into folders.</p>
                    <Button onClick={() => setCreateOpen(true)}>Create Folder</Button>
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                    {folders.map(folder => (
                        <Card key={folder.id} className="group hover:shadow-md transition-shadow">
                            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                <Link to={`/dashboard/folders/${folder.id}`} className="block flex-1 cursor-pointer">
                                    <CardTitle className="text-lg flex items-center">
                                        <FolderIcon className="mr-2 h-5 w-5 fill-primary/20 text-primary" />
                                        <span className="truncate">{folder.name}</span>
                                    </CardTitle>
                                </Link>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="sr-only">Open menu</span>
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem onClick={() => { setEditingFolder(folder); setCreateOpen(true); }}>
                                            <Pencil className="mr-2 h-4 w-4" /> Rename
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => setDeleteId(folder.id)}>
                                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </CardHeader>
                            <Link to={`/dashboard/folders/${folder.id}`}>
                                <CardContent>
                                    {folder.tag && (
                                        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                                            {folder.tag}
                                        </span>
                                    )}
                                    {!folder.tag && <div className="h-5" />}
                                </CardContent>
                                <CardFooter>
                                    <CardDescription>
                                        {/* Ideally we show count here if we joined or fetched count */}
                                        View videos
                                    </CardDescription>
                                </CardFooter>
                            </Link>
                        </Card>
                    ))}
                </div>
            )}

            <CreateFolderDialog
                open={createOpen}
                onOpenChange={(open) => {
                    setCreateOpen(open);
                    if (!open) setEditingFolder(null);
                }}
                folderToEdit={editingFolder}
                onSuccess={() => {
                    setCreateOpen(false);
                    setEditingFolder(null);
                    refresh();
                }}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this folder and its contents. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}


