import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  FileText,
  MessageSquareText,
  Play,
  ZoomIn,
} from "lucide-react";
import CreatorVideoModal from "../../../../brand/creators/components/CreatorVideoModal";
import CreatorImageModal from "../../../../brand/creators/components/CreatorImageModal";

const STATUS_STYLES = {
  approved: {
    label: "Approved",
    badgeClass: "bg-emerald-600 text-white",
    borderClass: "border-2 border-emerald-500 ring-2 ring-emerald-100",
  },
  revision_requested: {
    label: "Revision",
    badgeClass: "bg-amber-500 text-white",
    borderClass: "border-2 border-amber-400 ring-2 ring-amber-100",
  },
  rejected: {
    label: "Rejected",
    badgeClass: "bg-red-600 text-white",
    borderClass: "border-2 border-red-500 ring-2 ring-red-100",
  },
  pending_review: {
    label: "Pending",
    badgeClass: "bg-blue-600 text-white",
    borderClass: "border-2 border-blue-400 ring-2 ring-blue-100",
  },
};

function getStatusStyle(reviewStatus) {
  return STATUS_STYLES[String(reviewStatus || "").toLowerCase()] || null;
}

function AssetCard({ file, index, onOpen }) {
  const statusStyle = getStatusStyle(file.reviewStatus);

  return (
    <div>
      <button
        type="button"
        onClick={() => onOpen(file)}
        className={`group relative aspect-square w-full cursor-pointer overflow-hidden rounded-xl bg-gray-100 text-left ${
          statusStyle?.borderClass || "border border-gray-200"
        }`}
        aria-label={
          file.type === "video"
            ? `Play ${file.name || `file ${index}`}`
            : `View ${file.name || `file ${index}`}`
        }
      >
        {file.type === "video" ? (
          <video
            src={file.url || file.thumbnail}
            className="h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : file.thumbnail || file.url ? (
          <img
            src={file.thumbnail || file.url}
            alt={file.name}
            className="h-full w-full object-cover"
          />
        ) : null}
        <span className="absolute left-2 top-2 inline-flex h-6 min-w-6 items-center justify-center rounded-md bg-[#0353A4] px-1.5 text-[11px] font-bold text-white">
          #{index}
        </span>
        {statusStyle ? (
          <span
            className={`absolute right-2 top-2 rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${statusStyle.badgeClass}`}
          >
            {statusStyle.label}
          </span>
        ) : null}
        <span className="absolute inset-0 flex items-center justify-center bg-black/10 transition-colors group-hover:bg-black/20">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#0353A4] shadow">
            {file.type === "video" ? (
              <Play className="h-4 w-4 translate-x-px" aria-hidden />
            ) : (
              <ZoomIn className="h-4 w-4" aria-hidden />
            )}
          </span>
        </span>
      </button>
      <p className="mt-2 truncate text-xs font-medium text-gray-800">
        {file.name}
      </p>
      {file.size ? (
        <p className="text-[11px] text-gray-400">{file.size}</p>
      ) : null}
      {file.assetFeedback ? (
        <p className="mt-1 line-clamp-2 text-[11px] text-gray-500">
          {file.assetFeedback}
        </p>
      ) : null}
    </div>
  );
}

