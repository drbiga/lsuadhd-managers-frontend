import { PropsWithChildren } from "react";

export function PageContainer({ children }: PropsWithChildren) {
    return (
        <div className="h-[100vh] w-[100vw] flex bg-background relative">{children}</div>
    )
}


export function PageTitle({ children }: PropsWithChildren) {
    return (
        <h1 className="text-4xl font-semibold text-foreground tracking-tight">{children}</h1>
    )
}

export function PageMainContent({ children }: PropsWithChildren) {
    return (
        <div className="w-full pl-16 py-8 flex flex-col gap-8 overflow-y-auto">{children}</div>
    )
}


export function PageSectionTitle({ children }: PropsWithChildren) {
    return <h2 className="text-muted-foreground text-2xl mb-8 font-medium">{children}</h2>
}
