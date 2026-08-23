import React, { useCallback, useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import FeedbackRevisionCard from "./feedback/FeedbackRevisionCard";
import {
  approveSubmissionMutation,
  getCampaignSubmissionsQueryOptions,
  refetchBrandSubmissionViews,
} from "../../../../../services/tanstack/queryService";
import { useNotification } from "../../../../../context/NotificationContext";
import { mapSubmissionsResponseToFeedbackRevisions } from "../../utils/feedbackUtils";

export default function FeedbackRevisionsTab({ campaignPublicId }) {
  const { showNotification } = useNotification();
  const hasCampaignPublicId = Boolean(campaignPublicId);

  const {
    data: listResponse,
    isLoading,
    isError,
  } = useQuery({
    ...getCampaignSubmissionsQueryOptions(campaignPublicId, { limit: 50 }),
    enabled: hasCampaignPublicId,
  });

  const revisions = useMemo(
    () => mapSubmissionsResponseToFeedbackRevisions(listResponse),
    [listResponse]
  );

  const { mutate: approveSubmission, isPending: isApproving } = useMutation({
    ...approveSubmissionMutation(campaignPublicId),
    onSuccess: async (_data, submissionPublicId) => {
      await refetchBrandSubmissionViews(campaignPublicId, submissionPublicId);
      showNotification({
        type: "success",
        message: "Revision approved.",
        description: "The submission has been marked as approved.",
      });
    },
    onError: (error) => {
      showNotification({
        type: "error",
        message: "Could not approve revision.",
        description: error?.message || "Please try again.",
      });
    },
  });

  const handleApprove = useCallback(
    (revision) => {
      if (!revision?.submissionPublicId || !revision.canApprove) return;
      approveSubmission(revision.submissionPublicId);
    },
    [approveSubmission]
  );

  const handleSendReminder = useCallback(
    (revision) => {
      if (!revision?.canSendReminder) return;
      showNotification({
        type: "info",
        message: "Reminder sent.",
        description: `A reminder was noted for ${revision.creatorName || "the creator"}.`,
      });
    },
    [showNotification]
  );

  if (!hasCampaignPublicId) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
        Feedback is unavailable until the campaign loads.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-40 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-40 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-sm text-red-500">
        Failed to load feedback. Please try again.
      </div>
    );
  }

  if (revisions.length === 0) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
        No feedback present.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {revisions.map((revision) => (
        <FeedbackRevisionCard
          key={revision.id}
          revision={revision}
          onSendReminder={handleSendReminder}
          onApprove={handleApprove}
          isApproving={isApproving}
        />
      ))}
    </div>
  );
}
