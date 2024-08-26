import { useCallback, useEffect, useState } from "react";
import { PageContainer, PageMainContent, PageTitle } from "@/components/Page"
import Sidebar from "@/components/Sidebar"
import managementService, { Manager } from "@/services/managementService";
import { toast } from "react-toastify";
import { FieldValues, useForm } from "react-hook-form";
import { useAuth } from "@/hooks/auth";

export default function Management() {
  const [managers, setManagers] = useState<Manager[]>([]);

  useEffect(() => {
    (async () => {
      const managersResponse = await managementService.getManagers();
      setManagers(managersResponse);
    })()
  }, []);

  const {
    reset,
    handleSubmit,
    register,
  } = useForm();

  const { authState } = useAuth();

  const onSubmitManager = useCallback(async (data: FieldValues) => {
    try {
      const newManager = await managementService.createManager(data.name);
      setManagers([...managers, newManager]);
    } catch (error) {
      toast.error('Unknown error. Please contact someone');
    }
    reset(data);
  }, [authState, managers]);

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Management</PageTitle>

        <div className="flex gap-16 pr-16 py-8 w-6/12">
          <div className="flex-1">
            <div className="mb-8 flex flex-col">
              <h2 className="text-slate-400 dark:text-slate-600 opacity-70 text-2xl mb-8">Create new manager</h2>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmitManager)}>
                <input
                  type="text"
                  className="bg-accent p-2 rounded-lg"
                  placeholder="Name"
                  {...register("name", { required: true })}
                />
                <input
                  type="text"
                  className="bg-primary p-2 rounded-lg"
                // placeholder="Name"
                // {...register("name", { required: true })}
                />
                <div>
                  <button type="submit" className="float-right bg-accent p-2 rounded-lg hover:bg-accent-foreground hover:text-accent transition-all duration-100">Create</button>
                </div>
              </form>
            </div>

            <h2 className="text-slate-400 dark:text-slate-600 opacity-70 text-2xl mb-8">Existing managers</h2>
            <ul>
              {managers.map(m => (
                <li className="mb-4" key={m.name}>
                  <p>Manager's name: {m.name}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </PageMainContent>
    </PageContainer >
  )
}
