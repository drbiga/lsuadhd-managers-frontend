import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TelemetryFilters as Filters } from "../services/telemetryService";

interface TelemetryFiltersProps {
  filters: Filters;
  onChange: (partial: Partial<Filters>) => void;
}

const WINDOW_OPTIONS = [
  { label: "Last hour", minutes: 60 },
  { label: "Last 24h", minutes: 60 * 24 },
  { label: "Last 7 days", minutes: 60 * 24 * 7 },
  { label: "Last 30 days", minutes: 60 * 24 * 30 },
];

export function TelemetryFilters({ filters, onChange }: TelemetryFiltersProps) {
  const [customDays, setCustomDays] = useState("");

  const applyCustomDays = () => {
    const days = Number(customDays);
    if (Number.isFinite(days) && days > 0) {
      onChange({ windowMinutes: Math.round(days * 24 * 60) });
    }
  };
  
  return (
    <div className="mb-6 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-foreground font-medium">Window:</span>
        {WINDOW_OPTIONS.map(option => (
          <Button
            key={option.minutes}
            size="sm"
            onClick={() => { setCustomDays(""); onChange({ windowMinutes: option.minutes }); }}
            variant={filters.windowMinutes === option.minutes ? "default" : "outline"}
          >
            {option.label}
          </Button>
        ))}
        <span className="text-muted-foreground text-sm ml-1">or last</span>
        <Input
          type="number"
          min={1}
          value={customDays}
          onChange={event => setCustomDays(event.target.value)}
          onKeyDown={event => { if (event.key === "Enter") applyCustomDays(); }}
          onBlur={applyCustomDays}
          className="w-20 h-9"
        />
        <span className="text-muted-foreground text-sm">days</span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-foreground font-medium">Role:</span>
        <Button size="sm" onClick={() => onChange({ role: null })} variant={filters.role === null ? "default" : "outline"}>
          All
        </Button>
        <Button size="sm" onClick={() => onChange({ role: "student" })} variant={filters.role === "student" ? "default" : "outline"}>
          Students
        </Button>
        <Button size="sm" onClick={() => onChange({ role: "manager" })} variant={filters.role === "manager" ? "default" : "outline"}>
          Managers
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-foreground font-medium">Status:</span>
        <Button size="sm" onClick={() => onChange({ errorsOnly: false })} variant={!filters.errorsOnly ? "default" : "outline"}>
          All requests
        </Button>
        <Button size="sm" onClick={() => onChange({ errorsOnly: true })} variant={filters.errorsOnly ? "default" : "outline"}>
          Errors only
        </Button>
      </div>
    </div>
  );
}
