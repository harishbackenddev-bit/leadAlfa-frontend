import {
  formatBudget,
  formatCardDate,
  formatStatusLabel,
  getTimelineLabel,
  normalizePublicId,
  normalizeStatusKey,
  resolveCampaignStats,
  campaignHasApplications,
} from "./campaignCardUtils";
import {
  NOT_PROVIDED,
  formatOverviewValue,
  mapApiAddOns,
} from "./overviewDisplayUtils";

export const DETAIL_TABS = [
  { key: "overview", label: "Overview", icon: "layout" },
    { key: "configure-creators", label: "Configure Creators", icon: "settings" }, // ← NEW
  { key: "proposals", label: "Proposals", icon: "file", badgeKey: "proposals" },
  { key: "creators", label: "Creators", icon: "users" },
  { key: "submissions", label: "Submissions", icon: "upload", badgeKey: "submissions" },
  { key: "feedback", label: "Feedback & Revisions", icon: "message", badgeKey: "feedback" },
  { key: "contracts", label: "Contracts", icon: "contract" },
  { key: "approved-assets", label: "Approved Assets", icon: "check" },
  { key: "activity", label: "Campaign Activity", icon: "activity" },
];

const FOCUS_TAB_MAP = {
  creators: "creators",
  assets: "approved-assets",
  "approved-assets": "approved-assets",
  overview: "overview",
    "configure-creators": "configure-creators", // ← NEW
};

export function resolveInitialTab({ searchTab, focusState }) {
  const fromSearch = searchTab && DETAIL_TABS.some((t) => t.key === searchTab)
    ? searchTab
    : null;
  const fromFocus = focusState ? FOCUS_TAB_MAP[focusState] : null;
  return fromSearch || fromFocus || "overview";
}

function pickArray(value) {
  if (Array.isArray(value)) return value;
  if (value) return [value];
  return [];
}

function pickPlatforms(campaign) {
  return pickArray(campaign.platform);
}

function pickAestheticVibes(creativeDirection) {
  const raw = creativeDirection?.aestheticVibe;
  if (Array.isArray(raw)) {
    return raw.map((v) => String(v).trim()).filter(Boolean);
  }
  if (raw) {
    return String(raw)
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean);
  }
  return [];
}

function resolvePetsRequired(campaign) {
  if (campaign.petsRequired === true || String(campaign.petsRequired).toLowerCase() === "yes") {
    return campaign.typeOfPet ? `Yes (${campaign.typeOfPet})` : "Yes";
  }
  if (campaign.petsRequired === false || String(campaign.petsRequired).toLowerCase() === "no") {
    return "No";
  }
  return NOT_PROVIDED;
}

function resolveMoodboardImages(campaign) {
  return pickArray(campaign?.media?.moodboards)
    .map((m) => m?.mediaDetails?.url || m?.url)
    .filter(Boolean);
}

function resolveCompletionPercent(campaign, stats) {
  if (campaign?.completionPercent != null) {
    return campaign.completionPercent;
  }

  const target = Number(
    campaign?.numberOfCreators ?? campaign?.creatorsNeeded ?? 0
  );
  if (target > 0) {
    return Math.min(100, Math.round((stats.hired / target) * 100));
  }

  return 0;
}

