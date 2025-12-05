import { PageContainer, PageMainContent, PageTitle } from "@/components/layout/Page";
import Sidebar from "@/components/layout/Sidebar";
import { StudentForm } from "@/features/students/components/StudentForm";
import { StudentList } from "@/features/students/components/StudentList";
import { useStudents } from "@/features/students/hooks/useStudents";
import { useSessionGroups } from "@/features/session-groups/hooks/useSessionGroups";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function Students() {
  const { 
    students, 
    activeStudents, 
    lockedUsers,
    loading,
    onSubmitStudent, 
    handleSetSurveyId, 
    handleUnlockUser,
    handleLockUser,
    inputRef,
    refresh
  } = useStudents();
  const { sessionGroups } = useSessionGroups();

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <div className="flex items-center justify-between mb-4">
          <PageTitle>Students</PageTitle>
          <Button onClick={refresh} variant="outline" size="sm" disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
        <div className="w-6/12">
          <StudentForm sessionGroups={sessionGroups} onSubmitStudent={onSubmitStudent} />
          <StudentList 
            students={students} 
            activeStudents={activeStudents} 
            lockedUsers={lockedUsers}
            inputRef={inputRef} 
            handleSetSurveyId={handleSetSurveyId}
            handleUnlockUser={handleUnlockUser}
            handleLockUser={handleLockUser}
          />
        </div>
      </PageMainContent>
    </PageContainer>
  );
}