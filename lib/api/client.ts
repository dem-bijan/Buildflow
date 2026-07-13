import axios from "axios";

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

apiClient.interceptors.response.use(
  (response) => {
    if (
      response.data &&
      typeof response.data === "object" &&
      "status" in response.data &&
      "data" in response.data
    ) {
      response.data = response.data.data;
    }

    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.warn("[API] Unauthorized");
          break;
        case 403:
          console.warn("[API] Forbidden");
          break;
        case 500:
          console.error("[API] Internal Server Error");
          break;
      }
    }

    return Promise.reject(error);
  }
);


// Response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          console.warn("[API] Unauthorized");
          break;

        case 403:
          console.warn("[API] Forbidden");
          break;

        case 500:
          console.error("[API] Internal Server Error");
          break;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;