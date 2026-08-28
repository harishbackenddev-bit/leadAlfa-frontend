// ViewAllCampaigns.jsx
import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Modal, Button as AntButton } from "antd";
import { ChevronDown, Plus, Search, SlidersHorizontal } from "lucide-react";
import BrandCampaignCard from "./BrandCampaignCard";
import {
  prefetchCampaignDetail,
  getAllBrandCampaignsQueryOptions,
  invalidateCampaigns,
} from "../../../../services/tanstack/queryService";
import { deleteCampaignByPublicId } from "../../../../services/api/apiservices";
import {
  PaginationLeftIcon,
  PaginationRightIcon,
} from "../../../../assets/SVGs/brands/customSVGs";
import {
  STATUS_TABS,
  normalizeCampaignList,
  filterCampaignsByTab,
  countCampaignsByTab,
  sortCampaigns,
  normalizePublicId,
  campaignHasApplications,
} from "../utils/campaignCardUtils";

const SORT_OPTIONS = [
  { key: "latest", label: "Latest Created" },
  { key: "oldest", label: "Oldest Created" },
  { key: "title", label: "Title A–Z" },
];

function CampaignsPagination({ total, page, perPage, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pages = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (page <= 3) {
    for (let i = 1; i <= maxVisible; i++) pages.push(i);
  } else if (page >= totalPages - 2) {
    for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) pages.push(i);
  } else {
    for (let i = page - 2; i <= page + 2; i++) pages.push(i);
  }

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 border-t border-gray-100 py-6">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          page === 1
            ? "cursor-not-allowed text-gray-300"
            : "text-gray-500 hover:bg-gray-100"
        }`}
      >
        <PaginationLeftIcon />
      </button>

      {pages.map((p) => (
        <button
          key={p}
          type="button"
          onClick={() => onChange(p)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            page === p
              ? "bg-[#1E84D6] text-white"
              : "border border-gray-200 text-gray-600 hover:bg-gray-100"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          page === totalPages
            ? "cursor-not-allowed text-gray-300"
            : "text-gray-500 hover:bg-gray-100"
        }`}
      >
        <PaginationRightIcon />
      </button>
    </div>
  );
}

