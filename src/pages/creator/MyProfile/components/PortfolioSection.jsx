import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Film, Loader2, Plus, Trash2, X } from "lucide-react";
import {
  addPortfolioVideo,
  deletePortfolioVideo,
} from "../../../../services/api/apiservices";
import {
  uploadMediaWithProgress,
} from "../../../../services/api/mediaUploadService";
import {
  getCreatorIntroVideoUrl,
  getCreatorPortfolioVideos,
  getPortfolioVideoFileError,
  MAX_CREATOR_PORTFOLIO_VIDEOS,
} from "../../../../utils/creatorProfileFormData";

function VideoTile({
  src,
  label,
  onRemove,
  isDeleting = false,
  badgeText = null,
  onPlay,
}) {
  return (
    <div className="w-full max-w-[280px]">
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-black shadow-sm group">
        <video
          key={src}
          src={src}
          controls
          playsInline
          onPlay={onPlay}
          className="aspect-[9/16] w-full object-contain"
        >
          Your browser does not support video playback.
        </video>

        {badgeText ? (
          <span className="absolute left-2 top-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
            {badgeText}
          </span>
        ) : null}

        {onRemove ? (
          <button
            type="button"
            onClick={onRemove}
            disabled={isDeleting}
            aria-label="Remove portfolio video"
            title="Delete video"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-600/90 text-white shadow-md transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            ) : (
              <Trash2 className="h-4 w-4" aria-hidden />
            )}
          </button>
        ) : null}
      </div>
      {label ? (
        <p className="mt-2 truncate text-sm font-medium text-gray-700">{label}</p>
      ) : null}
    </div>
  );
}

