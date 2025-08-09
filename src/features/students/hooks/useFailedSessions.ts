import { useEffect, useState } from 'react';
import { toast } from "react-toastify";
import studentsService, { FailedSession } from '../services/studentService';

export function useFailedSessions() {
    const [failedSessions, setFailedSessions] = useState<FailedSession[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFailedSessions = async () => {
        try {
            setLoading(true);
            const sessions = await studentsService.getAllFailedSessions();
            setFailedSessions(sessions);
        } catch (err) {
            toast.error('Failed to fetch failed sessions');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFailedSessions();
    }, []);

    return {
        failedSessions,
        loading,
    };
}
