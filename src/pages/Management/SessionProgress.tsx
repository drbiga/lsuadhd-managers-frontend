import { PageContainer, PageMainContent, PageTitle } from "@/components/layout/Page";
import Sidebar from "@/components/layout/Sidebar";
import { useSessionProgress } from "@/features/students/hooks/useSessionProgress";
import { StudentSelector } from "@/features/students/components/StudentSelector";
import { SessionProgressDisplay } from "@/features/students/components/SessionProgressDisplay";
import { LoadingScreen } from "@/components/common/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Lock, Unlock } from "lucide-react";
import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { RouteNames } from "@/Routes";

export default function SessionProgressManagementPage() {
  const { student, allStudents, handleStudentChange, studentsLoading, studentDataLoading, isLocked, handleToggleLock } = useSessionProgress();
  const { studentName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (studentName && !studentsLoading && allStudents.length > 0 && student?.name !== studentName) {
      handleStudentChange(studentName);
    }
  }, [studentName, student, studentsLoading, allStudents, handleStudentChange]);

  const handleStudentSelect = (selectedStudentName: string | null) => {
    if (selectedStudentName) {
      navigate(`${RouteNames.SESSION_PROGRESS}/${selectedStudentName}`);
    } else {
      navigate(RouteNames.SESSION_PROGRESS);
    }
  };

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <div className="sticky top-[-2rem] z-10 bg-background -ml-16 pl-16 pt-[2rem] pr-8 pb-4 mb-4">
          <PageTitle>Session Progress</PageTitle>

          {!studentsLoading && allStudents.length > 0 && student && (
            <div className="flex items-start gap-3 mt-8">
              <StudentSelector
                students={allStudents}
                selectedStudentName={student.name}
                onStudentChange={handleStudentSelect}
              />
              <Button
                onClick={handleToggleLock}
                variant={isLocked ? "default" : "outline"}
                className="h-[42px]"
              >
                {isLocked ? (
                  <>
                    <Lock size={16} className="mr-2" />
                    Unlock
                  </>
                ) : (
                  <>
                    <Unlock size={16} className="mr-2" />
                    Lock
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {studentsLoading ? (
          <LoadingScreen message="Loading students..." />
        ) : allStudents.length === 0 ? (
          <p className="mt-4 text-slate-600 dark:text-slate-400">No students to show.</p>
        ) : (
          <>
            {!student && (
              <StudentSelector
                students={allStudents}
                selectedStudentName={null}
                onStudentChange={handleStudentSelect}
              />
            )}
            {studentDataLoading ? (
              <LoadingScreen message="Loading student data..." />
            ) : student ? (
              <SessionProgressDisplay />
            ) : (
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Select a student to view their session progress.
              </p>
            )}
          </>
        )}
      </PageMainContent>
    </PageContainer>
  );
}