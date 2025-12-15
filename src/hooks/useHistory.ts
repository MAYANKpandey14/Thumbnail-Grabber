import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { UserDownload } from "@/types";
import { useAuth } from "./useAuth";
import { subHours, subDays, subWeeks, subMonths, startOfDay } from "date-fns";
import { toast } from "sonner";

export type HistoryFilter = 'hour' | 'day' | 'week' | 'month' | 'all';

export function useHistory(filter: HistoryFilter = 'day') {
    const { user } = useAuth();
    const [history, setHistory] = useState<UserDownload[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) return;

        const fetchHistory = async () => {
            setLoading(true);
            try {
                let query = supabase
                    .from('user_downloads')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });

                const now = new Date();
                let startTime: Date | null = null;

                switch (filter) {
                    case 'hour':
                        startTime = subHours(now, 1);
                        break;
                    case 'day':
                        // "Last 24h" or "Today" - prompt asked for consistent choice.
                        // I'll pick "Today" (since midnight) per typical "Today" semantics,
                        // OR "Last 24h". "Last 24h" is clearer for debugging often.
                        // But user said "Today (last 24h or calendar day)".
                        // "Calendar day" is clearer for grouping.
                        startTime = startOfDay(now);
                        break;
                    case 'week':
                        startTime = subWeeks(now, 1);
                        break;
                    case 'month':
                        startTime = subMonths(now, 1);
                        break;
                    case 'all':
                    default:
                        startTime = null;
                        break;
                }

                if (startTime) {
                    query = query.gte('created_at', startTime.toISOString());
                }

                const { data, error } = await query;

                if (error) throw error;
                setHistory(data || []);
            } catch (err: any) {
                console.error("Error fetching history:", err);
                toast.error("Failed to load history");
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [user, filter]);

    return { history, loading };
}
