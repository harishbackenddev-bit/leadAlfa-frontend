import React, { useState } from "react";
import { Spin } from "antd";
import { Download, LayoutGrid, List, Play } from "lucide-react";
import { Button } from "../../../../../../components/ui/button";
import CreatorVideoModal from "../../../../creators/components/CreatorVideoModal";
import { downloadApprovedAsset } from "../../../utils/approvedAssetsUtils";

export function ViewToggle({ view, onChange }) {
  return (
    <div className="inline-flex rounded-lg border border-gray-200 bg-white p-0.5">
      <button
        type="button"
        onClick={() => onChange("grid")}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
          view === "grid"
            ? "bg-gray-100 text-gray-900"
            : "text-gray-400 hover:text-gray-600"
        }`}
        aria-label="Grid view"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
          view === "list"
            ? "bg-gray-100 text-gray-900"
            : "text-gray-400 hover:text-gray-600"
        }`}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );
}

function AssetTypeBadge({ label }) {
  return (
    <span className="inline-flex rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
      {label}
    </span>
  );
}

function AssetPreview({ asset, variant = "grid" }) {
  const hasMedia = Boolean(asset.mediaUrl);
  const isVideo = asset.mediaKind === "video";
  const isGrid = variant === "grid";

  if (isGrid) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-t-xl bg-gradient-to-br from-[#0353a4] to-[#024080]">
        {isVideo && hasMedia ? (
          <video
            src={asset.mediaUrl}
            className="h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
            draggable={false}
            onContextMenu={(event) => event.preventDefault()}
          />
        ) : hasMedia ? (
          <img
            src={asset.mediaUrl}
            alt={asset.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20">
              <Play className="h-5 w-5 text-white" fill="white" />
            </div>
          </div>
        )}
        {isVideo && hasMedia ? (
          <span className="absolute inset-0 flex items-center justify-center bg-black/10">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#0353A4] shadow">
              <Play className="h-4 w-4 translate-x-px" aria-hidden />
            </span>
          </span>
        ) : null}
        <span className="absolute bottom-2 right-2 rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white">
          {asset.fileType}
        </span>
      </div>
    );
  }

  return (
    <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-[#0353a4] to-[#024080] sm:h-16 sm:w-16">
      {isVideo && hasMedia ? (
        <video
          src={asset.mediaUrl}
          className="h-full w-full object-cover"
          muted
          playsInline
          preload="metadata"
        />
      ) : hasMedia ? (
        <img
          src={asset.mediaUrl}
          alt={asset.title}
          className="h-full w-full object-cover"
        />
      ) : (
        <Play className="h-5 w-5 text-white" fill="white" />
      )}
    </div>
  );
}

function useAssetPreview(asset) {
  const [videoModal, setVideoModal] = useState({
    open: false,
    url: "",
    title: "",
  });

  const openPreview = () => {
    if (!asset.mediaUrl) return;
    if (asset.mediaKind === "video") {
      setVideoModal({
        open: true,
        url: asset.mediaUrl,
        title: asset.title || "Approved asset",
      });
      return;
    }
    window.open(asset.mediaUrl, "_blank", "noopener,noreferrer");
  };

  return { videoModal, setVideoModal, openPreview };
}

function useAssetDownload(asset) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async (event) => {
    event?.stopPropagation?.();
    event?.preventDefault?.();
    if (!asset.mediaUrl || isDownloading) return;

    setIsDownloading(true);
    try {
      await downloadApprovedAsset(asset);
    } catch {
      window.alert("Unable to download this file. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return { isDownloading, handleDownload };
}

function DownloadButton({ disabled, isDownloading, onClick }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={`h-8 w-8 rounded-lg border-gray-200 transition-colors ${
        isDownloading ? "cursor-wait border-[#1E60DB]/30 bg-[#1E60DB]/5" : ""
      }`}
      aria-label={isDownloading ? "Downloading" : "Download"}
      aria-busy={isDownloading}
      disabled={disabled || isDownloading}
      onClick={onClick}
    >
      {isDownloading ? (
        <Spin size="small" />
      ) : (
        <Download className="h-3.5 w-3.5" />
      )}
    </Button>
  );
}

export function ApprovedAssetGridCard({ asset }) {
  const { videoModal, setVideoModal, openPreview } = useAssetPreview(asset);
  const { isDownloading, handleDownload } = useAssetDownload(asset);

  return (
    <>
      <article className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <button
          type="button"
          onClick={openPreview}
          disabled={!asset.mediaUrl}
          className="block w-full text-left disabled:cursor-default"
          aria-label={`Preview ${asset.title}`}
        >
          <AssetPreview asset={asset} variant="grid" />
        </button>
        <div className="p-4">
          <h3 className="truncate text-sm font-semibold text-gray-900">
            {asset.title}
          </h3>
          <p className="mt-0.5 text-xs text-gray-500">by {asset.creatorName}</p>
          <p className="mt-1 text-xs text-gray-400">
            Uploaded: {asset.uploadedAt} · Approved: {asset.approvedDate}
          </p>
          <div className="mt-3 flex items-center justify-between gap-2">
            <AssetTypeBadge label={asset.assetTypeLabel} />
            <div className="flex gap-1.5">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-8 rounded-lg border-gray-200 px-2.5 text-xs text-gray-600"
                disabled={!asset.mediaUrl}
                onClick={openPreview}
              >
                Preview
              </Button>
              <DownloadButton
                disabled={!asset.mediaUrl}
                isDownloading={isDownloading}
                onClick={handleDownload}
              />
            </div>
          </div>
        </div>
      </article>

      <CreatorVideoModal
        open={videoModal.open}
        videoUrl={videoModal.url}
        title={videoModal.title}
        onClose={() => setVideoModal({ open: false, url: "", title: "" })}
      />
    </>
  );
}

export function ApprovedAssetListRow({ asset, isLast }) {
  const { videoModal, setVideoModal, openPreview } = useAssetPreview(asset);
  const { isDownloading, handleDownload } = useAssetDownload(asset);

  return (
    <>
      <div
        className={`flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:gap-4 ${
          !isLast ? "border-b border-gray-100" : ""
        }`}
      >
        <button
          type="button"
          onClick={openPreview}
          disabled={!asset.mediaUrl}
          className="shrink-0 disabled:cursor-default"
          aria-label={`Preview ${asset.title}`}
        >
          <AssetPreview asset={asset} variant="list" />
        </button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-gray-900">{asset.title}</p>
          <p className="mt-0.5 text-sm text-gray-500">
            {asset.creatorName} · {asset.fileType} · Uploaded {asset.uploadedAt}{" "}
            · Approved {asset.approvedDate}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:shrink-0">
          <AssetTypeBadge label={asset.assetTypeLabel} />
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 rounded-lg border-gray-200 px-2.5 text-xs text-gray-600"
              disabled={!asset.mediaUrl}
              onClick={openPreview}
            >
              Preview
            </Button>
            <DownloadButton
              disabled={!asset.mediaUrl}
              isDownloading={isDownloading}
              onClick={handleDownload}
            />
          </div>
        </div>
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
