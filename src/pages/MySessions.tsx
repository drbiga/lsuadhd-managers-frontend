import { PageContainer, PageMainContent, PageTitle } from "@/components/Page";
import Sidebar from "../components/Sidebar";
import { SessionAttributeLabel, SessionAttributeText, SessionListItemView, SessionListView, SessionSeqnum, SessionStage, SessionStartButton } from "@/components/sessionExecution/Session";
import { useEffect, useState } from "react";
import sessionExecutionService, { Session } from "@/services/sessionExecution";
import { Role, useAuth } from "@/hooks/auth";
import { toast } from "react-toastify";

export default function MySessions() {
    const [sessionsDone, setSessionsDone] = useState<Session[]>([]);
    const [remainingSessions, setRemainingSessions] = useState<Session[]>([]);
    const { authState } = useAuth();

    useEffect(() => {
        (async () => {
            if (authState.session && authState.session.user.role === Role.STUDENT) {
                try {
                    const student = await sessionExecutionService.getStudent(authState.session?.user.username);
                    setSessionsDone(student.sessions_done);
                    const sessions = await sessionExecutionService.getRemainingSessionsForStudent(authState.session.user.username);
                    setRemainingSessions(sessions);
                } catch {
                    toast.error('Something went wrong while getting your sessions. Please contact the administrator')
                }
            }
        })()
    }, [authState]);

    return (
        <PageContainer>
            <Sidebar />
            <PageMainContent>
                <PageTitle>My Sessions</PageTitle>

                <SessionListView>
                    {sessionsDone.map(s => (
                        <SessionListItemView>
                            <p>
                                <SessionAttributeLabel>Sequence Number</SessionAttributeLabel>
                                <SessionAttributeText>{s.seqnum}</SessionAttributeText>
                            </p>
                            <p>
                                <SessionAttributeLabel>Stage</SessionAttributeLabel>
                                <SessionAttributeText>{s.stage.charAt(0).toUpperCase() + s.stage.slice(1)}</SessionAttributeText>
                            </p>
                        </SessionListItemView>
                    ))}
                    {remainingSessions.map(s => (
                        <SessionListItemView>
                            <p>
                                <SessionAttributeLabel>Sequence Number</SessionAttributeLabel>
                                <SessionAttributeText>{s.seqnum}</SessionAttributeText>
                            </p>
                            <p>
                                <SessionAttributeLabel>Stage</SessionAttributeLabel>
                                <SessionAttributeText>{s.stage.charAt(0).toUpperCase() + s.stage.slice(1)}</SessionAttributeText>
                            </p>
                            {s.seqnum === sessionsDone.length + 1 && (
                                <SessionStartButton onClick={() => alert('Starting new session')}>Start next session</SessionStartButton>
                            )}
                        </SessionListItemView>
                    ))}
                </SessionListView>
            </PageMainContent>
        </PageContainer>
    )
}