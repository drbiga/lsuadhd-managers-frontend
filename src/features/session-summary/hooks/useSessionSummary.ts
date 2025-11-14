import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import sessionSummaryService, {
    SessionSummaryStats,
    SessionRecord,
    ProblematicSessionRecord,
} from "../services/sessionSummaryService";

export function useSessionSummary() {
    const [stats, setStats] = useState<SessionSummaryStats | null>(null);
    const [records, setRecords] = useState<SessionRecord[]>([]);
    const [problematicSessions, setProblematicSessions] = useState<ProblematicSessionRecord[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSessionSummary = async () => {
        try {
            setLoading(true);
            const [statsData, recordsData, problematicData] = await Promise.all([
                sessionSummaryService.getStats(),
                sessionSummaryService.getRecords(),
                sessionSummaryService.getProblematicSessions(),
            ]);
            setStats(statsData);
            setRecords(recordsData);
            setProblematicSessions(problematicData);
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

    return { stats, records, problematicSessions, loading };
}
