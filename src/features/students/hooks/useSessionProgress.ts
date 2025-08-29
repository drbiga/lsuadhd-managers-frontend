import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import studentService, { StudentWithSessionData } from "../services/studentService";

export function useSessionProgress() {
  const [student, setStudent] = useState<StudentWithSessionData | null>(null);
  const [allStudents, setAllStudents] = useState<StudentWithSessionData[]>([]);
  const [descriptions, setImageDescriptions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const response = await studentService.getAllStudentsWithSessionData();
        setAllStudents(response);
        setStudent(response[0]);
      } catch (err) {
        console.error('Error fetching students:', err);
        toast.error("Failed to fetch student data");
      }
    })();
  }, []);

  const handleStudentChange = useCallback((selectedStudent: StudentWithSessionData) => {
    setStudent(selectedStudent);
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
    selectedSession,
    fetchImageDescriptions,
  };
}