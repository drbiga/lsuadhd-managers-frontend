import { PageContainer, PageMainContent, PageTitle } from "@/components/Page";
import Sidebar from "@/components/Sidebar";
import sessionExecutionService, { Student } from "@/services/sessionExecution";
import { useEffect, useState } from "react";

export default function SessionProgressManagementPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);

  useEffect(() => {
    (async () => {
      const response = await sessionExecutionService.getAllStudents();
      setAllStudents(response);
    })()
  }, []);

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Session Progress</PageTitle>
        <div>
          {/* Select student */}
          <div></div>

          {/* Visualization showing all completed sessions at once. Multiple lines on the same chart. */}
          {/* Show a default message saying "Please select student if none was selected" */}
          <div>
            {
              student ? (
                <h2>{student.name}</h2>
              ) : (
                <>
                  <h2>Please select a student</h2>
                </>
              )
            }
          </div>
        </div>
      </PageMainContent>
    </PageContainer>
  );
}