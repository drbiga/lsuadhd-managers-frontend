import { TelemetrySummary } from "../services/telemetryService";

interface SummaryCardsProps {
  summary: TelemetrySummary | null;
  onViewErrors: () => void;
}

export function SummaryCards({ summary, onViewErrors }: SummaryCardsProps) {
  if (!summary) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="bg-card border border-border p-6 rounded-xl shadow-sm">
        <h3 className="text-3xl font-bold text-foreground mb-2">
          {summary.totalRequests.toLocaleString()} requests
        </h3>
        <p className="text-sm text-muted-foreground">Total requests in window</p>
      </div>
      <button
        type="button"
        onClick={onViewErrors}
        className="bg-card border border-border p-6 rounded-xl shadow-sm text-left transition-colors hover:bg-accent"
      >
        <h3 className="text-3xl font-bold text-foreground mb-2">
          {summary.errorRatePercentage}% errors
        </h3>
        <p className="text-sm text-muted-foreground">
          {summary.errorCount.toLocaleString()} failed requests - Click to View
        </p>
      </button>
    </div>
  );
}
