import api from "@/services/api";

export type SessionSummaryStats = {
    // laptop sessions (1-2)
    laptopPassthroughFocusedAverage: number;
    laptopVrOnlyFocusedAverage: number;
    laptopVrFeedbackFocusedAverage: number;
    laptopPassthroughCount: number;
    laptopVrOnlyCount: number;
    laptopVrFeedbackCount: number;

    // headset sessions (3-12)
    headsetPassthroughFocusedAverage: number;
    headsetVrOnlyFocusedAverage: number;
    headsetVrFeedbackFocusedAverage: number;
    headsetPassthroughCount: number;
    headsetVrOnlyCount: number;
    headsetVrFeedbackCount: number;
};

export type SessionRecord = {
    recordId: string;
    group: string;
    sessions: (number | null)[];
};

export type ProblematicSessionRecord = {
    recordId: string;
    group: string;
    sessionNumber: number;
    feedbackCount: number;
    focusedPercentage: number | null;
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
            laptopPassthroughCount: response.data.laptop_passthrough_count,
            laptopVrOnlyCount: response.data.laptop_vr_only_count,
            laptopVrFeedbackCount: response.data.laptop_vr_feedback_count,
            headsetPassthroughFocusedAverage: response.data.headset_passthrough_focused_average,
            headsetVrOnlyFocusedAverage: response.data.headset_vr_only_focused_average,
            headsetVrFeedbackFocusedAverage: response.data.headset_vr_feedback_focused_average,
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
            sessions: record.sessions,
        }));
        return records;
    }

    public async getProblematicSessions(): Promise<ProblematicSessionRecord[]> {
        const response = await api.get('/session-summary/problematic-sessions');
        const problematicSessions: ProblematicSessionRecord[] = response.data.map((record: any) => ({
            recordId: record.record_id,
            group: record.group,
            sessionNumber: record.session_number,
            feedbackCount: record.feedback_count,
            focusedPercentage: record.focused_percentage,
        }));
        return problematicSessions;
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
