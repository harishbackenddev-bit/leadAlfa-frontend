import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import CreatorCampaignDetailBanner from "./components/CreatorCampaignDetailBanner";
import CampaignViewContent from "../../../components/campaign/CampaignViewContent";
import { getActiveCampaigns } from "../../../services/api/apiservices";
import {
  calculateCampaignDaysLeft,
  getCampaignBrandInfo,
} from "../../../utils/creatorCampaignMappers";
import { getBackNavigationState } from "../../../utils/brandProfileMapper";
import bannerImage from "../../../assets/images/campaign/bannerImage.jpg";
import useAppliedCampaigns from "./hooks/useAppliedCampaigns";

export default function CampaignDetailsView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { hasApplied } = useAppliedCampaigns();
  const alreadyApplied = hasApplied(id);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setLoading(true);
        const response = await getActiveCampaigns();
        const campaigns = response.campaigns || [];
        const foundCampaign = campaigns.find(
          (c) => c.id === parseInt(id, 10)
        );

        if (foundCampaign) {
          setCampaign(foundCampaign);
          setError(null);
        } else {
          setError("Campaign not found or no longer active.");
        }
      } catch (err) {
        console.error("Error fetching campaign:", err);
        setError("Failed to load campaign details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCampaign();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
          <p className="mt-4 text-gray-600">Loading campaign details...</p>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="mb-4 text-red-600">{error || "Campaign not found"}</p>
          <button
            type="button"
            onClick={() => navigate("/creator/campaigns")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Campaigns
          </button>
        </div>
      </div>
    );
  }

  // const breadcrumbs = [
  //   { label: "Explore Collaborations", path: "/creator/explore-campaigns" },
  //   { label: "View Collaboration", path: null },
  // ];

  const bannerUrl =
    campaign?.media?.coverImage?.url ||
    campaign?.media?.moodboards?.[0]?.url ||
    bannerImage;

  const { brandId, companyName, brandLogo, isVerified, brand } =
    getCampaignBrandInfo(campaign);
  const daysLeft = calculateCampaignDaysLeft(campaign);
  const resolvedBrandId = brandId || id;
  const backNav = getBackNavigationState(location.pathname);

  const handleApplyNow = () => {
    navigate(`/creator/campaigns/${id}/apply`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1920px] px-4 py-6 sm:px-6 lg:px-8">
        {/* <CampaignHeader breadcrumbs={breadcrumbs} /> */}

        <button
          type="button"
          onClick={() => navigate("/creator/campaigns")}
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to Explore Campaigns
        </button>

        <CreatorCampaignDetailBanner
          imageUrl={bannerUrl}
          altText={campaign?.campaignTitle || "Campaign banner"}
          campaignTitle={campaign?.campaignTitle || "Campaign"}
          companyName={companyName}
          brandLogo={brandLogo}
          isVerified={isVerified}
          status={campaign?.status}
          daysLeft={daysLeft}
          brandProfileTo={`/creator/brands/${resolvedBrandId}`}
          brandProfileState={{
            from: backNav.from,
            backLabel: backNav.backLabel,
            brand: {
              ...brand,
              companyName,
              brandLogo,
              isVerified,
            },
          }}
        />

        {alreadyApplied ? (
          <div className="mb-4 mt-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
            You have already applied to this campaign
          </div>
        ) : null}

        <CampaignViewContent
          campaign={campaign}
          onApplyClick={alreadyApplied ? undefined : handleApplyNow}
        />
      </div>
    </div>
  );
}
