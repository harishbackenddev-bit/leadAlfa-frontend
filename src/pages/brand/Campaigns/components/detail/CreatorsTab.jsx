import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCreatorApplicationsQueryOptions } from "../../../../../services/tanstack/queryService";
import { InfoBanner } from "./shared/InfoBanner";
import CreatorRowCard from "./creators/CreatorRowCard";
import {
  mapAcceptedApplicantsToCreators,
  parseApplicantsResponse,
} from "../../utils/proposalUtils";

export default function CreatorsTab({ campaignId }) {
  const navigate = useNavigate();

  const numericCampaignId = Number(campaignId);
  const hasValidCampaignId =
    Boolean(campaignId) && !Number.isNaN(numericCampaignId);

  const { data: response, isLoading, isError } = useQuery({
    ...getCreatorApplicationsQueryOptions(campaignId),
    enabled: hasValidCampaignId,
  });

  const creators = useMemo(() => {
    const applicants = parseApplicantsResponse(response);
    return mapAcceptedApplicantsToCreators(applicants);
  }, [response]);

  const handleViewProfile = (creator) => {
    navigate(`/brand/creators/${creator.id}/view`, {
      state: { returnTo: window.location.pathname + window.location.search },
    });
  };

  const handleMessage = () => {
    navigate("/brand/messages");
  };

  if (!hasValidCampaignId) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
        Hired creators are unavailable until the campaign loads.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        <div className="h-20 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-20 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-sm text-red-500">
        Failed to load creators. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {creators.length > 0 ? (
        <InfoBanner
          message={`${creators.length} creator${creators.length === 1 ? "" : "s"} hired for this campaign`}
          tone="blue"
        />
      ) : null}

      <div className="space-y-3">
        {creators.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
            No creators hired yet. Accept a proposal to add creators here.
          </div>
        ) : (
          creators.map((creator) => (
            <CreatorRowCard
              key={creator.applicationId || creator.id}
              creator={creator}
              onViewProfile={handleViewProfile}
              onMessage={handleMessage}
            />
          ))
        )}
      </div>
    </div>
  );
}
