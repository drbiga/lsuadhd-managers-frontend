import { useCallback, useEffect, useRef, useState } from "react";
import studentService, { Student } from "../services/studentService";
import { toast } from "react-toastify";
import { FieldValues } from "react-hook-form";

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    (async () => {
      try {
        const studentsResponse = await studentService.getAllStudents();
        setStudents(studentsResponse);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to get students";
        toast.error(errorMessage);
      }
    })();
  }, []);

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

  return { students, onSubmitStudent, handleSetSurveyId, inputRef };
}