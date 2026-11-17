import { useCallback, useEffect, useState } from "react";

import { errorMessage } from "../lib/errors";
import { imageCodingRepository, type CreateImageCodeImage } from "../services/imageCodingRepository";
import type { CodingScope, ImageCode } from "../types";

export type ImageCodesState = {
  codes: ImageCode[];
  loading: boolean;
  error: string | null;
  addCode: (text: string, images: CreateImageCodeImage[]) => Promise<ImageCode>;
  updateCode: (codeId: string, text: string) => Promise<ImageCode>;
  deleteCode: (codeId: string) => Promise<void>;
};

/**
 * Loads and mutates the codes for the active student/session scope. All
 * persistence is delegated to ImageCodingRepository.
 */
export function useImageCodes(scope: CodingScope | null): ImageCodesState {
  const [codes, setCodes] = useState<ImageCode[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!scope) {
      setCodes([]);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    imageCodingRepository
      .listCodes(scope)
      .then((list) => {
        if (!cancelled) {
          setCodes(list);
        }
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(errorMessage(loadError, "Could not load the saved codes."));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [scope]);

  const addCode = useCallback(
    async (text: string, images: CreateImageCodeImage[]): Promise<ImageCode> => {
      if (!scope) {
        throw new Error("Select a student and a session before creating a code.");
      }

      const code = await imageCodingRepository.createCode(scope, { text, images });
      setCodes((previous) => {
        const exists = previous.some((existing) => existing.id === code.id);
        return exists
          ? previous.map((existing) => (existing.id === code.id ? code : existing))
          : [...previous, code];
      });
      return code;
    },
    [scope],
  );

  const updateCode = useCallback(
    async (codeId: string, text: string): Promise<ImageCode> => {
      if (!scope) {
        throw new Error("Select a student and a session before editing a code.");
      }

      const updated = await imageCodingRepository.updateCode(scope, codeId, text);
      setCodes((previous) => previous.map((code) => (code.id === codeId ? updated : code)));
      return updated;
    },
    [scope],
  );

  const deleteCode = useCallback(
    async (codeId: string): Promise<void> => {
      if (!scope) {
        throw new Error("Select a student and a session before deleting a code.");
      }

      await imageCodingRepository.deleteCode(scope, codeId);
      setCodes((previous) => previous.filter((code) => code.id !== codeId));
    },
    [scope],
  );

  return { codes, loading, error, addCode, updateCode, deleteCode };
}
