import { useState, useEffect, useCallback } from "react";
import managementService, { SessionGroup, Session } from "../services/sessionGroupsService";
import { toast } from "react-toastify";
import { FieldValues } from "react-hook-form";

export function useSessionGroup(sessionGroupName: string) {
  const [sessionGroup, setSessionGroup] = useState<SessionGroup | null>(null);

  useEffect(() => {
    const fetchSessionGroup = async () => {
      try {
        const response = await managementService.getSessionGroup(sessionGroupName);
        setSessionGroup(response);
      } catch (err) {
        toast.error("Failed to fetch session group");
      }
    };

    if (sessionGroupName) {
      fetchSessionGroup();
    }
  }, [sessionGroupName]);

  const onSubmit = useCallback(
    async (data: FieldValues) => {
      if (!sessionGroup) return;

      try {
        const newSession: Session = await managementService.createSession(
          sessionGroup.group_name,
          parseInt(data.seqnum, 10),
          data.has_feedback === "yes",
          data.is_passthrough === "yes"
        );

        setSessionGroup((prev) =>
          prev
            ? {
              ...prev,
              sessions: [...prev.sessions, newSession],
            }
            : null
        );

        toast.success("Session created successfully!");
      } catch (err) {
        toast.error("Failed to create session");
      }
    },
    [sessionGroup]
  );

  return { sessionGroup, onSubmit };
}