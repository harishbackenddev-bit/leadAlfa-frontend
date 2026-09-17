import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MyJobGridCard from "./components/MyJobGridCard";
import PingBrandModal from "./components/PingBrandModal";
import {
  getActiveCampaignsQueryOptions,
  getMyJobsQueryOptions,
} from "../../../services/tanstack/queryService";
import {
  filterJobsByCategory,
  filterJobsBySearch,
  enrichJobWithActiveCampaign,
  findActiveCampaignForJob,
  getJobRouteId,
  mapJobToCard,
} from "./myJobsMapper";
import { MY_JOBS_FILTER_OPTIONS } from "./myJobsDummyData";
import { resolveJobPublicId } from "./workSubmissionMapper";
import {
  formatNextPingLabel,
  readStoredNextReminderAt,
} from "./reminderCooldown";
import { useNotification } from "../../../context/NotificationContext";
import { ListFilter } from 'lucide-react';

const ITEMS_PER_PAGE = 8;

/**
 * UI filter label → API `status` query value.
 * Backend uses application-status verbs ("pending" | "accepted" | "completed");
 * the mapper normalizes these into "pending" | "active" | "completed" so the
 * client-side `filterJobsByCategory` safety net catches anything the API
 * doesn't filter perfectly. "All Jobs" sends no status filter (server-side).
 */
const FILTER_TO_STATUS = {
  "All Jobs": undefined,
  "Applied Jobs": "pending",
  "On-going Jobs": "accepted",
  "Completed Jobs": "completed",
};

export default function MyJobs() {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [pingJob, setPingJob] = useState(null);
  /** jobPublicId → nextReminderAvailableAt ISO string */
  const [reminderCooldownByJob, setReminderCooldownByJob] = useState({});

  const apiStatus = selectedFilter ? FILTER_TO_STATUS[selectedFilter] : undefined;

  const {
    data: jobsResp,
    isLoading,
    isError,
    isFetching,
  } = useQuery(
    getMyJobsQueryOptions({
      page: currentPage,
      limit: ITEMS_PER_PAGE,
      status: apiStatus,
    })
  );

  const apiJobs = jobsResp?.jobs || [];
  const pagination = jobsResp?.pagination;
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);

  /**
   * `/campaign-applications/my-applications` returns a slim campaign object
   * (often without `media.coverImage`). We hydrate the cover image from
   * `/campaigns/active` so the my-jobs cards show the campaign banner
   * instead of falling back to the brand logo. Errors here are silent
   * — cards keep their existing fallback image and the page still renders.
   */
  const { data: activeCampaignsResp } = useQuery(
    getActiveCampaignsQueryOptions()
  );

  const activeCampaignsList = useMemo(
    () =>
      activeCampaignsResp?.campaigns ||
      activeCampaignsResp?.data?.campaigns ||
      [],
    [activeCampaignsResp]
  );

  const campaignCoverById = useMemo(() => {
    const map = new Map();
    activeCampaignsList.forEach((c) => {
      const cover = c?.media?.coverImage?.url;
      if (!cover) return;
      if (c?.id != null) map.set(String(c.id), cover);
      if (c?.publicId) map.set(String(c.publicId), cover);
    });
    return map;
  }, [activeCampaignsList]);

  const cards = useMemo(() => {
    const mapped = apiJobs.map((job) => {
      let card = mapJobToCard(job);
      const activeCampaign = findActiveCampaignForJob(activeCampaignsList, card);
      if (activeCampaign) {
        card = enrichJobWithActiveCampaign(card, activeCampaign);
      }
      const cover =
        (card.campaignId != null &&
          campaignCoverById.get(String(card.campaignId))) ||
        (card.campaignPublicId &&
          campaignCoverById.get(String(card.campaignPublicId)));
      if (cover) card.image = cover;

      const jobKey = resolveJobPublicId(card);
      if (jobKey) {
        card.nextReminderAvailableAt =
          reminderCooldownByJob[jobKey] ||
          readStoredNextReminderAt(jobKey)?.toISOString() ||
          card.nextReminderAvailableAt ||
          null;
      }
      return card;
    });
    const byCategory =
      !selectedFilter || selectedFilter === "All Jobs"
        ? mapped
        : filterJobsByCategory(mapped, selectedFilter);
    return filterJobsBySearch(byCategory, searchQuery);
  }, [
    apiJobs,
    campaignCoverById,
    activeCampaignsList,
    selectedFilter,
    searchQuery,
    reminderCooldownByJob,
  ]);

  const handleFilterSelect = (filter) => {
    setSelectedFilter((prev) => (prev === filter ? null : filter));
    setCurrentPage(1);
    setShowFilters(false);
  };

  const handleViewDetails = (job) => {
    navigate(`/creator/my-jobs/${getJobRouteId(job)}`);
  };

  const handleSubmitWork = (job) => {
    navigate(`/creator/my-jobs/${getJobRouteId(job)}/submit`, {
      state: { showNote: true, jobPublicId: resolveJobPublicId(job) },
    });
  };

  const handleRateReview = (job) => {
    navigate(`/creator/my-jobs/${getJobRouteId(job)}/ratings`);
  };

  const handleSubmitRevisions = (job) => {
    navigate(`/creator/my-jobs/${getJobRouteId(job)}`, {
      state: { openResubmit: true },
    });
  };

  const handlePingSend = (_message, result, jobPublicId) => {
    const nextAt = result?.nextReminderAvailableAt;
    if (jobPublicId && nextAt) {
      setReminderCooldownByJob((prev) => ({
        ...prev,
        [jobPublicId]: nextAt,
      }));
    }
    showNotification({
      type: "success",
      message: "Reminder sent",
      description:
        formatNextPingLabel(nextAt) ||
        "You can send another reminder in 24 hours.",
    });
    setPingJob(null);
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-12 text-center text-red-500">Failed to load jobs.</div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="mx-auto max-w-[1920px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              My Collabs
            </h1>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              Track and manage your active and completed jobs
            </p>
          </div>

          <div className="relative flex flex-1 gap-2 sm:max-w-md sm:gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search jobs by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 !pl-10 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#4A7FFF] sm:px-4 sm:py-2.5"
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
                className="relative flex items-center gap-1.5 whitespace-nowrap rounded-lg btn-gradient border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 sm:gap-2"
              >
                {/* <svg
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
                </svg> */}
                 <ListFilter className="w-6 h-6" />
                {selectedFilter && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                    1
                  </span>
                )}
              </button>

              {showFilters && (
                <div className="absolute right-0 z-20 mt-2 w-48 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl sm:w-52">
                  <p className="border-b border-gray-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    List of Items
                  </p>
                  {MY_JOBS_FILTER_OPTIONS.map((filter) => (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => handleFilterSelect(filter)}
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

        {cards.length > 0 ? (
          <div
            className={`mb-8 grid grid-cols-1 gap-4 transition-opacity sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 ${
              isFetching ? "opacity-70" : ""
            }`}
          >
            {cards.map((job) => (
              <MyJobGridCard
                key={job.id}
                job={job}
                onViewDetails={handleViewDetails}
                onSubmitWork={handleSubmitWork}
                onPingBrand={setPingJob}
                onRateReview={handleRateReview}
                onSubmitRevisions={handleSubmitRevisions}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
            <p className="text-sm text-gray-500">No jobs found</p>
          </div>
        )}

        {totalPages > 1 && (
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

      {pingJob ? (
        <PingBrandModal
          job={pingJob}
          jobPublicId={resolveJobPublicId(pingJob)}
          onClose={() => setPingJob(null)}
          onSend={handlePingSend}
        />
      ) : null}
    </div>
  );
}
