import { PageContainer, PageMainContent, PageTitle } from "@/components/Page";
import Sidebar from "../components/Sidebar";
import { SessionItemComment, SessionItemSeqnum, SessionItemStage, SessionItemView, SessionListView, SessionStartButton } from "@/components/sessionExecution/Session";
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

        <div className="flex flex-col gap-8">
          <h2 className="text-xl text-slate-800 dark:text-slate-200 opacity-50">Sessions already done</h2>
          <SessionListView>
            {sessionsDone.map(s => (
              <SessionItemView>
                <SessionItemSeqnum>{s.seqnum}</SessionItemSeqnum>
                <SessionItemStage>{s.stage.charAt(0).toUpperCase() + s.stage.slice(1)}</SessionItemStage>
              </SessionItemView>
            ))}
          </SessionListView>
          <h2 className="text-xl text-slate-800 dark:text-slate-200 opacity-50">Remaining sessions</h2>
          <SessionListView>
            {remainingSessions.map(s => (
              <SessionItemView className="relative">
                <SessionItemSeqnum>{s.seqnum}</SessionItemSeqnum>
                <SessionItemComment>Upcoming...</SessionItemComment>
                <p className="absolute top-4 right-4">
                  {s.seqnum === sessionsDone.length + 1 && (
                    <SessionStartButton onClick={() => alert('Starting new session')}>Start next session</SessionStartButton>
                  )}
                </p>
              </SessionItemView>
            ))}
          </SessionListView>
        </div>
      </PageMainContent>
    </PageContainer>
  )
}