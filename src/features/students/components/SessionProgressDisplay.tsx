import { StudentWithSessionData } from "../services/studentService";
import { SessionItemChart } from "./SessionProgressChart";
import { findAnalytics, presentPercentage } from "../lib/sessionProgress";

interface SessionProgressDisplayProps {
  student: StudentWithSessionData;
}

export function SessionProgressDisplay({ student }: SessionProgressDisplayProps) {
  return (
    <div className="mt-8">
      <h2 className="text-4xl mb-8">
        {student.name.charAt(0).toUpperCase() + student.name.slice(1)}
      </h2>
      
      {student.sessions.length === 0 ? (
        <p className="text-slate-600 dark:text-slate-400">No sessions found for this student.</p>
      ) : (
        <ul className="flex flex-col gap-8 px-2">
          {student.sessions.map(s => (
            <li key={s.seqnum} className="bg-card p-4 h-[80vh] w-[70vw] rounded-lg flex">
              <div className="w-[30%]">
                <p className="text-2xl text-slate-700 dark:text-slate-300">
                  Session #{s.seqnum}
                </p>
                <p>
                  <span className="text-slate-600 dark:text-slate-400 border-b-[1px]">Overview</span>
                </p>
                <p className="text-sm text-slate-400 dark:text-slate-600">
                  Stage: {s.stage.charAt(0).toUpperCase() + s.stage.slice(1)}
                </p>
                <div className="text-sm text-slate-400 dark:text-slate-600">
                  Number of feedbacks given: {s.feedbacks.length}
                </div>
                <div className="text-sm text-slate-800 dark:text-slate-200">
                  Percentage of time focused: {presentPercentage(findAnalytics(student.sessions_analytics, s)?.percentage_time_focused || 0)}
                </div>
                <div className="text-sm text-slate-400 dark:text-slate-600">
                  Percentage of time normal: {presentPercentage(findAnalytics(student.sessions_analytics, s)?.percentage_time_normal || 0)}
                </div>
                <div className="text-sm text-slate-400 dark:text-slate-600">
                  Percentage of time distracted: {presentPercentage(findAnalytics(student.sessions_analytics, s)?.percentage_time_distracted || 0)}
                </div>
              </div>
              <SessionItemChart feedbacks={s.feedbacks} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}