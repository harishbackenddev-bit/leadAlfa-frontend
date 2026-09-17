import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";
import { useCampaign } from "../../hooks/useViewCampaigns";
import {
  getCreatorApplicationsQueryOptions,
  getCampaignSubmissionStatsQueryOptions,
  getCampaignSubmissionsQueryOptions,
  getAllBrandCampaignsQueryOptions,
} from "../../../../../services/tanstack/queryService";
import {
  mergeCampaignDetail,
  resolveInitialTab,
} from "../../utils/campaignDetailUtils";
import {
  getPendingProposalBadgeCount,
  parseApplicantsResponse,
} from "../../utils/proposalUtils";
import { getFeedbackRevisionCount } from "../../utils/feedbackUtils";
import { parseSubmissionsListResponse } from "../../utils/brandSubmissionMapper";
import {
  enrichCampaignWithListStats,
  getRawCampaignStatus,
} from "../../utils/campaignCardUtils";
import CampaignDetailHeader from "./CampaignDetailHeader";
import CampaignDetailTabs from "./CampaignDetailTabs";
import OverviewTab from "./OverviewTab";
import CreatorsTab from "./CreatorsTab";
import ProposalsTab from "./ProposalsTab";
import ApprovedAssetsTab from "./ApprovedAssetsTab";
import SubmissionsTab from "./SubmissionsTab";
import FeedbackRevisionsTab from "./FeedbackRevisionsTab";
import ContractsTab from "./ContractsTab";
import CampaignActivityTab from "./CampaignActivityTab";
import ErrorState from "../../../../../components/common/ErrorState";


