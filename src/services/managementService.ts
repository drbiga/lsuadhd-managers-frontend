import api from "./api";
import iamService from "./iam";

export type Manager = {
    name: string;
}

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
}

export type CreateSessionGroupDTO = {
    group_name: string;
    creator_manager_name: string;
    public_link: string;
}

class ManagementService {
    public async createManager(managerName: string): Promise<Manager> {
        const response = await api.post('/management/manager', {
        }, {
            params: {
                manager_name: managerName,
                name_manager_requesting_operation: iamService.getCurrentSession().user.username
            }
        });
        return response.data;
    }

    public async getManagers(): Promise<Manager[]> {
        const response = await api.get('/management/manager', {
            params: {
                name_manager_requesting_operation: iamService.getCurrentSession().user.username
            }
        });
        return response.data;
    }

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
}


const managementService = new ManagementService();

export default managementService;
