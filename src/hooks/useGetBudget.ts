import { useEffect, useState } from "react";
import budgetService, { Budget } from "@/services/budgetService";

export function useGetBudget() {
    const [budget, setBudget] = useState<Budget | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<unknown>(null);

    useEffect(() => {
        const fetch = async () => {
            try {
                const data = await budgetService.getBudget();
                setBudget(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetch();
    }, []);

    return { budget, loading, error };
}