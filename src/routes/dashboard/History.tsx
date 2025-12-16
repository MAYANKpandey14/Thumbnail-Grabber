import { useState } from "react";
import { useHistory, HistoryFilter } from "@/hooks/useHistory";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, FolderPlus, Loader2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { AddToFolderDialog } from "@/components/dashboard/AddToFolderDialog";
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

export default function History() {
    const [filter, setFilter] = useState<HistoryFilter>('day');
    const { history, loading, deleteFromHistory } = useHistory(filter); // Updated hook
    const [selectedVideo, setSelectedVideo] = useState<{ id: string; url: string; title: string } | null>(null);
    const [deleteId, setDeleteId] = useState<string | null>(null);

    const matchDelete = () => {
        if (deleteId) {
            deleteFromHistory(deleteId);
            setDeleteId(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold tracking-tight">History</h2>
            </div>

            <Tabs value={filter} onValueChange={(v) => setFilter(v as HistoryFilter)} className="w-full">
                <TabsList>
                    <TabsTrigger value="hour">Last Hour</TabsTrigger>
                    <TabsTrigger value="day">Today</TabsTrigger>
                    <TabsTrigger value="week">This Week</TabsTrigger>
                    <TabsTrigger value="month">This Month</TabsTrigger>
                </TabsList>
            </Tabs>

            {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
            ) : history.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">No history for this period.</div>
            ) : (
                <div className="grid gap-4">
                    {history.map((item) => (
                        <Card key={item.id}>
                            <CardHeader className="flex flex-row items-center justify-between py-4">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-base font-medium leading-none line-clamp-1">
                                            {item.video_title || item.video_id}
                                        </CardTitle>
                                    </div>
                                    <span className="text-xs text-muted-foreground flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {format(new Date(item.created_at), 'PPP p')}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <a
                                        href={item.video_url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-xs flex items-center hover:underline mr-2"
                                    >
                                        <ExternalLink className="w-3 h-3 mr-1" />
                                        YouTube
                                    </a>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={() => setSelectedVideo({ id: item.video_id, url: item.video_url, title: item.video_title })}
                                        title="Save to Folder"
                                    >
                                        <FolderPlus className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                                        onClick={() => setDeleteId(item.id)}
                                        title="Delete from History"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardHeader>
                        </Card>
                    ))}
                </div>
            )}

            <AddToFolderDialog
                open={!!selectedVideo}
                onOpenChange={(open) => !open && setSelectedVideo(null)}
                video={selectedVideo}
            />

            <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently remove this item from your history. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={matchDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
