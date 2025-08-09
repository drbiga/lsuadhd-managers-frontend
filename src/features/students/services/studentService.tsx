import api from "@/services/api";
import iamService from "@/services/iam";
import { AxiosError } from "axios";

export type Student = {
    name: string;
    group: string;
    survey_id?: number;
}

export type StudentWithSessionData = {
    name: string;
    sessions: SessionExecutionSession[];
    sessions_analytics: SessionAnalytics[];
    survey_id?: number;
}

export type SessionExecutionSession = {
    seqnum: number;
    start_link: string;
    is_passthrough: boolean;
    has_feedback: boolean;
    no_equipment?: boolean;
    stage: Stage;
    feedbacks: Feedback[];
}

export type SessionAnalytics = {
    session_seqnum: number;
    percentage_time_distracted: number;
    percentage_time_normal: number;
    percentage_time_focused: number;
}

export type Feedback = {
    personal_analytics_data: PersonalAnalyticsData;
    classifier_data: ClassifierData;
    output?: FeedbackType;
}

export enum FeedbackType {
    FOCUSED = 'focused',
    NORMAL = 'normal',
    DISTRACTED = 'distracted'
}

export type PersonalAnalyticsData = {
    num_mouse_clicks: number;
    mouse_move_distance: number;
    mouse_scroll_distance: number;
    num_keyboard_strokes: number;
    attention_feedback: FeedbackType;
}

export type ClassifierData = {
    screenshot: string;
    prediction: FeedbackType;
}

export enum Stage {
    WAITING = 'waiting',
    READCOMP = 'readcomp',
    HOMEWORK = 'homework',
    SURVEY = 'survey',
    FINISHED = 'finished',
}

export type FailedSession = {
    id?: number;
    student_name: string;
    session_seqnum: number;
    original_stage: string;
    ts_started: string;
    ts_detected: string;
    failure_reason: string;
}

class StudentsService {
    public async createStudent(studentName: string, sessionGroupName: string, surveyId?: number): Promise<Student> {
        try {
            const response = await api.post('/management/student', {}, {
                params: {
                    student_name: studentName,
                    session_group_name: sessionGroupName,
                    name_manager_requesting_operation: iamService.getCurrentSession().user.username,
                    survey_id: surveyId || null,
                }
            });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.detail || 'Failed to create student');
            } else {
                throw new Error('There was a problem creating the student');
            }
        }
    }

    public async setStudentSurveyId(studentName: string, surveyId?: number): Promise<void> {
        try {
            await api.put(
                `/management/student/${studentName}/survey_id`,
                {},
                {
                    params: {
                        survey_id: surveyId,
                        name_manager_requesting_operation: iamService.getCurrentSession().user.username,
                    }
                }
            );
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.detail || 'Failed to update survey ID');
            } else {
                throw new Error('Failed to update survey ID');
            }
        }
    }

    public async getStudent(studentName: string): Promise<Student> {
        try {
            const response = await api.get(`/management/student/${studentName}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.detail || 'Failed to get student');
            } else {
                throw new Error('Failed to get student');
            }
        }
    }

    public async getAllStudents(): Promise<Student[]> {
        try {
            const response = await api.get('/management/student', {
                params: {
                    name_manager_requesting_operation: iamService.getCurrentSession().user.username
                }
            });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.detail?.message || error.response?.data.detail || 'Failed to get students');
            } else {
                throw new Error('Unknown error while getting the students');
            }
        }
    }

    public async getAllStudentsWithSessionData(): Promise<StudentWithSessionData[]> {
        try {
            const response = await api.get('/session_execution/students', {
                params: {
                    name_manager_requesting_operation: iamService.getCurrentSession().user.username
                }
            });
            if (!response.data) {
                console.error('Invalid response structure:', response.data);
                return [];
            }
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.detail || 'Failed to get students with session data');
            } else {
                throw new Error('Unknown error while getting the students');
            }
        }
    }

    public async getStudentWithSessionData(studentName: string): Promise<StudentWithSessionData> {
        try {
            const response = await api.get('/session_execution/student', {
                params: {
                    student_name: studentName
                }
            });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.detail || 'Failed to get student session data');
            } else {
                throw new Error('Unknown error while getting the student');
            }
        }
    }

    public async getAllFailedSessions(): Promise<FailedSession[]> {
        try {
            const response = await api.get('/failure_recovery/failed_sessions');
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data.detail || 'Failed to fetch failed sessions');
            } else {
                throw new Error('Unknown error while getting failed sessions');
            }
        }
    }
}

const studentsService = new StudentsService();

export default studentsService;