import { useState } from "react";
import { PageContainer, PageMainContent, PageTitle } from "@/components/layout/Page";
import Sidebar from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { useTelemetry } from "@/features/telemetry/hooks/useTelemetry";
import { TelemetryFilters } from "@/features/telemetry/components/TelemetryFilters";
import { SummaryCards } from "@/features/telemetry/components/SummaryCards";
import { TelemetryCharts } from "@/features/telemetry/components/TelemetryCharts";
import { EndpointStatsTable } from "@/features/telemetry/components/EndpointStatsTable";
import { ErrorHistoryDialog } from "@/features/telemetry/components/ErrorHistoryDialog";

export default function Telemetry() {
  const { summary, endpointStats, timeseries, loading, filters, updateFilters, refresh, errors, errorsLoading, loadErrors } = useTelemetry();
  const [errorDialogOpen, setErrorDialogOpen] = useState(false);

  const handleViewErrors = () => {
    setErrorDialogOpen(true);
    loadErrors();
  };

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <div className="flex items-center justify-between mb-4">
          <PageTitle>Telemetry</PageTitle>
          <Button onClick={refresh} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <TelemetryFilters filters={filters} onChange={updateFilters} />

        {loading ? (
          <LoadingScreen message="Loading telemetry..." />
        ) : (
          <>
            <SummaryCards summary={summary} onViewErrors={handleViewErrors} />
            <TelemetryCharts timeseries={timeseries} />
            <EndpointStatsTable endpointStats={endpointStats} />
          </>
        )}

        <ErrorHistoryDialog
          open={errorDialogOpen}
          onOpenChange={setErrorDialogOpen}
          errors={errors}
          loading={errorsLoading}
        />
      </PageMainContent>
    </PageContainer>
  );
}
