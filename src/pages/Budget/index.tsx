import Sidebar from "@/components/layout/Sidebar"
import { PageContainer, PageMainContent, PageTitle } from "@/components/layout/Page";
import { BudgetForm } from "@/features/budget/components/BudgetForm";
import { BudgetDisplay } from "@/features/budget/components/BudgetDisplay";
import { useBudget } from "@/features/budget/hooks/useBudget";

export default function Budget() {
  const { budget, setBudgetValue } = useBudget();

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Budget Management</PageTitle>
        <BudgetForm setBudgetValue={setBudgetValue} />
        <BudgetDisplay budget={budget} />
      </PageMainContent>
    </PageContainer>
  );
}