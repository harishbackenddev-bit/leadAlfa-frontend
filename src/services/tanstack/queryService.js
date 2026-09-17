import { queryClient } from "./queryClient";
import { queryKeys } from "./queryKeys";
import {
  getCampaigns,
  getCampaignById,
  getActiveCampaigns,
  getCreatorApplications,
  changeCreatorApplicationStatus,
  myCampaignsApplications,
  getActiveCreatorsList,
  getMyJobs,
  getCreatorJobs,
  sendCampaignInvitations,
  getBrandInvitations,
  withdrawBrandInvitation,
  getCreatorInvitations,
  getCreatorInvitationDetail,
  acceptCreatorInvitation,
  declineCreatorInvitation,
} from "../api/apiservices";
import { getWorkSubmission } from "../api/workSubmissionService";
import {
  approveSubmission,
  getCampaignApprovedAssets,
  getCampaignSubmissionStats,
  getCampaignSubmissions,
  getSubmissionDetail,
  rejectSubmission,
  requestSubmissionRevision,
} from "../api/brandWorkSubmissionService";
import { getCampaignActivity } from "../api/campaignActivityService";

/**
 * Query Option Factories
 * Centralized query configurations to avoid duplication
 */

export const getCampaignsQueryOptions = ({ status, page, limit } = {}) => ({
  queryKey: queryKeys.campaigns.list({ status, page, limit }),
  queryFn: () => getCampaigns({ status, page, limit }),
  keepPreviousData: true, // Show cached data while fetching
});

/** Fetch every campaign page so tab counts match real status values (not per-status API totals). */
export async function fetchAllBrandCampaigns() {
  const limit = 100;
  let page = 1;
  const all = [];
  let totalPages = 1;

  while (page <= totalPages) {
    const response = await getCampaigns({ page, limit });
    const batch = response?.campaigns || [];
    all.push(...batch);
    totalPages = response?.pagination?.totalPages ?? 1;
    if (batch.length === 0) break;
    page += 1;
  }

  return all;
}

export const getAllBrandCampaignsQueryOptions = ({ enabled = true } = {}) => ({
  queryKey: queryKeys.campaigns.allPages(),
  queryFn: fetchAllBrandCampaigns,
  enabled,
  staleTime: 30 * 1000,
  placeholderData: (previousData) => previousData,
});

export const getCampaignByIdQueryOptions = (campaignId) => ({
  queryKey: queryKeys.campaigns.detail(campaignId),
  queryFn: async () => {
    const response = await getCampaignById(campaignId);
    return response?.campaign ?? response;
  },
  enabled: !!campaignId,
});

/**
 * Active-campaigns list (creator-facing, used by Explore + Invitation detail).
 * Endpoint is `/campaigns/active` so it's safe for creator tokens
 * (the brand-only `/campaigns/:publicId` returns 403 for creators).
 */
export const getActiveCampaignsQueryOptions = () => ({
  queryKey: queryKeys.campaigns.active(),
  queryFn: () => getActiveCampaigns(),
  staleTime: 60 * 1000,
});

export const getHasCampaignsQueryOptions = () => ({
  queryKey: queryKeys.campaigns.lists(),
  queryFn: () => getCampaigns(),
});

export const getCreatorApplicationsQueryOptions = (campaignId) => ({
  queryKey: queryKeys.campaignApplications.byCampaign(campaignId),
  queryFn: () => getCreatorApplications(campaignId),
  enabled: !!campaignId,
});

export const getMyCampaignApplicationsQueryOptions = () => ({
  queryKey: queryKeys.creator.myApplications(),
  queryFn: () => myCampaignsApplications(),
});

export const getMyJobsQueryOptions = ({ page = 1, limit = 8, status } = {}) => ({
  queryKey: queryKeys.creator.myJobs({ page, limit, status }),
  queryFn: () => getMyJobs({ page, limit, status }),
  placeholderData: (previousData) => previousData,
  staleTime: 60 * 1000,
});

export const getCreatorJobsQueryOptions = ({ page = 1, limit = 100 } = {}) => ({
  queryKey: queryKeys.creator.jobs({ page, limit }),
  queryFn: () => getCreatorJobs({ page, limit }),
  staleTime: 60 * 1000,
});

export const getWorkSubmissionQueryOptions = (jobPublicId) => ({
  queryKey: queryKeys.creator.workSubmission(jobPublicId),
  queryFn: () => getWorkSubmission(jobPublicId),
  enabled: Boolean(jobPublicId),
  staleTime: 30 * 1000,
});

