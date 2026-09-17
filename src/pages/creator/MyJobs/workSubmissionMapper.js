import { formatBytes } from "../../../services/api/mediaUploadService";

const MAX_REVISIONS = 3;

const REVISION_STATUS_TO_JOB = {
  pending_review: "in_review",
  revision_requested: "in_revision",
  /** Reject is a major revision — creator must resubmit (same as revision_requested). */
  rejected: "in_revision",
  approved: "completed",
};

function formatDisplayDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/**
 * Normalize GET /creator/jobs/:id/submission payloads.
 * Supports `{ submission }` wrapper and a bare submission object.
 */
export function parseWorkSubmissionResponse(response) {
  if (!response) return { submission: null, message: null };

  if (response.submission !== undefined) {
    return {
      submission: response.submission || null,
      message: response.message || null,
    };
  }

  // Bare submission object (has revisions and SUB- publicId).
  if (
    Array.isArray(response.revisions) ||
    String(response.publicId || "").startsWith("SUB-")
  ) {
    return { submission: response, message: null };
  }

  return { submission: null, message: response.message || null };
}

export function getLatestRevision(submission) {
  const revisions = submission?.revisions;
  if (!Array.isArray(revisions) || !revisions.length) return null;
  return revisions.reduce((latest, rev) => {
    if (!latest) return rev;
    return (rev.revisionNumber ?? 0) > (latest.revisionNumber ?? 0)
      ? rev
      : latest;
  }, null);
}

export function mapRevisionStatusToJobStatus(revisionStatus) {
  if (!revisionStatus) return null;
  return REVISION_STATUS_TO_JOB[revisionStatus] || null;
}

/** Latest revision needs creator action (resubmit). */
export function revisionNeedsResubmit(revision) {
  const status = String(revision?.status || "").toLowerCase();
  return status === "revision_requested" || status === "rejected";
}

export function mapAssetToFile(asset) {
  const media = asset?.mediaDetails || {};
  const type =
    asset?.usageType === "image" || media?.type === "image" ? "image" : "video";
  return {
    id: asset?.publicId || media?.id,
    name: asset?.assetName || media?.name || "File",
    size: media?.bytes ? formatBytes(media.bytes) : null,
    type,
    thumbnail: media?.url || null,
    url: media?.url || null,
    usageType: asset?.usageType,
    reviewStatus: asset?.reviewStatus || null,
    assetFeedback: asset?.assetFeedback || null,
  };
}

/**
 * Brand stores revision notes + rejection notes joined with `\n\n`
 * (see brandSubmissionMapper.buildReviewPayload).
 * First segment = revision feedback, second = rejection feedback.
 */
export function parseBrandFeedback(raw) {
  if (!raw || !String(raw).trim()) {
    return { revisionNotes: "", rejectionNotes: "", message: "" };
  }
  const parts = String(raw)
    .split(/\n\n+/)
    .map((part) => part.trim())
    .filter(Boolean);

  const revisionNotes = parts[0] || "";
  const rejectionNotes = parts.slice(1).join("\n\n") || "";
  const message = parts.join("\n\n");

  return { revisionNotes, rejectionNotes, message };
}

function getRevisionFeedbackParts(rev) {
  if (!rev) return null;
  const topLevel =
    rev.revisionFeedback || rev.feedback || rev.brandFeedback || null;
  if (topLevel && String(topLevel).trim()) {
    return parseBrandFeedback(topLevel);
  }

  const assetNotes = (rev.assets || [])
    .map((asset) => asset?.assetFeedback)
    .filter((note) => note && String(note).trim())
    .map((note) => String(note).trim());

  if (!assetNotes.length) return null;
  const message = assetNotes.join(" ");
  return { revisionNotes: message, rejectionNotes: "", message };
}

function groupFilesByReviewStatus(files = []) {
  const approved = [];
  const revision = [];
  const rejected = [];
  const pending = [];

  files.forEach((file) => {
    const status = String(file?.reviewStatus || "").toLowerCase();
    if (status === "approved") approved.push(file);
    else if (status === "revision_requested") revision.push(file);
    else if (status === "rejected") rejected.push(file);
    else pending.push(file);
  });

  return { approved, revision, rejected, pending };
}

