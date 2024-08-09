import { useCallback, useEffect, useState } from "react";
import { PageContainer, PageMainContent, PageTitle } from "../components/Page"
import Sidebar from "../components/Sidebar"
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
    formState: { errors },
  } = useForm();

  const { authState } = useAuth();

  const onSubmit = useCallback(async (data: FieldValues) => {
    try {
      const newManager = await managementService.createManager(data.name);
      setManagers([...managers, newManager]);
    } catch (error) {
      toast.error('Unknown error. Please contact someone');
      reset();
    }
  }, [authState]);

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Management</PageTitle>

        <div>
          <h2 className="text-slate-400 dark:text-slate-600 opacity-70 text-2xl mb-8">Existing managers</h2>
          <ul>
            {managers.map(m => (
              <li className="mb-4" key={m.name}>
                {m.name}
              </li>
            ))}
          </ul>
          <div className="max-w-80 flex flex-col">
            <h2 className="text-slate-400 dark:text-slate-600 opacity-70 text-2xl mb-8">Create new manager</h2>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
              <input
                type="text"
                className="bg-accent p-2 rounded-lg"
                placeholder="Name"
                {...register("name", { required: true })}
              />
              <div>
                <button type="submit" className="float-right bg-accent p-2 rounded-lg hover:bg-accent-foreground hover:text-accent transition-all duration-100">Create</button>
              </div>
            </form>
          </div>
        </div>
      </PageMainContent>
    </PageContainer >
  )
}
