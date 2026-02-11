import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import sessionSummaryService, {
    SessionSummaryStats,
    SessionRecord,
    DetailedSessionRecord,
    WeeklyFailureData,
} from "../services/sessionSummaryService";

export function useSessionSummary() {
    const [stats, setStats] = useState<SessionSummaryStats | null>(null);
    const [records, setRecords] = useState<SessionRecord[]>([]);
    const [detailedSessions, setDetailedSessions] = useState<DetailedSessionRecord[]>([]);
    const [weeklyFailures, setWeeklyFailures] = useState<WeeklyFailureData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSessionSummary = async () => {
        try {
            setLoading(true);

            const [statsData, recordsData, detailedData] = await Promise.all([
                sessionSummaryService.getStats(),
                sessionSummaryService.getRecords(),
                sessionSummaryService.getDetailedSessions(),
            ]);
            setStats(statsData);
            setRecords(recordsData);
            setDetailedSessions(detailedData);
            try {
                const weeklyData = await sessionSummaryService.getWeeklyFailures();
                setWeeklyFailures(weeklyData);
            } catch (weeklyError) {
                console.error('Error fetching weekly failures:', weeklyError);
                setWeeklyFailures([]);
            }
        } catch (error) {
            console.error('Error fetching session summary:', error);
            toast.error("Failed to fetch session summary");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSessionSummary();
    }, []);

    return { stats, records, detailedSessions, weeklyFailures, loading, refresh: fetchSessionSummary };
}
