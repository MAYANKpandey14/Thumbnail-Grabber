export type ThumbnailQuality = 'maxresdefault' | 'sddefault' | 'hqdefault' | 'mqdefault' | 'default';

export const THUMBNAIL_QUALITIES: ThumbnailQuality[] = [
    'maxresdefault',
    'sddefault',
    'hqdefault',
    'mqdefault',
    'default'
];

export function getThumbnailUrl(videoId: string, quality: ThumbnailQuality = 'maxresdefault'): string {
    return `https://i.ytimg.com/vi/${videoId}/${quality}.jpg`;
}

export function getAllThumbnailUrls(videoId: string): Record<ThumbnailQuality, string> {
    return {
        maxresdefault: getThumbnailUrl(videoId, 'maxresdefault'),
        sddefault: getThumbnailUrl(videoId, 'sddefault'),
        hqdefault: getThumbnailUrl(videoId, 'hqdefault'),
        mqdefault: getThumbnailUrl(videoId, 'mqdefault'),
        default: getThumbnailUrl(videoId, 'default'),
    };
}
