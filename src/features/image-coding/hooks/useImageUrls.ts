import { useCallback, useEffect, useRef, useState } from "react";

import { imageCatalogSource } from "../services/imageCatalogSource";
import type { CodingScope } from "../types";

export type ImageUrlState = {
  url?: string;
  loading?: boolean;
  error?: boolean;
};

export type ImageUrlCache = {
  getState: (imageName: string) => ImageUrlState | undefined;
  requestImage: (imageName: string) => void;
};

/**
 * Lazily downloads screenshots as blobs and exposes blob URLs. Blob URLs are
 * revoked whenever the scope changes or the page unmounts.
 */
export function useImageUrls(scope: CodingScope | null): ImageUrlCache {
  const [state, setState] = useState<Record<string, ImageUrlState>>({});
  const urlsRef = useRef<Map<string, string>>(new Map());
  const pendingRef = useRef<Set<string>>(new Set());
  const generationRef = useRef(0);
  const scopeKey = scope ? `${scope.studentName}::${scope.sessionSeqnum}` : "";

  useEffect(() => {
    generationRef.current += 1;
    const urls = new Map<string, string>();
    urlsRef.current = urls;
    pendingRef.current = new Set();
    setState({});

    return () => {
      generationRef.current += 1;
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [scopeKey]);

  const requestImage = useCallback(
    (imageName: string) => {
      if (!scope) {
        return;
      }

      if (urlsRef.current.has(imageName) || pendingRef.current.has(imageName)) {
        return;
      }

      const generation = generationRef.current;
      pendingRef.current.add(imageName);
      setState((previous) => ({
        ...previous,
        [imageName]: { ...previous[imageName], loading: true, error: false },
      }));

      imageCatalogSource
        .fetchImageBlob(scope, imageName)
        .then((blob) => {
          if (generation !== generationRef.current) {
            return;
          }

          const url = URL.createObjectURL(blob);
          urlsRef.current.set(imageName, url);
          setState((previous) => ({ ...previous, [imageName]: { url } }));
        })
        .catch(() => {
          if (generation !== generationRef.current) {
            return;
          }

          setState((previous) => ({ ...previous, [imageName]: { error: true } }));
        })
        .finally(() => {
          if (generation === generationRef.current) {
            pendingRef.current.delete(imageName);
          }
        });
    },
    [scope],
  );

  const getState = useCallback((imageName: string) => state[imageName], [state]);

  return { getState, requestImage };
}
