import { Label } from "@/components/ui/label";

import type { CodingSession, CodingStudent } from "../types";

const selectClassName =
  "mt-1 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

type StudentSessionPickerProps = {
  students: CodingStudent[];
  studentName: string | null;
  onStudentChange: (studentName: string | null) => void;
  sessions: CodingSession[];
  sessionSeqnum: number | null;
  onSessionChange: (sessionSeqnum: number | null) => void;
  studentsLoading: boolean;
  sessionsLoading: boolean;
  imagesLoading: boolean;
  imageCount: number;
};

export function StudentSessionPicker({
  students,
  studentName,
  onStudentChange,
  sessions,
  sessionSeqnum,
  onSessionChange,
  studentsLoading,
  sessionsLoading,
  imagesLoading,
  imageCount,
}: StudentSessionPickerProps) {
  return (
    <div className="flex flex-wrap items-end gap-4 rounded-xl border border-border bg-card p-4">
      <div className="min-w-[200px] flex-1">
        <Label htmlFor="coding-student">Student</Label>
        <select
          id="coding-student"
          className={selectClassName}
          value={studentName ?? ""}
          onChange={(event) => onStudentChange(event.target.value || null)}
          disabled={studentsLoading || students.length === 0}
        >
          <option value="">
            {students.length === 0 ? "No students available" : "Select a student"}
          </option>
          {students.map((student) => (
            <option key={student.name} value={student.name}>
              {student.name}
            </option>
          ))}
        </select>
      </div>

      <div className="min-w-[200px] flex-1">
        <Label htmlFor="coding-session">Session</Label>
        <select
          id="coding-session"
          className={selectClassName}
          value={sessionSeqnum ?? ""}
          onChange={(event) => onSessionChange(event.target.value ? Number(event.target.value) : null)}
          disabled={!studentName || sessionsLoading || sessions.length === 0}
        >
          <option value="">
            {!studentName
              ? "Select a student first"
              : sessionsLoading
                ? "Loading sessions..."
                : sessions.length === 0
                  ? "No sessions available"
                  : "Select a session"}
          </option>
          {sessions.map((session) => (
            <option key={session.seqnum} value={session.seqnum}>
              Session {session.seqnum} ({session.stage})
            </option>
          ))}
        </select>
      </div>

      <div className="flex h-10 items-center text-sm text-muted-foreground">
        {studentsLoading
          ? "Loading students..."
          : !studentName
            ? "Select a student"
            : sessionsLoading
              ? "Loading sessions..."
              : !sessionSeqnum
                ? "Select a session"
                : imagesLoading
                  ? "Loading images..."
                  : `${imageCount} image${imageCount === 1 ? "" : "s"}`}
      </div>
    </div>
  );
}
