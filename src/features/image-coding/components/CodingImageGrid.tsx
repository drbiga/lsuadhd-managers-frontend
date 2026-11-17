import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Eye, ImageOff, Loader2 } from "lucide-react";

import { cn } from "@/lib/utils";

import { CodeDotRow } from "./CodeBadges";
import { CodingImageZoomDialog } from "./CodingImageZoomDialog";
import type { ImageUrlState } from "../hooks/useImageUrls";
import type { SelectionClick } from "../hooks/useImageSelection";
import type { CodingImage, ImageCode } from "../types";

type CodingImageTileProps = {
  image: CodingImage;
  index: number;
  isSelected: boolean;
  isLastViewed: boolean;
  codes: ImageCode[];
  urlState: ImageUrlState | undefined;
  requestImage: (imageName: string) => void;
  registerTile: (imageName: string, element: HTMLDivElement | null) => void;
  onImageClick: (imageName: string, event: SelectionClick) => void;
  onZoom: (imageName: string) => void;
  onToggleSelect: (imageName: string) => void;
  selectBetween: { firstImageName: string; secondImageName: string } | null;
  onSelectBetween: (firstImageName: string, secondImageName: string) => void;
};

function CodingImageTile({
  image,
  index,
  isSelected,
  isLastViewed,
  codes,
  urlState,
  requestImage,
  registerTile,
  onImageClick,
  onZoom,
  onToggleSelect,
  selectBetween,
  onSelectBetween,
}: CodingImageTileProps) {
  const tileRef = useRef<HTMLDivElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = tileRef.current;
    if (!element || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (isVisible) {
      requestImage(image.name);
    }
  }, [isVisible, image.name, requestImage]);

  useEffect(() => {
    registerTile(image.name, tileRef.current);
    return () => registerTile(image.name, null);
  }, [image.name, registerTile]);

  return (
    <div
      ref={tileRef}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg border-2 bg-card transition-all",
        isSelected
          ? "border-accent ring-2 ring-accent/50"
          : isLastViewed
            ? "border-sky-500 ring-2 ring-sky-500/30"
            : "border-border hover:border-accent/60",
      )}
    >
      <button
        type="button"
        aria-label={`Zoom into screenshot ${index + 1}`}
        title="Click to zoom in"
        onClick={(event) => {
          if (event.shiftKey || event.metaKey || event.ctrlKey) {
            onImageClick(image.name, event);
            return;
          }
          onZoom(image.name);
        }}
        className="flex w-full cursor-zoom-in flex-col text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <div className="relative flex aspect-[16/10] w-full items-center justify-center bg-slate-200 dark:bg-slate-800">
          {urlState?.url ? (
            <img
              src={urlState.url}
              alt={`Screenshot ${index + 1}`}
              className="h-full w-full object-contain"
            />
          ) : urlState?.error ? (
            <ImageOff className="h-6 w-6 text-destructive" />
          ) : (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          )}

          <span className="absolute left-2 top-2 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
            {index + 1}
          </span>

          {isLastViewed && (
            <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-full bg-sky-600 px-2 py-0.5 text-[10px] font-semibold text-white shadow-sm">
              <Eye className="h-3 w-3" />
              Last viewed
            </span>
          )}
        </div>

        <div className="flex min-h-[28px] items-center gap-1 bg-card px-2 py-1.5">
          {codes.length > 0 ? (
            <CodeDotRow codes={codes} />
          ) : (
            <span className="text-[10px] text-muted-foreground">No codes</span>
          )}
        </div>
      </button>

      <button
        type="button"
        aria-pressed={isSelected}
        aria-label={`${isSelected ? "Deselect" : "Select"} screenshot ${index + 1}`}
        title={isSelected ? "Deselect this image" : "Select this image"}
        onClick={() => onToggleSelect(image.name)}
        className={cn(
          "absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white/80 shadow-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isSelected
            ? "bg-accent text-accent-foreground"
            : "bg-black/25 text-transparent hover:bg-black/50 hover:text-white/80",
        )}
      >
        <Check className="h-4 w-4" />
      </button>

      {selectBetween && (
        <button
          type="button"
          title="Select every screenshot between the two selected images"
          onClick={() => onSelectBetween(selectBetween.firstImageName, selectBetween.secondImageName)}
          className="pointer-events-none absolute left-1/2 top-2 z-10 inline-flex -translate-x-1/2 items-center rounded-full bg-primary px-2 py-1 text-[10px] font-semibold text-primary-foreground opacity-0 shadow-md transition-opacity group-hover:pointer-events-auto group-hover:opacity-100 focus-visible:pointer-events-auto focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Select range
        </button>
      )}
    </div>
  );
}

type CodingImageGridProps = {
  images: CodingImage[];
  isSelected: (imageName: string) => boolean;
  lastViewedImageName: string | null;
  onLastViewedChange: (imageName: string) => void;
  codesByImage: Map<string, ImageCode[]>;
  getUrlState: (imageName: string) => ImageUrlState | undefined;
  requestImage: (imageName: string) => void;
  onImageClick: (imageName: string, event: SelectionClick) => void;
  onToggleSelect: (imageName: string) => void;
  onSelectBetween: (firstImageName: string, secondImageName: string) => void;
};

/**
 * Number of screenshots to keep loaded on either side of the zoomed image.
 * Navigating in the zoom dialog preloads this window so moving to a
 * neighbouring image never has to wait for a download.
 */
const ZOOM_PREFETCH_RADIUS = 5;

