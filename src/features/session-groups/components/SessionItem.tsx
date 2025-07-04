import { Session } from "../services/sessionGroupsService";

interface SessionItemProps {
  session: Session;
}

export function SessionItem(props: SessionItemProps) {
  const { session } = props;

  return (
    <div className="bg-accent rounded-lg p-4">
      <h2 className="text-2xl text-slate-700 dark:text-slate-300">
        Sequence number: {session.seqnum}
      </h2>
      <p>Has Feedback: {session.has_feedback ? "Yes" : "No"}</p>
      <p>Is Passthrough: {session.is_passthrough ? "Yes" : "No"}</p>
      <p>No Equipment: {session.no_equipment ? "Yes" : "No"}</p>
    </div>
  );
}
