import { useState } from "react";
import { SessionSummaryStats, SessionRecord, ProblematicSessionRecord } from "../services/sessionSummaryService";
import { Button } from "@/components/ui/button";

interface SessionSummaryDisplayProps {
  stats: SessionSummaryStats | null;
  records: SessionRecord[];
  problematicSessions: ProblematicSessionRecord[];
  loading: boolean;
}

type TypeOfView = "normal" | "problematic";

export function SessionSummaryDisplay({ stats, records, problematicSessions, loading }: SessionSummaryDisplayProps) {
  const [typeOfView, setTypeOfView] = useState<TypeOfView>("normal");
  const [hideTestStudents, setHideTestStudents] = useState(true);

  let displayRecords = records;
  let displayProblematicSessions = problematicSessions;

  if (hideTestStudents) {
    displayRecords = records.filter(r => !r.recordId.startsWith("test."));
    displayProblematicSessions = problematicSessions.filter(s => !s.recordId.startsWith("test."));
  }

  const sortedRecords = [...displayRecords].sort((a, b) => 
    a.recordId.localeCompare(b.recordId, undefined, { numeric: true, sensitivity: 'base' })
  );

  if (loading) {
    return (
      <div className="mt-4">
        <p className="text-slate-600 dark:text-slate-400">Loading...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="mt-4">
        <p className="text-slate-600 dark:text-slate-400">No session summary data available.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            {stats.passthroughFocusedAverage}% focused
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Average for passthrough</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            {stats.vrOnlyFocusedAverage}% focused
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Average for vr only</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            {stats.vrFeedbackFocusedAverage}% focused
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">Average for vr + feedback</p>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            {stats.passthroughCount} sessions
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">count for passthrough</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            {stats.vrOnlyCount} sessions
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">count for vr only</p>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow">
          <h3 className="text-3xl font-bold text-slate-800 dark:text-slate-200 mb-2">
            {stats.vrFeedbackCount} sessions
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">count for vr + feedback</p>
        </div>
      </div>


      <div className="mb-4 flex gap-4 items-center">
        <label className="text-slate-700 dark:text-slate-300">View:</label>
        <Button
          onClick={() => setTypeOfView("normal")}
          variant="outline"
          className={typeOfView === "normal" ?"font-bold" : ""}
        >
          By Student
        </Button>
        <Button
          onClick={() => setTypeOfView("problematic")}
          variant="outline"
          className={typeOfView === "problematic" ?"font-bold" : ""}
        >
          Most Problematic Sessions
        </Button>
        
        <div className="ml-auto pr-3">
          <Button
            onClick={() => setHideTestStudents(!hideTestStudents)}
            variant="outline"
          >
            {hideTestStudents ? "Show Test Students" : "Hide Test Students"}
          </Button>
        </div>
      </div>

      {typeOfView === "normal" ? (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="p-3 text-slate-400 dark:text-slate-600">Record ID</th>
                <th className="p-3 text-slate-400 dark:text-slate-600">Group</th>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                  <th key={num} className="p-3 text-slate-400 dark:text-slate-600">
                    S{num}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRecords.map((record, idx) => (
                <tr key={idx} className="border-b border-slate-700">
                  <td className="p-3">{record.recordId}</td>
                  <td className="p-3">{record.group}</td>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
                    <td key={i} className="p-3">
                      {record.sessions[i] !== undefined && record.sessions[i] !== null ? `${record.sessions[i]}%` : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="p-3 text-slate-400 dark:text-slate-600">Record ID</th>
                <th className="p-3 text-slate-400 dark:text-slate-600">Group</th>
                <th className="p-3 text-slate-400 dark:text-slate-600">Session #</th>
                <th className="p-3 text-slate-400 dark:text-slate-600">Feedbacks</th>
                <th className="p-3 text-slate-400 dark:text-slate-600">Focused %</th>
              </tr>
            </thead>
            <tbody>
              {displayProblematicSessions.map((session, idx) => (
                <tr key={idx} className="border-b border-slate-700">
                  <td className="p-3">{session.recordId}</td>
                  <td className="p-3">{session.group}</td>
                  <td className="p-3">{session.sessionNumber}</td>
                  <td className="p-3">{session.feedbackCount}</td>
                  <td className="p-3">
                    {session.focusedPercentage !== null ? `${session.focusedPercentage}%` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
