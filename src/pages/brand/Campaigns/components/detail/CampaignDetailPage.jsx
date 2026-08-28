// CampaignDetailPage.jsx
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
import { enrichCampaignWithListStats } from "../../utils/campaignCardUtils";
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
import ConfigureCreatorsTab from "./tabs/ConfigureCreatorsTab";

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

  // ========== FETCH CAMPAIGN DETAIL ==========
  const { data: campaignResp, isLoading, isError } = useCampaign(campaignIdentifier);

  // ========== FETCH ALL CAMPAIGNS ==========
  const { data: allCampaigns = [] } = useQuery({
    ...getAllBrandCampaignsQueryOptions(),
    enabled: true,
  });

  console.log('📊 campaignResp:', campaignResp);
  console.log('📊 allCampaigns:', allCampaigns);

  // ========== EXTRACT CAMPAIGN ==========
  const apiCampaign = useMemo(() => {
    let campaign = null;
    
    if (campaignResp?.data) {
      campaign = campaignResp.data;
    } else if (campaignResp?.campaign) {
      campaign = campaignResp.campaign;
    } else if (campaignResp) {
      campaign = campaignResp;
    }
    
    console.log('📊 Extracted campaign:', campaign);
    return campaign;
  }, [campaignResp]);

  // ========== ENRICH CAMPAIGN ==========
  const enrichedCampaign = useMemo(() => {
    if (!apiCampaign) return null;
    console.log('📊 Enriching campaign:', apiCampaign);
    return enrichCampaignWithListStats(apiCampaign, allCampaigns);
  }, [apiCampaign, allCampaigns]);

  console.log('📊 enrichedCampaign:', enrichedCampaign);

  // ========== MERGE DETAIL ==========
  const detail = useMemo(() => {
    if (!enrichedCampaign) return null;
    return mergeCampaignDetail(enrichedCampaign, campaignIdentifier);
  }, [enrichedCampaign, campaignIdentifier]);

  console.log('📊 detail:', detail);

  const campaignId = detail?.raw?.id || campaignIdentifier;
  const hasValidCampaignId = Boolean(detail) && Boolean(campaignId) && !Number.isNaN(Number(campaignId));

  // ========== FETCH APPLICANTS ==========
  const { data: applicantsResponse } = useQuery({
    ...getCreatorApplicationsQueryOptions(campaignId),
    enabled: hasValidCampaignId,
  });

  // ========== DETAIL WITH ALERTS ==========
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

  // ========== TAB HANDLING ==========
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
    navigate("/brand/campaigns/edit", {
      state: { campaignId: detailWithAlerts?.publicId || campaignIdentifier },
    });
  }, [navigate, detailWithAlerts, campaignIdentifier]);

  const campaignPublicId = detailWithAlerts?.publicId || campaignIdentifier;

  // ========== FETCH SUBMISSION STATS ==========
  const { data: submissionStatsResponse } = useQuery({
    ...getCampaignSubmissionStatsQueryOptions(campaignPublicId),
    enabled: Boolean(campaignPublicId),
  });

  const { data: submissionsListResponse } = useQuery({
    ...getCampaignSubmissionsQueryOptions(campaignPublicId, { limit: 50 }),
    enabled: Boolean(campaignPublicId),
  });

  // ========== TAB BADGES ==========
  const tabBadges = useMemo(() => {
    if (!detailWithAlerts) return {};

    const badges = { ...detailWithAlerts.tabBadges };
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

    const pendingSubmissions = submissionStatsResponse?.stats?.pendingReview ?? 0;
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

  // ========== LOADING ==========
  if (isLoading && !detailWithAlerts) {
    return (
      <div className="space-y-4 p-4 md:p-7">
        <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
        <div className="h-40 animate-pulse rounded-xl bg-gray-200" />
        <div className="h-96 animate-pulse rounded-xl bg-gray-200" />
      </div>
    );
  }

  // ========== ERROR ==========
  if (!detailWithAlerts) {
    console.log('❌ No detailWithAlerts:', { detail, apiCampaign, campaignResp });
    return (
      <div className="py-12 text-center text-red-500">
        {isError
          ? "Failed to load campaign. Please try again."
          : "Campaign not found."}
      </div>
    );
  }

  const editBlocked = Boolean(detailWithAlerts.hasApplications);

  // ========== RENDER TAB CONTENT ==========
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OverviewTab
            detail={detailWithAlerts}
            campaignPublicId={campaignPublicId}
          />
        );
      case "configure-creators": // ← NEW TAB
        return (
          <ConfigureCreatorsTab
            campaignId={campaignId}
            campaignPublicId={campaignPublicId}
            onCreatorsUpdated={() => {
              // Refresh campaign details after creators update
              // You can trigger a refetch here
              console.log('🔄 Creators updated, refreshing...');
            }}
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
    <div className="w-full min-w-0 bg-gray-50 font-sans">
      <div className="mx-auto w-full min-w-0 space-y-5 p-4 md:p-7">
        <CampaignDetailHeader
          detail={detailWithAlerts}
          onEdit={handleEdit}
          editDisabled={editBlocked}
          editDisabledTitle="Campaign cannot be edited after applications have been received."
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