function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  isDeleting,
  error,
}) {
  useEffect(() => {
    if (!isOpen) return undefined;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Pause any playing videos in background when modal opens
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => {
      if (!video.paused) {
        video.pause();
      }
    });

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !isDeleting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isDeleting, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn"
      onClick={() => {
        if (!isDeleting) onClose();
      }}
    >
      <div
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl transition-all border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Delete Portfolio Video
              </h3>
              <p className="text-xs text-gray-500">
                Permanent media deletion
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition cursor-pointer disabled:opacity-50"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-4">
         Are you sure you want to permanently delete this portfolio video? This action will permanently delete the associated storage file and cannot be undone.
        </p>

        {error ? (
          <p className="mb-4 text-xs font-medium text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-200" role="alert">
            {error}
          </p>
        ) : null}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50 transition shadow-sm flex items-center gap-2 cursor-pointer"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <span>Delete Video</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function createPendingItem(file) {
  return {
    id: `${file.name}-${file.size}-${file.lastModified}-${
      crypto.randomUUID?.() ?? Math.random()
    }`,
    file,
    previewUrl: URL.createObjectURL(file),
  };
}

export default function PortfolioSection({ profile, user, onProfileUpdated }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const containerRef = useRef(null);
  const [pendingItems, setPendingItems] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [deletingMediaId, setDeletingMediaId] = useState(null);
  const [videoToDelete, setVideoToDelete] = useState(null);
  const [deleteModalError, setDeleteModalError] = useState("");

  const handleVideoPlay = (event) => {
    const activeVideo = event.currentTarget;
    const root = containerRef.current || document;
    const allVideos = root.querySelectorAll("video");
    allVideos.forEach((video) => {
      if (video !== activeVideo && !video.paused) {
        video.pause();
      }
    });
  };

  const introVideoUrl = getCreatorIntroVideoUrl(profile);
  const portfolioVideos = getCreatorPortfolioVideos(profile);
  const remainingSlots =
    MAX_CREATOR_PORTFOLIO_VIDEOS - portfolioVideos.length - pendingItems.length;
  const canAddPortfolio = remainingSlots > 0 && !uploading;

  const revokeItem = (item) => {
    if (item?.previewUrl) URL.revokeObjectURL(item.previewUrl);
  };

  const handleAddClick = () => {
    if (!canAddPortfolio) return;
    setUploadError("");
    fileInputRef.current?.click();
  };

  const handleFilesSelected = (event) => {
    const selected = Array.from(event.target.files || []);
    event.target.value = "";
    if (selected.length === 0) return;

    const validFiles = [];
    let firstError = "";

    selected.forEach((file) => {
      const error = getPortfolioVideoFileError(file);
      if (error) {
        if (!firstError) firstError = error;
        return;
      }
      validFiles.push(file);
    });

    if (firstError) setUploadError(firstError);
    else setUploadError("");

    if (validFiles.length === 0) return;

    setPendingItems((prev) => {
      const slotsLeft =
        MAX_CREATOR_PORTFOLIO_VIDEOS - portfolioVideos.length - prev.length;
      const existingKeys = new Set(
        prev.map(
          (item) => `${item.file.name}-${item.file.size}-${item.file.lastModified}`
        )
      );
      const additions = validFiles
        .filter(
          (file) =>
            !existingKeys.has(
              `${file.name}-${file.size}-${file.lastModified}`
            )
        )
        .slice(0, Math.max(0, slotsLeft))
        .map(createPendingItem);
      return [...prev, ...additions];
    });
  };

  const handleRemovePending = (id) => {
    setPendingItems((prev) => {
      const item = prev.find((entry) => entry.id === id);
      revokeItem(item);
      return prev.filter((entry) => entry.id !== id);
    });
  };

  const handleUpload = async () => {
    if (pendingItems.length === 0 || uploading) return;

    try {
      setUploading(true);
      setUploadError("");

      for (let i = 0; i < pendingItems.length; i++) {
        const item = pendingItems[i];
        setUploadProgress(
          `Uploading video ${i + 1} of ${pendingItems.length}...`
        );

        const uploaded = await uploadMediaWithProgress(item.file, {
          resourceType: "video",
          uploadType: "portfolio_video",
          onProgress: (p) => {
            setUploadProgress(
              `Uploading video ${i + 1} of ${pendingItems.length} (${p.percent}%)...`
            );
          },
        });

        if (!uploaded?.mediaId) {
          throw new Error(
            `Failed to register media for ${item.file.name}.`
          );
        }

        setUploadProgress(
          `Adding video ${i + 1} of ${pendingItems.length} to portfolio...`
        );
        await addPortfolioVideo(uploaded.mediaId);
      }

      pendingItems.forEach(revokeItem);
      setPendingItems([]);
      setUploadProgress("");
      await onProfileUpdated?.();
    } catch (error) {
      setUploadError(
        error?.message || error?.error || "Failed to upload portfolio video."
      );
    } finally {
      setUploading(false);
      setUploadProgress("");
    }
  };

  const handleConfirmDelete = async () => {
    if (!videoToDelete || deletingMediaId) return;
    const targetMediaId = videoToDelete.mediaId || videoToDelete.id;
    if (!targetMediaId) return;

    try {
      setDeletingMediaId(targetMediaId);
      setDeleteModalError("");
      await deletePortfolioVideo(targetMediaId);
      await onProfileUpdated?.();
      setVideoToDelete(null);
    } catch (error) {
      setDeleteModalError(
        error?.message || error?.error || "Failed to remove portfolio video."
      );
    } finally {
      setDeletingMediaId(null);
    }
  };

  return (
    <>
      <div ref={containerRef} className="bg-white rounded-lg p-4 sm:p-6 mb-6 shadow-sm border border-gray-100">
        <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h4 className="text-xl font-semibold text-gray-900">
              Intro & Portfolio Videos
            </h4>
            <p className="text-sm text-gray-500">
              Your intro video from onboarding, plus up to{" "}
              {MAX_CREATOR_PORTFOLIO_VIDEOS} portfolio showcase videos
            </p>
          </div>
          <div className="text-sm font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full self-start sm:self-auto border border-gray-200">
            Portfolio: {portfolioVideos.length} / {MAX_CREATOR_PORTFOLIO_VIDEOS}
          </div>
        </div>

        <div className="flex flex-wrap gap-4  md:justify-start  justify-center">
          {/* Intro Video Tile */}
          {introVideoUrl ? (
            <VideoTile
              src={introVideoUrl}
              label="Intro Video"
              badgeText="Intro"
              onPlay={handleVideoPlay}
            />
          ) : (
            <div className="w-full max-w-[280px] rounded-xl border-2 border-dashed border-gray-200 py-14 flex flex-col items-center justify-center text-center px-4">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
                <Film className="h-8 w-8 text-[#1E60DB]" strokeWidth={1.5} aria-hidden />
              </div>
              <p className="mb-1 font-medium text-gray-900">No intro video yet</p>
              <p className="mb-4 max-w-sm text-sm text-gray-500">
                Upload your intro video from Edit Profile to help brands get to know you.
              </p>
              <button
                type="button"
                onClick={() => navigate("/creator/my-profile/edit")}
                className="text-sm font-medium text-[#1E60DB] transition hover:underline cursor-pointer"
              >
                Go to Edit Profile
              </button>
            </div>
          )}

          {/* Existing Portfolio Video Tiles */}
          {portfolioVideos.map((item, index) => (
            <VideoTile
              key={item.id}
              src={item.url}
              label={`Portfolio Video ${index + 1}`}
              badgeText={`Portfolio ${index + 1}`}
              isDeleting={deletingMediaId === (item.mediaId || item.id)}
              onRemove={() => {
                setDeleteModalError("");
                setVideoToDelete(item);
              }}
              onPlay={handleVideoPlay}
            />
          ))}

          {/* Pending Upload Preview Tiles */}
          {pendingItems.map((item, index) => (
            <VideoTile
              key={item.id}
              src={item.previewUrl}
              label={item.file.name || `Attached ${index + 1}`}
              badgeText="Pending"
              onRemove={uploading ? undefined : () => handleRemovePending(item.id)}
              onPlay={handleVideoPlay}
            />
          ))}

          {/* Add Portfolio Video Button / Drop Area */}
          {remainingSlots > 0 ? (
            <div className="w-full max-w-[280px]">
              <input
                ref={fileInputRef}
                type="file"
                accept="video/mp4,video/quicktime,.mp4,.mov"
                multiple={remainingSlots > 1}
                className="sr-only"
                aria-label="Attach portfolio video"
                onChange={handleFilesSelected}
              />
              <button
                type="button"
                onClick={handleAddClick}
                disabled={!canAddPortfolio}
                className="flex aspect-[9/16] w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-center transition hover:border-[#1E60DB] hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
              >
                <Plus className="mb-2 h-8 w-8 text-[#1E60DB]" aria-hidden />
                <span className="text-sm font-medium text-gray-900">
                  {pendingItems.length > 0 ? "Add More" : "Add Portfolio Video"}
                </span>
                <span className="mt-1 px-3 text-xs text-gray-500">
                  {`${remainingSlots} remaining of ${MAX_CREATOR_PORTFOLIO_VIDEOS} · MP4 or MOV, max 120MB`}
                </span>
              </button>
            </div>
          ) : null}
        </div>

        {pendingItems.length > 0 ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-gray-100 pt-4">
            <p className="text-sm text-gray-600">
              {uploadProgress ||
                `${pendingItems.length} video${
                  pendingItems.length === 1 ? "" : "s"
                } attached. Click Upload to save to your portfolio.`}
            </p>
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="w-full sm:w-auto px-7 py-3.5 main-btn text-white rounded-full text-sm transition disabled:cursor-not-allowed disabled:opacity-60 flex items-center justify-center gap-2 cursor-pointer"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Upload</span>
              )}
            </button>
          </div>
        ) : null}

        {uploadError ? (
          <p className="mt-3 text-sm font-medium text-red-600" role="alert">
            {uploadError}
          </p>
        ) : null}
      </div>

      <DeleteConfirmationModal
        isOpen={Boolean(videoToDelete)}
        onClose={() => {
          if (!deletingMediaId) {
            setVideoToDelete(null);
            setDeleteModalError("");
          }
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={Boolean(deletingMediaId)}
        error={deleteModalError}
      />
    </>
  );
}
