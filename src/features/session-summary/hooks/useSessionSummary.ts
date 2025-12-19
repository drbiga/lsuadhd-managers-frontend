import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import sessionSummaryService, {
    SessionSummaryStats,
    SessionRecord,
    ProblematicSessionRecord,
    WeeklyFailureData,
} from "../services/sessionSummaryService";

export function useSessionSummary() {
    const [stats, setStats] = useState<SessionSummaryStats | null>(null);
    const [records, setRecords] = useState<SessionRecord[]>([]);
    const [problematicSessions, setProblematicSessions] = useState<ProblematicSessionRecord[]>([]);
    const [weeklyFailures, setWeeklyFailures] = useState<WeeklyFailureData[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSessionSummary = async () => {
        try {
            setLoading(true);
            const [statsData, recordsData, problematicData, weeklyData] = await Promise.all([
                sessionSummaryService.getStats(),
                sessionSummaryService.getRecords(),
                sessionSummaryService.getProblematicSessions(),
                sessionSummaryService.getWeeklyFailures(),
            ]);
            setStats(statsData);
            setRecords(recordsData);
            setProblematicSessions(problematicData);
            setWeeklyFailures(weeklyData);
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

    return { stats, records, problematicSessions, weeklyFailures, loading, refresh: fetchSessionSummary };
}
