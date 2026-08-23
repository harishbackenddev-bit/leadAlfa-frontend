import { useRef, useState } from "react";
import { Pause, Play, Star } from "lucide-react";

// Same auto-scroll marquee as CreatorStrip: two copies of the list travel -50%
// so the loop is seamless, per-card `mr` (not flex gap) keeps the spacing even
// across the seam, and it pauses on hover. Clips live in public/reels, so the
// paths need a leading slash.

const SHOWCASE = [
  { id: 1, label: "Makeup Tutorial", name: "Sarah Johnson", rating: "5", tag: "Beauty", src: "/reels/video5.mp4" },
  { id: 2, label: "Skincare Routine", name: "Emily Brown", rating: "4.9", tag: "Skincare", src: "/reels/video9.mp4" },
  { id: 3, label: "Beauty Review", name: "Olivia Davis", rating: "5", tag: "Reviews", src: "/reels/video3.mov" },
  { id: 4, label: "Product Unboxing", name: "Ava Wilson", rating: "4.8", tag: "Unboxing", src: "/reels/video11.mp4" },
  { id: 5, label: "Get Ready With Me", name: "Naledi Khumalo", rating: "4.9", tag: "Lifestyle", src: "/reels/video2.mov" },
  { id: 6, label: "Product Demo", name: "Thabo Nkosi", rating: "5", tag: "Tech", src: "/reels/video7.mov" },
  { id: 7, label: "Style Haul", name: "Zanele Mbeki", rating: "4.7", tag: "Fashion", src: "/reels/video4.mov" },
  { id: 8, label: "Taste Test", name: "Sipho Dlamini", rating: "4.8", tag: "Food", src: "/reels/video8.mov" },
];

function ShowcaseCard({ item, duplicate = false }) {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
      className="mr-4 w-[230px] shrink-0 sm:w-[250px] lg:mr-[19px] lg:w-[269px]"
      aria-hidden={duplicate ? "true" : undefined}
    >
      <div className="relative aspect-[9/16] overflow-hidden rounded-[12px] bg-[#EDEFF2]">
        <video
          ref={videoRef}
          src={`${item.src}#t=0.1`}
          className="absolute inset-0 h-full w-full object-cover"
          loop
          muted
          playsInline
          preload="metadata"
          tabIndex={-1}
        />

        <button
          type="button"
          onClick={togglePlayback}
          tabIndex={duplicate ? -1 : 0}
          aria-label={isPlaying ? `Pause ${item.label} by ${item.name}` : `Play ${item.label} by ${item.name}`}
          className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#1A1A1A] shadow-md transition-colors hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40"
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 fill-current" aria-hidden="true" />
          ) : (
            <Play className="h-4 w-4 translate-x-px fill-current" aria-hidden="true" />
          )}
        </button>

        <span className="absolute bottom-3 left-3 rounded-md bg-black/55 px-2.5 py-1 text-[12px] font-medium text-white backdrop-blur-sm">
          {item.label}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="truncate text-[14px] font-medium text-[#1A1A1A]">{item.name}</p>
        <p className="flex shrink-0 items-center gap-1 text-[13px] text-[#64748A]">
          {item.rating}
          <Star className="h-3.5 w-3.5 fill-[#F5B301] text-[#F5B301]" aria-hidden="true" />
          <span className="sr-only">out of 5</span>
        </p>
      </div>

      <span className="mt-2 inline-flex rounded-md bg-[#EDF6FB] px-2.5 py-1 text-[12px] font-medium text-[#0C7BB3]">
        {item.tag}
      </span>
    </li>
  );
}

export default function VideoCarousel() {
  return (
    <div className="overflow-hidden py-8 sm:py-10">
      <ul
        className="flex w-max hover:[animation-play-state:paused] motion-reduce:[animation:none]"
        style={{ animation: "scrollLeft 60s linear infinite" }}
      >
        {SHOWCASE.map((item) => (
          <ShowcaseCard key={item.id} item={item} />
        ))}
        {SHOWCASE.map((item) => (
          <ShowcaseCard key={`${item.id}-loop`} item={item} duplicate />
        ))}
      </ul>
    </div>
  );
}
