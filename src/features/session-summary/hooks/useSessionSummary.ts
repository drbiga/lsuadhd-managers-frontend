import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import sessionSummaryService, {
    SessionSummaryStats,
    SessionRecord,
    DetailedSessionRecord,
    WeeklyFailureData,
    SessionExclusion,
} from "../services/sessionSummaryService";

export function useSessionSummary() {
    const [stats, setStats] = useState<SessionSummaryStats | null>(null);
    const [records, setRecords] = useState<SessionRecord[]>([]);
    const [detailedSessions, setDetailedSessions] = useState<DetailedSessionRecord[]>([]);
    const [weeklyFailures, setWeeklyFailures] = useState<WeeklyFailureData[]>([]);
    const [loading, setLoading] = useState(true);
    const [exclusions, setExclusions] = useState<SessionExclusion[]>([]);

    const fetchSessionSummary = useCallback(async (currentExclusions: SessionExclusion[]) => {
        try {
            setLoading(true);

            const [statsData, recordsData, detailedData] = await Promise.all([
                sessionSummaryService.getStats(currentExclusions),
                sessionSummaryService.getRecords(currentExclusions),
                sessionSummaryService.getDetailedSessions(currentExclusions),
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
    }, []);

    useEffect(() => {
        fetchSessionSummary(exclusions);
    }, [exclusions, fetchSessionSummary]);

    const handleExclusionsChange = useCallback((newExclusions: SessionExclusion[]) => {
        setExclusions(newExclusions);
    }, []);

    const refresh = useCallback(() => {
        fetchSessionSummary(exclusions);
    }, [exclusions, fetchSessionSummary]);

    return {
        stats,
        records,
        detailedSessions,
        weeklyFailures,
        loading,
        refresh,
        exclusions,
        setExclusions: handleExclusionsChange,
    };
}
