import React, { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Star } from "lucide-react";
import {
  changeApplicationStatusMutation,
  getCreatorApplicationsQueryOptions,
} from "../../../../services/tanstack/queryService";
import { useNotification } from "../../../../context/NotificationContext";
import ConfirmActionDialog from "../../../../components/common/ConfirmActionDialog";
import ProposalViewModal, {
  getFullName,
} from "./detail/proposals/ProposalViewModal";

/* ---------- helpers ---------- */

const getProfilePhoto = (creator) =>
  creator?.mediaLinks?.find((link) => link.usageType === "profile_photo")
    ?.mediaDetails?.url || null;

const getInitials = (creator) => {
  const first = String(creator?.firstName || "").trim();
  const last = String(creator?.lastName || "").trim();
  const initials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  return initials || "NA";
};

const getLocation = (creator) =>
  [creator?.city, creator?.country].filter(Boolean).join(", ");

/** Convert ISO 2-letter country code (e.g. "ZA") into a flag emoji. */
const countryToFlag = (code) => {
  const upper = String(code || "")
    .trim()
    .toUpperCase();
  if (upper.length !== 2 || !/^[A-Z]+$/.test(upper)) return "🌍";
  return String.fromCodePoint(
    ...upper.split("").map((c) => 127397 + c.charCodeAt(0))
  );
};

const getCountryFlag = (creator) => {
  const code = creator?.countryCode || creator?.country;
  if (!code) return "🌍";
  return countryToFlag(code);
};

const isAccepted = (app) =>
  String(app?.applicationStatus || app?.status || "").toLowerCase() ===
  "accepted";

const isPending = (app) => {
  const s = String(app?.applicationStatus || app?.status || "").toLowerCase();
  return s === "pending" || s === "applied";
};

/* ---------- shared sub-components ---------- */

function CreatorAvatar({ creator, size = "md" }) {
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
      className={`${sizeClass} flex flex-shrink-0 items-center justify-center rounded-full btn-gradient font-semibold text-white`}
      aria-label={name}
    >
      {getInitials(creator)}
    </div>
  );
}

