import Papa from 'papaparse';
import { extractVideoId } from '@/utils/extractVideoId';

export interface CSVRow {
    url: string;
    title?: string;
    folder?: string;
}

export type ParsedRowStatus = 'valid' | 'invalid' | 'duplicate';

export interface ParsedCSVRow {
    rowIndex: number;
    rawUrl: string;
    videoId?: string;
    title?: string;
    folder?: string;
    status: ParsedRowStatus;
    error?: string;
}

export interface ParseResult {
    rawCount: number;
    rows: ParsedCSVRow[];
    duplicatesRemoved: number;
    validCount: number;
    invalidCount: number;
}

const MAX_ROWS = 5000;

export function parseCsvFile(file: File): Promise<ParseResult> {
    return new Promise((resolve, reject) => {
        Papa.parse(file, {
            skipEmptyLines: true,
            // If the CSV has no headers, Papa Parse might try to use the first row as headers.
            // We need to handle both cases.
            // A simple heuristic: if "url" is not in meta.fields, maybe it's headerless?
            // Actually, let's use a transform function or checking fields after parsing first chunk?
            // Simple approach: Parse with headers. If 'url' column is missing, try parsing without headers.
            // But Papa.parse is one-shot.

            // Let's rely on `transformHeader` to normalize or just check results.
            // BETTER STRATEGY: parse with header: false, then detect if first row looks like a header.
            header: false,
            complete: (results) => {
                if (results.errors.length) {
                    // Just log parsing errors but continue processing what we have?
                    // Or reject? Let's process valid rows and mark others invalid if possible, or reject if catastrophic.
                    // Usually papaparse errors are malformed CSVs.
                    console.warn("CSV Parse errors:", results.errors);
                }

                const data = results.data as string[][];

                if (data.length > MAX_ROWS) {
                    reject(new Error(`File too large. Maximum ${MAX_ROWS} rows allowed.`));
                    return;
                }

                if (data.length === 0) {
                    reject(new Error("File is empty."));
                    return;
                }

                // Header detection logic
                let hasHeader = false;
                let urlIndex = 0;
                let titleIndex = -1;
                let folderIndex = -1;

                const firstRow = data[0].map(c => c.toLowerCase().trim());

                // Check if first row contains "url" or "link" or "id"
                const headerUrlIndex = firstRow.findIndex(c => c === 'url' || c === 'link' || c === 'video' || c === 'id');

                if (headerUrlIndex !== -1) {
                    hasHeader = true;
                    urlIndex = headerUrlIndex;
                    titleIndex = firstRow.findIndex(c => c === 'title' || c === 'name');
                    folderIndex = firstRow.findIndex(c => c === 'folder' || c === 'category');
                }

                const rowsToProcess = hasHeader ? data.slice(1) : data;
                const processedRows: ParsedCSVRow[] = [];
                const seenVideoIds = new Set<string>();
                let duplicates = 0;

                rowsToProcess.forEach((row, index) => {
                    const actualRowIndex = hasHeader ? index + 2 : index + 1; // 1-based index

                    // Safe access
                    const rawUrl = row[urlIndex]?.trim() || '';
                    if (!rawUrl) return; // Skip completely empty lines if Papa missed them

                    const title = titleIndex !== -1 ? row[titleIndex]?.trim() : undefined;
                    const folder = folderIndex !== -1 ? row[folderIndex]?.trim() : undefined;

                    const videoId = extractVideoId(rawUrl);

                    if (!videoId) {
                        processedRows.push({
                            rowIndex: actualRowIndex,
                            rawUrl,
                            title,
                            folder,
                            status: 'invalid',
                            error: 'Could not extract valid Video ID'
                        });
                        return;
                    }

                    if (seenVideoIds.has(videoId)) {
                        duplicates++;
                        processedRows.push({
                            rowIndex: actualRowIndex,
                            rawUrl,
                            videoId,
                            title,
                            folder,
                            status: 'duplicate',
                            error: 'Duplicate Video ID'
                        });
                    } else {
                        seenVideoIds.add(videoId);
                        processedRows.push({
                            rowIndex: actualRowIndex,
                            rawUrl,
                            videoId,
                            title,
                            folder,
                            status: 'valid'
                        });
                    }
                });

                resolve({
                    rawCount: rowsToProcess.length,
                    rows: processedRows,
                    duplicatesRemoved: duplicates,
                    validCount: processedRows.filter(r => r.status === 'valid').length,
                    invalidCount: processedRows.filter(r => r.status === 'invalid').length
                });
            },
            error: (err) => {
                reject(new Error(`Failed to parse CSV: ${err.message}`));
            }
        });
    });
}
