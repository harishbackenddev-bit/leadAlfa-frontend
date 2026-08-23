import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampaignForm from "./CampaignForm";
import { createCampaign } from "../../../services/api/apiservices";

export default function CreateCampaigns() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateCampaign = async ({ formData, productImage, moodboardFiles }) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const fd = new FormData();

      // Helper: append only when value is non-empty string/number/boolean
      const append = (key, value) => {
        if (value === undefined || value === null || value === "") return;
        fd.append(key, value);
      };

      // Helper: append array as JSON string (matches cURL format: "[\"val\"]")
      const appendArray = (key, value) => {
        if (!Array.isArray(value)) return;
        fd.append(key, JSON.stringify(value));
      };

      // ── Text fields ──────────────────────────────────────────────────────
      append("campaignTitle",             formData.campaignTitle);
      append("deliverables",              formData.deliverables);
      append("numberOfCreators",          formData.numberOfCreators);
      append("productServiceUrl",         formData.productServiceUrl);
      append("usageRightsIncluded",       formData.usageRightsIncluded);
      append("productStatus",             formData.productStatus);
      append("compensationType",          formData.compensationType);
      append("minBudget",                 formData.minBudget);
      append("maxBudget",                 formData.maxBudget);
      append("giftNameDescription",       formData.giftNameDescription);
      append("whitelistingSparkAds",      formData.whitelistingSparkAds);
      append("campaignGoal",              formData.campaignGoal);
      append("followerCount",             formData.followerCount);
      append("engagementRate",            formData.engagementRate);
      append("additionalAudienceDetails", formData.additionalAudienceDetails);
      append("keyMessage",                formData.keyMessage);
      append("campaignBrief",             formData.campaignBrief);
      append("dos",                       formData.dos);
      append("donts",                     formData.donts);
      append("applicationDeadline",       formData.applicationDeadline);
      append("campaignStarts",            formData.campaignStarts);
      append("typeOfPet",                 formData.typeOfPet);
      append("moodboardsInspiration",     formData.moodboardsInspiration);

      // ── Boolean: must always be "true" or "false" string ─────────────────
      fd.append("petsRequired", String(formData.petsRequired === true));

      // ── Send moodboard URL only when present and valid from form payload ──
      append("moodboardInspirationUrl", formData.moodboardInspirationUrl);

      // ── JSON arrays ───────────────────────────────────────────────────────
      appendArray("platform",  formData.platform);
      appendArray("location",  formData.location);
      appendArray("ageRange",  formData.ageRange);
      appendArray("gender",    formData.gender);
      appendArray("addOns",    formData.addOns);

      // ── JSON object ───────────────────────────────────────────────────────
      if (formData.creativeDirection) {
        fd.append("creativeDirection", JSON.stringify(formData.creativeDirection));
      }

      // ── Files ─────────────────────────────────────────────────────────────
      if (productImage) {
        fd.append("coverImage", productImage);
      }

      const validMoodboards = Array.isArray(moodboardFiles)
        ? moodboardFiles.filter(Boolean)
        : [];
      validMoodboards.forEach((file) => fd.append("moodboards", file));

      const response = await createCampaign(fd);

      if (!response?.campaign) {
        throw new Error(response?.message || "Failed to create campaign.");
      }

      navigate("/brand/campaigns");
    } catch (error) {
      console.error("Create campaign error:", error);
      alert(error?.message || "Failed to create campaign. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CampaignForm
      title="CREATE CAMPAIGN"
      subtitle="Complete all steps to create a new campaign"
      submitLabel={isSubmitting ? "Publishing..." : "Publish Campaign"}
      onSubmit={handleCreateCampaign}
    />
  );
}
