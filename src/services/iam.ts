import { getLocalStorage, Item, setLocalStorage } from "@/localstorage";
import api from "./api";

enum Role {
    MANAGER = 'manager',
    STUDENT = 'student'
}

type User = {
    username: string;
    password?: string;
    role: Role;
}

type Session = {
    token: string;
    user: User;
}

type Context = {
    name: string;
    roles: Role[];
}

class IamService {
    private currentSession: Session | null;
    private authenticatedUser: User | null;

    public constructor() {
        const sessionString = getLocalStorage(Item.SESSION_OBJ);
        this.currentSession = sessionString ? JSON.parse(sessionString) : null;
        this.authenticatedUser = this.currentSession ? this.currentSession.user : null;
        if (this.currentSession) {
            api.defaults.headers.common.Authorization = `Bearer ${this.currentSession.token}`;
        }
    }

    // public async getRole(username: string, token: string): Promise<Role> {
    //     const response = await api.get(`/iam/user/${username}/role`, {headers: { Authorization: `Bearer ${token}`}});
    //     return response.data;
    // }
    
    public async getSession(sessionToken: string): Promise<Session> {
        const response = await api.get(`/iam/session/${sessionToken}`);
        return response.data;
    }

    public getCurrentSession(): Session {
        if (this.currentSession)
            return this.currentSession;
        else
            throw Error('No running session');
    }
    
    public async createSession(username: string, password: string): Promise<Session> {
        const response = await api.post('/iam/session', {username, password})
        this.currentSession = response.data;
        setLocalStorage(Item.SESSION_OBJ, JSON.stringify(this.currentSession));
        this.authenticatedUser = this.currentSession?.user || null;
        return response.data;
    }

    public async searchContexts(role: Role): Promise<Context[]> {
        const response = await api.post('/iam/context/_search', null, {params: {role}});
        return response.data;
    }
}

const iamService = new IamService();

export default iamService;
