import React, { useCallback, useMemo, useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Eye, CheckCircle2, AlertCircle, Lock, X } from "lucide-react";
import {
  approveSubmissionMutation,
  getCampaignSubmissionStatsQueryOptions,
  getCampaignSubmissionsQueryOptions,
  getSubmissionDetailQueryOptions,
  refetchBrandSubmissionViews,
  rejectSubmissionMutation,
  requestSubmissionRevisionMutation,
} from "../../../../../services/tanstack/queryService";
import {
  releaseFundsToCreator,
  getCampaignPaymentStatus,
} from "../../../../../services/api/apiservices";
import { useNotification } from "../../../../../context/NotificationContext";
import { InfoBanner } from "./shared/InfoBanner";
import CreatorAvatar from "./shared/CreatorAvatar";
import ReviewSubmissionDrawer from "./submissions/ReviewSubmissionDrawer";
import {
  mapApiSubmissionDetail,
  mapApiSubmissionListItem,
  parseSubmissionsListResponse,
} from "../../utils/brandSubmissionMapper";
import ErrorState from "../../../../../components/common/ErrorState";
import { SUBMISSION_STATUS } from "../../utils/submissionUtils";
import { useNavigate } from "react-router-dom";

// ✅ Statuses that mean "already released"
const RELEASED_STATUSES = ["PAYOUT_TRIGGERED", "RELEASED", "COMPLETED"];
const FUNDED_STATUSES = ["FUNDED", ...RELEASED_STATUSES];

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

