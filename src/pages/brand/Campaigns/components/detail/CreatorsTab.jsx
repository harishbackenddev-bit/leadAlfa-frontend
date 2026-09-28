import React, { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCreatorApplicationsQueryOptions } from "../../../../../services/tanstack/queryService";
import { InfoBanner } from "./shared/InfoBanner";
import CreatorRowCard from "./creators/CreatorRowCard";
import {
  mapAcceptedApplicantsToCreators,
  parseApplicantsResponse,
} from "../../utils/proposalUtils";
import ErrorState from "../../../../../components/common/ErrorState";
import { getCampaignPaymentStatus } from "../../../../../services/api/apiservices";

export default function CreatorsTab({ campaignId }) {
  const navigate = useNavigate();

  const numericCampaignId = Number(campaignId);
  const hasValidCampaignId = Boolean(campaignId) && !Number.isNaN(numericCampaignId);

  // ============ CREATORS ============
  const { data: response, isLoading, isError } = useQuery({
    ...getCreatorApplicationsQueryOptions(campaignId),
    enabled: hasValidCampaignId,
  });

  const creators = useMemo(() => {
    const applicants = parseApplicantsResponse(response);
    return mapAcceptedApplicantsToCreators(applicants);
  }, [response]);

  // ============ ✅ PAYMENT STATUS ============
  const [paymentStatus, setPaymentStatus] = useState(null);

  const { data: statusData } = useQuery({
    queryKey: ["campaign-payment-status", campaignId],
    queryFn: () => getCampaignPaymentStatus(campaignId),
    enabled: hasValidCampaignId,
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    if (statusData?.data) setPaymentStatus(statusData.data);
  }, [statusData]);

  // ============ ✅ CREATOR ESCROW MAP ============
  const creatorEscrowMap = useMemo(() => {
    const map = {};
    (paymentStatus?.transactions || []).forEach((tx) => {
      map[tx.creatorId] = tx;
    });
    return map;
  }, [paymentStatus]);

  const isCampaignFunded = ["FUNDS_RECEIVED", "FUNDED"].includes(
    paymentStatus?.fundingStatus
  );

  // ============ HANDLERS ============
  const handleViewProfile = (creator) => {
    navigate(`/brand/creators/${creator.id}/view`, {
      state: { returnTo: window.location.pathname + window.location.search },
    });
  };

  const handleMessage = () => {
    navigate("/brand/messages");
  };

  // ============ EARLY RETURNS ============
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
      <ErrorState
        variant="card"
        type="server"
        title="Failed to Load Creators"
        description="We couldn't retrieve the hired creators for this campaign. Please try again."
        onRetry={() => window.location.reload()}
      />
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

      {/* Campaign Funding Banner */}
      {creators.length > 0 && !isCampaignFunded && (
        <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          <span className="shrink-0">⏳</span>
          <div>
            <p className="font-semibold">Campaign Not Funded</p>
            <p>Please fund the campaign first before creators can start work.</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {creators.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
            No creators hired yet. Accept a proposal to add creators here.
          </div>
        ) : (
          creators.map((creator) => {
            const tx = creatorEscrowMap[creator.id];

            return (
              <CreatorRowCard
                key={creator.id}
                creator={creator}
                onViewProfile={handleViewProfile}
                onMessage={handleMessage}
                // ✅ Escrow status only
                escrowStatus={tx?.status}
                escrowAmount={tx?.creatorNet ?? tx?.amount}
              />
            );
          })
        )}
      </div>
    </div>
  );
}