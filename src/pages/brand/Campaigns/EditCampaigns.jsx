import React, { useMemo, useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Modal, Button } from "antd";
import { CheckCircle2 } from "lucide-react";
import CampaignForm from "./CampaignForm";
import { useCampaign } from "./hooks/useViewCampaigns";
import { campaignHasApplications } from "./utils/campaignCardUtils";
import { updateCampaignByPublicId } from "../../../services/api/apiservices";

const buildUpdateFormData = ({ formData, productImage, moodboardFiles }) => {
  const fd = new FormData();

  const append = (key, value) => {
    if (value === undefined || value === null || value === "") return;
    fd.append(key, value);
  };

  const appendArray = (key, value) => {
    if (!Array.isArray(value)) return;
    fd.append(key, JSON.stringify(value));
  };

  append("campaignTitle", formData.campaignTitle);
  append("deliverables", formData.deliverables);
  append("numberOfCreators", formData.numberOfCreators);
  append("productServiceUrl", formData.productServiceUrl);
  append("usageRightsIncluded", formData.usageRightsIncluded);
  append("productStatus", formData.productStatus);
  append("compensationType", formData.compensationType);
  append("minBudget", formData.minBudget);
  append("maxBudget", formData.maxBudget);
  append("giftNameDescription", formData.giftNameDescription);
  append("whitelistingSparkAds", formData.whitelistingSparkAds);
  append("campaignGoal", formData.campaignGoal);
  append("followerCount", formData.followerCount);
  append("engagementRate", formData.engagementRate);
  append("additionalAudienceDetails", formData.additionalAudienceDetails);
  append("keyMessage", formData.keyMessage);
  append("campaignBrief", formData.campaignBrief);
  append("dos", formData.dos);
  append("donts", formData.donts);
  append("applicationDeadline", formData.applicationDeadline);
  append("campaignStarts", formData.campaignStarts);
  append("typeOfPet", formData.typeOfPet);
  append("moodboardsInspiration", formData.moodboardsInspiration);

  fd.append("petsRequired", String(formData.petsRequired === true));
  append("moodboardInspirationUrl", formData.moodboardInspirationUrl);

  appendArray("platform", formData.platform);
  appendArray("location", formData.location);
  appendArray("ageRange", formData.ageRange);
  appendArray("gender", formData.gender);
  appendArray("addOns", formData.addOns);

  if (formData.creativeDirection) {
    fd.append("creativeDirection", JSON.stringify(formData.creativeDirection));
  }

  if (productImage) {
    fd.append("coverImage", productImage);
  }

  const validMoodboards = Array.isArray(moodboardFiles)
    ? moodboardFiles.filter(Boolean)
    : [];
  validMoodboards.forEach((file) => fd.append("moodboards", file));

  return fd;
};

export default function EditCampaigns() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  /** `{ type, title, message }` — replaces `alert()` for clearer feedback */
  const [feedbackModal, setFeedbackModal] = useState(null);

  const closeFeedbackModal = useCallback(() => setFeedbackModal(null), []);

  const campaignIdentifier =
    location.state?.campaignId || location.state?.publicId || location.state?.id;

  const {
    data: campaignResp,
    isLoading,
    isError,
  } = useCampaign(campaignIdentifier);

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

  const hasApplications = campaignHasApplications(campaign);

  const handleUpdateCampaign = async ({ formData, productImage, moodboardFiles }) => {
    if (!campaign?.publicId || isSubmitting) return;
    if (hasApplications) {
      setFeedbackModal({
        type: "blocked",
        title: "Editing isn’t available",
        message:
          "This campaign already has creator applications. You can’t change the brief or settings anymore. Review the campaign or manage applicants from campaign management.",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildUpdateFormData({ formData, productImage, moodboardFiles });
      const response = await updateCampaignByPublicId(campaign.publicId, payload);

      if (!response?.campaign) {
        throw new Error(response?.message || "Failed to update campaign.");
      }

      setFeedbackModal({
        type: "success",
        title: "Campaign updated",
        message:
          "Your changes were saved successfully. You'll be taken to your campaign page in a moment.",
      });
    } catch (error) {
      console.error("Update campaign error:", error);
      setFeedbackModal({
        type: "error",
        title: "Update didn’t go through",
        message:
          error?.message ||
          "Something went wrong while saving. Check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!campaignIdentifier) {
    return (
      <div className="py-12 text-center text-red-500">
        Missing campaign reference. Please open edit from campaign table actions.
      </div>
    );
  }

  if (isLoading) {
    return <div className="py-12 text-center text-gray-400">Loading campaign...</div>;
  }

  if (isError || !campaign) {
    return (
      <div className="py-12 text-center text-red-500">
        Failed to load campaign for editing.
      </div>
    );
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
        footer={
          isSuccessFeedback ? null : (
            <Button type="primary" onClick={closeFeedbackModal}>
              OK
            </Button>
          )
        }
        destroyOnClose
        centered
      >
        {isSuccessFeedback ? (
          <div className="flex gap-3">
            <CheckCircle2
              className="h-10 w-10 shrink-0 text-emerald-500"
              aria-hidden
            />
            <div>
              <p className="text-[15px] leading-relaxed text-gray-700">
                {feedbackModal?.message}
              </p>
              <p className="mt-3 text-sm text-gray-500">Redirecting…</p>
            </div>
          </div>
        ) : (
          <p className="text-[15px] leading-relaxed text-gray-700">
            {feedbackModal?.message}
          </p>
        )}
      </Modal>

      <CampaignForm
        title="EDIT CAMPAIGN"
        subtitle={
          hasApplications
            ? "Campaign cannot be edited after applications are received"
            : "Update campaign details and publish changes"
        }
        submitLabel={
          hasApplications
            ? "Editing Disabled"
            : isSubmitting
              ? "Updating..."
              : "Update Campaign"
        }
        initialCampaignData={campaign}
        isReadOnly={hasApplications}
        onSubmit={handleUpdateCampaign}
      />
    </>
  );
}
