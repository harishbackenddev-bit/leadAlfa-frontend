import { getCreatorDisplayName, parseSubmissionsListResponse } from "./brandSubmissionMapper";

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

/** Submissions that belong on the Feedback & Revisions tab. */
export function isFeedbackRevisionItem(item) {
  const latest = item?.latestRevision || {};
  const status = String(latest.status || "").toLowerCase();
  const revisionNumber = Number(latest.revisionNumber) || 1;

  if (status === "revision_requested") return true;
  if (status === "pending_review" && revisionNumber > 1) return true;
  return false;
}

export function filterFeedbackRevisions(submissions = []) {
  return submissions.filter(isFeedbackRevisionItem);
}

export function getFeedbackRevisionCount(submissions = []) {
  return filterFeedbackRevisions(submissions).length;
}

export function mapSubmissionToFeedbackRevision(item) {
  const latest = item?.latestRevision || {};
  const job = item?.job || {};
  const creator = job.creator || {};
  const creatorName = getCreatorDisplayName(creator);
  const revisionNumber = Number(latest.revisionNumber) || 1;
  const statusRaw = String(latest.status || "").toLowerCase();

  const uiStatus =
    statusRaw === "revision_requested" ? "in_progress" : "pending";

  return {
    id: latest.publicId || item.submissionPublicId,
    submissionPublicId: item.submissionPublicId,
    revisionPublicId: latest.publicId,
    jobPublicId: job.publicId,
    creatorName,
    status: uiStatus,
    deliverable: `Revision ${revisionNumber} · ${item.submissionPublicId || "Submission"}`,
    requestedDate: formatDisplayDate(latest.reviewedAt || latest.submittedAt),
    feedback: latest.revisionFeedback || "No feedback provided.",
    dueDate: formatDisplayDate(job.deadlineAt || latest.reviewDeadline),
    canApprove: statusRaw === "pending_review",
    canSendReminder: statusRaw === "revision_requested",
  };
}

export function mapSubmissionsResponseToFeedbackRevisions(response) {
  return parseSubmissionsListResponse(response)
    .filter(isFeedbackRevisionItem)
    .map(mapSubmissionToFeedbackRevision);
}
