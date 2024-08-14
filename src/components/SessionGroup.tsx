import { cn } from "@/lib/utils";
import { RouteNames } from "@/Routes";
import { forwardRef, HtmlHTMLAttributes, PropsWithChildren } from "react";
import { Link } from "react-router-dom";

export const SessionGroupView = forwardRef<HTMLDivElement, HtmlHTMLAttributes<HTMLHtmlElement>>(
  function SessionGroupView({ className, children }, _) {
    return (
      <div className={cn(className, "flex flex-col gap-2 max-w-[600px] p-4 border-[1px] border-slate-200 dark:border-slate-800 rounded-lg")}>
        {children}
      </div>
    )
  }
)

export function SessionGroupName({ children }: PropsWithChildren) {
  return (
    <h2 className="text-xl">{children}</h2>
  )
}

export function SessionGroupCreatorName({ children }: PropsWithChildren) {
  return (
    <p className="text-slate-400 dark:text-slate-600">Created By: {children}</p>
  )
}

export function SessionGroupDateCreated({ children }: PropsWithChildren) {
  return (
    <p className="text-slate-400 dark:text-slate-600">Created On: {children}</p>
  )
}

export function SessionGroupPublicLink({ children }: PropsWithChildren) {
  if (children) {
    return (
      <p className="text-slate-400 dark:text-slate-600">Public link: <a href={children.toString()} target="blank">{children}</a></p>

    )
  } else {
    return (
      <p className="text-slate-400 dark:text-slate-600">Public link: No Link???</p>
    )
  }
}

export function SessionGroupEditButton({ sessionGroupName }: { sessionGroupName: string }) {
  return (
    <Link
      className="absolute top-3 right-3 py-1 px-3 rounded-md border-[1px] border-accent hover:bg-accent transition-all duration-100"
      to={RouteNames.INDIVIDUAL_SESSION_GROUP}
      state={{
        sessionGroupName
      }}
    >
      Edit
    </Link>
  )
}
