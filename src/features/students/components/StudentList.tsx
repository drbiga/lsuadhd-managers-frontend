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
  activeStudents: string[];
  lockedUsers: Record<string, boolean>;
  inputRef: RefObject<HTMLInputElement>;
  handleSetSurveyId: (studentName: string) => void;
  handleUnlockUser: (studentName: string) => void;
  handleLockUser: (studentName: string) => void;
}

export function StudentList({ students, activeStudents, lockedUsers, inputRef, handleSetSurveyId, handleUnlockUser, handleLockUser}: StudentListProps) {
  return (
    <div>
      <h2 className="text-muted-foreground text-2xl mb-8 font-medium">
        Existing students
      </h2>
      <ul>
        {students.map((s) => {
          const isActive = activeStudents.includes(s.name);
          const isLocked = lockedUsers[s.name] || false;
          return (
            <li
              className="mb-6 p-6 border border-border rounded-xl bg-card shadow-sm"
              key={s.name}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="font-semibold text-foreground">Student Name:</span> <span className="text-foreground">{s.name}</span>
                <span 
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    isActive 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}
                >
                  {isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <p className="text-foreground mb-2">
                <span className="font-semibold">Session Group:</span> {s.group}
              </p>
            {typeof s.survey_id === 'number' ? (
              <p className="text-foreground">
                <span className="font-semibold">Survey ID:</span> {s.survey_id} &nbsp;
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
              <p className="text-foreground">
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
            <div className="relative">
              <div className="absolute bottom-20 right-0">
                {isLocked ? (
                  <Button onClick={() => handleUnlockUser(s.name)} className="text-sm py-1 px-3">
                    Unlock
                  </Button>
                ) : (
                  <Button onClick={() => handleLockUser(s.name)} className="text-sm py-1 px-3">
                    Lock
                  </Button>
                )}
              </div>
            </div>
          </li>
          );
        })}
      </ul>
    </div>
  );
}