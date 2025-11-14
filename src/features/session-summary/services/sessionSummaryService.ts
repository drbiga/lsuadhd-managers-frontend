import api from "@/services/api";

export type SessionSummaryStats = {
    passthroughFocusedAverage: number;
    vrOnlyFocusedAverage: number;
    vrFeedbackFocusedAverage: number;
    passthroughCount: number;
    vrOnlyCount: number;
    vrFeedbackCount: number;
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

class SessionSummaryService {
    public async getStats(): Promise<SessionSummaryStats> {
        const response = await api.get('/session-summary/stats');
        const stats: SessionSummaryStats = {
            passthroughFocusedAverage: response.data.passthrough_focused_average,
            vrOnlyFocusedAverage: response.data.vr_only_focused_average,
            vrFeedbackFocusedAverage: response.data.vr_feedback_focused_average,
            passthroughCount: response.data.passthrough_count,
            vrOnlyCount: response.data.vr_only_count,
            vrFeedbackCount: response.data.vr_feedback_count,
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
}
const sessionSummaryService = new SessionSummaryService();

export default sessionSummaryService;
