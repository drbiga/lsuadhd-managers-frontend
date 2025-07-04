import { PageContainer, PageMainContent, PageTitle } from "@/components/layout/Page";
import Sidebar from "@/components/layout/Sidebar";
import { useLocation } from "react-router-dom";
import { useSessionGroup } from "@/features/session-groups/hooks/useSessionGroup";
import { SessionItem } from "@/features/session-groups/components/SessionItem";
import { useForm } from "react-hook-form";
import { CreateSessionForm } from "@/features/session-groups/components/CreateSessionForm";

export function SessionGroupPage() {
  const { state } = useLocation();
  const { sessionGroup, onSubmit } = useSessionGroup(state.sessionGroupName);
  const { handleSubmit, register } = useForm();

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>{state.sessionGroupName}</PageTitle>
        {sessionGroup && (
          <div>
            <p className="mb-8">Date created: {sessionGroup.created_on.toString()}</p>
            <h2 className="mb-4">Sessions</h2>
            <ul className="grid grid-cols-4 gap-8 pr-16">
              {sessionGroup.sessions.map((s) => (
                <li key={s.seqnum} className="mb-8 flex flex-col gap-4">
                  <SessionItem session={s} />
                </li>
              ))}
            </ul>
            
            <CreateSessionForm
              handleSubmit={handleSubmit}
              register={register}
              onSubmit={onSubmit}
              defaultSeqnum={sessionGroup.sessions.length + 1}
            />
            
          </div>
        )}
      </PageMainContent>
    </PageContainer>
  );
}
