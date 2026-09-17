import { describe, expect, it } from "vitest";
import {
  cleanExcerpt,
  decodeEntities,
  mapCategory,
  mapPost,
  stripHtml,
} from "../../../src/api/wordpress/mappers";
import { WP_SITE_URL } from "../../../src/config/wordpress";

const wpOrigin = WP_SITE_URL.replace(/\/$/, "");

const mockWpPost = {
  id: 31,
  date: "2026-08-03T16:05:47",
  slug: "how-ai-is-transforming-lead-generation-in-2026",
  link: `${wpOrigin}/2026/08/03/how-ai-is-transforming-lead-generation-in-2026/`,
  title: {
    rendered: "How AI Is Transforming Lead Generation &#038; Brands in 2026",
  },
  excerpt: {
    rendered: "<p>Short excerpt text [&hellip;]</p>",
  },
  content: {
    rendered: "<p>Full article content</p>",
  },
  _embedded: {
    author: [
      {
        name: "John Doe",
        avatar_urls: {
          48: "https://example.com/avatar-48.png",
        },
      },
    ],
    "wp:featuredmedia": [
      {
        source_url: "https://example.com/image-full.png",
        media_details: {
          sizes: {
            medium: { source_url: "https://example.com/image-medium.png" },
          },
        },
      },
    ],
    "wp:term": [[{ taxonomy: "category", name: "News" }]],
  },
};

describe("wordpress mappers", () => {
  describe("decodeEntities", () => {
    it("should decode common HTML entities", () => {
      expect(decodeEntities("Tom &amp; Jerry &hellip;")).toBe("Tom & Jerry …");
      expect(decodeEntities("A &#038; B")).toBe("A & B");
    });

    it("should leave unknown entities unchanged", () => {
      expect(decodeEntities("&#9999;")).toBe("&#9999;");
    });
  });

  describe("stripHtml", () => {
    it("should remove HTML tags and trim text", () => {
      expect(stripHtml("<p>Hello <strong>world</strong></p>")).toBe(
        "Hello world"
      );
    });

    it("should return empty string for empty input", () => {
      expect(stripHtml("")).toBe("");
    });
  });

  describe("cleanExcerpt", () => {
    it("should replace WordPress bracket ellipsis with plain dots", () => {
      expect(cleanExcerpt("<p>Some text [&hellip;]</p>")).toBe("Some text...");
      expect(cleanExcerpt("<p>Some text [...]</p>")).toBe("Some text...");
    });

    it("should leave excerpts without truncation marker unchanged", () => {
      expect(cleanExcerpt("<p>Full excerpt text</p>")).toBe("Full excerpt text");
    });
  });

  describe("mapPost", () => {
    it("should map WordPress post to blog model", () => {
      const result = mapPost(mockWpPost);

      expect(result).toEqual({
        id: 31,
        title: "How AI Is Transforming Lead Generation & Brands in 2026",
        excerpt: "Short excerpt text...",
        contentHtml: "<p>Full article content</p>",
        author: "John Doe",
        avatar: "https://example.com/avatar-48.png",
        image: "https://example.com/image-medium.png",
        category: "News",
        date: "2026-08-03T16:05:47",
        link: `${wpOrigin}/2026/08/03/how-ai-is-transforming-lead-generation-in-2026/`,
        slug: "how-ai-is-transforming-lead-generation-in-2026",
      });
    });

    it("should rewrite WordPress media URLs to same-origin proxy paths", () => {
      const result = mapPost({
        ...mockWpPost,
        content: {
          rendered:
            '<p><img src="' + wpOrigin + '/wp-content/uploads/photo.jpg" /></p>',
        },
        _embedded: {
          ...mockWpPost._embedded,
          "wp:featuredmedia": [
            {
              source_url: `${wpOrigin}/wp-content/uploads/hero.jpg`,
              media_details: {
                sizes: {
                  medium: {
                    source_url:
                      `${wpOrigin}/wp-content/uploads/hero-300x200.jpg`,
                  },
                },
              },
            },
          ],
        },
      });

      expect(result.image).toBe("/wp-content/uploads/hero-300x200.jpg");
      expect(result.contentHtml).toContain('src="/wp-content/uploads/photo.jpg"');
    });

    it("should use fallback author and null image when embed data is missing", () => {
      const result = mapPost({
        id: 1,
        title: { rendered: "Plain title" },
        excerpt: { rendered: "" },
        content: { rendered: "" },
        date: "2026-01-01",
        link: "http://example.com",
        slug: "plain-title",
      });

      expect(result.author).toBe("Unknown");
      expect(result.avatar).toBeNull();
      expect(result.image).toBeNull();
      expect(result.category).toBeNull();
    });
  });

  describe("mapCategory", () => {
    it("should map WordPress category to app model", () => {
      expect(
        mapCategory({
          id: 5,
          name: "Press",
          slug: "press",
          count: 12,
        })
      ).toEqual({
        id: 5,
        name: "Press",
        slug: "press",
        count: 12,
      });
    });
  });
});
