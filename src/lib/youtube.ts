import { extractVideoId } from "./utils";
import { Thumbnail, ThumbnailResponse } from "@/types";

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
        { quality: 'sd', suffix: 'sddefault' },
        { quality: 'hq', suffix: 'hqdefault' },
        { quality: 'mq', suffix: 'mqdefault' },
        { quality: 'default', suffix: 'default' },
    ] as const;

    const thumbnails: Thumbnail[] = qualities.map((q) => ({
        quality: q.quality,
        url: `https://img.youtube.com/vi/${videoId}/${q.suffix}.jpg`,
        dimensions: 'unknown',
    }));

    return {
        videoId,
        videoTitle: title,
        thumbnails,
        total: thumbnails.length
    };
};
