import { RefObject, useState } from "react";
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
  const [hideTestStudents, setHideTestStudents] = useState(true);
  const [showActiveOnly, setShowActiveOnly] = useState(false);

  let displayStudents = students;

  if (hideTestStudents) {
    displayStudents = displayStudents.filter(s => !s.name.startsWith('test.'));
  }

  if (showActiveOnly) {
    displayStudents = displayStudents.filter(s => activeStudents.includes(s.name));
  }

  const sortedStudents = [...displayStudents].sort((a, b) => {
    const aIsActive = activeStudents.includes(a.name);
    const bIsActive = activeStudents.includes(b.name);
    const aIsTest = a.name.startsWith('test.');
    const bIsTest = b.name.startsWith('test.');

    if (aIsActive && !bIsActive) return -1;
    if (!aIsActive && bIsActive) return 1;

    if (!aIsTest && bIsTest) return -1;
    if (aIsTest && !bIsTest) return 1;

    return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
  });

  return (
    <div>
      <h2 className="text-muted-foreground text-2xl mb-4 font-medium">
        Existing students
      </h2>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-foreground font-medium">Filters:</span>
        <Button
          size="sm"
          onClick={() => setHideTestStudents(!hideTestStudents)}
          variant="outline"
        >
          {hideTestStudents ? "Show Test Students" : "Hide Test Students"}
        </Button>
        <Button
          size="sm"
          onClick={() => setShowActiveOnly(!showActiveOnly)}
          variant={showActiveOnly ? "default" : "outline"}
        >
          {showActiveOnly ? "Active Only" : "Show All"}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-border">
              <th className="p-3 text-muted-foreground font-medium">Student Name</th>
              <th className="p-3 text-muted-foreground font-medium">Session Group</th>
              <th className="p-3 text-muted-foreground font-medium">Survey ID</th>
              <th className="p-3 text-muted-foreground font-medium">Status</th>
              <th className="p-3 text-muted-foreground font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedStudents.map((s) => {
              const isActive = activeStudents.includes(s.name);
              const isLocked = lockedUsers[s.name] || false;
              return (
                <tr key={s.name} className="border-b border-border">
                  <td className="p-3 text-foreground">{s.name}</td>
                  <td className="p-3 text-foreground">{s.group}</td>
                  <td className="p-3 text-foreground">
                    {typeof s.survey_id === 'number' ? (
                      <span className="flex items-center gap-2">
                        {s.survey_id}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button className="p-1 text-xs">Edit</Button>
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
                      </span>
                    ) : (
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button className="p-1 text-xs">Set ID</Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Set Survey ID</DialogTitle>
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
                    )}
                  </td>
                  <td className="p-3 text-foreground">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        isActive
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                      }`}
                    >
                      {isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-3 text-foreground">
                    {isLocked ? (
                      <Button onClick={() => handleUnlockUser(s.name)} className="text-sm py-1 px-3">
                        Unlock
                      </Button>
                    ) : (
                      <Button onClick={() => handleLockUser(s.name)} className="text-sm py-1 px-3">
                        Lock
                      </Button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}