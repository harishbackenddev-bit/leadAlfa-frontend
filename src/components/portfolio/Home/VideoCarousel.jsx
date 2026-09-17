import { useEffect, useState } from "react";
import { Star } from "lucide-react";

import PortfolioReelVideo from "../components/PortfolioReelVideo";
import { getPortfolioReelPosterFromSrc } from "../data/portfolioReelVideos";
import { getHomepageCreatorVideos } from "../../../services/api/apiservices";

function ShowcaseCard({ item, duplicate = false }) {
  const poster = getPortfolioReelPosterFromSrc(item.videoUrl);

  return (
    <li
      className="mr-4 w-[230px] shrink-0 sm:w-[250px] lg:mr-[19px] lg:w-[269px]"
      aria-hidden={duplicate ? "true" : undefined}
    >
      <div className="relative aspect-[9/16] overflow-hidden rounded-[12px] bg-[#EDEFF2]">
        <PortfolioReelVideo
          src={item.videoUrl}
          poster={poster}
          showPlayButton={!duplicate}
          playButtonTabIndex={duplicate ? -1 : 0}
          playButtonAriaLabel={`Toggle playback for ${item.name}`}
          startAt={0.1}
          lazy={!duplicate}
          deferUntilVisible={duplicate}
          preload={duplicate ? "none" : "metadata"}
        />

        {item.category ? (
          <span className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2.5 py-1 text-[12px] font-medium text-white backdrop-blur-sm">
            {item.category}
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="truncate text-[14px] font-medium text-[#1A1A1A]">{item.name}</p>
        <p className="flex shrink-0 items-center gap-1 text-[13px] text-[#64748A]">
          {item.rating}
          <Star className="h-3.5 w-3.5 fill-[#F5B301] text-[#F5B301]" aria-hidden="true" />
          <span className="sr-only">out of 5</span>
        </p>
      </div>

      {item.category ? (
        <span className="mt-2 inline-flex rounded-md bg-[#EDF6FB] px-2.5 py-1 text-[12px] font-medium text-[#0C7BB3]">
          {item.category}
        </span>
      ) : null}
    </li>
  );
}

export default function VideoCarousel() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    let isCancelled = false;
    async function loadVideos() {
      try {
        const result = await getHomepageCreatorVideos();
        if (!isCancelled && result?.success && Array.isArray(result.data)) {
          const mapped = result.data
            .map((item, idx) => ({
              id: item.id || `showcase-${idx}`,
              name: item.name || "Creator",
              rating: item.rating || 5,
              category: item.category || "",
              videoUrl: item.videoUrl,
            }))
            .filter((item) => Boolean(item.videoUrl));
          setVideos(mapped);
        }
      } catch (err) {
        console.error("Failed to load video carousel:", err);
      }
    }
    loadVideos();
    return () => {
      isCancelled = true;
    };
  }, []);

  if (videos.length === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden py-8 sm:py-10">
      <ul
        className="flex w-max hover:[animation-play-state:paused] motion-reduce:[animation:none]"
        style={{ animation: "scrollLeft 60s linear infinite" }}
      >
        {videos.map((item) => (
          <ShowcaseCard key={item.id} item={item} />
        ))}
        {videos.map((item) => (
          <ShowcaseCard key={`${item.id}-loop`} item={item} duplicate />
        ))}
      </ul>
    </div>
  );
}
