import axios from "axios";
import api from "./api";
import iamService from "./iam";

export type Student = {
    name: string;
    sessions_done: Session[];
    active_session: Session;
    sessions_analytics: SessionAnalytics[];
}

export type SessionAnalytics = {
    session_seqnum: number;
    percentage_time_distracted: number;
    percentage_time_normal: number;
    percentage_time_focused: number;
}

export type Session = {
    seqnum: number;
    is_passthrough: boolean;
    stage: Stage;
    feedbacks: Feedback[];
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

export type SessionProgressData = {
    stage: Stage;
    remainingTimeSeconds: number;
}

export enum Stage {
    WAITING = 'waiting',
    READCOMP = 'readcomp',
    HOMEWORK = 'homework',
    SURVEY = 'survey',
    FINISHED = 'finished',
}

class SessionExecutionService {
    private websocket: WebSocket | null;

    public constructor() {
        this.websocket = null;
    }

    public async createStudent(studentName: string, studentPassword: string): Promise<Student> {
        const response = await api.post('/session_execution/student', {}, {params: {
            student_name: studentName,
            password: studentPassword
        }});
        return response.data;
    }

    public async getStudent(studentName: string): Promise<Student> {
        const response = await api.get('/session_execution/student', { params: { student_name: studentName } });
        return response.data;
    }

    public async getRemainingSessionsForStudent(studentName: string): Promise<Session[]> {
        const response = await api.get(`/session_execution/student/${studentName}/remaining_sessions`);
        return response.data;
    }

    public async startSessionForStudent(studentName: string, updateCallback: (sessionProgressData: SessionProgressData) => void): Promise<Session> {
        const response = await api.post(`/session_execution/student/${studentName}/session`);

        this.websocket = createWebSocket(studentName);
        this.websocket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            updateCallback({
                stage: data.stage,
                remainingTimeSeconds: data.remaining_time
            });
        });

        await axios.post('http://localhost:8001/collection');

        return response.data;
    }

    public setUpdateCallback(studentName: string, updateCallback: (sessionProgressData: SessionProgressData) => void) {
        if (this.websocket === null) {
            this.websocket = createWebSocket(studentName);
        }
        this.websocket.addEventListener('message', (event) => {
            const data = JSON.parse(event.data);
            console.log(data);
            updateCallback({
                stage: data.stage,
                remainingTimeSeconds: data.remaining_time
            });
        });
    }
}

function createWebSocket(studentName: string): WebSocket {
    const session = iamService.getCurrentSession();
    const socket = new WebSocket(`${import.meta.env.VITE_WEBSOCKET_PROTOCOL}://${import.meta.env.VITE_BACKEND_HOST}:${import.meta.env.VITE_BACKEND_PORT}/session_execution/student/${studentName}/session/observer?token=${session.token}`); // Replace with your actual WebSocket URL

    socket.onopen = () => {
      console.log('WebSocket connection established.');
    };
    
    socket.onclose = (event) => {
        if (event.wasClean) {
            console.log(`WebSocket closed cleanly, code=${event.code}, reason=${event.reason}`);
        } else {
            console.error('WebSocket connection closed unexpectedly');
        }
    };
    
    socket.onerror = (error) => {
        console.error(`WebSocket error: ${error}`);
    };

    return socket;
}


const sessionExecutionService = new SessionExecutionService();

export default sessionExecutionService;
