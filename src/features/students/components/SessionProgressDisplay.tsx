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

interface SessionProgressDisplayProps {
  student: StudentWithSessionData;
}

export function SessionProgressDisplay({ student }: SessionProgressDisplayProps) {
  const {
    descriptions,
    loading,
    selectedSession,             
    fetchImageDescriptions,
  } = useSessionProgress();

  return (
    <div className="mt-8">
      <h2 className="text-4xl mb-8">
        {student.name.charAt(0).toUpperCase() + student.name.slice(1)}
      </h2>

      <ul className="flex flex-col gap-8 px-2">
        {student.sessions?.sort((a, b) => a.seqnum - b.seqnum).map(s => (
          <li key={s.seqnum} className="bg-card p-4 h-[80vh] w-[70vw] rounded-lg flex">
            <div className="w-[30%]">
              <p className="text-2xl text-slate-700 dark:text-slate-300">
                Session #{s.seqnum}
              </p>
              <p>
                <span className="text-slate-600 dark:text-slate-400 border-b-[1px]">Overview</span>
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-600">
                Stage: {s.stage.charAt(0).toUpperCase() + s.stage.slice(1)}
              </p>
              <div className="text-sm text-slate-400 dark:text-slate-600">
                Number of feedbacks given: {s.feedbacks.length}
              </div>
              <div className="text-sm text-slate-800 dark:text-slate-200">
                Percentage of time focused: {presentPercentage(findAnalytics(student.sessions_analytics, s)?.percentage_time_focused || 0)}
              </div>
              <div className="text-sm text-slate-400 dark:text-slate-600">
                Percentage of time normal: {presentPercentage(findAnalytics(student.sessions_analytics, s)?.percentage_time_normal || 0)}
              </div>
              <div className="text-sm text-slate-400 dark:text-slate-600">
                Percentage of time distracted: {presentPercentage(findAnalytics(student.sessions_analytics, s)?.percentage_time_distracted || 0)}
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