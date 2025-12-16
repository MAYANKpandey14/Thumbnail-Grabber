export function extractVideoId(url: string | null | undefined): string | null {
    if (!url) return null;

    // Clean the URL first
    const cleanUrl = url.trim();

    // If the input is exactly 11 characters, assume it's a Video ID
    // YouTube video IDs use "base64" characters (A-Z, a-z, 0-9, -, _)
    if (/^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)) {
        return cleanUrl;
    }

    // Supports:
    // - https://youtu.be/VIDEO_ID
    // - https://www.youtube.com/watch?v=VIDEO_ID
    // - https://www.youtube.com/embed/VIDEO_ID
    // - https://www.youtube.com/shorts/VIDEO_ID
    // - http:// variants
    // - www. variants
    const regExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e|embed)\/|.*[?&]v=|shorts\/)|youtu\.be\/)([^"&?\/\s]{11})/i;
    const match = cleanUrl.match(regExp);
    return match ? match[1] : null;
}
