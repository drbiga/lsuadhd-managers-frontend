import { PageContainer, PageMainContent, PageTitle } from "@/components/layout/Page";
import Sidebar from "@/components/layout/Sidebar";
import { FailedSessionsList } from "@/features/students/components/FailedSessionsList";
import { useFailedSessions } from "@/features/students/hooks/useFailedSessions";

export default function FailedSessions() {
    const { failedSessions, loading} = useFailedSessions();

    return (
        <PageContainer>
            <Sidebar />
            <PageMainContent>
                <PageTitle>Failed Sessions</PageTitle>

                <div className="py-8 pr-16">
                    <FailedSessionsList
                        failedSessions={failedSessions}
                        loading={loading}
                    />
                </div>
            </PageMainContent>
        </PageContainer>
    );
}
