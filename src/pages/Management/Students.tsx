import { PageContainer, PageMainContent, PageTitle } from "@/components/layout/Page";
import Sidebar from "@/components/layout/Sidebar";
import { StudentForm } from "@/features/students/components/StudentForm";
import { StudentList } from "@/features/students/components/StudentList";
import { useStudents } from "@/features/students/hooks/useStudents";
import { useSessionGroups } from "@/features/session-groups/hooks/useSessionGroups";

export default function Students() {
  const { students, activeStudents, onSubmitStudent, handleSetSurveyId, inputRef } = useStudents();
  const { sessionGroups } = useSessionGroups();

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Students</PageTitle>
        <div className="w-6/12">
          <StudentForm sessionGroups={sessionGroups} onSubmitStudent={onSubmitStudent} />
          <StudentList students={students} activeStudents={activeStudents} inputRef={inputRef} handleSetSurveyId={handleSetSurveyId} />
        </div>
      </PageMainContent>
    </PageContainer>
  );
}