import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import studentService, { StudentWithSessionData } from "../services/studentService";

export function useSessionProgress() {
  const [student, setStudent] = useState<StudentWithSessionData | null>(null);
  const [allStudents, setAllStudents] = useState<StudentWithSessionData[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await studentService.getAllStudentsWithSessionData();
        setAllStudents(response);
        setStudent(response[0] || null);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch student data");
      }
    };

    fetchStudents();
  }, []);

  const handleStudentChange = useCallback((selectedStudent: StudentWithSessionData) => {
    setStudent(selectedStudent);
  }, []);

  return {
    student,
    allStudents,
    handleStudentChange,
  };
}