import { useQuery } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";
import {
  getCampaignsQueryOptions,
  getCampaignByIdQueryOptions,
  getHasCampaignsQueryOptions,
} from "../../../../services/tanstack/queryService";

/**
 * Custom hook for managing campaign views with TanStack Query
 * Handles data fetching, filtering, pagination with proper memoization
 *
 * @param {Object} options - Hook configuration options
 * @param {string} options.status - Campaign status filter ('active', 'inactive', 'closed', or null for all)
 * @param {number} options.page - Current page number (1-indexed)
 * @param {number} options.itemsPerPage - Number of items per page
 * @returns {Object} Campaign data and pagination utilities
 */
export const useViewCampaigns = ({
  status = null,
  page = 1,
  itemsPerPage = 9,
} = {}) => {
  // Fetch campaigns using React Query with factory options
  const {
    data: response,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
    isRefetching,
  } = useQuery(
    getCampaignsQueryOptions({
      status,
      page,
      limit: itemsPerPage,
    })
  );

  // Extract campaigns array from response
  const allCampaigns = useMemo(() => {
    if (!response) return [];
    return response?.campaigns || [];
  }, [response]);

  const paginationData = useMemo(() => {
    const totalItems = response?.pagination?.totalItems ?? allCampaigns.length;
    const totalPages = response?.pagination?.totalPages ?? 1;
    const currentPage = response?.pagination?.currentPage ?? page;

    return {
      campaigns: allCampaigns,
      totalItems,
      totalPages,
      currentPage,
      startIndex: (currentPage - 1) * itemsPerPage,
      endIndex: Math.min(currentPage * itemsPerPage, totalItems),
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [response, allCampaigns, page, itemsPerPage]);

  // Get campaigns by tab name (memoized callback)
  const getCampaignsByTab = useCallback(() => allCampaigns, [allCampaigns]);

  // Get campaign counts by status (memoized)
  const campaignCounts = useMemo(() => {
    return {
      active: 0,
      inactive: 0,
      closed: 0,
      all: paginationData.totalItems,
    };
  }, [paginationData.totalItems]);

  // Refetch handler (memoized callback)
  const handleRefetch = useCallback(() => {
    return refetch();
  }, [refetch]);

  // Check if campaigns exist
  const hasCampaigns = useMemo(() => allCampaigns.length > 0, [allCampaigns]);

  return {
    // Data
    campaigns: paginationData.campaigns,
    allCampaigns,

    // Pagination
    pagination: {
      currentPage: paginationData.currentPage,
      totalPages: paginationData.totalPages,
      totalItems: paginationData.totalItems,
      itemsPerPage,
      startIndex: paginationData.startIndex,
      endIndex: paginationData.endIndex,
      hasNextPage: paginationData.hasNextPage,
      hasPreviousPage: paginationData.hasPreviousPage,
    },

    // Loading states
    isLoading,
    isFetching,
    isRefetching,

    // Error states
    isError,
    error,

    // Utility functions
    getCampaignsByTab,
    campaignCounts,
    refetch: handleRefetch,
    hasCampaigns,
  };
};

/**
 * Hook to get a single campaign by ID
 * @param {string} campaignId - Campaign ID
 */
export const useCampaign = (campaignId) => {
  return useQuery(getCampaignByIdQueryOptions(campaignId));
};

/**
 * Hook to check if any campaigns exist
 * Lightweight check for conditional rendering
 */
export const useHasCampaigns = () => {
  const { data: response, isLoading } = useQuery(getHasCampaignsQueryOptions());

  const hasCampaigns = useMemo(() => {
    if (!response) return false;
    const campaigns = Array.isArray(response)
      ? response
      : response?.campaigns || [];
    return campaigns.length > 0;
  }, [response]);

  return { hasCampaigns, isLoading };
};
