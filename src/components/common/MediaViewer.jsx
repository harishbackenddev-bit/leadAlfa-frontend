import React, { useEffect, useRef, useState } from "react";

const MediaViewer = React.memo(   ({ file, className = "", ...props }) => {
  const [src, setSrc] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!file) return;

    let objectUrl = null;
    if (typeof file === "string") {
      setSrc(file);
    } else if (file instanceof File) {
      objectUrl = URL.createObjectURL(file);
      setSrc(objectUrl);
    }

    return () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [file]);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Force browser to start loading data
      video.load();

      // Wait for enough data and then play
      const tryPlay = () => {
        const playPromise = video.play();
        if (playPromise) {
          playPromise.catch((err) =>
            console.warn("Autoplay failed (likely Safari):", err.message)
          );
        }
      };

      video.addEventListener("canplaythrough", tryPlay, { once: true });

      return () => {
        video.removeEventListener("canplaythrough", tryPlay);
      };
    }
  }, [src]);

  if (!src) return null;

  const isImage =
    (typeof file === "string" && /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.split("?")[0])) ||
    (file instanceof File && file.type.startsWith("image/"));

  const isVideo =
    (typeof file === "string" && /\.(mp4|webm|ogg|mov|avi)$/i.test(file.split("?")[0])) ||
    (file instanceof File && file.type.startsWith("video/"));

  if (isImage) {
    return <img src={src} alt="media" className={className} {...props} />;
  }

  if (isVideo) {
    return (
      <video
        ref={videoRef}
        src={src}
        className={className}
        muted
        loop
        playsInline
        // preload="auto" // 👈 tells browser to download ASAP
         preload="metadata"
  loading="lazy"
        disablePictureInPicture
        style={{ display: "block" }}
        {...props}
      />
    );
  }

  return <p>Unsupported media type</p>;
})
//usememo

export default MediaViewer                ;
