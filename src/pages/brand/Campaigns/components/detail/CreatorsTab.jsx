import React, { useMemo, useState, useEffect, useCallback } from "react";
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
import {
  getCampaignPaymentStatus,
  selectCreator,
  fundCreator,
} from "../../../../../services/api/apiservices";

export default function CreatorsTab({ campaignId }) {
  const navigate = useNavigate();

  const numericCampaignId = Number(campaignId);
  const hasValidCampaignId =
    Boolean(campaignId) && !Number.isNaN(numericCampaignId);

  // ============ CREATORS ============
  const { data: response, isLoading, isError, refetch } = useQuery({
    ...getCreatorApplicationsQueryOptions(campaignId),
    enabled: hasValidCampaignId,
  });

  const creators = useMemo(() => {
    const applicants = parseApplicantsResponse(response);
    return mapAcceptedApplicantsToCreators(applicants);
  }, [response]);

  // ============ ✅ ESCROW STATE ============
  const [processingCreatorId, setProcessingCreatorId] = useState(null);
  const [error, setError] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);

  // ============ ✅ FETCH PAYMENT STATUS ============
  const { data: statusData, refetch: refetchStatus } = useQuery({
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

  // ============ ✅ HANDLE SELECT & FUND ============
  const handleSelectAndFund = useCallback(
    async (creator) => {
      setProcessingCreatorId(creator.id);
      setError("");

      try {
        // STEP 1: Create escrow
        const res = await selectCreator(campaignId, {
          creatorId: creator.id,
          creatorAmount: creator.budget,
        });
        const data = res?.data?.success ? res.data : res;

        if (!data?.transactionId) {
          throw new Error("Failed to create escrow transaction.");
        }

        // STEP 2: Fund from wallet
        await fundCreator(data.transactionId);

        // STEP 3: Refresh
        await refetch();
        await refetchStatus();
      } catch (err) {
        console.error("Select & Fund error:", err);
        setError(err?.error || "Failed to select & fund creator");
      } finally {
        setProcessingCreatorId(null);
      }
    },
    [campaignId, refetch, refetchStatus]
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

      {/* ============ ✅ CAMPAIGN FUNDING BANNER ============ */}
      {creators.length > 0 && !isCampaignFunded && (
        <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          <span className="shrink-0">⏳</span>
          <div>
            <p className="font-semibold">Campaign Not Funded</p>
            <p>Please fund the campaign first before creating creator escrows.</p>
          </div>
        </div>
      )}

      {/* ============ ✅ ERROR ============ */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <span className="shrink-0">❌</span>
          <div>
            <p className="font-semibold">Error</p>
            <p>{error}</p>
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
            const isProcessing = processingCreatorId === creator.id;

            return (
              <CreatorRowCard
                key={creator.id}
                creator={creator}
                onViewProfile={handleViewProfile}
                onMessage={handleMessage}
                // ✅ Escrow props
                escrowStatus={tx?.status}
                isSelectingEscrow={isProcessing}
                isCampaignFunded={isCampaignFunded}
                onSelectAndFund={handleSelectAndFund}
              />
            );
          })
        )}
      </div>
    </div>
  );
}