import React from "react";
import ApplyForm from "./ApplyForm";
import { useNavigate } from "react-router-dom";
import { creatorApplyToCampaign } from "../../../services/api/apiservices";
import { invalidateMyJobs } from "../../../services/tanstack/queryService";

export default function ApplyNowform() {
  const navigate = useNavigate();

  // `payload` shape: { pitch, proposedBudget, mediaId }
  // ApplyForm already ran the direct-to-Cloudinary upload (signature → upload
  // → register) before calling us, so we only need to POST the JSON body.
  const onSubmit = async (campaignId, payload) => {
    try {
      await creatorApplyToCampaign(campaignId, payload);
      // Refresh my-jobs cache so the new (pending) application appears on
      // /creator/my-jobs immediately, AND so the explore list filters this
      // campaign out the next time the creator visits.
      invalidateMyJobs();
      // Land on My Jobs (Applied tab) so the creator can see their new
      // pending application right away.
      navigate("/creator/my-jobs");
    } catch (err) {
      console.error("Apply failed", err);
      throw err;
    }
  };

  return (
    <ApplyForm
      title="Apply Now"
      submitLabel="Submit Proposal"
      backLink="/creator/campaigns"
      backLabel="Explore Campaigns"
      onSubmit={onSubmit}
    />
  );
}