export const getCampaignSubmissionsQueryOptions = (
  campaignPublicId,
  { status, page = 1, limit = 50 } = {}
) => ({
  queryKey: queryKeys.brand.submissions.list(campaignPublicId, {
    status,
    page,
    limit,
  }),
  queryFn: () =>
    getCampaignSubmissions(campaignPublicId, { status, page, limit }),
  enabled: Boolean(campaignPublicId),
  staleTime: 30 * 1000,
});

export const getCampaignSubmissionStatsQueryOptions = (campaignPublicId) => ({
  queryKey: queryKeys.brand.submissions.stats(campaignPublicId),
  queryFn: () => getCampaignSubmissionStats(campaignPublicId),
  enabled: Boolean(campaignPublicId),
  staleTime: 30 * 1000,
});

export const getCampaignApprovedAssetsQueryOptions = (
  campaignPublicId,
  { page = 1, limit = 10, usageType, sort = "uploadedAt", search } = {}
) => ({
  queryKey: queryKeys.brand.approvedAssets.list(campaignPublicId, {
    page,
    limit,
    usageType: usageType || "all",
    sort,
    search: search || "",
  }),
  queryFn: () =>
    getCampaignApprovedAssets(campaignPublicId, {
      page,
      limit,
      usageType,
      sort,
      search,
    }),
  enabled: Boolean(campaignPublicId),
  staleTime: 30 * 1000,
  placeholderData: (previousData) => previousData,
});

export const getSubmissionDetailQueryOptions = (submissionPublicId) => ({
  queryKey: queryKeys.brand.submissions.detail(submissionPublicId),
  queryFn: () => getSubmissionDetail(submissionPublicId),
  enabled: Boolean(submissionPublicId),
  staleTime: 30 * 1000,
});

export const getCampaignActivityQueryOptions = (
  campaignPublicId,
  { page = 1, limit = 5, eventType } = {}
) => ({
  queryKey: queryKeys.brand.activity.list(campaignPublicId, {
    eventType: eventType || "all",
    limit,
    page,
    scope: "recent",
  }),
  queryFn: () =>
    getCampaignActivity(campaignPublicId, {
      page,
      limit,
      eventType: eventType || undefined,
    }),
  enabled: Boolean(campaignPublicId),
  staleTime: 30 * 1000,
});

export const getCampaignActivityInfiniteQueryOptions = (
  campaignPublicId,
  { eventType, limit = 20 } = {}
) => ({
  queryKey: queryKeys.brand.activity.list(campaignPublicId, {
    eventType: eventType || "all",
    limit,
  }),
  queryFn: ({ pageParam = 1 }) =>
    getCampaignActivity(campaignPublicId, {
      page: pageParam,
      limit,
      eventType: eventType || undefined,
    }),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => {
    const pagination = lastPage?.pagination || {};
    const currentPage = Number(pagination.currentPage) || 1;
    const totalPages = Number(pagination.totalPages) || 1;
    if (currentPage < totalPages) return currentPage + 1;
    return undefined;
  },
  enabled: Boolean(campaignPublicId),
  staleTime: 30 * 1000,
});

export const invalidateCampaignSubmissions = (campaignPublicId) => {
  if (campaignPublicId) {
    const id = String(campaignPublicId);
    return Promise.all([
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.brand.submissions.all(), "list", id],
        refetchType: "active",
      }),
      queryClient.invalidateQueries({
        queryKey: queryKeys.brand.submissions.stats(campaignPublicId),
        refetchType: "active",
      }),
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.brand.activity.all(), "list", id],
        refetchType: "active",
      }),
      queryClient.invalidateQueries({
        queryKey: [...queryKeys.brand.approvedAssets.all(), "list", id],
        refetchType: "active",
      }),
    ]);
  }
  return Promise.all([
    queryClient.invalidateQueries({
      queryKey: queryKeys.brand.submissions.all(),
      refetchType: "active",
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.brand.activity.all(),
      refetchType: "active",
    }),
    queryClient.invalidateQueries({
      queryKey: queryKeys.brand.approvedAssets.all(),
      refetchType: "active",
    }),
  ]);
};

export const invalidateSubmissionDetail = (submissionPublicId) => {
  if (submissionPublicId) {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.brand.submissions.detail(submissionPublicId),
      refetchType: "active",
    });
  }
  return queryClient.invalidateQueries({
    queryKey: queryKeys.brand.submissions.all(),
    refetchType: "active",
  });
};

/** Force-refresh list, stats, and optional open submission detail after a review action. */
export const refetchBrandSubmissionViews = async (
  campaignPublicId,
  submissionPublicId
) => {
  const tasks = [
    invalidateCampaignSubmissions(campaignPublicId),
  ];
  if (submissionPublicId) {
    tasks.push(invalidateSubmissionDetail(submissionPublicId));
  }
  await Promise.all(tasks);
};

