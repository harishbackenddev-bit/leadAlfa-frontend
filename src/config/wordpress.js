const WP_SITE_URL = import.meta.env.VITE_WP_SITE_URL;
const configuredApiUrl = import.meta.env.VITE_WP_API_URL;

if (!WP_SITE_URL) {
  throw new Error(
    "VITE_WP_SITE_URL is required. Add it to your .env file."
  );
}

if (!configuredApiUrl) {
  throw new Error(
    "VITE_WP_API_URL is required. Add it to your .env file."
  );
}

export { WP_SITE_URL };

export const WP_API_BASE = configuredApiUrl.startsWith("http")
  ? configuredApiUrl
  : configuredApiUrl;

export const POSTS_PER_PAGE = 6;
export const REPORTS_LIMIT = 3;

const WP_SITE_ORIGIN = WP_SITE_URL.replace(/\/$/, "");
const WP_SITE_ORIGIN_HTTPS = WP_SITE_ORIGIN.replace(/^http:/i, "https:");

export function rewriteWpAssetUrl(url) {
  if (!url || typeof url !== "string") return url;

  if (url.startsWith(`${WP_SITE_ORIGIN}/`)) {
    return url.slice(WP_SITE_ORIGIN.length);
  }

  if (url.startsWith(`${WP_SITE_ORIGIN_HTTPS}/`)) {
    return url.slice(WP_SITE_ORIGIN_HTTPS.length);
  }

  return url;
}

export function rewriteWpContentHtml(html = "") {
  if (!html) return "";

  return html
    .replaceAll(`${WP_SITE_ORIGIN}/wp-content/`, "/wp-content/")
    .replaceAll(`${WP_SITE_ORIGIN_HTTPS}/wp-content/`, "/wp-content/");
}
