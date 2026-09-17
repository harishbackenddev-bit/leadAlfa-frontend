import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FacebookIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "../../assets/SVGs/portfolio/share_icons/ShareIcons";
import { fetchPostById } from "../../api/wordpress";
import { ARTICLE_LOAD_ERROR } from "../../api/wordpress/errors";
import avatarFallback from "../../assets/images/portfolio/blogs/Ellipse 2.png";

function formatPublishDate(dateString) {
  if (!dateString) return null;

  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function buildShareUrl(platform, url, title) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  switch (platform) {
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
    case "whatsapp":
      return `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
    case "telegram":
      return `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
    default:
      return url;
  }
}

export default function BlogsArticles2() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadPost() {
      setLoading(true);
      setError(null);

      try {
        const data = await fetchPostById(id);
        if (!cancelled) {
          setPost(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err?.userMessage || ARTICLE_LOAD_ERROR);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadPost();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";
  const shareTitle = post?.title || "";
  const publishDate = formatPublishDate(post?.date);

  return (
    <div className="max-w-[85vw] mx-auto mb-[7vh]">
      <div className="h-[5vh] md:h-[10vh]" />
      <section className="text-center">
        <h2 className="text-lg md:text-[2rem]! font-medium mb-4">
          Blogs <span className="text-[#0c7bb3] font-semibold">& Articles</span>
        </h2>
        <p className="text-[#444A46] text-[11.5px] md:mx-[20%]!">
          Creatrend is a vibrant and growing team of creative professionals,
          all about supporting creators and businesses across the world with
          genuine and impactful User-Generated Content. We work together
          remotely from various locations in the world, which helps us to bring
          a rich mix of ideas and talents to our mission. We are excited to
          empower our community and make a difference together! One thing we all
          have in common is our passion for what we do!
        </p>
      </section>

      {loading && (
        <p className="text-center text-gray-500 text-sm mt-10">
          Loading article...
        </p>
      )}

      {error && (
        <div className="text-center mt-10">
          <p className="text-red-500 text-sm mb-4">{error}</p>
          <Link to="/blogs" className="text-[#0c7bb3] text-sm">
            Back to Blogs
          </Link>
        </div>
      )}

      {!loading && !error && post && (
        <>
          <section className="mt-8 flex flex-col gap-4 md:flex-row! md:gap-0">
            <div className="flex items-center gap-2 md:block!">
              <h4 className="text-[#444A46] text-[10px]">Share</h4>
              <a
                href={buildShareUrl("facebook", shareUrl, shareTitle)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Facebook"
              >
                <FacebookIcon className="fill-white w-7" />
              </a>
              <a
                href={buildShareUrl("twitter", shareUrl, shareTitle)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Twitter"
              >
                <TwitterIcon className="fill-white w-7" />
              </a>
              <a
                href={buildShareUrl("whatsapp", shareUrl, shareTitle)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on WhatsApp"
              >
                <WhatsappIcon className="fill-white w-7" />
              </a>
              <a
                href={buildShareUrl("telegram", shareUrl, shareTitle)}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Share on Telegram"
              >
                <TelegramIcon className="fill-white w-7" />
              </a>
            </div>
            <div className="w-[80vw] mx-auto">
              {post.image && (
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full rounded-[20px]"
                />
              )}
            </div>
          </section>

          <section
            className="mt-10 w-[78vw] mx-auto space-y-5 text-[#666666] text-[12px] leading-6 wp-content"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          <section className="mt-10 w-[78vw] mx-auto border-t border-gray-200 pt-8">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={post.avatar || avatarFallback}
                  alt={post.author}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <span className="text-sm font-medium text-gray-800">
                    {post.author}
                  </span>
                  {publishDate ? (
                    <p className="mt-1 text-xs text-gray-500">
                      Published {publishDate}
                    </p>
                  ) : null}
                </div>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
