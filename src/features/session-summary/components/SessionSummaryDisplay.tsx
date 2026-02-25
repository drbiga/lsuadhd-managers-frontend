import { useState } from "react";
import { SessionSummaryStats, SessionRecord, DetailedSessionRecord, WeeklyFailureData } from "../services/sessionSummaryService";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WeeklyFailures } from "./WeeklyFailures";

interface SessionSummaryDisplayProps {
  stats: SessionSummaryStats | null;
  records: SessionRecord[];
  detailedSessions: DetailedSessionRecord[];
  weeklyFailures: WeeklyFailureData[];
  loading: boolean;
}

type TypeOfView = "student-view" | "session-view";

export function SessionSummaryDisplay({ stats, records, detailedSessions, weeklyFailures, loading }: SessionSummaryDisplayProps) {
  const [typeOfView, setTypeOfView] = useState<TypeOfView>("student-view");
  const [hideTestStudents, setHideTestStudents] = useState(true);
  const [showOnlyMissingAnalytics, setShowOnlyMissingAnalytics] = useState(false);
  const [sortByUserThenSession, setSortByUserThenSession] = useState(false);

  let displayRecords = records;
  let displayDetailedSessions = detailedSessions;

  if (hideTestStudents) {
    displayRecords = records.filter(r => !r.recordId.startsWith("test."));
    displayDetailedSessions = detailedSessions.filter(s => !s.recordId.startsWith("test."));
  }

  if (showOnlyMissingAnalytics) {
    displayDetailedSessions = displayDetailedSessions.filter(s => s.focusedPercentage === null);
  }

  const sortedDetailedSessions = sortByUserThenSession
    ? [...displayDetailedSessions].sort((a, b) => {
      const userCompare = a.recordId.localeCompare(b.recordId, undefined, { numeric: true, sensitivity: "base" });
      if (userCompare !== 0) return userCompare;
      return a.sessionNumber - b.sessionNumber;
    })
    : [...displayDetailedSessions].sort((a, b) => {
      const aDeviation = Math.abs(100 - a.feedbackCount);
      const bDeviation = Math.abs(100 - b.feedbackCount);
      return bDeviation - aDeviation;
    });

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
                {stats.laptopPassthroughFocusedAverage}% ± {stats.laptopPassthroughFocusedStdev}% focused
              </h3>
              <p className="text-sm text-muted-foreground">Average for passthrough</p>
            </div>

            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="text-3xl font-bold text-foreground mb-2">
                {stats.laptopVrOnlyFocusedAverage}% ± {stats.laptopVrOnlyFocusedStdev}% focused
              </h3>
              <p className="text-sm text-muted-foreground">Average for vr only</p>
            </div>

            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="text-3xl font-bold text-foreground mb-2">
                {stats.laptopVrFeedbackFocusedAverage}% ± {stats.laptopVrFeedbackFocusedStdev}% focused
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
                {stats.headsetPassthroughFocusedAverage}% ± {stats.headsetPassthroughFocusedStdev}% focused
              </h3>
              <p className="text-sm text-muted-foreground">Average for passthrough</p>
            </div>

            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="text-3xl font-bold text-foreground mb-2">
                {stats.headsetVrOnlyFocusedAverage}% ± {stats.headsetVrOnlyFocusedStdev}% focused
              </h3>
              <p className="text-sm text-muted-foreground">Average for vr only</p>
            </div>

            <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
              <h3 className="text-3xl font-bold text-foreground mb-2">
                {stats.headsetVrFeedbackFocusedAverage}% ± {stats.headsetVrFeedbackFocusedStdev}% focused
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


          <div className="mb-4 flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-foreground font-medium">View:</span>
              <Button
                size="sm"
                onClick={() => setTypeOfView("student-view")}
                variant={typeOfView === "student-view" ? "default" : "outline"}
              >
                By Student
              </Button>
              <Button
                size="sm"
                onClick={() => setTypeOfView("session-view")}
                variant={typeOfView === "session-view" ? "default" : "outline"}
              >
                All Sessions
              </Button>

              <div className="ml-auto">
                <Button
                  size="sm"
                  onClick={() => setHideTestStudents(!hideTestStudents)}
                  variant="outline"
                >
                  {hideTestStudents ? "Show Test Students" : "Hide Test Students"}
                </Button>
              </div>
            </div>

            {typeOfView === "session-view" && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-foreground font-medium">Filters:</span>
                <Button
                  size="sm"
                  onClick={() => setShowOnlyMissingAnalytics(!showOnlyMissingAnalytics)}
                  variant={showOnlyMissingAnalytics ? "default" : "outline"}
                >
                  {showOnlyMissingAnalytics ? "Missing Analytics" : "Missing Analytics Only"}
                </Button>
                <Button
                  size="sm"
                  onClick={() => setSortByUserThenSession(!sortByUserThenSession)}
                  variant={sortByUserThenSession ? "default" : "outline"}
                >
                  {sortByUserThenSession ? "User + Session" : "Sort by User + Session"}
                </Button>
              </div>
            )}
          </div>

          {typeOfView === "student-view" ? (
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
                          {record.focusedPercentages[i] === "n/a"
                            ? "n/a"
                            : record.focusedPercentages[i] !== null
                              ? `${record.focusedPercentages[i]}%`
                              : "-"}
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
                  {sortedDetailedSessions.map((session, idx) => (
                    <tr key={idx} className="border-b border-border">
                      <td className="p-3 text-foreground">{session.recordId}</td>
                      <td className="p-3 text-foreground">{session.group}</td>
                      <td className="p-3 text-foreground">{session.sessionNumber}</td>
                      <td className="p-3 text-foreground">{session.feedbackCount}</td>
                      <td className="p-3 text-foreground">
                        {session.focusedPercentage === "n/a"
                          ? "n/a"
                          : session.focusedPercentage !== null
                            ? `${session.focusedPercentage}%`
                            : "-"}
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
