import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { TelemetryEndpointStat } from "../services/telemetryService";

interface EndpointStatsTableProps {
  endpointStats: TelemetryEndpointStat[];
}

type SortKey = "most-called" | "worst-latency" | "best-latency";

export function EndpointStatsTable({ endpointStats }: EndpointStatsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("most-called");

  const sortedStats = useMemo(() => {
    const stats = [...endpointStats];
    if (sortKey === "most-called") {
      return stats.sort((a, b) => b.requestCount - a.requestCount);
    }
    if (sortKey === "worst-latency") {
      return stats.sort((a, b) => b.p95LatencyMs - a.p95LatencyMs);
    }
    return stats.sort((a, b) => a.p95LatencyMs - b.p95LatencyMs);
  }, [endpointStats, sortKey]);

  if (endpointStats.length === 0) {
    return <p className="text-muted-foreground">No endpoints to show for this window.</p>;
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-foreground font-medium">Sort by:</span>
        <Button size="sm" onClick={() => setSortKey("most-called")} variant={sortKey === "most-called" ? "default" : "outline"}>
          Most called
        </Button>
        <Button size="sm" onClick={() => setSortKey("worst-latency")} variant={sortKey === "worst-latency" ? "default" : "outline"}>
          Worst latency
        </Button>
        <Button size="sm" onClick={() => setSortKey("best-latency")} variant={sortKey === "best-latency" ? "default" : "outline"}>
          Best latency
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="p-3 text-muted-foreground font-medium">Endpoint</th>
              <th className="p-3 text-muted-foreground font-medium">Count</th>
              <th className="p-3 text-muted-foreground font-medium">Avg (ms)</th>
              <th className="p-3 text-muted-foreground font-medium">P95 (ms)</th>
              <th className="p-3 text-muted-foreground font-medium">Max (ms)</th>
              <th className="p-3 text-muted-foreground font-medium">Errors</th>
            </tr>
          </thead>
          <tbody>
            {sortedStats.map((stat, idx) => (
              <tr key={idx} className="border-b border-border">
                <td className="p-3 text-foreground font-mono text-sm">{stat.endpoint}</td>
                <td className="p-3 text-foreground">{stat.requestCount.toLocaleString()}</td>
                <td className="p-3 text-foreground">{stat.averageLatencyMs}</td>
                <td className="p-3 text-foreground">{stat.p95LatencyMs}</td>
                <td className="p-3 text-foreground">{stat.maxLatencyMs}</td>
                <td className="p-3 text-foreground">
                  {stat.errorCount > 0 ? (
                    <span className="text-red-600 font-medium">{stat.errorCount}</span>
                  ) : (
                    stat.errorCount
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
