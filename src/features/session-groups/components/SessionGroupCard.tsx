import { Link } from "react-router-dom";
import { RouteNames } from "@/Routes";
import { SessionGroup } from "../services/sessionGroupsService";

interface SessionGroupCardProps {
	sessionGroup: SessionGroup;
}

export function SessionGroupCard({ sessionGroup }: SessionGroupCardProps) {
	return (
    <div className="relative flex flex-col gap-3 max-w-[600px] p-6 border border-border rounded-xl bg-card shadow-sm">
			<h2 className="text-xl font-semibold text-foreground">{sessionGroup.group_name}</h2>
			<p className="text-sm text-muted-foreground"><span className="font-medium">Created By:</span> {sessionGroup.creator_manager_name}</p>
			<p className="text-sm text-muted-foreground"><span className="font-medium">Created On:</span> {sessionGroup.created_on.toString()}</p>
			<p className="text-sm text-muted-foreground">
				<span className="font-medium">Public link:</span> {sessionGroup.public_link ? (
				<a href={sessionGroup.public_link} target="_blank" className="text-accent hover:text-accent/80 underline ml-1">{sessionGroup.public_link}</a>
				) : "No Link"}
			</p>
			<Link
				className="absolute top-4 right-4 py-2 px-4 rounded-lg border border-accent text-accent hover:bg-accent hover:text-accent-foreground font-medium transition-colors duration-150"
				to={RouteNames.INDIVIDUAL_SESSION_GROUP}
				state={{ sessionGroupName: sessionGroup.group_name }}
			>
				Edit
			</Link>
    </div>
	);
}
