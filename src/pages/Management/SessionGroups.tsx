import { PageContainer, PageMainContent, PageSectionTitle, PageTitle } from "@/components/layout/Page";
import Sidebar from "@/components/layout/Sidebar";
import { useSessionGroups } from "@/features/session-groups/hooks/useSessionGroups";
import { SessionGroupForm } from "@/features/session-groups/components/SessionGroupForm";
import { SessionGroupCard } from "@/features/session-groups/components/SessionGroupCard";

export default function SessionGroups() {
  const { sessionGroups, onSubmit } = useSessionGroups();

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Session Groups</PageTitle>
        <div className="w-6/12">
          <PageSectionTitle>Existing session groups</PageSectionTitle>
          <ul>
            {sessionGroups.map(sg => (
              <li key={sg.group_name} className="mb-8">
                <SessionGroupCard sessionGroup={sg} />
              </li>
            ))}
          </ul>
        </div>
        <SessionGroupForm onSubmit={onSubmit} />
      </PageMainContent>
    </PageContainer>
  );
}
