export const SUBMISSION_STATUS = {
  pending_review: {
    label: "Pending Review",
    className: "bg-amber-50 text-amber-700",
  },
  revision_requested: {
    label: "Revision Requested",
    className: "bg-amber-50 text-amber-700",
  },
  approved: { label: "Approved", className: "bg-green-50 text-green-700" },
  rejected: {
    label: "Rejected",
    className: "bg-red-50 text-red-600",
  },
};

/** Tap cycle: normal → approved → revision → rejected → normal */
export const ASSET_DECISIONS = ["normal", "accepted", "revision", "rejected"];

export function mapReviewStatusToDecision(reviewStatus) {
  switch (reviewStatus) {
    case "approved":
      return "accepted";
    case "revision_requested":
      return "revision";
    case "rejected":
      return "rejected";
    default:
      return "normal";
  }
}

export function cycleAssetDecision(current, { approveOnly = false } = {}) {
  const normalized = current || "normal";
  if (approveOnly) {
    return normalized === "accepted" ? "normal" : "accepted";
  }
  const idx = ASSET_DECISIONS.indexOf(normalized);
  if (idx === -1) return "accepted";
  return ASSET_DECISIONS[(idx + 1) % ASSET_DECISIONS.length];
}

export function getAssetDecisionStyle(decision) {
  switch (decision) {
    case "accepted":
      return {
        border: "border-green-400",
        icon: "text-green-600",
        bg: "bg-green-50",
      };
    case "revision":
      return {
        border: "border-amber-400",
        icon: "text-amber-600",
        bg: "bg-amber-50",
      };
    case "rejected":
      return {
        border: "border-red-400",
        icon: "text-red-600",
        bg: "bg-red-50",
      };
    default:
      return {
        border: "border-gray-200",
        icon: "text-gray-400",
        bg: "bg-white",
      };
  }
}

export function summarizeAssetDecisions(assets = []) {
  const normal = assets.filter((a) => !a.decision || a.decision === "normal");
  const rejected = assets.filter((a) => a.decision === "rejected");
  const revision = assets.filter((a) => a.decision === "revision");
  const accepted = assets.filter((a) => a.decision === "accepted");
  const allAccepted =
    assets.length > 0 && assets.every((a) => a.decision === "accepted");
  const hasUnresolved = normal.length > 0;
  const hasFlags = rejected.length > 0 || revision.length > 0;

  return {
    normal,
    rejected,
    revision,
    accepted,
    allAccepted,
    hasUnresolved,
    hasFlags,
  };
}

export function getDecisionSummaryText({
  rejected,
  revision,
  allAccepted,
  hasUnresolved,
  total,
}) {
  if (hasUnresolved) {
    return "Review every asset before submitting your decision";
  }
  if (allAccepted) {
    return `All ${total} assets accepted — ready to approve`;
  }
  const parts = [];
  if (rejected.length) {
    parts.push(
      `${rejected.length} asset${rejected.length > 1 ? "s" : ""} rejected`
    );
  }
  if (revision.length) {
    parts.push(
      `${revision.length} flagged for revision`
    );
  }
  if (!parts.length) return null;
  return `${parts.join(", ")} — add feedback below`;
}

export function getReviewActionLabel(action) {
  switch (action) {
    case "approve":
      return "Approve Submission";
    case "request-revision":
      return "Request Revision";
    case "reject":
      return "Reject Submission";
    default:
      return "Submit Review";
  }
}

export function canSubmitReview({ summary, revisionFeedback, rejectionFeedback, action }) {
  if (!action) return false;
  if (summary.hasUnresolved) return false;

  if (action === "approve") {
    return summary.allAccepted;
  }

  if (action === "request-revision") {
    return (
      summary.revision.length > 0 &&
      Boolean(revisionFeedback?.trim())
    );
  }

  if (action === "reject") {
    if (summary.revision.length > 0 && summary.rejected.length > 0) {
      return (
        Boolean(revisionFeedback?.trim()) &&
        Boolean(rejectionFeedback?.trim())
      );
    }
    if (summary.rejected.length > 0) {
      return Boolean(rejectionFeedback?.trim());
    }
    return Boolean(revisionFeedback?.trim());
  }

  return false;
}
