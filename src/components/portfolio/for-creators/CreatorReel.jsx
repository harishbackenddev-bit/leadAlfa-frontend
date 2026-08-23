import { useEffect, useRef } from "react";

// Source videos have the phone mockup baked in on white — multiply drops the white out.
// Raw footage with no mockup passes `framed` instead: rounded corners, no blend.
// The glow is a ring so it lights the area around the phone without staining the screen.

function prefersReducedMotion() {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function CreatorReel({ videoSrc, creator, description, framed = false, className = "" }) {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && prefersReducedMotion()) {
      videoRef.current.pause();
    }
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div
        className={`pointer-events-none absolute opacity-90 blur-[45px] ${
          framed
            ? "-inset-[16%] bg-[radial-gradient(ellipse_60%_60%_at_50%_50%,rgba(255,175,220,0.85),transparent_72%)]"
            : "-inset-x-[26%] -inset-y-[4%] bg-[radial-gradient(ellipse_40%_50%_at_50%_50%,transparent_74%,rgba(255,175,220,0.85)_90%,transparent)]"
        }`}
        aria-hidden="true"
      />

      <video
        ref={videoRef}
        src={videoSrc}
        className={`relative block w-full ${framed ? "rounded-[28px]" : "mix-blend-multiply"}`}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        aria-label={`${creator} ${description}`}
      />
    </div>
  );
}
