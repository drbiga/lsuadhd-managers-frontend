import { useCallback, useEffect, useState } from "react";
import { useSessionProgress } from "../hooks/useSessionProgress";
import studentsService from "../services/studentService";
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
import { ChevronLeft, ChevronRight, Loader2, Trash2Icon } from "lucide-react";
import { AlertDialogAction } from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";
import managementService from "../services/managementService";

export function SessionProgressDisplay() {
  const {
    student,
    // setStudent,
    descriptions,
    loading,
    selectedSession,
    handleStudentChange,
    fetchImageDescriptions,
    currentImagePage,
    previousImagePage,
    nextImagePage,
    handleDeleteSession,
  } = useSessionProgress();

  const [isLoading, setIsLoading] = useState(false);

  // TODO: DELETE
  useEffect(() => {
    (async () => {
      if (student)
      console.log(
        await managementService.getSessionProgressList(student?.name)
      )
      })()
  }, []);

  const previousImageWrapper = useCallback(() => {
    setIsLoading(true);
    previousImagePage();
  }, [currentImagePage]);

  const nextImageWrapper = useCallback(() => {
    setIsLoading(true);
    nextImagePage();
  }, [currentImagePage]);

  if (student === null) {
    return (
      <p>Please select a student</p>
    )
  }

  const getMissingAnalytics = useCallback(async (sessionNum: number) => {
    await studentsService.getAnalytics(student.name, sessionNum);

    // TODO: move this update into the session progress hook
    // const updatedStudent = await studentsService.getStudentWithSessionData(student.name);
    // setStudent(updatedStudent);

    const updatedStudent = await studentsService.getStudentWithSessionData(student.name);
    handleStudentChange(updatedStudent.name);
  }, [student.name]);

  useEffect(() => {
    console.log('[ SessioProgressDisplay ] New student detected')
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
              <div className="flex justify-between items-center pb-4">
                <p className="text-2xl font-semibold text-foreground">
                  Session #{s.seqnum}
                </p>
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Trash2Icon
                      className="cursor-pointer p-2 outline outline-1 rounded-sm transition-all duration-200 hover:outline-red-600 hover:bg-red-600"

                      size={35}
                    />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Delete session {s.seqnum}
                      </AlertDialogTitle>
                      <AlertDialogDescription className="grid gap-4">
                        <p>You are about to delete student {student.name}'s session {s.seqnum}.</p>
                        <p>This is an <b>irreversible</b> action.</p>
                        <p>Are you SURE you want to do this?</p>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="">
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="transition-all duration-100 hover:bg-red-600 hover:text-white"
                        onClick={() => handleDeleteSession(s.seqnum)}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="mb-4 text-sm text-muted-foreground space-y-0.5">
                <div>
                  <span className="font-medium text-foreground">Completed on:</span>{' '}
                  {s.ts_start
                    ? new Date(s.ts_start).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                    : 'No date recorded'}
                </div>
                <div>
                  <span className="font-medium text-foreground">Started:</span>{' '}
                  {s.ts_start
                    ? new Date(s.ts_start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })
                    : 'No start time recorded'}
                </div>
                <div>
                  <span className="font-medium text-foreground">Ended:</span>{' '}
                  {s.ts_end
                    ? new Date(s.ts_end).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true })
                    : 'No end time recorded'}
                </div>
              </div>
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
                <div className="mt-2 pt-3 border-t border-border">
                  {(() => {
                    const analytics = findAnalytics(student.sessions_analytics, s);
                    const hasAnalytics = analytics !== null;
                    return (
                      <>
                        <div className="text-sm mb-2">
                          <span className="text-muted-foreground">Time focused:</span>{" "}
                          <span className="text-accent font-semibold">
                            {presentPercentage(analytics?.percentage_time_focused, hasAnalytics)}
                          </span>
                        </div>
                        <div className="text-sm mb-2">
                          <span className="text-muted-foreground">Time normal:</span>{" "}
                          <span className="text-foreground font-medium">
                            {presentPercentage(analytics?.percentage_time_normal, hasAnalytics)}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Time distracted:</span>{" "}
                          <span className="text-foreground font-medium">
                            {presentPercentage(analytics?.percentage_time_distracted, hasAnalytics)}
                          </span>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => fetchImageDescriptions(student.name, s.seqnum)}
                    // onClick={() => fetchImage(student.name, s.seqnum, '00832a24-c537-4587-bc9e-1f6e8615905b.jpg')}
                  >
                    View Images
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <AlertDialogHeader>
                    <AlertDialogTitle>Image Descriptions - Session #{s.seqnum}</AlertDialogTitle>
                    <AlertDialogDescription>
                      Generated descriptions ({descriptions.length} loaded)
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="w-full flex gap-8 justify-center items-center">
                    {isLoading && (
                      <div className="w-[400px] h-[200px] flex justify-center items-center">
                        <Loader2 className="animate-spin" width={400} />
                      </div>
                    )}
                    <div>
                      <img
                        // height={50}
                        className={cn(isLoading ? 'hidden' : '')}
                        width={400}
                        // height={200}
                        src={`http://localhost:8000/session_execution/student/session/feedback/screenshot?student_name=${student.name}&session_num=${s.seqnum}&screenshot_path=${s.feedbacks[currentImagePage].classifier_data?.screenshot}`}
                        alt=""
                        onLoad={() => setIsLoading(false)}
                      />
                      <p>{s.feedbacks[currentImagePage].classifier_data?.screenshot}</p>
                    </div>
                    <div className="h-full w-full flex flex-col justify-between">
                      <div>
                        <div className="flex mb-4 items-center gap-4">
                          <h3 className="text-2xl">
                            Screenshot #{currentImagePage}
                          </h3>
                          <div className="flex gap-2">
                            <p className={cn("text-xs rounded-full text-center h-4 px-2",
                              s.feedbacks[currentImagePage].output === 'focused' ? 'bg-green-600' : '',
                              s.feedbacks[currentImagePage].output === 'normal' ? 'bg-yellow-600' : '',
                              s.feedbacks[currentImagePage].output === 'distracted' ? 'bg-red-600' : '',
                            )}>combined</p>
                            <p className={cn("text-xs rounded-full text-center h-4 px-2",
                              s.feedbacks[currentImagePage].classifier_data ? 'bg-gray-900' : '',
                              s.feedbacks[currentImagePage].classifier_data?.prediction === 'focused' ? 'bg-green-600' : '',
                              s.feedbacks[currentImagePage].classifier_data?.prediction === 'normal' ? 'bg-yellow-600' : '',
                              s.feedbacks[currentImagePage].classifier_data?.prediction === 'distracted' ? 'bg-red-600' : '',
                            )}>classifier</p>
                          </div>
                        </div>

                        {loading && descriptions.length === 0 && (
                          <p>Loading...</p>
                        )}
                        {!loading && descriptions.length === 0 && (
                          <p className="outline outline-1 outline-slate-600 p-2 rounded-md min-h-[100px] text-slate-400">No description found</p>
                        )}
                        {!loading && descriptions.length > 0 && (
                          <>
                          <p>{descriptions.filter(d => d.image_path === s.feedbacks[currentImagePage].classifier_data?.screenshot)[0].image_path}</p>
                            <p
                              className="outline outline-1 outline-slate-600 p-2 rounded-md h-[150px] overflow-y-scroll text-slate-400"
                            >
                              {descriptions.filter(d => d.image_path === s.feedbacks[currentImagePage].classifier_data?.screenshot)[0].response}
                            </p>
                          </>
                        )}
                      </div>

                      <div className="flex gap-4">
                        {currentImagePage > 0 && (
                          <ChevronLeft
                            className="p-1 outline-1 outline-gray-300 outline rounded-sm cursor-pointer transition-all duration-100 hover:bg-gray-300 hover:text-black"
                            onClick={() => previousImageWrapper()} />
                        )}
                        {currentImagePage < s.feedbacks.length && (
                          <ChevronRight
                            className="p-1 outline-1 outline-gray-300 outline rounded-sm cursor-pointer transition-all duration-100 hover:bg-gray-300 hover:text-black"
                            onClick={() => nextImageWrapper()} />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* <div className="space-y-4 max-h-96 overflow-y-auto">
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
                  </div> */}

                  <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              {!findAnalytics(student.sessions_analytics, s) && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => getMissingAnalytics(s.seqnum)}
                >
                  Calculate Analytics
                </Button>
              )}
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