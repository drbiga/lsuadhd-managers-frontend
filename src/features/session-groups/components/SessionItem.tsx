import { Session } from "../services/sessionGroupsService";

interface SessionItemProps {
  session: Session;
}

export function SessionItem(props: SessionItemProps) {
  const { session } = props;

  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h2 className="text-2xl text-foreground">
        Sequence number: {session.seqnum}
      </h2>
      <p className="text-foreground">Has Feedback: {session.has_feedback ? "Yes" : "No"}</p>
      <p className="text-foreground">Is Passthrough: {session.is_passthrough ? "Yes" : "No"}</p>
      <p className="text-foreground">No Equipment: {session.no_equipment ? "Yes" : "No"}</p>
    </div>
  );
}
