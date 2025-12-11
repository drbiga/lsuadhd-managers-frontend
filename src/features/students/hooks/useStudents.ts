import { useCallback, useEffect, useRef, useState } from "react";
import studentService, { Student } from "../services/studentService";
import { toast } from "react-toastify";
import { FieldValues } from "react-hook-form";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeStudents, setActiveStudents] = useState<string[]>([]);
  const [lockedUsers, setLockedUsers] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const studentsResponse = await studentService.getAllStudents();
      setStudents(studentsResponse);

      const activeStudentsResponse = await studentService.getActiveStudents();
      setActiveStudents(activeStudentsResponse);

      const usernames = studentsResponse.map(s => s.name);
      const locked = await studentService.getUsersLockStatus(usernames);
      setLockedUsers(locked);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to get students");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const onSubmitStudent = useCallback(
    async (data: FieldValues) => {
      try {
        const newStudent = await studentService.createStudent(
          data.name,
          data.sessionGroupName,
          data.surveyId
        );
        setStudents([...students, newStudent]);
        toast.success("Student created successfully!");
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create student";
        toast.error(errorMessage);
      }
    },
    [students]
  );

  const handleSetSurveyId = useCallback(
    async (studentName) => {
      if (inputRef.current) {
        const stringSurveyVal = inputRef.current.value;
        const integerSurveyVal = stringSurveyVal ? parseInt(stringSurveyVal, 10) : undefined;

        if (!isNaN(integerSurveyVal!)) {
          try {
            await studentService.setStudentSurveyId(
              studentName, integerSurveyVal
            );
            setStudents(
              students.map((s) => {
                if (s.name === studentName) {
                  return {
                    ...s,
                    survey_id: integerSurveyVal,
                  };
                } else {
                  return s;
                }
              })
            );
            toast.success("Survey ID updated successfully!");
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to update survey ID";
            toast.error(errorMessage);
          }
        }
      }
    },
    [inputRef, students]
  );

  const handleUnlockUser = useCallback(async (studentName: string) => {
    try {
      await studentService.unlockUser(studentName);
      const usernames = students.map(s => s.name);
      const locked = await studentService.getUsersLockStatus(usernames);
      setLockedUsers(locked);
      toast.success(`Unlocked ${studentName}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to unlock user");
    }
  }, [students]);

  const handleLockUser = useCallback(async (studentName: string) => {
    try {
      await studentService.lockUser(studentName);
      const usernames = students.map(s => s.name);
      const locked = await studentService.getUsersLockStatus(usernames);
      setLockedUsers(locked);
      toast.success(`Locked ${studentName}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to lock user");
    }
  }, [students]);

  return {
    students,
    activeStudents,
    lockedUsers,
    loading,
    onSubmitStudent,
    handleSetSurveyId,
    handleUnlockUser,
    handleLockUser,
    inputRef,
    refresh: fetchStudents
  };
}