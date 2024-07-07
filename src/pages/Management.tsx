import { PageContainer, PageMainContent, PageTitle } from "../components/Page"
import Sidebar from "../components/Sidebar"

export default function Management() {
    return (
        <PageContainer>
            <Sidebar />
            <PageMainContent>
                <PageTitle>Management</PageTitle>
            </PageMainContent>
        </PageContainer>
    )
}
