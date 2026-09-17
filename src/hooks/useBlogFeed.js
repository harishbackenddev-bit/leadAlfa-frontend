import { useCallback, useEffect, useState } from "react";
import { fetchCategories, fetchPosts, fetchReports } from "../api/wordpress";
import { BLOG_FEED_ERROR, isInvalidPageError } from "../api/wordpress/errors";
import { POSTS_PER_PAGE } from "../config/wordpress";

function getFeedErrorMessage(error) {
  if (error?.userMessage) return error.userMessage;
  if (error?.message && !error.message.startsWith("WordPress API error:")) {
    return error.message;
  }
  return BLOG_FEED_ERROR;
}

export default function useBlogFeed() {
  const [posts, setPosts] = useState([]);
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [categoryId, setCategoryId] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMeta() {
      try {
        const [cats, reps] = await Promise.all([
          fetchCategories(),
          fetchReports(),
        ]);
        if (!cancelled) {
          setCategories(cats);
          setReports(reps);
        }
      } catch (err) {
        console.error("[useBlogFeed] Failed to load categories or reports:", err);
      }
    }

    loadMeta();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadPosts() {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchPosts({
          page,
          perPage: POSTS_PER_PAGE,
          categoryId,
        });

        if (!cancelled) {
          setPosts(result.posts);
          setTotalPages(result.totalPages);
          setTotal(result.total);
        }
      } catch (err) {
        if (!cancelled && isInvalidPageError(err) && page > 1) {
          setPage(1);
          return;
        }

        if (!cancelled) {
          setError(getFeedErrorMessage(err));
          setPosts([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPosts();
    return () => {
      cancelled = true;
    };
  }, [page, categoryId]);

  const setCategory = useCallback((id) => {
    setCategoryId(id);
    setPage(1);
  }, []);

  return {
    posts,
    reports,
    categories,
    page,
    setPage,
    categoryId,
    setCategory,
    totalPages,
    total,
    loading,
    error,
  };
}