function buildAlertMessages(campaign, stats) {
  const messages = [];
  const endRaw = campaign?.campaignEnds || campaign?.endDate;
  if (endRaw) {
    const end = new Date(endRaw);
    if (!Number.isNaN(end.getTime())) {
      const diffDays = Math.ceil(
        (end.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays > 0) {
        messages.push(
          `Campaign ends in ${diffDays} day${diffDays === 1 ? "" : "s"}`
        );
      }
    }
  }

  if (stats.pendingReviews > 0) {
    messages.push(
      `${stats.pendingReviews} submission${stats.pendingReviews === 1 ? "" : "s"} awaiting review`
    );
  }

  if (stats.revisionRequested > 0) {
    messages.push(
      `${stats.revisionRequested} revision request${stats.revisionRequested === 1 ? "" : "s"} outstanding`
    );
  }

  return messages;
}

export function mergeCampaignDetail(apiCampaign, publicId) {
  if (!apiCampaign) return null;

  const campaign = apiCampaign;
  const stats = resolveCampaignStats(campaign);
  const fromApi = { fromApi: true };
  const statusKey = normalizeStatusKey(campaign.status);
  const timeline = getTimelineLabel(campaign);
  const creativeDirection = campaign.creativeDirection || {};
  const platforms = pickPlatforms(campaign);
  const moodboardImages = resolveMoodboardImages(campaign);
  const addOns = mapApiAddOns(campaign.addOns);

  return {
    raw: campaign,
    hasApiData: true,
    publicId: campaign.publicId || publicId,
    displayId: campaign.publicId
      ? `#${normalizePublicId(campaign.publicId)}`
      : publicId
        ? `#${normalizePublicId(publicId)}`
        : "—",
    title: formatOverviewValue(campaign.campaignTitle || campaign.name, {
      ...fromApi,
      fallback: "Untitled Campaign",
    }),
    status: formatStatusLabel(campaign.status || "active"),
    statusKey,
    startedOn: formatOverviewValue(
      formatCardDate(campaign.campaignStarts || campaign.createdAt),
      fromApi
    ),
    creatorsHired: stats.hired,
    budget: formatOverviewValue(formatBudget(campaign), fromApi),
    stats,
    completionPercent: resolveCompletionPercent(campaign, stats),
    timeline,
    tabBadges: {},
    alertMessages: buildAlertMessages(campaign, stats),
    campaignDetails: {
      videoLength: formatOverviewValue(campaign.videoLength, fromApi),
      productUrl: formatOverviewValue(campaign.productServiceUrl, fromApi),
      platforms,
      compensationType: formatOverviewValue(campaign.compensationType, fromApi),
      productStatus: formatOverviewValue(campaign.productStatus, fromApi),
      deliverables: formatOverviewValue(
        campaign.deliverables || campaign.socialMediaType,
        fromApi
      ),
    },
    goals: {
      objective: formatOverviewValue(campaign.campaignGoal, fromApi),
      ageRange: formatOverviewValue(campaign.ageRange, fromApi),
      gender: formatOverviewValue(campaign.gender, fromApi),
      locations: formatOverviewValue(
        campaign.location || campaign.city,
        fromApi
      ),
      numberOfCreators: formatOverviewValue(
        campaign.numberOfCreators ?? campaign.creatorsNeeded,
        fromApi
      ),
      followerCount: formatOverviewValue(campaign.followerCount, fromApi),
      engagementRate: formatOverviewValue(campaign.engagementRate, fromApi),
    },
    creative: {
      keyMessage: formatOverviewValue(campaign.keyMessage, fromApi),
      brief: formatOverviewValue(
        campaign.campaignBrief || campaign.additionalBrief,
        fromApi
      ),
      hookStyle: formatOverviewValue(creativeDirection.hookStyle, fromApi),
      toneVoice: formatOverviewValue(creativeDirection.toneVoice, fromApi),
      problem: formatOverviewValue(creativeDirection.problem, fromApi),
      solution: formatOverviewValue(creativeDirection.solution, fromApi),
      cta: formatOverviewValue(creativeDirection.cta, fromApi),
      aestheticVibes: pickAestheticVibes(creativeDirection),
    },
    timelineDetails: {
      campaignStart: formatOverviewValue(
        formatCardDate(campaign.campaignStarts),
        fromApi
      ),
      applicationDeadline: formatOverviewValue(
        formatCardDate(campaign.applicationDeadline),
        fromApi
      ),
      petsRequired: resolvePetsRequired(campaign),
    },
    moodboard: {
      referenceUrl: campaign.moodboardInspirationUrl || "",
      images: moodboardImages,
    },
    addOns,
    hasApplications: campaignHasApplications(campaign),
  };
}
