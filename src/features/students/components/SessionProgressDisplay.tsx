import { useSessionProgress } from "../hooks/useSessionProgress";
import { StudentWithSessionData } from "../services/studentService";
import { SessionItemChart } from "./SessionProgressChart";
import { findAnalytics, presentPercentage } from "../lib/sessionProgress";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

import studentsService from "../services/studentService";
import { useCallback, useState } from "react";
import { useStudents } from "../hooks/useStudents";

interface SessionProgressDisplayProps {
  student: StudentWithSessionData;
}

export function SessionProgressDisplay({ student: _student }: SessionProgressDisplayProps) {
  const [student, setStudent] = useState(_student);

  const {
    descriptions,
    loading,
    selectedSession,
    fetchImageDescriptions,
  } = useSessionProgress();

  const getMissingAnalytics = useCallback(async (studentName: string, sessionNum: number) => {
    const analytics = await studentsService.getAnalytics(studentName, sessionNum);
    const newStudent: StudentWithSessionData = {
      ...student,
      sessions_analytics: [
        ...(student.sessions_analytics),
        analytics
      ]
    }
    setStudent(newStudent);
  }, [student]);

  return (
    <div className="mt-8">
      <h2 className="text-4xl mb-8">
        {student.name.charAt(0).toUpperCase() + student.name.slice(1)}
      </h2>

      <ul className="flex flex-col gap-8 px-2">
        {student.sessions?.sort((a, b) => a.seqnum - b.seqnum).map(s => (
          <li key={s.seqnum} className="bg-card border border-border p-6 h-[80vh] w-[70vw] rounded-xl flex shadow-sm">
            <div className="w-[35%] pr-6">
              <p className="text-2xl font-semibold text-foreground mb-4">
                Session #{s.seqnum}
              </p>
              <div className="mb-4">
                <span className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Overview
                </span>
              </div>
              <div className="flex flex-col gap-3">
                <div className="text-sm">
                  <span className="text-muted-foreground">Stage:</span>{" "}
                  <span className="text-foreground font-medium">
                    {s.stage.charAt(0).toUpperCase() + s.stage.slice(1)}
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-muted-foreground">Feedbacks:</span>{" "}
                  <span className="text-foreground font-medium">{s.feedbacks.length}</span>
                </div>
                <div className="mt-2 pt-3 border-t border-border grid grid-cols-2">
                  <div className="">
                    <div className="text-sm mb-2">
                      <span className="text-muted-foreground">Time focused:</span>{" "}
                      <span className="text-accent font-semibold">
                        {presentPercentage(findAnalytics(student.sessions_analytics, s)?.percentage_time_focused || 0)}
                      </span>
                    </div>
                    <div className="text-sm mb-2">
                      <span className="text-muted-foreground">Time normal:</span>{" "}
                      <span className="text-foreground font-medium">
                        {presentPercentage(findAnalytics(student.sessions_analytics, s)?.percentage_time_normal || 0)}
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="text-muted-foreground">Time distracted:</span>{" "}
                      <span className="text-foreground font-medium">
                        {presentPercentage(findAnalytics(student.sessions_analytics, s)?.percentage_time_distracted || 0)}
                      </span>
                    </div>
                  </div>
                  <div>
                    {!findAnalytics(student.sessions_analytics, s) && (
                      // <button className="float-right bg-background p-2 rounded-md outline-10 outline-black">Calculate</button>
                      <Button
                        variant="outline"
                        className="float-right"
                        onClick={() => getMissingAnalytics(student.name, s.seqnum)}
                      >
                        Calculate
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => fetchImageDescriptions(student.name, s.seqnum)}
                  >
                    View Image Descriptions
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Image Descriptions - Session #{s.seqnum}</AlertDialogTitle>
                    <AlertDialogDescription>
                      OpenAI-generated descriptions ({descriptions.length} loaded)
                    </AlertDialogDescription>
                  </AlertDialogHeader>

                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {loading && descriptions.length === 0 ? (
                      <p>Loading...</p>
                    ) : descriptions.length === 0 ? (
                      <p>No descriptions found.</p>
                    ) : (
                      <>
                        {descriptions.map((desc, index) => (
                          <div key={index} className="border rounded p-4">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                #{index + 1}
                              </span>
                              <span className="text-sm text-gray-500">
                                {new Date(desc.created_at).toLocaleString()}
                              </span>
                            </div>
                            <p>{desc.response}</p>
                          </div>
                        ))}
                        <div className="flex justify-center mt-4">
                          <Button
                            variant="outline"
                            onClick={() => selectedSession && fetchImageDescriptions(student.name, selectedSession, true)}
                            disabled={loading}
                          >
                            {loading ? "Loading..." : "Load More"}
                          </Button>
                        </div>
                      </>
                    )}
                  </div>

                  <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <SessionItemChart feedbacks={s.feedbacks} />
          </li>
        )) || (
            <li className="text-slate-600 dark:text-slate-400">No sessions available for this student.</li>
          )}
      </ul>
    </div>
  );
}