const ViewAllCampaigns = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [sortKey, setSortKey] = useState("latest");
  const [sortOpen, setSortOpen] = useState(false);
  const [actionBlockedModal, setActionBlockedModal] = useState(null);
  const itemsPerPage = 9;

  const {
    data: allApiCampaigns = [],
    isLoading,
    isError,
    error,
  } = useQuery(getAllBrandCampaignsQueryOptions());

  // ========== FIX: Handle response structure ==========
  const normalizedCampaigns = useMemo(() => {
    // If allApiCampaigns has a data property with campaigns
    let campaigns = [];
    
    if (allApiCampaigns?.data?.campaigns) {
      campaigns = allApiCampaigns.data.campaigns;
    } else if (allApiCampaigns?.campaigns) {
      campaigns = allApiCampaigns.campaigns;
    } else if (Array.isArray(allApiCampaigns)) {
      campaigns = allApiCampaigns;
    } else if (allApiCampaigns?.data && Array.isArray(allApiCampaigns.data)) {
      campaigns = allApiCampaigns.data;
    }
    
    console.log('📊 Campaigns extracted:', campaigns);
    console.log('📊 Campaigns count:', campaigns.length);
    
    return normalizeCampaignList(campaigns);
  }, [allApiCampaigns]);
  // ================================================

  const tabCounts = useMemo(
    () => countCampaignsByTab(normalizedCampaigns),
    [normalizedCampaigns]
  );

  const filteredCampaigns = useMemo(() => {
    let list = filterCampaignsByTab(normalizedCampaigns, activeTab);

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      list = list.filter((campaign) => {
        const title = campaign.title || "";
        const id = campaign.displayId || "";
        return (
          title.toLowerCase().includes(term) ||
          id.toLowerCase().includes(term)
        );
      });
    }

    return sortCampaigns(list, sortKey);
  }, [normalizedCampaigns, activeTab, searchTerm, sortKey]);

  const paginatedCampaigns = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredCampaigns.slice(start, start + itemsPerPage);
  }, [filteredCampaigns, currentPage, itemsPerPage]);

  const totalForPagination = filteredCampaigns.length;

  const hoverTimerRef = useRef(null);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  const handleTabChange = useCallback((tabKey) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
  }, []);

  const handleCreateCampaign = useCallback(() => {
    navigate("/brand/campaigns/create");
  }, [navigate]);

  const handleViewCampaign = useCallback(
    (campaign) => {
      const id = normalizePublicId(campaign.publicId);
      navigate(`/brand/campaigns/${id}/view?tab=overview`);
    },
    [navigate]
  );

  const handleViewCreators = useCallback(
    (campaign) => {
      const id = normalizePublicId(campaign.publicId);
      navigate(`/brand/campaigns/${id}/view?tab=creators`);
    },
    [navigate]
  );

  const handleViewAssets = useCallback(
    (campaign) => {
      const id = normalizePublicId(campaign.publicId);
      navigate(`/brand/campaigns/${id}/view?tab=approved-assets`);
    },
    [navigate]
  );

  const handleCardHover = useCallback((campaign) => {
    const id = normalizePublicId(campaign.publicId);
    if (!id) return;
    if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    hoverTimerRef.current = setTimeout(() => {
      prefetchCampaignDetail(id).catch(() => {});
      hoverTimerRef.current = null;
    }, 800);
  }, []);

  const handleAction = useCallback(
    async (actionKey, campaign) => {
      if (!campaign) return;
      const identifier = campaign.publicId || campaign.id;

      switch (actionKey) {
        case "view":
          navigate(`/brand/campaigns/${identifier}/view`);
          break;
        case "edit":
          if (campaignHasApplications(campaign)) {
            setActionBlockedModal({
              title: "Cannot edit campaign",
              message:
                "This campaign cannot be edited because applications have already been received.",
            });
            break;
          }
          navigate("/brand/campaigns/edit", {
            state: { campaignId: identifier },
          });
          break;
        case "delete": {
          const statusNorm = String(campaign?.status ?? "").toLowerCase();
          if (statusNorm !== "closed") {
            setActionBlockedModal({
              title: "Cannot delete campaign",
              message:
                "This campaign's status is not closed. Only closed campaigns can be deleted.",
            });
            break;
          }
          if (!campaign?.publicId) {
            alert("Public campaign ID is missing. Cannot delete this campaign.");
            break;
          }
          if (!window.confirm(`Delete campaign ${campaign.publicId}?`)) {
            break;
          }
          try {
            await deleteCampaignByPublicId(campaign.publicId);
            await invalidateCampaigns();
            alert("Campaign deleted successfully.");
          } catch (deleteError) {
            alert(deleteError?.message || "Failed to delete campaign.");
          }
          break;
        }
        default:
          break;
      }
    },
    [navigate]
  );

  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
    };
  }, []);

  const sortLabel =
    SORT_OPTIONS.find((o) => o.key === sortKey)?.label ?? "Latest Created";

  // ========== DEBUG: Log campaigns ==========
  useEffect(() => {
    console.log('📊 normalizedCampaigns:', normalizedCampaigns);
    console.log('📊 filteredCampaigns:', filteredCampaigns);
    console.log('📊 paginatedCampaigns:', paginatedCampaigns);
  }, [normalizedCampaigns, filteredCampaigns, paginatedCampaigns]);
  // ========================================

  return (
    <>
      <Modal
        title={actionBlockedModal?.title}
        open={Boolean(actionBlockedModal)}
        onCancel={() => setActionBlockedModal(null)}
        footer={[
          <AntButton
            key="ok"
            type="primary"
            onClick={() => setActionBlockedModal(null)}
          >
            OK
          </AntButton>,
        ]}
        destroyOnClose
      >
        <p className="text-gray-700">{actionBlockedModal?.message}</p>
      </Modal>

      <div className="w-full min-w-0 bg-gray-50 font-sans">
        <div className="mx-auto w-full min-w-0 space-y-5 p-4 md:p-7">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h1 className="text-2xl font-semibold text-gray-900 md:text-[28px] md:leading-tight">
                Campaigns
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage all active, draft, completed, and archived UGC campaigns.
              </p>
            </div>

            <button
              type="button"
              onClick={handleCreateCampaign}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg btn-gradient px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(30,96,219,0.35)] sm:w-auto lg:shrink-0"
            >
              <Plus className="h-4 w-4" />
              Create Campaign
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative min-w-0 flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search campaigns..."
                className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-gray-900 focus:border-[#1E60DB] focus:outline-none focus:ring-1 focus:ring-[#1E60DB]/20"
              />
            </div>

            <div className="relative shrink-0">
              <button
                type="button"
                onClick={() => setSortOpen((open) => !open)}
                className="inline-flex w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm hover:bg-gray-50 sm:w-auto sm:min-w-[180px]"
              >
                <span className="inline-flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-gray-400" />
                  {sortLabel}
                </span>
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </button>
              {sortOpen ? (
                <>
                  <button
                    type="button"
                    className="fixed inset-0 z-10 cursor-default"
                    aria-label="Close sort menu"
                    onClick={() => setSortOpen(false)}
                  />
                  <ul className="absolute right-0 z-20 mt-1 w-full min-w-[180px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg sm:w-auto">
                    {SORT_OPTIONS.map((option) => (
                      <li key={option.key}>
                        <button
                          type="button"
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                            sortKey === option.key
                              ? "font-medium text-[#1E60DB]"
                              : "text-gray-700"
                          }`}
                          onClick={() => {
                            setSortKey(option.key);
                            setSortOpen(false);
                          }}
                        >
                          {option.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
            </div>
          </div>

          <div className="overflow-x-auto border-b border-gray-200 pb-px">
            <div className="flex min-w-max items-center gap-1 sm:gap-6">
              {STATUS_TABS.map((tab) => {
                const count = tabCounts[tab.key];
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleTabChange(tab.key)}
                    className={`inline-flex items-center gap-1.5 whitespace-nowrap border-b-2 px-1 pb-3 text-sm transition-colors ${
                      isActive
                        ? "border-[#1E60DB] font-medium text-[#1E60DB]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                    {count > 0 ? (
                      <span
                        className={`rounded-full px-1.5 py-0.5 text-xs ${
                          isActive
                            ? "bg-[#1E60DB]/10 text-[#1E60DB]"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {count}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>

          {isError ? (
            <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error?.message || "Failed to load campaigns"}
            </div>
          ) : null}

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-xl border border-gray-200 bg-white"
                />
              ))}
            </div>
          ) : paginatedCampaigns.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-gray-200 bg-white px-6 py-16 text-center">
              <div className="mb-4 text-5xl">📭</div>
              <h3 className="text-lg font-semibold text-gray-900">
                No Campaigns Yet
              </h3>
              <p className="mt-2 max-w-md text-sm text-gray-500">
                You don&apos;t have any campaigns to show right now. Create a
                campaign to get started.
              </p>
              <button
                type="button"
                onClick={handleCreateCampaign}
                className="mt-6 rounded-full bg-[#1E60DB] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#1850c4]"
              >
                Create Campaign
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {paginatedCampaigns.map((campaign) => (
                <div
                  key={campaign.publicId || campaign.displayId}
                  onMouseEnter={() => handleCardHover(campaign)}
                >
                  <BrandCampaignCard
                    campaign={campaign}
                    onViewCampaign={handleViewCampaign}
                    onViewCreators={handleViewCreators}
                    onViewAssets={handleViewAssets}
                    onAction={handleAction}
                  />
                </div>
              ))}

              <CampaignsPagination
                total={totalForPagination}
                page={currentPage}
                perPage={itemsPerPage}
                onChange={handlePageChange}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ViewAllCampaigns;