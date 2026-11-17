type ErrorPayload = {
  response?: {
    status?: number;
    data?: unknown;
  };
  message?: string;
};

function messageFromPayload(payload: unknown): string | null {
  if (typeof payload === "string" && payload.trim().length > 0) {
    return payload;
  }

  if (!payload || typeof payload !== "object") {
    return null;
  }

  const data = payload as { detail?: unknown; message?: unknown };

  if (typeof data.detail === "string" && data.detail.trim().length > 0) {
    return data.detail;
  }

  if (data.detail && typeof data.detail === "object") {
    const detail = data.detail as { message?: unknown };
    if (typeof detail.message === "string" && detail.message.trim().length > 0) {
      return detail.message;
    }
  }

  if (typeof data.message === "string" && data.message.trim().length > 0) {
    return data.message;
  }

  return null;
}

export function errorMessage(error: unknown, fallback: string): string {
  if (error && typeof error === "object") {
    const candidate = error as ErrorPayload;
    const payloadMessage = messageFromPayload(candidate.response?.data);
    if (payloadMessage) {
      return payloadMessage;
    }

    if (candidate.response?.status === 401) {
      return "You are not authorized to perform this action. Screenshot access requires a researcher account.";
    }

    if (typeof candidate.message === "string" && candidate.message.trim().length > 0) {
      return candidate.message;
    }
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message;
  }

  return fallback;
}