function SubmissionAttemptCard({ attempt, defaultOpen, onOpenMedia }) {
  const [open, setOpen] = useState(defaultOpen);
  const files = attempt.files || [];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left hover:bg-gray-50"
      >
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-gray-900">
              {attempt.title}
            </p>
            {attempt.subtitle ? (
              <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-[#0353A4]">
                {attempt.subtitle}
              </span>
            ) : null}
            <span
              className={`rounded-full border px-2 py-0.5 text-[11px] font-semibold ${attempt.statusClassName}`}
            >
              {attempt.statusLabel}
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Submitted {attempt.submittedDate}
            {attempt.reviewedDate && attempt.reviewedDate !== "—"
              ? ` · Reviewed ${attempt.reviewedDate}`
              : ""}
            {files.length
              ? ` · ${files.length} file${files.length === 1 ? "" : "s"}`
              : ""}
          </p>
        </div>
        <span className="mt-0.5 shrink-0 text-gray-400">
          {open ? (
            <ChevronUp className="h-4 w-4" aria-hidden />
          ) : (
            <ChevronDown className="h-4 w-4" aria-hidden />
          )}
        </span>
      </button>

      {open ? (
        <div className="space-y-4 border-t border-gray-100 px-4 py-4">
          {files.length ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              {files.map((file, idx) => (
                <AssetCard
                  key={file.id ?? `${attempt.id}-${idx}`}
                  file={file}
                  index={idx + 1}
                  onOpen={onOpenMedia}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No files in this submission.</p>
          )}

          {attempt.noteToBrand ? (
            <div className="rounded-xl bg-gray-50 px-4 py-3">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                <MessageSquareText className="h-3.5 w-3.5" aria-hidden />
                Your note to brand
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                {attempt.noteToBrand}
              </p>
            </div>
          ) : null}

          {attempt.captionOrHook ? (
            <div className="rounded-xl bg-gray-50 px-4 py-3">
              <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                <FileText className="h-3.5 w-3.5" aria-hidden />
                Caption / hook
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                {attempt.captionOrHook}
              </p>
            </div>
          ) : null}

          {attempt.revisionNotes || attempt.rejectionNotes ? (
            <div className="space-y-2">
              {attempt.revisionNotes ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                    Brand revision notes
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {attempt.revisionNotes}
                  </p>
                </div>
              ) : null}
              {attempt.rejectionNotes ? (
                <div className="rounded-xl border border-red-200 bg-red-50/70 px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-red-700">
                    Brand rejection notes
                  </p>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                    {attempt.rejectionNotes}
                  </p>
                </div>
              ) : null}
            </div>
          ) : attempt.brandFeedback ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 px-4 py-3">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-700">
                Brand feedback
              </p>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                {attempt.brandFeedback}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Full submission history for the creator job detail page.
 * Shows every attempt (initial + revisions) with files, notes, and review status.
 */
export default function RevisionSubmission({ submission }) {
  const [mediaModal, setMediaModal] = useState({
    open: false,
    type: null,
    url: "",
    title: "",
  });

  if (!submission) return null;

  const attempts = Array.isArray(submission.attempts)
    ? submission.attempts
    : null;

  // Legacy flat shape fallback.
  const legacyFiles = submission.files || [];
  const hasLegacy =
    !attempts && (legacyFiles.length > 0 || submission.noteToBrand);
  if (!attempts?.length && !hasLegacy) return null;

  const closeMediaModal = () =>
    setMediaModal({ open: false, type: null, url: "", title: "" });

  const openMedia = (file) => {
    if (!file?.url) return;
    const isVideo = file.type === "video";
    setMediaModal({
      open: true,
      type: isVideo ? "video" : "image",
      url: file.url,
      title: file.name || (isVideo ? "Submission video" : "Submission image"),
    });
  };

  const totalFiles =
    submission.totalFiles ??
    attempts?.reduce((sum, item) => sum + (item.files?.length || 0), 0) ??
    legacyFiles.length;

  const totalAttempts = submission.totalAttempts ?? attempts?.length ?? 1;

  return (
    <>
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Your Submission
            </h3>
            <p className="mt-0.5 text-xs text-gray-500">
              Full history of what you submitted for this job
            </p>
          </div>
          <p className="text-xs text-gray-500 sm:pt-1 sm:text-right">
            {totalAttempts} attempt{totalAttempts === 1 ? "" : "s"} ·{" "}
            {totalFiles} file{totalFiles === 1 ? "" : "s"}
            {submission.submittedDate
              ? ` · Latest ${submission.submittedDate}`
              : ""}
          </p>
        </div>

        {attempts?.length ? (
          <div className="mt-4 space-y-3">
            {[...attempts].reverse().map((attempt, index) => (
              <SubmissionAttemptCard
                key={attempt.id}
                attempt={attempt}
                defaultOpen={index === 0}
                onOpenMedia={openMedia}
              />
            ))}
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {legacyFiles.length ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {legacyFiles.map((file, idx) => (
                  <AssetCard
                    key={file.id ?? idx}
                    file={file}
                    index={idx + 1}
                    onOpen={openMedia}
                  />
                ))}
              </div>
            ) : null}
            {submission.noteToBrand ? (
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Your note to brand
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                  {submission.noteToBrand}
                </p>
              </div>
            ) : null}
            {submission.captionOrHook ? (
              <div className="rounded-xl bg-gray-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Caption / hook
                </p>
                <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-gray-600">
                  {submission.captionOrHook}
                </p>
              </div>
            ) : null}
          </div>
        )}
      </div>

      <CreatorVideoModal
        open={mediaModal.open && mediaModal.type === "video"}
        videoUrl={mediaModal.url}
        title={mediaModal.title}
        onClose={closeMediaModal}
      />
      <CreatorImageModal
        open={mediaModal.open && mediaModal.type === "image"}
        imageUrl={mediaModal.url}
        title={mediaModal.title}
        onClose={closeMediaModal}
      />
    </>
  );
}
