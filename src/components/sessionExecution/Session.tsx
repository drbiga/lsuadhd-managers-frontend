import { forwardRef, HtmlHTMLAttributes, LiHTMLAttributes, PropsWithChildren } from "react";
import { Button } from "../Button";
import { cn } from "@/lib/utils";

export const SessionListTitle = forwardRef<HTMLHeadingElement, HtmlHTMLAttributes<HTMLHeadingElement>>(
  function SessionListTitle({ children, className }, ref) {
    return <h2 className={cn("text-2xl text-slate-800 dark:text-slate-200 opacity-50", className)}>{children}</h2>
  }
);

export function SessionListView({ children }: PropsWithChildren) {

  return (
    <ul className="flex flex-col gap-8 px-2">
      {children}
    </ul>
  )
}

export const SessionItemView = forwardRef<HTMLLIElement, LiHTMLAttributes<HTMLLIElement>>(function SessionItemView({ children, className }, ref) {
  return (
    <li className={cn("bg-card p-4 h-[80vh] w-[70vw] rounded-lg flex flex-col gap-2", className)}>
      {children}
    </li>
  )
});

export function SessionItemStage({ children }: PropsWithChildren) {
  return (
    <p className="text-sm text-slate-400 dark:text-slate-600">
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
    <p className="text-sm text-slate-400 dark:text-slate-600">{children}</p>
  )
}

export function SessionStartButton({ children, onClick }: PropsWithChildren & { onClick(): void }) {
  return (
    <Button
      className={`
        bg-slate-300 dark:bg-slate-700
        hover:bg-slate-700 hover:text-slate-100 dark:hover:bg-slate-400 dark:hover:text-slate-900
        transition-all duration-100
      `}
      onClick={onClick}
    >
      {children}
    </Button>
  )
}

export const SessionItemNumFeedbacks = forwardRef<HTMLDivElement, HtmlHTMLAttributes<HTMLDivElement>>(({ className, children }, ref) => {
  return (
    <div className={cn(className, "text-sm text-slate-400 dark:text-slate-600")}>
      Number of feedbacks given: {children}
    </div>
  )
});

export const SessionItemPctTimeFocused = forwardRef<HTMLDivElement, HtmlHTMLAttributes<HTMLDivElement>>(({ className, children }, ref) => {
  return (
    <div className={cn(className, "text-sm text-slate-800 dark:text-slate-200")}>
      Percentage of time focused: {children}
    </div>
  )
});

export const SessionItemPctTimeNormal = forwardRef<HTMLDivElement, HtmlHTMLAttributes<HTMLDivElement>>(({ className, children }, ref) => {
  return (
    <div className={cn(className, "text-sm text-slate-400 dark:text-slate-600")}>
      Percentage of time normal: {children}
    </div>
  )
});

export const SessionItemPctTimeDistracted = forwardRef<HTMLDivElement, HtmlHTMLAttributes<HTMLDivElement>>(({ className, children }, ref) => {
  return (
    <div className={cn(className, "text-sm text-slate-400 dark:text-slate-600")}>
      Percentage of time distracted: {children}
    </div>
  )
});
