import { formatCampaignCompensation } from "../../../../components/campaign/campaignViewUtils";

const STATUS_TABS = [
  { key: "all", label: "All Campaigns", filter: null },
  { key: "draft", label: "Draft", filter: "draft" },
  { key: "active", label: "Active", filter: "active" },
  {
    key: "reviewing",
    label: "Reviewing Content",
    filter: "reviewing",
  },
  { key: "completed", label: "Completed", filter: "completed" },
  { key: "closed", label: "Closed", filter: "closed" },
];

const STATUS_ALIASES = {
  active: "active",
  inactive: "inactive",
  draft: "draft",
  closed: "closed",
  completed: "completed",
  reviewing: "reviewing",
  "reviewing content": "reviewing",
  "reviewing_content": "reviewing",
};

export { STATUS_TABS };

export function normalizePublicId(id) {
  if (id == null || id === "") return "";
  return String(id).replace(/^#/, "").trim();
}

export function normalizeStatusKey(status) {
  const key = String(status || "")
    .toLowerCase()
    .trim();
  // Unpublished API campaigns use `inactive` — show them under Draft in the UI.
  if (key === "inactive") return "draft";
  return STATUS_ALIASES[key] || key || "draft";
}

export function formatStatusLabel(status) {
  const key = normalizeStatusKey(status);
  const labels = {
    active: "Active",
    inactive: "Inactive",
    draft: "Draft",
    closed: "Closed",
    completed: "Completed",
    reviewing: "Reviewing Content",
  };
  return labels[key] || status || "Draft";
}

export function formatCardDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatBudget(campaign) {
  if (typeof campaign?.budget === "string" && campaign.budget.trim()) {
    const s = campaign.budget.trim();
    return s.startsWith("$") ? s.replace(/^\$/, "R ").replace(/,/g, " ") : s;
  }
  return formatCampaignCompensation(campaign);
}

function pickStat(...values) {
  for (const value of values) {
    if (value == null || value === "") continue;
    const num = Number(value);
    if (!Number.isNaN(num)) return num;
  }
  return 0;
}

/**
 * Normalizes campaign stats from the brand listings/detail API into the UI shape.
 * API fields: totalApplications, totalInvitations, hiredCreators, totalSubmissions,
 * pendingReview, approvedSubmissions, revisionRequested, rejectedSubmissions.
 */
export function resolveCampaignStats(campaign) {
  const api = campaign?.stats || {};

  return {
    applications: pickStat(
      api.totalApplications,
      api.applications,
      campaign?.applications
    ),
    invited: pickStat(
      api.totalInvitations,
      api.invited,
      campaign?.invited
    ),
    hired: pickStat(
      api.hiredCreators,
      api.hired,
      campaign?.hired
    ),
    assetsSubmitted: pickStat(
      api.totalSubmissions,
      api.assetsSubmitted,
      campaign?.assetsSubmitted
    ),
    approved: pickStat(
      api.approvedSubmissions,
      api.approved,
      campaign?.approved
    ),
    pendingReviews: pickStat(
      api.pendingReview,
      api.pendingReviews,
      campaign?.pendingReviews
    ),
    revisionRequested: pickStat(api.revisionRequested),
    rejectedSubmissions: pickStat(api.rejectedSubmissions),
  };
}

export function campaignHasApplications(campaign) {
  if (!campaign) return false;
  const apiStats = campaign.stats;
  if (apiStats && typeof apiStats.totalApplications === "number") {
    return apiStats.totalApplications > 0;
  }
  if (typeof campaign.hasApplications === "boolean") {
    return campaign.hasApplications;
  }
  return resolveCampaignStats(campaign).applications > 0;
}

export function getRawCampaignStatus(campaign) {
  return String(campaign?.status ?? "").toLowerCase().trim();
}

export function getCampaignPaymentStatus(campaign) {
  return String(campaign?.invoice?.paymentStatus ?? "").toLowerCase().trim();
}

/** PATCH — backend blocks active (403) and payment pending (423); §2 NW_CAMPAIGNAPI_INTEGRATION */
export function getEditCampaignBlockReason(campaign) {
  if (!campaign) return "Campaign not found.";
  if (getRawCampaignStatus(campaign) === "active") {
    return "Published campaigns cannot be edited.";
  }
  return null;
}

/** DELETE allowed for inactive drafts — blocked when payment pending or paid — §8 */
export function getDeleteCampaignBlockReason(campaign) {
  const publicId = campaign?.publicId || campaign?.id;
  if (!publicId) return "Public campaign ID is missing.";
  if (!isDraftCampaign(campaign)) {
    return "Only draft (unpublished) campaigns can be deleted.";
  }
  const payment = getCampaignPaymentStatus(campaign);
  if (payment === "pending") {
    return "Cannot delete while payment is in progress.";
  }
  if (payment === "paid") {
    return "Paid campaigns cannot be deleted.";
  }
  return null;
}

export function canEditCampaign(campaign) {
  return getEditCampaignBlockReason(campaign) == null;
}

export function canDeleteCampaign(campaign) {
  return getDeleteCampaignBlockReason(campaign) == null;
}

export function isDraftCampaign(campaign) {
  if (!campaign) return false;
  const status = getRawCampaignStatus(campaign);
  if (status === "inactive" || status === "draft") return true;
  return normalizeStatusKey(campaign?.status) === "draft";
}

/** POST /publish — Cash inactive drafts with unpaid invoice */
export function canPublishCampaign(campaign) {
  if (!campaign?.publicId) return false;
  if (!isDraftCampaign(campaign)) return false;
  const compensation = String(campaign?.compensationType ?? "").toLowerCase();
  if (compensation.includes("gift")) return false;
  const payment = getCampaignPaymentStatus(campaign);
  if (payment === "pending" || payment === "paid") return false;
  return true;
}

/** Fill missing `stats` on a detail response from the brand campaign list cache. */
export function enrichCampaignWithListStats(campaign, listCampaigns = []) {
  if (!campaign?.stats && Array.isArray(listCampaigns) && listCampaigns.length > 0) {
    const id = normalizePublicId(campaign.publicId || campaign.id);
    const match = listCampaigns.find(
      (item) => normalizePublicId(item.publicId || item.id) === id
    );
    if (match?.stats) {
      return { ...campaign, stats: match.stats };
    }
  }
  return campaign;
}

export function getTimelineLabel(campaign) {
  const statusKey = normalizeStatusKey(campaign?.status);
  if (statusKey === "completed" || statusKey === "closed") {
    return { text: "Completed", tone: "completed" };
  }

  const endRaw = campaign?.campaignEnds || campaign?.endDate;
  if (!endRaw) return { text: "—", tone: "neutral" };

  const end = new Date(endRaw);
  if (Number.isNaN(end.getTime())) return { text: "—", tone: "neutral" };

  const now = new Date();
  const diffMs = end.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: "Ended", tone: "completed" };
  }
  if (diffDays === 0) {
    return { text: "Ends today", tone: "active" };
  }
  return { text: `${diffDays}d left`, tone: "active" };
}

