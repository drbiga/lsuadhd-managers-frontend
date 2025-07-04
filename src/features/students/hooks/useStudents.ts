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
        if (studentsResponse) {
          setStudents(studentsResponse);
        } else {
          toast.error("Something went wrong while setting the students");
        }
      } catch {
        toast.error("Something went wrong while getting the students");
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
        toast.error("Unknown error. Please contact someone");
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
          await studentService.setStudentSurveyId(
            studentName, integerSurveyVal
          );
        }
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
      }
    },
    [inputRef, students]
  );

  return { students, onSubmitStudent, handleSetSurveyId, inputRef };
}