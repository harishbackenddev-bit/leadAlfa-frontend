export const BLOG_FEED_ERROR =
  "We couldn't load articles right now. Please try again in a few minutes.";

export const ARTICLE_LOAD_ERROR =
  "We couldn't load this article right now. Please try again.";

export const ARTICLE_NOT_FOUND = "This article could not be found.";

export class WordPressApiError extends Error {
  constructor(userMessage, { status, code, detail } = {}) {
    super(userMessage);
    this.name = "WordPressApiError";
    this.userMessage = userMessage;
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

export function isInvalidPageError(error) {
  return error?.code === "rest_post_invalid_page_number";
}

export function toFeedErrorMessage(status, wpError) {
  if (wpError?.code === "rest_post_invalid_page_number") {
    return new WordPressApiError(BLOG_FEED_ERROR, {
      status,
      code: wpError.code,
      detail: wpError.message,
    });
  }

  if (status === 404) {
    return new WordPressApiError(BLOG_FEED_ERROR, {
      status,
      code: wpError?.code,
      detail: wpError?.message,
    });
  }

  if (status >= 500) {
    return new WordPressApiError(BLOG_FEED_ERROR, {
      status,
      code: wpError?.code,
      detail: wpError?.message,
    });
  }

  return new WordPressApiError(BLOG_FEED_ERROR, {
    status,
    code: wpError?.code,
    detail: wpError?.message,
  });
}

export function toArticleErrorMessage(status, wpError) {
  if (
    status === 404 ||
    wpError?.code === "rest_post_invalid_id" ||
    wpError?.code === "rest_no_route"
  ) {
    return new WordPressApiError(ARTICLE_NOT_FOUND, {
      status,
      code: wpError?.code,
      detail: wpError?.message,
    });
  }

  if (status >= 500) {
    return new WordPressApiError(ARTICLE_LOAD_ERROR, {
      status,
      code: wpError?.code,
      detail: wpError?.message,
    });
  }

  return new WordPressApiError(ARTICLE_LOAD_ERROR, {
    status,
    code: wpError?.code,
    detail: wpError?.message,
  });
}
