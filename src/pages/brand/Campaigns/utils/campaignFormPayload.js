import {
  platformOptions,
  locationOptions,
  compensationOptions,
  selectOptions,
} from "../campaignFormOptions";
import { CAMPAIGN_ADD_ONS } from "../data/campaignCreatePricingData";
import { toApiVideoLength } from "./campaignApiMappers";

function getLabel(options, value) {
  return options.find((option) => option.value === value)?.label || "";
}

/** Builds the JSON payload object used by the wizard and API FormData. */
export function buildCampaignPayload(formData) {
  const platformLabels = (
    Array.isArray(formData.platform) ? formData.platform : [formData.platform]
  )
    .map((value) => getLabel(platformOptions, value))
    .filter(Boolean);

  const selectedLocations = Array.isArray(formData.locationCountry)
    ? formData.locationCountry
    : formData.locationCountry
      ? [formData.locationCountry]
      : [];

  const locationLabels = selectedLocations.includes("all")
    ? ["All"]
    : selectedLocations
        .map((value) => getLabel(locationOptions, value))
        .filter(Boolean);

  const addOnKeys = CAMPAIGN_ADD_ONS.filter((addon) =>
    (formData.selectedAddOns || []).includes(addon.id)
  ).map((addon) => addon.id);

  const hookLabel = getLabel(selectOptions.hook, formData.hook);
  const toneVoiceLabel = getLabel(selectOptions.toneVoice, formData.toneVoice);

  return {
    campaignTitle: formData.campaignTitle,
    deliverables: getLabel(selectOptions.deliverables, formData.deliverables),
    platform: platformLabels,
    location: locationLabels,
    numberOfCreators: formData.numberOfCreators,
    productServiceUrl: formData.productServiceUrl,
    addOns: addOnKeys,
    ageRange: formData.ageRange
      ? [getLabel(selectOptions.ageRange, formData.ageRange)]
      : [],
    gender: formData.gender ? [getLabel(selectOptions.gender, formData.gender)] : [],
    productStatus: getLabel(selectOptions.productStatus, formData.productStatus),
    compensationType:
      compensationOptions.find((o) => o.value === formData.compensationType)?.label || "",
    giftNameDescription: formData.giftName || formData.giftNameDescription || "",
    campaignGoal: formData.campaignGoal,
    followerCount: getLabel(selectOptions.followerCount, formData.followerCount),
    engagementRate: getLabel(selectOptions.engagementRate, formData.engagementRate),
    keyMessage: formData.keyMessage,
    campaignBrief: formData.campaignBrief,
    creativeDirection: {
      hookStyle: hookLabel,
      toneVoice: toneVoiceLabel,
      problem: formData.problem,
      solution: formData.solution,
      callToAction: formData.cta,
      aestheticVibes: formData.aestheticVibe,
      scriptingApproach: toneVoiceLabel,
    },
    applicationDeadline: formData.applicationDeadline,
    campaignStarts: formData.campaignStarts,
    petsRequired: Boolean(formData.petsRequired),
    typeOfPet: formData.petsRequired ? formData.typeOfPet : "",
    moodboardsInspiration: formData.moodboardSource === "upload" ? "Upload Images" : "URL",
    moodboardInspirationUrl:
      formData.moodboardSource === "url" ? formData.moodboardUrl : "",
    videoLength: formData.videoLength,
  };
}

/**
 * Builds multipart FormData for POST /campaigns and PATCH /campaigns/:publicId.
 * @see docs/NW_CAMPAIGNAPI_INTEGRATION.md
 */
export function buildCampaignFormData({ formData, productImage, moodboardFiles }) {
  const payload =
    formData?.campaignTitle !== undefined && formData?.creativeDirection
      ? formData
      : buildCampaignPayload(formData);

  const fd = new FormData();

  const append = (key, value) => {
    if (value === undefined || value === null || value === "") return;
    fd.append(key, value);
  };

  const appendArray = (key, value) => {
    if (!Array.isArray(value) || value.length === 0) return;
    fd.append(key, JSON.stringify(value));
  };

  append("campaignTitle", payload.campaignTitle);
  append("deliverables", payload.deliverables);
  append("numberOfCreators", payload.numberOfCreators);
  append("productServiceUrl", payload.productServiceUrl);
  append("productStatus", payload.productStatus);
  append("compensationType", payload.compensationType);
  append("giftNameDescription", payload.giftNameDescription);
  append("campaignGoal", payload.campaignGoal);
  append("followerCount", payload.followerCount);
  append("engagementRate", payload.engagementRate);
  append("keyMessage", payload.keyMessage);
  append("campaignBrief", payload.campaignBrief);
  append("applicationDeadline", payload.applicationDeadline);
  append("campaignStarts", payload.campaignStarts);
  append("typeOfPet", payload.typeOfPet);
  append("moodboardsInspiration", payload.moodboardsInspiration);
  append("moodboardInspirationUrl", payload.moodboardInspirationUrl);

  append("videoLength", toApiVideoLength(payload.videoLength));

  fd.append("petsRequired", String(payload.petsRequired === true));

  appendArray("platform", payload.platform);
  appendArray("location", payload.location);
  appendArray("ageRange", payload.ageRange);
  appendArray("gender", payload.gender);
  appendArray("addOns", payload.addOns);

  if (payload.creativeDirection) {
    fd.append("creativeDirection", JSON.stringify(payload.creativeDirection));
  }

  if (productImage instanceof File) {
    fd.append("coverImage", productImage);
  }

  const validMoodboards = Array.isArray(moodboardFiles)
    ? moodboardFiles.filter((file) => file instanceof File)
    : [];
  validMoodboards.forEach((file) => fd.append("moodboards", file));

  return fd;
}

export function buildPricingSignature(formData) {
  return `${formData.videoLength}|${formData.numberOfCreators}|${(formData.selectedAddOns || []).join(",")}`;
}

export function getApiErrorMessage(error) {
  if (typeof error === "string") return error;
  if (error?.error) return error.error;
  if (error?.message && !error?.response) return error.message;
  if (Array.isArray(error?.errors) && error.errors[0]?.message) {
    return error.errors[0].message;
  }
  const status = error?.response?.status;
  const data = error?.response?.data;
  if (data) {
    if (typeof data === "string") return data;
    if (data.error) return data.error;
    if (data.message) return data.message;
    if (Array.isArray(data.errors) && data.errors[0]?.message) {
      return data.errors[0].message;
    }
  }
  if (status === 423) {
    return "This campaign is locked while payment is processing. Please try again later.";
  }
  if (status === 403) {
    return "You don't have permission to perform this action on this campaign.";
  }
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
}
