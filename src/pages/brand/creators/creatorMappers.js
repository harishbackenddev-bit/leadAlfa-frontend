import { creatorSelectOptions } from "../../../data/creatorSignupOptions";

const FALLBACK_VALUE = "N/A";

const COUNTRY_CODE_ALIASES = {
  uk: "gb",
  "united kingdom": "gb",
  england: "gb",
  usa: "us",
  "united states": "us",
  "united states of america": "us",
};

const safeList = (value) => (Array.isArray(value) ? value : []);

const humanizeValue = (value) =>
  String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const optionLabel = (value, options = []) => {
  if (value === null || value === undefined || value === "") return "";
  const match = options.find((option) => option.value === value);
  return match?.label || humanizeValue(value);
};

const hasPresentValue = (value) => {
  if (value === null || value === undefined || value === "") return false;
  if (value === FALLBACK_VALUE) return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

export const getVideoPosterUrl = (videoUrl) => {
  if (!videoUrl?.includes("res.cloudinary.com")) return null;

  const uploadMarker = "/upload/";
  const uploadIndex = videoUrl.indexOf(uploadMarker);
  if (uploadIndex === -1) return null;

  const prefix = videoUrl.slice(0, uploadIndex + uploadMarker.length);
  const suffix = videoUrl.slice(uploadIndex + uploadMarker.length);
  const normalizedSuffix = suffix.replace(/\.(mp4|mov|webm)(\?.*)?$/i, ".jpg");

  return `${prefix}so_0,w_720,h_400,c_fill,f_jpg,q_auto/${normalizedSuffix}`;
};

export const getCreatorInitials = (firstName = "", lastName = "") => {
  const first = String(firstName || "").trim().charAt(0);
  const last = String(lastName || "").trim().charAt(0);
  const initials = `${first}${last}`.toUpperCase();
  return initials || "NA";
};

export const getCountryCode = (country = "") => {
  const normalizedCountry = String(country || "").trim().toLowerCase();

  if (!normalizedCountry) return "us";
  if (COUNTRY_CODE_ALIASES[normalizedCountry]) {
    return COUNTRY_CODE_ALIASES[normalizedCountry];
  }

  if (normalizedCountry.length === 2) {
    return normalizedCountry;
  }

  return "us";
};

const resolveCreatorImage = (creator) => {
  return (
    creator?.media?.profilePhoto?.mediaDetails?.url ||
    creator?.media?.profilePhoto ||
    creator?.profilePhoto ||
    ""
  );
};

const formatBoolean = (value) => {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return null;
};

const buildPortfolioItems = (creator, fallbackImage = "") => {
  const items = [];
  const intro = creator?.media?.introVideo?.mediaDetails;

  if (intro?.url) {
    items.push({
      id: creator?.media?.introVideo?.id || "intro-video",
      type: "video",
      url: intro.url,
      image: getVideoPosterUrl(intro.url) || fallbackImage,
      title: intro.name || "Intro Video",
    });
  }

  safeList(creator?.media?.portfolio).forEach((item, index) => {
    const details = item?.mediaDetails;
    if (!details?.url) return;

    const isVideo = details.type === "video";

    items.push({
      id: item?.id || `portfolio-${index}`,
      type: isVideo ? "video" : "image",
      url: details.url,
      image: isVideo ? getVideoPosterUrl(details.url) || fallbackImage : details.url,
      title: details.name || "Portfolio",
    });
  });

  return items;
};

export const mapCreatorToCard = (creator = {}) => {
  const firstName = creator?.firstName || "";
  const lastName = creator?.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim() || FALLBACK_VALUE;

  const city = creator?.city || "";
  const country = creator?.country || "";
  const location = [city, country].filter(Boolean).join(", ") || FALLBACK_VALUE;

  return {
    id: creator?.id,
    name: fullName,
    firstName,
    lastName,
    initials: getCreatorInitials(firstName, lastName),
    avatar: resolveCreatorImage(creator),
    bio: creator?.bio || "No bio available.",
    location,
    country,
    countryCode: getCountryCode(country),
    categories: safeList(creator?.categories).map((item) => item?.name).filter(Boolean),
    skills: safeList(creator?.skills).map((item) => item?.name).filter(Boolean),
    raw: creator,
  };
};

export const mapCreatorToView = (creator = {}) => {
  const cardData = mapCreatorToCard(creator);
  const displayName =
    creator?.publicName?.trim() || cardData.name || FALLBACK_VALUE;

  const languages = safeList(creator?.languages)
    .map((value) => optionLabel(value, creatorSelectOptions.languageSpoken))
    .filter(Boolean);

  const primaryNiches = safeList(creator?.primaryNiches).filter(Boolean);
  const secondaryNiches = safeList(creator?.secondaryNiches).filter(Boolean);

  const appearance = safeList(creator?.appearance)
    .map((value) => optionLabel(value, creatorSelectOptions.appearance))
    .filter(Boolean);

  const stats = [
    { label: "Public Creator Name", value: creator?.publicName?.trim() || null },
    { label: "Age", value: creator?.age ?? null },
    {
      label: "Gender",
      value: optionLabel(creator?.gender, creatorSelectOptions.gender) || null,
    },
    {
      label: "Ethnicity",
      value: optionLabel(creator?.ethnicity, creatorSelectOptions.ethnicity) || null,
    },
    { label: "Pets", value: formatBoolean(creator?.hasPets) },
    { label: "Language", value: languages.length ? languages.join(", ") : null },
    { label: "City", value: creator?.city || null },
    { label: "Province", value: creator?.province || null },
    { label: "Jobs Completed", value: creator?.jobsCompleted ?? null },
    { label: "Children", value: formatBoolean(creator?.hasChildren) },
  ].filter((item) => hasPresentValue(item.value));

  const portfolio = buildPortfolioItems(creator, cardData.avatar);
  const introVideoUrl = creator?.media?.introVideo?.mediaDetails?.url || null;

  return {
    id: cardData.id,
    displayName,
    creatorHeader: {
      name: displayName,
      legalName: cardData.name !== displayName ? cardData.name : null,
      initials: cardData.initials,
      image: cardData.avatar,
      verified: Boolean(creator?.isVerified),
      bio: creator?.bio || null,
      stats,
      rating: creator?.rating ?? null,
      reviewCount: creator?.reviewCount ?? null,
    },
    primaryNiches,
    secondaryNiches,
    appearance,
    skills: cardData.skills,
    portfolio,
    introVideoUrl,
    reviews: safeList(creator?.reviews),
  };
};
