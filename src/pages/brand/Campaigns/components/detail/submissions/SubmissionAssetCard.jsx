import React, { useState } from "react";
import { Check, Play, RefreshCw, X } from "lucide-react";
import CreatorVideoModal from "../../../../creators/components/CreatorVideoModal";
import {
  cycleAssetDecision,
  getAssetDecisionStyle,
} from "../../../utils/submissionUtils";

function AssetDecisionIcon({ decision }) {
  if (decision === "accepted") return <Check className="h-4 w-4" />;
  if (decision === "revision") return <RefreshCw className="h-4 w-4" />;
  if (decision === "rejected") return <X className="h-4 w-4" />;
  return null;
}

function AssetPreview({ asset, index }) {
  const hasMedia = Boolean(asset.url || asset.thumbnail);

  return (
    <div className="relative flex h-16 w-24 shrink-0 items-center justify-center overflow-hidden rounded-md bg-gray-200">
      {asset.type === "VIDEO" && hasMedia ? (
        <video
          src={asset.url || asset.thumbnail}
          className="h-full w-full object-cover"
          muted
          playsInline
          preload="metadata"
          draggable={false}
          onContextMenu={(event) => event.preventDefault()}
          onDragStart={(event) => event.preventDefault()}
        />
      ) : hasMedia ? (
        <img
          src={asset.thumbnail || asset.url}
          alt={asset.name}
          className="h-full w-full object-cover"
        />
      ) : asset.type === "VIDEO" ? (
        <Play className="h-5 w-5 text-white drop-shadow" fill="white" />
      ) : (
        <span className="text-xs text-gray-500">IMG</span>
      )}
      <span className="absolute left-1 top-1 rounded bg-black/50 px-1 text-[10px] text-white">
        #{index + 1}
      </span>
      {asset.type === "VIDEO" && hasMedia ? (
        <span className="absolute inset-0 flex items-center justify-center bg-black/10">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#0353A4] shadow">
            <Play className="h-3.5 w-3.5 translate-x-px" aria-hidden />
          </span>
        </span>
      ) : null}
    </div>
  );
}

export default function SubmissionAssetCard({
  asset,
  index,
  readOnly = false,
  approveOnly = false,
  onDecisionChange,
}) {
  const [videoModal, setVideoModal] = useState({
    open: false,
    url: "",
    title: "",
  });

  const style = getAssetDecisionStyle(asset.decision);
  const decision = asset.decision || "normal";

  const openPreview = () => {
    if (!asset.url) return;
    if (asset.type === "VIDEO") {
      setVideoModal({
        open: true,
        url: asset.url,
        title: asset.name || "Submission video",
      });
      return;
    }
    window.open(asset.url, "_blank", "noopener,noreferrer");
  };

  const handleCardClick = () => {
    if (readOnly) {
      openPreview();
      return;
    }
    onDecisionChange?.(cycleAssetDecision(decision, { approveOnly }));
  };

  const handlePreviewClick = (event) => {
    event.stopPropagation();
    openPreview();
  };

  return (
    <>
      <div
        className={`flex w-full items-center gap-3 rounded-lg border-2 p-3 text-left transition-colors ${style.border} ${style.bg}`}
      >
        <button
          type="button"
          onClick={handlePreviewClick}
          disabled={!asset.url}
          className="shrink-0 disabled:cursor-default"
          aria-label={`Preview ${asset.name}`}
        >
          <AssetPreview asset={asset} index={index} />
        </button>

        <button
          type="button"
          onClick={handleCardClick}
          className="flex min-w-0 flex-1 items-center gap-3 text-left"
        >
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-gray-900">
              {asset.name}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-medium ${
                  asset.type === "VIDEO"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-pink-100 text-pink-700"
                }`}
              >
                {asset.type}
              </span>
              {asset.size ? (
                <span className="text-xs text-gray-500">{asset.size}</span>
              ) : null}
            </div>
          </div>
          {!readOnly ? (
            <span className={`shrink-0 ${style.icon}`}>
              <AssetDecisionIcon decision={decision} />
            </span>
          ) : null}
        </button>
      </div>

      <CreatorVideoModal
        open={videoModal.open}
        videoUrl={videoModal.url}
        title={videoModal.title}
        onClose={() => setVideoModal({ open: false, url: "", title: "" })}
      />
    </>
  );
}
