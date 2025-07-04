import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import budgetService, { Budget, CreateBudgetRequest } from "../services/budgetService";
import iamService from "@/services/iam";

export function useBudget() {
  const [budget, setBudget] = useState<Budget>();

  useEffect(() => {
    const fetchBudget = async () => {
      try {
        const fetchedBudget = await budgetService.getBudget();
        setBudget(fetchedBudget);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch budget");
      }
    };

    fetchBudget();
  }, []);

  const setBudgetValue = useCallback(async (value: number) => {
    try {
      const currentUser = iamService.getCurrentSession().user;
      const budgetRequest: CreateBudgetRequest = {
        value,
        manager_name: currentUser.username,
      };
      await budgetService.setBudget(budgetRequest);
      toast.success("Budget set successfully");

      const newBudget = await budgetService.getBudget();
      setBudget(newBudget);

      return true;
    } catch (err) {
      toast.error("Failed to set budget");
      return false;
    } 
  }, []);

  return {
    budget,
    setBudgetValue,
  };
}