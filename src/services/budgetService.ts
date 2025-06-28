import axios from "axios";

const API_URL = "http://localhost:8000/management/budget";

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
    const res = await axios.get(API_URL);
    return res.data;
};

const setBudget = async (request: CreateBudgetRequest): Promise<void> => {
    await axios.post(API_URL, request);
};

export default {
    getBudget,
    setBudget,
};
