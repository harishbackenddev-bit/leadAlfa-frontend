import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { getPortfolioReelPosterFromSrc } from "../data/portfolioReelVideos";
import { useSingleVideoPlayer } from "../hooks/useSingleVideoPlayer";
import { useInView } from "../hooks/useInView";
import VideoPlayOverlay from "../components/VideoPlayOverlay";
import { getHomepageCreatorVideos } from "../../../services/api/apiservices";
import { getIndustryApiSlug } from "../../../utils/industries";

const ArrowIcon = ({ next }) => (
  <svg className="h-9 w-9 sm:h-10 sm:w-10" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0 26C0 11.6406 11.6406 0 26 0C40.3594 0 52 11.6406 52 26C52 40.3594 40.3594 52 26 52C11.6406 52 0 40.3594 0 26Z"
      fill="#0c7bb3"
    />
    <path
      d={next ? "M18.4166 26H33.5833M33.5833 26L26 18.4167M33.5833 26L26 33.5833" : "M33.5834 26.0001H18.4167M18.4167 26.0001L26 18.4167M18.4167 26.0001L26 33.5834"}
      stroke="white"
      strokeWidth="2.16667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const navBtn =
  "absolute top-1/2 z-20 -translate-y-1/2 cursor-pointer transition-opacity hover:opacity-80";

function CreatorAvatar({ src, name, sizeClass = "h-8 w-8", textClass = "text-[10px]", borderClass = "border border-gray-200" }) {
  const [hasError, setHasError] = useState(false);
  const initial = name?.replace(/^@/, "").charAt(0)?.toUpperCase() || "C";

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={name || "Creator"}
        onError={() => setHasError(true)}
        className={`${sizeClass} rounded-full object-cover shrink-0 ${borderClass}`}
      />
    );
  }

  return (
    <div
      className={`flex ${sizeClass} shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0353a4] to-[#4b96e3] ${textClass} font-bold text-white uppercase ${borderClass}`}
    >
      {initial}
    </div>
  );
}

function VideoCard({ video, playingId, setVideoRef, togglePlay, videoClass, overlaySize }) {
  const [containerRef, inView] = useInView({ rootMargin: "250px", once: true });
  const poster = getPortfolioReelPosterFromSrc(video.src);

  const headshotUrl = video.profileImage || poster;

  return (
    <div
      ref={containerRef}
      className="relative cursor-pointer overflow-hidden rounded-[12px] bg-white shadow-sm transition-transform hover:scale-[1.01]"
      onClick={() => togglePlay(video.id)}
    >
      {inView ? (
        <video
          ref={(el) => setVideoRef(video.id, el)}
          src={`${video.src}#t=0.1`}
          poster={poster ?? undefined}
          className={videoClass}
          loop
          muted={playingId !== video.id}
          playsInline
          preload="metadata"
        />
      ) : (
        poster && (
          <img
            src={poster}
            alt={video.name || "Creator video preview"}
            className={videoClass}
            loading="lazy"
            decoding="async"
          />
        )
      )}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <VideoPlayOverlay isPlaying={playingId === video.id} size={overlaySize} />
      </div>
      <div className="flex items-center justify-between border-t border-[#eee] bg-[#f9f9f9] px-[10px] py-[6px] text-xs">
        <div className="flex items-center gap-1.5 min-w-0">
          <CreatorAvatar src={headshotUrl} name={video.name} />
          <p className="font-medium text-[#1a1a1a] truncate">{video.name}</p>
        </div>
        {/* <p className="flex shrink-0 items-center gap-1 font-semibold text-[#1a1a1a]">
          {video.rating} <span className="text-[#f5b301]">⭐</span>
        </p> */}
      </div>
    </div>
  );
}

