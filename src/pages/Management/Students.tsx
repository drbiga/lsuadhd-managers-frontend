import { PageContainer, PageMainContent, PageTitle } from "@/components/Page";
import Sidebar from "@/components/Sidebar";
import { useAuth } from "@/hooks/auth";
import managementService, { SessionGroup, Student } from "@/services/managementService";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [sessionGroups, setSessionGroups] = useState<SessionGroup[]>([]);

  const {
    reset,
    handleSubmit,
    register,
  } = useForm();

  const { authState } = useAuth();

  const onSubmitStudent = useCallback(async (data: FieldValues) => {
    try {
      const newStudent = await managementService.createStudent(data.name, data.sessionGroupName);
      setStudents([...students, newStudent]);
    } catch (error) {
      toast.error('Unknown error. Please contact someone');
    }
    reset(data);
  }, [authState, students]);

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

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Students</PageTitle>

        <div className="w-6/12">
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
                className="bg-primary p-1 border-[1px] border-slate-400 dark:border-slate-600 rounded-md"
                id="sessionGroupName"
                aria-placeholder="Select a session group"
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
      </PageMainContent>
    </PageContainer>
  );
}