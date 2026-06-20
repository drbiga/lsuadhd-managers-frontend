import { TelemetryTimeseriesPoint } from "../services/telemetryService";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TelemetryChartsProps {
  timeseries: TelemetryTimeseriesPoint[];
}

type ChartPoint = {
  time: string;
  requestCount: number;
  errorCount: number;
};

function formatTimestamp(iso: string): string {
  const date = new Date(iso);
  const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  return `${date.getMonth() + 1}/${date.getDate()} ${time}`;
}

export function TelemetryCharts({ timeseries }: TelemetryChartsProps) {
  if (!timeseries || timeseries.length === 0) {
    return (
      <div className="mb-8">
        <p className="text-muted-foreground">No telemetry in this window.</p>
      </div>
    );
  }

  const data: ChartPoint[] = timeseries.map(point => ({
    time: formatTimestamp(point.bucketStart),
    requestCount: point.requestCount,
    errorCount: point.errorCount,
  }));

  return (
    <div className="space-y-8 mb-8">
      <ChartBlock title="Requests over time" data={data} dataKey="requestCount" unit="requests" stroke="blue" />
      <ChartBlock title="Errors over time" data={data} dataKey="errorCount" unit="errors" stroke="red" />
    </div>
  );
}

interface ChartBlockProps {
  title: string;
  data: ChartPoint[];
  dataKey: keyof ChartPoint;
  unit: string;
  stroke: string;
}

function ChartBlock({ title, data, dataKey, unit, stroke }: ChartBlockProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid />
          <XAxis dataKey="time" />
          <YAxis label={{ value: unit, angle: -90, position: "insideLeft" }} allowDecimals={false} />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke={stroke} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
