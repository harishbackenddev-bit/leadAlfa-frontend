import { useState } from "react";
import { Download, FileText, Play } from "lucide-react";
import CreatorVideoModal from "../../../brand/creators/components/CreatorVideoModal";
import CreatorImageModal from "../../../brand/creators/components/CreatorImageModal";
import AdminDocumentModal from "./AdminDocumentModal";
import { normalizeMediaGridItem } from "./mediaUtils";

function AdminMediaItemPreview({ item, onDownload }) {
  const [imgError, setImgError] = useState(false);

  const isPdf =
    item.kind === "pdf" ||
    item.kind === "document" ||
    /\.pdf$/i.test(item.url?.split("?")[0] || "") ||
    item.title?.toLowerCase().endsWith(".pdf");

  if (isPdf || item.kind === "document") {
    return (
      <div className="flex h-full w-full flex-col justify-between bg-slate-50/90 p-4 text-left transition-colors hover:bg-slate-100/90">
        <div className="flex items-center justify-between">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-red-100 text-red-500 shadow-2xs">
            <FileText className="h-5 w-5" />
          </div>          
        </div>

        <div className="my-auto space-y-1.5">
          <p className="line-clamp-2 text-xs font-semibold leading-tight text-gray-800">
            {item.title || "Document"}
          </p>
          <span className="inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-500 border border-red-200/60">
            {isPdf ? "PDF Document" : "Document"}
          </span>
        </div>

        <div className="text-[11px] font-medium text-[#0353a4] flex items-center gap-1">
          <span>Click to view</span>
        </div>
      </div>
    );
  }

  const isVideo = item.kind === "video";
  const isVideoUrl = (url) =>
    /\.(mp4|mov|webm|avi|m4v)(\?.*)?$/i.test(url || "");

  const previewIsVideo =
    isVideoUrl(item.previewUrl) || item.previewUrl === item.url;
  const shouldRenderVideoTag =
    isVideo && (previewIsVideo || imgError || !item.previewUrl);

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

  if (item.previewUrl && !imgError) {
    return (
      <img
        src={item.previewUrl}
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

export default function AdminMediaWorksGrid({
  items = [],
  emptyMessage = "No media submitted.",
}) {
  const [videoModal, setVideoModal] = useState({
    open: false,
    url: "",
    title: "",
  });
  const [imageModal, setImageModal] = useState({
    open: false,
    url: "",
    title: "",
  });
  const [documentModal, setDocumentModal] = useState({
    open: false,
    url: "",
    title: "",
  });

  if (!items.length) {
    return <p className="text-gray-500">{emptyMessage}</p>;
  }

  const allGridItems = items.map((file, index) => {
    return normalizeMediaGridItem(file, index);
  });

  const handleCardClick = (item) => {
    const isPdf =
      item.kind === "pdf" ||
      item.kind === "document" ||
      /\.pdf$/i.test(item.url?.split("?")[0] || "") ||
      item.title?.toLowerCase().endsWith(".pdf");

    if (isPdf || item.kind === "document") {
      setDocumentModal({ open: true, url: item.url, title: item.title });
    } else if (item.kind === "video") {
      setVideoModal({ open: true, url: item.url, title: item.title });
    } else {
      setImageModal({
        open: true,
        url: item.url || item.previewUrl,
        title: item.title,
      });
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-4">
        {allGridItems.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            className="group relative aspect-[3/4] w-40 max-w-full cursor-pointer overflow-hidden border border-slate-200 rounded-3xl bg-[#f1f5f9] shadow-2xs transition-all hover:shadow-md hover:scale-[1.01]"
          >
            <AdminMediaItemPreview
              item={item}
              onDownload={(url) => window.open(url, "_blank")}
            />

            {item.kind === "video" ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setVideoModal({
                    open: true,
                    url: item.url,
                    title: item.title,
                  });
                }}
                className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#1E60DB] shadow-lg transition hover:scale-105"
                aria-label={`Play ${item.title}`}
              >
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </button>
            ) : null}
          </div>
        ))}
      </div>

      <CreatorVideoModal
        open={videoModal.open}
        videoUrl={videoModal.url}
        title={videoModal.title}
        onClose={() => setVideoModal({ open: false, url: "", title: "" })}
      />

      <CreatorImageModal
        open={imageModal.open}
        imageUrl={imageModal.url}
        title={imageModal.title}
        onClose={() => setImageModal({ open: false, url: "", title: "" })}
      />

      <AdminDocumentModal
        open={documentModal.open}
        documentUrl={documentModal.url}
        title={documentModal.title}
        onClose={() => setDocumentModal({ open: false, url: "", title: "" })}
      />
    </>
  );
}
