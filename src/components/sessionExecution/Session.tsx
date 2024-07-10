import { forwardRef, LiHTMLAttributes, PropsWithChildren } from "react";
import { Button } from "../Button";
import { cn } from "@/lib/utils";

export function SessionListView({ children }: PropsWithChildren) {

  return (
    <ul className="flex flex-col gap-8 px-2">
      {children}
    </ul>
  )
}

export const SessionItemView = forwardRef<HTMLLIElement, LiHTMLAttributes<HTMLLIElement>>(function SessionItemView({ children, className }) {
  return (
    <li className={cn("bg-card p-4 h-[80vh] w-[70vw] rounded-lg flex flex-col gap-2", className)}>
      {children}
    </li>
  )
});

export function SessionItemStage({ children }: PropsWithChildren) {
  return (
    <p className="text-sm text-slate-500">
      Stage: {children}
    </p>
  )
}

export function SessionItemSeqnum({ children }: PropsWithChildren) {
  return (
    <p className="text-2xl text-slate-700 dark:text-slate-300">
      {/* <SessionAttributeLabel>Session #</SessionAttributeLabel> */}
      Session #{children}
    </p>
  )
}

export function SessionItemComment({ children }: PropsWithChildren) {
  return (
    <p className="text-sm text-slate-500">{children}</p>
  )
}

export function SessionStartButton({ children, onClick }: PropsWithChildren & { onClick(): void }) {
  return (
    <Button
      className={`
        bg-slate-300 hover:bg-slate-500 hover:text-slate-100
        dark:bg-slate-700 dark:hover:bg-slate-400 dark:hover:text-slate-900
        transition-all duration-100
      `}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

// export function SessionAttributeLabel({ children }: PropsWithChildren) {
//     return <span className="text-lg text-slate-700 dark:text-slate-200">{children}</span>
// }

// export function SessionAttributeText({ children }: PropsWithChildren) {
//     return <span className="text-slate-400">{children}</span>
// }
