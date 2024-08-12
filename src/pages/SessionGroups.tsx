import { PageContainer, PageMainContent, PageSectionTitle, PageTitle } from "@/components/Page";
import { SessionGroupView, SessionGroupName, SessionGroupCreatorName, SessionGroupDateCreated, SessionGroupPublicLink } from "@/components/SessionGroup";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/auth";
import managementService, { SessionGroup } from "@/services/managementService";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function SessionGroups() {
  const [sessionGroups, setSessionGroups] = useState<SessionGroup[]>([]);

  useEffect(() => {
    (async () => {
      const response = await managementService.getAllSessionGroups();
      setSessionGroups(response);
    })()
  }, []);

  const {
    register,
    reset,
    handleSubmit
  } = useForm();

  const { authState } = useAuth();

  const navigate = useNavigate();

  const onSubmit = useCallback(async (data: FieldValues) => {
    try {
      if (authState.session) {
        const newSessionGroup = await managementService.createSessionGroup({
          group_name: data.group_name,
          creator_manager_name: authState.session.user.username,
          public_link: data.public_link
        });

        setSessionGroups([...sessionGroups, newSessionGroup]);
      } else {
        toast.error('You are not logged in. Something went wrong. Please log out and log in again.')
      }
    } catch {
      toast.error('Error while creating session group')
    }
  }, []);

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Session Groups</PageTitle>

        <div>
          <PageSectionTitle>Existing session groups</PageSectionTitle>
          <ul>
            {sessionGroups.map(sg => (
              <li key={sg.group_name} className="mb-8">
                <SessionGroupView>
                  <SessionGroupName>{sg.group_name}</SessionGroupName>
                  <SessionGroupCreatorName>{sg.creator_manager_name}</SessionGroupCreatorName>
                  <SessionGroupDateCreated>{sg.created_on.toString()}</SessionGroupDateCreated>
                  <SessionGroupPublicLink>{sg.public_link}</SessionGroupPublicLink>
                  <Link>Edit</Link>
                </SessionGroupView>
              </li>
            ))}
          </ul>
        </div>

        <div className="max-w-[600px]">
          <PageSectionTitle>Create new session group</PageSectionTitle>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            <input type="text"
              placeholder="Group name"
              className="bg-primary border-[1px] border-slate-200 dark:border-slate-800 p-2 rounded-lg"
              {...register('group_name')}
            />
            <input type="text"
              placeholder="Public Link"
              className="bg-primary border-[1px] border-slate-200 dark:border-slate-800 p-2 rounded-lg"
              {...register('public_link')}
            />
            <div>
              <button type="submit" className="float-right bg-accent p-2 rounded-lg hover:bg-accent-foreground hover:text-accent transition-all duration-100">Create</button>
            </div>
          </form>
        </div>
      </PageMainContent>
    </PageContainer>
  );
}