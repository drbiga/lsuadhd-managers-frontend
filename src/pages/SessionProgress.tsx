import { PageContainer, PageMainContent, PageTitle } from "@/components/Page";
import Sidebar from "../components/Sidebar";
import { SessionItemComment, SessionItemNumFeedbacks, SessionItemPctTimeDistracted, SessionItemPctTimeFocused, SessionItemPctTimeNormal, SessionItemSeqnum, SessionItemStage, SessionItemView, SessionListTitle, SessionListView, SessionStartButton } from "@/components/sessionExecution/Session";
import { useEffect, useState } from "react";
import sessionExecutionService, { Session } from "@/services/sessionExecution";
import { Role, useAuth } from "@/hooks/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function SessionProgress() {
  const [sessionsDone, setSessionsDone] = useState<Session[]>([]);
  const [remainingSessions, setRemainingSessions] = useState<Session[]>([]);
  const { authState } = useAuth();

  const navigate = useNavigate();

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
        <PageTitle>Session Progress</PageTitle>

        <div className="flex flex-col gap-8">
          {sessionsDone.length === 0 ? (
            <SessionListTitle className="text-md text-slate-400 dark:text-slate-600">
              You have not started your sessions yet. Please proceed and start the first one.
            </SessionListTitle>
          ) : (
            <>
              <SessionListTitle>Sessions already done</SessionListTitle>
              <SessionListView>
                {sessionsDone.map(s => (
                  <SessionItemView>
                    <SessionItemSeqnum>{s.seqnum}</SessionItemSeqnum>
                    <p>
                      <span className="text-slate-600 dark:text-slate-400 border-b-[1px]">Overview</span>
                    </p>
                    <SessionItemStage>{s.stage.charAt(0).toUpperCase() + s.stage.slice(1)}</SessionItemStage>
                    <SessionItemNumFeedbacks>{s.feedbacks.length}</SessionItemNumFeedbacks>
                    <SessionItemPctTimeFocused>{presentPercentage(0.5)}</SessionItemPctTimeFocused>
                    <SessionItemPctTimeNormal>{presentPercentage(0)}</SessionItemPctTimeNormal>
                    <SessionItemPctTimeDistracted>{presentPercentage(0.5)}</SessionItemPctTimeDistracted>
                  </SessionItemView>
                ))}
              </SessionListView>
            </>
          )}
          {remainingSessions.length === 0 ? (
            <SessionListTitle>You don't have any remaining sessions left to do. Congratulations, you've done it all!!</SessionListTitle>
          ) : (
            <>
              <SessionListTitle>Remaining sessions</SessionListTitle>
              <SessionListView>
                {remainingSessions.map(s => (
                  <SessionItemView className="relative">
                    <SessionItemSeqnum>{s.seqnum}</SessionItemSeqnum>
                    <SessionItemComment>Upcoming...</SessionItemComment>
                    <p className="absolute top-4 right-4">
                      {s.seqnum === sessionsDone.length + 1 && (
                        <SessionStartButton onClick={() => navigate('/')}>Start next session</SessionStartButton>
                      )}
                    </p>
                  </SessionItemView>
                ))}
              </SessionListView>
            </>
          )}
        </div>
      </PageMainContent>
    </PageContainer>
  )
}

function presentPercentage(pct: number): string {
  return pct > 0 ? Math.round(pct * 100).toString() + '%' : '-';
}
