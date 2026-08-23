import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { PORTFOLIO_VIDEOS } from "../data/portfolioVideos";
import { useSingleVideoPlayer } from "../hooks/useSingleVideoPlayer";
import VideoPlayOverlay from "../components/VideoPlayOverlay";

const VIDEOS = PORTFOLIO_VIDEOS.filter(
  (v, i, arr) => arr.findIndex((x) => x.src === v.src) === i,
);

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

function VideoCard({ video, playingId, setVideoRef, togglePlay, videoClass, overlaySize }) {
  return (
    <div
      className="relative rounded-[12px] overflow-hidden bg-white cursor-pointer"
      onClick={() => togglePlay(video.id)}
    >
      <video
        ref={(el) => setVideoRef(video.id, el)}
        src={`${video.src}#t=0.1`}
        className={videoClass}
        loop
        muted
        playsInline
        preload="metadata"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <VideoPlayOverlay isPlaying={playingId === video.id} size={overlaySize} />
      </div>
      <div className="flex justify-between items-center px-[10px] py-[6px] text-xs bg-[#f9f9f9] border-t border-[#eee]">
        <p>{video.name}</p>
        <p>{video.rating} ⭐</p>
      </div>
    </div>
  );
}

function MobileGrid({ player }) {
  return (
    <div className="grid grid-cols-2 gap-4 py-6">
      {VIDEOS.slice(0, 4).map((video) => (
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

function DesktopCarousel({ player }) {
  return (
    <div className="relative w-full px-6 py-8 sm:px-10">
      <button type="button" aria-label="Previous videos" className={`vg-prev left-0 ${navBtn} [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-30`}>
        <ArrowIcon />
      </button>
      <button type="button" aria-label="Next videos" className={`vg-next right-0 ${navBtn} [&.swiper-button-disabled]:pointer-events-none [&.swiper-button-disabled]:opacity-30`}>
        <ArrowIcon next />
      </button>

      <Swiper
        modules={[Navigation]}
        slidesPerView={3}
        spaceBetween={20}
        navigation={{ prevEl: ".vg-prev", nextEl: ".vg-next" }}
        breakpoints={{ 1024: { slidesPerView: 4 } }}
      >
        {VIDEOS.map((video) => (
          <SwiperSlide key={video.id}>
            <VideoCard
              video={video}
              {...player}
              videoClass="block w-full h-[400px] lg:h-[470px] object-cover rounded-[12px]"
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
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 768px)").matches,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isDesktop ? <DesktopCarousel player={player} /> : <MobileGrid player={player} />;
}
