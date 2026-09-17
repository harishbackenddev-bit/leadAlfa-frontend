import axios from "axios";
import { API_BASE_URL } from "./apiBaseUrl";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    const status = error.response?.status;
    const requestUrl = String(config.url || "");
    const skipAuthRefresh =
      requestUrl.includes("/auth/social") ||
      requestUrl.includes("/users/login") ||
      requestUrl.includes("/users/register") ||
      requestUrl.includes("/users/refresh-token");

    // If 401, attempt a single refresh then retry the original request once
    if (status === 401 && !config.__isRetryRequest && !skipAuthRefresh) {
      try {
        // Use plain axios to avoid interceptor loop
        const resp = await axios.post(`${API_BASE_URL}/users/refresh-token`);
        const newToken =
          resp?.data?.access_token || resp?.data?.accessToken || null;
        if (newToken) {
          localStorage.setItem("access_token", newToken);
          // set auth header for the original request and mark as retried
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${newToken}`;
          config.__isRetryRequest = true;
          return axiosInstance(config);
        }
        throw new Error("No new token returned");
      } catch (err) {
        console.log("Refresh token failed", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("id_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    // For network errors or 5xx, retry once with a small backoff
    config.__retryCount = config.__retryCount || 0;
    const MAX_RETRY = 1;
    const shouldRetry = !error.response || (status >= 500 && status < 600);
    if (shouldRetry && config.__retryCount < MAX_RETRY) {
      config.__retryCount += 1;
      await new Promise((res) => setTimeout(res, 200));
      return axiosInstance(config);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
