import { PageContainer, PageMainContent, PageTitle } from "@/components/layout/Page"
import Sidebar from "@/components/layout/Sidebar"
import { ManagerForm } from "@/features/management/components/ManagerForm";
import { ManagerList } from "@/features/management/components/ManagerList";
import { useManagers } from "@/features/management/hooks/useManagers";

export default function Management() {
  const { managers, createManager } = useManagers();

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Management</PageTitle>

        <div className="flex gap-16 pr-16 py-8 w-6/12">
          <div className="flex-1">
            <ManagerForm createManager={createManager} />
            <ManagerList managers={managers} />
          </div>
        </div>
      </PageMainContent>
    </PageContainer>
  )
}