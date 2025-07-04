import { useCallback, useEffect, useState } from "react";
import managementService, { SessionGroup } from "../services/sessionGroupsService";
import { toast } from "react-toastify";
import { FieldValues } from "react-hook-form";
import { useAuth } from "@/hooks/auth";

export function useSessionGroups() {
  const [sessionGroups, setSessionGroups] = useState<SessionGroup[]>([]);
  const { authState } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const sessionGroupsResponse = await managementService.getAllSessionGroups();
        if (sessionGroupsResponse) {
          setSessionGroups(sessionGroupsResponse);
        } else {
          toast.error("Something went wrong while getting the students");
        }
      } catch {
        toast.error("Something went wrong while getting this student");
      }
    })();
  }, []);

  const onSubmit = useCallback(async (data: FieldValues) => {
    try {
      if (authState.session) {
        const newSessionGroup = await managementService.createSessionGroup({
          group_name: data.group_name,
          creator_manager_name: authState.session.user.username,
          public_link: data.public_link
        });
        setSessionGroups([...sessionGroups, newSessionGroup]);
        toast.success('Session group created successfully');
      } else {
        toast.error('You are not logged in. Something went wrong. Please log out and log in again.')
      }
    } catch {
      toast.error('Error while creating session group')
    }
  }, [authState.session, sessionGroups]);

  return { sessionGroups, onSubmit };
}