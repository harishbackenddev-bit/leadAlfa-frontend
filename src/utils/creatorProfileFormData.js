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
  appendTextField(fd, "streetNumber", basic.streetNumber || "");
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
