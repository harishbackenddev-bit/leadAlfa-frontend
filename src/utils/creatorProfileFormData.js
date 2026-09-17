/**
 * Shared helpers for POST /creator/profile (multipart/form-data).
 * Array fields must be JSON.stringify'd; URLs normalized to https.
 */

export const appendTextField = (formData, key, value) => {
  if (value === undefined || value === null) return;
  const text = String(value).trim();
  if (!text) return;
  formData.append(key, text);
};

export const appendBooleanFieldFromYesNo = (formData, key, value) => {
  if (value === "yes") {
    formData.append(key, "true");
  } else if (value === "no") {
    formData.append(key, "false");
  }
};

export const appendJsonArrayField = (formData, key, value) => {
  if (!Array.isArray(value)) return;
  formData.append(key, JSON.stringify(value));
};

/** Normalize optional/required URL fields to a valid https URL, or "" if empty/invalid. */
export const normalizeCreatorProfileUrl = (value) => {
  if (typeof value !== "string") return "";
  const trimmed = value.trim();
  if (!trimmed) return "";
  let withProto = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
  withProto = withProto.replace(/^http:\/\//i, "https://");
  try {
    const u = new URL(withProto);
    if (u.protocol !== "https:") return "";
    return u.href;
  } catch {
    return "";
  }
};

export const normalizeIntegerArray = (value) => {
  if (!Array.isArray(value)) return [];
  return [
    ...new Set(
      value
        .map((item) => Number.parseInt(String(item), 10))
        .filter((n) => Number.isInteger(n))
    ),
  ];
};

/** API expects appearance as a JSON array string (e.g. ["plus_size"]). */
export const appearanceValuesToJsonArray = (appearance) => {
  if (Array.isArray(appearance)) {
    return appearance.map(String).filter((s) => s.length > 0);
  }
  if (appearance == null || appearance === "") return [];
  return [String(appearance)];
};

/** Strip https:// prefix for URL inputs that show a static prefix in the UI. */
export const stripUrlForFormInput = (url) => {
  if (!url) return "";
  return String(url).trim().replace(/^https?:\/\//i, "");
};

export const booleanToYesNo = (value, fallback = "no") => {
  if (value === true || value === "true") return "yes";
  if (value === false || value === "false") return "no";
  return fallback;
};

/**
 * Map GET /creator/profile payload into react-hook-form values for edit.
 */
export function mapCreatorProfileToEditFormValues(profile = {}, user = {}) {
  const categories = Array.isArray(profile.categories) ? profile.categories : [];
  const categoryIds = categories
    .map((item) => (typeof item === "object" ? item?.id : item))
    .filter((id) => id != null);

  const appearance = Array.isArray(profile.appearance)
    ? profile.appearance[0] ?? ""
    : profile.appearance || "";

  const languages = Array.isArray(profile.languages)
    ? profile.languages.map(String)
    : [];

  const isSouthAfrican = profile.isSouthAfricanCitizen;

  return {
    firstName: profile.firstName || user?.firstName || "",
    lastName: profile.lastName || user?.lastName || "",
    email: profile.email || user?.email || "",
    phoneNumber: profile.phoneNumber || "",
    publicCreatorName: profile.publicName || profile.publicCreatorName || user?.publicName || "",
    dateOfBirth: profile.dateOfBirth
      ? String(profile.dateOfBirth).split("T")[0]
      : "",
    ethnicity: profile.ethnicity || "",
    appearance,
    gender: profile.gender || "",
    bio: profile.bio || "",
    saCitizen: booleanToYesNo(
      isSouthAfrican,
      isSouthAfrican == null ? "yes" : "no"
    ),
    saIdNumber: profile.saIdNumber || "",
    passportNumber: profile.passportNumber || "",
    province: profile.province || "",
    city: profile.city || "",
    addressLine1: profile.addressLine1 || profile.streetNumber || "",
    addressLine2: profile.addressLine2 || "",
    suburb: profile.suburb || "",
    postalCode: profile.postalZipCode || profile.postalCode || "",
    deliveryInstructions: profile.deliveryInstructions || "",
    languageSpoken: languages,
    primaryNiche: categoryIds[0] != null ? String(categoryIds[0]) : "",
    secondaryNiche:
      categoryIds[1] != null ? String(categoryIds[1]) : undefined,
    hasPets: booleanToYesNo(profile.hasPets, "no"),
    hasChildren: booleanToYesNo(profile.hasChildren, "no"),
    tiktokUrl: stripUrlForFormInput(profile.tiktokUrl),
    instagramUrl: stripUrlForFormInput(profile.instagramUrl),
    youtubeUrl: stripUrlForFormInput(
      profile.youtubeChannelUrl || profile.youtubeUrl
    ),
    skillsUrl: stripUrlForFormInput(profile.skillsUrl),
    profilePhoto: undefined,
    introVideo: undefined,
    residencePermit: undefined,
  };
}

export const MAX_CREATOR_PORTFOLIO_VIDEOS = 5;
export const MAX_CREATOR_PORTFOLIO_VIDEO_SIZE = 120 * 1024 * 1024;
const ACCEPTED_PORTFOLIO_VIDEO_TYPES = ["video/mp4", "video/quicktime"];

export function getCreatorIntroVideoUrl(profile) {
  return (
    profile?.media?.introVideo?.mediaDetails?.url ||
    profile?.media?.introVideo?.url ||
    null
  );
}

function getMediaItemUrl(item) {
  return item?.mediaDetails?.url || item?.url || null;
}

function isVideoMediaItem(item, url) {
  const type = String(item?.mediaDetails?.type || item?.type || "").toLowerCase();
  if (type.includes("video")) return true;
  if (type.includes("image") || type.includes("photo")) return false;
  return Boolean(url && /\.(mp4|mov|webm)(\?|$)/i.test(url));
}

/** Up to 5 portfolio videos from GET /creator/profile media.portfolio. */
export function getCreatorPortfolioVideos(profile) {
  const list = Array.isArray(profile?.media?.portfolio)
    ? profile.media.portfolio
    : [];

  return list
    .map((item, index) => {
      const url = getMediaItemUrl(item);
      if (!url || !isVideoMediaItem(item, url)) return null;
      const mediaId = item?.mediaId || item?.mediaDetails?.id || item?.id;
      return {
        id: item?.id || `portfolio-${index}`,
        mediaId,
        url,
        title: item?.mediaDetails?.name || item?.name || `Portfolio ${index + 1}`,
      };
    })
    .filter(Boolean)
    .slice(0, MAX_CREATOR_PORTFOLIO_VIDEOS);
}

export function getPortfolioVideoFileError(file) {
  if (!(file instanceof File)) return "Choose a video file";
  if (!ACCEPTED_PORTFOLIO_VIDEO_TYPES.includes(file.type)) {
    return "Use MP4 or MOV format";
  }
  if (file.size > MAX_CREATOR_PORTFOLIO_VIDEO_SIZE) {
    return "Video must be under 120MB";
  }
  return null;
}

/** Limits per POST /creator/profile/reupload-documents spec. */
export const MAX_REUPLOAD_RESIDENCE_PERMIT_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_REUPLOAD_INTRO_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB
const ACCEPTED_REUPLOAD_RESIDENCE_PERMIT_TYPES = ["application/pdf"];
const ACCEPTED_REUPLOAD_INTRO_VIDEO_TYPES = ["video/mp4", "video/quicktime"];

export function getReuploadResidencePermitFileError(file) {
  if (!(file instanceof File)) return "Choose a PDF file";
  if (!ACCEPTED_REUPLOAD_RESIDENCE_PERMIT_TYPES.includes(file.type)) {
    return "Only PDF files are accepted";
  }
  if (file.size > MAX_REUPLOAD_RESIDENCE_PERMIT_SIZE) {
    return "File must be under 10MB";
  }
  return null;
}

export function getReuploadIntroVideoFileError(file) {
  if (!(file instanceof File)) return "Choose a video file";
  if (!ACCEPTED_REUPLOAD_INTRO_VIDEO_TYPES.includes(file.type)) {
    return "Use MP4 or MOV format";
  }
  if (file.size > MAX_REUPLOAD_INTRO_VIDEO_SIZE) {
    return "Video must be under 100MB";
  }
  return null;
}

/**
 * Build multipart FormData for POST /creator/profile/reupload-documents.
 * At least one of residencePermit/introVideo must be provided by the caller.
 */
export function buildReuploadDocumentsFormData({
  residencePermit,
  introVideo,
} = {}) {
  const fd = new FormData();

  if (residencePermit instanceof File) {
    fd.append("residencePermit", residencePermit);
  }

  if (introVideo instanceof File) {
    fd.append("introVideo", introVideo);
  }

  return fd;
}

/**
 * Build multipart FormData for adding portfolio videos via POST /creator/profile.
 * Sends current profile fields plus new portfolio files (does not replace intro video).
 */
export function buildCreatorPortfolioUploadFormData({
  profile = {},
  user = {},
  files = [],
}) {
  const mapped = mapCreatorProfileToEditFormValues(profile, user);
  const { primaryNiche, secondaryNiche, languageSpoken, ...rest } = mapped;

  const nicheIds = [primaryNiche, secondaryNiche].filter(Boolean);
  const uniqueNiches = [...new Set(nicheIds)];
  const existingSkillIds = Array.isArray(profile.skills)
    ? profile.skills.map((skill) => skill.id).filter(Boolean)
    : [];

  const categoryNames = (Array.isArray(profile.categories) ? profile.categories : [])
    .map((item) => (typeof item === "object" ? item?.name : item))
    .filter(Boolean)
    .map(String);

  const primaryNiches =
    Array.isArray(profile.primaryNiches) && profile.primaryNiches.length > 0
      ? profile.primaryNiches.map(String).filter(Boolean)
      : categoryNames[0]
        ? [categoryNames[0]]
        : [];
  const secondaryNiches =
    Array.isArray(profile.secondaryNiches) && profile.secondaryNiches.length > 0
      ? profile.secondaryNiches.map(String).filter(Boolean)
      : categoryNames[1]
        ? [categoryNames[1]]
        : [];

  const remainingSlots = Math.max(
    0,
    MAX_CREATOR_PORTFOLIO_VIDEOS - getCreatorPortfolioVideos(profile).length
  );
  const portfolioFiles = (Array.isArray(files) ? files : [])
    .filter((file) => file instanceof File)
    .slice(0, remainingSlots);

  return buildCreatorProfileFormData({
    formData: {
      categories: uniqueNiches,
      skills: existingSkillIds,
      basicInfo: {
        ...rest,
        languages: Array.isArray(languageSpoken) ? languageSpoken : [],
        introVideo: undefined,
        primaryNiches,
        secondaryNiches,
        portfolio: portfolioFiles,
      },
    },
    user,
  });
}

/**
 * Build multipart FormData for creator profile update from edit form values.
 */
export function buildCreatorEditProfileFormData({
  formValues,
  categoryOptions = [],
  existingSkillIds = [],
}) {
  const {
    primaryNiche,
    secondaryNiche,
    languageSpoken,
    introVideo,
    ...rest
  } = formValues;

  const nicheIds = [primaryNiche, secondaryNiche].filter(Boolean);
  const uniqueNiches = [...new Set(nicheIds)];

  const primaryLabel = categoryOptions.find(
    (option) => option.value === String(primaryNiche)
  )?.label;
  const secondaryLabel =
    secondaryNiche != null && String(secondaryNiche).trim() !== ""
      ? categoryOptions.find(
          (option) => option.value === String(secondaryNiche)
        )?.label
      : null;

  return buildCreatorProfileFormData({
    formData: {
      categories: uniqueNiches,
      skills: existingSkillIds,
      basicInfo: {
        ...rest,
        languages: Array.isArray(languageSpoken) ? languageSpoken : [],
        introVideo,
        primaryNiches: primaryLabel ? [primaryLabel] : [],
        secondaryNiches: secondaryLabel ? [secondaryLabel] : [],
      },
    },
  });
}

/**
 * @param {object} params
 * @param {object} params.formData - signup flow shape: { basicInfo, categories, skills }
 * @param {object} [params.user]
 * @returns {FormData}
 */
export function buildCreatorProfileFormData({ formData, user = {} }) {
  const fd = new FormData();
  const basic = formData.basicInfo || {};

  appendTextField(fd, "firstName", basic.firstName || user?.firstName || "");
  appendTextField(fd, "lastName", basic.lastName || user?.lastName || "");
  appendTextField(
    fd,
    "publicName",
    basic.publicCreatorName || basic.displayName || ""
  );
  appendTextField(fd, "email", basic.email || user?.email || "");
  appendTextField(fd, "phoneNumber", basic.phoneNumber || "");
  appendTextField(fd, "dateOfBirth", basic.dateOfBirth || "");
  appendBooleanFieldFromYesNo(fd, "isSouthAfricanCitizen", basic.saCitizen);
  appendTextField(
    fd,
    "saIdNumber",
    basic.saCitizen === "yes" ? basic.saIdNumber || "" : ""
  );
  appendTextField(
    fd,
    "passportNumber",
    basic.saCitizen === "no" ? basic.passportNumber || "" : ""
  );
  appendTextField(fd, "province", basic.province || "");
  appendTextField(fd, "city", basic.city || "");
  appendTextField(
    fd,
    "addressLine1",
    basic.addressLine1 || basic.streetNumber || ""
  );
  appendTextField(fd, "addressLine2", basic.addressLine2 || "");
  appendTextField(fd, "suburb", basic.suburb || "");
  appendTextField(
    fd,
    "streetNumber",
    basic.streetNumber || basic.addressLine1 || ""
  );
  appendTextField(
    fd,
    "postalCode",
    basic.postalCode || basic.postalZipCode || ""
  );
  appendTextField(
    fd,
    "postalZipCode",
    basic.postalCode || basic.postalZipCode || ""
  );
  appendTextField(fd, "country", "South Africa");
  appendTextField(fd, "deliveryInstructions", basic.deliveryInstructions || "");
  appendTextField(fd, "ethnicity", basic.ethnicity || "");
  appendTextField(fd, "gender", basic.gender || "");
  appendTextField(fd, "bio", basic.bio || "");
  appendBooleanFieldFromYesNo(fd, "hasPets", basic.hasPets);
  appendBooleanFieldFromYesNo(fd, "hasChildren", basic.hasChildren);
  appendTextField(
    fd,
    "instagramUrl",
    normalizeCreatorProfileUrl(basic.instagramUrl)
  );
  appendTextField(fd, "tiktokUrl", normalizeCreatorProfileUrl(basic.tiktokUrl));
  appendTextField(
    fd,
    "youtubeChannelUrl",
    normalizeCreatorProfileUrl(basic.youtubeUrl)
  );
  appendTextField(
    fd,
    "skillsUrl",
    normalizeCreatorProfileUrl(basic.skillsUrl)
  );

  const appearanceArr = appearanceValuesToJsonArray(basic.appearance);
  appendJsonArrayField(fd, "appearance", appearanceArr);

  const languages = Array.isArray(basic.languages)
    ? basic.languages
    : Array.isArray(basic.languageSpoken)
      ? basic.languageSpoken
      : basic.languageSpoken
        ? [basic.languageSpoken]
        : [];
  appendJsonArrayField(
    fd,
    "languages",
    languages.map((item) => String(item))
  );

  appendJsonArrayField(
    fd,
    "categories",
    normalizeIntegerArray(formData.categories)
  );
  appendJsonArrayField(fd, "skills", normalizeIntegerArray(formData.skills));

  const primaryNiches = Array.isArray(basic.primaryNiches)
    ? basic.primaryNiches.map(String).filter(Boolean)
    : [];
  const secondaryNiches = Array.isArray(basic.secondaryNiches)
    ? basic.secondaryNiches.map(String).filter(Boolean)
    : [];
  appendJsonArrayField(fd, "primaryNiches", primaryNiches);
  appendJsonArrayField(fd, "secondaryNiches", secondaryNiches);

  if (basic.profilePhoto instanceof File) {
    fd.append("profilePhoto", basic.profilePhoto);
  }

  if (basic.residencePermit instanceof File) {
    fd.append("residencePermit", basic.residencePermit);
  }

  if (basic.introVideo instanceof File) {
    fd.append("introVideo", basic.introVideo);
  }

  if (Array.isArray(basic.portfolio)) {
    basic.portfolio.forEach((file) => {
      if (file instanceof File) {
        fd.append("portfolio", file);
      }
    });
  }

  return fd;
}
