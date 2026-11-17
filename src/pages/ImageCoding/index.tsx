import { PageContainer, PageMainContent, PageTitle } from "@/components/layout/Page";
import Sidebar from "@/components/layout/Sidebar";
import { ImageCodingWorkspace } from "@/features/image-coding/components/ImageCodingWorkspace";

export default function ImageCoding() {
  return (
    <PageContainer>
      <Sidebar />
      <PageMainContent>
        <PageTitle>Image Coding</PageTitle>
        <ImageCodingWorkspace />
      </PageMainContent>
    </PageContainer>
  );
}
