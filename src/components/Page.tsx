import { PropsWithChildren } from "react";

export function PageContainer({ children }: PropsWithChildren) {
    return (
        <div className="h-[100vh] w-[100vw] flex bg-background">{children}</div>
    )
}


export function PageTitle({ children }: PropsWithChildren) {
    return (
        <h1 className="text-4xl text-slate-800 dark:text-slate-200">{children}</h1>
    )
}

export function PageMainContent({ children }: PropsWithChildren) {
    return (
        <div className="px-16 py-8 flex flex-col gap-8">{children}</div>
    )
}
