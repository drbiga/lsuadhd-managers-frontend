import api from "./api";

export type Stats = {
    countStudents: number;
    totalCountRecordsUi: number;
    totalCountRecordsWa: number;
    allStudentsStats: StudentStats[];
}

export type StudentStats = {
    name: string;
    countRecordsUi: number;
    countRecordsWa: number;

}

class TrackingService {
    public async getStats(): Promise<Stats> {
        const response = await api.get('/tracking/stats');
        const trackingData: Stats = {
            countStudents: response.data.count_students,
            totalCountRecordsUi: response.data.total_count_records_ui,
            totalCountRecordsWa: response.data.total_count_records_wa,
            allStudentsStats: response.data.all_students_stats.map(ss => ({
                name: ss.name,
                countRecordsUi: ss.count_records_ui,
                countRecordsWa: ss.count_records_wa
            }))
        }
        return trackingData;
    }
}

const trackingService = new TrackingService();

export default trackingService;
