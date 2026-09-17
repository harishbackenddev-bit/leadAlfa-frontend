import { useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "../../../../services/tanstack/queryKeys";
import {
  getBrandCreatorsQueryOptions,
  getBrandCreatorByIdQueryOptions,
} from "../../../../services/tanstack/queryService";
import { mapCreatorToCard, mapCreatorToView } from "../creatorMappers";

const matchesCreatorFilters = (creator, filters = {}) => {
  const raw = creator?.raw || {};
  const province = filters.province?.trim();
  const city = filters.city?.trim();
  const industry = filters.industry?.trim();
  const minRating = filters.minRating?.trim();

  if (province && String(raw.province || "").toLowerCase() !== province.toLowerCase()) {
    return false;
  }

  if (city && String(raw.city || "").toLowerCase() !== city.toLowerCase()) {
    return false;
  }

  if (industry) {
    const normalizedIndustry = industry.toLowerCase();
    const categoryNames = (creator.categories || []).map((name) => String(name).toLowerCase());
    const nicheNames = [
      ...(raw.primaryNiches || []),
      ...(raw.secondaryNiches || []),
    ].map((name) => String(name).toLowerCase());

    const matchesIndustry =
      categoryNames.includes(normalizedIndustry) ||
      nicheNames.includes(normalizedIndustry);

    if (!matchesIndustry) return false;
  }

  if (minRating) {
    const rating = Number(raw.rating);
    const minimum = Number(minRating);
    if (!Number.isFinite(rating) || rating < minimum) return false;
  }

  return true;
};

export const useBrandCreators = ({
  page = 1,
  limit = 9,
  search = "",
  filters = {},
} = {}) => {
  const queryClient = useQueryClient();

  const {
    data: response,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery(getBrandCreatorsQueryOptions({ page, limit }));

  const creators = useMemo(() => {
    const list = Array.isArray(response?.creators) ? response.creators : [];
    return list.map(mapCreatorToCard);
  }, [response]);

  useEffect(() => {
    if (!creators.length) return;

    creators.forEach((creator) => {
      if (!creator?.id) return;
      queryClient.setQueryData(queryKeys.creator.detail(creator.id), creator.raw);
    });
  }, [creators, queryClient]);

  const industryOptions = useMemo(() => {
    const names = new Set();

    creators.forEach((creator) => {
      (creator.categories || []).forEach((name) => names.add(name));
      (creator.raw?.primaryNiches || []).forEach((name) => names.add(name));
      (creator.raw?.secondaryNiches || []).forEach((name) => names.add(name));
    });

    return Array.from(names).sort((a, b) => a.localeCompare(b));
  }, [creators]);

  const normalizedSearch = search.trim().toLowerCase();

  const filteredCreators = useMemo(() => {
    return creators.filter((creator) => {
      if (normalizedSearch) {
        const searchableText = [
          creator?.name,
          creator?.raw?.publicName,
          creator?.location,
          creator?.bio,
          creator?.raw?.city,
          creator?.raw?.province,
          ...(creator?.skills || []),
          ...(creator?.categories || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(normalizedSearch)) return false;
      }

      return matchesCreatorFilters(creator, filters);
    });
  }, [creators, normalizedSearch, filters]);

  return {
    creators: filteredCreators,
    industryOptions,
    pagination: {
      currentPage: response?.currentPage || page,
      totalPages: response?.totalPages || 1,
      totalCount: response?.totalCount || 0,
      perPage: limit,
    },
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
};

export const useBrandCreatorById = (creatorId) => {
  const {
    data: creator,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery(getBrandCreatorByIdQueryOptions(creatorId));

  const mappedCreator = useMemo(() => {
    if (!creator) return null;
    return mapCreatorToView(creator);
  }, [creator]);

  return {
    creator: mappedCreator,
    isLoading,
    isError,
    error,
    refetch,
  };
};
