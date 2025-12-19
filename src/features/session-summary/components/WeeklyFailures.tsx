import { WeeklyFailureData } from "../services/sessionSummaryService";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface WeeklyFailuresProps {
  data: WeeklyFailureData[];
}

export function WeeklyFailures({ data }: WeeklyFailuresProps) {
  if (!data || data.length === 0) {
    return (
      <div className="mt-4">
        <p className="text-muted-foreground">No weekly failure data available.</p>
      </div>
    );
  }

  const percentageData = data.map((week) => ({
    week: week.weekNum,
    success: week.successPercentage,
    failed: week.failedPercentage,
  }));

  const countData = data.map((week) => ({
    week: week.weekNum,
    success: week.successCount,
    failed: week.failedCount,
  }));

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Status Composition by Week (Percentage)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={percentageData}>
            <CartesianGrid/>
            <XAxis 
              dataKey="week" 
              label={{ value: "Week #", position: "insideBottom", offset: -7 }}
            />
            <YAxis 
              label={{ value: "Percentage", angle: -90, position: "insideLeft" }}
              domain={[0, 100]}
            />
            <Tooltip />
            <Legend 
              wrapperStyle={{ paddingTop: "20px" }}
              payload={[
                { value: "failed", type: "rect", color: "red" },
                { value: "success", type: "rect", color: "green" },
              ]}
            />
            <Bar dataKey="failed" stackId="a" fill="red" />
            <Bar dataKey="success" stackId="a" fill="green" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">
          Status Composition by Week (Session Count)
        </h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={countData}>
            <CartesianGrid />
            <XAxis 
              dataKey="week" 
              label={{ value: "Week #", position: "insideBottom", offset: -7 }}
            />
            <YAxis 
              label={{ value: "Session Count", angle: -90, position: "insideLeft" }}
            />
            <Tooltip />
            <Legend 
              wrapperStyle={{ paddingTop: "20px" }}
              payload={[
                { value: "failed", type: "rect", color: "red" },
                { value: "success", type: "rect", color: "green" },
              ]}
            />
            <Bar dataKey="failed" stackId="a" fill="red" />
            <Bar dataKey="success" stackId="a" fill="green" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
