const PRODUCTION_API_BASE_URL = "https://creatrend-backend.onrender.com/api";
const LOCAL_API_PATTERN = /^https?:\/\/localhost(?::\d+)?(?:\/|$)/i;

export function resolveApiBaseUrl(configuredUrl, currentHostname) {
  const configured = configuredUrl?.trim();
  const hostname = currentHostname || (typeof window !== "undefined" ? window.location.hostname : "localhost");
  const isLocalBrowser = hostname === "localhost" || hostname === "127.0.0.1";

  if (configured && (isLocalBrowser || !LOCAL_API_PATTERN.test(configured))) {
    return configured.replace(/\/$/, "");
  }

  return isLocalBrowser ? "http://localhost:8080/api" : PRODUCTION_API_BASE_URL;
}

export const API_BASE_URL = resolveApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
