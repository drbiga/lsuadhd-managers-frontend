import { PageContainer, PageMainContent, PageTitle } from "@/components/Page";
import Sidebar from "@/components/Sidebar";
import trackingService, { Stats } from "@/services/tracking";
import { useEffect, useState } from "react";

export default function TrackingData() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    (async () => setStats(await trackingService.getStats()))()
  }, []);

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Tracking Data</PageTitle>
        <h2 className="text-2xl">Current Stats</h2>
        {stats === null && (
          <h3>Loading...</h3>
        )}
        {stats && (
          <ul>
            <li>Student count: {stats.countStudents}</li>
            <li>Total count of user_input records: {stats.totalCountRecordsUi}</li>
            <li>Total count of windows_activity records: {stats.totalCountRecordsWa}</li>
            <h3 className="my-4 text-xl">Student details</h3>
            {stats.allStudentsStats.map(s => (
              <ul className="mb-4 bg-slate-800 max-w-[30%] px-4 py-2 rounded-lg">
                <li className="text-lg">Name: {s.name}</li>
                <li className="text-slate-400">Count of user_input records: {s.countRecordsUi}</li>
                <li className="text-slate-400">Count of windows_activity records: {s.countRecordsWa}</li>
              </ul>
            ))}
          </ul>
        )}
      </PageMainContent>
    </PageContainer>
  );
}