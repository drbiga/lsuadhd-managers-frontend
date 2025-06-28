import { useState } from "react";
import budgetService, { CreateBudgetRequest } from "@/services/budgetService";

export function useSetBudget() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<unknown>(null);

    const setBudget = async (req: CreateBudgetRequest): Promise<boolean> => {
        setLoading(true);
        try {
            await budgetService.setBudget(req);
            setError(null);
            return true;
        } catch (err) {
            setError(err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { setBudget, loading, error };
}