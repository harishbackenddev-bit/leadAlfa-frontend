import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Button } from "antd";
import { CheckCircle2 } from "lucide-react";
import CampaignForm from "./CampaignForm";
import { useCampaign } from "./hooks/useViewCampaigns";
import { getRawCampaignStatus, isDraftCampaign } from "./utils/campaignCardUtils";
import { updateCampaignByPublicId } from "../../../services/api/apiservices";
import {
  buildCampaignFormData,
  getApiErrorMessage,
} from "./utils/campaignFormPayload";
import { normalizeCampaignSaveResponse } from "./utils/campaignApiMappers";
import {
  openPaymentTab,
  startCampaignFunding,
} from "./utils/campaignPaymentFlow";
import { invalidateCampaigns } from "../../../services/tanstack/queryService";
import { CAMPAIGN_CREATE_STEPS } from "./data/campaignCreateStepsData";

const REVIEW_STEP = CAMPAIGN_CREATE_STEPS.length;

export default function EditCampaigns() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState(null);


  const [fundingQuote, setFundingQuote] = useState(null);

  const closeFeedbackModal = useCallback(() => setFeedbackModal(null), []);

  const campaignIdentifier =
    location.state?.campaignId || location.state?.publicId || location.state?.id;

  const openReviewStep = Boolean(location.state?.openReviewStep);
  const initialStep = openReviewStep ? REVIEW_STEP : Number(location.state?.initialStep) || 1;

  const { data: campaignResp, isLoading, isError } = useCampaign(campaignIdentifier);

  const campaign = useMemo(
    () => campaignResp?.campaign ?? campaignResp ?? null,
    [campaignResp]
  );

  useEffect(() => {
    if (feedbackModal?.type !== "success" || !campaign?.publicId) return undefined;
    const REDIRECT_MS = 1800;
    const timer = window.setTimeout(() => {
      setFeedbackModal(null);
      navigate(`/brand/campaigns/${campaign.publicId}/view`);
    }, REDIRECT_MS);
    return () => window.clearTimeout(timer);
  }, [feedbackModal, campaign?.publicId, navigate]);

  const rawStatus = getRawCampaignStatus(campaign);
  const isPublished = rawStatus === "active";
  // Published campaigns stay editable (no second payment). Only closed ones are read-only.
  const isEditLocked = rawStatus === "closed";
  // After payment the price-defining fields (creators, video length, add-ons,
  // compensation type) are frozen; everything else can be updated normally.
  const isPricingLocked =
    isPublished ||
    String(campaign?.invoice?.paymentStatus ?? "").toLowerCase() === "paid";
  const isCashDraft =
    isDraftCampaign(campaign) &&
    String(campaign?.compensationType ?? "").toLowerCase().includes("cash");

  const patchCampaign = async ({ formData, productImage, moodboardFiles, campaignPublicId }) => {
    const publicId = campaignPublicId || campaign?.publicId;
    if (!publicId) throw new Error("Missing campaign reference.");

    const fd = buildCampaignFormData({ formData, productImage, moodboardFiles });
    if (isPricingLocked) {
      // Paid campaign: never send the frozen pricing fields (server rejects changes).
      ["numberOfCreators", "videoLength", "compensationType", "addOns"].forEach((key) =>
        fd.delete(key)
      );
    }
    try {
      const rawResponse = await updateCampaignByPublicId(publicId, fd);
      const response = normalizeCampaignSaveResponse(rawResponse);
      if (!response?.campaign) {
        throw new Error(getApiErrorMessage(rawResponse) || "Failed to update campaign.");
      }
      invalidateCampaigns();
      return response;
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    }
  };

  const handleSaveSuccess = () => {
    invalidateCampaigns();
  };


  // One-time payment for a DRAFT. The server activates the campaign when
  // TradeSafe confirms the deposit; the client never calls POST /publish.
  const handlePublishCampaign = async (campaignPublicId) => {
    if (isSubmitting) return;

    if (!fundingQuote || !fundingQuote.paymentMethod) {
      throw new Error("Please select a payment method first");
    }

    // Must happen inside the click gesture, before any await.
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

      invalidateCampaigns();
      setFeedbackModal({
        type: "success",
        title: result === "paid" ? "Campaign published" : "Payment received",
        message:
          result === "paid"
            ? "Your campaign is funded and live."
            : "We are confirming your payment. Your campaign will go live automatically as soon as it is confirmed.",
      });
    } catch (error) {
      throw new Error(getApiErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinalSave = async (args) => {
    setIsSubmitting(true);
    try {
      await patchCampaign(args);
      setFeedbackModal({ type: "success", title: "Campaign updated", message: "Updated successfully." });
    } catch (error) {
      setFeedbackModal({ type: "error", title: "Update failed", message: getApiErrorMessage(error) });
    } finally {
      setIsSubmitting(false);
    }
  };

  const editSubtitle = (() => {
    if (openReviewStep) return "Review your draft and publish when you're ready.";
    if (isEditLocked) return "Closed campaigns cannot be edited.";
    if (isPublished) {
      return "Update your live campaign. Pricing, creator count and add-ons are locked after payment - no new payment is needed.";
    }
    return "Update your draft using the wizard.";
  })();

  if (!campaignIdentifier) {
    return <div className="py-12 text-center text-red-500">Missing campaign reference.</div>;
  }
  if (isLoading) {
    return <div className="py-12 text-center text-gray-400">Loading campaign...</div>;
  }
  if (isError || !campaign) {
    return <div className="py-12 text-center text-red-500">Failed to load campaign.</div>;
  }

  const isSuccessFeedback = feedbackModal?.type === "success";

  return (
    <>
      <Modal
        open={Boolean(feedbackModal)}
        title={feedbackModal?.title}
        onCancel={closeFeedbackModal}
        closable={!isSuccessFeedback}
        maskClosable={!isSuccessFeedback}
        keyboard={!isSuccessFeedback}
        footer={isSuccessFeedback ? null : <Button type="primary" onClick={closeFeedbackModal}>OK</Button>}
        destroyOnClose
        centered
      >
        {isSuccessFeedback ? (
          <div className="flex gap-3">
            <CheckCircle2 className="h-10 w-10 shrink-0 text-emerald-500" aria-hidden />
            <div>
              <p className="text-[15px] leading-relaxed text-gray-700">{feedbackModal?.message}</p>
              <p className="mt-3 text-sm text-gray-500">Redirecting…</p>
            </div>
          </div>
        ) : (
          <p className="text-[15px] leading-relaxed text-gray-700">{feedbackModal?.message}</p>
        )}
      </Modal>

      <CampaignForm
        title={openReviewStep ? "Publish Campaign" : "EDIT CAMPAIGN"}
        subtitle={editSubtitle}
        submitLabel={
          isEditLocked
            ? "Editing Disabled"
            : isSubmitting
              ? isCashDraft ? "Processing..." : "Updating..."
              : isCashDraft ? "Publish Campaign" : "Update Campaign"
        }
        initialCampaignData={campaign}
        initialStep={initialStep}
        isReadOnly={isEditLocked}
        isPricingLocked={isPricingLocked}
        onSaveCampaign={patchCampaign}
        onSaveSuccess={handleSaveSuccess}
        onPublishCampaign={isCashDraft && !isEditLocked ? handlePublishCampaign : undefined}
        onFinalSave={openReviewStep ? undefined : handleFinalSave}
        isSubmitting={isSubmitting}
        fundingQuote={fundingQuote}
        onQuoteChange={setFundingQuote}
      />
    </>
  );
}