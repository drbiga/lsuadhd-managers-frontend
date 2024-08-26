import { PageContainer, PageMainContent, PageTitle } from "@/components/Page";
import Sidebar from "@/components/Sidebar";

export default function Students() {
    return (
        <PageContainer>
            <Sidebar />
            <PageMainContent>
                <PageTitle>Students</PageTitle>
            </PageMainContent>
        </PageContainer>
    );
}