export const invalidateCampaignActivity = (campaignPublicId) => {
  if (campaignPublicId) {
    return queryClient.invalidateQueries({
      queryKey: [
        ...queryKeys.brand.activity.all(),
        "list",
        String(campaignPublicId),
      ],
    });
  }
  return queryClient.invalidateQueries({
    queryKey: queryKeys.brand.activity.all(),
  });
};

export const approveSubmissionMutation = (campaignPublicId) => ({
  mutationFn: (submissionPublicId) => approveSubmission(submissionPublicId),
  onSuccess: (_data, submissionPublicId) => {
    invalidateCampaignSubmissions(campaignPublicId);
    invalidateSubmissionDetail(submissionPublicId);
  },
});

export const requestSubmissionRevisionMutation = (campaignPublicId) => ({
  mutationFn: ({ submissionPublicId, payload }) =>
    requestSubmissionRevision(submissionPublicId, payload),
  onSuccess: (_data, { submissionPublicId }) => {
    invalidateCampaignSubmissions(campaignPublicId);
    invalidateSubmissionDetail(submissionPublicId);
  },
});

export const rejectSubmissionMutation = (campaignPublicId) => ({
  mutationFn: ({ submissionPublicId, payload }) =>
    rejectSubmission(submissionPublicId, payload),
  onSuccess: (_data, { submissionPublicId }) => {
    invalidateCampaignSubmissions(campaignPublicId);
    invalidateSubmissionDetail(submissionPublicId);
  },
});

export const getBrandCreatorsQueryOptions = ({ page = 1, limit = 10 } = {}) => ({
  queryKey: queryKeys.creator.list({ page, limit }),
  queryFn: () => getActiveCreatorsList({ page, limit }),
  placeholderData: (previousData) => previousData,
  staleTime: 5 * 60 * 1000,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
});

export const getBrandCreatorByIdQueryOptions = (creatorId) => ({
  queryKey: queryKeys.creator.detail(creatorId),
  queryFn: async () => {
    const normalizedId = Number(creatorId);

    const cachedCreator = queryClient.getQueryData(
      queryKeys.creator.detail(creatorId)
    );

    if (cachedCreator) {
      return cachedCreator;
    }

    const cachedListQueries = queryClient.getQueriesData({
      queryKey: queryKeys.creator.lists(),
    });

    for (const [, cachedListResponse] of cachedListQueries) {
      const cachedCreators = cachedListResponse?.creators || [];
      const matchedCreator = cachedCreators.find(
        (creator) => Number(creator?.id) === normalizedId
      );

      if (matchedCreator) {
        return matchedCreator;
      }
    }

    const response = await getActiveCreatorsList({ page: 1, limit: 100 });
    const creator = response?.creators?.find(
      (item) => Number(item?.id) === normalizedId
    );

    return creator || null;
  },
  enabled: Boolean(creatorId),
  staleTime: 5 * 60 * 1000,
  refetchOnMount: false,
  refetchOnWindowFocus: false,
});

/**
 * Utility Functions
 */

export const invalidateCampaigns = () => {
  return queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.all });
};

export const invalidateCreatorApplications = (campaignId) => {
  if (campaignId) {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.campaignApplications.byCampaign(campaignId),
    });
  }
  return queryClient.invalidateQueries({
    queryKey: queryKeys.campaignApplications.all,
  });
};

export const invalidateBrandCreators = () => {
  return queryClient.invalidateQueries({
    queryKey: queryKeys.creator.lists(),
  });
};

/** Invalidate every page/status variant of the creator's `my-jobs` cache. */
export const invalidateMyJobs = () => {
  return queryClient.invalidateQueries({
    queryKey: [...queryKeys.creator.all, "myJobs"],
  });
};

export const invalidateWorkSubmission = (jobPublicId) => {
  if (jobPublicId) {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.creator.workSubmission(jobPublicId),
    });
  }
  return queryClient.invalidateQueries({
    queryKey: [...queryKeys.creator.all, "workSubmission"],
  });
};

/** Patch applicant lists inside any cached campaign-applications payload shape. */
function patchApplicantsInPayload(payload, mergeApp) {
  if (!payload) return payload;
  if (Array.isArray(payload)) return payload.map(mergeApp);

  // { data: [...] } envelope (bare array)
  if (Array.isArray(payload.data)) {
    return { ...payload, data: payload.data.map(mergeApp) };
  }

  const next = { ...payload };
  let changed = false;

  for (const key of ["applicants", "applications"]) {
    if (Array.isArray(next[key])) {
      next[key] = next[key].map(mergeApp);
      changed = true;
    }
  }

  if (next.data && typeof next.data === "object" && !Array.isArray(next.data)) {
    next.data = { ...next.data };
    for (const key of ["applicants", "applications"]) {
      if (Array.isArray(next.data[key])) {
        next.data[key] = next.data[key].map(mergeApp);
        changed = true;
      }
    }
  }

  return changed ? next : payload;
}

