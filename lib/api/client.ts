import axios from "axios";

interface ApiEnvelope<T> {
  status?: string;
  data?: T;
  message?: string | null;
}

function isApiEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  return Boolean(
    value &&
    typeof value === "object" &&
    "status" in (value as Record<string, unknown>) &&
    "data" in (value as Record<string, unknown>)
  );
}

export function unwrapApiPayload<T>(payload: unknown): T {
  if (isApiEnvelope<T>(payload)) {
    return (payload.data as T) ?? ({} as T);
  }
  return payload as T;
}

export function toArrayPayload<T>(payload: unknown): T[] {
  const unwrapped = unwrapApiPayload<T | { content?: T[] }>(payload);
  if (Array.isArray(unwrapped)) {
    return unwrapped;
  }

  const maybePage = unwrapped as { content?: T[] } | null;
  if (maybePage && typeof maybePage === "object" && Array.isArray(maybePage.content)) {
    return maybePage.content;
  }

  return [];
}

/**
 * Axios instance for communicating with the Spring Boot backend.
 * Authentication is handled via HttpOnly cookies.
 */
const apiClient = axios.create({
  baseURL: "/api",
  withCredentials: true, // Send cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15_000,
});



// Single, consolidated response interceptor
apiClient.interceptors.response.use(
  (response) => {
    if (response.data !== null && typeof response.data === "object") {
      response.data = unwrapApiPayload(response.data);
    }
    return response;
  },
  (error) => Promise.reject(error)
);

export default apiClient;