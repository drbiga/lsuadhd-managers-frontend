import { Stats } from "../services/trackingService";

interface TrackingStatsDisplayProps {
  stats: Stats | null;
}

export function TrackingStatsDisplay({ stats }: TrackingStatsDisplayProps) {
  if (!stats) {
    return (
      <div className="mt-4">
        <p className="text-slate-600 dark:text-slate-400">No stats to show yet.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Overview of Current Stats</h3>
        <ul className="text-sm bg-slate-800 max-w-md p-4 rounded-lg space-y-1">
          <li>Student count: {stats.countStudents}</li>
          <li>Total user_input records: {stats.totalCountRecordsUi}</li>
          <li>Total windows_activity records: {stats.totalCountRecordsWa}</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Student Details</h3>
        <div className="space-y-4">
          {stats.allStudentsStats.map((s, index) => (
            <div key={s.name || index} className="bg-slate-800 max-w-md px-4 py-3 rounded-lg">
              <h4 className="text-base font-medium mb-2">Name: {s.name}</h4>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>Count of user_input records: {s.countRecordsUi}</li>
                <li>Count of windows_activity records: {s.countRecordsWa}</li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}