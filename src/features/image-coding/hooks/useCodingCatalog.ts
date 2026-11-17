import { useCallback, useEffect, useMemo, useState } from "react";

import { errorMessage } from "../lib/errors";
import { imageCatalogSource, type ImageCatalogSource } from "../services/imageCatalogSource";
import type { CodingImage, CodingScope, CodingSession, CodingStudent } from "../types";

export type CodingCatalogState = {
  students: CodingStudent[];
  studentName: string | null;
  sessions: CodingSession[];
  sessionSeqnum: number | null;
  images: CodingImage[];
  scope: CodingScope | null;
  studentsLoading: boolean;
  sessionsLoading: boolean;
  imagesLoading: boolean;
  error: string | null;
  selectStudent: (studentName: string | null) => void;
  selectSession: (sessionSeqnum: number | null) => void;
  refreshImages: () => void;
};

/**
 * Loads the student/session/image catalog. All requests go through the
 * ImageCatalogSource so the underlying backend can be replaced later.
 */
export function useCodingCatalog(source: ImageCatalogSource = imageCatalogSource): CodingCatalogState {
  const [students, setStudents] = useState<CodingStudent[]>([]);
  const [studentName, setStudentName] = useState<string | null>(null);
  const [sessions, setSessions] = useState<CodingSession[]>([]);
  const [sessionSeqnum, setSessionSeqnum] = useState<number | null>(null);
  const [images, setImages] = useState<CodingImage[]>([]);
  const [studentsLoading, setStudentsLoading] = useState(true);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [imagesLoading, setImagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagesRefreshToken, setImagesRefreshToken] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setStudentsLoading(true);
    setError(null);

    source
      .listStudents()
      .then((list) => {
        if (cancelled) {
          return;
        }

        setStudents(list);
        setStudentName((previous) => {
          if (previous && list.some((student) => student.name === previous)) {
            return previous;
          }
          return null;
        });
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(errorMessage(loadError, "Could not load students."));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setStudentsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [source]);

  useEffect(() => {
    if (!studentName) {
      setSessions([]);
      setSessionSeqnum(null);
      setSessionsLoading(false);
      return;
    }

    let cancelled = false;
    setSessionsLoading(true);
    setError(null);
    setSessions([]);
    setSessionSeqnum(null);

    source
      .listSessions(studentName)
      .then((list) => {
        if (cancelled) {
          return;
        }

        setSessions(list);
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(errorMessage(loadError, "Could not load the sessions for this student."));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setSessionsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [studentName, source]);

  useEffect(() => {
    if (!studentName || sessionSeqnum === null) {
      setImages([]);
      setImagesLoading(false);
      return;
    }

    let cancelled = false;
    setImagesLoading(true);
    setError(null);
    setImages([]);

    source
      .listImages({ studentName, sessionSeqnum })
      .then((list) => {
        if (!cancelled) {
          setImages(list);
        }
      })
      .catch((loadError) => {
        if (!cancelled) {
          setError(errorMessage(loadError, "Could not load the screenshots for this session."));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setImagesLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [studentName, sessionSeqnum, imagesRefreshToken, source]);

  const scope = useMemo<CodingScope | null>(() => {
    if (!studentName || sessionSeqnum === null) {
      return null;
    }

    return { studentName, sessionSeqnum };
  }, [studentName, sessionSeqnum]);

  const selectStudent = useCallback((nextStudentName: string | null) => {
    setStudentName(nextStudentName);
    setSessions([]);
    setSessionSeqnum(null);
  }, []);

  const selectSession = useCallback((nextSessionSeqnum: number | null) => {
    setSessionSeqnum(nextSessionSeqnum);
  }, []);

  return {
    students,
    studentName,
    sessions,
    sessionSeqnum,
    images,
    scope,
    studentsLoading,
    sessionsLoading,
    imagesLoading,
    error,
    selectStudent,
    selectSession,
    refreshImages: () => setImagesRefreshToken((token) => token + 1),
  };
}
