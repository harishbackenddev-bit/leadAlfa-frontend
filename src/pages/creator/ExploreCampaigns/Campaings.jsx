import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ExploreCampaignGridCard from "./components/ExploreCampaignGridCard";
import { getActiveCampaigns } from "../../../services/api/apiservices";
import {
  filterGridCampaigns,
  mapCampaignToGridCard,
} from "../../../utils/creatorCampaignMappers";
import useAppliedCampaigns from "./hooks/useAppliedCampaigns";

const ITEMS_PER_PAGE = 8;

const niches = ["Fashion", "Technology", "Lifestyle", "Beauty"];
const categories = [
  "Photography",
  "Review",
  "Collaboration",
  "Content Creation",
  "Partnership",
  "Video Production",
];

export default function Campaigns() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedNiches, setSelectedNiches] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { hasApplied } = useAppliedCampaigns();

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const response = await getActiveCampaigns();
        setCampaigns(response.campaigns || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching campaigns:", err);
        setError("Failed to load campaigns. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchCampaigns();
  }, []);

  const toggleNiche = (niche) => {
    setSelectedNiches((prev) =>
      prev.includes(niche) ? prev.filter((n) => n !== niche) : [...prev, niche]
    );
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const clearAllFilters = () => {
    setSelectedNiches([]);
    setSelectedCategories([]);
    setShowFilters(false);
  };

  const applyFilters = () => {
    setShowFilters(false);
    setCurrentPage(1);
  };

  const allCampaigns = useMemo(
    () => campaigns.map(mapCampaignToGridCard),
    [campaigns]
  );

  const filteredCampaigns = useMemo(() => {
    // Hide every campaign the creator has already applied to (pending or
    // beyond) — they live in My Jobs now and shouldn't reappear in Explore.
    let result = allCampaigns.filter((c) => !hasApplied(c.id));
    result = filterGridCampaigns(result, searchQuery);

    if (selectedNiches.length > 0) {
      result = result.filter((campaign) =>
        campaign.tags.some((tag) =>
          selectedNiches.some((niche) =>
            tag.toLowerCase().includes(niche.toLowerCase())
          )
        )
      );
    }

    if (selectedCategories.length > 0) {
      result = result.filter((campaign) =>
        campaign.tags.some((tag) =>
          selectedCategories.some((category) =>
            tag.toLowerCase().includes(category.toLowerCase())
          )
        )
      );
    }

    return result;
  }, [allCampaigns, searchQuery, selectedNiches, selectedCategories, hasApplied]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedNiches, selectedCategories]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCampaigns.length / ITEMS_PER_PAGE)
  );
  const indexOfLastCampaign = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstCampaign = indexOfLastCampaign - ITEMS_PER_PAGE;
  const currentCampaigns = filteredCampaigns.slice(
    indexOfFirstCampaign,
    indexOfLastCampaign
  );

  const handleApplyNow = (campaignId) => {
    navigate(`/creator/campaigns/${campaignId}/apply`);
  };

  const handleViewDetails = (campaignId) => {
    navigate(`/creator/campaigns/${campaignId}`);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          type="button"
          onClick={() => setCurrentPage(i)}
          className={`flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-all sm:h-9 sm:w-9 ${
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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="mt-4 text-gray-600">Loading campaigns...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      <div className="mx-auto max-w-[1920px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 sm:text-2xl">
              Explore Campaigns
            </h1>
            <p className="mt-1 text-sm text-gray-500 sm:text-base">
              Explore campaigns and hire as per your convenience
            </p>
          </div>

          <div className="relative flex flex-1 gap-2 sm:max-w-md sm:gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search campaigns by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 !pl-10 text-sm transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#4A7FFF] sm:px-4 sm:py-2.5"
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
                className="main-btn btn-gradient relative flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors sm:gap-2 sm:px-4 sm:py-2.5"
                aria-label="Filter campaigns"
              >
                <svg
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                {(selectedNiches.length > 0 ||
                  selectedCategories.length > 0) && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                    {selectedNiches.length + selectedCategories.length}
                  </span>
                )}
              </button>

              {showFilters && (
                <div className="animate-slideDown absolute right-0 z-20 -mr-4 mt-2 w-screen max-w-xs overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl sm:mr-0 sm:max-w-md">
                  <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3 sm:px-6 sm:py-4">
                    <h2 className="text-base font-bold tracking-tight text-gray-900 sm:text-lg">
                      Filters
                    </h2>
                    <button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      className="rounded-full p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 sm:p-1.5"
                      aria-label="Close filters"
                    >
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="px-4 py-4 sm:px-6 sm:py-6">
                    <div className="space-y-4 sm:space-y-6">
                      <div>
                        <h3 className="mb-3 text-sm font-bold text-gray-900 sm:mb-4 sm:text-base">
                          Niche
                        </h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {niches.map((niche) => (
                            <button
                              key={niche}
                              type="button"
                              onClick={() => toggleNiche(niche)}
                              className={`rounded-full border px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:py-2.5 sm:text-sm ${
                                selectedNiches.includes(niche)
                                  ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                  : "border-gray-300 bg-white text-gray-700 hover:border-blue-600 hover:text-[#0c7bb3]"
                              }`}
                            >
                              {niche}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="mb-3 text-sm font-bold text-gray-900 sm:mb-4 sm:text-base">
                          Category
                        </h3>
                        <div className="flex flex-wrap gap-2 sm:gap-3">
                          {categories.map((category) => (
                            <button
                              key={category}
                              type="button"
                              onClick={() => toggleCategory(category)}
                              className={`whitespace-nowrap rounded-full border px-3 py-2 text-xs font-medium transition-all sm:px-4 sm:py-2.5 sm:text-sm ${
                                selectedCategories.includes(category)
                                  ? "border-blue-600 bg-blue-600 text-white shadow-sm"
                                  : "border-gray-300 bg-white text-gray-700 hover:border-blue-600 hover:text-[#0c7bb3]"
                              }`}
                            >
                              {category}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 border-t border-gray-100 bg-gray-50 px-4 py-3 sm:flex-row sm:gap-3 sm:px-6 sm:py-4">
                    <button
                      type="button"
                      onClick={clearAllFilters}
                      className="sec-btn w-full rounded-full px-4 py-2 text-xs font-semibold transition-colors hover:bg-gray-200 sm:w-auto sm:px-6 sm:py-2.5 sm:text-sm"
                    >
                      Clear All
                    </button>
                    <button
                      type="button"
                      onClick={applyFilters}
                      className="main-btn btn-gradient w-full rounded-full px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors sm:flex-1 sm:px-6 sm:py-2.5 sm:text-sm"
                    >
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {filteredCampaigns.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white py-12 text-center">
            <p className="text-sm text-gray-500">
              No active campaigns available at the moment.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
              {currentCampaigns.map((campaign) => (
                <ExploreCampaignGridCard
                  key={campaign.id}
                  campaign={campaign}
                  onApplyClick={handleApplyNow}
                  onViewDetailsClick={handleViewDetails}
                  isApplied={hasApplied(campaign.id)}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 sm:gap-2">
                <button
                  type="button"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition-all hover:border hover:border-gray-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
                  aria-label="Previous page"
                >
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <div className="flex gap-1.5 sm:gap-2">{renderPageNumbers()}</div>
                <button
                  type="button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-gray-600 transition-all hover:border hover:border-gray-300 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 sm:h-9 sm:w-9"
                  aria-label="Next page"
                >
                  <svg
                    className="h-4 w-4 sm:h-5 sm:w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
