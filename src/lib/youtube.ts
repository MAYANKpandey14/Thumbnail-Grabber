import { extractVideoId } from "@/utils/extractVideoId";
import { Thumbnail, ThumbnailResponse } from "@/types";
import { getThumbnailUrl } from "@/lib/youtube/thumbnailUrls";

export const getVideoTitle = async (url: string): Promise<string> => {
    try {
        const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
        const data = await res.json();
        return data.title || "Unknown Video";
    } catch (e) {
        console.error("Failed to fetch video title", e);
        return "Unknown Video";
    }
};

export const getThumbnails = async (url: string): Promise<ThumbnailResponse | null> => {
    const videoId = extractVideoId(url);
    if (!videoId) return null;

    const title = await getVideoTitle(`https://www.youtube.com/watch?v=${videoId}`);

    const qualities = [
        { quality: 'maxres', suffix: 'maxresdefault' },
    ] as const;

    const thumbnails: Thumbnail[] = qualities.map((q) => ({
        quality: q.quality,
        url: getThumbnailUrl(videoId, q.suffix),
        dimensions: '1280x720',
    }));

    return {
        videoId,
        videoTitle: title,
        thumbnails,
        total: thumbnails.length
    };
};
