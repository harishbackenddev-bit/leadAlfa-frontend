import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampaignForm from "./CampaignForm";
import {
  createCampaign,
  updateCampaignByPublicId,
  publishCampaign,
  fundCampaign,
  // ❌ simulateFunded,   // comment out — real webhook confirms
} from "../../../services/api/apiservices";
import { invalidateCampaigns } from "../../../services/tanstack/queryService";
import {
  buildCampaignFormData,
  getApiErrorMessage,
} from "./utils/campaignFormPayload";
import { normalizeCampaignSaveResponse } from "./utils/campaignApiMappers";

export default function CreateCampaigns() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fundingQuote, setFundingQuote] = useState(null);

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
      throw new Error(
        getApiErrorMessage(rawResponse) || "Failed to save campaign."
      );
    }

    return response;
  };

  const handleSaveSuccess = () => {
    invalidateCampaigns();
  };

  const handlePublishCampaign = async (campaignPublicId) => {
    console.log("🚀 PUBLISH CLICKED (Create)");
    console.log("   campaignPublicId:", campaignPublicId);
    console.log("   fundingQuote:", fundingQuote);

    if (isSubmitting) return;

    if (!fundingQuote) {
      throw new Error("Please wait for the fee estimate to load");
    }

    setIsSubmitting(true);

    try {
      // STEP 1: Fund campaign (no payment method — TradeSafe handles it)
      const fundRes = await fundCampaign(campaignPublicId);
      const fundData = fundRes?.data?.success ? fundRes.data : fundRes;

      const walletUrl = fundData?.fundingBatch?.walletDepositUrl;
      if (!walletUrl) throw new Error("No wallet deposit link received.");

      window.open(walletUrl, "_blank", "noopener,noreferrer");

      // ❌ REMOVED: simulateFunded — real webhook confirms

      // STEP 2: Publish (only if funds received)
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
  fundingQuote={fundingQuote}
  onQuoteChange={setFundingQuote}
    />
  );
}