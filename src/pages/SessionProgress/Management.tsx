import { PageContainer, PageMainContent, PageTitle } from "@/components/Page";
import { SessionItemChart, SessionItemContent, SessionItemNumFeedbacks, SessionItemPctTimeDistracted, SessionItemPctTimeFocused, SessionItemPctTimeNormal, SessionItemSeqnum, SessionItemStage, SessionItemView, SessionListView } from "@/components/sessionExecution/Session";
import Sidebar from "@/components/Sidebar";
import { findAnalytics, presentPercentage } from "@/lib/sessionProgress";
import sessionExecutionService, { Student } from "@/services/sessionExecution";
import { useCallback, useEffect, useState } from "react";

export default function SessionProgressManagementPage() {
  const [student, setStudent] = useState<Student | null>(null);
  const [allStudents, setAllStudents] = useState<Student[]>([]);

  useEffect(() => {
    (async () => {
      const response = await sessionExecutionService.getAllStudents();
      setAllStudents(response);
    })()
  }, []);

  const handleChange = useCallback((e) => {
    setStudent(JSON.parse(e.target.value));
  }, [setStudent]);

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Session Progress</PageTitle>
        <div>
          {/* Select student */}
          <div>
            <select
              name="student_name" id="student_name"
              className="bg-primary py-2 px-4 border-[1px] border-black dark:border-white mb-4 rounded-lg"
              value={student !== null ? student.name : "Select a student"}
              onChange={(e) => handleChange(e)}
            >
              <option value="Select a student option" key="null">Select a student</option>
              {allStudents.map(s => (
                <option className="bg-primary p-2" key={s.name} value={JSON.stringify(s)}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Visualization showing all completed sessions at once. Multiple lines on the same chart. */}
          {/* Show a default message saying "Please select student if none was selected" */}
          <div>
            {
              student ? (
                <div>
                  <h2 className="text-4xl mb-8">{student.name.charAt(0).toUpperCase() + student.name.slice(1)}</h2>
                  <SessionListView>
                    {student.sessions_done.length > 0 && student.sessions_done.length > 0 && student.sessions_done.map(s => (
                      <SessionItemView>
                        <SessionItemContent>
                          <SessionItemSeqnum>{s.seqnum}</SessionItemSeqnum>
                          <p>
                            <span className="text-slate-600 dark:text-slate-400 border-b-[1px]">Overview</span>
                          </p>
                          <SessionItemStage>{s.stage.charAt(0).toUpperCase() + s.stage.slice(1)}</SessionItemStage>
                          <SessionItemNumFeedbacks>{s.feedbacks.length}</SessionItemNumFeedbacks>
                          <SessionItemPctTimeFocused>{presentPercentage(findAnalytics(student.sessions_analytics, s)?.percentage_time_focused || 0)}</SessionItemPctTimeFocused>
                          <SessionItemPctTimeNormal>{presentPercentage(findAnalytics(student.sessions_analytics, s)?.percentage_time_normal || 0)}</SessionItemPctTimeNormal>
                          <SessionItemPctTimeDistracted>{presentPercentage(findAnalytics(student.sessions_analytics, s)?.percentage_time_distracted || 0)}</SessionItemPctTimeDistracted>
                        </SessionItemContent>
                        <SessionItemChart feedbacks={s.feedbacks} />
                      </SessionItemView>
                    ))}
                  </SessionListView>
                </div>
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