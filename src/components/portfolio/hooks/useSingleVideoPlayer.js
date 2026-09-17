import { useCallback, useRef, useState } from "react";

export function useSingleVideoPlayer() {
  const [playingId, setPlayingId] = useState(null);
  const videoRefs = useRef({});

  const setVideoRef = useCallback((id, el) => {
    if (el) {
      videoRefs.current[id] = el;
    } else {
      delete videoRefs.current[id];
    }
  }, []);

  const pauseAll = useCallback(() => {
    Object.values(videoRefs.current).forEach((vid) => {
      if (vid) {
        vid.muted = true;
        if (!vid.paused) vid.pause();
      }
    });
    setPlayingId(null);
  }, []);

  const togglePlay = useCallback(
    (id) => {
      const video = videoRefs.current[id];
      if (!video) return;

      if (playingId === id) {
        video.muted = true;
        video.pause();
        setPlayingId(null);
        return;
      }
      Object.entries(videoRefs.current).forEach(([vidId, vid]) => {
        if (vid && String(vidId) !== String(id)) {
          vid.muted = true;
          if (!vid.paused) vid.pause();
        }
      });

      video.muted = false;
      video.play().catch(() => {
        video.muted = true;
        setPlayingId(null);
      });
      setPlayingId(id);
    },
    [playingId]
  );

  return { playingId, setVideoRef, togglePlay, pauseAll };
}
