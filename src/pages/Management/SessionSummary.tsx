import { PageContainer, PageMainContent, PageTitle } from "@/components/layout/Page";
import Sidebar from "@/components/layout/Sidebar";
import { useSessionSummary } from "@/features/session-summary/hooks/useSessionSummary";
import { SessionSummaryDisplay } from "@/features/session-summary/components/SessionSummaryDisplay";

export default function SessionSummary() {
  const { stats, records, problematicSessions, loading } = useSessionSummary();

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Session Summary</PageTitle>
        <SessionSummaryDisplay 
          stats={stats} 
          records={records} 
          problematicSessions={problematicSessions}
          loading={loading} 
        />
      </PageMainContent>
    </PageContainer>
  );
}
