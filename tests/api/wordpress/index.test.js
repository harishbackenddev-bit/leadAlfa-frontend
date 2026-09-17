import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchCategories,
  fetchPostById,
  fetchPosts,
  fetchReports,
} from "../../../src/api/wordpress";
import { wpFetch } from "../../../src/api/wordpress/client";

vi.mock("../../../src/api/wordpress/client", () => ({
  wpFetch: vi.fn(),
}));

const mockRawPost = {
  id: 31,
  date: "2026-08-03T16:05:47",
  slug: "sample-post",
  link: "http://example.com/sample-post",
  title: { rendered: "Sample Post" },
  excerpt: { rendered: "<p>Excerpt</p>" },
  content: { rendered: "<p>Content</p>" },
  _embedded: {
    author: [{ name: "Author", avatar_urls: { 48: "https://avatar.test/a.png" } }],
    "wp:featuredmedia": [
      {
        source_url: "https://image.test/full.png",
        media_details: { sizes: {} },
      },
    ],
    "wp:term": [[{ taxonomy: "category", name: "News" }]],
  },
};

describe("wordpress api", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should fetch paginated posts with embed params", async () => {
    wpFetch.mockResolvedValue({
      data: [mockRawPost],
      total: 7,
      totalPages: 2,
    });

    const result = await fetchPosts({ page: 2, perPage: 6 });

    expect(wpFetch).toHaveBeenCalledWith(
      "/posts?_embed=1&page=2&per_page=6"
    );
    expect(result.posts).toHaveLength(1);
    expect(result.posts[0].title).toBe("Sample Post");
    expect(result.total).toBe(7);
    expect(result.totalPages).toBe(2);
  });

  it("should include category filter in posts query", async () => {
    wpFetch.mockResolvedValue({ data: [], total: 0, totalPages: 1 });

    await fetchPosts({ page: 1, perPage: 6, categoryId: 3 });

    expect(wpFetch).toHaveBeenCalledWith(
      "/posts?_embed=1&page=1&per_page=6&categories=3"
    );
  });

  it("should fetch categories", async () => {
    wpFetch.mockResolvedValue({
      data: [{ id: 1, name: "Uncategorized", slug: "uncategorized", count: 7 }],
    });

    const categories = await fetchCategories();

    expect(wpFetch).toHaveBeenCalledWith(
      "/categories?per_page=100&hide_empty=true"
    );
    expect(categories[0].name).toBe("Uncategorized");
  });

  it("should fetch single post by id", async () => {
    wpFetch.mockResolvedValue({ data: mockRawPost });

    const post = await fetchPostById(31);

    expect(wpFetch).toHaveBeenCalledWith("/posts/31?_embed=1", {
      errorContext: "article",
    });
    expect(post.id).toBe(31);
    expect(post.title).toBe("Sample Post");
  });

  it("should fetch latest reports with configured limit", async () => {
    wpFetch.mockResolvedValue({ data: [mockRawPost] });

    const reports = await fetchReports(3);

    expect(wpFetch).toHaveBeenCalledWith("/posts?_embed=1&per_page=3&page=1");
    expect(reports).toHaveLength(1);
  });
});
