import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "../../../../components/ui/button";

const LANDSCAPE_MAX_WIDTH = 896; // max-w-4xl
const PORTRAIT_MAX_WIDTH = 420;

function getModalWidth(videoWidth, videoHeight) {
  const maxHeight = window.innerHeight * 0.75;
  const maxViewportWidth = window.innerWidth * 0.9;
  const isPortrait = videoHeight > videoWidth;
  const aspectRatio = videoWidth / videoHeight;

  const widthFromHeight = maxHeight * aspectRatio;
  const cap = isPortrait ? PORTRAIT_MAX_WIDTH : LANDSCAPE_MAX_WIDTH;

  return Math.min(widthFromHeight, maxViewportWidth, cap);
}

export default function CreatorVideoModal({ open, videoUrl, title, onClose }) {
  const [modalWidth, setModalWidth] = useState(null);
  const [videoDimensions, setVideoDimensions] = useState(null);

  useEffect(() => {
    if (!open) return undefined;

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  useEffect(() => {
    setModalWidth(null);
    setVideoDimensions(null);
  }, [videoUrl, open]);

  useEffect(() => {
    if (!videoDimensions) return undefined;

    const updateWidth = () => {
      setModalWidth(
        getModalWidth(videoDimensions.width, videoDimensions.height)
      );
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, [videoDimensions]);

  const handleLoadedMetadata = (event) => {
    const { videoWidth, videoHeight } = event.currentTarget;
    if (!videoWidth || !videoHeight) return;
    setVideoDimensions({ width: videoWidth, height: videoHeight });
  };

  if (!open || !videoUrl) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title ? `${title} video` : "Creator video"}
      onClick={onClose}
    >
      <div
        className="relative overflow-hidden rounded-2xl bg-black shadow-2xl transition-[width] duration-200"
        style={{
          width: modalWidth ? `${modalWidth}px` : "min(896px, 90vw)",
          maxWidth: "90vw",
        }}
        onClick={(event) => event.stopPropagation()}
        onContextMenu={(event) => event.preventDefault()}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <p className="truncate font-['Manrope:SemiBold',sans-serif] text-sm font-semibold text-white">
            {title || "Creator video"}
          </p>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-9 w-9 shrink-0 rounded-full text-white hover:bg-white/10"
            aria-label="Close video"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <video
          key={videoUrl}
          src={videoUrl}
          controls
          controlsList="nodownload noplaybackrate noremoteplayback"
          disablePictureInPicture
          disableRemotePlayback
          autoPlay
          playsInline
          draggable={false}
          onContextMenu={(event) => event.preventDefault()}
          onDragStart={(event) => event.preventDefault()}
          onLoadedMetadata={handleLoadedMetadata}
          className="block max-h-[75vh] w-full select-none bg-black object-contain"
        >
          Your browser does not support video playback.
        </video>
      </div>
    </div>
  );
}
