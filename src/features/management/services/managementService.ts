import api from "@/services/api";
import iamService from "@/services/iam";

export type Manager = {
    name: string;
}

class ManagementService {
    public async setManager(managerName: string): Promise<Manager> {
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
}

const managementService = new ManagementService();

export default managementService;