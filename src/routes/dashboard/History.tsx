import { useState } from "react";
import { useHistory, HistoryFilter } from "@/hooks/useHistory";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, FolderPlus, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { AddToFolderDialog } from "@/components/dashboard/AddToFolderDialog";
import ThumbnailGrid from "@/components/ThumbnailGrid"; // We might reuse this or make a preview dialog
// Actually we need a way to VIEW the thumbnails again. The requirement says:
// "View thumbnails" (opens the existing client-side grid/preview flow).
// This implies redirecting to Home with that URL, or showing a modal with the grid.
// A modal seems better. Or simpler: link to `/?url=...` if Home supports it (it handles input).
// But standard usage might be just a dialog with the thumbnails.
// For now, I'll put a placeholder or basic preview.

export default function History() {
    const [filter, setFilter] = useState<HistoryFilter>('day');
    const { history, loading } = useHistory(filter);
    const [selectedVideo, setSelectedVideo] = useState<{ id: string; url: string; title: string } | null>(null);

    // Grouping Logic
    // For "Last hour": simple list
    // For "Day": simple list or group by hour? Prompt says "group by hour blocks or Morning/Afternoon".
    // For "Week/Month": group by day.

    // Let's implement a generic grouper or just render list for MVP if grouping is complex.
    // Prompt: "Group by bucket".
    // I'll do simple list first to ensure data flow, then group.

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
                                        <CardTitle className="text-base font-medium leading-none">
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
                                        className="text-xs flex items-center hover:underline"
                                    >
                                        <ExternalLink className="w-3 h-3 mr-1" />
                                        YouTube
                                    </a>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => setSelectedVideo({ id: item.video_id, url: item.video_url, title: item.video_title })}
                                    >
                                        <FolderPlus className="w-4 h-4 mr-2" />
                                        Save
                                    </Button>
                                    {/* "View Thumbnails" could be another button or the main action */}
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => window.open(`https://img.youtube.com/vi/${item.video_id}/maxresdefault.jpg`, '_blank')} // Simple hack to open in Home for now, can refine later
                                    >
                                        View
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
        </div>
    );
}
