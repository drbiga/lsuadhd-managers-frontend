import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import telemetryService, {
    TelemetryFilters,
    TelemetrySummary,
    TelemetryEndpointStat,
    TelemetryTimeseriesPoint,
    TelemetryErrorRecord,
} from "../services/telemetryService";

const DEFAULT_FILTERS: TelemetryFilters = {
    windowMinutes: 1440, // last 24 hours
    role: "student", // default to the student-facing traffic (most relevant to the study)
    errorsOnly: false,
};

export function useTelemetry() {
    const [summary, setSummary] = useState<TelemetrySummary | null>(null);
    const [endpointStats, setEndpointStats] = useState<TelemetryEndpointStat[]>([]);
    const [timeseries, setTimeseries] = useState<TelemetryTimeseriesPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<TelemetryFilters>(DEFAULT_FILTERS);

    const [errors, setErrors] = useState<TelemetryErrorRecord[]>([]);
    const [errorsLoading, setErrorsLoading] = useState(false);

    const fetchTelemetry = useCallback(async (currentFilters: TelemetryFilters) => {
        try {
            setLoading(true);
            const [summaryData, endpointData, timeseriesData] = await Promise.all([
                telemetryService.getSummary(currentFilters),
                telemetryService.getEndpointStats(currentFilters),
                telemetryService.getTimeseries(currentFilters),
            ]);
            setSummary(summaryData);
            setEndpointStats(endpointData);
            setTimeseries(timeseriesData);
        } catch (error) {
            console.error('Error fetching telemetry:', error);
            toast.error("Failed to fetch telemetry");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTelemetry(filters);
    }, [filters, fetchTelemetry]);

    const updateFilters = useCallback((partial: Partial<TelemetryFilters>) => {
        setFilters(prev => ({ ...prev, ...partial }));
    }, []);

    const refresh = useCallback(() => {
        fetchTelemetry(filters);
    }, [filters, fetchTelemetry]);

    const loadErrors = useCallback(async () => {
        try {
            setErrorsLoading(true);
            setErrors(await telemetryService.getErrors(filters));
        } catch (error) {
            console.error('Error fetching telemetry errors:', error);
            toast.error("Failed to fetch error history");
        } finally {
            setErrorsLoading(false);
        }
    }, [filters]);

    return {
        summary,
        endpointStats,
        timeseries,
        loading,
        filters,
        updateFilters,
        refresh,
        errors,
        errorsLoading,
        loadErrors,
    };
}
