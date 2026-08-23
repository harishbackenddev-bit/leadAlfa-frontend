import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  CheckCircle2,
  CloudUpload,
  FileArchive,
  FileText,
  Image as ImageIcon,
  Loader2,
  Upload,
  Video,
  X,
} from "lucide-react";
import { Button } from "../../../../components/ui/button";
import SubmitWorkNoteModal from "../components/SubmitWorkNoteModal";
import SubmitWorkSuccessModal from "../components/SubmitWorkSuccessModal";
import {
  buildJobCardForRoute,
  findCreatorJobPublicIdForRoute,
} from "../myJobsMapper";
import {
  resolveJobPublicId,
  isCreatorJobPublicId,
  getLatestRevision,
  pickCreatorJobPublicId,
  revisionNeedsResubmit,
} from "../workSubmissionMapper";
import { submitWork, resubmitWork } from "../../../../services/api/workSubmissionService";
import { getCreatorJobs } from "../../../../services/api/apiservices";
import {
  UPLOAD_PHASES,
  uploadMediaWithProgress,
  formatDuration,
  formatSpeed,
} from "../../../../services/api/mediaUploadService";
import {
  getMyJobsQueryOptions,
  getCreatorJobsQueryOptions,
  getActiveCampaignsQueryOptions,
  getWorkSubmissionQueryOptions,
  invalidateMyJobs,
  invalidateWorkSubmission,
} from "../../../../services/tanstack/queryService";

const MAX_PER_TYPE = 5;
const WORK_UPLOAD_TYPE = "work_submission";

/* ---------- Campaign summary banner ---------- */

function SummaryItem({ label, value, icon: Icon }) {
  return (
    <div className="min-w-0">
      <p className="flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide text-white/70">
        {Icon ? <Icon className="h-3.5 w-3.5" aria-hidden /> : null}
        {label}
      </p>
      <p className="mt-1 truncate font-semibold text-white">{value}</p>
    </div>
  );
}

function CampaignSummary({ job }) {
  return (
    <div className="mt-5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#0353A4] to-[#024080] px-5 py-5 text-white shadow-sm sm:px-6">
      <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/60">
        Campaign Summary
      </p>
      <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3 lg:grid-cols-5">
        <SummaryItem
          label="Campaign Name"
          value={job?.campaignName || "—"}
        />
        <SummaryItem label="Brand Name" value={job?.brandName || "—"} />
        <SummaryItem
          label="Deliverable Required"
          value={job?.deliverable || "—"}
        />
        <SummaryItem
          label="Draft Deadline"
          value={job?.endDate || "—"}
          icon={Calendar}
        />
        <SummaryItem
          label="Format Required"
          value={job?.formatRequired || "MP4 or MOV (500MB max)"}
        />
      </div>
    </div>
  );
}

function FormSection({ icon, label, optional, hint, children }) {
  const SectionIcon = icon;
  return (
    <div className="px-5 py-6 sm:px-6">
      <div className="mb-1 flex flex-wrap items-center gap-1.5">
        <SectionIcon className="h-5 w-5 text-[#0c7bb3]" aria-hidden />
        <p className="text-[15px] font-semibold text-gray-900">{label}</p>
        {optional ? (
          <span className="text-sm font-medium text-gray-400">(Optional)</span>
        ) : null}
      </div>
      {hint ? <p className="mb-4 text-xs text-gray-500">{hint}</p> : null}
      {children}
    </div>
  );
}

