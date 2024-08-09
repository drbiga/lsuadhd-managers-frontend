import { PageContainer, PageMainContent, PageTitle } from "@/components/Page";
import Sidebar from "@/components/Sidebar";

export default function SessionGroups() {
  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Session Groups</PageTitle>
      </PageMainContent>
    </PageContainer>
  );
}