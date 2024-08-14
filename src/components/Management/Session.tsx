import { forwardRef, HtmlHTMLAttributes, PropsWithChildren } from "react";

export const SessionView = forwardRef<HTMLDivElement, HtmlHTMLAttributes<HTMLHtmlElement>>(
  function SessionView({ children, className }, _) {
    return (
      <div className="bg-accent rounded-lg p-4">
        {children}
      </div>
    );
  }
)

function AttributeTitle({ children }: PropsWithChildren) {
  return <span className="text-slate-800 dark:text-slate-200">{children}</span>
}

function AttributeValue({ children }: PropsWithChildren) {
  return <span className="text-slate-600 dark:text-slate-400">{children}</span>
}

export function SessionViewSequenceNumber({ children }: PropsWithChildren) {
  return (
    <h2 className="text-2xl text-slate-700 dark:text-slate-300">Sequence number: {children}</h2>
  )
}

export function SessionViewHasFeedback({ children }: PropsWithChildren) {
  return (
    <p><AttributeTitle>Has Feedback</AttributeTitle>: <AttributeValue>{children}</AttributeValue></p>
  )
}

export function SessionViewIsPassthrough({ children }: PropsWithChildren) {
  return <p><AttributeTitle>Is Passthrough</AttributeTitle>: <AttributeValue>{children}</AttributeValue></p>
}