function VideoCardSkeleton({ videoClass }) {
  return (
    <div className="relative overflow-hidden rounded-[12px] bg-slate-200 animate-pulse">
      <div className={videoClass} />
      <div className="flex items-center justify-between border-t border-[#eee] bg-[#f9f9f9] px-[10px] py-[6px] text-xs">
        <div className="h-3.5 w-16 rounded bg-slate-300" />
        <div className="h-3.5 w-8 rounded bg-slate-300" />
      </div>
    </div>
  );
}

function MobileGrid({ videos, loading, player }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4 py-6">
        {[1, 2, 3, 4].map((n) => (
          <VideoCardSkeleton
            key={n}
            videoClass="block w-full aspect-[4/5] bg-slate-300 rounded-[12px]"
          />
        ))}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-500">
        No creator videos found for this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 py-6">
      {videos.slice(0, 4).map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          {...player}
          videoClass="block w-full aspect-[4/5] object-cover rounded-[12px]"
          overlaySize={34}
        />
      ))}
    </div>
  );
}

function DesktopCarousel({ videos, loading, player }) {
  if (loading) {
    return (
      <div className="grid grid-cols-4 gap-5 px-6 py-8 sm:px-10">
        {[1, 2, 3, 4].map((n) => (
          <VideoCardSkeleton
            key={n}
            videoClass="block w-full h-[400px] lg:h-[470px] bg-slate-300 rounded-[12px]"
          />
        ))}
      </div>
    );
  }

  if (!videos || videos.length === 0) {
    return (
      <div className="py-12 text-center text-base text-gray-500">
        No creator videos found for this category.
      </div>
    );
  }

  return (
    <div className="relative w-full px-6 py-8 sm:px-10">
      <button
        type="button"
        aria-label="Previous videos"
        className={`vg-prev left-0 ${navBtn} [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-30`}
      >
        <ArrowIcon />
      </button>
      <button
        type="button"
        aria-label="Next videos"
        className={`vg-next right-0 ${navBtn} [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-30`}
      >
        <ArrowIcon next />
      </button>

      <Swiper
        modules={[Navigation]}
        slidesPerView={3}
        spaceBetween={20}
        style={{ padding: "4px" }}
        navigation={{ prevEl: ".vg-prev", nextEl: ".vg-next" }}
        breakpoints={{ 1024: { slidesPerView: 4 } }}
      >
        {videos.map((video) => (
          <SwiperSlide key={video.id}>
            <VideoCard
              video={video}
              {...player}
              videoClass="block w-full h-[400px] lg:h-[470px] object-cover rounded-[12px] rounded-b-0"
              overlaySize={40}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default function VideoGrid() {
  const player = useSingleVideoPlayer();
  const [searchParams] = useSearchParams();
  const selectedIndustry = searchParams.get("industry");

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    let isCancelled = false;

    async function loadCreatorVideos() {
      setLoading(true);
      try {
        const categorySlug = getIndustryApiSlug(selectedIndustry);
        const result = await getHomepageCreatorVideos(categorySlug);

        if (!isCancelled) {
          if (result && result.success && Array.isArray(result.data) && result.data.length > 0) {
            const mapped = result.data.map((item, idx) => ({
              id: item.id || `video-${idx}`,
              name: item.name || "Creator",
              src: item.videoUrl,
              profileImage: item.profileImage || item.avatarUrl || item.avatar || item.image || null,
              location: item.location || "",
              rating: item.rating || 5,
              category: item.category || "",
              source: item.source || "creator",
            }));
            setVideos(mapped);
          } else {
            setVideos([]);
          }
        }
      } catch (err) {
        console.error("Failed to load creator videos from backend:", err);
        if (!isCancelled) {
          setVideos([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    }

    loadCreatorVideos();

    return () => {
      isCancelled = true;
    };
  }, [selectedIndustry]);

  return isDesktop ? (
    <DesktopCarousel videos={videos} loading={loading} player={player} />
  ) : (
    <MobileGrid videos={videos} loading={loading} player={player} />
  );
}
