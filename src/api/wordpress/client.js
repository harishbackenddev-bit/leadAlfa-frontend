import { WP_API_BASE } from "../../config/wordpress";
import {
  ARTICLE_LOAD_ERROR,
  BLOG_FEED_ERROR,
  toArticleErrorMessage,
  toFeedErrorMessage,
  WordPressApiError,
} from "./errors";

async function readWpError(response) {
  const contentType = response.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return {
      status: response.status,
      message: response.statusText || null,
    };
  }

  try {
    const data = await response.json();
    return {
      code: data.code,
      message: data.message,
      status: data.data?.status ?? response.status,
    };
  } catch {
    return { status: response.status };
  }
}

export async function wpFetch(path, { errorContext = "feed" } = {}) {
  const url = path.startsWith("http") ? path : `${WP_API_BASE}${path}`;

  let response;

  try {
    response = await fetch(url);
  } catch (networkError) {
    console.error("[wordpress] Network error:", url, networkError);
    throw new WordPressApiError(
      errorContext === "article" ? ARTICLE_LOAD_ERROR : BLOG_FEED_ERROR,
      { detail: networkError.message }
    );
  }

  if (!response.ok) {
    const wpError = await readWpError(response);
    const mappedError =
      errorContext === "article"
        ? toArticleErrorMessage(response.status, wpError)
        : toFeedErrorMessage(response.status, wpError);

    console.error("[wordpress] Request failed:", {
      url,
      status: response.status,
      code: wpError.code,
      message: wpError.message,
    });

    throw mappedError;
  }

  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) {
    console.error("[wordpress] Non-JSON response:", url, contentType);
    throw new WordPressApiError(
      errorContext === "article" ? ARTICLE_LOAD_ERROR : BLOG_FEED_ERROR,
      { status: response.status, detail: "Non-JSON response" }
    );
  }

  const data = await response.json();
  const total = Number(response.headers.get("X-WP-Total") || 0);
  const totalPages = Number(response.headers.get("X-WP-TotalPages") || 1);

  return { data, total, totalPages };
}
