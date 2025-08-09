import { FailedSession } from '../services/studentService';

interface FailedSessionsListProps {
    failedSessions: FailedSession[];
    loading: boolean;
}

export function FailedSessionsList({ failedSessions, loading }: FailedSessionsListProps) {
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return <p>Loading failed sessions...</p>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-slate-400 dark:text-slate-500 opacity-70 text-2xl">
                    Failed Sessions ({failedSessions.length})
                </h2>
            </div>

            {failedSessions.length === 0 ? (
                <p className="text-slate-400 dark:text-slate-600">No failed sessions found.</p>
            ) : (
                <ul>
                    {failedSessions.map((session) => (
                        <li
                            className="mb-6 p-4 border border-slate-700 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors max-w-md"
                            key={`${session.student_name}-${session.session_seqnum}-${session.ts_detected}`}
                        >
                            <p className="mb-2"><span className="font-bold">Student:</span> {session.student_name}</p>
                            <p className="mb-2"><span className="font-bold">Session:</span> #{session.session_seqnum}</p>
                            <p className="mb-2"><span className="font-bold">Stage:</span> {session.original_stage}</p>
                            <p className="mb-2"><span className="font-bold">Failure Reason:</span> {session.failure_reason}</p>
                            <p className="mb-2"><span className="font-bold">Started:</span> {formatDateTime(session.ts_started)}</p>
                            <p><span className="font-bold">Detected:</span> {formatDateTime(session.ts_detected)}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
