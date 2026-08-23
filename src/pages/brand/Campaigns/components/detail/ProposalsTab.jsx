import React, { useCallback, useMemo, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ConfirmActionDialog from "../../../../../components/common/ConfirmActionDialog";
import {
  changeApplicationStatusMutation,
  getCreatorApplicationsQueryOptions,
} from "../../../../../services/tanstack/queryService";
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

export default function ProposalsTab({ campaignId }) {
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const numericCampaignId = Number(campaignId);
  const hasValidCampaignId =
    Boolean(campaignId) && !Number.isNaN(numericCampaignId);

  const [statusFilter, setStatusFilter] = useState("all");
  const [expandedId, setExpandedId] = useState(null);
  const [confirmState, setConfirmState] = useState(null);

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

  const { mutate: changeStatus, isPending } = useMutation({
    ...changeApplicationStatusMutation(campaignId),
    onSuccess: (data, variables) => {
      const target = confirmState?.proposal;
      setConfirmState(null);

      if (variables.newStatus === "accepted") {
        showNotification({
          type: "success",
          message: "Proposal accepted!",
          description: `Chat room created with ${target?.name || "creator"}.`,
        });
        const chatRoomId = data?.chatRoomId ?? data?.chatRoom?.id ?? null;
        setTimeout(() => {
          navigate("/brand/messages", {
            state: chatRoomId ? { openRoomId: chatRoomId } : undefined,
          });
        }, 600);
      } else {
        showNotification({
          type: "success",
          message: "Proposal declined.",
          description: "The creator has been notified.",
        });
      }
    },
  });

  const handleToggle = useCallback((id) => {
    setExpandedId((current) => (current === id ? null : id));
  }, []);

  const handleAcceptClick = useCallback((proposal) => {
    setConfirmState({ variant: "accept", proposal });
  }, []);

  const handleDeclineClick = useCallback((proposal) => {
    setConfirmState({ variant: "reject", proposal });
  }, []);

  const handleConfirm = useCallback(() => {
    const { variant, proposal } = confirmState || {};
    if (!proposal) return;

    changeStatus({
      applicationId: proposal.applicationId || proposal.id,
      newStatus: variant === "accept" ? "accepted" : "rejected",
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
      <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-sm text-red-500">
        Failed to load proposals. Please try again.
      </div>
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
          filtered.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              expanded={expandedId === proposal.id}
              onToggle={() => handleToggle(proposal.id)}
              onViewCreator={handleViewCreator}
              onAccept={handleAcceptClick}
              onDecline={handleDeclineClick}
            />
          ))
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
