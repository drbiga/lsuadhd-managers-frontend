import { PageContainer, PageMainContent, PageTitle } from "@/components/layout/Page";
import Sidebar from "@/components/layout/Sidebar";
import { useSessionProgress } from "@/features/students/hooks/useSessionProgress";
import { StudentSelector } from "@/features/students/components/StudentSelector";
import { SessionProgressDisplay } from "@/features/students/components/SessionProgressDisplay";

export default function SessionProgressManagementPage() {
  const { student, allStudents, handleStudentChange } = useSessionProgress();

  if (!student) {
    return (
      <PageContainer>
        <Sidebar />
        <PageMainContent>
          <PageTitle>Session Progress</PageTitle>
          <p>No students yet available</p>
        </PageMainContent>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Session Progress</PageTitle>
        <StudentSelector 
          students={allStudents}
          selectedStudent={student}
          onStudentChange={handleStudentChange}
        />
        <SessionProgressDisplay student={student} />
      </PageMainContent>
    </PageContainer>
  );
}