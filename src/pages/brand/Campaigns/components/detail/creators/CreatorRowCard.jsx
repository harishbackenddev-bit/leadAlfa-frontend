import React from "react";
import { MessageCircle, Star, Lock, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { Button } from "../../../../../../components/ui/button";
import CreatorAvatar from "../shared/CreatorAvatar";

const STATUS_CONFIG = {
  working: { label: "Working", className: "bg-blue-50 text-blue-700" },
  submitted: { label: "Submitted", className: "bg-purple-50 text-purple-700" },
  hired: { label: "Hired", className: "bg-green-50 text-green-700" },
  invited: { label: "Invited", className: "bg-gray-100 text-gray-600" },
  completed: { label: "Completed", className: "bg-green-50 text-green-700" },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700" },
  refunded: { label: "Refunded", className: "bg-orange-50 text-orange-700" },
};

// ✅ Escrow statuses
const FUNDED_STATUSES = [
  "FUNDED",
  "PAYOUT_TRIGGERED",
  "RELEASED",
  "COMPLETED",
];

const RELEASED_STATUSES = ["RELEASED", "COMPLETED", "PAYOUT_TRIGGERED"];
const CANCELLED_STATUSES = ["CANCELLED", "REFUNDED"];

export default function CreatorRowCard({
  creator,
  onViewProfile,
  onMessage,
  escrowStatus,
  escrowAmount,
  isSelectingEscrow,
  isCancellingEscrow,
  isCampaignFunded,
  onSelectAndFund,
  onCancelEscrow,
}) {
  const status = STATUS_CONFIG[creator.status] || STATUS_CONFIG.invited;
  const isProcessing = isSelectingEscrow;
  const isCancelling = isCancellingEscrow;

  const isInEscrow = FUNDED_STATUSES.includes(escrowStatus);
  const isReleased = RELEASED_STATUSES.includes(escrowStatus);
  const isCancelled = CANCELLED_STATUSES.includes(escrowStatus);
  const canCancel = isInEscrow && !isReleased && !isCancelled && onCancelEscrow;

  return (
    <article className="rounded-xl border border-gray-200 bg-white p-4 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <CreatorAvatar initials={creator.initials} />
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-900">{creator.name}</span>
              <span
                className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
              >
                {status.label}
              </span>

              {/* ✅ Escrow status badges */}
              {isInEscrow && !isCancelled && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  <Lock className="h-3 w-3" />
                  {isReleased ? "Released" : "Funds Secured in Escrow"}
                </span>
              )}

              {isCancelled && (
                <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
                  <XCircle className="h-3 w-3" />
                  {escrowStatus === "REFUNDED" ? "Refunded" : "Cancelled"}
                </span>
              )}
            </div>
            <p className="mt-0.5 text-sm text-gray-500">{creator.handle}</p>
            <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
              {creator.rating} · {creator.jobsDone} jobs
            </p>

            {/* ✅ Escrow amount display */}
            {isInEscrow && escrowAmount != null && (
              <p className="mt-1 text-xs font-medium text-emerald-700">
                🔒 R {Number(escrowAmount).toFixed(2)} secured
              </p>
            )}
          </div>
        </div>

        <div className="hidden grid grid-cols-2 gap-4 sm:grid-cols-3 lg:items-center lg:gap-8">
          <div className="text-center lg:min-w-[100px]">
            <p className="text-lg font-semibold text-gray-900">
              {creator.deliverables}
            </p>
            <p className="text-xs text-gray-500">Deliverables</p>
          </div>
          <div className="text-center lg:min-w-[120px]">
            <p className="text-sm font-semibold text-gray-900">{creator.deadline}</p>
            <p className="text-xs text-gray-500">Deadline</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2 lg:shrink-0">
          {/* Fund Escrow Button */}
          {onSelectAndFund && !isInEscrow && !isCancelled && (
            <Button
              type="button"
              size="sm"
              onClick={() => onSelectAndFund?.(creator)}
              disabled={isProcessing || !isCampaignFunded}
              className="h-9 rounded-lg bg-emerald-600 px-4 text-sm text-white hover:bg-emerald-700 disabled:opacity-50"
              title={
                !isCampaignFunded
                  ? "Campaign must be funded first"
                  : "Select & Fund Escrow"
              }
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="mr-1 h-3.5 w-3.5" />
                  Fund Escrow
                </>
              )}
            </Button>
          )}

          {/* ✅ Cancel Escrow Button — only if funded and not released */}
          {canCancel && (
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => onCancelEscrow?.(creator)}
              disabled={isCancelling}
              className="h-9 rounded-lg border-red-200 bg-white px-3 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
              title="Cancel this creator's escrow. Funds will return to campaign wallet."
            >
              {isCancelling ? (
                <>
                  <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                  Cancelling...
                </>
              ) : (
                <>
                  <XCircle className="mr-1 h-3.5 w-3.5" />
                  Cancel Escrow
                </>
              )}
            </Button>
          )}

          {/* Funded badge (no cancel possible) */}
          {isInEscrow && isReleased && (
            <span className="flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Already Released
            </span>
          )}

          {isCancelled && (
            <span className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              <XCircle className="h-4 w-4" />
              {escrowStatus === "REFUNDED" ? "Refunded" : "Cancelled"}
            </span>
          )}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 rounded-lg border-gray-200 px-4 text-sm text-gray-700"
            onClick={() => onViewProfile?.(creator)}
          >
            View Profile
          </Button>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-9 w-9 rounded-lg border-gray-200 text-gray-600"
            onClick={() => onMessage?.(creator)}
            aria-label={`Message ${creator.name}`}
          >
            <MessageCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}