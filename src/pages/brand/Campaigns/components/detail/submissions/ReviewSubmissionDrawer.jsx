import React, { useEffect, useMemo, useState } from "react";
import { Drawer, Spin } from "antd";
import {
  CheckCircle2,
  Download,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  X,
} from "lucide-react";
import { Button } from "../../../../../../components/ui/button";
import CreatorAvatar from "../shared/CreatorAvatar";
import SubmissionAssetCard from "./SubmissionAssetCard";
import {
  buildReviewPayload,
  determineReviewAction,
} from "../../../utils/brandSubmissionMapper";
import {
  canSubmitReview,
  getDecisionSummaryText,
  getReviewActionLabel,
  SUBMISSION_STATUS,
  summarizeAssetDecisions,
} from "../../../utils/submissionUtils";

function downloadAssets(assets = []) {
  assets.forEach((asset) => {
    if (!asset.url) return;
    const link = document.createElement("a");
    link.href = asset.url;
    link.download = asset.name || "download";
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  });
}

export default function ReviewSubmissionDrawer({
  open,
  submission,
  isLoading = false,
  isSubmitting = false,
  onClose,
  onSubmitReview,
}) {
  const [assets, setAssets] = useState([]);
  const [revisionFeedback, setRevisionFeedback] = useState("");
  const [rejectionFeedback, setRejectionFeedback] = useState("");

  useEffect(() => {
    if (!submission) return;
    setAssets(submission.assets?.map((asset) => ({ ...asset })) || []);
    // Only clear feedback fields while the submission is still reviewable.
    if (submission.isReviewable) {
      setRevisionFeedback("");
      setRejectionFeedback("");
    }
  }, [
    submission?.submissionPublicId,
    submission?.status,
    submission?.isReviewable,
    submission?.assets,
  ]);

  const summary = useMemo(() => summarizeAssetDecisions(assets), [assets]);
  const reviewAction = useMemo(() => determineReviewAction(assets), [assets]);
  const summaryText = useMemo(
    () =>
      getDecisionSummaryText({
        ...summary,
        total: assets.length,
      }),
    [summary, assets.length]
  );

  const revisionAssetNames = useMemo(
    () => summary.revision.map((asset) => asset.name).join(", "),
    [summary.revision]
  );

  const rejectedAssetNames = useMemo(
    () => summary.rejected.map((asset) => asset.name).join(", "),
    [summary.rejected]
  );

  const statusConfig =
    SUBMISSION_STATUS[submission?.status] || SUBMISSION_STATUS.pending_review;
  const isApproved = submission?.status === "approved";
  const isReviewable = submission?.isReviewable;
  const isFinalAttempt = submission?.isFinalAttempt;
  const canDownload = isApproved && assets.some((asset) => asset.url);
  const canSubmit = canSubmitReview({
    summary,
    revisionFeedback,
    rejectionFeedback,
    action: reviewAction,
  });

  const handleAssetDecision = (assetId, nextDecision) => {
    setAssets((prev) =>
      prev.map((asset) =>
        (asset.publicId || asset.id) === assetId
          ? { ...asset, decision: nextDecision }
          : asset
      )
    );
  };

  const handleSubmit = () => {
    if (!submission || !reviewAction || !canSubmit) return;

    const payload =
      reviewAction === "approve"
        ? null
        : buildReviewPayload({
            assets,
            revisionFeedback,
            rejectionFeedback,
          });

    onSubmitReview?.({
      submission,
      action: reviewAction,
      payload,
      assets,
    });
  };

  const primaryButtonClass =
    reviewAction === "approve"
      ? "bg-emerald-600 hover:bg-emerald-700"
      : reviewAction === "request-revision"
        ? "bg-amber-600 hover:bg-amber-700"
        : "bg-red-600 hover:bg-red-700";

  if (!submission && !isLoading) return null;

  return (
    <Drawer
      title={null}
      placement="right"
      width={575}
      open={open}
      onClose={onClose}
      closable={false}
      styles={{ body: { padding: 0 } }}
      footer={
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-9 gap-2 rounded-lg border-gray-200 text-sm"
            disabled={!canDownload}
            onClick={() => downloadAssets(assets)}
          >
            <Download className="h-4 w-4" />
            Download All
          </Button>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-lg text-sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            {isReviewable ? (
              <Button
                type="button"
                className={`h-9 rounded-lg text-sm text-white ${primaryButtonClass}`}
                disabled={!canSubmit || isSubmitting || isFinalAttempt && reviewAction !== "approve"}
                onClick={handleSubmit}
              >
                {isSubmitting
                  ? "Submitting..."
                  : getReviewActionLabel(reviewAction)}
              </Button>
            ) : null}
          </div>
        </div>
      }
    >
      <div className="flex h-full flex-col">
        <div className="border-b border-gray-100 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Review Submission
              </h2>
              <p className="mt-0.5 font-mono text-sm text-gray-500">
                {submission?.submissionPublicId || "—"}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-gray-400 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spin />
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">
                  Submitted Assets{" "}
                  <span className="font-normal text-gray-500">
                    ({assets.length} files)
                  </span>
                </p>
                {isReviewable ? (
                  <p className="text-xs text-gray-400">
                    {isFinalAttempt
                      ? "Tap row to mark assets accepted"
                      : "Tap row to cycle: OK → ✓ → Revision → Reject"}
                  </p>
                ) : null}
              </div>

              <div className="mt-3 space-y-2">
                {assets.map((asset, index) => (
                  <SubmissionAssetCard
                    key={asset.publicId || asset.id || index}
                    asset={asset}
                    index={index}
                    readOnly={!isReviewable}
                    approveOnly={isFinalAttempt}
                    onDecisionChange={(nextDecision) =>
                      handleAssetDecision(
                        asset.publicId || asset.id,
                        nextDecision
                      )
                    }
                  />
                ))}
              </div>

              {summaryText ? (
                <p
                  className={`mt-3 text-sm ${
                    summary.allAccepted
                      ? "text-green-700"
                      : summary.hasUnresolved
                        ? "text-amber-700"
                        : "text-red-600"
                  }`}
                >
                  {summary.allAccepted ? (
                    <span className="inline-flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" />
                      {summaryText}
                    </span>
                  ) : (
                    summaryText
                  )}
                </p>
              ) : null}

              <div className="mt-5 rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <CreatorAvatar initials={submission?.initials} size="sm" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {submission?.creatorName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Submitted {submission?.submittedOn}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${statusConfig.className}`}
                  >
                    {statusConfig.label}
                  </span>
                </div>
                {submission?.creatorMessage ? (
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {submission.creatorMessage}
                  </p>
                ) : null}
                {submission?.captionOrHook ? (
                  <p className="mt-2 text-sm italic text-gray-500">
                    &ldquo;{submission.captionOrHook}&rdquo;
                  </p>
                ) : null}
              </div>

              {isReviewable ? (
                <div className="mt-5 space-y-4">
                  <p className="text-sm font-medium text-gray-500">
                    Your Decision
                  </p>

                  {isFinalAttempt ? (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                      Final review — only approval is available. The creator has
                      used all revision attempts.
                    </div>
                  ) : null}

                  {summary.allAccepted ? (
                    <div className="flex items-start gap-3 rounded-xl border-2 border-green-300 bg-green-50 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
                        <ThumbsUp className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-green-800">
                          Approve Submission
                        </p>
                        <p className="text-sm text-green-700">
                          All assets accepted — payment will be triggered
                        </p>
                      </div>
                    </div>
                  ) : null}

                  {summary.revision.length > 0 && !isFinalAttempt ? (
                    <>
                      <div className="flex items-start gap-3 rounded-xl border-2 border-amber-300 bg-amber-50 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
                          <RefreshCw className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-amber-800">
                            Request Revision
                          </p>
                          <p className="text-sm text-amber-700">
                            Flagged assets need updates before approval
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Revision Notes{" "}
                          <span className="text-red-500">*</span>
                          {revisionAssetNames ? (
                            <span className="block text-xs font-normal text-gray-500">
                              for {revisionAssetNames}
                            </span>
                          ) : null}
                        </label>
                        <textarea
                          value={revisionFeedback}
                          onChange={(event) =>
                            setRevisionFeedback(event.target.value)
                          }
                          rows={3}
                          placeholder="Explain what needs to be revised..."
                          className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1E60DB] focus:outline-none focus:ring-1 focus:ring-[#1E60DB]/20"
                        />
                      </div>
                    </>
                  ) : null}

                  {summary.rejected.length > 0 && !isFinalAttempt ? (
                    <>
                      <div className="flex items-start gap-3 rounded-xl border-2 border-red-300 bg-red-50 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                          <ThumbsDown className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-red-800">
                            Reject Submission
                          </p>
                          <p className="text-sm text-red-700">
                            Rejected assets will not proceed — provide a reason
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">
                          Rejection Reason{" "}
                          <span className="text-red-500">*</span>
                          {rejectedAssetNames ? (
                            <span className="block text-xs font-normal text-gray-500">
                              for {rejectedAssetNames}
                            </span>
                          ) : null}
                        </label>
                        <textarea
                          value={rejectionFeedback}
                          onChange={(event) =>
                            setRejectionFeedback(event.target.value)
                          }
                          rows={3}
                          placeholder="Explain why this submission is being rejected..."
                          className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-[#1E60DB] focus:outline-none focus:ring-1 focus:ring-[#1E60DB]/20"
                        />
                      </div>
                    </>
                  ) : null}
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
    </Drawer>
  );
}
