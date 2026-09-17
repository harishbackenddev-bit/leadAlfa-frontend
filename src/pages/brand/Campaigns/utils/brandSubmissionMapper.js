import { formatBytes } from "../../../../services/api/mediaUploadService";
import { getLatestRevision } from "../../../creator/MyJobs/workSubmissionMapper";
import {
  mapReviewStatusToDecision,
  summarizeAssetDecisions,
} from "./submissionUtils";

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

export function getCreatorDisplayName(creator = {}) {
  if (creator.publicName) return creator.publicName;
  if (creator.name) return creator.name;
  const full = [creator.firstName, creator.lastName].filter(Boolean).join(" ");
  return full || "Creator";
}

export function getCreatorInitials(creator = {}, fallbackName = "") {
  const name = getCreatorDisplayName(creator) || fallbackName;
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  if (parts.length === 1 && parts[0].length >= 2) {
    return parts[0].slice(0, 2).toUpperCase();
  }
  return "?";
}

function mapMediaType(asset, media = {}) {
  const usage = String(asset?.usageType || "").toLowerCase();
  const mediaType = String(media?.type || "").toLowerCase();
  if (usage.includes("image") || mediaType === "image") return "IMAGE";
  return "VIDEO";
}

export function mapApiAssetToUI(asset, { readOnly = false } = {}) {
  const media = asset?.mediaDetails || {};
  return {
    publicId: asset?.publicId,
    id: asset?.publicId || String(media?.id || ""),
    name: asset?.assetName || media?.name || "File",
    type: mapMediaType(asset, media),
    size: media?.bytes ? formatBytes(media.bytes) : null,
    url: media?.url || null,
    thumbnail: media?.url || null,
    usageType: asset?.usageType,
    decision: readOnly
      ? mapReviewStatusToDecision(asset?.reviewStatus)
      : "normal",
    sortOrder: asset?.sortOrder ?? 0,
  };
}

export function mapApiSubmissionListItem(item) {
  const creator = item?.job?.creator || {};
  const latest = item?.latestRevision || {};
  const creatorName = getCreatorDisplayName(creator);

  return {
    submissionPublicId: item?.submissionPublicId,
    creatorId: creator?.id || null,
    creatorUserId: creator?.userId || null,
    payoutStatus: item?.payoutStatus || latest?.payoutStatus || null,
    
    creatorName,
    initials: getCreatorInitials(creator, creatorName),
    submittedOn: formatDisplayDate(latest.submittedAt),
    status: latest.status || "pending_review",
    hasUpdate: latest.status === "pending_review",
    totalRevisionRequests: item?.totalRevisionRequests ?? 0,
    jobPublicId: item?.job?.publicId,
    revisionPublicId: latest.publicId,
    reviewDeadline: latest.reviewDeadline,
  };
}

export function mapApiSubmissionDetail(response) {
  const submission = response?.submission;
  if (!submission) return null;

  const latest = getLatestRevision(submission);
  const creator = submission?.job?.creator || {};
  const creatorName = getCreatorDisplayName(creator);
  const isReviewable = latest?.status === "pending_review";
  const assets = (latest?.assets || [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((asset) => mapApiAssetToUI(asset, { readOnly: !isReviewable }));

  return {
    submissionPublicId: submission.publicId,
    creatorName,
    initials: getCreatorInitials(creator, creatorName),
    submittedOn: formatDisplayDate(latest?.submittedAt),
    status: latest?.status || "pending_review",
    hasUpdate: latest?.status === "pending_review",
    totalRevisionRequests: submission.totalRevisionRequests ?? 0,
    revisionsRemaining: Math.max(
      0,
      2 - (submission.totalRevisionRequests ?? 0)
    ),
    creatorMessage: latest?.notes || "",
    captionOrHook: latest?.captionOrHook || "",
    jobPublicId: submission?.job?.publicId,
    revisionPublicId: latest?.publicId,
    revisionNumber: latest?.revisionNumber,
    reviewDeadline: latest?.reviewDeadline,
    assets,
    revisions: submission.revisions || [],
    isReviewable,
    isFinalAttempt:
      isReviewable && (submission.totalRevisionRequests ?? 0) >= 2,
  };
}

export function mapDecisionToReviewStatus(decision) {
  switch (decision) {
    case "accepted":
      return "approved";
    case "revision":
      return "revision_requested";
    case "rejected":
      return "rejected";
    default:
      return null;
  }
}

export function buildReviewPayload({
  assets = [],
  revisionFeedback = "",
  rejectionFeedback = "",
}) {
  const assetFeedback = assets
    .filter((asset) => asset.decision && asset.decision !== "normal")
    .map((asset) => {
      const entry = {
        assetPublicId: asset.publicId || asset.id,
        reviewStatus: mapDecisionToReviewStatus(asset.decision),
      };
      if (asset.feedback?.trim()) {
        entry.feedback = asset.feedback.trim();
      }
      return entry;
    })
    .filter((entry) => entry.reviewStatus);

  const parts = [];
  if (revisionFeedback?.trim()) {
    parts.push(revisionFeedback.trim());
  }
  if (rejectionFeedback?.trim()) {
    parts.push(rejectionFeedback.trim());
  }

  return {
    feedback: parts.join("\n\n") || "Please review the flagged assets.",
    assetFeedback: assetFeedback.length ? assetFeedback : undefined,
  };
}

/**
 * Pick the review endpoint from per-asset decisions.
 * Reject wins when any asset is flagged red (advanced revision).
 */
export function determineReviewAction(assets = []) {
  const summary = summarizeAssetDecisions(assets);
  if (summary.allAccepted) return "approve";
  if (summary.rejected.length > 0) return "reject";
  if (summary.revision.length > 0) return "request-revision";
  return null;
}

export function getPendingSubmissionCount(submissions = []) {
  return submissions.filter((row) => row.status === "pending_review").length;
}

export function parseSubmissionsListResponse(response) {
  return response?.submissions || [];
}
