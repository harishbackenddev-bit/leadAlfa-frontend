import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampaignForm from "./CampaignForm";
import {
  createCampaign,
  updateCampaignByPublicId,
  publishCampaign,
  fundCampaign,
  simulateFunded,
} from "../../../services/api/apiservices";
import { invalidateCampaigns } from "../../../services/tanstack/queryService";
import {
  buildCampaignFormData,
  getApiErrorMessage,
} from "./utils/campaignFormPayload";
import {
  normalizeCampaignSaveResponse,
} from "./utils/campaignApiMappers";

export default function CreateCampaigns() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveCampaign = async ({
    formData,
    productImage,
    moodboardFiles,
    campaignPublicId,
  }) => {
    const fd = buildCampaignFormData({ formData, productImage, moodboardFiles });

    const rawResponse = campaignPublicId
      ? await updateCampaignByPublicId(campaignPublicId, fd)
      : await createCampaign(fd);

    const response = normalizeCampaignSaveResponse(rawResponse);
    if (!response?.campaign) {
      throw new Error(getApiErrorMessage(rawResponse) || "Failed to save campaign.");
    }

    return response;
  };

  const handleSaveSuccess = () => {
    invalidateCampaigns();
  };

  const handlePublishCampaign = async (campaignPublicId) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // STEP 1: Fund campaign wallet
      const fundRes = await fundCampaign(campaignPublicId);
      const fundData = fundRes?.data?.success ? fundRes.data : fundRes;

      const walletUrl = fundData?.fundingBatch?.walletDepositUrl;
      if (!walletUrl) throw new Error("No wallet deposit link received.");

      // Open payment page
      window.open(walletUrl, "_blank", "noopener,noreferrer");

      // STEP 2: Sandbox — simulate funding
      if (process.env.NODE_ENV !== "production") {
        try {
          await simulateFunded(campaignPublicId);
        } catch (simErr) {
          console.warn("Simulate failed:", simErr.message);
        }
      }

      // STEP 3: Publish
      const response = await publishCampaign(campaignPublicId);
      if (!response?.campaignPublicId && !response?.invoicePublicId) {
        throw new Error(response?.message || "Failed to publish campaign.");
      }

      invalidateCampaigns();
      navigate("/brand/campaigns");
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CampaignForm
      title="Create Campaign"
      subtitle="Complete all steps to create a new campaign."
      submitLabel={isSubmitting ? "Processing..." : "Publish Campaign"}
      onSaveCampaign={handleSaveCampaign}
      onSaveSuccess={handleSaveSuccess}
      onPublishCampaign={handlePublishCampaign}
      isSubmitting={isSubmitting}
    />
  );
}