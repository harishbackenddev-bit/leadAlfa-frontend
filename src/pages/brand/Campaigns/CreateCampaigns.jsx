import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampaignForm from "./CampaignForm";
import {
  createCampaign,
  updateCampaignByPublicId,
  publishCampaign,
  fundCampaign,
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

    // ✅ Require payment method
    if (!fundingQuote || !fundingQuote.paymentMethod) {
      throw new Error("Please select a payment method first");
    }

    setIsSubmitting(true);

    try {
      // STEP 1: Fund campaign with selected method
      const fundRes = await fundCampaign(campaignPublicId, {
        paymentMethod: fundingQuote.paymentMethod,
        quoteVersion: fundingQuote.quoteVersion,
      });
      const fundData = fundRes?.data?.success ? fundRes.data : fundRes;

      const walletUrl = fundData?.fundingBatch?.walletDepositUrl;
      if (!walletUrl) throw new Error("No wallet deposit link received.");

      window.open(walletUrl, "_blank", "noopener,noreferrer");

      // STEP 2: Publish
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