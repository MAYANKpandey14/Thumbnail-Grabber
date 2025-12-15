import { useParams } from "react-router-dom";
import { useFolderVideos } from "@/hooks/useFolderVideos";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, ExternalLink } from "lucide-react";

export default function FolderDetails() {
    const { folderId } = useParams<{ folderId: string }>();
    const { videos, loading, removeVideoFromFolder } = useFolderVideos(folderId!);

    if (!folderId) return null;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold tracking-tight">Folder Contents</h2>

            {loading ? (
                <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>
            ) : videos.length === 0 ? (
                <div className="text-center p-12 text-muted-foreground">This folder is empty.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {videos.map((video) => (
                        <Card key={video.id} className="overflow-hidden group">
                            <div className="aspect-video relative bg-muted">
                                <img
                                    src={`https://i.ytimg.com/vi/${video.video_id}/mqdefault.jpg`}
                                    alt={video.video_title || "Video thumbnail"}
                                    className="object-cover w-full h-full"
                                    loading="lazy"
                                />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button variant="secondary" size="sm" asChild>
                                        <a href={video.video_url} target="_blank" rel="noreferrer">
                                            <ExternalLink className="w-4 h-4 mr-2" /> Watch
                                        </a>
                                    </Button>
                                    <Button variant="destructive" size="sm" onClick={() => removeVideoFromFolder(video.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <CardContent className="p-3">
                                <div className="font-medium text-sm truncate" title={video.video_title || video.video_id}>
                                    {video.video_title || video.video_id}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
