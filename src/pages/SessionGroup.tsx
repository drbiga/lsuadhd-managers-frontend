import { SessionView, SessionViewHasFeedback, SessionViewIsPassthrough, SessionViewSequenceNumber } from "@/components/Management/Session";
import { PageContainer, PageMainContent, PageTitle } from "@/components/Page";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/auth";
import managementService, { Session, SessionGroup } from "@/services/managementService";
import { useCallback, useEffect, useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";


export function SessionGroupPage() {
  const [sessionGroup, setSessionGroup] = useState<SessionGroup | null>(null);
  const { state } = useLocation();

  useEffect(() => {
    (async () => {
      const sessionGroupResponse = await managementService.getSessionGroup(state.sessionGroupName);
      setSessionGroup(sessionGroupResponse);
    })();
  }, []);

  const { authState } = useAuth();

  const { handleSubmit, reset, register } = useForm();

  const onSubmit = useCallback(async (data: FieldValues, e) => {
    if (authState.session && sessionGroup) {
      try {
        const newSession = await managementService.createSession(
          sessionGroup.group_name,
          data.seqnum,
          data.has_feedback,
          data.is_passthrough
        );
        const sessionGroupChange: SessionGroup = {
          ...sessionGroup,
          sessions: [...sessionGroup.sessions, newSession]
        }
        setSessionGroup(sessionGroupChange);
      } catch {
        // reset();
        e.preventDefault();
      }

    } else {
      toast.error('Something went wrong while creating this session')
    }
  }, [authState, sessionGroup]);

  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>{state.sessionGroupName}</PageTitle>
        {
          sessionGroup && (
            <div>
              <p className="mb-8">Date created: {sessionGroup.created_on.toString()}</p>
              <h2 className="mb-4">Sessions</h2>
              <ul className="flex flex-wrap gap-16">
                {sessionGroup.sessions.map(s => (
                  <li key={s.seqnum} className="mb-8 flex flex-col gap-4">
                    <SessionView>
                      <SessionViewSequenceNumber>{s.seqnum}</SessionViewSequenceNumber>
                      <SessionViewHasFeedback>{s.has_feedback ? "Yes" : "No"}</SessionViewHasFeedback>
                      <SessionViewIsPassthrough>{s.is_passthrough ? "No" : "Yes"}</SessionViewIsPassthrough>
                    </SessionView>
                  </li>
                ))}
              </ul>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="absolute bottom-8 right-8">Create new session</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Create new session</DialogTitle>
                    <DialogDescription>
                      Set up the new session. Click save when you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="seqnum" className="text-right">
                          Sequence number
                        </Label>
                        <Input
                          id="seqnum"
                          defaultValue={sessionGroup.sessions.length + 1}
                          className="col-span-3"
                          {...register('seqnum')}
                        />
                      </div>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="has_feedback" className="text-right">
                          Has Feedback
                        </Label>
                        <Input
                          id="has_feedback"
                          defaultValue={1}
                          className="col-span-1 p-0 w-4 h-4"
                          type="checkbox"
                          {...register('has_feedback')}
                        />
                      </div>

                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="is_passthrough" className="text-right">
                          Is Passthrough
                        </Label>
                        <Input
                          id="is_passthrough"
                          defaultValue={1}
                          className="col-span-1 p-0 w-4 h-4"
                          type="checkbox"
                          {...register('is_passthrough')}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose>
                        <Button type="submit">Save changes</Button>
                      </DialogClose>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )
        }
      </PageMainContent>
    </PageContainer>
  );
}