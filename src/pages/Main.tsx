import { useEffect, useState } from "react";
import { Session, SessionData, SessionPart } from "../services/session";
import ReadComp from "../components/ReadComp";
import Homework from "../components/Homework";
import Survey from "../components/Survey";
import Header from "../components/Header";

import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "@/components/Sidebar";


function Main() {
  const [nextSessionSeqNumber, setNextSessionSeqNumber] = useState(0);
  const [session, setSession] = useState<Session | null>(null);
  const [sessionData, setSessionData] = useState<SessionData>({ remaining_time: 0, session_part: "WAITING_START" });
  const [surveyQueueLink, setSurveyQueueLink] = useState<string>('');

  // Session Control
  let sessionComponent;
  switch (sessionData.session_part) {
    case SessionPart.WAITING_START: {
      sessionComponent = (<></>);
      break;
    }
    case SessionPart.READ_COMP: {
      if (session) {
        sessionComponent = (
          <>
            <ReadComp link={nextSessionSeqNumber === 1 ? session.read_comp_link : surveyQueueLink} />
          </>
        );
      }
      break;
    }
    case SessionPart.HOMEWORK: {
      sessionComponent = (<Homework />);
      break;
    }
    case SessionPart.SURVEY: {
      if (session) {
        sessionComponent = (<Survey link={surveyQueueLink} />);
      }
      break;
    }
    case SessionPart.FINISHED: {
      sessionComponent = (
        <div
          style={{ minHeight: '100vh' }}
          className="flex flex-column items-center justify-center"
        >
          <h1>We are done</h1>
          <p>Thank you for participating in the program and for concluding one more session</p>
          <p>Way to go!</p>
        </div>
      )
      break;
    }
    default: {
      sessionComponent = (<h1>Something weird is happenning...</h1>)
    }
  }

  return (
    <div>
      <Header
        nextSessionSeqNumber={nextSessionSeqNumber}
        sessionData={sessionData}
        setNextSessionSeqNumber={setNextSessionSeqNumber}
        setSession={setSession}
        setSessionData={setSessionData}
        setSurveyQueueLink={setSurveyQueueLink}
      />
      <div className="flex h-[90vh]">
        <Sidebar />
        <div className="">
          <h1>Session</h1>
          {sessionComponent}
        </div>
      </div>
    </div>
  )
}

export default Main;
