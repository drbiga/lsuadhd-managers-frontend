import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import { LoadingScreen } from "@/components/common/LoadingScreen";

import { CodeAssignmentPanel } from "./CodeAssignmentPanel";
import { CodeLegend } from "./CodeLegend";
import { CodingImageGrid } from "./CodingImageGrid";
import { StudentSessionPicker } from "./StudentSessionPicker";
import { useCodingCatalog } from "../hooks/useCodingCatalog";
import { useImageCodes } from "../hooks/useImageCodes";
import { useImageSelection } from "../hooks/useImageSelection";
import { useImageUrls } from "../hooks/useImageUrls";
import type { ImageCode } from "../types";

function imageCountLabel(count: number): string {
  return `${count} image${count === 1 ? "" : "s"}`;
}

export function ImageCodingWorkspace() {
  const catalog = useCodingCatalog();
  const selection = useImageSelection(catalog.images);
  const imageCodes = useImageCodes(catalog.scope);
  const imageUrls = useImageUrls(catalog.scope);

  const [lastViewedImageName, setLastViewedImageName] = useState<string | null>(null);

  useEffect(() => {
    setLastViewedImageName(null);
  }, [catalog.scope]);

  const codesByImage = useMemo(() => {
    const map = new Map<string, ImageCode[]>();

    for (const code of imageCodes.codes) {
      for (const imageName of code.imageNames) {
        const existing = map.get(imageName);
        if (existing) {
          existing.push(code);
        } else {
          map.set(imageName, [code]);
        }
      }
    }

    return map;
  }, [imageCodes.codes]);

  const imageNameSet = useMemo(() => new Set(catalog.images.map((image) => image.name)), [catalog.images]);

  const handleCreateCode = async (text: string) => {
    const selectedImages = catalog.images
      .filter((image) => selection.isSelected(image.name))
      .map((image) => ({ classifierDataId: image.classifierDataId, name: image.name }));

    if (selectedImages.length === 0) {
      return;
    }

    await imageCodes.addCode(text, selectedImages);
    selection.clearSelection();
    toast.success(`Code added to ${imageCountLabel(selectedImages.length)}.`);
  };

  const handleRenameCode = async (codeId: string, text: string) => {
    await imageCodes.updateCode(codeId, text);
    toast.success("Code updated.");
  };

  const handleDeleteCode = async (codeId: string) => {
    await imageCodes.deleteCode(codeId);
    toast.success("Code deleted.");
  };

  const handleSelectCodeImages = (code: ImageCode) => {
    const availableImageNames = code.imageNames.filter((imageName) => imageNameSet.has(imageName));
    selection.selectOnly(availableImageNames);
  };

  if (catalog.studentsLoading && catalog.students.length === 0) {
    return <LoadingScreen message="Loading students..." />;
  }

  return (
    <div className="flex w-full flex-col gap-4 pr-8">
      <StudentSessionPicker
        students={catalog.students}
        studentName={catalog.studentName}
        onStudentChange={catalog.selectStudent}
        sessions={catalog.sessions}
        sessionSeqnum={catalog.sessionSeqnum}
        onSessionChange={catalog.selectSession}
        studentsLoading={catalog.studentsLoading}
        sessionsLoading={catalog.sessionsLoading}
        imagesLoading={catalog.imagesLoading}
        imageCount={catalog.images.length}
      />

      {catalog.error && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {catalog.error}
        </div>
      )}

      {!catalog.scope ? (
        catalog.sessionsLoading ? (
          <LoadingScreen message="Loading sessions..." />
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-card p-8 text-muted-foreground">
            {catalog.students.length === 0
              ? "No students are available for this account."
              : "Select a student and a session to start coding images."}
          </div>
        )
      ) : (
        <>
          <p className="text-xs text-muted-foreground">
            Click an image to zoom in, then click it again to zoom out. Use Previous/Next or the arrow keys to move
            between images while zoomed; the last viewed screenshot stays marked and the grid scrolls back to it when
            it is off-screen. Use the check button on a screenshot to select it. Hold{" "}
            <kbd className="rounded border border-border bg-muted px-1 py-0.5 font-sans text-[11px]">Shift</kbd> and
            click another image to select every image in between. With exactly two images selected, hover either
            selected image or any image between them and use "Select range". Ctrl/Cmd+click toggles a single image.
          </p>

          <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
            <div className="flex min-w-0 flex-1 flex-col gap-4">
              {catalog.imagesLoading ? (
                <LoadingScreen message="Loading screenshots..." />
              ) : (
                <CodingImageGrid
                  images={catalog.images}
                  isSelected={selection.isSelected}
                  lastViewedImageName={lastViewedImageName}
                  onLastViewedChange={setLastViewedImageName}
                  codesByImage={codesByImage}
                  getUrlState={imageUrls.getState}
                  requestImage={imageUrls.requestImage}
                  onImageClick={selection.handleImageClick}
                  onToggleSelect={selection.toggleImage}
                  onSelectBetween={selection.selectRangeBetween}
                />
              )}
            </div>

            <aside className="flex w-full shrink-0 flex-col gap-4 xl:sticky xl:top-4 xl:max-h-[calc(100dvh-2rem)] xl:w-[380px] xl:overflow-hidden">
              <CodeAssignmentPanel
                selectedCount={selection.selectedCount}
                onCreateCode={handleCreateCode}
                onClearSelection={selection.clearSelection}
                disabled={false}
              />
              <CodeLegend
                codes={imageCodes.codes}
                loading={imageCodes.loading}
                error={imageCodes.error}
                onSelectImages={handleSelectCodeImages}
                onRenameCode={handleRenameCode}
                onDeleteCode={handleDeleteCode}
                disabled={false}
              />
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
