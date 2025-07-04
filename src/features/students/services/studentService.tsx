import { toast } from "react-toastify";
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

class StudentsService {
    public async createStudent(studentName: string, sessionGroupName: string, surveyId?: number): Promise<Student> {
        let response;
        try {
            response = await api.post('/management/student', {}, {
                params: {
                    student_name: studentName,
                    session_group_name: sessionGroupName,
                    name_manager_requesting_operation: iamService.getCurrentSession().user.username,
                    survey_id: surveyId || null,
                }
            });
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.detail)
                throw new Error(error.response?.data.detail)
            } else {
                throw new Error('There was a problem creating the student')
            }
        }

        return response.data;
    }

    public async setStudentSurveyId(studentName: string, surveyId?: number): Promise<void> {
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
    }

    public async getStudent(studentName: string): Promise<Student> {
        const response = await api.get(`/management/student/${studentName}`);
        return response.data;
    }

    public async getAllStudents(): Promise<Student[]> {
        try {
            const response = await api.get('/management/student', {
                params: {
                    name_manager_requesting_operation: iamService.getCurrentSession().user.username
                }
            })
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.detail.exception)
                throw new Error(error.response?.data.detail.message)
            } else {
                toast.error('Unknown error while getting the students')
                throw error
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
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                toast.error(error.response?.data.detail);
                throw new Error(error.response?.data.detail);
            } else {
                toast.error('Unknown error while getting the students');
                throw error;
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
                toast.error(error.response?.data.detail);
                throw new Error(error.response?.data.detail);
            } else {
                toast.error('Unknown error while getting the student');
                throw error;
            }
        }
    }
}

const studentsService = new StudentsService();

export default studentsService;