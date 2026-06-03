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

class BudgetService {
    public async getBudget(): Promise<Budget> {
        const response = await api.get('/budget/');
        return response.data;
    }

    public async setBudget(request: CreateBudgetRequest): Promise<void> {
        await api.post('/budget/', request);
    }
}

const budgetService = new BudgetService();

export default budgetService;