function getScrollContainer(element: HTMLElement): HTMLElement | null {
  let parent = element.parentElement;

  while (parent) {
    const { overflowY } = window.getComputedStyle(parent);
    if ((overflowY === "auto" || overflowY === "scroll") && parent.scrollHeight > parent.clientHeight) {
      return parent;
    }
    parent = parent.parentElement;
  }

  return null;
}

/**
 * True when any part of the element is inside the visible area of its scroll
 * container, in which case the grid should not move the scroll position.
 */
function isVisible(element: HTMLElement): boolean {
  const elementRect = element.getBoundingClientRect();
  const containerRect = getScrollContainer(element)?.getBoundingClientRect();
  const viewportTop = containerRect?.top ?? 0;
  const viewportBottom = containerRect?.bottom ?? window.innerHeight;

  return elementRect.bottom > viewportTop && elementRect.top < viewportBottom;
}

export function CodingImageGrid({
  images,
  isSelected,
  lastViewedImageName,
  onLastViewedChange,
  codesByImage,
  getUrlState,
  requestImage,
  onImageClick,
  onToggleSelect,
  onSelectBetween,
}: CodingImageGridProps) {
  const [zoomedImageName, setZoomedImageName] = useState<string | null>(null);
  const tileElementsRef = useRef(new Map<string, HTMLDivElement>());
  const scrollTimerRef = useRef<number | null>(null);

  const registerTile = useCallback((imageName: string, element: HTMLDivElement | null) => {
    if (element) {
      tileElementsRef.current.set(imageName, element);
    } else {
      tileElementsRef.current.delete(imageName);
    }
  }, []);

  const clearScrollTimer = useCallback(() => {
    if (scrollTimerRef.current !== null) {
      window.clearTimeout(scrollTimerRef.current);
      scrollTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearScrollTimer, [clearScrollTimer]);

  const zoomedImageIndex = zoomedImageName
    ? images.findIndex((image) => image.name === zoomedImageName)
    : -1;
  const zoomedImage = zoomedImageIndex === -1 ? undefined : images[zoomedImageIndex];

  useEffect(() => {
    if (zoomedImageIndex === -1) {
      return;
    }

    const start = Math.max(0, zoomedImageIndex - ZOOM_PREFETCH_RADIUS);
    const end = Math.min(images.length - 1, zoomedImageIndex + ZOOM_PREFETCH_RADIUS);

    for (let index = start; index <= end; index += 1) {
      requestImage(images[index].name);
    }
  }, [images, zoomedImageIndex, requestImage]);

  const handleZoom = (imageName: string) => {
    clearScrollTimer();
    setZoomedImageName(imageName);
    onLastViewedChange(imageName);
  };

  const navigateZoomedImage = (offset: number) => {
    if (zoomedImageIndex === -1) {
      return;
    }

    const nextIndex = Math.min(Math.max(zoomedImageIndex + offset, 0), images.length - 1);
    const nextImageName = images[nextIndex].name;
    setZoomedImageName(nextImageName);
    onLastViewedChange(nextImageName);
  };

  const handleCloseZoom = () => {
    const targetImageName = zoomedImageName;
    setZoomedImageName(null);

    if (!targetImageName) {
      return;
    }

    // Let the dialog finish closing and release the scroll lock before the
    // smooth scroll starts, so the grid can animate towards the last image.
    clearScrollTimer();
    scrollTimerRef.current = window.setTimeout(() => {
      scrollTimerRef.current = null;
      const tile = tileElementsRef.current.get(targetImageName);

      if (!tile || isVisible(tile)) {
        return;
      }

      tile.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
    }, 300);
  };

  const selectedIndices = images.reduce<number[]>((indices, image, index) => {
    if (isSelected(image.name)) {
      indices.push(index);
    }
    return indices;
  }, []);

  const betweenSelection =
    selectedIndices.length === 2
      ? {
          startIndex: selectedIndices[0],
          endIndex: selectedIndices[1],
          firstImageName: images[selectedIndices[0]].name,
          secondImageName: images[selectedIndices[1]].name,
        }
      : null;

  if (images.length === 0) {
    return (
      <div className="flex min-h-[30vh] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
        <ImageOff className="h-8 w-8" />
        <p className="text-sm">There are no screenshots in this session.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3">
        {images.map((image, index) => {
          const isBetweenSelection =
            betweenSelection !== null &&
            index >= betweenSelection.startIndex &&
            index <= betweenSelection.endIndex;

          return (
            <CodingImageTile
              key={image.name}
              image={image}
              index={index}
              isSelected={isSelected(image.name)}
              isLastViewed={image.name === lastViewedImageName}
              codes={codesByImage.get(image.name) ?? []}
              urlState={getUrlState(image.name)}
              requestImage={requestImage}
              registerTile={registerTile}
              onImageClick={onImageClick}
              onZoom={handleZoom}
              onToggleSelect={onToggleSelect}
              selectBetween={
                isBetweenSelection
                  ? {
                      firstImageName: betweenSelection.firstImageName,
                      secondImageName: betweenSelection.secondImageName,
                    }
                  : null
              }
              onSelectBetween={onSelectBetween}
            />
          );
        })}
      </div>

      <CodingImageZoomDialog
        image={zoomedImage}
        index={zoomedImageIndex}
        total={images.length}
        isSelected={zoomedImage ? isSelected(zoomedImage.name) : false}
        urlState={zoomedImage ? getUrlState(zoomedImage.name) : undefined}
        onToggleSelect={() => {
          if (zoomedImage) {
            onToggleSelect(zoomedImage.name);
          }
        }}
        onPrevious={() => navigateZoomedImage(-1)}
        onNext={() => navigateZoomedImage(1)}
        onClose={handleCloseZoom}
      />
    </>
  );
}
