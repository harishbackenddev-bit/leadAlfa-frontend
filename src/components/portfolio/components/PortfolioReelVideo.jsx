import { useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import { getPortfolioReelPosterFromSrc } from "../data/portfolioReelVideos";
import { useInView } from "../hooks/useInView";

export default function PortfolioReelVideo({
  src,
  poster,
  autoPlay = false,
  loop = true,
  muted = true,
  playsInline = true,
  preload = "metadata",
  className = "absolute inset-0 h-full w-full object-cover",
  showPlayButton = false,
  playButtonTabIndex = 0,
  playButtonAriaLabel = "Toggle video playback",
  pinPlaybackRate = false,
  startAt,
  /** Defer assigning src until near viewport (below-fold sections). */
  lazy = false,
  /** Marquee loop clones — show poster first, load video only when visible. */
  deferUntilVisible = false,
}) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [containerRef, inView] = useInView({
    rootMargin: deferUntilVisible ? "120px" : "400px",
    once: true,
    disabled: !lazy && !deferUntilVisible,
  });

  const shouldLoadVideo = src && (!lazy && !deferUntilVisible ? true : inView);
  const posterSrc = poster ?? getPortfolioReelPosterFromSrc(src);
  const playbackSrc =
    shouldLoadVideo && startAt != null && startAt > 0 ? `${src}#t=${startAt}` : src;

  const setVideoNode = (node) => {
    videoRef.current = node;
    if (node && pinPlaybackRate) {
      node.playbackRate = 1;
    }
  };

  const togglePlayback = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    if (video.paused) {
      const playback = video.play();
      if (playback && typeof playback.catch === "function") {
        playback.catch(() => setIsPlaying(false));
      }
      setIsPlaying(true);
      return;
    }

    video.pause();
    setIsPlaying(false);
  };

  if (!src) {
    return null;
  }

  return (
    <div ref={containerRef} className="absolute inset-0 z-0">
      {shouldLoadVideo ? (
        <video
          ref={setVideoNode}
          src={playbackSrc}
          poster={posterSrc ?? undefined}
          className={className}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          preload={preload}
          tabIndex={-1}
        />
      ) : (
        posterSrc && (
          <img
            src={posterSrc}
            alt=""
            className={className}
            loading="lazy"
            decoding="async"
          />
        )
      )}

      {showPlayButton && shouldLoadVideo ? (
        <button
          type="button"
          onClick={togglePlayback}
          tabIndex={playButtonTabIndex}
          aria-label={playButtonAriaLabel}
          className="absolute hidden left-1/2 top-1/2 z-10 h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1A1A1A] shadow-md transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4 translate-x-px fill-current" aria-hidden="true" />
          )}
        </button>
      ) : null}
    </div>
  );
}
