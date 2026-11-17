import api from "@/services/api";

import { nextCodeColor } from "../lib/codeColors";
import type { CodingScope, ImageCode } from "../types";

export type CreateImageCodeImage = {
  classifierDataId: number;
  name: string;
};

export type CreateImageCodeInput = {
  text: string;
  images: CreateImageCodeImage[];
};

type ApiCodedImage = {
  classifier_data_id?: unknown;
};

type ApiCode = {
  id?: unknown;
  text?: unknown;
  created_at?: unknown;
  coded_images?: unknown;
};

type CreateCodeResponse = {
  status?: unknown;
  message?: unknown;
  code?: ApiCode;
};

/**
 * Persistence boundary for image codes.
 *
 * Creation, text updates and deletion go through the image coding backend. The
 * backend does not yet expose a listing endpoint, so the browser keeps a local
 * cache of the codes it has seen. That cache is what the legend displays after
 * a reload.
 */
export interface ImageCodingRepository {
  listCodes(scope: CodingScope): Promise<ImageCode[]>;
  createCode(scope: CodingScope, input: CreateImageCodeInput): Promise<ImageCode>;
  updateCode(scope: CodingScope, codeId: string, text: string): Promise<ImageCode>;
  deleteCode(scope: CodingScope, codeId: string): Promise<void>;
}

const STORAGE_PREFIX = "ADHD::ImageCoding::v1";

function storageKey(scope: CodingScope): string {
  return `${STORAGE_PREFIX}::${encodeURIComponent(scope.studentName)}::${scope.sessionSeqnum}`;
}

function isImageCode(value: unknown): value is ImageCode {
  if (!value || typeof value !== "object") {
    return false;
  }

  const code = value as Partial<ImageCode>;
  return (
    typeof code.id === "string" &&
    typeof code.text === "string" &&
    typeof code.color === "string" &&
    typeof code.createdAt === "string" &&
    typeof code.updatedAt === "string" &&
    Array.isArray(code.imageNames) &&
    code.imageNames.every((name) => typeof name === "string")
  );
}

function parseCodedImageIds(value: unknown): number[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      const codedImage = item as ApiCodedImage;
      return typeof codedImage.classifier_data_id === "number" ? codedImage.classifier_data_id : null;
    })
    .filter((id): id is number => id !== null);
}

export class BackendImageCodingRepository implements ImageCodingRepository {
  async listCodes(scope: CodingScope): Promise<ImageCode[]> {
    return this.read(scope);
  }

  async createCode(scope: CodingScope, input: CreateImageCodeInput): Promise<ImageCode> {
    const response = await api.post<CreateCodeResponse>("/image_coding/", {
      code_text: input.text.trim(),
      session_info: {
        student_name: scope.studentName,
        session_seqnum: scope.sessionSeqnum,
      },
      classifier_data_id_list: input.images.map((image) => image.classifierDataId),
    });

    const payload = response.data;
    if (payload.status !== undefined && payload.status !== 0) {
      throw new Error(typeof payload.message === "string" ? payload.message : "Could not create this code.");
    }

    const apiCode = payload.code;
    if (
      !apiCode ||
      typeof apiCode.id !== "number" ||
      typeof apiCode.text !== "string" ||
      typeof apiCode.created_at !== "string"
    ) {
      throw new Error("The backend did not return the created code.");
    }

    const codedImageIds = new Set(parseCodedImageIds(apiCode.coded_images));
    const imageNames =
      codedImageIds.size > 0
        ? input.images.filter((image) => codedImageIds.has(image.classifierDataId)).map((image) => image.name)
        : input.images.map((image) => image.name);

    const codes = this.read(scope);
    const code: ImageCode = {
      id: String(apiCode.id),
      text: apiCode.text,
      color: nextCodeColor(codes),
      imageNames: Array.from(new Set(imageNames)),
      createdAt: apiCode.created_at,
      updatedAt: apiCode.created_at,
    };

    this.write(
      scope,
      codes.some((existing) => existing.id === code.id)
        ? codes.map((existing) => (existing.id === code.id ? code : existing))
        : [...codes, code],
    );

    return code;
  }

  async updateCode(scope: CodingScope, codeId: string, text: string): Promise<ImageCode> {
    const codes = this.read(scope);
    const index = codes.findIndex((code) => code.id === codeId);

    if (index === -1) {
      throw new Error("This code no longer exists. Refresh the page and try again.");
    }

    const trimmed = text.trim();
    await api.patch(`/image_coding/${encodeURIComponent(codeId)}?text=${trimmed}`);

    const updated: ImageCode = {
      ...codes[index],
      text: trimmed,
      updatedAt: new Date().toISOString(),
    };

    codes[index] = updated;
    this.write(scope, codes);
    return updated;
  }

  async deleteCode(scope: CodingScope, codeId: string): Promise<void> {
    await api.delete(`/image_coding/${encodeURIComponent(codeId)}`);

    const codes = this.read(scope);
    this.write(
      scope,
      codes.filter((code) => code.id !== codeId),
    );
  }

  private read(scope: CodingScope): ImageCode[] {
    try {
      const raw = localStorage.getItem(storageKey(scope));
      if (!raw) {
        return [];
      }

      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed.filter(isImageCode) : [];
    } catch {
      return [];
    }
  }

  private write(scope: CodingScope, codes: ImageCode[]): void {
    localStorage.setItem(storageKey(scope), JSON.stringify(codes));
  }
}

export const imageCodingRepository: ImageCodingRepository = new BackendImageCodingRepository();
