import React, { useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown, Search } from "lucide-react";
import { PaginationLeftIcon, PaginationRightIcon } from "../../../../../assets/SVGs/brands/customSVGs";
import { getCampaignApprovedAssetsQueryOptions } from "../../../../../services/tanstack/queryService";
import {
  getApprovedAssetsEmptyMessage,
  mapApiApprovedAsset,
  parseApprovedAssetsResponse,
  SORT_OPTIONS,
  USAGE_TYPE_FILTERS,
} from "../../utils/approvedAssetsUtils";
import {
  ApprovedAssetGridCard,
  ApprovedAssetListRow,
  ViewToggle,
} from "./approvedAssets/ApprovedAssetViews";
import ErrorState from "../../../../../components/common/ErrorState";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 400;

function ApprovedAssetsPagination({ totalPages, currentPage, onChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;

  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (currentPage <= 3) {
    for (let i = 1; i <= maxVisible; i++) pages.push(i);
  } else if (currentPage >= totalPages - 2) {
    for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) pages.push(i);
  } else {
    for (let i = currentPage - 2; i <= currentPage + 2; i++) pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 border-t border-gray-100 py-6">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage <= 1}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          currentPage <= 1
            ? "cursor-not-allowed text-gray-300"
            : "text-gray-500 hover:bg-gray-100"
        }`}
        aria-label="Previous page"
      >
        <PaginationLeftIcon />
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onChange(page)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors ${
            currentPage === page
              ? "bg-[#1E84D6] text-white"
              : "border border-gray-200 text-gray-600 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage >= totalPages}
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
          currentPage >= totalPages
            ? "cursor-not-allowed text-gray-300"
            : "text-gray-500 hover:bg-gray-100"
        }`}
        aria-label="Next page"
      >
        <PaginationRightIcon />
      </button>
    </div>
  );
}

export default function ApprovedAssetsTab({ campaignPublicId }) {
  const [view, setView] = useState("grid");
  const [page, setPage] = useState(1);
  const [usageTypeFilter, setUsageTypeFilter] = useState("all");
  const [sort, setSort] = useState("uploadedAt");
  const [sortOpen, setSortOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const hasCampaignPublicId = Boolean(campaignPublicId);
  const activeUsageType =
    usageTypeFilter === "all" ? undefined : usageTypeFilter;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [usageTypeFilter, sort, debouncedSearch]);

  const {
    data: response,
    isLoading,
    isError,
    error,
    isFetching,
  } = useQuery({
    ...getCampaignApprovedAssetsQueryOptions(campaignPublicId, {
      page,
      limit: PAGE_SIZE,
      usageType: activeUsageType,
      sort,
      search: debouncedSearch || undefined,
    }),
    enabled: hasCampaignPublicId,
  });

  const { assets, pagination } = useMemo(() => {
    const parsed = parseApprovedAssetsResponse(response);
    return {
      assets: parsed.assets.map(mapApiApprovedAsset),
      pagination: parsed.pagination,
    };
  }, [response]);

  const sortLabel =
    SORT_OPTIONS.find((option) => option.key === sort)?.label || "Uploaded Date";

  const emptyMessage = getApprovedAssetsEmptyMessage({
    usageType: activeUsageType,
    search: debouncedSearch,
  });

  if (!hasCampaignPublicId) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
        Campaign not found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {USAGE_TYPE_FILTERS.map((filter) => {
          const isActive = filter.key === usageTypeFilter;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setUsageTypeFilter(filter.key)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                isActive
                  ? "bg-[#1E60DB] text-white"
                  : "border border-gray-200 bg-white text-gray-600 hover:border-gray-300"
              }`}
            >
              {filter.label}
            </button>
          );
        })}
      </div>

      <div className="hidden flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative min-w-0 flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Search by asset name..."
            maxLength={100}
            className="w-full rounded-lg border border-gray-200 py-2.5 pl-10 pr-3 text-sm text-gray-900 focus:border-[#1E60DB] focus:outline-none focus:ring-1 focus:ring-[#1E60DB]/20"
          />
        </div>

        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setSortOpen((open) => !open)}
            className="inline-flex w-full items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm hover:bg-gray-50 sm:w-auto sm:min-w-[180px]"
          >
            <span>Sort by: {sortLabel}</span>
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
                      onClick={() => {
                        setSort(option.key);
                        setSortOpen(false);
                      }}
                      className={`block w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                        sort === option.key
                          ? "font-medium text-[#1E60DB]"
                          : "text-gray-700"
                      }`}
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

      <div className="flex gap-3 flex-row items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          {pagination.totalItems} approved asset
          {pagination.totalItems === 1 ? "" : "s"}
          {isFetching && !isLoading ? (
            <span className="ml-2 text-xs font-normal text-gray-400">
              Updating...
            </span>
          ) : null}
        </p>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
          Loading approved assets...
        </div>
      ) : isError ? (
        <ErrorState
          variant="card"
          type="server"
          title="Failed to Load Approved Assets"
          description={error?.message || "We couldn't load the approved assets for this campaign. Please try again."}
          onRetry={() => window.location.reload()}
        />
      ) : assets.length === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
          {emptyMessage}
        </div>
      ) : view === "grid" ? (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 xl:grid-cols-3">
            {assets.map((asset) => (
              <ApprovedAssetGridCard key={asset.id} asset={asset} />
            ))}
          </div>
          <ApprovedAssetsPagination
            totalPages={pagination.totalPages}
            currentPage={pagination.currentPage}
            onChange={setPage}
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          {assets.map((asset, index) => (
            <ApprovedAssetListRow
              key={asset.id}
              asset={asset}
              isLast={index === assets.length - 1}
            />
          ))}
          <ApprovedAssetsPagination
            totalPages={pagination.totalPages}
            currentPage={pagination.currentPage}
            onChange={setPage}
          />
        </div>
      )}
    </div>
  );
}
