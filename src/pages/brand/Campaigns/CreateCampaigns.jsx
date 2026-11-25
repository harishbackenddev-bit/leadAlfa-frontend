import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampaignForm from "./CampaignForm";
import {
  createCampaign,
  updateCampaignByPublicId,
  publishCampaign,
  fundCampaign,
  getCampaignPaymentStatus,
} from "../../../services/api/apiservices";
import { invalidateCampaigns } from "../../../services/tanstack/queryService";
import {
  buildCampaignFormData,
  getApiErrorMessage,
} from "./utils/campaignFormPayload";
import { normalizeCampaignSaveResponse } from "./utils/campaignApiMappers";

const PAID_BATCH_STATUSES = ["FULLY_FUNDED", "PAID", "COMPLETED"];
const PAID_CAMPAIGN_STATUSES = ["FUNDS_RECEIVED", "FUNDED", "PAID"];
const FAILED_BATCH_STATUSES = ["FAILED", "CANCELLED", "EXPIRED", "DECLINED"];

const pollFundingStatus = async (
  campaignId,
  { intervalMs = 3000, maxAttempts = 100 } = {}
) => {
  if (!campaignId) return false;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const res = await getCampaignPaymentStatus(campaignId);
      const result = res?.data ?? res;

      if (result?.isFullyFunded) return true;

      const batchStatus = result?.fundingBatch?.status;
      if (PAID_BATCH_STATUSES.includes(batchStatus)) return true;
      if (PAID_CAMPAIGN_STATUSES.includes(result?.fundingStatus)) return true;

      if (FAILED_BATCH_STATUSES.includes(batchStatus)) return false;
    } catch {
      // transient network errors — keep polling
    }

    await new Promise((r) => setTimeout(r, intervalMs));
  }

  return false;
};

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
    if (isSubmitting) return;
    if (!fundingQuote?.paymentMethod) {
      throw new Error("Please select a payment method first");
    }

    setIsSubmitting(true);
    try {
      const fundRes = await fundCampaign(campaignPublicId, {
        paymentMethod: fundingQuote.paymentMethod,
        quoteVersion: fundingQuote.quoteVersion,
      });
      const fundData = fundRes?.data?.success ? fundRes.data : fundRes;

      const walletUrl = fundData?.fundingBatch?.walletDepositUrl;
      if (!walletUrl) throw new Error("No wallet deposit link received.");

      window.open(walletUrl, "_blank", "noopener,noreferrer");

      const paid = await pollFundingStatus(campaignPublicId);
      if (!paid) throw new Error("Payment not completed.");

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
