import api from "./api";

export type Student = {
    name: string;
    sessions_done: Session[];
}

export type Session = {
    seqnum: number;
    is_passthrough: boolean;
    stage: Stage;
}

enum Stage {
    WAITING = 'waiting',
    READCOMP = 'readcomp',
    HOMEWORK = 'homework',
    SURVEY = 'survey',
    FINISHED = 'finished',
}

class SessionExecutionService {
    public constructor() {

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
}

const sessionExecutionService = new SessionExecutionService();

export default sessionExecutionService;
