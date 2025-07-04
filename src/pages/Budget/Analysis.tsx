import { PageContainer, PageMainContent, PageTitle } from "@/components/layout/Page";
import Sidebar from "@/components/layout/Sidebar";

export default function BudgetAnalysisPage() {
  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Budget Analysis</PageTitle>
        <div>Charts will go here.</div>
      </PageMainContent>
    </PageContainer>
  );
}