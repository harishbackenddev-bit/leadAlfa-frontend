import React, { useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Button } from "../../../../../components/ui/button";
import { getCampaignActivityInfiniteQueryOptions } from "../../../../../services/tanstack/queryService";
import {
  ACTIVITY_FILTERS,
  mapActivityEntry,
  parseActivityResponse,
} from "../../utils/activityUtils";

function ActivityIcon({ icon: Icon, className }) {
  return (
    <div
      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ring-4 ring-white ${className}`}
    >
      <Icon className="h-4 w-4" strokeWidth={2} />
    </div>
  );
}

export default function CampaignActivityTab({ campaignPublicId }) {
  const [filterKey, setFilterKey] = useState("all");

  const activeFilter =
    ACTIVITY_FILTERS.find((f) => f.key === filterKey) || ACTIVITY_FILTERS[0];

  const {
    data,
    isLoading,
    isError,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    ...getCampaignActivityInfiniteQueryOptions(campaignPublicId, {
      eventType: activeFilter.eventType,
      limit: 20,
    }),
    enabled: Boolean(campaignPublicId),
  });

  const { activities, totalItems } = useMemo(() => {
    const pages = data?.pages || [];
    const items = pages.flatMap((page) => {
      const parsed = parseActivityResponse(page);
      return parsed.activity.map(mapActivityEntry);
    });
    const firstPagination = parseActivityResponse(pages[0]).pagination;
    return {
      activities: items,
      totalItems: firstPagination.totalItems ?? items.length,
    };
  }, [data]);

  if (!campaignPublicId) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
        Campaign not found.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {ACTIVITY_FILTERS.map((filter) => {
          const isActive = filter.key === filterKey;
          return (
            <button
              key={filter.key}
              type="button"
              onClick={() => setFilterKey(filter.key)}
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

      {isLoading ? (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
          Loading activity...
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
          Failed to load activity. Please try again.
        </div>
      ) : activities.length === 0 || totalItems === 0 ? (
        <div className="rounded-xl border border-gray-200 bg-white px-4 py-12 text-center text-sm text-gray-500">
          No activity yet.
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-6">
          <div className="relative">
            <div
              className="absolute bottom-4 left-[18px] top-4 w-px bg-gray-200"
              aria-hidden
            />
            <ul className="space-y-0">
              {activities.map((item, index) => (
                <li
                  key={item.id}
                  className={`relative flex gap-4 pb-6 ${
                    index === activities.length - 1 ? "pb-0" : ""
                  }`}
                >
                  <ActivityIcon
                    icon={item.icon}
                    className={item.iconClassName}
                  />
                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900">
                          {item.title}
                        </p>
                        <p className="mt-0.5 text-sm text-gray-500">
                          {item.description}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {item.actorLabel}
                        </p>
                      </div>
                      <span className="shrink-0 text-xs text-gray-400 sm:pt-0.5">
                        {item.timelineLabel}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {hasNextPage ? (
            <div className="mt-6 flex justify-center">
              <Button
                type="button"
                variant="outline"
                className="rounded-lg"
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                {isFetchingNextPage ? "Loading..." : "Load more"}
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