export default function SubmissionsTab({ campaignPublicId, campaignId }) {
  const { showNotification } = useNotification();
  const navigate = useNavigate();
  const [activeSubmissionKey, setActiveSubmissionKey] = useState(null);
  const [optimisticById, setOptimisticById] = useState({});
  const [releasedIds, setReleasedIds] = useState({});
  const [escrowMap, setEscrowMap] = useState({});
  
  // ✅ NEW: Modal state for "fund escrow first"
  const [showFundEscrowModal, setShowFundEscrowModal] = useState(false);
  const [pendingSubmission, setPendingSubmission] = useState(null);

  const hasCampaignPublicId = Boolean(campaignPublicId);

  // ============================================================
  // SUBMISSIONS LIST
  // ============================================================
  const {
    data: listResponse,
    isLoading: isListLoading,
    isError: isListError,
    refetch: refetchList,
  } = useQuery({
    ...getCampaignSubmissionsQueryOptions(campaignPublicId),
    enabled: hasCampaignPublicId,
  });

  const { data: statsResponse } = useQuery({
    ...getCampaignSubmissionStatsQueryOptions(campaignPublicId),
    enabled: hasCampaignPublicId,
  });

  // ============================================================
  // ESCROW / PAYMENT STATUS
  // ============================================================
  const { data: paymentStatusResponse, refetch: refetchPaymentStatus } = useQuery({
    queryKey: ["campaign-payment-status", campaignId || campaignPublicId],
    queryFn: () => getCampaignPaymentStatus(campaignId || campaignPublicId),
    enabled: hasCampaignPublicId,
    staleTime: 30 * 1000,
  });

  useEffect(() => {
    const data = paymentStatusResponse?.data || paymentStatusResponse;
    if (!data?.transactions) return;

    const map = {};
    data.transactions.forEach((tx) => {
      map[tx.creatorId] = tx;
    });
    setEscrowMap(map);
  }, [paymentStatusResponse]);

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
    if (!submissions.length && !statsResponse?.stats) return base;

    const fromList = {
      total: submissions.length || base.total || 0,
      pendingReview: submissions.filter((s) => s.status === "pending_review").length,
      approved: submissions.filter((s) => s.status === "approved").length,
      revisionRequested: submissions.filter(
        (s) => s.status === "revision_requested"
      ).length,
      rejected: submissions.filter((s) => s.status === "rejected").length,
    };

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

  // ============================================================
  // ✅ REVIEW BUTTON HANDLER — Check escrow first
  // ============================================================
  const handleOpenReview = useCallback((row) => {
    const escrowTx = escrowMap[row.creatorId];
    const escrowStatus = escrowTx?.status;
    const isFunded = FUNDED_STATUSES.includes(escrowStatus);

    // ✅ Check escrow funded before opening review
    if (!isFunded) {
      setPendingSubmission(row);
      setShowFundEscrowModal(true);
      return;
    }

    // Escrow funded — open drawer
    setActiveSubmissionKey(row.submissionPublicId);
  }, [escrowMap]);

  // ✅ Navigate to Creators tab
  const handleGoToCreatorsTab = useCallback(() => {
    setShowFundEscrowModal(false);
    setPendingSubmission(null);
    navigate(`/brand/campaigns/${campaignPublicId}/view?tab=creators`);
  }, [campaignPublicId, navigate]);

  const handleCloseFundModal = useCallback(() => {
    setShowFundEscrowModal(false);
    setPendingSubmission(null);
  }, []);

  // ============================================================
  // APPROVE + AUTO-RELEASE FUNDS
  // ============================================================
  const { mutate: approve, isPending: isApproving } = useMutation({
    ...approveSubmissionMutation(campaignPublicId),
    onSuccess: async (_data, submissionPublicId) => {
      setOptimisticById((prev) => ({
        ...prev,
        [submissionPublicId]: "approved",
      }));

      const submission = submissions.find(
        (s) => s.submissionPublicId === submissionPublicId
      );
      const creatorId = submission?.creatorId;

      if (creatorId) {
        try {
          const res = await releaseFundsToCreator(campaignPublicId, creatorId);
          const data = res?.data?.success ? res.data : res;

          setReleasedIds((prev) => ({
            ...prev,
            [submissionPublicId]: true,
          }));

          await refetchPaymentStatus();

          showNotification({
            type: "success",
            message: "Approved & Funds Released",
            description:
              data?.message ||
              "Payout has been triggered. Creator will receive funds shortly.",
          });
        } catch (releaseErr) {
          console.error("Auto-release error:", releaseErr);
          showNotification({
            type: "warning",
            message: "Approved, but release pending",
            description:
              releaseErr?.message || "Funds will be released shortly.",
          });
        }
      } else {
        showNotification({
          type: "success",
          message: "Submission approved",
          description: "Funds release pending — creator info missing.",
        });
      }

      await refreshViews(submissionPublicId);
      await refetchList();
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
          description:
            data?.revisionsRemaining != null
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

      {alertMessage ? <InfoBanner message={alertMessage} tone="amber" /> : null}

      {!hasCampaignPublicId ? (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
          Campaign not found.
        </div>
      ) : isListLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
          Loading submissions...
        </div>
      ) : isListError ? (
        <ErrorState
          variant="card"
          type="server"
          title="Failed to Load Submissions"
          description="We couldn't load the submissions for this campaign. Please try again."
          onRetry={() => window.location.reload()}
        />
      ) : submissions.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
          No submissions yet.
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
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

                  const escrowTx = escrowMap[row.creatorId];
                  const escrowStatus = escrowTx?.status;

                  const isReleased =
                    releasedIds[row.submissionPublicId] ||
                    RELEASED_STATUSES.includes(escrowStatus);

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

                          {/* ✅ Review Button */}
                          <button
                            type="button"
                            onClick={() => handleOpenReview(row)}
                            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Review
                          </button>

                          {/* ✅ Funds Released Badge */}
                          {isReleased && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Funds Released
                            </span>
                          )}
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

      {/* ============================================================
          ✅ MODAL: Fund Escrow First
          ============================================================ */}
      {showFundEscrowModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleCloseFundModal}
          />
          <div className="relative bg-white rounded-2xl shadow-lg p-6 max-w-md w-full mx-4 z-10">
            {/* Close button */}
            <button
              onClick={handleCloseFundModal}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="h-8 w-8 text-amber-600" />
            </div>

            <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
              Fund Escrow First
            </h2>

            <p className="text-sm text-gray-600 text-center mb-4">
              Before reviewing this submission, you need to fund{" "}
              <span className="font-semibold text-gray-800">
                {pendingSubmission?.creatorName || "this creator"}
              </span>
              's escrow.
            </p>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-5">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-1">Why is this required?</p>
                  <p>
                    Funds must be secured in escrow before work can be reviewed
                    and approved. This protects both you and the creator.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <button
                onClick={handleGoToCreatorsTab}
                className="w-full px-6 py-3 bg-[#0C7BB3] text-white rounded-lg hover:bg-[#0353A4] transition-colors font-medium"
              >
                Go to Creators Tab
              </button>

              <button
                onClick={handleCloseFundModal}
                className="w-full px-6 py-3 bg-white text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
            </div>
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