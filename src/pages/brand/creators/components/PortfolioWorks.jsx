import React, { useState } from "react";
import { Play } from "lucide-react";

const toFullSizeImageUrl = (url) => {
  if (!url?.includes("res.cloudinary.com")) return url;

  const uploadMarker = "/upload/";
  const uploadIndex = url.indexOf(uploadMarker);
  if (uploadIndex === -1) return url;

  const prefix = url.slice(0, uploadIndex + uploadMarker.length);
  const rest = url.slice(uploadIndex + uploadMarker.length);
  const slashIndex = rest.indexOf("/");
  if (slashIndex === -1) return url;

  const transforms = rest.slice(0, slashIndex);
  const assetPath = rest.slice(slashIndex + 1);
  const kept = transforms
    .split(",")
    .filter(
      (part) =>
        part &&
        !/^w_\d+$/.test(part) &&
        !/^h_\d+$/.test(part) &&
        !/^c_/.test(part)
    )
    .join(",");

  return kept ? `${prefix}${kept}/${assetPath}` : `${prefix}${assetPath}`;
};

function PortfolioItemPreview({ item }) {
  const [imgError, setImgError] = useState(false);

  const isVideo = item.type === "video";
  const isVideoUrl = (url) =>
    /\.(mp4|mov|webm|avi|m4v)(\?.*)?$/i.test(url || "");

  const previewImage = item.image ? toFullSizeImageUrl(item.image) : "";
  const previewIsVideo = isVideoUrl(previewImage) || previewImage === item.url;
  const shouldRenderVideoTag =
    isVideo && (previewIsVideo || imgError || !previewImage);

  if (shouldRenderVideoTag && item.url) {
    return (
      <video
        src={item.url}
        preload="metadata"
        muted
        playsInline
        className="h-full w-full object-cover pointer-events-none"
      />
    );
  }

  if (previewImage && !imgError) {
    return (
      <img
        src={previewImage}
        alt={item.title}
        onError={() => setImgError(true)}
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <div className="flex h-full w-full items-center justify-center text-sm text-[#94a3b8]">
      No preview
    </div>
  );
}

export default function PortfolioWorks({ items = [], onPlayVideo }) {
  if (!items.length) return null;

  return (
    <section className="rounded-2xl border border-[#e8edf3] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-5 text-[18px] font-semibold text-[#1a1a1a]">
        Portfolio Works
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative md:aspect-[3/4] aspect-[3/5] overflow-hidden rounded-2xl bg-[#f1f5f9]"
          >
            <PortfolioItemPreview item={item} />

            {item.type === "video" && item.url ? (
              <button
                type="button"
                onClick={() =>
                  onPlayVideo?.({ url: item.url, title: item.title })
                }
                className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#1E60DB] shadow-lg transition hover:scale-105"
                aria-label={`Play ${item.title}`}
              >
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
