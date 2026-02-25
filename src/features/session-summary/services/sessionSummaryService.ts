import api from "@/services/api";

export type SessionSummaryStats = {
    // laptop sessions (1-2)
    laptopPassthroughFocusedAverage: number;
    laptopVrOnlyFocusedAverage: number;
    laptopVrFeedbackFocusedAverage: number;
    laptopPassthroughFocusedStdev: number;
    laptopVrOnlyFocusedStdev: number;
    laptopVrFeedbackFocusedStdev: number;
    laptopPassthroughCount: number;
    laptopVrOnlyCount: number;
    laptopVrFeedbackCount: number;

    // headset sessions (3-12)
    headsetPassthroughFocusedAverage: number;
    headsetVrOnlyFocusedAverage: number;
    headsetVrFeedbackFocusedAverage: number;
    headsetPassthroughFocusedStdev: number;
    headsetVrOnlyFocusedStdev: number;
    headsetVrFeedbackFocusedStdev: number;
    headsetPassthroughCount: number;
    headsetVrOnlyCount: number;
    headsetVrFeedbackCount: number;
};

export type SessionRecord = {
    recordId: string;
    group: string;
    focusedPercentages: (number | null | "n/a")[];  // number = %, "n/a" = no feedbacks, null = no analytics
};

export type DetailedSessionRecord = {
    recordId: string;
    group: string;
    sessionNumber: number;
    feedbackCount: number;
    focusedPercentage: number | null | "n/a";
};

export type WeeklyFailureData = {
    weekNum: number;
    successCount: number;
    failedCount: number;
    totalCount: number;
    successPercentage: number;
    failedPercentage: number;
};

class SessionSummaryService {
    public async getStats(): Promise<SessionSummaryStats> {
        const response = await api.get('/session-summary/stats');
        const stats: SessionSummaryStats = {
            laptopPassthroughFocusedAverage: response.data.laptop_passthrough_focused_average,
            laptopVrOnlyFocusedAverage: response.data.laptop_vr_only_focused_average,
            laptopVrFeedbackFocusedAverage: response.data.laptop_vr_feedback_focused_average,
            laptopPassthroughFocusedStdev: response.data.laptop_passthrough_focused_stdev,
            laptopVrOnlyFocusedStdev: response.data.laptop_vr_only_focused_stdev,
            laptopVrFeedbackFocusedStdev: response.data.laptop_vr_feedback_focused_stdev,
            laptopPassthroughCount: response.data.laptop_passthrough_count,
            laptopVrOnlyCount: response.data.laptop_vr_only_count,
            laptopVrFeedbackCount: response.data.laptop_vr_feedback_count,
            headsetPassthroughFocusedAverage: response.data.headset_passthrough_focused_average,
            headsetVrOnlyFocusedAverage: response.data.headset_vr_only_focused_average,
            headsetVrFeedbackFocusedAverage: response.data.headset_vr_feedback_focused_average,
            headsetPassthroughFocusedStdev: response.data.headset_passthrough_focused_stdev,
            headsetVrOnlyFocusedStdev: response.data.headset_vr_only_focused_stdev,
            headsetVrFeedbackFocusedStdev: response.data.headset_vr_feedback_focused_stdev,
            headsetPassthroughCount: response.data.headset_passthrough_count,
            headsetVrOnlyCount: response.data.headset_vr_only_count,
            headsetVrFeedbackCount: response.data.headset_vr_feedback_count,
        };
        return stats;
    }

    public async getRecords(): Promise<SessionRecord[]> {
        const response = await api.get('/session-summary/records');
        const records: SessionRecord[] = response.data.map((record: any) => ({
            recordId: record.record_id,
            group: record.group,
            focusedPercentages: record.focused_percentages,
        }));
        return records;
    }

    public async getDetailedSessions(): Promise<DetailedSessionRecord[]> {
        const response = await api.get('/session-summary/detailed-sessions');
        const detailedSessions: DetailedSessionRecord[] = response.data.map((record: any) => ({
            recordId: record.record_id,
            group: record.group,
            sessionNumber: record.session_number,
            feedbackCount: record.feedback_count,
            focusedPercentage: record.focused_percentage,
        }));
        return detailedSessions;
    }

    public async getWeeklyFailures(): Promise<WeeklyFailureData[]> {
        const response = await api.get('/session-summary/weekly-failures');
        const weeklyFailures: WeeklyFailureData[] = response.data.map((record: any) => ({
            weekNum: record.week_num,
            successCount: record.success_count,
            failedCount: record.failed_count,
            totalCount: record.total_count,
            successPercentage: record.success_percentage,
            failedPercentage: record.failed_percentage,
        }));
        return weeklyFailures;
    }
}
const sessionSummaryService = new SessionSummaryService();

export default sessionSummaryService;
