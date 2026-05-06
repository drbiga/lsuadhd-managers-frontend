import { createContext, Dispatch, PropsWithChildren, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import studentService, { Student, StudentWithSessionData, SessionProgress } from "../services/studentService";
import { useAuth } from "@/hooks/auth";

export type SessionProgressState = {
  student: StudentWithSessionData | null,
  setStudent: Dispatch<SetStateAction<StudentWithSessionData | null>>;
  allStudents: Student[],
  handleStudentChange: (selectedStudentName: string | null) => Promise<void>,
  sessionProgress: SessionProgress[],
  studentsLoading: boolean,
  studentDataLoading: boolean,
  handleDeleteSession: (
    sessionNum: number,
  ) => Promise<void>
  handleStopSession: (sessionNum: number) => Promise<void>
  handleCalculateAnalytics: (sessionNum: number) => Promise<void>
  isLocked: boolean,
  handleToggleLock: () => Promise<void>
}

const SessionProgressContext = createContext<SessionProgressState>({} as SessionProgressState);

export function SessionProgressProvider({ children }: PropsWithChildren) {
  const { authState } = useAuth();
  const [student, setStudent] = useState<StudentWithSessionData | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [sessionProgress, setSessionProgress] = useState<SessionProgress[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentDataLoading, setStudentDataLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (!authState.isLoggedIn) {
      setStudentsLoading(false);
      return;
    }

    (async () => {
      setStudentsLoading(true);
      try {
        const response = await studentService.getAllStudents();
        setAllStudents(response);
      } catch (err) {
        console.error('Error fetching students:', err);
        toast.error("Failed to fetch student data");
      } finally {
        setStudentsLoading(false);
      }
    })();
  }, [authState.isLoggedIn]);

  const handleStudentChange = useCallback(async (selectedStudentName: string | null) => {
    if (!selectedStudentName) {
      setStudent(null);
      setSessionProgress([]);
      setIsLocked(false);
      return;
    }

    setStudentDataLoading(true);
    try {
      const [studentData, locked, progress] = await Promise.all([
        studentService.getStudentWithSessionData(selectedStudentName),
        studentService.isUserLocked(selectedStudentName),
        studentService.getSessionProgress(selectedStudentName)
      ]);
      setStudent(studentData);
      setIsLocked(locked);
      setSessionProgress(progress);
    } catch (err) {
      console.error('Error fetching student data:', err);
      toast.error("Failed to fetch student session data");
      setStudent(null);
      setSessionProgress([]);
      setIsLocked(false);
    } finally {
      setStudentDataLoading(false);
    }
  }, []);

  const handleDeleteSession = useCallback(
    async (
      sessionNum: number,
    ) => {
      if (student === null) {
        toast.error('You need to choose a student before deleting. This should not happen?!')
        return;
      }
      try {
        await studentService.deleteSession(student.name, sessionNum);
        setStudent(previousStudent => {
          if (previousStudent === null) {
            return previousStudent;
          }
          return {
            ...previousStudent,
            sessions: previousStudent?.sessions.filter(s => s.seqnum !== sessionNum)
          }
        });
        setSessionProgress(previous => previous.filter(p => p.session_num !== sessionNum));
        toast.success(`Deleted session ${sessionNum} for student ${student.name}`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to lock user");
      }
    }, [student]);

  const handleStopSession = useCallback(async (sessionNum: number) => {
    if (student === null) {
      toast.error('You need to choose a student before stopping a session. This should not happen!')
      return;
    }

    try {
      await studentService.forceCloseSession(student.name);
      const [updatedStudent, updatedProgress] = await Promise.all([
        studentService.getStudentWithSessionData(student.name),
        studentService.getSessionProgress(student.name)
      ]);
      setStudent(updatedStudent);
      setSessionProgress(updatedProgress);
      toast.success(`Stopped session ${sessionNum} for student ${student.name}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to stop session');
    }
  }, [student]);

  const handleCalculateAnalytics = useCallback(async (sessionNum: number) => {
    if (student === null) {
      toast.error('You need to choose a student before calculating analytics. This should not happen!')
      return;
    }

    try {
      await studentService.getAnalytics(student.name, sessionNum);
      const updatedProgress = await studentService.getSessionProgress(student.name);
      setSessionProgress(updatedProgress);
      toast.success(`Calculated analytics for session ${sessionNum}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to calculate analytics');
    }
  }, [student]);

  const handleToggleLock = useCallback(async () => {
    if (!student) return;

    try {
      if (isLocked) {
        await studentService.unlockUser(student.name);
        setIsLocked(false);
        toast.success(`Unlocked ${student.name}`);
      } else {
        await studentService.lockUser(student.name);
        setIsLocked(true);
        toast.success(`Locked ${student.name}`);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to toggle lock");
    }
  }, [student, isLocked]);

  return (
    <SessionProgressContext.Provider value={{
      student,
      setStudent,
      allStudents,
      handleStudentChange,
      sessionProgress,
      studentsLoading,
      studentDataLoading,
      handleDeleteSession,
      handleStopSession,
      handleCalculateAnalytics,
      isLocked,
      handleToggleLock
    }}>
      {children}
    </SessionProgressContext.Provider>
  )
}


export function useSessionProgress() {
  const context = useContext(SessionProgressContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}