/**
 * Query Keys Factory
 */
export const queryKeys = {
  campaigns: {
    all: ["campaigns"],
    lists: () => [...queryKeys.campaigns.all, "list"],
    list: ({ status, page, limit } = {}) => [
      ...queryKeys.campaigns.lists(),
      { status, page, limit },
    ],
    tabCounts: () => [...queryKeys.campaigns.all, "tabCounts"],
    allPages: () => [...queryKeys.campaigns.all, "allPages"],
    active: () => [...queryKeys.campaigns.all, "active"],
    details: () => [...queryKeys.campaigns.all, "detail"],
    detail: (id) => [...queryKeys.campaigns.details(), id],
  },
  campaignApplications: {
    all: ["campaignApplications"],
    byCampaign: (campaignId) => [
      ...queryKeys.campaignApplications.all,
      "campaign",
      campaignId,
    ],
  },
  brand: {
    all: ["brand"],
    profile: () => [...queryKeys.brand.all, "profile"],
    submissions: {
      all: () => [...queryKeys.brand.all, "submissions"],
      list: (campaignPublicId, params = {}) => [
        ...queryKeys.brand.submissions.all(),
        "list",
        String(campaignPublicId),
        params,
      ],
      detail: (submissionPublicId) => [
        ...queryKeys.brand.submissions.all(),
        "detail",
        String(submissionPublicId),
      ],
      stats: (campaignPublicId) => [
        ...queryKeys.brand.submissions.all(),
        "stats",
        String(campaignPublicId),
      ],
    },
    activity: {
      all: () => [...queryKeys.brand.all, "activity"],
      list: (campaignPublicId, params = {}) => [
        ...queryKeys.brand.activity.all(),
        "list",
        String(campaignPublicId),
        params,
      ],
    },
    approvedAssets: {
      all: () => [...queryKeys.brand.all, "approvedAssets"],
      list: (campaignPublicId, params = {}) => [
        ...queryKeys.brand.approvedAssets.all(),
        "list",
        String(campaignPublicId),
        params,
      ],
    },
  },
  creator: {
    all: ["creator"],
    profile: () => [...queryKeys.creator.all, "profile"],
    lists: () => [...queryKeys.creator.all, "list"],
    list: ({ page, limit }) => [...queryKeys.creator.lists(), { page, limit }],
    detail: (id) => [...queryKeys.creator.all, "detail", String(id)],
    myApplications: () => [...queryKeys.creator.all, "myApplications"],
    myJobs: ({ page = 1, limit = 8, status } = {}) => [
      ...queryKeys.creator.all,
      "myJobs",
      { page, limit, status: status || "all" },
    ],
    jobs: ({ page = 1, limit = 100 } = {}) => [
      ...queryKeys.creator.all,
      "jobs",
      { page, limit },
    ],
    workSubmission: (jobPublicId) => [
      ...queryKeys.creator.all,
      "workSubmission",
      String(jobPublicId),
    ],
  },
  chat: {
    all: ["chat"],
    rooms: () => [...queryKeys.chat.all, "rooms"],
  },
  invitations: {
    all: ["invitations"],
    brand: {
      all: () => [...queryKeys.invitations.all, "brand"],
      list: ({ campaignId, status, page = 1, limit = 10 } = {}) => [
        ...queryKeys.invitations.brand.all(),
        "list",
        {
          campaignId: campaignId || "all",
          status: status || "all",
          page,
          limit,
        },
      ],
    },
    creator: {
      all: () => [...queryKeys.invitations.all, "creator"],
      list: ({ status, page = 1, limit = 10 } = {}) => [
        ...queryKeys.invitations.creator.all(),
        "list",
        { status: status || "all", page, limit },
      ],
      detail: (publicId) => [
        ...queryKeys.invitations.creator.all(),
        "detail",
        String(publicId),
      ],
    },
  },
};

export default queryKeys;
