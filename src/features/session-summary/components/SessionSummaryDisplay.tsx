import { useState } from "react";
import { SessionSummaryStats, SessionRecord, ProblematicSessionRecord, WeeklyFailureData } from "../services/sessionSummaryService";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyFailures } from "./WeeklyFailures";

interface SessionSummaryDisplayProps {
  stats: SessionSummaryStats | null;
  records: SessionRecord[];
  problematicSessions: ProblematicSessionRecord[];
  weeklyFailures: WeeklyFailureData[];
  loading: boolean;
}

type TypeOfView = "normal" | "problematic";

export function SessionSummaryDisplay({ stats, records, problematicSessions, weeklyFailures, loading }: SessionSummaryDisplayProps) {
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
    return <LoadingScreen message="Loading session summary..." />;
  }

  if (!stats) {
    return (
      <div className="mt-4">
        <p className="text-muted-foreground">No session summary data available.</p>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Tabs defaultValue="summary" className="w-full">
        <TabsList>
          <TabsTrigger value="summary">Summary Statistics</TabsTrigger>
          <TabsTrigger value="weekly-failures">Weekly Failures</TabsTrigger>
        </TabsList>

        <TabsContent value="summary">
          <h2 className="text-xl font-semibold text-foreground mb-4 mt-4">Laptop Sessions (1-2)</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-3xl font-bold text-foreground mb-2">
            {stats.laptopPassthroughFocusedAverage}% focused
          </h3>
          <p className="text-sm text-muted-foreground">Average for passthrough</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-3xl font-bold text-foreground mb-2">
            {stats.laptopVrOnlyFocusedAverage}% focused
          </h3>
          <p className="text-sm text-muted-foreground">Average for vr only</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-3xl font-bold text-foreground mb-2">
            {stats.laptopVrFeedbackFocusedAverage}% focused
          </h3>
          <p className="text-sm text-muted-foreground">Average for vr + feedback</p>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-3xl font-bold text-foreground mb-2">
            {stats.laptopPassthroughCount} sessions
          </h3>
          <p className="text-sm text-muted-foreground">count for passthrough</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-3xl font-bold text-foreground mb-2">
            {stats.laptopVrOnlyCount} sessions
          </h3>
          <p className="text-sm text-muted-foreground">count for vr only</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-3xl font-bold text-foreground mb-2">
            {stats.laptopVrFeedbackCount} sessions
          </h3>
          <p className="text-sm text-muted-foreground">count for vr + feedback</p>
        </div>
      </div>


      <h2 className="text-xl font-semibold text-foreground mb-4">Headset Sessions (3-12)</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-3xl font-bold text-foreground mb-2">
            {stats.headsetPassthroughFocusedAverage}% focused
          </h3>
          <p className="text-sm text-muted-foreground">Average for passthrough</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-3xl font-bold text-foreground mb-2">
            {stats.headsetVrOnlyFocusedAverage}% focused
          </h3>
          <p className="text-sm text-muted-foreground">Average for vr only</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-3xl font-bold text-foreground mb-2">
            {stats.headsetVrFeedbackFocusedAverage}% focused
          </h3>
          <p className="text-sm text-muted-foreground">Average for vr + feedback</p>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-3xl font-bold text-foreground mb-2">
            {stats.headsetPassthroughCount} sessions
          </h3>
          <p className="text-sm text-muted-foreground">count for passthrough</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-3xl font-bold text-foreground mb-2">
            {stats.headsetVrOnlyCount} sessions
          </h3>
          <p className="text-sm text-muted-foreground">count for vr only</p>
        </div>

        <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
          <h3 className="text-3xl font-bold text-foreground mb-2">
            {stats.headsetVrFeedbackCount} sessions
          </h3>
          <p className="text-sm text-muted-foreground">count for vr + feedback</p>
        </div>
      </div>


      <div className="mb-4 flex gap-4 items-center">
        <label className="text-foreground font-medium">View:</label>
        <Button
          onClick={() => setTypeOfView("normal")}
          variant={typeOfView === "normal" ? "default" : "outline"}
        >
          By Student
        </Button>
        <Button
          onClick={() => setTypeOfView("problematic")}
          variant={typeOfView === "problematic" ? "default" : "outline"}
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
              <tr className="border-b border-border">
                <th className="p-3 text-muted-foreground font-medium">Record ID</th>
                <th className="p-3 text-muted-foreground font-medium">Group</th>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(num => (
                  <th key={num} className="p-3 text-muted-foreground font-medium">
                    S{num}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sortedRecords.map((record, idx) => (
                <tr key={idx} className="border-b border-border">
                  <td className="p-3 text-foreground">{record.recordId}</td>
                  <td className="p-3 text-foreground">{record.group}</td>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(i => (
                    <td key={i} className="p-3 text-foreground">
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
              <tr className="border-b border-border">
                <th className="p-3 text-muted-foreground font-medium">Record ID</th>
                <th className="p-3 text-muted-foreground font-medium">Group</th>
                <th className="p-3 text-muted-foreground font-medium">Session #</th>
                <th className="p-3 text-muted-foreground font-medium">Feedbacks</th>
                <th className="p-3 text-muted-foreground font-medium">Focused %</th>
              </tr>
            </thead>
            <tbody>
              {displayProblematicSessions.map((session, idx) => (
                <tr key={idx} className="border-b border-border">
                  <td className="p-3 text-foreground">{session.recordId}</td>
                  <td className="p-3 text-foreground">{session.group}</td>
                  <td className="p-3 text-foreground">{session.sessionNumber}</td>
                  <td className="p-3 text-foreground">{session.feedbackCount}</td>
                  <td className="p-3 text-foreground">
                    {session.focusedPercentage !== null ? `${session.focusedPercentage}%` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
        </TabsContent>

        <TabsContent value="weekly-failures">
          <WeeklyFailures data={weeklyFailures} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
