import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampaignForm from "./CampaignForm";
import {
  createCampaign,
  updateCampaignByPublicId,
} from "../../../services/api/apiservices";
import { invalidateCampaigns } from "../../../services/tanstack/queryService";
import {
  buildCampaignFormData,
  getApiErrorMessage,
} from "./utils/campaignFormPayload";
import { normalizeCampaignSaveResponse } from "./utils/campaignApiMappers";
import {
  openPaymentTab,
  startCampaignFunding,
} from "./utils/campaignPaymentFlow";


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

  /**
   * Payment happens once, here, while the draft is being published.
   * The server activates the campaign when TradeSafe confirms the deposit
   * (webhook) - the client must NOT call POST /publish afterwards.
   */
  const handlePublishCampaign = async (campaignPublicId) => {
    if (isSubmitting) return;
    if (!fundingQuote?.paymentMethod) {
      throw new Error("Please select a payment method first");
    }

    // Open the payment tab inside the click gesture (before any await),
    // otherwise popup blockers stop it.
    const paymentTab = openPaymentTab();

    setIsSubmitting(true);
    try {
      const result = await startCampaignFunding({
        campaignPublicId,
        fundingQuote,
        paymentTab,
      });

      if (result === "failed") {
        throw new Error("Payment was not completed. Please try again.");
      }

      // "paid"      -> campaign is live.
      // "timeout" / "redirected" -> still confirming; it goes live automatically
      //                             once TradeSafe confirms, and shows in the list.
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