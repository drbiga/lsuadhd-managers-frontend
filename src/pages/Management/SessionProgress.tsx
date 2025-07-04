import { PageContainer, PageMainContent, PageTitle } from "@/components/layout/Page";
import Sidebar from "@/components/layout/Sidebar";
import { useSessionProgress } from "@/features/students/hooks/useSessionProgress";
import { StudentSelector } from "@/features/students/components/StudentSelector";
import { SessionProgressDisplay } from "@/features/students/components/SessionProgressDisplay";

export default function SessionProgressManagementPage() {
  const { student, allStudents, handleStudentChange, loading } = useSessionProgress();

  if (loading) {
    return (
      <PageContainer>
        <Sidebar />
        <PageMainContent>
          <PageTitle>Session Progress</PageTitle>
          <p className="mt-4 text-slate-600 dark:text-slate-400">Loading students...</p>
        </PageMainContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Session Progress</PageTitle>

        {!allStudents || allStudents.length === 0 ? (
          <p className="mt-4 text-slate-600 dark:text-slate-400">No students to show.</p>
        ) : (
          <>
            <StudentSelector 
              students={allStudents}
              selectedStudent={student || allStudents[0]}
              onStudentChange={handleStudentChange}
            />
            {student ? (
              <SessionProgressDisplay student={student} />
            ) : (
              <p className="mt-4 text-slate-600 dark:text-slate-400">
                Please select a student to view their session progress.
              </p>
            )}
          </>
        )}
      </PageMainContent>
    </PageContainer>
  );
}