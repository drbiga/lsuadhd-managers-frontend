import { createContext, Dispatch, PropsWithChildren, SetStateAction, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import studentService, { Student, StudentWithSessionData } from "../services/studentService";
import { useAuth } from "@/hooks/auth";

export type SessionProgressState = {
  student: StudentWithSessionData | null,
  setStudent: Dispatch<SetStateAction<StudentWithSessionData | null>>;
  allStudents: Student[],
  handleStudentChange: (selectedStudentName: string | null) => Promise<void>,
  descriptions: any[],
  loading: boolean,
  studentsLoading: boolean,
  studentDataLoading: boolean,
  selectedSession: number | null,
  fetchImageDescriptions: (studentName: string, sessionSeqnum: number, loadMore?: boolean) => Promise<void>
  handleDeleteSession: (
    sessionNum: number,
  ) => Promise<void>
  isLocked: boolean,
  handleToggleLock: () => Promise<void>
}

const SessionProgressContext = createContext<SessionProgressState>({} as SessionProgressState);

export function SessionProgressProvider({ children }: PropsWithChildren) {
  const { authState } = useAuth();
  const [student, setStudent] = useState<StudentWithSessionData | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [descriptions, setImageDescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentDataLoading, setStudentDataLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
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
      setIsLocked(false);
      return;
    }

    setStudentDataLoading(true);
    try {
      const [studentData, locked] = await Promise.all([
        studentService.getStudentWithSessionData(selectedStudentName),
        studentService.isUserLocked(selectedStudentName)
      ]);
      setStudent(studentData);
      setIsLocked(locked);
    } catch (err) {
      console.error('Error fetching student data:', err);
      toast.error("Failed to fetch student session data");
      setStudent(null);
      setIsLocked(false);
    } finally {
      setStudentDataLoading(false);
    }
  }, []);

  const fetchImageDescriptions = useCallback(async (studentName: string, sessionSeqnum: number, loadMore = false) => {
    setLoading(true);
    if (!loadMore) {
      setSelectedSession(sessionSeqnum);
      setImageDescriptions([]);
    }

    try {
      const offset = loadMore ? descriptions.length : 0;
      const data = await studentService.getImageDescriptions(studentName, sessionSeqnum, offset, 10);
      setImageDescriptions(prev => loadMore ? [...prev, ...data] : data);
    } catch (error) {
      console.error('Error:', error);
      if (!loadMore) setImageDescriptions([]);
    }
    setLoading(false);
  }, [descriptions]);

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
        console.log('==============================================')
        console.log('[ handleDeleteSession ] Updating student object')
        setStudent(previousStudent => {
          if (previousStudent === null) {
            toast.error('You need to choose a student before deleting. This should not happen?!')
            return previousStudent;
          }
          return {
            ...previousStudent,
            sessions: previousStudent?.sessions.filter(s => s.seqnum !== sessionNum)
          }
        });
        console.log('==============================================')
        toast.success(`Deleted session ${sessionNum} for student ${student.name}`);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to lock user");
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

  // return {
  //   student,
  //   allStudents,
  //   handleStudentChange,
  //   descriptions,
  //   loading,
  //   studentsLoading,
  //   studentDataLoading,
  //   selectedSession,
  //   fetchImageDescriptions,
  //   handleDeleteSession
  // };
  return (
    <SessionProgressContext.Provider value={{
      student,
      setStudent,
      allStudents,
      handleStudentChange,
      descriptions,
      loading,
      studentsLoading,
      studentDataLoading,
      selectedSession,
      fetchImageDescriptions,
      handleDeleteSession,
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