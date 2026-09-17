import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import BlogsArticles1 from "../../../src/pages/portfolio/BlogsArticles1";
import BlogsArticles2 from "../../../src/pages/portfolio/BlogsArticles2";
import { fetchPostById } from "../../../src/api/wordpress";
import { ARTICLE_LOAD_ERROR } from "../../../src/api/wordpress/errors";
import useBlogFeed from "../../../src/hooks/useBlogFeed";
import { TestMemoryRouter } from "../../../src/test/testRouter";

vi.mock("../../../src/hooks/useBlogFeed");
vi.mock("../../../src/api/wordpress", () => ({
  fetchPostById: vi.fn(),
}));

const mockPost = {
  id: 31,
  title: "How AI Is Transforming Lead Generation in 2026",
  excerpt: "Exploring AI advancements in lead generation.",
  contentHtml: "<p>Full article body from WordPress</p>",
  author: "John Doe",
  avatar: "https://example.com/avatar.png",
  image: "https://example.com/hero.png",
  category: "News",
  date: "2026-08-03",
  link: "http://example.com/post",
  slug: "how-ai-is-transforming",
};

describe("BlogsArticles1", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderListPage() {
    return render(
      <TestMemoryRouter>
        <BlogsArticles1 />
      </TestMemoryRouter>
    );
  }

  it("should show loading state while posts are fetched", () => {
    useBlogFeed.mockReturnValue({
      posts: [],
      reports: [],
      categories: [],
      page: 1,
      setPage: vi.fn(),
      setCategory: vi.fn(),
      totalPages: 1,
      total: 0,
      loading: true,
      error: null,
    });

    renderListPage();

    expect(screen.getByText("Loading articles...")).toBeInTheDocument();
  });

  it("should render article cards and reports from WordPress data", () => {
    useBlogFeed.mockReturnValue({
      posts: [mockPost],
      reports: [mockPost],
      categories: [{ id: 1, name: "News", slug: "news", count: 1 }],
      page: 1,
      setPage: vi.fn(),
      setCategory: vi.fn(),
      totalPages: 2,
      total: 7,
      loading: false,
      error: null,
    });

    renderListPage();

    expect(screen.getAllByText(mockPost.title)).toHaveLength(2);
    expect(screen.getByText(mockPost.excerpt)).toBeInTheDocument();
    expect(screen.getByText("Showing 1–6 of 7")).toBeInTheDocument();
  });

  it("should show error message when feed fails", () => {
    useBlogFeed.mockReturnValue({
      posts: [],
      reports: [],
      categories: [],
      page: 1,
      setPage: vi.fn(),
      setCategory: vi.fn(),
      totalPages: 1,
      total: 0,
      loading: false,
      error: "Failed to load posts",
    });

    renderListPage();

    expect(screen.getByText("Failed to load posts")).toBeInTheDocument();
  });

  it("should call setPage when pagination Next is clicked", async () => {
    const user = userEvent.setup();
    const setPage = vi.fn();

    useBlogFeed.mockReturnValue({
      posts: [mockPost],
      reports: [],
      categories: [],
      page: 1,
      setPage,
      setCategory: vi.fn(),
      totalPages: 2,
      total: 7,
      loading: false,
      error: null,
    });

    renderListPage();

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(setPage).toHaveBeenCalledWith(2);
  });
});

describe("BlogsArticles2", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderDetailRoute(postId = "31") {
    return render(
      <TestMemoryRouter initialEntries={[`/blogs-articles/${postId}`]}>
        <Routes>
          <Route path="/blogs-articles/:id" element={<BlogsArticles2 />} />
        </Routes>
      </TestMemoryRouter>
    );
  }

  it("should show loading state while single post is fetched", () => {
    fetchPostById.mockReturnValue(new Promise(() => {}));

    renderDetailRoute();

    expect(screen.getByText("Loading article...")).toBeInTheDocument();
  });

  it("should render hero image and WordPress content on success", async () => {
    fetchPostById.mockResolvedValue(mockPost);

    renderDetailRoute();

    await waitFor(() => {
      expect(screen.getByText("Full article body from WordPress")).toBeInTheDocument();
    });

    expect(fetchPostById).toHaveBeenCalledWith("31");
    expect(screen.getByRole("img", { name: mockPost.title })).toHaveAttribute(
      "src",
      mockPost.image
    );
    expect(screen.getByRole("img", { name: mockPost.author })).toHaveAttribute(
      "src",
      mockPost.avatar
    );
    expect(screen.getByText(mockPost.author)).toBeInTheDocument();
    expect(screen.getByText("Published 3 August 2026")).toBeInTheDocument();
  });

  it("should show error and back link when post fetch fails", async () => {
    fetchPostById.mockRejectedValue(
      Object.assign(new Error(ARTICLE_LOAD_ERROR), { userMessage: ARTICLE_LOAD_ERROR })
    );

    renderDetailRoute("999");

    await waitFor(() => {
      expect(screen.getByText(ARTICLE_LOAD_ERROR)).toBeInTheDocument();
    });

    expect(screen.getByRole("link", { name: "Back to Blogs" })).toHaveAttribute(
      "href",
      "/blogs"
    );
  });

  it("should render social share links for loaded post", async () => {
    fetchPostById.mockResolvedValue(mockPost);

    renderDetailRoute();

    await waitFor(() => {
      expect(screen.getByLabelText("Share on Facebook")).toBeInTheDocument();
    });

    expect(screen.getByLabelText("Share on Twitter")).toBeInTheDocument();
    expect(screen.getByLabelText("Share on WhatsApp")).toBeInTheDocument();
    expect(screen.getByLabelText("Share on Telegram")).toBeInTheDocument();
  });
});
