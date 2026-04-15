import { useMemo, useState } from "react";
import { DetailedSessionRecord, SessionExclusion } from "../services/sessionSummaryService";

type UseSessionExclusionFilterParams = {
  detailedSessions: DetailedSessionRecord[];
  exclusions: SessionExclusion[];
  onExclusionsChange: (exclusions: SessionExclusion[]) => void;
};

export function useSessionExclusionFilter({
  detailedSessions,
  exclusions,
  onExclusionsChange,
}: UseSessionExclusionFilterParams) {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSessions, setSelectedSessions] = useState<number[]>([]);

  const students = useMemo(
    () =>
      [...new Set(detailedSessions.map((session) => session.recordId))].sort((a, b) =>
        a.localeCompare(b, undefined, { numeric: true })
      ),
    [detailedSessions]
  );

  const studentSessions = useMemo(
    () =>
      detailedSessions
        .filter((session) => session.recordId === selectedStudent)
        .map((session) => session.sessionNumber)
        .sort((a, b) => a - b),
    [detailedSessions, selectedStudent]
  );

  const toggleSession = (num: number) => {
    setSelectedSessions((prev) =>
      prev.includes(num) ? prev.filter((session) => session !== num) : [...prev, num]
    );
  };

  const addExclusion = () => {
    if (!selectedStudent || selectedSessions.length === 0) return;

    const existing = exclusions.find((exclusion) => exclusion.studentName === selectedStudent);

    if (existing) {
      const merged = [...new Set([...existing.sessionNumbers, ...selectedSessions])].sort(
        (a, b) => a - b
      );
      onExclusionsChange(
        exclusions.map((exclusion) =>
          exclusion.studentName === selectedStudent
            ? { ...exclusion, sessionNumbers: merged }
            : exclusion
        )
      );
    } else {
      onExclusionsChange([
        ...exclusions,
        { studentName: selectedStudent, sessionNumbers: [...selectedSessions].sort((a, b) => a - b) },
      ]);
    }

    setSelectedStudent("");
    setSelectedSessions([]);
  };

  const removeSession = (student: string, session: number) => {
    onExclusionsChange(
      exclusions
        .map((exclusion) =>
          exclusion.studentName === student
            ? {
                ...exclusion,
                sessionNumbers: exclusion.sessionNumbers.filter(
                  (sessionNumber) => sessionNumber !== session
                ),
              }
            : exclusion
        )
        .filter((exclusion) => exclusion.sessionNumbers.length > 0)
    );
  };

  const removeStudent = (student: string) => {
    onExclusionsChange(exclusions.filter((exclusion) => exclusion.studentName !== student));
  };

  const clearAllExclusions = () => {
    onExclusionsChange([]);
  };

  const handleStudentChange = (student: string) => {
    setSelectedStudent(student);
    setSelectedSessions([]);
  };

  return {
    selectedStudent,
    selectedSessions,
    students,
    studentSessions,
    setSelectedStudent: handleStudentChange,
    toggleSession,
    addExclusion,
    removeSession,
    removeStudent,
    clearAllExclusions,
  };
}
