import { Link } from "react-router-dom";
import { RouteNames } from "@/Routes";
import { SessionGroup } from "../services/sessionGroupsService";

interface SessionGroupCardProps {
	sessionGroup: SessionGroup;
}

export function SessionGroupCard({ sessionGroup }: SessionGroupCardProps) {
	return (
    <div className="relative flex flex-col gap-2 max-w-[600px] p-4 border border-slate-200 dark:border-slate-800 rounded-lg">
			<h2 className="text-xl">{sessionGroup.group_name}</h2>
			<p className="text-slate-400 dark:text-slate-600">Created By: {sessionGroup.creator_manager_name}</p>
			<p className="text-slate-400 dark:text-slate-600">Created On: {sessionGroup.created_on.toString()}</p>
			<p className="text-slate-400 dark:text-slate-600">
				Public link: {sessionGroup.public_link ? (
				<a href={sessionGroup.public_link} target="_blank">{sessionGroup.public_link}</a>
				) : "No Link"}
			</p>
			<Link
				className="absolute top-3 right-3 py-1 px-3 rounded-md border border-accent hover:bg-accent transition-all duration-100"
				to={RouteNames.INDIVIDUAL_SESSION_GROUP}
				state={{ sessionGroupName: sessionGroup.group_name }}
			>
				Edit
			</Link>
    </div>
	);
}
