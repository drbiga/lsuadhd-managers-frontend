import api from "@/services/api";
import iamService from "@/services/iam";

import { errorMessage } from "../lib/errors";
import { screenshotNameFromPath } from "../lib/screenshotPath";
import type { CodingImage, CodingScope, CodingSession, CodingStudent } from "../types";

/**
 * Read-only boundary for the image catalog (students, sessions, screenshots).
 *
 * Today this is backed by the existing session_execution endpoints. A future
 * implementation can point at a coding-specific backend, or at a local sample
 * dataset, without touching the page components.
 */
export interface ImageCatalogSource {
  listStudents(): Promise<CodingStudent[]>;
  listSessions(studentName: string): Promise<CodingSession[]>;
  listImages(scope: CodingScope): Promise<CodingImage[]>;
  fetchImageBlob(scope: CodingScope, imageName: string): Promise<Blob>;
}

function currentUsername(): string | null {
  try {
    return iamService.getCurrentSession().user.username;
  } catch {
    return null;
  }
}

function uniqueStudents(names: string[]): CodingStudent[] {
  const seen = new Set<string>();
  const students: CodingStudent[] = [];

  for (const name of names) {
    if (name && !seen.has(name)) {
      seen.add(name);
      students.push({ name });
    }
  }

  return students;
}

/**
 * Uses the same routes as the managers dashboard:
 *  - GET /management/student
 *  - GET /session_execution/student?student_name=...
 *  - GET /session_execution/student/{student}/session/{seqnum}/feedbacks
 *  - GET /session_execution/student/{student}/session/{seqnum}/screenshot/{name}
 *
 * Only the lightweight student list is fetched up front; sessions, feedbacks
 * and screenshots are loaded on demand as the user narrows the scope.
 */
export class ApiImageCatalogSource implements ImageCatalogSource {
  async listStudents(): Promise<CodingStudent[]> {
    const username = currentUsername();
    if (!username) {
      return [];
    }

    try {
      // Matches the Session Progress page. The session_execution/students
      // route embeds every student's session history, which made the initial
      // image coding load unnecessarily slow.
      const response = await api.get("/management/student", {
        params: { name_manager_requesting_operation: username },
      });

      const items: unknown[] = Array.isArray(response.data) ? response.data : [];
      const names = items
        .map((item) => (item && typeof item === "object" ? (item as { name?: unknown }).name : undefined))
        .filter((name): name is string => typeof name === "string");

      const students = uniqueStudents(names).sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }),
      );
      if (students.length > 0) {
        return students;
      }
    } catch {
      // Students cannot list every student. Falling back to the signed-in
      // user keeps this page useful without manager credentials.
    }

    return [{ name: username }];
  }

  async listSessions(studentName: string): Promise<CodingSession[]> {
    try {
      const response = await api.get("/session_execution/student", {
        params: { student_name: studentName },
      });

      const rawSessions: unknown[] = Array.isArray(response.data?.sessions) ? response.data.sessions : [];

      return rawSessions
        .map((session) => {
          if (!session || typeof session !== "object") {
            return null;
          }

          const value = session as { seqnum?: unknown; stage?: unknown };
          if (typeof value.seqnum !== "number") {
            return null;
          }

          return {
            seqnum: value.seqnum,
            stage: typeof value.stage === "string" ? value.stage : "unknown",
          };
        })
        .filter((session): session is CodingSession => session !== null)
        .sort((a, b) => a.seqnum - b.seqnum);
    } catch (error) {
      throw new Error(errorMessage(error, "Could not load the sessions for this student."));
    }
  }

  async listImages(scope: CodingScope): Promise<CodingImage[]> {
    try {
      const response = await api.get(
        `/session_execution/student/${encodeURIComponent(scope.studentName)}/session/${scope.sessionSeqnum}/feedbacks`,
      );

      const items: unknown[] = Array.isArray(response.data) ? response.data : [];
      const seenIds = new Set<number>();
      const seenNames = new Set<string>();

      return items
        .map((item) => {
          if (!item || typeof item !== "object") {
            return null;
          }

          const feedback = item as {
            classifier_data?: { id?: unknown; screenshot?: unknown };
          };
          const classifierData = feedback.classifier_data;

          if (
            !classifierData ||
            typeof classifierData.id !== "number" ||
            typeof classifierData.screenshot !== "string" ||
            seenIds.has(classifierData.id)
          ) {
            return null;
          }

          // The feedback stores a path (or a full URL), while the screenshot
          // endpoint only accepts the file name.
          const name = screenshotNameFromPath(classifierData.screenshot);
          if (!name) {
            return null;
          }

          seenIds.add(classifierData.id);
          return {
            classifierDataId: classifierData.id,
            name,
          };
        })
        .filter((image): image is CodingImage => image !== null)
        // Classifier data ids are assigned in capture order, so this keeps the
        // grid chronological even if the feedbacks come back unordered. Range
        // selection and the Prev/Next navigation both rely on this order.
        .sort((a, b) => a.classifierDataId - b.classifierDataId)
        // Two feedbacks can occasionally reference the same capture. The grid
        // keys tiles by file name, so keep the earliest classifier entry.
        .filter((image) => {
          if (seenNames.has(image.name)) {
            return false;
          }

          seenNames.add(image.name);
          return true;
        });
    } catch (error) {
      throw new Error(errorMessage(error, "Could not load the feedbacks for this session."));
    }
  }

  async fetchImageBlob(scope: CodingScope, imageName: string): Promise<Blob> {
    try {
      const response = await api.get(
        `/session_execution/student/${encodeURIComponent(scope.studentName)}/session/${scope.sessionSeqnum}/screenshot/${encodeURIComponent(imageName)}`,
        { responseType: "blob" },
      );

      return response.data as Blob;
    } catch (error) {
      throw new Error(errorMessage(error, "Could not load this screenshot."));
    }
  }
}

/**
 * Swap this instance when a different catalog backend (or a local fixture
 * source) becomes available. The UI does not need to change.
 */
export const imageCatalogSource: ImageCatalogSource = new ApiImageCatalogSource();
