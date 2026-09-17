import { beforeEach, describe, expect, it, vi } from "vitest";
import { wpFetch } from "../../../src/api/wordpress/client";
import {
  ARTICLE_NOT_FOUND,
  BLOG_FEED_ERROR,
} from "../../../src/api/wordpress/errors";

describe("wpFetch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("should return JSON data and pagination headers on success", async () => {
    const mockData = [{ id: 1 }];
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => mockData,
        headers: {
          get: (name) => {
            if (name === "X-WP-Total") return "7";
            if (name === "X-WP-TotalPages") return "2";
            if (name === "content-type") return "application/json; charset=UTF-8";
            return null;
          },
        },
      })
    );

    const result = await wpFetch("/posts?_embed=1&page=1&per_page=6");

    expect(fetch).toHaveBeenCalledWith("/wp-json/wp/v2/posts?_embed=1&page=1&per_page=6");
    expect(result).toEqual({
      data: mockData,
      total: 7,
      totalPages: 2,
    });
  });

  it("should throw a user-friendly message when WordPress API returns non-OK status", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        headers: {
          get: (name) =>
            name === "content-type" ? "application/json; charset=UTF-8" : null,
        },
        json: async () => ({
          code: "rest_post_invalid_id",
          message: "Invalid post ID.",
          data: { status: 404 },
        }),
      })
    );

    await expect(wpFetch("/posts/999", { errorContext: "article" })).rejects.toMatchObject({
      userMessage: ARTICLE_NOT_FOUND,
      status: 404,
      code: "rest_post_invalid_id",
    });
  });

  it("should throw a user-friendly message for server errors", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        headers: { get: () => "text/plain" },
      })
    );

    await expect(wpFetch("/posts")).rejects.toMatchObject({
      userMessage: BLOG_FEED_ERROR,
      status: 500,
    });
  });

  it("should throw a user-friendly message when response is HTML instead of JSON", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        headers: { get: (name) => (name === "content-type" ? "text/html" : null) },
        json: async () => {
          throw new SyntaxError("Unexpected token '<'");
        },
      })
    );

    await expect(wpFetch("/posts")).rejects.toMatchObject({
      userMessage: BLOG_FEED_ERROR,
    });
  });

  it("should default pagination headers when missing", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => [],
        headers: { get: (name) => (name === "content-type" ? "application/json" : null) },
      })
    );

    const result = await wpFetch("/categories");

    expect(result.total).toBe(0);
    expect(result.totalPages).toBe(1);
  });
});
