import api from "@/services/api";

export type Budget = {
    value: number;
    date_set: string;
    manager_name: string;
    is_active: boolean;
};

export type CreateBudgetRequest = {
    value: number;
    manager_name: string;
};

const getBudget = async (): Promise<Budget> => {
    const response = await api.get('/management/budget');
    return response.data;
};

const setBudget = async (request: CreateBudgetRequest): Promise<void> => {
    await api.post('/management/budget', request);
};

export default {
    getBudget,
    setBudget,
};