/** Apply updated application from PUT /update-status response into all relevant caches. */
function upsertApplicationInCaches(updatedApplication, campaignIdHint) {
  const applicationId = updatedApplication?.id;
  const newStatus =
    updatedApplication?.applicationStatus || updatedApplication?.status;
  if (!applicationId || !newStatus) return false;

  const mergeApp = (app) =>
    String(app?.id) === String(applicationId)
      ? {
          ...app,
          ...updatedApplication,
          applicationStatus: newStatus,
          status: newStatus,
        }
      : app;

  const campaignIds = new Set(
    [campaignIdHint, updatedApplication?.campaignId]
      .filter((v) => v != null && v !== "")
      .flatMap((v) => [v, String(v), Number(v)])
      .filter((v) => v === 0 || Boolean(v))
  );

  for (const id of campaignIds) {
    if (Number.isNaN(id)) continue;
    queryClient.setQueryData(
      queryKeys.campaignApplications.byCampaign(id),
      (payload) => patchApplicantsInPayload(payload, mergeApp)
    );
  }

  queryClient.setQueriesData(
    { queryKey: queryKeys.campaignApplications.all },
    (payload) => patchApplicantsInPayload(payload, mergeApp)
  );

  queryClient.setQueriesData(
    { queryKey: [...queryKeys.creator.all, "myJobs"] },
    (payload) => {
      if (!payload?.jobs) return payload;
      return {
        ...payload,
        jobs: payload.jobs.map((job) => {
          const matchesApplication =
            String(job?.id) === String(applicationId) ||
            String(job?.applicationId) === String(applicationId) ||
            String(job?.raw?.id) === String(applicationId);
          const matchesCampaign =
            updatedApplication?.campaignId != null &&
            String(job?.campaign?.id) ===
              String(updatedApplication.campaignId);

          if (!matchesApplication && !matchesCampaign) return job;

          return {
            ...job,
            status: newStatus,
            applicationStatus: newStatus,
            raw: job.raw
              ? {
                  ...job.raw,
                  ...updatedApplication,
                  applicationStatus: newStatus,
                  status: newStatus,
                }
              : job.raw,
          };
        }),
      };
    }
  );

  return true;
}

/** Patch a single application's status in the campaign-applications query cache. */
function patchCreatorApplicationsCache(campaignId, applicationId, newStatus) {
  if (!applicationId || !newStatus) return;

  const mergeApp = (app) =>
    String(app?.id) === String(applicationId)
      ? {
          ...app,
          applicationStatus: newStatus,
          status: newStatus,
        }
      : app;

  const campaignIds = new Set(
    [campaignId]
      .filter((v) => v != null && v !== "")
      .flatMap((v) => [v, String(v), Number(v)])
      .filter((v) => v === 0 || Boolean(v))
  );

  for (const id of campaignIds) {
    if (Number.isNaN(id)) continue;
    queryClient.setQueryData(
      queryKeys.campaignApplications.byCampaign(id),
      (payload) => patchApplicantsInPayload(payload, mergeApp)
    );
  }

  queryClient.setQueriesData(
    { queryKey: queryKeys.campaignApplications.all },
    (payload) => patchApplicantsInPayload(payload, mergeApp)
  );
}

/** Keep proposal + my-jobs caches in sync after accept/decline (runs inside mutationFn). */
function syncApplicationStatusCaches(data, campaignId, variables) {
  const updatedApplication = data?.application;
  const synced = updatedApplication
    ? upsertApplicationInCaches(updatedApplication, campaignId)
    : false;

  if (!synced && variables?.applicationId && variables?.newStatus) {
    patchCreatorApplicationsCache(
      campaignId,
      variables.applicationId,
      variables.newStatus
    );
  }

  queryClient.invalidateQueries({
    queryKey: queryKeys.campaignApplications.all,
    refetchType: "none",
  });
  queryClient.invalidateQueries({
    queryKey: [...queryKeys.creator.all, "myJobs"],
    refetchType: "none",
  });
  invalidateCampaignActivity();
}

/**
 * =========================
 * Campaign Invitations
 * =========================
 */

