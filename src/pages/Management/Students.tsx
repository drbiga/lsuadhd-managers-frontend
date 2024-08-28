import { Button } from "@/components/Button";
import { PageContainer, PageMainContent, PageTitle } from "@/components/Page";
import Sidebar from "@/components/Sidebar";
import { Dialog, DialogContent, DialogTitle, DialogTrigger, DialogHeader, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth";
import managementService, { SessionGroup, Student } from "@/services/managementService";
import { useCallback, useEffect, useRef, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export default function Students() {
  const [students, setStudents] = useState<Student[]>([]);
  const [sessionGroups, setSessionGroups] = useState<SessionGroup[]>([]);

  const inputRef = useRef(null);

  const {
    reset,
    handleSubmit,
    register,
  } = useForm();

  const { authState } = useAuth();

  const onSubmitStudent = useCallback(async (data: FieldValues) => {
    try {
      const newStudent = await managementService.createStudent(data.name, data.sessionGroupName);
      if (data.surveyQueueLink) {
        managementService.setStudentSurveyQueueLink(newStudent.name, data.surveyQueueLink);
        newStudent.survey_queue_link = data.surveyQueueLink;
      }
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

  const handleSetSurveyQueue = useCallback(async (e, studentName) => {
    await managementService.setStudentSurveyQueueLink(studentName, inputRef.current?.value);
    setStudents(students.map(s => {
      if (s.name === studentName) {
        return {
          ...s,
          survey_queue_link: inputRef.current?.value
        }
      } else {
        return s
      }
    }))
  }, [inputRef, students]);

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
              <input
                type="text"
                placeholder="Survey queue link (optional)"
                className="bg-accent p-2 rounded-lg"
                {...register('surveyQueueLink', { required: false })}
              />
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
                {s.survey_queue_link ? (
                  <p>Survey Queue: {s.survey_queue_link}</p>
                ) : (
                  <p>
                    Survey Queue: &nbsp;
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="p-1">Set one now!</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Survey queue</DialogTitle>
                        </DialogHeader>
                        <Input ref={inputRef} />
                        <DialogClose className="flex justify-end gap-4">
                          <Button>Cancel</Button>
                          <Button onClick={(e) => handleSetSurveyQueue(e, s.name)}>Save</Button>
                        </DialogClose>
                      </DialogContent>
                    </Dialog>
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </PageMainContent>
    </PageContainer>
  );
}