import { getBrandProfileDummy } from "../pages/creator/ExploreCampaigns/brandProfileDummyData";

function hasValue(value) {
  if (value == null) return false;
  if (typeof value === "string") return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function normalizeWebsite(url) {
  if (!hasValue(url)) return null;
  const trimmed = String(url).trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed.replace(/^\/+/, "")}`;
}

function resolveLogoUrl(value) {
  if (!value) return null;
  if (typeof value === "string" && value.trim()) return value.trim();
  if (typeof value === "object") {
    return (
      value.url ||
      value.secureUrl ||
      value.mediaDetails?.url ||
      value.mediaDetails?.secureUrl ||
      null
    );
  }
  return null;
}

export function resolveBrandLogo(brand) {
  return (
    resolveLogoUrl(brand?.logo) ||
    resolveLogoUrl(brand?.brandLogo) ||
    resolveLogoUrl(brand?.media?.logo) ||
    resolveLogoUrl(brand?.media?.profilePhoto) ||
    null
  );
}

export function getCompanyInitials(companyName) {
  const trimmed = String(companyName || "").trim();
  if (!trimmed) return "B";

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }

  return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
}

function resolveIndustries(brand) {
  if (Array.isArray(brand?.industries) && brand.industries.length) {
    return brand.industries;
  }
  if (hasValue(brand?.industry)) {
    return String(brand.industry)
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  if (hasValue(brand?.category)) {
    return [String(brand.category)];
  }
  return [];
}

function resolveLocation(brand) {
  const city = brand?.city || brand?.companyCity;
  const country = brand?.country || brand?.companyCountry;
  const parts = [city, country].filter(hasValue);
  if (parts.length) return parts.join(", ");
  return brand?.location || null;
}

function resolveStat(apiBrand, dummyBrand, apiKey, dummyKey) {
  const apiStats = apiBrand?.stats || {};
  const dummyStats = dummyBrand?.stats || {};
  const direct = apiBrand?.[apiKey];
  const fromStats = apiStats[dummyKey ?? apiKey];
  if (hasValue(direct)) return direct;
  if (hasValue(fromStats)) return fromStats;
  return dummyStats[dummyKey ?? apiKey] ?? null;
}

/**
 * Merge API brand payload with static dummy data.
 * API values win when present; dummy fills gaps.
 */
export function mergeBrandProfile(apiBrand, brandId) {
  const dummy = getBrandProfileDummy(brandId);
  const source = apiBrand || {};

  const industries = resolveIndustries(source);
  const mergedIndustries = industries.length ? industries : dummy.industries;

  const location = resolveLocation(source) || dummy.location;
  const description = hasValue(source.description)
    ? source.description
    : hasValue(source.companyDescription)
      ? source.companyDescription
      : hasValue(source.about)
        ? source.about
        : dummy.description;

  const website = normalizeWebsite(
    source.website ||
      source.companyWebsite ||
      source.companyWebsiteUrl ||
      dummy.website
  );

  const stats = {
    totalCampaigns: resolveStat(source, dummy, "totalCampaigns"),
    activeCreators: resolveStat(source, dummy, "activeCreators"),
    averageRating: resolveStat(source, dummy, "averageRating"),
    totalInvestment: resolveStat(source, dummy, "totalInvestment"),
  };

  return {
    id: source.id || brandId || dummy.id,
    companyName:
      source.companyName || source.name || dummy.companyName,
    brandLogo: resolveBrandLogo(source) || dummy.brandLogo,
    isVerified:
      source.isVerified != null ? Boolean(source.isVerified) : dummy.isVerified,
    industries: mergedIndustries,
    location,
    description,
    website,
    stats,
  };
}

export function getBackNavigationState(fromPath) {
  if (!fromPath) {
    return {
      from: "/creator/campaigns",
      backLabel: "Back to Explore Campaigns",
    };
  }

  if (fromPath.includes("/creator/campaigns/") && !fromPath.endsWith("/campaigns")) {
    return {
      from: fromPath,
      backLabel: "Back to Campaign Details",
    };
  }

  return {
    from: fromPath,
    backLabel: "Back to Explore Campaigns",
  };
}