export const getBrandInvitationsQueryOptions = ({
  campaignId,
  status,
  page = 1,
  limit = 10,
} = {}) => ({
  queryKey: queryKeys.invitations.brand.list({
    campaignId,
    status,
    page,
    limit,
  }),
  queryFn: () => getBrandInvitations({ campaignId, status, page, limit }),
  placeholderData: (previousData) => previousData,
  staleTime: 30 * 1000,
});

export const getCreatorInvitationsQueryOptions = ({
  status,
  page = 1,
  limit = 10,
} = {}) => ({
  queryKey: queryKeys.invitations.creator.list({ status, page, limit }),
  queryFn: () => getCreatorInvitations({ status, page, limit }),
  placeholderData: (previousData) => previousData,
  staleTime: 30 * 1000,
});

export const getCreatorInvitationDetailQueryOptions = (publicId) => ({
  queryKey: queryKeys.invitations.creator.detail(publicId),
  queryFn: () => getCreatorInvitationDetail(publicId),
  enabled: Boolean(publicId),
  staleTime: 30 * 1000,
});

export const invalidateBrandInvitations = () =>
  queryClient.invalidateQueries({
    queryKey: queryKeys.invitations.brand.all(),
  });

export const invalidateCreatorInvitations = () =>
  queryClient.invalidateQueries({
    queryKey: queryKeys.invitations.creator.all(),
  });

export const sendCampaignInvitationsMutation = () => ({
  mutationFn: ({ campaignId, creatorIds, customMessage }) =>
    sendCampaignInvitations(campaignId, { creatorIds, customMessage }),
  onSuccess: () => {
    invalidateBrandInvitations();
  },
});

export const withdrawBrandInvitationMutation = () => ({
  mutationFn: (publicId) => withdrawBrandInvitation(publicId),
  onSuccess: () => {
    invalidateBrandInvitations();
  },
});

export const acceptCreatorInvitationMutation = () => ({
  mutationFn: (publicId) => acceptCreatorInvitation(publicId),
  onSuccess: () => {
    invalidateCreatorInvitations();
  },
});

export const declineCreatorInvitationMutation = () => ({
  mutationFn: (publicId) => declineCreatorInvitation(publicId),
  onSuccess: () => {
    invalidateCreatorInvitations();
  },
});

export const changeApplicationStatusMutation = (campaignId) => ({
  mutationFn: async (variables) => {
    const data = await changeCreatorApplicationStatus(
      variables.applicationId,
      variables.newStatus
    );
    // Must run here — component-level onSuccess overrides replace this handler.
    syncApplicationStatusCaches(data, campaignId, variables);
    return data;
  },
});

export const prefetchCampaigns = ({ status, page, limit } = {}) => {
  return queryClient.prefetchQuery(
    getCampaignsQueryOptions({ status, page, limit })
  );
};

export const prefetchCampaignDetail = (id) => {
  if (!id) return Promise.resolve();
  return queryClient.prefetchQuery(getCampaignByIdQueryOptions(id));
};

export default {
  // Query option factories
  getCampaignsQueryOptions,
  getCampaignByIdQueryOptions,
  getActiveCampaignsQueryOptions,
  getHasCampaignsQueryOptions,
  getCreatorApplicationsQueryOptions,
  getMyCampaignApplicationsQueryOptions,
  getMyJobsQueryOptions,
  getWorkSubmissionQueryOptions,
  getCampaignSubmissionsQueryOptions,
  getCampaignSubmissionStatsQueryOptions,
  getCampaignApprovedAssetsQueryOptions,
  getCampaignActivityInfiniteQueryOptions,
  getCampaignActivityQueryOptions,
  getSubmissionDetailQueryOptions,
  getBrandCreatorsQueryOptions,
  getBrandCreatorByIdQueryOptions,
  getBrandInvitationsQueryOptions,
  getCreatorInvitationsQueryOptions,
  getCreatorInvitationDetailQueryOptions,
  // Utilities
  invalidateCampaigns,
  invalidateCreatorApplications,
  invalidateBrandCreators,
  invalidateMyJobs,
  invalidateWorkSubmission,
  invalidateCampaignSubmissions,
  invalidateSubmissionDetail,
  invalidateCampaignActivity,
  invalidateBrandInvitations,
  invalidateCreatorInvitations,
  changeApplicationStatusMutation,
  approveSubmissionMutation,
  requestSubmissionRevisionMutation,
  rejectSubmissionMutation,
  sendCampaignInvitationsMutation,
  withdrawBrandInvitationMutation,
  acceptCreatorInvitationMutation,
  declineCreatorInvitationMutation,
  prefetchCampaigns,
  prefetchCampaignDetail,
};
