import { PropsWithChildren } from "react";

export function SessionGroupView({ children }: PropsWithChildren) {
  return (
    <div className="flex flex-col gap-2 max-w-[600px] p-4 border-[1px] border-slate-200 dark:border-slate-800 rounded-lg">
      {children}
    </div>
  )
}

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
