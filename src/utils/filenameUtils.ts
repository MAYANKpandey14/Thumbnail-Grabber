/**
 * Sanitizes a string to be safe for use as a filename.
 * Removes illegal characters and replaces them with safe alternatives or removes them.
 * Truncates to a reasonable length.
 */
export const sanitizeFilename = (filename: string): string => {
    if (!filename) return "untitled";

    // Remove illegal characters for various filesystems (Windows, Linux, Mac)
    // / ? < > \ : * | "
    // Also remove control characters
    // eslint-disable-next-line no-control-regex
    let safeName = filename.replace(/[/?<>\\:*|"\x00-\x1F]/g, "-");

    // Replace multiple dashes with single dash
    safeName = safeName.replace(/-+/g, "-");

    // Trim dashes from start and end
    safeName = safeName.replace(/^-+|-+$/g, "");

    // Truncate to 200 chars to be safe (most filesystems support 255)
    if (safeName.length > 200) {
        safeName = safeName.substring(0, 200);
    }

    return safeName || "untitled";
};
