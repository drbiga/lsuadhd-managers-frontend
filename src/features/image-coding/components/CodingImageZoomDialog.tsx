import { Check, ChevronLeft, ChevronRight, ImageOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import type { ImageUrlState } from "../hooks/useImageUrls";
import type { CodingImage } from "../types";

type CodingImageZoomDialogProps = {
  image: CodingImage | undefined;
  index: number;
  total: number;
  isSelected: boolean;
  urlState: ImageUrlState | undefined;
  onToggleSelect: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
};

export function CodingImageZoomDialog({
  image,
  index,
  total,
  isSelected,
  urlState,
  onToggleSelect,
  onPrevious,
  onNext,
  onClose,
}: CodingImageZoomDialogProps) {
  const canGoPrevious = index > 0;
  const canGoNext = index < total - 1;

  return (
    <Dialog
      open={Boolean(image)}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <DialogContent
        className="max-h-[95vh] max-w-[95vw] gap-3 overflow-y-auto p-3 sm:max-w-[95vw]"
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" && canGoPrevious) {
            event.preventDefault();
            onPrevious();
          } else if (event.key === "ArrowRight" && canGoNext) {
            event.preventDefault();
            onNext();
          }
        }}
      >
        <DialogTitle className="sr-only">
          {image ? `Screenshot ${index + 1}` : "Screenshot"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Click the image to zoom out. Use the select button to select this screenshot.
        </DialogDescription>

        <div className="relative flex min-h-[45vh] items-center justify-center overflow-hidden rounded-lg bg-slate-900">
          {urlState?.error ? (
            <div className="flex flex-col items-center gap-2 py-12 text-sm text-destructive">
              <ImageOff className="h-8 w-8" />
              <p>Could not load this screenshot.</p>
            </div>
          ) : urlState?.url ? (
            <button
              type="button"
              onClick={onClose}
              title="Click to zoom out"
              aria-label={`Zoom out of screenshot ${index + 1}`}
              className="cursor-zoom-out focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <img
                src={urlState.url}
                alt={`Screenshot ${index + 1}`}
                className="max-h-[80vh] max-w-full object-contain"
              />
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p>Loading image...</p>
            </div>
          )}

          <Button
            size="sm"
            variant={isSelected ? "default" : "secondary"}
            onClick={onToggleSelect}
            aria-pressed={isSelected}
            title={isSelected ? "Deselect this image" : "Select this image"}
            className={cn(
              "absolute bottom-3 left-3 z-10 shadow-lg",
              isSelected && "ring-2 ring-accent/60 ring-offset-2 ring-offset-background",
            )}
          >
            <Check className="h-4 w-4" />
            {isSelected ? "Selected" : "Select image"}
          </Button>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 px-1">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{image?.name}</p>
            <p className="text-xs text-muted-foreground">
              Image {index + 1} of {total} &middot; Click the image to zoom out or use the arrow keys.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button variant="outline" size="sm" onClick={onPrevious} disabled={!canGoPrevious}>
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button variant="outline" size="sm" onClick={onNext} disabled={!canGoNext}>
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={onClose}>
              Zoom out
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
