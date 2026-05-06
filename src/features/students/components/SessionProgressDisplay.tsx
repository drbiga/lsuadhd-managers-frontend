import { useSessionProgress } from "../hooks/useSessionProgress";
import { Stage } from "../services/studentService";
import { SessionItemChart } from "./SessionProgressChart";
import { ImageDescriptionsDialog } from "./ImageDescriptionsDialog";
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
import { Trash2Icon } from "lucide-react";
import { AlertDialogAction } from "@/components/ui/alert-dialog";

export function SessionProgressDisplay() {
  const {
    student,
    sessionProgress,
    handleDeleteSession,
    handleStopSession,
    handleCalculateAnalytics,
  } = useSessionProgress();

  const presentPercentage = (pct: number | null | undefined, isFinished: boolean): string => {
    if (pct != null) return Math.round(pct * 100) + '%';
    return isFinished ? 'N/A' : '-';
  };

  if (student === null) {
    return (
      <p>Please select a student</p>
    )
  }


  return (
    <div className="mt-8">
      <h2 className="text-4xl mb-8">
        {student.name.charAt(0).toUpperCase() + student.name.slice(1)}
      </h2>

      <ul className="flex flex-col gap-8 px-2">
        {sessionProgress.length > 0 ? sessionProgress.map(s => (
          <li key={s.session_num} className="bg-card border border-border p-6 h-[80vh] w-[70vw] rounded-xl flex shadow-sm">
            <div className="w-[35%] pr-6">
              <div className="flex justify-between items-center pb-4">
                <p className="text-2xl font-semibold text-foreground">
                  Session #{s.session_num}
                </p>
                <div className="flex items-center gap-2">
                  {s.is_stoppable && (
                    <Button
                      variant="outline"
                      className="transition-all duration-100 hover:bg-red-600 hover:text-white"
                      onClick={() => handleStopSession(s.session_num)}
                    >
                      Stop Session
                    </Button>
                  )}
                  {s.is_deleteable && (
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
                            Delete session {s.session_num}
                          </AlertDialogTitle>
                          <AlertDialogDescription className="grid gap-4">
                            <p>You are about to delete student {student.name}'s session {s.session_num}.</p>
                            <p>This is an <b>irreversible</b> action.</p>
                            <p>Are you SURE you want to do this?</p>
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="">
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="transition-all duration-100 hover:bg-red-600 hover:text-white"
                            onClick={() => handleDeleteSession(s.session_num)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>
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
                  <div className="text-sm mb-2">
                    <span className="text-muted-foreground">Time focused:</span>{" "}
                    <span className="text-accent font-semibold">
                      {presentPercentage(s.analytics?.percentage_focused, s.stage === Stage.FINISHED)}
                    </span>
                  </div>
                  <div className="text-sm mb-2">
                    <span className="text-muted-foreground">Time normal:</span>{" "}
                    <span className="text-foreground font-medium">
                      {presentPercentage(s.analytics?.percentage_normal, s.stage === Stage.FINISHED)}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-muted-foreground">Time distracted:</span>{" "}
                    <span className="text-foreground font-medium">
                      {presentPercentage(s.analytics?.percentage_distracted, s.stage === Stage.FINISHED)}
                    </span>
                  </div>
                </div>
              </div>

              <ImageDescriptionsDialog studentName={student.name} sessionNum={s.session_num} />

              {s.analytics === null && (
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => handleCalculateAnalytics(s.session_num)}
                >
                  Calculate Analytics
                </Button>
              )}
            </div>
            <SessionItemChart feedbacks={s.feedbacks} />
          </li>
        )) : (
          <li className="text-slate-600 dark:text-slate-400">No sessions available for this student.</li>
        )}
      </ul>
    </div>
  );
}