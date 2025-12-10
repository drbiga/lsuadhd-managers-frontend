import { PageContainer, PageMainContent, PageTitle } from "@/components/layout/Page";
import Sidebar from "@/components/layout/Sidebar";
import { useSessionProgress } from "@/features/students/hooks/useSessionProgress";
import { StudentSelector } from "@/features/students/components/StudentSelector";
import { SessionProgressDisplay } from "@/features/students/components/SessionProgressDisplay";
import { LoadingScreen } from "@/components/common/LoadingScreen";

export default function SessionProgressManagementPage() {
  const { student, allStudents, handleStudentChange, studentsLoading, studentDataLoading } = useSessionProgress();

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Session Progress</PageTitle>
        
        {studentsLoading ? (
          <LoadingScreen message="Loading students..." />
        ) : allStudents.length === 0 ? (
          <p className="mt-4 text-slate-600 dark:text-slate-400">No students to show.</p>
        ) : (
          <>
            <StudentSelector 
              students={allStudents}
              selectedStudentName={student?.name || null}
              onStudentChange={handleStudentChange}
            />
            {studentDataLoading ? (
              <LoadingScreen message="Loading student data..." />
            ) : student ? (
              <SessionProgressDisplay student={student} />
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