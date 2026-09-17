import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";

const STATUS_STYLES = {
  pending: "bg-amber-50 text-amber-800",
  accepted: "bg-emerald-50 text-emerald-700",
  declined: "bg-red-50 text-red-700",
};

const STATUS_LABELS = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
};

const truncate = (value, max = 60) => {
  if (!value) return "";
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
};

export default function InvitationGridCard({
  invitation,
  onAccept,
  onDecline,
  onViewDetails,
}) {
  const navigate = useNavigate();
  const {
    publicId,
    title,
    brandName,
    brandLogo,
    campaignName,
    description,
    customMessage,
    image,
    offerAmount,
    deliverable,
    platform,
    invitationSent,
    status,
    campaignPublicId,
  } = invitation;

  const isPending = status === "pending";
  const isAccepted = status === "accepted";
  const isDeclined = status === "declined";

  const handleApply = () => {
    if (campaignPublicId) {
      navigate(`/creator/campaigns/${campaignPublicId}/apply`);
    }
  };

  return (
    <div className="flex h-full min-h-[39rem] flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[16/10] bg-gray-100">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0353A4] to-[#4b96e3] text-white">
            <span className="text-xl">{brandName}</span>
          </div>
        )}
        <span
          className={`absolute right-3 top-3 rounded-full px-2.5 py-1 text-xs font-semibold ${
            STATUS_STYLES[status] || STATUS_STYLES.pending
          }`}
        >
          {STATUS_LABELS[status] || "Pending"}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="text-lg font-bold text-gray-900">
          {title}
        </h3>

        <div className="mt-2 flex items-center gap-2">
          {brandLogo ? (
            <img
              src={brandLogo}
              alt={brandName}
              className="h-6 w-6 rounded-full border border-gray-200 object-cover"
            />
          ) : null}
          <p className="text-xs text-gray-500 sm:text-sm">{brandName}</p>
        </div>

        {campaignName && campaignName !== title ? (
          <p className="text-xs text-gray-500 sm:text-sm">
            Campaign: {campaignName}
          </p>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-3 border-y border-gray-100 py-3">
          <div>
            <p className="text-xs text-gray-400">Deliverable</p>
            <p className="text-sm font-medium text-gray-800">
              {deliverable || "—"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Compensation</p>
            <p className="text-sm font-medium text-[#0c7bb3]">
              {offerAmount || "—"}
            </p>
          </div>
        </div>

        {Array.isArray(platform) && platform.length > 0 ? (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {platform.map((p) => (
              <span
                key={p}
                className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-[#0c7bb3]"
              >
                {p}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-3">
          <p className="text-xs text-gray-400">Invitation Sent</p>
          <p className="text-sm text-gray-700">{invitationSent}</p>
        </div>

        {customMessage ? (
          <blockquote className="mt-3 rounded-lg border-l-2 border-[#0c7bb3] bg-blue-50/50 px-3 py-2 text-sm italic text-gray-700">
            "{truncate(customMessage, 120)}"
          </blockquote>
        ) : description ? (
          <p className="mt-3 line-clamp-2 flex-1 text-sm text-gray-600">
            {description}
          </p>
        ) : null}

        <div className="mt-auto space-y-2 pt-4">
          {isPending ? (
            <>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  className="flex-1 rounded-xl btn-gradient text-sm font-semibold"
                  onClick={() => onAccept?.(invitation)}
                >
                  Accept
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 rounded-xl border-red-400 text-sm font-semibold text-red-500 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => onDecline?.(invitation)}
                >
                  Decline
                </Button>
              </div>
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl border-[#0c7bb3] text-sm font-semibold text-[#0c7bb3] hover:bg-blue-50"
                onClick={() => onViewDetails?.(publicId)}
              >
                View Details
              </Button>
            </>
          ) : isAccepted ? (
            <>
              <Button
                type="button"
                className="w-full rounded-xl bg-[#0c7bb3] text-sm font-semibold hover:bg-[#0a6a9c]"
                onClick={handleApply}
                disabled={!campaignPublicId}
              >
                Apply to Campaign
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-xl border-[#0c7bb3] text-sm font-semibold text-[#0c7bb3] hover:bg-blue-50"
                onClick={() => onViewDetails?.(publicId)}
              >
                View Details
              </Button>
            </>
          ) : isDeclined ? (
            <Button
              type="button"
              variant="outline"
              className="w-full cursor-not-allowed rounded-xl border-gray-200 text-sm font-semibold text-gray-400"
              disabled
            >
              Declined
            </Button>
          ) : (
            <Button
              type="button"
              className="w-full rounded-xl bg-[#0c7bb3] text-sm font-semibold hover:bg-[#0a6a9c]"
              onClick={() => onViewDetails?.(publicId)}
            >
              View Details
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
