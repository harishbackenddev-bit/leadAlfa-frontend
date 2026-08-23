import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getMyJobsQueryOptions } from "../../../../services/tanstack/queryService";

const ACCEPTED_STATUSES = new Set([
  "accepted",
  "active",
  "ongoing",
  "in_review",
  "under_review",
  "completed",
]);

const addIdVariants = (set, value) => {
  if (value == null || value === "") return;
  set.add(Number(value));
  set.add(String(value));
};

/**
 * Returns the set of campaign IDs the current creator has already applied to,
 * plus a separate set for campaigns whose application has been accepted (or
 * progressed beyond pending).
 *
 * Backed by the cached my-jobs query (`/campaign-applications/my-applications`).
 *
 * Usage:
 *   const { hasApplied, isAccepted } = useAppliedCampaigns();
 *   hasApplied(campaign.id)  // → applied OR accepted
 *   isAccepted(campaign.id)  // → only when application is past pending
 */
export default function useAppliedCampaigns() {
  const { data, isLoading } = useQuery(
    getMyJobsQueryOptions({ page: 1, limit: 100 })
  );

  const jobs = data?.jobs || [];

  const { appliedIds, acceptedIds } = useMemo(() => {
    const applied = new Set();
    const accepted = new Set();

    jobs.forEach((job) => {
      const c = job?.campaign || {};
      const status = String(job?.status || "").toLowerCase();
      const target = ACCEPTED_STATUSES.has(status) ? accepted : applied;

      addIdVariants(applied, c?.id);
      addIdVariants(applied, c?.publicId);
      addIdVariants(applied, job?.campaignId);

      if (target === accepted) {
        addIdVariants(accepted, c?.id);
        addIdVariants(accepted, c?.publicId);
        addIdVariants(accepted, job?.campaignId);
      }
    });

    if (import.meta.env.DEV) {
      console.debug(
        "[useAppliedCampaigns] applied:",
        Array.from(applied),
        "accepted:",
        Array.from(accepted)
      );
    }

    return { appliedIds: applied, acceptedIds: accepted };
  }, [jobs]);

  const matches = (set, identifier) => {
    if (identifier == null) return false;
    return (
      set.has(Number(identifier)) || set.has(String(identifier))
    );
  };

  return {
    appliedCampaignIds: appliedIds,
    acceptedCampaignIds: acceptedIds,
    hasApplied: (id) => matches(appliedIds, id),
    isAccepted: (id) => matches(acceptedIds, id),
    isLoading,
  };
}
