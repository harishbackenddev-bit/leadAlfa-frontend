const isValidHttpUrl = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) return false;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const url = new URL(withProtocol);
    return ["http:", "https:"].includes(url.protocol);
  } catch {
    return false;
  }
};

const hasCoverImage = (coverImage) => {
  if (coverImage instanceof File) return true;
  if (typeof coverImage === "string" && coverImage.trim()) return true;
  return false;
};

const hasMoodboardMedia = (moodboards, existingMoodboardUrls) => {
  if (moodboards?.some(Boolean)) return true;
  if (existingMoodboardUrls?.some((url) => typeof url === "string" && url.trim())) {
    return true;
  }
  return false;
};

/** Maximum creators allowed per campaign in the create/edit wizard. */
export const MAX_CAMPAIGN_CREATORS = 20;

/** Digits only, clamped 1–MAX. Empty string allowed while typing. */
export function sanitizeCreatorCountInput(raw) {
  const digits = String(raw ?? "").replace(/\D/g, "");
  if (!digits) return "";
  const num = Number.parseInt(digits, 10);
  if (!Number.isFinite(num) || num < 1) return "";
  return String(Math.min(MAX_CAMPAIGN_CREATORS, num));
}

export function validateCreatorCount(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return "Required";
  if (!/^\d+$/.test(raw)) {
    return `Enter a whole number between 1 and ${MAX_CAMPAIGN_CREATORS}`;
  }
  const num = Number.parseInt(raw, 10);
  if (num < 1 || num > MAX_CAMPAIGN_CREATORS) {
    return `Enter a number between 1 and ${MAX_CAMPAIGN_CREATORS}`;
  }
  return null;
}

export function validateCampaignCreateStep(
  stepKey,
  formData,
  { coverImage, moodboards, existingMoodboardUrls } = {}
) {
  const errors = {};
  const isGift = formData.compensationType === "gift";

  switch (stepKey) {
    case "basics":
      if (!formData.campaignTitle?.trim()) errors.campaignTitle = "Required";
      if (!formData.campaignBrief?.trim()) errors.campaignBrief = "Required";
      if (!formData.deliverables) errors.deliverables = "Required";
      if (!formData.platform?.length) errors.platform = "Required";
      if (!isGift && !formData.videoLength) errors.videoLength = "Required";
      if (!formData.compensationType) errors.compensationType = "Required";
      if (!formData.productStatus) errors.productStatus = "Required";
      break;

    case "audience":
      if (!formData.ageRange) errors.ageRange = "Required";
      if (!formData.gender) errors.gender = "Required";
      if (!formData.followerCount) errors.followerCount = "Required";
      if (!formData.engagementRate) errors.engagementRate = "Required";
      {
        const creatorError = validateCreatorCount(formData.numberOfCreators);
        if (creatorError) errors.numberOfCreators = creatorError;
      }
      break;

    case "creative":
      if (!formData.hook) errors.hook = "Required";
      if (!formData.toneVoice) errors.toneVoice = "Required";
      if (formData.petsRequired && !formData.typeOfPet?.trim()) {
        errors.typeOfPet = "Required when pet is required";
      }
      if (!hasCoverImage(coverImage)) errors.coverImage = "Cover image is required";
      break;

    case "moodboard":
      if (formData.moodboardSource === "url") {
        if (!formData.moodboardUrl?.trim()) {
          errors.moodboardUrl = "Required";
        } else if (!isValidHttpUrl(formData.moodboardUrl)) {
          errors.moodboardUrl = "Enter a valid URL";
        }
      } else if (!hasMoodboardMedia(moodboards, existingMoodboardUrls)) {
        errors.moodboards = "Upload at least one moodboard image";
      }
      break;

    case "addons":
    case "review":
    default:
      break;
  }

  return errors;
}

export function validateFullCampaignForm(formData, extras = {}) {
  const allErrors = {};
  ["basics", "audience", "creative", "moodboard"].forEach((key) => {
    Object.assign(allErrors, validateCampaignCreateStep(key, formData, extras));
  });
  return allErrors;
}

export function findFirstInvalidStepKey(formData, extras = {}) {
  return ["basics", "audience", "creative", "moodboard"].find(
    (key) => Object.keys(validateCampaignCreateStep(key, formData, extras)).length > 0
  );
}
