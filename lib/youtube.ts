import { extractVideoId } from "./utils";
import { Thumbnail, ThumbnailResponse } from "@/types";

export const getThumbnails = (url: string): ThumbnailResponse | null => {
    const videoId = extractVideoId(url);
    if (!videoId) return null;

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
        dimensions: 'unknown', // Client-side we don't know dimensions without checking, but usually standard
    }));

    return {
        videoId,
        thumbnails,
        total: thumbnails.length
    };
};
