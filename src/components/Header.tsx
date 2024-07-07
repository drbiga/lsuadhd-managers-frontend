import { useAuth } from "@/hooks/auth";
import { Button } from "./Button";
import { DarkModeButton } from "./DarkModeButton";
import { BiChevronRight } from "react-icons/bi";
import styled from "styled-components";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";

import { studentService } from "@/services/student";
import { Session, SessionData, SessionPart, sessionService } from "@/services/session";
import { Field, Form, Formik } from "formik";


function presentText(sessionPart: string): string {
  const whitespace = sessionPart.replace('_', ' ').toLowerCase();
  const upper = whitespace.charAt(0).toUpperCase() + whitespace.slice(1);
  return upper;
}

function presentTime(time: number): string {
  return `Minutes: ${(Math.max(time / 60 - 1, 0)).toFixed(0)} Seconds: ${time % 60}`;
}


interface HeaderProps {
  nextSessionSeqNumber: number;
  sessionData: SessionData;
  setSurveyQueueLink: Dispatch<SetStateAction<string>>;
  setSessionData: Dispatch<SetStateAction<SessionData>>;
  setSession: Dispatch<SetStateAction<Session | null>>;
  setNextSessionSeqNumber: Dispatch<SetStateAction<number>>;
}



export default function Header({ nextSessionSeqNumber, sessionData, setSessionData, setSession, setSurveyQueueLink, setNextSessionSeqNumber }: HeaderProps) {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [hideSurveyQueueLinkForm, setHideSurveyQueueLinkForm] = useState(false);
  const [resumeSessionButtonVisible, setResumeSessionButtonVisible] = useState(false);
  const { authState, logout } = useAuth();


  useEffect(() => {
    // If the user has already done his/her first session, then we already
    // have the survey queue link.
    if (authState.session.student.name !== '' && nextSessionSeqNumber > 1) {
      async function execute() {
        const student = await studentService.getStudent(authState.session.student.name);
        setSurveyQueueLink(student.survey_queue_link);
      }

      execute();
    }
  }, [authState, nextSessionSeqNumber]);

  useEffect(() => {
    async function getNextSeqNumber() {
      const seqNumber = await studentService.getNextSessionSeqNumber(authState.session.student.name, authState.session.token);
      if (seqNumber.status === 'success') {
        setNextSessionSeqNumber(seqNumber.data);
      } else {
        alert(seqNumber.message);
      }
    }

    if (authState.session.student.name !== '') {
      getNextSeqNumber();
    }
  }, [authState]);

  const handleStartSession = useCallback(async () => {
    const response = await studentService.startNextSession(authState.session.student.name, authState.session.token);
    if (response.status === 'err') {
      alert(response.message);
    } else {
      await sessionService.listen(setSessionData);
      setSessionStarted(true);
      setSession(await sessionService.getSession(nextSessionSeqNumber));
    }
  }, [authState, nextSessionSeqNumber]);

  const handleResumeSession = useCallback(async () => {
    async function handle() {
      const response = await sessionService.resumeSession();
      if (response.status === 'err') {
        alert(response.message);
      } else {
        setResumeSessionButtonVisible(false);
      }
    }
    handle();
  }, [authState]);

  // Reminding the user to press the Submit button when the Read Comp part of the
  // session is ending.
  useEffect(() => {
    console.log(sessionData);
    if (sessionData.session_part === SessionPart.READ_COMP && sessionData.remaining_time <= 1) {
      setResumeSessionButtonVisible(true);
      alert('Your time for the reading comprehension has finished. Please submit the survey by pressing the Submit button at the bottom and then press the Proceed to homework button.')
    }
  }, [sessionData]);

  return (
    <div
      className="h-[10vh] flex justify-between px-8 items-center p-4 gap-3 bg-slate-600"
    >
      <div className="flex justify-start items-center gap-4">
        <img src="lsu-logo.svg" alt="LSU Logo" width="100px" />
        {/* <p className="text-white">&</p> */}
        <img src="rutgers-logo.svg" alt="Rutgers Logo" width="100px" />
        <img color="white" src="uzh-logo.svg" alt="" width="100px" />
      </div>

      <div className="flex flex-row justify-center items-center py-2 px-5 gap-5 text-white">
        <div className="flex flex-row items-start">
          <BiChevronRight className="text-purple-300" size={30} />
          <p><span className="text-purple-300">Welcome back:</span> {presentText(authState.session.student.name)}!</p>
        </div>
        <div className="flex flex-row items-start">
          <BiChevronRight className="text-purple-300" size={30} />
          <p><span className="text-purple-300">Next session:</span> session #{nextSessionSeqNumber}</p>
        </div>
        <div className="flex flex-row items-start">
          <BiChevronRight className="text-purple-300" size={30} />
          <p><span className="text-purple-300">Phase:</span> {presentText(sessionData.session_part)} </p>
        </div>
        <div className="flex flex-row items-start">
          <BiChevronRight className="text-purple-300" size={30} />
          <p><span className="text-purple-300">Remaining Time:</span> {presentTime(sessionData.remaining_time)}</p>
        </div>
        {!sessionStarted && (
          <p>
            <Button onClick={() => handleStartSession()}>Start Session</Button>
          </p>
        )}
        {sessionStarted && sessionData.session_part === SessionPart.READ_COMP && resumeSessionButtonVisible && (
          <p>
            <Button
              onClick={handleResumeSession}
            >
              Proceed to Homework
            </Button>
          </p>
        )}
        {(nextSessionSeqNumber === 1 && sessionStarted && !hideSurveyQueueLinkForm) && (
          <Formik
            initialValues={{
              surveyQueueLink: ''
            }}
            onSubmit={(values, actions) => {
              async function submit() {
                const response = await studentService.setStudentSurveyQueueLink(authState.session.student.name, values.surveyQueueLink);
                if (response.status === 'success') {
                  setHideSurveyQueueLinkForm(true);
                  setSurveyQueueLink(values.surveyQueueLink);
                } else {
                  alert('Something went wrong. Please contact mcost16@lsu.edu immediatelly');
                }
                actions.setSubmitting(false);
              }

              submit();
            }}
          >
            <Form>
              <Field id="surveyQueueLink" name="surveyQueueLink" placeholder="Survey Queue Link here..." />
              <button type="submit">Submit</button>
            </Form>
          </Formik>
        )}
      </div>

      <div className="flex gap-4">
        <DarkModeButton />
        <Button onClick={() => logout()}>Log out</Button>
      </div>
    </div>
  );
}