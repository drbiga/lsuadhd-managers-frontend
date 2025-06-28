import { useState } from "react";
import { PageContainer, PageMainContent, PageTitle } from "@/components/Page";
import Sidebar from "@/components/Sidebar";
import BudgetManager from "./budgetManager";
import BudgetAnalysis from "./budgetAnalysis";

export default function Finances() {
  const [tab, setTab] = useState<"budget" | "analysis">("budget");

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Budget Management</PageTitle>
        <div className="flex gap-4">
          <select
            value={tab}
            onChange={(e) => setTab(e.target.value as "budget" | "analysis")}
            className="bg-primary p-1 border-[1px] border-slate-400 dark:border-slate-600 rounded-md"
          >
            <option value="budget">Set Budget</option>
            <option value="analysis">View Analysis</option>
          </select>
        </div>
        {tab === "budget" && <BudgetManager />}
        {tab === "analysis" && <BudgetAnalysis />}
      </PageMainContent>
    </PageContainer>
  );
}