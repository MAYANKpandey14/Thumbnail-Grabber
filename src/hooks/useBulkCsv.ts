import { useState } from "react";
import { toast } from "sonner";
import { parseCsvFile } from "@/lib/csv/parseCsv";
import { extractVideoId } from "@/utils/extractVideoId";

export function useBulkCsv(onUrlsParsed: (urls: string[]) => void) {
    const [isProcessing, setIsProcessing] = useState(false);

    const processFile = async (file: File) => {
        setIsProcessing(true);
        if (file.type === "text/csv" || file.name.endsWith(".csv") || file.type === "application/vnd.ms-excel") {
            try {
                toast.info("Parsing CSV...");
                const result = await parseCsvFile(file);

                if (result.validCount > 0) {
                    const urls = result.rows
                        .filter(r => r.status === 'valid' && r.videoId)
                        .map(r => `https://www.youtube.com/watch?v=${r.videoId}`);

                    onUrlsParsed(urls);
                    toast.success(`Added ${result.validCount} URLs from CSV`);
                } else {
                    toast.warning("No valid YouTube URLs found in CSV");
                }
            } catch (err) {
                console.error(err);
                toast.error("Failed to parse CSV file");
            } finally {
                setIsProcessing(false);
            }
        } else {
            toast.error("Please select a valid .csv file");
            setIsProcessing(false);
        }
    };

    return { processFile, isProcessing };
}
