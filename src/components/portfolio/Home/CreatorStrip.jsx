import { useRef, useState } from "react";
import { MapPin, Pause, Play } from "lucide-react";

import reelOne from "../../../assets/videos/portfolio/reels/video1.mov";
import reelTwo from "../../../assets/videos/portfolio/reels/video2.mov";
import reelThree from "../../../assets/videos/portfolio/reels/video3.mov";
import reelFour from "../../../assets/videos/portfolio/reels/video4.mov";
import reelFive from "../../../assets/videos/portfolio/reels/video5.mp4";
import reelSix from "../../../assets/videos/portfolio/reels/video6.mov";
import reelSeven from "../../../assets/videos/portfolio/reels/video7.mov";
import reelEight from "../../../assets/videos/portfolio/reels/video8.mov";

// The track holds two copies of the list and travels exactly -50%, so when the
// first copy leaves the viewport the second sits in the identical position and
// the loop is seamless. Don't change one without the other.

const CREATORS = [
  { name: "Cristofer Workman", location: "United Kingdom", video: reelOne },
  { name: "Natasha Bristol", location: "South Africa", video: reelTwo },
  { name: "Jaxson Mango", location: "South Africa", video: reelThree },
  { name: "Natasha Masuku", location: "Essex, UK", video: reelFour },
  { name: "Lerato Dlamini", location: "Johannesburg, South Africa", video: reelFive },
  { name: "Thandi Mokoena", location: "Durban, South Africa", video: reelSix },
  { name: "Sipho Ndlovu", location: "Cape Town, South Africa", video: reelSeven },
  { name: "Amara Okafor", location: "Manchester, UK", video: reelEight },
];

function CreatorCard({ creator, duplicate }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // Clips always run at normal speed, whatever the browser restored.
  const pinPlaybackRate = (node) => {
    videoRef.current = node;
    if (node) {
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
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <li
      className="relative mr-4 h-[420px] w-[260px] shrink-0 overflow-hidden rounded-[12px] bg-[#EDEFF2] sm:h-[520px] sm:w-[320px]"
      aria-hidden={duplicate ? "true" : undefined}
    >
      <video
        ref={pinPlaybackRate}
        src={creator.video}
        className="absolute inset-0 h-full w-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        tabIndex={-1}
      />

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent"
        aria-hidden="true"
      />

      <button
        type="button"
        onClick={togglePlayback}
        tabIndex={duplicate ? -1 : 0}
        aria-label={isPlaying ? `Pause the reel by ${creator.name}` : `Play the reel by ${creator.name}`}
        className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1A1A1A] shadow-md transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
      >
        {isPlaying ? (
          <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
        ) : (
          <Play className="h-4 w-4 translate-x-px fill-current" aria-hidden="true" />
        )}
      </button>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <p className="text-[14px] font-semibold text-white">{creator.name}</p>
        <p className="mt-1.5 flex items-center gap-1.5 text-[12px] text-white/90">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {creator.location}
        </p>
      </div>
    </li>
  );
}

export default function CreatorStrip() {
  return (
    <section aria-label="Featured creators" className="overflow-hidden py-10 lg:py-14">
      <div className="mx-auto max-w-[1140px] px-6 sm:px-8 lg:px-0">
        <ul
          className="flex w-max hover:[animation-play-state:paused] motion-reduce:[animation:none]"
          style={{ animation: "scrollLeft 120s linear infinite" }}
        >
          {CREATORS.map((creator) => (
            <CreatorCard key={creator.name} creator={creator} />
          ))}
          {CREATORS.map((creator) => (
            <CreatorCard key={`${creator.name}-loop`} creator={creator} duplicate />
          ))}
        </ul>
      </div>
    </section>
  );
}
