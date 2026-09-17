import campaignImage from "../assets/images/creator/explorcampagainImag.png";
import {
  locationOptions,
  platformOptions,
  selectOptions,
} from "../pages/brand/Campaigns/campaignFormOptions";

function getLabel(options, value) {
  if (!value) return null;
  const normalized = String(value).toLowerCase();
  const match = options.find(
    (opt) =>
      String(opt.value).toLowerCase() === normalized ||
      String(opt.label).toLowerCase() === normalized
  );
  return match?.label || String(value).replace(/_/g, " ");
}

function firstDisplayValue(value) {
  if (Array.isArray(value)) {
    const filtered = value.filter(Boolean);
    return filtered.length ? filtered[0] : null;
  }
  return value || null;
}

function formatDisplayValue(value, options) {
  const raw = firstDisplayValue(value);
  if (!raw) return "—";
  return getLabel(options, raw) || String(raw).replace(/_/g, " ");
}

export function mapCampaignToGridCard(campaign) {
  const deliverableLabel = getLabel(
    selectOptions.deliverables,
    campaign.deliverables
  );
  const platformRaw = Array.isArray(campaign.platform)
    ? campaign.platform[0]
    : campaign.platform;
  const platformLabel = getLabel(platformOptions, platformRaw);

  const tags = [deliverableLabel, platformLabel].filter(Boolean);

  const rating =
    campaign.brand?.rating ??
    campaign.brand?.averageRating ??
    campaign.rating ??
    null;
  const jobsCompleted =
    campaign.brand?.jobsCompleted ??
    campaign.jobsCompleted ??
    campaign.numberOfCreators ??
    null;

  return {
    id: campaign.id,
    title: campaign.campaignTitle || "Untitled Campaign",
    description: campaign.campaignBrief || "",
    image:
      campaign.media?.coverImage?.url ||
      campaign.media?.moodboards?.[0]?.url ||
      campaign.media?.productImages?.[0]?.url ||
      campaignImage,
    tags,
    rating: rating != null ? Number(rating) : null,
    jobsCompleted: jobsCompleted != null ? jobsCompleted : null,
    location: formatDisplayValue(campaign.location, locationOptions),
    ageRange: formatDisplayValue(campaign.ageRange, selectOptions.ageRange),
    gender: formatDisplayValue(campaign.gender, selectOptions.gender),
  };
}

export function filterGridCampaigns(campaigns, searchQuery) {
  const query = searchQuery.trim().toLowerCase();
  if (!query) return campaigns;

  return campaigns.filter((campaign) => {
    const haystack = [
      campaign.title,
      campaign.description,
      ...campaign.tags,
      campaign.location,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return haystack.includes(query);
  });
}

function normalizeDate(value) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date;
}

/** Days remaining until application deadline (falls back to campaign start). */
export function calculateCampaignDaysLeft(campaign) {
  const today = normalizeDate(new Date());
  const deadline = normalizeDate(campaign?.applicationDeadline);
  const starts = normalizeDate(campaign?.campaignStarts);

  const target = deadline || starts;
  if (!target || !today) return null;

  const diffDays = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, diffDays);
}

export function getCampaignBrandInfo(campaign) {
  const brand = campaign?.brand || {};
  return {
    brandId: brand.id ?? campaign?.brandId ?? null,
    companyName:
      brand.companyName ||
      campaign?.companyName ||
      "Brand Partner",
    brandLogo:
      brand.logo ||
      brand.media?.profilePhoto?.mediaDetails?.url ||
      brand.media?.logo?.mediaDetails?.url ||
      brand.media?.logo?.url ||
      null,
    isVerified: Boolean(brand.isVerified),
    website:
      brand.website ||
      brand.companyWebsite ||
      brand.companyWebsiteUrl ||
      null,
    brand,
  };
}