const REVISION_STATUS_META = {
  pending_review: {
    label: "Under Review",
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
  revision_requested: {
    label: "Revision Requested",
    className: "bg-amber-50 text-amber-800 border-amber-200",
  },
  rejected: {
    label: "Changes Required",
    className: "bg-red-50 text-red-700 border-red-200",
  },
  approved: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
};

function mapRevisionAttempt(rev, index, total) {
  const files = (rev?.assets || [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map(mapAssetToFile);

  const statusKey = String(rev?.status || "").toLowerCase();
  const statusMeta =
    REVISION_STATUS_META[statusKey] || REVISION_STATUS_META.pending_review;
  const feedbackParts = getRevisionFeedbackParts(rev);
  const revisionNumber = rev?.revisionNumber ?? index + 1;
  const isLatest = index === total - 1;
  const isInitial = revisionNumber === 1;

  return {
    id: rev?.publicId || `rev-${revisionNumber}`,
    revisionNumber,
    title: isInitial ? "Initial submission" : `Revision ${revisionNumber - 1}`,
    subtitle: isLatest ? "Latest" : null,
    submittedDate: formatDisplayDate(rev?.submittedAt),
    reviewedDate: formatDisplayDate(rev?.reviewedAt),
    status: statusKey,
    statusLabel: statusMeta.label,
    statusClassName: statusMeta.className,
    noteToBrand: rev?.notes || "",
    captionOrHook: rev?.captionOrHook || "",
    files,
    brandFeedback: feedbackParts?.message || "",
    revisionNotes: feedbackParts?.revisionNotes || "",
    rejectionNotes: feedbackParts?.rejectionNotes || "",
    isLatest,
  };
}

/**
 * Map GET /submission into full submission history for the creator job detail page.
 * Includes every revision attempt (files, notes, brand feedback, asset statuses).
 */
export function mapSubmissionToYourSubmissionUI(submission) {
  if (!submission) return null;

  const revisions = Array.isArray(submission.revisions)
    ? [...submission.revisions].sort(
        (a, b) => (a.revisionNumber ?? 0) - (b.revisionNumber ?? 0)
      )
    : [];

  if (!revisions.length) return null;

  const attempts = revisions.map((rev, index) =>
    mapRevisionAttempt(rev, index, revisions.length)
  );

  const hasContent = attempts.some(
    (attempt) =>
      attempt.files.length > 0 ||
      attempt.noteToBrand ||
      attempt.captionOrHook ||
      attempt.brandFeedback
  );
  if (!hasContent) return null;

  const latest = attempts[attempts.length - 1];
  const totalFiles = attempts.reduce(
    (sum, attempt) => sum + attempt.files.length,
    0
  );

  return {
    submittedDate: latest.submittedDate,
    totalAttempts: attempts.length,
    totalFiles,
    attempts,
    // Back-compat for older callers that expect a flat latest submission.
    noteToBrand: latest.noteToBrand,
    captionOrHook: latest.captionOrHook,
    files: latest.files,
  };
}

/**
 * Map GET /submission response into revision UI payload for JobDetailView.
 * Only call when the creator must resubmit (revision_requested / rejected).
 */
export function mapSubmissionToRevisionUI(submission, jobMeta = {}) {
  if (!submission) return null;

  const latest = getLatestRevision(submission);
  if (!latest) return null;

  const revisions = Array.isArray(submission.revisions)
    ? [...submission.revisions].sort(
        (a, b) => (a.revisionNumber ?? 0) - (b.revisionNumber ?? 0)
      )
    : [];

  const revisionFeedbacks = revisions
    .map((rev, idx) => {
      const parts = getRevisionFeedbackParts(rev);
      if (!parts?.message) return null;
      return {
        id: rev.publicId || `rev-${idx}`,
        revisionLabel: `R${rev.revisionNumber ?? idx + 1}`,
        brandName: jobMeta.brandName || jobMeta.brand?.name || "Brand",
        date: formatDisplayDate(rev.reviewedAt || rev.submittedAt),
        message: parts.message,
        revisionNotes: parts.revisionNotes,
        rejectionNotes: parts.rejectionNotes,
        status: rev.status,
      };
    })
    .filter(Boolean);

  // Show the revision the brand reviewed (needs resubmit), not an empty draft.
  const displayRevision = revisionNeedsResubmit(latest)
    ? latest
    : revisions
        .slice()
        .reverse()
        .find(
          (rev) =>
            revisionNeedsResubmit(rev) || getRevisionFeedbackParts(rev)?.message
        ) || latest;

  const files = (displayRevision?.assets || [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map(mapAssetToFile);
  const fileGroups = groupFilesByReviewStatus(files);
  const hasReviewGroups =
    fileGroups.approved.length > 0 ||
    fileGroups.revision.length > 0 ||
    fileGroups.rejected.length > 0;
  const totalRequests = submission.totalRevisionRequests ?? 0;
  // Next attempt number (initial submit = 1, first resubmit = 2, …). Cap at max.
  const currentRevision = Math.min(totalRequests + 1, MAX_REVISIONS);

  return {
    compensation: jobMeta.payment || "—",
    releaseNote: "Released upon brand approval",
    currentRevision,
    maxRevisions: MAX_REVISIONS,
    totalRevisionRequests: totalRequests,
    timeline: [
      {
        label: "Deadline",
        value: formatDisplayDate(
          latest?.reviewDeadline || jobMeta.endDate || jobMeta.raw?.deadlineAt
        ),
      },
      {
        label: "Submitted",
        value: formatDisplayDate(displayRevision?.submittedAt),
      },
      ...(totalRequests > 0
        ? [
            {
              label: `Revision ${totalRequests}`,
              value: formatDisplayDate(
                displayRevision?.reviewedAt || latest?.reviewedAt
              ),
              highlight: true,
            },
          ]
        : []),
    ],
    feedback: revisionFeedbacks,
    submission: {
      submittedDate: formatDisplayDate(displayRevision?.submittedAt),
      noteToBrand: displayRevision?.notes || "",
      captionOrHook: displayRevision?.captionOrHook || "",
      files,
      fileGroups: hasReviewGroups ? fileGroups : null,
    },
    latestRevision: latest,
    submissionPublicId: submission.publicId,
    needsResubmit: revisionNeedsResubmit(latest),
  };
}

/**
 * Merge submission state into a job card object.
 */
export function enrichJobWithSubmission(job, submissionResponse) {
  if (!job) return job;
  const submission =
    parseWorkSubmissionResponse(submissionResponse).submission;
  if (!submission) return job;

  const latest = getLatestRevision(submission);
  const mappedStatus = mapRevisionStatusToJobStatus(latest?.status);
  if (!mappedStatus) return job;

  const needsResubmit = revisionNeedsResubmit(latest);

  const enriched = {
    ...job,
    status: mappedStatus,
    workStatus: needsResubmit
      ? "resubmit"
      : latest?.status === "pending_review" || latest?.status === "approved"
        ? null
        : job.workStatus,
    filterCategory:
      mappedStatus === "completed"
        ? "Completed Jobs"
        : mappedStatus === "pending"
          ? "Applied Jobs"
          : "On-going Jobs",
    jobPublicId: resolveJobPublicId(job) || job.jobPublicId,
    submission,
    revision: needsResubmit
      ? mapSubmissionToRevisionUI(submission, job)
      : undefined,
  };

  return enriched;
}

export function pickCreatorJobPublicId(record) {
  const candidates = [
    record?.jobPublicId,
    record?.publicId,
    record?.raw?.jobPublicId,
    record?.raw?.publicId,
  ];
  for (const value of candidates) {
    if (isCreatorJobPublicId(value)) return String(value).trim();
  }
  return null;
}

/** Creator job public id for submission APIs — always JOB-… per docs. */
export function isCreatorJobPublicId(value) {
  return String(value || "").trim().startsWith("JOB-");
}

/** Campaign public id used in my-jobs URL routes — CMP-… */
export function isCampaignPublicId(value) {
  return String(value || "").trim().startsWith("CMP-");
}

/**
 * CreatorJob.publicId for work-submission APIs (POST/GET /creator/jobs/:jobPublicId/…).
 * Must be JOB-… — never CMP-… (campaign) or numeric ids.
 */
export function resolveJobPublicId(job) {
  const candidates = [
    job?.jobPublicId,
    job?.publicId,
    job?.raw?.jobPublicId,
    job?.raw?.publicId,
    job?.raw?.job?.publicId,
    job?.raw?.creatorJob?.publicId,
  ];

  for (const value of candidates) {
    if (isCreatorJobPublicId(value)) return String(value).trim();
  }

  return null;
}
