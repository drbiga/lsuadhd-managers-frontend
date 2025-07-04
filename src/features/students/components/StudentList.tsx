import { RefObject } from "react";
import { Button } from "@/components/common/Button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Student } from "../services/studentService";

interface StudentListProps {
  students: Student[];
  inputRef: RefObject<HTMLInputElement>;
  handleSetSurveyId: (studentName: string) => void;
}

export function StudentList({ students, inputRef, handleSetSurveyId }: StudentListProps) {
  return (
    <div>
      <h2 className="text-slate-400 dark:text-slate-600 opacity-70 text-2xl mb-8">
        Existing students
      </h2>
      <ul>
        {students.map((s) => (
          <li
            className="mb-6 p-4 border border-slate-700 rounded-xl bg-slate-800"
            key={s.name}
          >
            <p>
              <span className="font-bold">Student Name:</span> {s.name}
            </p>
            <p>
              <span className="font-bold">Session Group:</span> {s.group}
            </p>
            {typeof s.survey_id === 'number' ? (
              <p>
                <span className="font-bold">Survey ID:</span> {s.survey_id} &nbsp;
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="p-1">Edit ID</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Edit Survey ID</DialogTitle>
                    </DialogHeader>
                    <Input type="number" ref={inputRef} defaultValue={s.survey_id} />
                    <DialogClose className="flex justify-end gap-4">
                      <Button>Cancel</Button>
                      <Button onClick={() => handleSetSurveyId(s.name)}>
                        Save
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </p>
            ) : (
              <p>
                Survey ID: &nbsp;
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="p-1 mt-3">Set one now!</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Survey ID</DialogTitle>
                    </DialogHeader>
                    <Input type="number" ref={inputRef} />
                    <DialogClose className="flex justify-end gap-4">
                      <Button>Cancel</Button>
                      <Button onClick={() => handleSetSurveyId(s.name)}>
                        Save
                      </Button>
                    </DialogClose>
                  </DialogContent>
                </Dialog>
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}