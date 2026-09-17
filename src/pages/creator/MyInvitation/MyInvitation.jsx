import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import InvitationGridCard from "./components/InvitationGridCard";
import AcceptInvitationModal from "./components/AcceptInvitationModal";
import DeclineInvitationModal from "./components/DeclineInvitationModal";
import {
  acceptCreatorInvitationMutation,
  declineCreatorInvitationMutation,
  getCreatorInvitationsQueryOptions,
} from "../../../services/tanstack/queryService";
import { useNotification } from "../../../context/NotificationContext";
import {
  mapCreatorInvitationToCard,
  parseApiError,
} from "../../brand/creators/invitationsMapper";

const ITEMS_PER_PAGE = 8;

const FILTER_OPTIONS = ["All", "Pending", "Accepted", "Declined"];
const FILTER_TO_API_STATUS = {
  All: undefined,
  Pending: "pending",
  Accepted: "accepted",
  Declined: "declined",
};

export default function MyInvitation() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [acceptTarget, setAcceptTarget] = useState(null);
  const [declineTarget, setDeclineTarget] = useState(null);

  const apiStatus = FILTER_TO_API_STATUS[selectedFilter];

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
  } = useQuery(
    getCreatorInvitationsQueryOptions({
      status: apiStatus,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    })
  );

  const invitations = useMemo(() => {
    const list = response?.invitations || [];
    return list.map(mapCreatorInvitationToCard);
  }, [response]);

  const filteredInvitations = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return invitations;
    return invitations.filter((inv) =>
      [inv.title, inv.brandName, inv.campaignName, inv.description]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [invitations, searchQuery]);

  const pagination = response?.pagination || {
    totalItems: invitations.length,
    totalPages: 1,
    currentPage: 1,
  };
  const totalPages = Math.max(1, pagination.totalPages || 1);

  /* -------------------- mutations -------------------- */
  const { mutate: acceptInvite, isPending: isAccepting } = useMutation({
    ...acceptCreatorInvitationMutation(),
    onSuccess: (data, publicId) => {
      const campaignPublicId =
        data?.invitation?.campaignPublicId || data?.campaignPublicId || null;
      showNotification({
        type: "success",
        message: "Invitation accepted",
        description: campaignPublicId
          ? "Redirecting you to the campaign application form..."
          : "You can now apply to the campaign.",
      });
      setAcceptTarget(null);
      if (campaignPublicId) {
        setTimeout(() => {
          navigate(`/creator/campaigns/${campaignPublicId}/apply`);
        }, 400);
      }
    },
    onError: (error) => {
      showNotification({
        type: "error",
        message: "Could not accept invitation",
        description: parseApiError(error, "Please try again later."),
      });
    },
  });

  const { mutate: declineInvite, isPending: isDeclining } = useMutation({
    ...declineCreatorInvitationMutation(),
    onSuccess: () => {
      showNotification({
        type: "success",
        message: "Invitation declined",
        description: "The invitation has been removed from your list.",
      });
      setDeclineTarget(null);
    },
    onError: (error) => {
      showNotification({
        type: "error",
        message: "Could not decline invitation",
        description: parseApiError(error, "Please try again later."),
      });
    },
  });

  /* -------------------- handlers -------------------- */
  const handleAcceptConfirm = (invitation) => {
    if (!invitation?.publicId) return;
    acceptInvite(invitation.publicId);
  };

  const handleDeclineConfirm = (invitation) => {
    if (!invitation?.publicId) return;
    declineInvite(invitation.publicId);
  };

  const handleViewDetails = (publicId) => {
    if (!publicId) return;
    navigate(`/creator/invitations/${publicId}`);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          type="button"
          onClick={() => setCurrentPage(i)}
          className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium sm:h-9 sm:w-9 ${
            currentPage === i
              ? "bg-[var(--site-color-primary)] text-white shadow-sm"
              : "border border-gray-300 bg-white text-[#0c7bb3] hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const showLoading = isLoading || (isFetching && invitations.length === 0);

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="mx-auto max-w-[1920px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              My Invitations
            </h1>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              Review and respond to brand invitations
            </p>
          </div>

          <div className="relative flex flex-1 gap-2 sm:max-w-md sm:gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search invitations..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                }}
                className="w-full rounded-3xl border border-gray-300 bg-white px-3 py-2 !pl-10 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#4A7FFF] sm:px-4 sm:py-2.5"
              />
              <svg
                className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 sm:h-5 sm:w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="relative flex items-center gap-1.5 rounded-3xl border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:gap-2 sm:px-4 sm:py-2.5"
              >
                {selectedFilter}
                <svg
                  className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
                {selectedFilter !== "All" && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                    1
                  </span>
                )}
              </button>

              {showFilters && (
                <div className="absolute right-0 z-20 mt-2 w-40 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                  {FILTER_OPTIONS.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => {
                        setSelectedFilter(filter);
                        setCurrentPage(1);
                        setShowFilters(false);
                      }}
                      className={`w-full border-b border-gray-100 px-4 py-3 text-left text-sm font-medium last:border-b-0 hover:bg-gray-50 ${
                        selectedFilter === filter
                          ? "bg-blue-50 text-[#0c7bb3]"
                          : "text-gray-700"
                      }`}
                    >
                      {filter}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {showLoading ? (
          <div className="flex items-center justify-center rounded-xl border border-gray-200 bg-white py-16">
            <div className="inline-block h-10 w-10 animate-spin rounded-full border-b-2 border-[#0c7bb3]" />
          </div>
        ) : isError ? (
          <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
            <p className="text-sm text-gray-600">
              Failed to load invitations. Please refresh.
            </p>
          </div>
        ) : filteredInvitations.length > 0 ? (
          <div className="mb-8 grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
            {filteredInvitations.map((invitation) => (
              <InvitationGridCard
                key={invitation.publicId || invitation.id}
                invitation={invitation}
                onAccept={setAcceptTarget}
                onDecline={setDeclineTarget}
                onViewDetails={handleViewDetails}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
            <p className="text-sm text-gray-500">
              No active invitations. Your profile is active and brands will
              contact you when a campaign fits your profile.
            </p>
          </div>
        )}

        {filteredInvitations.length > 0 && totalPages > 1 && (
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 disabled:opacity-40 sm:h-9 sm:w-9"
              aria-label="Previous page"
            >
              ‹
            </button>
            <div className="flex gap-1.5">{renderPageNumbers()}</div>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 disabled:opacity-40 sm:h-9 sm:w-9"
              aria-label="Next page"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {acceptTarget ? (
        <AcceptInvitationModal
          invitation={acceptTarget}
          isProcessing={isAccepting}
          onClose={() => (isAccepting ? null : setAcceptTarget(null))}
          onConfirm={handleAcceptConfirm}
        />
      ) : null}

      {declineTarget ? (
        <DeclineInvitationModal
          invitation={declineTarget}
          isProcessing={isDeclining}
          onClose={() => (isDeclining ? null : setDeclineTarget(null))}
          onConfirm={handleDeclineConfirm}
        />
      ) : null}
    </div>
  );
}
