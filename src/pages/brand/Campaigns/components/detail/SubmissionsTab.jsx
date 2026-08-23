import React, { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import {
  approveSubmissionMutation,
  getCampaignSubmissionStatsQueryOptions,
  getCampaignSubmissionsQueryOptions,
  getSubmissionDetailQueryOptions,
  refetchBrandSubmissionViews,
  rejectSubmissionMutation,
  requestSubmissionRevisionMutation,
} from "../../../../../services/tanstack/queryService";
import { useNotification } from "../../../../../context/NotificationContext";
import { InfoBanner } from "./shared/InfoBanner";
import CreatorAvatar from "./shared/CreatorAvatar";
import ReviewSubmissionDrawer from "./submissions/ReviewSubmissionDrawer";
import {
  mapApiSubmissionDetail,
  mapApiSubmissionListItem,
  parseSubmissionsListResponse,
} from "../../utils/brandSubmissionMapper";
import { SUBMISSION_STATUS } from "../../utils/submissionUtils";

function applyOptimisticStatus(detail, status) {
  if (!detail || !status) return detail;
  const isReviewable = status === "pending_review";
  return {
    ...detail,
    status,
    hasUpdate: isReviewable,
    isReviewable,
    isFinalAttempt: false,
    assets: (detail.assets || []).map((asset) => ({
      ...asset,
      decision:
        status === "approved"
          ? "accepted"
          : status === "rejected"
            ? "rejected"
            : status === "revision_requested"
              ? "revision"
              : asset.decision,
    })),
  };
}

const STAT_CARDS = [
  { key: "total", label: "Total", highlight: false },
  { key: "pendingReview", label: "Pending Review", highlight: true },
  { key: "approved", label: "Approved", highlight: false },
  { key: "revisionRequested", label: "Revision Requested", highlight: false },
  { key: "rejected", label: "Rejected", highlight: false },
];

export default function SubmissionsTab({ campaignPublicId }) {
  const { showNotification } = useNotification();
  const [activeSubmissionKey, setActiveSubmissionKey] = useState(null);
  /** Optimistic status while list/detail refetch after a review action. */
  const [optimisticById, setOptimisticById] = useState({});

  const hasCampaignPublicId = Boolean(campaignPublicId);

  const {
    data: listResponse,
    isLoading: isListLoading,
    isError: isListError,
  } = useQuery({
    ...getCampaignSubmissionsQueryOptions(campaignPublicId),
    enabled: hasCampaignPublicId,
  });

  const { data: statsResponse } = useQuery({
    ...getCampaignSubmissionStatsQueryOptions(campaignPublicId),
    enabled: hasCampaignPublicId,
  });

  const submissions = useMemo(() => {
    return parseSubmissionsListResponse(listResponse).map((item) => {
      const row = mapApiSubmissionListItem(item);
      const optimisticStatus = optimisticById[row.submissionPublicId];
      if (!optimisticStatus) return row;
      return {
        ...row,
        status: optimisticStatus,
        hasUpdate: optimisticStatus === "pending_review",
      };
    });
  }, [listResponse, optimisticById]);

  const stats = useMemo(() => {
    const base = statsResponse?.stats || {};
    // Prefer live list counts when we have optimistic/local status overrides.
    if (!submissions.length && !statsResponse?.stats) return base;

    const fromList = {
      total: submissions.length || base.total || 0,
      pendingReview: submissions.filter((s) => s.status === "pending_review")
        .length,
      approved: submissions.filter((s) => s.status === "approved").length,
      revisionRequested: submissions.filter(
        (s) => s.status === "revision_requested"
      ).length,
      rejected: submissions.filter((s) => s.status === "rejected").length,
    };

    // If API stats exist and no optimistic overrides, use API stats.
    if (statsResponse?.stats && !Object.keys(optimisticById).length) {
      return statsResponse.stats;
    }
    return { ...base, ...fromList };
  }, [statsResponse, submissions, optimisticById]);

  const pendingCount = stats.pendingReview ?? 0;

  const activeSubmissionPublicId = activeSubmissionKey;

  const {
    data: detailResponse,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
  } = useQuery({
    ...getSubmissionDetailQueryOptions(activeSubmissionPublicId),
    enabled: Boolean(activeSubmissionPublicId),
  });

  const drawerSubmission = useMemo(() => {
    if (!activeSubmissionKey) return null;

    let detail = null;
    if (detailResponse) {
      detail = mapApiSubmissionDetail(detailResponse);
    } else if (!(isDetailLoading || isDetailFetching)) {
      const row = submissions.find(
        (item) => item.submissionPublicId === activeSubmissionKey
      );
      detail = row ? { ...row, assets: [], isReviewable: false } : null;
    }

    if (!detail) return null;

    const optimisticStatus = optimisticById[activeSubmissionKey];
    return applyOptimisticStatus(detail, optimisticStatus);
  }, [
    activeSubmissionKey,
    detailResponse,
    submissions,
    isDetailLoading,
    isDetailFetching,
    optimisticById,
  ]);

  const refreshViews = useCallback(
    async (submissionPublicId) => {
      await refetchBrandSubmissionViews(campaignPublicId, submissionPublicId);
    },
    [campaignPublicId]
  );

  const { mutate: approve, isPending: isApproving } = useMutation({
    ...approveSubmissionMutation(campaignPublicId),
    onSuccess: async (_data, submissionPublicId) => {
      setOptimisticById((prev) => ({
        ...prev,
        [submissionPublicId]: "approved",
      }));
      showNotification({
        type: "success",
        message: "Submission approved",
        description: "Download is now available for this submission.",
      });
      // Keep drawer open so brand can download approved assets.
      await refreshViews(submissionPublicId);
    },
    onError: (error) => {
      showNotification({
        type: "error",
        message: "Approval failed",
        description: error?.message || "Please try again.",
      });
    },
  });

  const { mutate: requestRevision, isPending: isRequestingRevision } =
    useMutation({
      ...requestSubmissionRevisionMutation(campaignPublicId),
      onSuccess: async (data, { submissionPublicId }) => {
        setOptimisticById((prev) => ({
          ...prev,
          [submissionPublicId]: "revision_requested",
        }));
        showNotification({
          type: "success",
          message: "Revision requested",
          description: data?.revisionsRemaining != null
            ? `${data.revisionsRemaining} revision attempt(s) remaining.`
            : "The creator has been notified.",
        });
        await refreshViews(submissionPublicId);
        setActiveSubmissionKey(null);
      },
      onError: (error) => {
        showNotification({
          type: "error",
          message: "Request failed",
          description: error?.message || "Please try again.",
        });
      },
    });

  const { mutate: reject, isPending: isRejecting } = useMutation({
    ...rejectSubmissionMutation(campaignPublicId),
    onSuccess: async (_data, { submissionPublicId }) => {
      setOptimisticById((prev) => ({
        ...prev,
        [submissionPublicId]: "rejected",
      }));
      showNotification({
        type: "success",
        message: "Submission rejected",
        description: "The creator has been notified to resubmit.",
      });
      await refreshViews(submissionPublicId);
      setActiveSubmissionKey(null);
    },
    onError: (error) => {
      showNotification({
        type: "error",
        message: "Review failed",
        description: error?.message || "Please try again.",
      });
    },
  });

  const isSubmitting = isApproving || isRequestingRevision || isRejecting;

  const handleOpenReview = useCallback((row) => {
    setActiveSubmissionKey(row.submissionPublicId);
  }, []);

  const handleCloseReview = useCallback(() => {
    setActiveSubmissionKey(null);
  }, []);

  const handleSubmitReview = useCallback(
    ({ submission, action, payload }) => {
      const submissionPublicId = submission?.submissionPublicId;
      if (!submissionPublicId) return;

      if (action === "approve") {
        approve(submissionPublicId);
        return;
      }
      if (action === "request-revision") {
        requestRevision({ submissionPublicId, payload });
        return;
      }
      if (action === "reject") {
        reject({ submissionPublicId, payload });
      }
    },
    [approve, reject, requestRevision]
  );

  const alertMessage =
    pendingCount > 0
      ? `${pendingCount} submission${pendingCount > 1 ? "s" : ""} pending your review`
      : null;

  return (
    <div className="space-y-4">
      {hasCampaignPublicId ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {STAT_CARDS.map(({ key, label, highlight }) => {
            const value = stats[key] ?? 0;
            return (
              <div
                key={key}
                className={`rounded-xl border bg-white px-4 py-4 ${
                  highlight && value > 0
                    ? "border-amber-300 ring-1 ring-amber-200"
                    : "border-gray-200"
                }`}
              >
                <p
                  className={`text-2xl font-semibold ${
                    highlight && value > 0 ? "text-amber-700" : "text-gray-900"
                  }`}
                >
                  {value}
                </p>
                <p className="mt-0.5 text-sm text-gray-500">{label}</p>
              </div>
            );
          })}
        </div>
      ) : null}

      {alertMessage ? (
        <InfoBanner message={alertMessage} tone="amber" />
      ) : null}

      {!hasCampaignPublicId ? (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
          Campaign not found.
        </div>
      ) : isListLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
          Loading submissions...
        </div>
      ) : isListError ? (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
          Failed to load submissions. Please try again.
        </div>
      ) : submissions.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
          No submissions yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Creator
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Submitted ID
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Submitted On
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-medium uppercase tracking-wide text-gray-400">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {submissions.map((row) => {
                  const status =
                    SUBMISSION_STATUS[row.status] ||
                    SUBMISSION_STATUS.pending_review;
                  return (
                    <tr
                      key={row.submissionPublicId}
                      className="hover:bg-gray-50/50"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <CreatorAvatar initials={row.initials} size="sm" />
                          <span className="font-medium text-gray-900">
                            {row.creatorName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-gray-700">
                        {row.submissionPublicId}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {row.submittedOn}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {row.hasUpdate ? (
                            <span className="h-2 w-2 shrink-0 rounded-full bg-red-500" />
                          ) : null}
                          <Button
                            type="button"
                            size="sm"
                            className="h-8 gap-1.5 rounded-lg bg-[#1E60DB] px-3 text-xs hover:bg-[#1850c4]"
                            onClick={() => handleOpenReview(row)}
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Review
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ReviewSubmissionDrawer
        open={Boolean(activeSubmissionKey)}
        submission={drawerSubmission}
        isLoading={isDetailLoading || isDetailFetching}
        isSubmitting={isSubmitting}
        onClose={handleCloseReview}
        onSubmitReview={handleSubmitReview}
      />
    </div>
  );
}
