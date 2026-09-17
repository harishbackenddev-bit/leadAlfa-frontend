import { POSTS_PER_PAGE, REPORTS_LIMIT } from "../../config/wordpress";
import { wpFetch } from "./client";
import { mapCategory, mapPost } from "./mappers";

function buildPostsQuery({ page = 1, perPage = POSTS_PER_PAGE, categoryId } = {}) {
  const params = new URLSearchParams({
    _embed: "1",
    page: String(page),
    per_page: String(perPage),
  });

  if (categoryId) {
    params.set("categories", String(categoryId));
  }

  return `/posts?${params.toString()}`;
}

export async function fetchPosts({ page = 1, perPage = POSTS_PER_PAGE, categoryId } = {}) {
  const { data, total, totalPages } = await wpFetch(
    buildPostsQuery({ page, perPage, categoryId })
  );

  return {
    posts: data.map(mapPost),
    total,
    totalPages,
  };
}

export async function fetchCategories() {
  const { data } = await wpFetch(
    "/categories?per_page=100&hide_empty=true"
  );

  return data.map(mapCategory);
}

export async function fetchPostById(id) {
  const { data } = await wpFetch(`/posts/${id}?_embed=1`, { errorContext: "article" });
  return mapPost(data);
}

export async function fetchReports(limit = REPORTS_LIMIT) {
  const { data } = await wpFetch(
    `/posts?_embed=1&per_page=${limit}&page=1`
  );

  return data.map(mapPost);
}
