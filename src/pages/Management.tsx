import { useCallback, useEffect, useState } from "react";
import { PageContainer, PageMainContent, PageTitle } from "../components/Page"
import Sidebar from "../components/Sidebar"
import managementService, { Manager, SessionGroup, Student } from "@/services/managementService";
import { toast } from "react-toastify";
import { FieldValues, useForm } from "react-hook-form";
import { useAuth } from "@/hooks/auth";

export default function Management() {
  const [managers, setManagers] = useState<Manager[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [sessionGroups, setSessionGroups] = useState<SessionGroup[]>([]);

  useEffect(() => {
    (async () => {
      const managersResponse = await managementService.getManagers();
      setManagers(managersResponse);
    })()
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const studentsResponse = await managementService.getAllStudents();
        if (studentsResponse) {
          setStudents(studentsResponse);
        } else {
          toast.error('Something went wrong while setting the students')
        }
      } catch {
        toast.error('Something went wrong while getting the students')
      }
    })()
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const sessionGroupsResponse = await managementService.getAllSessionGroups();
        if (sessionGroupsResponse) {
          setSessionGroups(sessionGroupsResponse);
        } else {
          toast.error('Something went wrong while getting the students')
        }
      } catch {
        toast.error('Something went wrong while getting this student')
      }
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
      reset();
    }
  }, [authState]);

  const onSubmitStudent = useCallback(async (data: FieldValues) => {
    try {
      const newStudent = await managementService.createStudent(data.name, data.sessionGroupName);
      setStudents([...students, newStudent]);
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

        <div className="flex gap-16 pr-16 py-8">
          {/* ------------------------------------------------------------------------------ */}
          {/* Managers */}
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

          {/* ------------------------------------------------------------------------------ */}
          {/* Students */}
          <div className="flex-1">
            <div className="mb-8 flex flex-col">
              <h2 className="text-slate-400 dark:text-slate-600 opacity-70 text-2xl mb-8">Create new student</h2>
              <form className="flex flex-col gap-4" onSubmit={handleSubmit(onSubmitStudent)}>
                <input
                  type="text"
                  className="bg-accent p-2 rounded-lg"
                  placeholder="Name"
                  {...register("name", { required: true })}
                />
                <select
                  className="bg-primary"
                  id="sessionGroupName"
                  {...register("sessionGroupName", { required: true })}
                >
                  {
                    sessionGroups.map(sg => (
                      <option key={sg.group_name} value={sg.group_name}>{sg.group_name}</option>
                    ))
                  }
                </select>
                <div>
                  <button type="submit" className="float-right bg-accent p-2 rounded-lg hover:bg-accent-foreground hover:text-accent transition-all duration-100">Create</button>
                </div>
              </form>
            </div>

            <h2 className="text-slate-400 dark:text-slate-600 opacity-70 text-2xl mb-8">Existing students</h2>
            <ul>
              {students.map(s => (
                <li className="mb-4" key={s.name}>
                  <p>Student Name: {s.name}</p>
                  <p>Session Group: {s.group}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </PageMainContent>
    </PageContainer >
  )
}
