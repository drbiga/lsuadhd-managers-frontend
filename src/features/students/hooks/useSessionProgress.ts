import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import studentService, { Student, StudentWithSessionData } from "../services/studentService";
import { useAuth } from "@/hooks/auth";

export function useSessionProgress() {
  const { authState } = useAuth();
  const [student, setStudent] = useState<StudentWithSessionData | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [descriptions, setImageDescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [studentDataLoading, setStudentDataLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);

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
      return;
    }

    setStudentDataLoading(true);
    try {
      const studentData = await studentService.getStudentWithSessionData(selectedStudentName);
      setStudent(studentData);
    } catch (err) {
      console.error('Error fetching student data:', err);
      toast.error("Failed to fetch student session data");
      setStudent(null);
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

  return {
    student,
    allStudents,
    handleStudentChange,
    descriptions,
    loading,
    studentsLoading,
    studentDataLoading,
    selectedSession,
    fetchImageDescriptions,
  };
}