import { extractVideoId } from "@/utils/extractVideoId";
import { Thumbnail, ThumbnailResponse } from "@/types";
import { getThumbnailUrl } from "@/utils/thumbnailUrls";

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
        { quality: 'maxres', suffix: 'maxresdefault', dimensions: '1280x720' },
        { quality: 'hq', suffix: 'hqdefault', dimensions: '480x360' },
        { quality: 'mq', suffix: 'mqdefault', dimensions: '320x180' },
        { quality: 'sd', suffix: 'sddefault', dimensions: '640x480' },
        { quality: 'default', suffix: 'default', dimensions: '120x90' },
    ] as const;

    const thumbnails: Thumbnail[] = qualities.map((q) => ({
        quality: q.quality,
        url: getThumbnailUrl(videoId, q.suffix),
        dimensions: q.dimensions,
    }));

    return {
        videoId,
        videoTitle: title,
        thumbnails,
        total: thumbnails.length
    };
};
