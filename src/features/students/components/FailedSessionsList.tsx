import { FailedSession } from '../services/studentService';
import { LoadingScreen } from '@/components/common/LoadingScreen';

interface FailedSessionsListProps {
    failedSessions: FailedSession[];
    loading: boolean;
}

export function FailedSessionsList({ failedSessions, loading }: FailedSessionsListProps) {
    const formatDateTime = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return <LoadingScreen message="Loading failed sessions..." />;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-muted-foreground text-2xl font-medium">
                    Failed Sessions ({failedSessions.length})
                </h2>
            </div>

            {failedSessions.length === 0 ? (
                <p className="text-muted-foreground">No failed sessions found.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {failedSessions.map((session) => (
                        <div
                            className="p-6 border border-border rounded-xl bg-card hover:shadow-md transition-shadow"
                            key={`${session.student_name}-${session.session_seqnum}-${session.ts_detected}`}
                        >
                            <p className="mb-2 text-foreground"><span className="font-semibold">Student:</span> {session.student_name}</p>
                            <p className="mb-2 text-foreground"><span className="font-semibold">Session:</span> #{session.session_seqnum}</p>
                            <p className="mb-2 text-foreground"><span className="font-semibold">Stage:</span> {session.original_stage}</p>
                            <p className="mb-2 text-foreground"><span className="font-semibold">Failure Reason:</span> {session.failure_reason}</p>
                            <p className="mb-2 text-muted-foreground text-sm"><span className="font-medium">Started:</span> {formatDateTime(session.ts_started)}</p>
                            <p className="text-muted-foreground text-sm"><span className="font-medium">Detected:</span> {formatDateTime(session.ts_detected)}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
