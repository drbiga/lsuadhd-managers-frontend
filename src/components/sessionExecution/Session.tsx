import { PropsWithChildren } from "react";
import { Button } from "../Button";

export function SessionListView({ children }: PropsWithChildren) {

    return (
        <ul className="flex flex-col gap-8">
            {children}
        </ul>
    )
}

export function SessionListItemView({ children }: PropsWithChildren) {
    return (
        <li className="bg-slate-100 p-4 rounded-lg flex flex-col gap-2">
            {children}
        </li>
    )
}

export function SessionStage({ children }: PropsWithChildren) {
    return (
        <p>
            <SessionAttributeLabel>Stage</SessionAttributeLabel>
            {children}
        </p>
    )
}

export function SessionSeqnum({ children }: PropsWithChildren) {
    return (
        <p>
            <SessionAttributeLabel>Sequence number</SessionAttributeLabel>
            {children}
        </p>
    )
}

export function SessionStartButton({ children, onClick }: PropsWithChildren & { onClick(): void }) {
    return (
        <Button className="bg-accent hover:bg-accent-foreground hover:text-slate-100 transition-all duration-100" onClick={onClick}>{children}</Button>
    )
}

export function SessionAttributeLabel({ children }: PropsWithChildren) {
    return <span className="text-lg text-slate-600 dark:text-slate-200">{children}: </span>
}

export function SessionAttributeText({ children }: PropsWithChildren) {
    return <span className="text-slate-500">{children}</span>
}