function UploadProgressBar({ percent }) {
  return (
    <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-gray-200">
      <div
        className="h-full rounded-full bg-[#0c7bb3] transition-all duration-300"
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

/**
 * Single-file upload slot using the shared mediaUploadService pipeline
 * (same flow as ApplyForm on /creator/campaigns/:id/apply).
 */
function MediaUploadSlot({
  accept,
  resourceType,
  usageType,
  helper,
  required,
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
    setPhase(UPLOAD_PHASES.SIGNATURE);

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
        url: result.secure_url,
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

  const overallPercent = (() => {
    if (phase === UPLOAD_PHASES.SIGNATURE) return 5;
    if (phase === UPLOAD_PHASES.UPLOAD) {
      return 10 + Math.round((progress?.percent ?? 0) * 0.85);
    }
    if (phase === UPLOAD_PHASES.REGISTER) return 97;
    return 0;
  })();

  return (
    <div>
      <button
        type="button"
        disabled={disabled || uploading || atLimit}
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-[#F7F9FC] px-4 py-8 text-center transition-colors hover:border-blue-300 hover:bg-blue-50/40 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-[#0c7bb3]">
          <CloudUpload className="h-5 w-5" aria-hidden />
        </span>
        <span className="text-sm font-semibold text-gray-700">
          {uploading ? "Uploading…" : "Click to upload or drag and drop"}
        </span>
        {helper ? (
          <span className="mt-1 text-xs text-gray-500">{helper}</span>
        ) : null}
        {atLimit ? (
          <span className="mt-1 text-xs text-amber-600">
            Maximum {MAX_PER_TYPE} files reached
          </span>
        ) : null}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => handlePick(e.target.files?.[0])}
        />
      </button>

      {uploading ? (
        <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50/50 px-3 py-2 text-xs text-blue-800">
          <div className="flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            {phase === UPLOAD_PHASES.UPLOAD && progress
              ? `Uploading ${progress.percent}% · ${formatSpeed(progress.speedBps)} · ETA ${formatDuration(progress.etaSeconds)}`
              : "Preparing secure upload…"}
          </div>
          <UploadProgressBar percent={overallPercent} />
        </div>
      ) : null}

      {slotError ? (
        <p className="mt-2 text-sm text-red-600">{slotError}</p>
      ) : null}

      {items.length > 0 ? (
        <ul className="mt-3 space-y-2">
          {items.map((item, idx) => (
            <li
              key={`${item.mediaId}-${idx}`}
              className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm"
            >
              <span className="flex min-w-0 items-center gap-2">
                <CheckCircle2
                  className="h-4 w-4 shrink-0 text-emerald-600"
                  aria-hidden
                />
                <span className="truncate text-gray-800">{item.fileName}</span>
                {required && idx === 0 ? (
                  <span className="text-xs text-gray-400">(required)</span>
                ) : null}
              </span>
              <button
                type="button"
                disabled={disabled || uploading}
                onClick={() => onRemove(idx)}
                className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/* ---------- Page ---------- */

export default function SubmitAssignment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [showNote, setShowNote] = useState(location.state?.showNote !== false);
  const [notes, setNotes] = useState("");
  const [caption, setCaption] = useState("");
  const [finalVideos, setFinalVideos] = useState([]);
  const [rawVideos, setRawVideos] = useState([]);
  const [images, setImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successWasResubmit, setSuccessWasResubmit] = useState(false);
  const submitSucceededRef = useRef(false);

  const { data: jobsResp, isLoading: jobsLoading } = useQuery(
    getMyJobsQueryOptions({ page: 1, limit: 100 })
  );

  const { data: creatorJobsResp, isLoading: creatorJobsLoading } = useQuery(
    getCreatorJobsQueryOptions({ page: 1, limit: 100 })
  );

  const {
    data: activeCampaignsResp,
    isLoading: activeCampaignsLoading,
  } = useQuery(getActiveCampaignsQueryOptions());

  const activeCampaignsList =
    activeCampaignsResp?.campaigns ||
    activeCampaignsResp?.data?.campaigns ||
    [];

  const myJobs = jobsResp?.jobs || [];
  const creatorJobs = creatorJobsResp?.jobs || [];

  const job = useMemo(
    () => buildJobCardForRoute(id, myJobs, activeCampaignsList),
    [id, myJobs, activeCampaignsList]
  );

  const jobPublicId = useMemo(() => {
    if (isCreatorJobPublicId(location.state?.jobPublicId)) {
      return location.state.jobPublicId;
    }
    return (
      resolveJobPublicId(job) ||
      findCreatorJobPublicIdForRoute(id, myJobs, activeCampaignsList) ||
      findCreatorJobPublicIdForRoute(id, creatorJobs, activeCampaignsList)
    );
  }, [
    job,
    id,
    myJobs,
    creatorJobs,
    activeCampaignsList,
    location.state?.jobPublicId,
  ]);

  const { data: submissionResp, isLoading: submissionLoading } = useQuery(
    getWorkSubmissionQueryOptions(jobPublicId)
  );

  const latestRevision = getLatestRevision(submissionResp?.submission);
  const isResubmitMode = revisionNeedsResubmit(latestRevision);
  const hasExistingSubmission = Boolean(submissionResp?.submission);

  const openSuccessModal = () => {
    submitSucceededRef.current = true;
    setSuccessWasResubmit(isResubmitMode);
    setShowSuccessModal(true);
  };

  const handleSuccessClose = () => {
    submitSucceededRef.current = false;
    setShowSuccessModal(false);
    navigate("/creator/my-jobs");
  };

  const renderSuccessModal = () =>
    showSuccessModal || submitSucceededRef.current ? (
      <SubmitWorkSuccessModal
        isResubmit={successWasResubmit}
        onClose={handleSuccessClose}
      />
    ) : null;

  useEffect(() => {
    // After submit, submission refetch would redirect to job detail — block until
    // the user closes the success modal.
    if (submitSucceededRef.current || showSuccessModal) return;
    if (submissionLoading || !hasExistingSubmission || isResubmitMode) return;
    navigate(`/creator/my-jobs/${id}`, { replace: true });
  }, [
    submissionLoading,
    hasExistingSubmission,
    isResubmitMode,
    id,
    navigate,
    showSuccessModal,
  ]);

  const resolveSubmitJobId = async () => {
    if (isCreatorJobPublicId(jobPublicId)) return jobPublicId;

    const fromLists =
      findCreatorJobPublicIdForRoute(id, creatorJobs, activeCampaignsList) ||
      findCreatorJobPublicIdForRoute(id, myJobs, activeCampaignsList) ||
      pickCreatorJobPublicId(creatorJobs[0]);

    if (fromLists) return fromLists;

    try {
      const fresh = await getCreatorJobs({ page: 1, limit: 100 });
      const freshJobs = fresh?.jobs || [];
      return (
        findCreatorJobPublicIdForRoute(id, freshJobs, activeCampaignsList) ||
        pickCreatorJobPublicId(freshJobs[0])
      );
    } catch {
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const assets = [
      ...finalVideos.map((f) => ({
        mediaId: f.mediaId,
        usageType: "final_video",
      })),
      ...rawVideos.map((f) => ({
        mediaId: f.mediaId,
        usageType: "raw_video",
      })),
      ...images.map((f) => ({ mediaId: f.mediaId, usageType: "image" })),
    ];

    const trimmedNotes = notes.trim();
    const trimmedCaption = caption.trim();

    if (!finalVideos.length && !trimmedNotes && !trimmedCaption && !assets.length) {
      setSubmitError(
        "Please upload at least one file or add notes/caption before submitting."
      );
      return;
    }

    if (!finalVideos.length) {
      setSubmitError("Please upload at least one final video.");
      return;
    }

    const submitJobId = await resolveSubmitJobId();
    if (!submitJobId) {
      setSubmitError(
        "Could not find your job ID. Please refresh My Jobs and try again."
      );
      return;
    }

    const payload = { assets };
    if (trimmedNotes) payload.notes = trimmedNotes;
    if (trimmedCaption) payload.captionOrHook = trimmedCaption;

    try {
      setSubmitting(true);
      if (isResubmitMode) {
        await resubmitWork(submitJobId, payload);
      } else {
        await submitWork(submitJobId, payload);
      }
      openSuccessModal();
      await Promise.all([
        invalidateMyJobs(),
        invalidateWorkSubmission(submitJobId),
      ]);
    } catch (err) {
      if (err?.status === 409 && !isResubmitMode) {
        try {
          await resubmitWork(submitJobId, payload);
          openSuccessModal();
          await Promise.all([
            invalidateMyJobs(),
            invalidateWorkSubmission(submitJobId),
          ]);
          return;
        } catch (retryErr) {
          setSubmitError(retryErr?.message || "Failed to submit assignment.");
          return;
        }
      }
      setSubmitError(err?.message || "Failed to submit assignment.");
    } finally {
      setSubmitting(false);
    }
  };

  if (jobsLoading || creatorJobsLoading || activeCampaignsLoading) {
    return (
      <>
        {renderSuccessModal()}
        <div className="flex min-h-screen items-center justify-center bg-[#F4F6F9]">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      </>
    );
  }

  if (
    submissionLoading &&
    jobPublicId &&
    !submitSucceededRef.current &&
    !showSuccessModal
  ) {
    return (
      <>
        {renderSuccessModal()}
        <div className="flex min-h-screen items-center justify-center bg-[#F4F6F9]">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <>
        {renderSuccessModal()}
        <div className="flex min-h-screen items-center justify-center bg-[#F4F6F9]">
          <p className="text-red-600">Job not found.</p>
        </div>
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      {showNote ? (
        <SubmitWorkNoteModal onClose={() => setShowNote(false)} />
      ) : null}

      {renderSuccessModal()}

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/creator/my-jobs")}
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to My Jobs
        </button>

        <h1 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          {isResubmitMode ? "Resubmit Assignment" : "Submit Assignment"}
        </h1>

        <CampaignSummary job={job} />

        <form
          onSubmit={handleSubmit}
          className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >
          <div className="divide-y divide-gray-100">
            <FormSection
              icon={Video}
              label={
                <>
                  Upload Final Video <span className="text-red-500">*</span>
                </>
              }
              hint="Accepted formats: MP4, MOV (Max 500MB) · up to 5 files"
            >
              <MediaUploadSlot
                accept="video/mp4,video/quicktime,.mp4,.mov"
                resourceType="video"
                usageType="final_video"
                required
                helper="MP4 or MOV files up to 500MB"
                items={finalVideos}
                disabled={submitting}
                onAdd={(item) =>
                  setFinalVideos((prev) => [...prev, item].slice(0, MAX_PER_TYPE))
                }
                onRemove={(idx) =>
                  setFinalVideos((prev) => prev.filter((_, i) => i !== idx))
                }
              />
            </FormSection>

            <FormSection
              icon={FileArchive}
              label="Upload Raw Footage"
              optional
              hint="Upload raw video files if required by the brand · up to 5 files"
            >
              <MediaUploadSlot
                accept="video/mp4,video/quicktime,.mp4,.mov"
                resourceType="video"
                usageType="raw_video"
                helper="MP4 or MOV raw footage"
                items={rawVideos}
                disabled={submitting}
                onAdd={(item) =>
                  setRawVideos((prev) => [...prev, item].slice(0, MAX_PER_TYPE))
                }
                onRemove={(idx) =>
                  setRawVideos((prev) => prev.filter((_, i) => i !== idx))
                }
              />
            </FormSection>

            <FormSection
              icon={ImageIcon}
              label="Upload Image Files"
              optional
              hint="Accepted formats: JPG, PNG (Max 10MB per file) · up to 5 files"
            >
              <MediaUploadSlot
                accept="image/jpeg,image/png,.jpg,.jpeg,.png"
                resourceType="image"
                usageType="image"
                helper="JPG or PNG images"
                items={images}
                disabled={submitting}
                onAdd={(item) =>
                  setImages((prev) => [...prev, item].slice(0, MAX_PER_TYPE))
                }
                onRemove={(idx) =>
                  setImages((prev) => prev.filter((_, i) => i !== idx))
                }
              />
            </FormSection>

            <FormSection icon={FileText} label="Add Notes" optional>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value.slice(0, 500))}
                placeholder="Describe the concept of your video or mention any important details for the brand."
                disabled={submitting}
                className="min-h-[120px] w-full resize-none rounded-xl border border-gray-200 bg-white p-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
              <p className="mt-2 text-xs text-gray-400">
                {notes.length}/500 characters
              </p>
            </FormSection>

            <FormSection icon={FileText} label="Caption or Hook Used" optional>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value.slice(0, 200))}
                placeholder="Enter the caption or hook you used in the video"
                disabled={submitting}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
              />
              <p className="mt-2 text-xs text-gray-400">
                {caption.length}/200 characters
              </p>
            </FormSection>
          </div>

          {submitError ? (
            <div className="border-t border-gray-100 px-5 py-4 sm:px-6">
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              >
                {submitError}
              </p>
            </div>
          ) : null}

          <div className="flex flex-col-reverse gap-3 border-t border-gray-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-start sm:px-6">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl px-6"
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting || !finalVideos.length}
              className="rounded-xl btn-gradient px-6"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                  {isResubmitMode ? "Resubmitting…" : "Submitting…"}
                </>
              ) : isResubmitMode ? (
                "Resubmit Assignment"
              ) : (
                "Submit Assignment"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
