import { toast } from "react-toastify";
import api from "@/services/api";
import iamService from "@/services/iam";
import { AxiosError } from "axios";

export type SessionGroup = {
    group_name: string;
    creator_manager_name: string;
    public_link: string;
    created_on: Date;
    sessions: Session[];
}

export type Session = {
    seqnum: number;
    is_passthrough: boolean;
    has_feedback: boolean;
    no_equipment?: boolean;
}

export type CreateSessionGroupDTO = {
    group_name: string;
    creator_manager_name: string;
    public_link: string;
}

class SessionGroupsService {
    public async createSessionGroup(createSessionGroupDTO: CreateSessionGroupDTO): Promise<SessionGroup> {
        const response = await api.post('/management/session_group', createSessionGroupDTO);
        return response.data;
    }

    public async getAllSessionGroups(): Promise<SessionGroup[]> {
        const response = await api.get('/management/session_group', {
            params: {
                name_manager_requesting_operation: iamService.getCurrentSession().user.username
            }
        });

        return response.data;
    }

    public async getSessionGroup(sessionGroupName: string): Promise<SessionGroup> {
        const response = await api.get(`/management/session_group/${sessionGroupName}`, {
            params: {
                manager_name: iamService.getCurrentSession().user.username
            }
        });

        return response.data;
    }

    public async createSession(
        sessionGroupName: string,
        sessionSeqnum: number,
        sessionHasFeedback: boolean,
        sessionIsPassthrough: boolean
    ): Promise<Session> {
        try {
            const response = await api.post('/management/session', {
                session_group_name: sessionGroupName,
                seqnum: sessionSeqnum,
                is_passthrough: sessionIsPassthrough,
                has_feedback: sessionHasFeedback
            }, {
                params: {
                    manager_name: iamService.getCurrentSession().user.username
                }
            });
            return response.data;
        } catch (err) {
            if (err instanceof AxiosError) {
                toast.error(err.response?.data.detail.exception)
                throw new Error(err.response?.data.detail.exception);
            } else {
                toast.error('Something went wrong when trying to create a session')
                throw new Error("Unknown error")
            }
        }
    }
}

const sessionGroupsService = new SessionGroupsService();

export default sessionGroupsService;