function RatingStars({ rating = 0, max = 5 }) {
  const rounded = Math.round(Number(rating) || 0);
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rounded
            ? "fill-[#fbbf24] text-[#fbbf24]"
            : "fill-[#e2e8f0] text-[#e2e8f0]"
            }`}
        />
      ))}
    </div>
  );
}

/* ---------- single row (image 3) ---------- */

function ApplicantRow({ application, onView, actionLabel = "View Proposal" }) {
  const creator = application?.creator || {};
  const name = getFullName(creator);
  const location = getLocation(creator) || "—";
  const flag = getCountryFlag(creator);
  const jobsCompleted = creator?.jobsCompleted ?? creator?.jobs ?? 0;
  const rating = creator?.rating ?? creator?.averageRating ?? 0;

  return (
    <div className="flex flex-col gap-4 py-4 first:pt-0 last:pb-0 sm:py-5 lg:flex-row lg:items-center lg:gap-6">
      {/* Identity */}
      <div className="flex min-w-0 items-center gap-3 lg:w-1/4">
        <CreatorAvatar creator={creator} />
        <button
          type="button"
          onClick={() => onView(application)}
          className="min-w-0 truncate text-left text-base font-semibold text-gray-900 hover:underline"
        >
          {name}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 lg:flex lg:flex-1 lg:items-center lg:gap-8">
        <div className="min-w-0">
          <p className="text-xs text-gray-500">Jobs Completed</p>
          <p className="mt-1 text-sm font-semibold text-gray-900">
            {jobsCompleted} {Number(jobsCompleted) === 1 ? "Job" : "Jobs"}
          </p>
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-500">Ratings</p>
          <div className="mt-1">
            <RatingStars rating={rating} />
          </div>
        </div>

        <div className="min-w-0">
          <p className="text-xs text-gray-500">Location</p>
          <p className="mt-1 truncate text-sm text-gray-700">
            <span className="mr-1" aria-hidden>
              {flag}
            </span>
            {location}
          </p>
        </div>
      </div>

      <div className="lg:flex-shrink-0">
        <button
          type="button"
          onClick={() => onView(application)}
          className="w-full whitespace-nowrap rounded-full bg-[#1E60DB] px-6 py-3 text-sm font-semibold text-white shadow-md hover:opacity-95 sm:w-auto"
        >
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

/* ---------- confirmation dialog — shared ConfirmActionDialog ---------- */

/* ---------- main component ---------- */

export default function PendingCreators({ campaignId }) {
  const [selectedCreator, setSelectedCreator] = useState(null);
  // null | "accept" | "reject" — controls the confirmation dialog
  const [confirmAction, setConfirmAction] = useState(null);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const {
    data: response,
    isLoading,
    isError,
  } = useQuery(getCreatorApplicationsQueryOptions(campaignId));

  const { mutate: changeStatus, isPending: isChangingStatus } = useMutation({
    ...changeApplicationStatusMutation(campaignId),
    onSuccess: (data, variables) => {
      setConfirmAction(null);
      setSelectedCreator(null);
      if (variables.newStatus === "accepted") {
        const creatorName = selectedCreator?.creator?.firstName || "Creator";
        showNotification({
          type: "success",
          message: "Application accepted!",
          description: `Chat room created with ${creatorName}.`,
        });
        const chatRoomId = data?.chatRoomId ?? data?.chatRoom?.id ?? null;
        setTimeout(() => {
          if (chatRoomId) {
            navigate("/brand/messages", { state: { openRoomId: chatRoomId } });
          } else {
            navigate("/brand/messages");
          }
        }, 600);
      } else if (variables.newStatus === "rejected") {
        showNotification({
          type: "success",
          message: "Application rejected.",
          description: "The applicant has been notified.",
        });
      }
    },
  });

  const applicants = useMemo(() => {
    if (Array.isArray(response)) return response;
    return (
      response?.applicants ||
      response?.applications ||
      response?.data?.applicants ||
      response?.data?.applications ||
      []
    );
  }, [response]);

  const pendingApplicants = useMemo(
    () => applicants.filter(isPending),
    [applicants]
  );
  const acceptedApplicants = useMemo(
    () => applicants.filter(isAccepted),
    [applicants]
  );

  const handleAccept = () => {
    if (!selectedCreator) return;
    changeStatus({ applicationId: selectedCreator.id, newStatus: "accepted" });
  };

  const handleReject = () => {
    if (!selectedCreator) return;
    changeStatus({ applicationId: selectedCreator.id, newStatus: "rejected" });
  };

  const handleViewCreator = (application) => {
    const creatorId = application?.creator?.id || application?.creator?.userId;
    if (!creatorId) return;
    navigate(`/brand/creators/${creatorId}/view`, {
      state: {
        application,
        campaignId,
        returnTo: window.location.pathname,
      },
    });
  };

  const handleOpenModal = (application) => setSelectedCreator(application);
  const handleCloseModal = () => {
    setConfirmAction(null);
    setSelectedCreator(null);
  };

  useEffect(() => {
    document.body.style.overflow = selectedCreator ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedCreator]);

  /* ---------- render states ---------- */

  if (isLoading) {
    return (
      <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Creator Applications
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-blue-500" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Creator Applications
        </h2>
        <div className="py-12 text-center text-red-500">
          Failed to load applications. Please try again.
        </div>
      </div>
    );
  }

  const hasAny = pendingApplicants.length > 0 || acceptedApplicants.length > 0;

  if (!hasAny) {
    return (
      <div className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Creator Applications
        </h2>
        <div className="py-12 text-center text-gray-500">
          No creator applications at this time.
        </div>
      </div>
    );
  }

  return (
    <>
      {pendingApplicants.length > 0 ? (
        <section className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Creator Applications
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            New proposals waiting for your review.
          </p>
          <div className="divide-y divide-gray-100">
            {pendingApplicants.map((application) => (
              <ApplicantRow
                key={application.id}
                application={application}
                onView={handleOpenModal}
                actionLabel="View Proposal"
              />
            ))}
          </div>
        </section>
      ) : null}

      {acceptedApplicants.length > 0 ? (
        <section className="mt-8 rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
          <h2 className="mb-2 text-lg font-semibold text-gray-900">
            Active Creators
          </h2>
          <p className="mb-4 text-sm text-gray-500">
            Creators you've accepted for this campaign.
          </p>
          <div className="divide-y divide-gray-100">
            {acceptedApplicants.map((application) => (
              <ApplicantRow
                key={application.id}
                application={application}
                onView={handleOpenModal}
                actionLabel="View Proposal"
              />
            ))}
          </div>
        </section>
      ) : null}

      {selectedCreator ? (
        <ProposalViewModal
          application={selectedCreator}
          onClose={handleCloseModal}
          onViewCreator={() => handleViewCreator(selectedCreator)}
          onAccept={() => setConfirmAction("accept")}
          onReject={() => setConfirmAction("reject")}
          isProcessing={isChangingStatus}
        />
      ) : null}

      {selectedCreator && confirmAction ? (
        <ConfirmActionDialog
          variant={confirmAction}
          creatorName={getFullName(selectedCreator?.creator || {})}
          isProcessing={isChangingStatus}
          onCancel={() => setConfirmAction(null)}
          onConfirm={confirmAction === "accept" ? handleAccept : handleReject}
          rejectTitle="Reject Proposal"
        />
      ) : null}
    </>
  );
}
