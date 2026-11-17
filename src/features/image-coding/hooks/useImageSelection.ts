import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import type { CodingImage } from "../types";

export type SelectionClick = {
  shiftKey: boolean;
  metaKey: boolean;
  ctrlKey: boolean;
};

export type ImageSelectionState = {
  selected: Set<string>;
  selectedNames: string[];
  selectedCount: number;
  isSelected: (imageName: string) => boolean;
  handleImageClick: (imageName: string, event: SelectionClick) => void;
  toggleImage: (imageName: string) => void;
  selectRangeBetween: (firstImageName: string, secondImageName: string) => void;
  selectOnly: (imageNames: string[]) => void;
  clearSelection: () => void;
};

/**
 * Selection model shared by the single-image and grid views.
 *
 * - A plain click toggles an image and becomes the range anchor.
 * - Shift+click adds the whole contiguous range between the anchor and the
 *   clicked image. This relies on the image list being temporally sorted.
 * - Ctrl/Cmd+click toggles an image without changing the "meaning" of a range.
 */
export function useImageSelection(images: CodingImage[]): ImageSelectionState {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const anchorRef = useRef<string | null>(null);

  const imageNames = useMemo(() => images.map((image) => image.name), [images]);
  const imageNameSet = useMemo(() => new Set(imageNames), [imageNames]);

  useEffect(() => {
    setSelected(new Set());
    anchorRef.current = null;
  }, [imageNames]);

  const toggleImage = useCallback((imageName: string) => {
    anchorRef.current = imageName;
    setSelected((previous) => {
      const next = new Set(previous);
      if (next.has(imageName)) {
        next.delete(imageName);
      } else {
        next.add(imageName);
      }
      return next;
    });
  }, []);

  const handleImageClick = useCallback(
    (imageName: string, event: SelectionClick) => {
      if (event.shiftKey && anchorRef.current) {
        const from = imageNames.indexOf(anchorRef.current);
        const to = imageNames.indexOf(imageName);

        if (from !== -1 && to !== -1) {
          const start = Math.min(from, to);
          const end = Math.max(from, to);
          setSelected((previous) => {
            const next = new Set(previous);
            for (let index = start; index <= end; index += 1) {
              next.add(imageNames[index]);
            }
            return next;
          });
          return;
        }
      }

      if (event.metaKey || event.ctrlKey) {
        setSelected((previous) => {
          const next = new Set(previous);
          if (next.has(imageName)) {
            next.delete(imageName);
          } else {
            next.add(imageName);
          }
          return next;
        });
        anchorRef.current = imageName;
        return;
      }

      toggleImage(imageName);
    },
    [imageNames, toggleImage],
  );

  const selectRangeBetween = useCallback(
    (firstImageName: string, secondImageName: string) => {
      const firstIndex = imageNames.indexOf(firstImageName);
      const secondIndex = imageNames.indexOf(secondImageName);

      if (firstIndex === -1 || secondIndex === -1) {
        return;
      }

      const start = Math.min(firstIndex, secondIndex);
      const end = Math.max(firstIndex, secondIndex);

      setSelected((previous) => {
        const next = new Set(previous);
        for (let index = start; index <= end; index += 1) {
          next.add(imageNames[index]);
        }
        return next;
      });
    },
    [imageNames],
  );

  const selectOnly = useCallback(
    (names: string[]) => {
      anchorRef.current = null;
      setSelected(new Set(names.filter((name) => imageNameSet.has(name))));
    },
    [imageNameSet],
  );

  const clearSelection = useCallback(() => {
    anchorRef.current = null;
    setSelected(new Set());
  }, []);

  const selectedNames = useMemo(
    () => imageNames.filter((imageName) => selected.has(imageName)),
    [imageNames, selected],
  );

  const isSelected = useCallback((imageName: string) => selected.has(imageName), [selected]);

  return {
    selected,
    selectedNames,
    selectedCount: selectedNames.length,
    isSelected,
    handleImageClick,
    toggleImage,
    selectRangeBetween,
    selectOnly,
    clearSelection,
  };
}
