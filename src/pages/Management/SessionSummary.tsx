import { PageContainer, PageMainContent, PageTitle } from "@/components/layout/Page";
import Sidebar from "@/components/layout/Sidebar";
import { useSessionSummary } from "@/features/session-summary/hooks/useSessionSummary";
import { SessionSummaryDisplay } from "@/features/session-summary/components/SessionSummaryDisplay";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function SessionSummary() {
  const { stats, records, problematicSessions, weeklyFailures, loading, refresh } = useSessionSummary();

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <div className="flex items-center justify-between mb-4">
          <PageTitle>Session Summary</PageTitle>
          <Button onClick={refresh} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <SessionSummaryDisplay 
          stats={stats} 
          records={records} 
          problematicSessions={problematicSessions}
          weeklyFailures={weeklyFailures}
          loading={loading} 
        />
      </PageMainContent>
    </PageContainer>
  );
}
