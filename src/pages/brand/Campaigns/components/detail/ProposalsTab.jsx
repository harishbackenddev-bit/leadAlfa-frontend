import React, { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ConfirmActionDialog from "../../../../../components/common/ConfirmActionDialog";
import {
  changeApplicationStatusMutation,
  getCreatorApplicationsQueryOptions,
} from "../../../../../services/tanstack/queryService";
import {
  selectCreator,
  fundCreator,
  getCampaignPaymentStatus,
} from "../../../../../services/api/apiservices";
import { useNotification } from "../../../../../context/NotificationContext";
import ProposalSummaryCards from "./proposals/ProposalParts";
import ProposalCard from "./proposals/ProposalCard";
import {
  filterPendingProposals,
  filterProposalsByStatus,
  getProposalCounts,
  mapApiApplicationToProposal,
  parseApplicantsResponse,
} from "../../utils/proposalUtils";
import ErrorState from "../../../../../components/common/ErrorState";

export default function ProposalsTab({ campaignId }) {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const queryClient = useQueryClient();

  const numericCampaignId = Number(campaignId);
  const hasValidCampaignId =
    Boolean(campaignId) && !Number.isNaN(numericCampaignId);

  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [confirmState, setConfirmState] = useState(null);

  // ✅ LOCK: jab tak ek transaction puri na ho, doosri start nahi hogi
  const [processingProposalId, setProcessingProposalId] = useState(null);

  const { data: response, isLoading, isError } = useQuery({
    ...getCreatorApplicationsQueryOptions(campaignId),
    enabled: hasValidCampaignId,
  });

  const proposals = useMemo(() => {
    const list = parseApplicantsResponse(response);
    return filterPendingProposals(list.map(mapApiApplicationToProposal));
  }, [response]);

  const counts = useMemo(() => getProposalCounts(proposals), [proposals]);

  const filtered = useMemo(
    () => filterProposalsByStatus(proposals, statusFilter),
    [proposals, statusFilter]
  );

  const goToMessages = useCallback(
    (data) => {
      const chatRoomId = data?.chatRoomId ?? data?.chatRoom?.id ?? null;
      setTimeout(() => {
        navigate("/brand/messages", {
          state: chatRoomId ? { openRoomId: chatRoomId } : undefined,
        });
      }, 800);
    },
    [navigate]
  );

  const { mutate: changeStatus, isPending } = useMutation({
    ...changeApplicationStatusMutation(campaignId),
    onSuccess: async (data, variables) => {
      const target = variables.proposal;
      setConfirmState(null);

      // ---------- DECLINE ----------
      if (variables.newStatus !== "accepted") {
        showNotification({
          type: "success",
          message: "Proposal declined.",
          description: "The creator has been notified.",
        });
        setProcessingProposalId(null); // ✅ unlock
        return;
      }

      // ---------- ACCEPT ----------
      showNotification({
        type: "success",
        message: "Proposal accepted!",
        description: "Setting up escrow for this creator...",
      });

      const creatorId = target?.creatorId || target?.raw?.creator?.id;
      if (!creatorId) {
        setProcessingProposalId(null);
        goToMessages(data);
        return;
      }

      try {
        const statusRes = await getCampaignPaymentStatus(campaignId);
        const statusData = statusRes?.data || statusRes;
        const fundingStatus = statusData?.fundingStatus;
        const OK_STATUSES = ["FUNDS_RECEIVED", "FUNDED", "PARTIALLY_ALLOCATED"];

        if (!OK_STATUSES.includes(fundingStatus)) {
          showNotification({
            type: "warning",
            message: "Campaign not funded",
            description:
              "Please fund the campaign first. Creator is accepted but escrow is pending.",
          });
          goToMessages(data);
          return;
        }

        const escrowRes = await selectCreator(campaignId, { creatorId });
        const escrowData = escrowRes?.data?.success ? escrowRes.data : escrowRes;
        if (!escrowData?.transactionId) {
          throw new Error("Failed to create escrow transaction");
        }

        await fundCreator(escrowData.transactionId);

        showNotification({
          type: "success",
          message: "✅ Escrow funded!",
          description: `R ${Number(
            escrowData?.creatorAmount || target?.proposedBudget || 0
          ).toFixed(2)} secured in escrow for ${target?.name}.`,
        });

        queryClient.invalidateQueries({
          queryKey: ["campaign-payment-status", campaignId],
        });
        queryClient.invalidateQueries({
          queryKey: ["campaign-applicants", campaignId],
        });
        queryClient.invalidateQueries({
          queryKey: ["campaign-creators", campaignId],
        });
      } catch (escrowErr) {
        console.error("Auto-escrow error:", {
          campaignId,
          creatorId,
          message: escrowErr?.message,
          response: escrowErr?.response?.data,
        });
        showNotification({
          type: "warning",
          message: "Accepted, but escrow pending",
          description:
            escrowErr?.response?.data?.error ||
            escrowErr?.message ||
            "Escrow could not be created. Please check Creators tab.",
        });
      } finally {
        setProcessingProposalId(null); // ✅ UNLOCK — ab next transaction start ho sakti hai
        goToMessages(data);
      }
    },
    onError: (err) => {
      setProcessingProposalId(null); // ✅ unlock on error
      setConfirmState(null);
      showNotification({
        type: "error",
        message: "Action failed",
        description:
          err?.response?.data?.error || err?.message || "Please try again.",
      });
    },
  });

  const handleToggle = useCallback((id) => {
    setExpandedId((current) => (current === id ? null : id));
  }, []);

  const handleAcceptClick = useCallback((proposal) => {
    // ✅ Guard: agar koi transaction already chal rahi hai to ignore
    if (processingProposalId !== null) return;
    setConfirmState({ variant: "accept", proposal });
  }, [processingProposalId]);

  const handleDeclineClick = useCallback((proposal) => {
    if (processingProposalId !== null) return;
    setConfirmState({ variant: "reject", proposal });
  }, [processingProposalId]);

  const handleConfirm = useCallback(() => {
    const { variant, proposal } = confirmState || {};
    if (!proposal) return;

    setProcessingProposalId(proposal.id); // ✅ LOCK immediately

    changeStatus({
      applicationId: proposal.applicationId || proposal.id,
      newStatus: variant === "accept" ? "accepted" : "rejected",
      proposal,
      variant,
    });
  }, [confirmState, changeStatus]);

  const handleViewCreator = useCallback(
    (proposal) => {
      const application = proposal?.raw || proposal;
      const creatorId =
        proposal?.creatorId ||
        application?.creator?.id ||
        application?.creator?.userId;
      if (!creatorId) return;
      navigate(`/brand/creators/${creatorId}/view`, {
        state: {
          application,
          campaignId,
          returnTo: window.location.pathname + window.location.search,
        },
      });
    },
    [navigate, campaignId]
  );

  if (!hasValidCampaignId) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
        Campaign applications are unavailable until the campaign loads.
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-24 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-32 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        variant="card"
        type="server"
        title="Failed to Load Proposals"
        description="We couldn't retrieve the creator applications for this campaign. Please try again."
        onRetry={() => window.location.reload()}
      />
    );
  }

  return (
    <div className="space-y-4">
      <ProposalSummaryCards
        counts={counts}
        activeFilter={statusFilter}
        onChange={setStatusFilter}
      />

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
            No pending proposals yet.
          </div>
        ) : (
          filtered.map((proposal) => {
            const isProcessingThis = processingProposalId === proposal.id;
            const isAnyProcessing = processingProposalId !== null;
            const isOtherCard = isAnyProcessing && !isProcessingThis;

            return (
              <ProposalCard
                key={proposal.id}
                proposal={proposal}
                expanded={expandedId === proposal.id}
                onToggle={() => handleToggle(proposal.id)}
                onViewCreator={handleViewCreator}
                onAccept={handleAcceptClick}
                onDecline={handleDeclineClick}
                isProcessing={isProcessingThis}
                disabled={isOtherCard} // ✅ doosre cards lock ho jayenge
              />
            );
          })
        )}
      </div>

      {confirmState ? (
        <ConfirmActionDialog
          variant={confirmState.variant}
          creatorName={confirmState.proposal?.name}
          isProcessing={isPending}
          onCancel={() => setConfirmState(null)}
          onConfirm={handleConfirm}
          rejectTitle="Decline Proposal"
        />
      ) : null}
    </div>
  );
}