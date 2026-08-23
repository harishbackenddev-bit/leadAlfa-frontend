import React, { useEffect } from "react";
import { Play, X } from "lucide-react";
import brandVideo from "../../../../../../assets/SVGs/brands/campaigns/brandVideo.svg";
import { capitalizeCreatorName } from "../../../utils/proposalUtils";

const getProfilePhoto = (creator) =>
  creator?.mediaLinks?.find((link) => link.usageType === "profile_photo")
    ?.mediaDetails?.url || null;

const getInitials = (creator) => {
  const first = String(creator?.firstName || "").trim();
  const last = String(creator?.lastName || "").trim();
  return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "NA";
};

const getFullName = (creator) =>
  capitalizeCreatorName(
    `${creator?.firstName || ""} ${creator?.lastName || ""}`.trim()
  ) || "Unnamed creator";

const formatBytes = (bytes) => {
  if (!bytes || Number.isNaN(Number(bytes))) return null;
  const num = Number(bytes);
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / 1024 / 1024).toFixed(1)} MB`;
};

const isAccepted = (app) =>
  String(app?.applicationStatus || app?.status || "").toLowerCase() ===
  "accepted";

function ModalCreatorAvatar({ creator, size = "md" }) {
  const sizeClass =
    size === "lg"
      ? "h-12 w-12 sm:h-14 sm:w-14 text-base"
      : "h-11 w-11 text-sm";
  const photo = getProfilePhoto(creator);
  const name = getFullName(creator);

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className={`${sizeClass} flex-shrink-0 rounded-full object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#0353a4] to-[#4b96e3] font-semibold text-white`}
      aria-label={name}
    >
      {getInitials(creator)}
    </div>
  );
}

/**
 * Full proposal review modal (pitch + video pitch + accept/reject).
 * Shared by ProposalsTab and PendingCreators.
 */
export default function ProposalViewModal({
  application,
  onClose,
  onViewCreator,
  onAccept,
  onReject,
  isProcessing,
}) {
  const creator = application?.creator || {};
  const accepted = isAccepted(application);
  const videoPitch = application?.applicationMedia?.find(
    (m) => m.usageType === "video_pitch"
  );
  const jobsCompleted = creator?.jobsCompleted ?? 0;
  const rating = creator?.rating ?? creator?.averageRating;
  const subtitle =
    [
      Number(jobsCompleted) ? `${jobsCompleted} Jobs` : null,
      rating ? `Ratings: ${rating}/5` : null,
    ]
      .filter(Boolean)
      .join(", ") ||
    creator?.bio ||
    "Content creator";

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
        aria-hidden
      />
      <div className="relative z-10 mx-auto flex max-h-[95vh] w-full flex-col overflow-hidden bg-white shadow-xl sm:max-w-2xl sm:rounded-2xl">
        <div className="flex items-start gap-4 border-b border-gray-100 px-5 py-5 sm:px-7 sm:py-6">
          <ModalCreatorAvatar creator={creator} size="lg" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-lg font-semibold text-gray-900">
              {getFullName(creator)}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {subtitle?.split(" ").slice(0, 12).join(" ")}
              {subtitle?.split(" ").length > 12 ? "..." : ""}
            </p>
          </div>
          <button
            type="button"
            onClick={onViewCreator}
            className="btn-gradient hidden whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95 sm:inline-flex"
          >
            View Creator
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="px-5 pt-3 sm:hidden">
          <button
            type="button"
            onClick={onViewCreator}
            className="btn-gradient w-full rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-95"
          >
            View Creator
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
          <p className="text-sm font-bold uppercase tracking-wider text-black">
            Proposal
          </p>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
            {application?.pitch || "No pitch provided."}
          </p>
          <p className="text-sm text-black">{getFullName(creator)}</p>

          {videoPitch ? (
            <>
              <p className="mt-6 text-sm font-bold uppercase tracking-wider text-black">
                Video Pitch
              </p>
              <div className="mt-3 flex items-center gap-4 rounded-xl bg-[#F4F6FB] px-4 py-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-white">
                  <img src={brandVideo} alt="video" className="h-7 w-7" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {videoPitch.name || "Video pitch"}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {[formatBytes(videoPitch.size), "Video file"]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <a
                  href={videoPitch.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full border border-[#1E60DB]/30 text-[#1E60DB] hover:bg-[#1E60DB]/5"
                  aria-label="Play video"
                >
                  <Play className="h-4 w-4 fill-current" />
                </a>
              </div>
            </>
          ) : null}
        </div>

        {!accepted ? (
          <div className="border-t border-gray-100 px-5 py-4 sm:px-7 sm:py-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={onAccept}
                  disabled={isProcessing}
                  className="btn-gradient rounded-full px-6 py-3 text-sm font-semibold text-white shadow-sm hover:opacity-95 disabled:opacity-50"
                >
                  {isProcessing ? "Processing..." : "Accept Proposal"}
                </button>
                <button
                  type="button"
                  onClick={onReject}
                  disabled={isProcessing}
                  className="rounded-full border border-gray-300 bg-white px-6 py-3 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Reject Proposal
                </button>
              </div>
              <button
                type="button"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Don't show me this creator again
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export { getFullName };
