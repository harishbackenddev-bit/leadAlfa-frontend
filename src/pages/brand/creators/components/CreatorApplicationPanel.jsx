import React from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../../components/ui/button";
import brandVideoIcon from "../../../../assets/SVGs/brands/campaigns/brandVideo.svg";
import { changeApplicationStatusMutation } from "../../../../services/tanstack/queryService";
import { useNotification } from "../../../../context/NotificationContext";

/**
 * Renders the creator's proposal (pitch + video pitch + accept/reject) on
 * the brand's creator profile page when navigated from a campaign's
 * Pending Creators list.
 *
 * Props:
 *  - application: the campaign-application record (must include `id`, `pitch`,
 *    `applicationMedia`).
 *  - campaignId: numeric campaign id used to invalidate the campaign-applications
 *    cache after accept/reject.
 *  - returnTo: path to navigate back to after accept/reject (campaign view).
 */
export default function CreatorApplicationPanel({
  application,
  campaignId,
  returnTo,
}) {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const videoPitch = application?.applicationMedia?.find(
    (media) => media.usageType === "video_pitch"
  );

  const { mutate: changeStatus, isPending: isChangingStatus } = useMutation({
    ...changeApplicationStatusMutation(campaignId),
    onSuccess: (data, variables) => {
      const isAccept = variables.newStatus === "accepted";
      showNotification({
        type: "success",
        message: isAccept ? "Application accepted!" : "Application rejected.",
        description: isAccept
          ? "A chat room has been created with the creator."
          : "The applicant has been notified.",
      });

      const chatRoomId = data?.chatRoomId ?? data?.chatRoom?.id ?? null;
      setTimeout(() => {
        if (isAccept && chatRoomId) {
          navigate("/brand/messages", { state: { openRoomId: chatRoomId } });
        } else if (returnTo) {
          navigate(returnTo);
        } else {
          navigate(-1);
        }
      }, 600);
    },
  });

  if (!application) return null;

  // If the application is already accepted/rejected, don't render the panel —
  // the brand sees only the creator details (per requirement).
  const status = String(
    application?.applicationStatus || application?.status || ""
  ).toLowerCase();
  if (status === "accepted" || status === "rejected") return null;

  const handleAccept = () => {
    changeStatus({ applicationId: application.id, newStatus: "accepted" });
  };

  const handleReject = () => {
    changeStatus({ applicationId: application.id, newStatus: "rejected" });
  };

  return (
    <section className="rounded-2xl border border-[#e8edf3] bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-[18px] font-semibold text-[#1a1a1a]">
            Pending Application
          </h2>
          <p className="text-sm text-[#64748b]">
            Review the creator's proposal and respond.
          </p>
        </div>
        <span className="inline-flex w-fit items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
          {String(application?.applicationStatus || "pending").replace(
            /_/g,
            " "
          )}
        </span>
      </div>

      <div className="mb-4">
        <h3 className="mb-2 text-base font-semibold text-gray-900">
          Proposal
        </h3>
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
          {application?.pitch || "No pitch provided."}
        </p>
      </div>

      {videoPitch ? (
        <div className="mb-4">
          <h3 className="mb-2 text-base font-semibold text-gray-900">
            Video Pitch
          </h3>
          <div className="flex items-center gap-4 rounded-xl bg-[#EEF1F7] px-4 py-4">
            <img
              src={brandVideoIcon}
              alt="video"
              className="h-10 w-10 flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <a
                href={videoPitch.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block truncate text-base font-medium text-gray-900 hover:text-blue-600"
              >
                {videoPitch.name || "Video pitch"}
              </a>
              <p className="text-xs text-gray-500">Video pitch</p>
            </div>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="button"
          onClick={handleAccept}
          disabled={isChangingStatus}
          className="rounded-full btn-gradient px-6"
        >
          {isChangingStatus ? "Processing..." : "Accept Proposal"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={handleReject}
          disabled={isChangingStatus}
          className="rounded-full"
        >
          Reject Proposal
        </Button>
      </div>
    </section>
  );
}
