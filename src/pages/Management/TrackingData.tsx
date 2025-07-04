import { PageContainer, PageMainContent, PageTitle } from "@/components/layout/Page";
import Sidebar from "@/components/layout/Sidebar";
import { useTrackingStats } from "@/features/tracking/hooks/useTrackingStats";
import { TrackingStatsDisplay } from "@/features/tracking/components/TrackingStatsDisplay";

export default function TrackingData() {
  const { stats } = useTrackingStats();

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Tracking Data</PageTitle>
          <TrackingStatsDisplay stats={stats} />
      </PageMainContent>
    </PageContainer>
  );
}