export default function CampaignDetailPage() {
  const { publicId, id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const campaignIdentifier = publicId || id;

  const initialTab = resolveInitialTab({
    searchTab: searchParams.get("tab"),
    focusState: location.state?.focus,
  });

  const [activeTab, setActiveTab] = useState(initialTab);

  const { data: campaignResp, isLoading, isError } = useCampaign(campaignIdentifier);

  const { data: allCampaigns = [] } = useQuery(getAllBrandCampaignsQueryOptions());

  const apiCampaign = useMemo(() => {
    const base = campaignResp?.campaign ?? campaignResp ?? null;
    if (!base) return null;
    return enrichCampaignWithListStats(base, allCampaigns);
  }, [campaignResp, allCampaigns]);

  const detail = useMemo(() => {
    if (!apiCampaign) return null;
    return mergeCampaignDetail(apiCampaign, campaignIdentifier);
  }, [apiCampaign, campaignIdentifier]);

  const campaignId = detail?.raw?.id || campaignIdentifier;
  const hasValidCampaignId =
    Boolean(detail) &&
    Boolean(campaignId) &&
    !Number.isNaN(Number(campaignId));

  const { data: applicantsResponse } = useQuery({
    ...getCreatorApplicationsQueryOptions(campaignId),
    enabled: hasValidCampaignId,
  });

  const detailWithAlerts = useMemo(() => {
    if (!detail) return null;
    const messages = [...(detail.alertMessages || [])];
    if (hasValidCampaignId && applicantsResponse) {
      const pendingCount = getPendingProposalBadgeCount(
        parseApplicantsResponse(applicantsResponse)
      );
      if (pendingCount > 0) {
        messages.push(
          `${pendingCount} creator${pendingCount === 1 ? "" : "s"} awaiting approval`
        );
      }
    }
    return { ...detail, alertMessages: messages };
  }, [detail, applicantsResponse, hasValidCampaignId]);

  const handleTabChange = useCallback(
    (tabKey) => {
      setActiveTab(tabKey);
      setSearchParams({ tab: tabKey }, { replace: true });
    },
    [setSearchParams]
  );

  useEffect(() => {
    const tab = resolveInitialTab({
      searchTab: searchParams.get("tab"),
      focusState: location.state?.focus,
    });
    setActiveTab(tab);
  }, [searchParams, location.state?.focus]);

  const handleEdit = useCallback(() => {
    if (getRawCampaignStatus(detailWithAlerts?.raw ?? detailWithAlerts) === "active") {
      return;
    }
    navigate("/brand/campaigns/edit", {
      state: { campaignId: detailWithAlerts?.publicId || campaignIdentifier },
    });
  }, [navigate, detailWithAlerts, campaignIdentifier]);

  const editBlocked =
    getRawCampaignStatus(detailWithAlerts?.raw ?? detailWithAlerts) === "active";
  const editBlockReason = editBlocked
    ? "Published campaigns cannot be edited."
    : null;

  const campaignPublicId = detailWithAlerts?.publicId || campaignIdentifier;

  const { data: submissionStatsResponse } = useQuery({
    ...getCampaignSubmissionStatsQueryOptions(campaignPublicId),
    enabled: Boolean(campaignPublicId),
  });

  const { data: submissionsListResponse } = useQuery({
    ...getCampaignSubmissionsQueryOptions(campaignPublicId, { limit: 50 }),
    enabled: Boolean(campaignPublicId),
  });

  const tabBadges = useMemo(() => {
    if (!detailWithAlerts) return {};

    const badges = { ...detailWithAlerts.tabBadges };
    // Only live API counts may show as tab badges. Dummy / supplemental
    // counts (feedback, contracts, etc.) must never appear.
    delete badges.proposals;
    delete badges.submissions;
    delete badges.feedback;
    delete badges.contracts;

    if (hasValidCampaignId && applicantsResponse) {
      const pendingCount = getPendingProposalBadgeCount(
        parseApplicantsResponse(applicantsResponse)
      );
      if (pendingCount > 0) {
        badges.proposals = pendingCount;
      }
    }

    const pendingSubmissions =
      submissionStatsResponse?.stats?.pendingReview ?? 0;
    if (campaignPublicId && pendingSubmissions > 0) {
      badges.submissions = pendingSubmissions;
    }

    const feedbackCount = getFeedbackRevisionCount(
      parseSubmissionsListResponse(submissionsListResponse)
    );
    if (campaignPublicId && feedbackCount > 0) {
      badges.feedback = feedbackCount;
    }

    return badges;
  }, [
    detailWithAlerts,
    applicantsResponse,
    hasValidCampaignId,
    campaignPublicId,
    submissionStatsResponse,
    submissionsListResponse,
  ]);

  if (isLoading && !detailWithAlerts) {
    return (
      <div className="space-y-4 p-4 md:p-7">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-40 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (!detailWithAlerts) {
    return (
      <ErrorState
        variant="page"
        type={isError ? "server" : "notFound"}
        statusCode={isError ? 500 : 404}
        title={isError ? "Unable to Load Campaign" : "Campaign Not Found"}
        description={
          isError
            ? `We encountered a server error while retrieving campaign "${campaignIdentifier}". Please try refreshing or return to your campaigns list.`
            : `The campaign "${campaignIdentifier}" does not exist or may have been removed.`
        }
       
        onRetry={() => window.location.reload()}
        secondaryAction={{
          label: "Back to Campaigns",
          onClick: () => navigate("/brand/campaigns"),
        }}
      />
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            detail={detailWithAlerts}
            campaignPublicId={campaignPublicId}
          />
        );
      case "creators":
        return <CreatorsTab campaignId={campaignId} />;
      case "proposals":
        return <ProposalsTab campaignId={campaignId} />;
      case "approved-assets":
        return <ApprovedAssetsTab campaignPublicId={campaignPublicId} />;
      case "submissions":
        return <SubmissionsTab campaignPublicId={campaignPublicId} />;
      case "feedback":
        return <FeedbackRevisionsTab campaignPublicId={campaignPublicId} />;
      case "contracts":
        return <ContractsTab />;
      case "activity":
        return <CampaignActivityTab campaignPublicId={campaignPublicId} />;
      default:
        return (
          <OverviewTab
            detail={detailWithAlerts}
            campaignPublicId={campaignPublicId}
          />
        );
    }
  };

  return (
    <div className="w-full min-w-0 bg-gray-50">
      <div className="mx-auto w-full min-w-0 space-y-5 p-4 md:p-7">
        <CampaignDetailHeader
          detail={detailWithAlerts}
          onEdit={handleEdit}
          editDisabled={editBlocked}
          editDisabledTitle={editBlockReason || undefined}
        />

        <div className="rounded-xl border border-gray-200 bg-white px-4 md:px-5">
          <CampaignDetailTabs
            activeTab={activeTab}
            onChange={handleTabChange}
            tabBadges={tabBadges}
          />
        </div>

        <div>{renderTabContent()}</div>
      </div>
    </div>
  );
}