export function normalizeCampaignForCard(campaign) {
  const publicId = campaign?.publicId || campaign?.id || "";
  const stats = resolveCampaignStats(campaign);
  const statusKey = normalizeStatusKey(campaign?.status);
  const timeline = getTimelineLabel(campaign);

  return {
    raw: campaign,
    publicId,
    displayId: publicId ? `#${normalizePublicId(publicId)}` : "—",
    title: campaign?.campaignTitle || campaign?.name || "Untitled Campaign",
    status: formatStatusLabel(campaign?.status),
    statusKey,
    budget: formatBudget(campaign),
    startDate: formatCardDate(
      campaign?.campaignStarts || campaign?.startDate || campaign?.createdAt
    ),
    endDate: formatCardDate(campaign?.campaignEnds || campaign?.endDate),
    timeline,
    stats,
    hasApplications: campaignHasApplications(campaign),
    createdAt: campaign?.createdAt || null,
  };
}

export function normalizeCampaignList(apiCampaigns) {
  const apiList = Array.isArray(apiCampaigns) ? apiCampaigns : [];
  return apiList.map(normalizeCampaignForCard);
}

export function filterCampaignsByTab(campaigns, tabKey) {
  const tab = STATUS_TABS.find((t) => t.key === tabKey);
  if (!tab?.filter) return campaigns;

  return campaigns.filter((c) => {
    const key = c.statusKey || normalizeStatusKey(c.raw?.status);
    if (tab.filter === "active") return key === "active";
    if (tab.filter === "inactive") return key === "inactive";
    return key === tab.filter;
  });
}

export function countCampaignsByTab(campaigns) {
  const counts = { all: campaigns.length };
  STATUS_TABS.forEach((tab) => {
    if (tab.key === "all") return;
    counts[tab.key] = filterCampaignsByTab(campaigns, tab.key).length;
  });
  return counts;
}

export function sortCampaigns(campaigns, sortKey) {
  const list = [...campaigns];
  switch (sortKey) {
    case "oldest":
      return list.sort(
        (a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0)
      );
    case "title":
      return list.sort((a, b) => a.title.localeCompare(b.title));
    case "latest":
    default:
      return list.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
  }
}

export function getStatusBadgeClasses(statusKey) {
  switch (statusKey) {
    case "active":
      return "bg-green-50 text-green-700";
    case "inactive":
      return "bg-amber-50 text-amber-700";
    case "closed":
      return "bg-red-50 text-red-600";
    case "completed":
      return "bg-purple-50 text-purple-700";
    case "reviewing":
      return "bg-blue-50 text-blue-700";
    case "draft":
    default:
      return "bg-gray-100 text-gray-600";
  }
}
