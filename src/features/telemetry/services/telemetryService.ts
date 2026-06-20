import api from "@/services/api";

export type TelemetryFilters = {
    windowMinutes: number;
    role: "manager" | "student" | null; // null = all roles
    errorsOnly: boolean;
};

export type TelemetrySummary = {
    totalRequests: number;
    errorCount: number;
    errorRatePercentage: number;
};

export type TelemetryEndpointStat = {
    endpoint: string;
    requestCount: number;
    averageLatencyMs: number;
    p95LatencyMs: number;
    maxLatencyMs: number;
    errorCount: number;
};

export type TelemetryTimeseriesPoint = {
    bucketStart: string; // timestamp (server-local)
    requestCount: number;
    errorCount: number;
};

export type TelemetryErrorRecord = {
    requestTimestamp: string;
    endpoint: string;
    httpMethod: string;
    responseStatus: number;
    username: string | null;
    userRole: string | null;
    errorDetail: string | null;
};

function toRequestBody(filters: TelemetryFilters) {
    return {
        window_minutes: filters.windowMinutes,
        role: filters.role,
        errors_only: filters.errorsOnly,
    };
}

class TelemetryService {
    public async getSummary(filters: TelemetryFilters): Promise<TelemetrySummary> {
        const response = await api.post('/telemetry/summary', toRequestBody(filters));
        return {
            totalRequests: response.data.total_requests,
            errorCount: response.data.error_count,
            errorRatePercentage: response.data.error_rate_percentage,
        };
    }

    public async getEndpointStats(filters: TelemetryFilters): Promise<TelemetryEndpointStat[]> {
        const response = await api.post('/telemetry/endpoint-stats', toRequestBody(filters));
        return response.data.map((stat) => ({
            endpoint: stat.endpoint,
            requestCount: stat.request_count,
            averageLatencyMs: stat.average_latency_ms,
            p95LatencyMs: stat.p95_latency_ms,
            maxLatencyMs: stat.max_latency_ms,
            errorCount: stat.error_count,
        }));
    }

    public async getTimeseries(filters: TelemetryFilters): Promise<TelemetryTimeseriesPoint[]> {
        const response = await api.post('/telemetry/timeseries', toRequestBody(filters));
        return response.data.map((point) => ({
            bucketStart: point.bucket_start,
            requestCount: point.request_count,
            errorCount: point.error_count,
        }));
    }

    public async getErrors(filters: TelemetryFilters): Promise<TelemetryErrorRecord[]> {
        const response = await api.post('/telemetry/errors', toRequestBody(filters));
        return response.data.map((error) => ({
            requestTimestamp: error.request_timestamp,
            endpoint: error.endpoint,
            httpMethod: error.http_method,
            responseStatus: error.response_status,
            username: error.username,
            userRole: error.user_role,
            errorDetail: error.error_detail,
        }));
    }
}

const telemetryService = new TelemetryService();

export default telemetryService;
