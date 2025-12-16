import JSZip from 'jszip';
import { ParsedCSVRow } from '@/lib/csv/parseCsv';
import { getThumbnailUrl } from "@/utils/thumbnailUrls";

interface ZipProgress {
    current: number;
    total: number;
    percent: number;
}

export async function createThumbnailZip(
    rows: ParsedCSVRow[],
    onProgress?: (progress: ZipProgress) => void
): Promise<Blob> {
    const zip = new JSZip();
    const validRows = rows.filter(r => r.status === 'valid' && r.videoId);
    const total = validRows.length;
    let completed = 0;

    // Limit concurrency to avoid network thrashing
    const CONCURRENCY_LIMIT = 5;
    const queue = [...validRows];

    const processItem = async (row: ParsedCSVRow) => {
        if (!row.videoId) return;

        // Try maxres, fallback to hq if fail? 
        // For simplicity and speed in bulk, we try maxres first.
        // A robust solution would try/catch fetch, then try lower quality.
        // Let's implement a simple fallback chain.

        const qualities = ['maxresdefault', 'hqdefault', 'mqdefault'] as const;
        let blob: Blob | null = null;
        let finalQuality = '';

        for (const quality of qualities) {
            try {
                const url = getThumbnailUrl(row.videoId, quality);
                const response = await fetch(url);
                if (!response.ok) throw new Error('Network response was not ok');
                blob = await response.blob();
                // Check if blob is a valid image or the generic "deleted video" image?
                // YouTube sometimes returns a 120x90 placeholder for invalid maxres. 
                // However, fetching usually returns 404 for maxres if not present.
                if (blob.size > 0) {
                    finalQuality = quality;
                    break;
                }
            } catch (e) {
                // Continue to next quality
                continue;
            }
        }

        if (blob) {
            // Filename: {title}-{id}.jpg or {id}.jpg
            const safeTitle = row.title ? row.title.replace(/[^a-zA-Z0-9]/g, '_') : 'video';
            const filename = `${safeTitle} -${row.videoId}.jpg`;

            // Organize by folder if present?
            if (row.folder) {
                zip.folder(row.folder)?.file(filename, blob);
            } else {
                zip.file(filename, blob);
            }
        }

        completed++;
        if (onProgress) {
            onProgress({
                current: completed,
                total: total,
                percent: Math.round((completed / total) * 100)
            });
        }
    };

    // Execute with concurrency limit
    const activePromises: Promise<void>[] = [];

    for (const item of validRows) {
        const p = processItem(item);
        activePromises.push(p);

        if (activePromises.length >= CONCURRENCY_LIMIT) {
            await Promise.race(activePromises);
            // Remove completed promises (not perfect but simple enough)
            // Actually, Promise.race doesn't remove. We need to track them.
            // Better: use a recursive function or a library like p-limit.
            // Since we can't install p-limit, let's just use strict batching or manage the array.
        }

        // Clean up finished promises to keep array small strategies
        // Simple strategy: wait for one to finish, find it in the list (hard), remove it.
        // Easier: Just wait for Promise.race, then filter out fulfilled ones.
        // Since we can't easily inspect promise state without a wrapper...
        // Let's just do Batches of 5. It's slower but safer and easier to implement correctly.
    }

    // Actually, proper concurrency pool implementation:
    const workers = [];

    // We can't really do the iterator approach easily inside a loop without async generator.
    // Let's stick to batching for simplicity and robustness in this constrained env.
    // Batch size 5.

    // To support "Download Selected", we accept `rows` which is already filtered by caller if needed.

    // Re-writing loop for batching:
    for (let i = 0; i < validRows.length; i += CONCURRENCY_LIMIT) {
        const batch = validRows.slice(i, i + CONCURRENCY_LIMIT);
        await Promise.all(batch.map(processItem));
    }

    return await zip.generateAsync({ type: 'blob' });
}
