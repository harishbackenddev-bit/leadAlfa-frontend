import React, { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  CloudUpload,
  FileArchive,
  Image as ImageIcon,
  Info,
  Loader2,
  Send,
  Upload,
  Video,
  X,
} from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import {
  UPLOAD_PHASES,
  uploadMediaWithProgress,
  formatSpeed,
} from "../../../../../services/api/mediaUploadService";

const MAX_PER_TYPE = 5;
const WORK_UPLOAD_TYPE = "work_submission";

function UploadProgressBar({ percent }) {
  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className="h-full rounded-full bg-[#0353A4] transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

function MediaUploadSlot({
  accept,
  resourceType,
  usageType,
  helper,
  items,
  onAdd,
  onRemove,
  disabled,
}) {
  const inputRef = useRef(null);
  const abortRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [phase, setPhase] = useState(UPLOAD_PHASES.IDLE);
  const [progress, setProgress] = useState(null);
  const [slotError, setSlotError] = useState(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  const atLimit = items.length >= MAX_PER_TYPE;

  const handlePick = async (file) => {
    if (!file || disabled || atLimit) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setUploading(true);
    setSlotError(null);

    try {
      const result = await uploadMediaWithProgress(file, {
        resourceType,
        uploadType: WORK_UPLOAD_TYPE,
        signal: controller.signal,
        onPhaseChange: setPhase,
        onProgress: setProgress,
      });
      onAdd({
        mediaId: result.mediaId,
        usageType,
        fileName: file.name,
      });
      setPhase(UPLOAD_PHASES.DONE);
    } catch (err) {
      if (err?.name !== "AbortError") {
        setSlotError(err?.message || "Upload failed.");
        setPhase(UPLOAD_PHASES.ERROR);
      }
    } finally {
      setUploading(false);
      setProgress(null);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const overallPercent =
    phase === UPLOAD_PHASES.UPLOAD
      ? 10 + Math.round((progress?.percent ?? 0) * 0.85)
      : phase === UPLOAD_PHASES.REGISTER
        ? 97
        : 5;

  return (
    <div>
      <button
        type="button"
        disabled={disabled || uploading || atLimit}
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-gray-200 bg-[#F7F9FC] px-4 py-6 text-center text-sm font-medium text-gray-500 transition-colors hover:border-blue-300 hover:bg-blue-50/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="flex items-center gap-2">
          <CloudUpload className="h-4 w-4" aria-hidden />
          {uploading ? "Uploading…" : helper}
        </span>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handlePick(e.target.files?.[0])}
        />
      </button>

      {uploading ? (
        <div className="mt-2 rounded-lg border border-blue-100 bg-blue-50/50 px-3 py-2 text-xs text-blue-800">
          <div className="flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            {progress
              ? `${progress.percent}% · ${formatSpeed(progress.speedBps)}`
              : "Preparing…"}
          </div>
          <UploadProgressBar percent={overallPercent} />
        </div>
      ) : null}

      {slotError ? (
        <p className="mt-2 text-xs text-red-600">{slotError}</p>
      ) : null}

      {items.length > 0 ? (
        <ul className="mt-2 space-y-1.5">
          {items.map((item, idx) => (
            <li
              key={`${item.mediaId}-${idx}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs"
            >
              <span className="flex min-w-0 items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <span className="truncate">{item.fileName}</span>
              </span>
              <button
                type="button"
                disabled={disabled || uploading}
                onClick={() => onRemove(idx)}
                className="rounded p-0.5 text-gray-400 hover:text-gray-600"
                aria-label="Remove"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/**
 * Collapsible "Re-submit Revised Content" panel wired to
 * POST /creator/jobs/:jobPublicId/submission/resubmit.
 */
export default function RevisionResubmitForm({
  open,
  onToggle,
  currentRevision,
  maxRevisions = 3,
  jobPublicId,
  onCancel,
  onSubmit,
}) {
  const [finalVideos, setFinalVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [rawVideos, setRawVideos] = useState([]);
  const [note, setNote] = useState("");
  const [caption, setCaption] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const handleSubmit = async () => {
    setSubmitError(null);

    const assets = [
      ...finalVideos.map((f) => ({
        mediaId: f.mediaId,
        usageType: "final_video",
      })),
      ...images.map((f) => ({ mediaId: f.mediaId, usageType: "image" })),
      ...rawVideos.map((f) => ({
        mediaId: f.mediaId,
        usageType: "raw_video",
      })),
    ];

    const trimmedNote = note.trim();
    const trimmedCaption = caption.trim();

    if (!assets.length && !trimmedNote && !trimmedCaption) {
      setSubmitError("Upload at least one file or add a note.");
      return;
    }

    const payload = { assets };
    if (trimmedNote) payload.notes = trimmedNote;
    if (trimmedCaption) payload.captionOrHook = trimmedCaption;

    try {
      setSubmitting(true);
      await onSubmit?.(payload);
    } catch (err) {
      setSubmitError(err?.message || "Failed to resubmit.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left sm:px-6"
      >
        <span className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-[#0353A4]">
            <Upload className="h-4 w-4" aria-hidden />
          </span>
          <span>
            <span className="block text-[15px] font-semibold text-gray-900">
              Re-submit Revised Content
            </span>
            <span className="mt-0.5 block text-xs text-gray-500">
              Upload updated files addressing the brand's feedback
            </span>
          </span>
        </span>
        <span className="text-gray-400">
          {open ? (
            <ChevronUp className="h-5 w-5" aria-hidden />
          ) : (
            <ChevronDown className="h-5 w-5" aria-hidden />
          )}
        </span>
      </button>

      {open ? (
        <div className="border-t border-gray-100 px-5 py-5 sm:px-6">
          <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#0353A4]" aria-hidden />
            <div>
              <p className="text-sm font-semibold text-[#0353A4]">
                {currentRevision != null
                  ? `Revision ${currentRevision} of ${maxRevisions}`
                  : `Up to ${maxRevisions} revision attempts`}
              </p>
              <p className="mt-0.5 text-xs text-gray-600">
                Creators can request revisions up to {maxRevisions} times
                maximum. Please address all feedback points in your revision.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-5">
            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <Video className="h-4 w-4 text-[#0353A4]" aria-hidden />
                <span className="text-sm font-semibold text-gray-900">
                  Final Video(s)
                </span>
              </div>
              <MediaUploadSlot
                accept="video/mp4,video/quicktime,.mp4,.mov"
                resourceType="video"
                usageType="final_video"
                helper="↑ MP4 / MOV · max 500MB each"
                items={finalVideos}
                disabled={submitting}
                onAdd={(item) =>
                  setFinalVideos((prev) => [...prev, item].slice(0, MAX_PER_TYPE))
                }
                onRemove={(idx) =>
                  setFinalVideos((prev) => prev.filter((_, i) => i !== idx))
                }
              />
            </div>

            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <ImageIcon className="h-4 w-4 text-[#0353A4]" aria-hidden />
                <span className="text-sm font-semibold text-gray-900">
                  Images{" "}
                  <span className="text-xs font-medium text-gray-400">
                    (Optional)
                  </span>
                </span>
              </div>
              <MediaUploadSlot
                accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                resourceType="image"
                usageType="image"
                helper="↑ JPG / PNG · max 10MB each"
                items={images}
                disabled={submitting}
                onAdd={(item) =>
                  setImages((prev) => [...prev, item].slice(0, MAX_PER_TYPE))
                }
                onRemove={(idx) =>
                  setImages((prev) => prev.filter((_, i) => i !== idx))
                }
              />
            </div>

            <div>
              <div className="mb-2 flex items-center gap-1.5">
                <FileArchive className="h-4 w-4 text-[#0353A4]" aria-hidden />
                <span className="text-sm font-semibold text-gray-900">
                  Raw Footage{" "}
                  <span className="text-xs font-medium text-gray-400">
                    (Optional)
                  </span>
                </span>
              </div>
              <MediaUploadSlot
                accept="video/mp4,video/quicktime,.mp4,.mov"
                resourceType="video"
                usageType="raw_video"
                helper="↑ MP4 / MOV · max 500MB"
                items={rawVideos}
                disabled={submitting}
                onAdd={(item) =>
                  setRawVideos((prev) => [...prev, item].slice(0, MAX_PER_TYPE))
                }
                onRemove={(idx) =>
                  setRawVideos((prev) => prev.filter((_, i) => i !== idx))
                }
              />
            </div>

            <div>
              <p className="mb-1.5 text-sm font-semibold text-gray-900">
                Note to Brand{" "}
                <span className="text-xs font-medium text-gray-400">
                  (Optional)
                </span>
              </p>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 500))}
                placeholder="Describe the changes you made based on the feedback..."
                disabled={submitting}
                className="min-h-[96px] w-full resize-none rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>

            <div>
              <p className="mb-1.5 text-sm font-semibold text-gray-900">
                Caption or Hook{" "}
                <span className="text-xs font-medium text-gray-400">
                  (Optional)
                </span>
              </p>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value.slice(0, 200))}
                placeholder="Revised hook or caption"
                disabled={submitting}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
            </div>
          </div>

          {submitError ? (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {submitError}
            </p>
          ) : null}

          <div className="mt-5 flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl px-5 text-gray-600 cursor-pointer"
              onClick={onCancel}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || !jobPublicId}
              className="rounded-xl bg-[#0353A4] px-5 text-white hover:bg-[#024080] cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" aria-hidden />
                  Submitting…
                </>
              ) : (
                <>
                  <Send className="mr-1.5 h-4 w-4" aria-hidden />
                  Re-submit Content
                </>
              )}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
