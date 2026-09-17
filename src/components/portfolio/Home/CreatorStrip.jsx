import { useEffect, useState } from "react";
import { MapPin } from "lucide-react";

import PortfolioReelVideo from "../components/PortfolioReelVideo";
import { getPortfolioReelPosterFromSrc } from "../data/portfolioReelVideos";
import { getHomepageCreatorVideos } from "../../../services/api/apiservices";

function CreatorAvatar({ src, name }) {
  const [hasError, setHasError] = useState(false);
  const initial = name?.replace(/^@/, "").charAt(0)?.toUpperCase() || "C";

  if (src && !hasError) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setHasError(true)}
        className="h-8 w-8 rounded-full object-cover border border-white/40 shrink-0"
      />
    );
  }

  return (
    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0353a4] to-[#4b96e3] text-[11px] font-bold text-white border border-white/40 uppercase shrink-0">
      {initial}
    </div>
  );
}

function CreatorCard({ creator, duplicate = false }) {
  const videoSrc = creator.videoUrl;
  const poster = getPortfolioReelPosterFromSrc(creator.videoUrl);

  const headshotUrl = creator.profileImage || poster;

  return (
    <li
      className="relative isolate mr-4 h-[420px] w-[260px] shrink-0 overflow-hidden rounded-[12px] bg-[#EDEFF2] sm:h-[520px] sm:w-[320px]"
      aria-hidden={duplicate ? "true" : undefined}
    >
      <PortfolioReelVideo
        src={videoSrc}
        poster={poster}
        autoPlay
        pinPlaybackRate
        preload={duplicate ? "none" : "metadata"}
        showPlayButton={!duplicate}
        playButtonTabIndex={duplicate ? -1 : 0}
        playButtonAriaLabel={`Toggle playback for ${creator.name}'s reel`}
        deferUntilVisible={duplicate}
        className="absolute inset-0 z-0 h-full w-full object-cover"
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-36 bg-gradient-to-t from-black via-black/75 to-transparent"
        aria-hidden="true"
      />

      <div className="absolute inset-x-0 bottom-0 z-20 p-5">
        <div className="flex items-center gap-2">
          <CreatorAvatar src={headshotUrl} name={creator.name} />
          <div>
            <p className="text-[14px] font-semibold text-white drop-shadow-sm">{creator.name}</p>
            {creator.location ? (
              <p className=" flex items-center gap-1.5 text-[10px] text-white drop-shadow-sm">
                <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                {creator.location}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </li>
  );
}

export default function CreatorStrip() {
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    let isCancelled = false;
    async function loadCreators() {
      try {
        const result = await getHomepageCreatorVideos();
        if (!isCancelled && result && result.success && Array.isArray(result.data) && result.data.length > 0) {
          const mapped = result.data.map((item, idx) => ({
            id: item.id || `creator-${idx}`,
            name: item.name || "Creator",
            location: item.location || "South Africa",
            videoUrl: item.videoUrl,
            profileImage: item.profileImage || null,
          }));
          setCreators(mapped);
        }
      } catch (err) {
        console.error("Failed to load creator strip videos:", err);
      }
    }
    loadCreators();
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <section aria-label="Featured creators" className="overflow-hidden py-10 lg:py-14">
      <div className="mx-auto max-w-[1140px] px-6 sm:px-8 lg:px-0">
        <ul
          className="flex w-max hover:[animation-play-state:paused] motion-reduce:[animation:none]"
          style={{ animation: "scrollLeft 120s linear infinite" }}
        >
          {creators.map((creator, index) => (
            <CreatorCard key={creator.id || `${creator.name}-${index}`} creator={creator} />
          ))}
          {creators.map((creator, index) => (
            <CreatorCard
              key={`${creator.id || creator.name}-${index}-loop`}
              creator={creator}
              duplicate
            />
          ))}
        </ul>
      </div>
    </section>
  );
}
