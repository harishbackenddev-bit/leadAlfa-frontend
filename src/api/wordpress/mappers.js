import { rewriteWpAssetUrl, rewriteWpContentHtml } from "../../config/wordpress";

const ENTITY_MAP = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#039;": "'",
  "&hellip;": "…",
  "&#038;": "&",
};

export function decodeEntities(text = "") {
  return text.replace(/&[^;]+;/g, (entity) => ENTITY_MAP[entity] || entity);
}

export function stripHtml(html = "") {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return (tmp.textContent || tmp.innerText || "").trim();
}

export function cleanExcerpt(html = "") {
  const text = decodeEntities(stripHtml(html));

  return text
    .replace(/\s*\[(?:…|\.\.\.)\]\s*$/u, "...")
    .trim();
}

function getFeaturedImage(post) {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  if (!media) return null;

  const url =
    media.media_details?.sizes?.medium?.source_url ||
    media.media_details?.sizes?.full?.source_url ||
    media.source_url ||
    null;

  return rewriteWpAssetUrl(url);
}

function getAuthor(post) {
  const author = post._embedded?.author?.[0];
  return {
    name: author?.name || "Unknown",
    avatar: author?.avatar_urls?.["48"] || author?.avatar_urls?.["96"] || null,
  };
}

function getCategory(post) {
  const terms = post._embedded?.["wp:term"]?.flat() || [];
  const category = terms.find((term) => term.taxonomy === "category");
  return category?.name || null;
}

export function mapPost(post) {
  const author = getAuthor(post);

  return {
    id: post.id,
    title: decodeEntities(stripHtml(post.title?.rendered || "")),
    excerpt: cleanExcerpt(post.excerpt?.rendered || ""),
    contentHtml: rewriteWpContentHtml(post.content?.rendered || ""),
    author: author.name,
    avatar: rewriteWpAssetUrl(author.avatar),
    image: getFeaturedImage(post),
    category: getCategory(post),
    date: post.date,
    link: post.link,
    slug: post.slug,
  };
}

export function mapCategory(category) {
  return {
    id: category.id,
    name: category.name,
    slug: category.slug,
    count: category.count,
  };
}
