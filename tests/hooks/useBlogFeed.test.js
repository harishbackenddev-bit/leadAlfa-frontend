import { act, renderHook, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import useBlogFeed from "../../src/hooks/useBlogFeed";
import {
  fetchCategories,
  fetchPosts,
  fetchReports,
} from "../../src/api/wordpress";

vi.mock("../../src/api/wordpress", () => ({
  fetchCategories: vi.fn(),
  fetchPosts: vi.fn(),
  fetchReports: vi.fn(),
}));

const mockPost = {
  id: 31,
  title: "Sample Post",
  excerpt: "Excerpt",
  contentHtml: "<p>Content</p>",
  author: "Author",
  avatar: null,
  image: null,
  category: "News",
  date: "2026-08-03",
  link: "http://example.com",
  slug: "sample-post",
};

describe("useBlogFeed", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fetchCategories.mockReset();
    fetchPosts.mockReset();
    fetchReports.mockReset();
    fetchCategories.mockResolvedValue([
      { id: 1, name: "News", slug: "news", count: 3 },
    ]);
    fetchReports.mockResolvedValue([mockPost]);
    fetchPosts.mockResolvedValue({
      posts: [mockPost],
      total: 7,
      totalPages: 2,
    });
  });

  it("should load categories, reports, and posts on mount", async () => {
    const { result } = renderHook(() => useBlogFeed());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(fetchCategories).toHaveBeenCalled();
    expect(fetchReports).toHaveBeenCalled();
    expect(fetchPosts).toHaveBeenCalledWith({
      page: 1,
      perPage: 6,
      categoryId: null,
    });
    expect(result.current.posts).toHaveLength(1);
    expect(result.current.reports).toHaveLength(1);
    expect(result.current.categories).toHaveLength(1);
    expect(result.current.total).toBe(7);
    expect(result.current.totalPages).toBe(2);
  });

  it("should reset to page 1 when category changes", async () => {
    const { result } = renderHook(() => useBlogFeed());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      result.current.setPage(2);
    });

    await waitFor(() => {
      expect(fetchPosts).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 })
      );
    });

    await act(async () => {
      result.current.setCategory(1);
    });

    await waitFor(() => {
      expect(result.current.page).toBe(1);
      expect(fetchPosts).toHaveBeenCalledWith({
        page: 1,
        perPage: 6,
        categoryId: 1,
      });
    });
  });

  it("should reset to page 1 when WordPress returns an invalid page error", async () => {
    const invalidPageError = Object.assign(new Error("Invalid page"), {
      code: "rest_post_invalid_page_number",
      userMessage: "feed error",
    });

    fetchPosts.mockImplementation(({ page: requestedPage }) => {
      if (requestedPage > 1) {
        return Promise.reject(invalidPageError);
      }

      return Promise.resolve({
        posts: [mockPost],
        total: 7,
        totalPages: 2,
      });
    });

    const { result } = renderHook(() => useBlogFeed());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
      expect(result.current.page).toBe(1);
    });

    await act(async () => {
      result.current.setPage(2);
    });

    await waitFor(() => {
      expect(result.current.page).toBe(1);
      expect(result.current.posts).toHaveLength(1);
      expect(result.current.error).toBeNull();
    });
  });

  it("should set error when posts fetch fails", async () => {
    fetchPosts.mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useBlogFeed());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe("Network error");
    expect(result.current.posts).toEqual([]);
  });
});
