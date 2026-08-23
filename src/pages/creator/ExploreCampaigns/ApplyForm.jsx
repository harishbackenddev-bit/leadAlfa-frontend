import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  CloudUpload,
  FileVideo,
  Loader2,
  RotateCcw,
  X,
} from "lucide-react";
import UploadIcon from "../../../assets/SVGs/creator/uploadIcon.svg";
import {
  UPLOAD_PHASES,
  uploadMediaWithProgress,
  formatBytes,
  formatDuration,
  formatSpeed,
} from "../../../services/api/mediaUploadService";

/**
 * Data flow (matches docs/initiale_signature.md):
 *
 *   On file pick   → 1) POST /upload/initiate-signature
 *                    2) PUT-direct to Cloudinary (XHR + real progress)
 *                    3) POST /media/register   → mediaId stored in state
 *
 *   On submit      → 4) externalSubmit(id, { pitch, proposedBudget, mediaId })
 *
 * Steps 1-3 run automatically as soon as the user chooses a file so by the
 * time they've finished typing pitch / budget the upload is already done and
 * the submit button is effectively instant. Steps 1-3 are owned entirely by
 * `uploadMediaWithProgress`.
 */
export default function ApplyForm({
  title = "Submit Proposal",
  subtitle = "Upload or paste your brief for AI-powered compliance analysis",
  submitLabel = "Submit Proposal",
  backLink = "/creator/my-jobs",
  backLabel = "My Collabs",
  onSubmit: externalSubmit,
  showBudget = true,
}) {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const abortRef = useRef(null);

  const [pitch, setPitch] = useState("");
  const [budget, setBudget] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  // Background upload state ---------------------------------------------------
  // `mediaId` is set once Steps 1-3 succeed. Until then submit is blocked.
  const [phase, setPhase] = useState(UPLOAD_PHASES.IDLE);
  const [progress, setProgress] = useState(null);
  const [mediaId, setMediaId] = useState(null);
  const [uploadError, setUploadError] = useState(null);

  // Step-4 submit state -------------------------------------------------------
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Abort any in-flight upload if the user navigates away.
  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  /* ---------------------------------------------------------------- */
  /* File picker / background upload                                  */
  /* ---------------------------------------------------------------- */

  const openFilePicker = () => {
    if (submitting) return;
    fileInputRef.current?.click();
  };

  const startBackgroundUpload = async (picked) => {
    // Cancel any previous upload before starting a fresh one.
    abortRef.current?.abort();

    setMediaId(null);
    setUploadError(null);
    setSubmitError(null);
    setProgress(null);
    setPhase(UPLOAD_PHASES.SIGNATURE);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const result = await uploadMediaWithProgress(picked, {
        signal: controller.signal,
        onPhaseChange: setPhase,
        onProgress: setProgress,
      });
      setMediaId(result.mediaId);
      setPhase(UPLOAD_PHASES.DONE);
    } catch (err) {
      console.error("[ApplyForm] Background upload failed:", err);
      if (err?.name === "AbortError") {
        setUploadError("Upload cancelled.");
      } else {
        setUploadError(err?.message || "Upload failed. Please try again.");
      }
      setPhase(UPLOAD_PHASES.ERROR);
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
    }
  };

  const handleFileChange = (e) => {
    const picked = e.target.files?.[0];
    if (!picked) return;
    setFile(picked);
    setFileName(picked.name);
    startBackgroundUpload(picked);
  };

  const handleClearFile = () => {
    if (submitting) return;
    abortRef.current?.abort();
    setFile(null);
    setFileName("");
    setMediaId(null);
    setProgress(null);
    setUploadError(null);
    setSubmitError(null);
    setPhase(UPLOAD_PHASES.IDLE);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRetryUpload = () => {
    if (file) startBackgroundUpload(file);
  };

  const handleCancelUpload = () => {
    abortRef.current?.abort();
  };

  /* ---------------------------------------------------------------- */
  /* Submit                                                           */
  /* ---------------------------------------------------------------- */

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!externalSubmit) {
      alert(`${submitLabel} (mock) for campaign ${id}`);
      navigate(-1);
      return;
    }

    if (!file) {
      setSubmitError("Please choose a video or image file to upload.");
      return;
    }
    if (!mediaId) {
      setSubmitError(
        phase === UPLOAD_PHASES.ERROR
          ? "Upload failed — please retry before submitting."
          : "Please wait — your file is still uploading."
      );
      return;
    }

    // Build the JSON payload the backend expects. proposedBudget must be a
    // number (sending a string caused a 500 on /campaign-applications/apply).
    const payload = {
      pitch: pitch.trim(),
      mediaId,
    };
    if (showBudget) {
      const trimmedBudget = String(budget).trim();
      if (!trimmedBudget) {
        setSubmitError("Please set a budget.");
        return;
      }
      const numeric = Number(trimmedBudget);
      if (!Number.isFinite(numeric) || numeric <= 0) {
        setSubmitError("Budget must be a positive number.");
        return;
      }
      payload.proposedBudget = numeric;
    }

    try {
      setSubmitting(true);
      await externalSubmit(id, payload);
    } catch (err) {
      console.error("[ApplyForm] Submit failed:", err);
      setSubmitError(
        err?.error || err?.message || "Failed to submit application."
      );
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------------------------------------------------------------- */
  /* Derived UI state                                                 */
  /* ---------------------------------------------------------------- */

  const isUploading =
    phase === UPLOAD_PHASES.SIGNATURE ||
    phase === UPLOAD_PHASES.UPLOAD ||
    phase === UPLOAD_PHASES.REGISTER;
  const isUploaded = phase === UPLOAD_PHASES.DONE && !!mediaId;
  const hasUploadError = phase === UPLOAD_PHASES.ERROR;

  const phaseLabel = (() => {
    switch (phase) {
      case UPLOAD_PHASES.SIGNATURE:
        return "Preparing secure upload…";
      case UPLOAD_PHASES.UPLOAD:
        return progress
          ? `Uploading — ${progress.percent}%`
          : "Uploading…";
      case UPLOAD_PHASES.REGISTER:
        return "Finalizing media…";
      case UPLOAD_PHASES.DONE:
        return "Upload complete";
      case UPLOAD_PHASES.ERROR:
        return uploadError || "Upload failed";
      default:
        return "";
    }
  })();

  // Visual progress percent (Step 2 dominates; other steps move the bar a bit).
  const overallPercent = (() => {
    if (phase === UPLOAD_PHASES.SIGNATURE) return 3;
    if (phase === UPLOAD_PHASES.UPLOAD) {
      return 5 + Math.round((progress?.percent ?? 0) * 0.9); // 5 → 95
    }
    if (phase === UPLOAD_PHASES.REGISTER) return 97;
    if (phase === UPLOAD_PHASES.DONE) return 100;
    return 0;
  })();

  const submitDisabled = submitting || isUploading || !isUploaded;
  const submitButtonText = (() => {
    if (submitting) return "Submitting…";
    if (isUploading) {
      return phase === UPLOAD_PHASES.UPLOAD && progress
        ? `Uploading ${progress.percent}%`
        : "Uploading…";
    }
    if (hasUploadError) return "Retry upload first";
    if (!file) return submitLabel;
    return submitLabel;
  })();

  /* ---------------------------------------------------------------- */
  /* Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back link */}
        <Link
          to={backLink}
          className="mb-4 inline-flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-700"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden />
          <span>Back to {backLabel}</span>
        </Link>

        {/* Page header */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <h1 className=" text-2xl font-bold text-gray-900 sm:text-4xl">
              {title}
            </h1>
            {subtitle ? (
              <p className="mt-1 text-sm text-gray-500">{subtitle}</p>
            ) : null}
          </div>

          <div className="md:flex hidden items-center gap-3 sm:flex-shrink-0">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={submitting}
              className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="apply-form"
              disabled={submitDisabled}
              className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-lg btn-gradient px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70"
            >
              {(submitting || isUploading) && (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              )}
              {submitButtonText}
            </button>
          </div>
        </div>

        {/* Form card */}
        <form
          id="apply-form"
          onSubmit={handleSubmit}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8"
        >
          {/* Add Your Pitch */}
          <div className="mb-8">
            <label
              htmlFor="apply-pitch"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Add Your Pitch
            </label>
            <textarea
              id="apply-pitch"
              value={pitch}
              onChange={(e) => setPitch(e.target.value)}
              placeholder="Paste your marketing brief content here..."
              disabled={submitting}
              className="w-full min-h-[200px] resize-vertical rounded-lg border border-gray-200 p-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0c7bb3] focus:outline-none focus:ring-2 focus:ring-[#0c7bb3]/20 disabled:cursor-not-allowed disabled:bg-gray-50"
            />
          </div>

          {/* Set Budget */}
          {showBudget && (
            <div className="mb-8">
              <label
                htmlFor="apply-budget"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Set Budget
              </label>
              <div className="relative">
                <span
                  className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-medium text-gray-500"
                  aria-hidden
                >
                  R
                </span>
                <input
                  id="apply-budget"
                  type="text"
                  name="budget"
                  inputMode="decimal"
                  autoComplete="off"
                  value={budget}
                  onChange={(e) => {
                    const cleaned = e.target.value
                      .replace(/[^\d.]/g, "")
                      .replace(/(\..*)\./g, "$1");
                    setBudget(cleaned);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "-" || e.key === "+" || e.key === "e") {
                      e.preventDefault();
                    }
                  }}
                  placeholder="Enter your budget amount"
                  disabled={submitting}
                  className="w-full rounded-lg border border-gray-200 py-3 pl-8 pr-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-[#0c7bb3] focus:outline-none focus:ring-2 focus:ring-[#0c7bb3]/20 disabled:cursor-not-allowed disabled:bg-gray-50"
                />
              </div>
            </div>
          )}

          {/* Upload File */}
          <div>
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Upload File <span className="text-red-500">*</span>
            </label>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/mp4,video/quicktime,image/avif,.mp4,.mov,.avif"
              onChange={handleFileChange}
              disabled={submitting || isUploading}
              className="hidden"
            />

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
              <button
                type="button"
                onClick={openFilePicker}
                disabled={submitting || isUploading}
                aria-label="Choose file"
                className={`flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white transition-colors ${
                  submitting || isUploading
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:border-[#0c7bb3]/40"
                }`}
              >
                <img
                  src={UploadIcon}
                  alt=""
                  aria-hidden
                  className="h-8 w-8 opacity-80"
                />
              </button>

              <div className="flex flex-1 flex-col gap-2 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={openFilePicker}
                    disabled={submitting || isUploading}
                    className="inline-flex w-fit items-center rounded-lg border border-[#0c7bb3]/30 bg-white px-4 py-2 text-sm font-medium text-[#0c7bb3] transition-colors hover:bg-[#0c7bb3]/5 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {file ? "Replace file" : "Choose file"}
                  </button>
                  {isUploaded && (
                    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                      Ready to submit
                    </span>
                  )}
                </div>

                <p className="text-xs text-gray-400">
                  .avif, .mp4, .mov files. The file uploads to secure storage the
                  moment you pick it — large videos are supported.
                </p>

                {/* Upload state card */}
                {file && (
                  <UploadStateCard
                    fileName={fileName}
                    fileSize={file.size}
                    phase={phase}
                    phaseLabel={phaseLabel}
                    progress={progress}
                    overallPercent={overallPercent}
                    isUploading={isUploading}
                    isUploaded={isUploaded}
                    hasError={hasUploadError}
                    uploadError={uploadError}
                    onCancel={handleCancelUpload}
                    onRetry={handleRetryUpload}
                    onRemove={handleClearFile}
                  />
                )}

                {submitError && (
                  <p
                    role="alert"
                    className="mt-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
                  >
                    {submitError}
                  </p>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Mobile action bar */}
        <div className="md:hidden flex justify-end items-center gap-3 mt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            disabled={submitting}
            className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="apply-form"
            disabled={submitDisabled}
            className="inline-flex min-w-[150px] items-center justify-center gap-2 rounded-lg btn-gradient px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-70"
          >
            {(submitting || isUploading) && (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
            )}
            {submitButtonText}
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Upload state card (idle-with-file / uploading / uploaded / error)          */
/* -------------------------------------------------------------------------- */

function UploadStateCard({
  fileName,
  fileSize,
  phase,
  phaseLabel,
  progress,
  overallPercent,
  isUploading,
  isUploaded,
  hasError,
  uploadError,
  onCancel,
  onRetry,
  onRemove,
}) {
  const tone = hasError
    ? "border-red-200 bg-red-50/40"
    : isUploaded
    ? "border-emerald-200 bg-emerald-50/40"
    : "border-[#0c7bb3]/20 bg-gradient-to-br from-[#0c7bb3]/5 to-white";

  const iconWrap = hasError
    ? "bg-red-100 text-red-600"
    : isUploaded
    ? "bg-emerald-100 text-emerald-700"
    : "bg-[#0c7bb3]/10 text-[#0c7bb3]";

  return (
    <div
      className={`mt-2 rounded-xl border p-4 ${tone}`}
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${iconWrap}`}
        >
          {hasError ? (
            <AlertTriangle className="h-5 w-5" aria-hidden />
          ) : isUploaded ? (
            <CheckCircle2 className="h-5 w-5" aria-hidden />
          ) : isUploading ? (
            <CloudUpload className="h-5 w-5" aria-hidden />
          ) : (
            <FileVideo className="h-5 w-5" aria-hidden />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p className="truncate text-sm font-medium text-gray-800">
              {fileName || "Selected file"}
            </p>
            {isUploading ? (
              <span className="flex-shrink-0 text-sm font-semibold text-[#0c7bb3] tabular-nums">
                {overallPercent}%
              </span>
            ) : (
              <button
                type="button"
                onClick={onRemove}
                aria-label="Remove file"
                className="flex-shrink-0 rounded-md p-1 text-gray-400 transition-colors hover:bg-white/70 hover:text-gray-700"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>

          <p
            className={`mt-0.5 text-xs ${
              hasError
                ? "text-red-600"
                : isUploaded
                ? "text-emerald-700"
                : "text-gray-500"
            }`}
          >
            {fileSize ? `${formatBytes(fileSize)} · ` : ""}
            {phaseLabel || (isUploaded ? "Upload complete" : "")}
          </p>

          {/* Progress bar — only during active upload */}
          {isUploading && (
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#0c7bb3] to-[#22c1c3] transition-[width] duration-200 ease-out"
                style={{ width: `${overallPercent}%` }}
                role="progressbar"
                aria-valuenow={overallPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          )}

          {/* Live stats — only meaningful during the Cloudinary upload step */}
          {phase === UPLOAD_PHASES.UPLOAD && progress && (
            <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-600 sm:grid-cols-4">
              <Stat
                label="Uploaded"
                value={`${formatBytes(progress.loaded)} / ${formatBytes(
                  progress.total ?? fileSize ?? 0
                )}`}
              />
              <Stat label="Speed" value={formatSpeed(progress.speedBps)} />
              <Stat
                label="Time left"
                value={formatDuration(progress.etaSeconds)}
              />
              <Stat
                label="Elapsed"
                value={formatDuration(progress.elapsedSeconds)}
              />
            </dl>
          )}

          {/* Inline actions */}
          {isUploading && (
            <button
              type="button"
              onClick={onCancel}
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-gray-500 transition-colors hover:text-red-600"
            >
              <X className="h-3.5 w-3.5" aria-hidden />
              Cancel upload
            </button>
          )}

          {hasError && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1 rounded-md border border-red-200 bg-white px-2.5 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                Retry upload
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50"
              >
                <X className="h-3.5 w-3.5" aria-hidden />
                Remove
              </button>
              {uploadError && (
                <p className="basis-full text-xs text-red-600">{uploadError}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wide text-gray-400">
        {label}
      </dt>
      <dd className="font-medium text-gray-700 tabular-nums">{value}</dd>
    </div>
  );
}
