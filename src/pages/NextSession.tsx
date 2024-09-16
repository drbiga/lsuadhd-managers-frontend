import { Button } from "@/components/Button";
import { PageContainer, PageMainContent, PageTitle } from "@/components/Page";
import { SessionItemComment, SessionItemSeqnum, SessionItemStage, SessionStartButton } from "@/components/sessionExecution/Session";
import { Walkthrough, WalkthroughInstructionsDescription, WalkthroughInstructionsTitle } from "@/components/sessionExecution/WalkthroughSection";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/auth";
import sessionExecutionService, { Session, SessionProgressData, Stage } from "@/services/sessionExecution";
import { useCallback, useEffect, useState } from "react";

enum HasNextSessionValue {
  LOADING = -1,
  NO = 0,
  YES = 1
}

export default function NextSession() {
  const [nextSession, setNextSession] = useState<Session | null>(null);
  const [hasNextSession, setHasNextSession] = useState<HasNextSessionValue>(HasNextSessionValue.LOADING);
  const [sessionHasStarted, setSessionHasStarted] = useState<boolean>(false);
  const [sessionProgressData, setSessionProgressData] = useState<SessionProgressData | null>(null);

  // State recovery and initialization code below (right above the return statement).

  const { authState } = useAuth();

  const getNextSession = useCallback(async () => {
    if (authState.session) {
      const remainingSessions = await sessionExecutionService.getRemainingSessionsForStudent(authState.session.user.username);
      if (remainingSessions.length > 0) {
        setNextSession(remainingSessions[0]);
        setHasNextSession(HasNextSessionValue.YES);
      } else {
        setHasNextSession(HasNextSessionValue.NO);
      }
    }
  }, [authState, setNextSession, setHasNextSession])

  useEffect(() => {
    getNextSession()
  }, [getNextSession]);

  const handleSessionProgressDataUpdate = useCallback((sessionProgressUpdate: SessionProgressData) => {
    setSessionProgressData(sessionProgressUpdate)
  }, [setSessionProgressData]);

  const handleStartSession = useCallback(async () => {
    if (authState.session) {
      await sessionExecutionService.startSessionForStudent(authState.session.user.username, handleSessionProgressDataUpdate);
      setSessionHasStarted(true);
    }
  }, [authState, nextSession]);

  const handleStartAnotherSession = useCallback(async () => {
    await getNextSession();
    handleStartSession();
  }, [getNextSession]);

  // State recovery
  // In case the user has to go outside the next session page and returns, they need
  // to be able to come back to the point where they left.
  useEffect(() => {
    (async () => {
      if (authState.session) {
        const student = await sessionExecutionService.getStudent(authState.session.user.username);
        if (student.active_session !== null) {
          // If the student already has an active session, that means that they have started a session
          // and have not finished yet. So, we need to restore this session.
          setSessionHasStarted(true);
          setNextSession(student.active_session);
          sessionExecutionService.setUpdateCallback(student.name, handleSessionProgressDataUpdate);
        }
      }
    })();
  }, [authState, handleSessionProgressDataUpdate]);

  useEffect(() => {
    (async () => {
      if (authState.session) {
        const progress = await sessionExecutionService.getSessionProgress(authState.session?.user.username)
        console.log(progress);
        setSessionProgressData(progress);
      }
    })()
  }, [authState, setSessionProgressData]);

  useEffect(() => { }, [sessionHasStarted]);

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <header className="flex justify-between pr-16">
          <PageTitle>Next Session</PageTitle>

          <div className="ml-8 flex items-center justify-center gap-4">
            <SessionItemSeqnum>{nextSession?.seqnum}</SessionItemSeqnum>
            <SessionItemStage>{sessionProgressData?.stage}</SessionItemStage>
            {sessionProgressData && (
              <>
                <SessionItemComment>
                  Remaining time: {presentRemainingTime(sessionProgressData.remainingTimeSeconds)}
                </SessionItemComment>
                {
                  sessionProgressData.stage === Stage.READCOMP && sessionProgressData.remainingTimeSeconds <= 0 &&
                  <Button onClick={() => {
                    if (authState.session)
                      sessionExecutionService.startHomeworkForStudent(authState.session?.user.username)
                  }}>
                    Proceed to homework
                  </Button>
                }
              </>
            )}
          </div>
        </header>

        {(sessionHasStarted && sessionProgressData) && (
          <>
            {/* Would be better, but for now, I think I should just do it the ugly way */}
            {/* <WalkthroughSection>
              <Walkthrough>
                <WalkthroughInstructionsTitle></WalkthroughInstructionsTitle>
              </Walkthrough>
            </WalkthroughSection> */}
            {sessionProgressData.stage === Stage.READCOMP && (
              <>
                {sessionProgressData.remainingTimeSeconds > 5 && (
                  // If readcomp is starting
                  <Walkthrough>
                    <WalkthroughInstructionsTitle>Reading and Comprehension</WalkthroughInstructionsTitle>
                    <WalkthroughInstructionsDescription>
                      <p>
                        In the following 10 minutes, you will read some text passages and
                        answer a few questions about them
                      </p>
                    </WalkthroughInstructionsDescription>
                  </Walkthrough>
                )}
                {sessionProgressData.remainingTimeSeconds <= 5 && (
                  // If readcomp is over
                  <Walkthrough >
                    <WalkthroughInstructionsTitle>
                      Time's up!
                    </WalkthroughInstructionsTitle>
                    <WalkthroughInstructionsDescription>
                      <p>Your time for this reading-comprehension section is over.</p>
                      <table>
                        <tr>
                          <td className="w-[50%]">
                            <p>
                              <strong>Scroll</strong> all the way down on the survey and <strong>click</strong> the submit button&nbsp;
                              to <strong>save</strong> your answers.
                            </p>
                          </td>
                          <td className="p-2">
                            <img src="submit-button.png" alt="" />
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <p>
                              <strong>After</strong> you submit your answers, please <strong>click</strong> the "Proceed to homework"
                              button on the <strong>top-right corner</strong>.
                            </p>
                          </td>
                          <td>
                            <img src="proceed-to-homework.png" alt="" />
                          </td>
                        </tr>
                      </table>
                    </WalkthroughInstructionsDescription>
                  </Walkthrough>
                )}
                <iframe src={nextSession?.start_link} className="h-full w-full"></iframe>
              </>
            )}
            {sessionProgressData.stage === Stage.SURVEY && (
              <>
                <Walkthrough>
                  <WalkthroughInstructionsTitle>Survey</WalkthroughInstructionsTitle>
                  <WalkthroughInstructionsDescription>
                    <p>Please answer the following questions</p>
                  </WalkthroughInstructionsDescription>
                </Walkthrough>
                <iframe src={nextSession?.start_link} className="h-full w-full"></iframe>
              </>
            )}
            {sessionProgressData.stage === Stage.HOMEWORK && (
              <>
                {
                  sessionProgressData.remainingTimeSeconds > 5 && (
                    // Homework
                    <>
                      <Walkthrough>
                        <WalkthroughInstructionsTitle>Homework</WalkthroughInstructionsTitle>
                        <WalkthroughInstructionsDescription>
                          <p>Do whatever homework you have.</p>
                          <p>
                            Depending you the group you were assigned to, you may receive
                            feedback through a stop light to indicate how well you are
                            performing
                          </p>
                        </WalkthroughInstructionsDescription>
                      </Walkthrough>
                      <div className="h-full w-full flex items-center justify-center">
                        <div className="flex flex-col items-center justify-center gap-4">
                          <SessionItemSeqnum>{nextSession?.seqnum}</SessionItemSeqnum>
                          <SessionItemStage>{sessionProgressData?.stage}</SessionItemStage>
                          {sessionProgressData && (
                            <SessionItemComment>
                              Remaining time: {presentRemainingTime(sessionProgressData.remainingTimeSeconds)}
                            </SessionItemComment>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                {
                  sessionProgressData.remainingTimeSeconds <= 5 && (
                    <>
                      <Walkthrough>
                        <WalkthroughInstructionsTitle>
                          Your homework time is over.
                        </WalkthroughInstructionsTitle>
                        <WalkthroughInstructionsDescription>
                          <p>Now, you're going to do a post-session survey</p>
                          <p>You must answer all of the questions in order to be able to submit it.</p>
                          <p>When you have answered all the questions, please press the "Submit" button at the bottom of the page</p>
                        </WalkthroughInstructionsDescription>
                      </Walkthrough>
                    </>
                  )}
              </>
            )}
            {sessionProgressData.stage === Stage.FINISHED && (
              <div className="h-full w-full flex items-center justify-center">
                <h2 className="text-lg">You have finished your session</h2>
                <p>Please refer back to the instructions sheet.</p>
                <p>At this point, you should <strong>turn off the laptop and the headset</strong></p>
              </div>
            )}
          </>
        )}

        {(!sessionHasStarted) && (
          <>
            {hasNextSession ? (
              <div className="h-full w-full flex items-center justify-center">
                <div className="flex flex-col gap-8 justify-center items-center translate-x-[-100px] p-16 border-[2px] border-slate-700 rounded-lg">
                  <SessionItemSeqnum>{nextSession?.seqnum}</SessionItemSeqnum>
                  {nextSession && (
                    <>
                      {nextSession.no_equipment === true ? (
                        <>
                          <SessionItemComment>
                            <span className="font-bold text-slate-200 text-xl">Attention!</span> You are <span className="font-bold text-slate-200 text-xl">not supposed to use the headset</span> during this session.
                          </SessionItemComment>
                          <SessionItemComment>
                            If you are currently wearing the headset, then please take it off to continue your session properly.
                          </SessionItemComment>
                          <SessionItemComment>Your sessions with the headset begin at session #3</SessionItemComment>
                        </>
                      ) : (
                        <>
                          <SessionItemComment>
                            {nextSession?.is_passthrough ? "This session is going to be passthrough" : "This session is going to be VR"}
                          </SessionItemComment>
                          <SessionItemComment>
                            {nextSession?.has_feedback ? "You are going to receive some feedback this session" : "There will be no feedbacks for this session"}
                          </SessionItemComment>
                        </>
                      )}
                    </>
                  )}
                  <SessionItemComment>
                    Are you ready to do this?
                  </SessionItemComment>
                  <SessionStartButton onClick={() => handleStartSession()}>Start!</SessionStartButton>
                </div>
              </div>
            ) : (
              <div>
                <p>It appears that you do not have any sessions left. Well done! You've done them all!!!</p>
              </div>
            )}
          </>
        )}
      </PageMainContent>
    </PageContainer >
  );
}

function presentRemainingTime(remainingTimeSeconds: number | null): string {
  if (remainingTimeSeconds !== null) {
    return `${presentRemainingTimeMinutes(remainingTimeSeconds)}:${presentRemainingTimeSeconds(remainingTimeSeconds)}`
  } else {
    return ""
  }
}

function presentRemainingTimeMinutes(timeSeconds: number): string {
  return String(Math.max(Math.floor(timeSeconds / 60), 0)).padStart(2, '0');
}

function presentRemainingTimeSeconds(timeSeconds: number): string {
  if (timeSeconds > -1) {
    return String(timeSeconds % 60).padStart(2, '0');
  } else {
    return '00';
  }
}
