import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "../../../components/ui/button";
import CreatorCampaignDetailBanner from "../ExploreCampaigns/components/CreatorCampaignDetailBanner";
import CampaignViewContent from "../../../components/campaign/CampaignViewContent";
import AcceptInvitationModal from "./components/AcceptInvitationModal";
import DeclineInvitationModal from "./components/DeclineInvitationModal";
import {
  acceptCreatorInvitationMutation,
  declineCreatorInvitationMutation,
  getActiveCampaignsQueryOptions,
  getCreatorInvitationDetailQueryOptions,
} from "../../../services/tanstack/queryService";
import { useNotification } from "../../../context/NotificationContext";
import {
  mapCreatorInvitationToCard,
  parseApiError,
} from "../../brand/creators/invitationsMapper";
import {
  calculateCampaignDaysLeft,
  getCampaignBrandInfo,
} from "../../../utils/creatorCampaignMappers";
import bannerImage from "../../../assets/images/campaign/bannerImage.jpg";

export default function InvitationDetailView() {
  const { id: publicId } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const [acceptOpen, setAcceptOpen] = useState(false);
  const [declineOpen, setDeclineOpen] = useState(false);

  /* -------------------- invitation -------------------- */
  const {
    data: invitationRaw,
    isLoading: isInvitationLoading,
    isError: isInvitationError,
  } = useQuery(getCreatorInvitationDetailQueryOptions(publicId));

  const invitation = useMemo(
    () => (invitationRaw ? mapCreatorInvitationToCard(invitationRaw) : null),
    [invitationRaw]
  );

  /* -------------------- full campaign hydration --------------------
   * The invitation detail endpoint only returns a slim campaign object
   * (title, brief, compensation, deliverables, platform). The shared
   * `CampaignViewContent` component needs the rest (creative direction,
   * media, dos/don'ts, dates, etc.).
   *
   * IMPORTANT: `/campaigns/:publicId` is BRAND-only and returns 403
   * "Brand profile not found" for creator tokens. We use the creator-
   * facing `/campaigns/active` list and find the matching record by
   * `publicId` first, then numeric `id` (matches the same approach used
   * in `CampaignDetailsView` for `/creator/campaigns/:publicId`).
   */
  const campaignPublicId = invitation?.campaignPublicId || null;
  const campaignNumericId = invitationRaw?.campaign?.id ?? null;

  const { data: activeResp, isLoading: isCampaignLoading } = useQuery({
    ...getActiveCampaignsQueryOptions(),
    enabled: Boolean(campaignPublicId || campaignNumericId),
  });

  const fullCampaign = useMemo(() => {
    const list = activeResp?.campaigns || activeResp?.data?.campaigns || [];
    if (!Array.isArray(list) || list.length === 0) return null;
    return (
      list.find(
        (c) =>
          (campaignPublicId && c?.publicId === campaignPublicId) ||
          (campaignNumericId != null && Number(c?.id) === Number(campaignNumericId))
      ) || null
    );
  }, [activeResp, campaignPublicId, campaignNumericId]);

  // Merge: full campaign wins, invitation stub fills the gaps if anything
  // is missing (defensive — slim payloads are still useful while loading
  // or if the campaign is no longer in the active list).
  const campaignData = useMemo(() => {
    const stub = invitationRaw?.campaign || {};
    if (!fullCampaign) return stub;
    return { ...stub, ...fullCampaign };
  }, [invitationRaw, fullCampaign]);

  /* -------------------- mutations -------------------- */
  const { mutate: acceptInvite, isPending: isAccepting } = useMutation({
    ...acceptCreatorInvitationMutation(),
    onSuccess: (data) => {
      const acceptedCampaignPublicId =
        data?.invitation?.campaignPublicId ||
        data?.campaignPublicId ||
        invitation?.campaignPublicId ||
        null;
      showNotification({
        type: "success",
        message: "Invitation accepted",
        description: acceptedCampaignPublicId
          ? "Redirecting to the campaign application..."
          : "You can now apply to the campaign.",
      });
      setAcceptOpen(false);
      if (acceptedCampaignPublicId) {
        setTimeout(() => {
          navigate(`/creator/campaigns/${acceptedCampaignPublicId}/apply`);
        }, 400);
      }
    },
    onError: (error) => {
      showNotification({
        type: "error",
        message: "Could not accept invitation",
        description: parseApiError(error, "Please try again later."),
      });
    },
  });

  const { mutate: declineInvite, isPending: isDeclining } = useMutation({
    ...declineCreatorInvitationMutation(),
    onSuccess: () => {
      showNotification({
        type: "success",
        message: "Invitation declined",
        description: "The invitation has been declined.",
      });
      setDeclineOpen(false);
      setTimeout(() => navigate("/creator/invitations"), 400);
    },
    onError: (error) => {
      showNotification({
        type: "error",
        message: "Could not decline invitation",
        description: parseApiError(error, "Please try again later."),
      });
    },
  });

  /* -------------------- early states -------------------- */
  if (isInvitationLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isInvitationError || !invitation) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-gray-50">
        <p className="text-red-600">Invitation not found.</p>
        <Button
          type="button"
          variant="outline"
          className="rounded-xl"
          onClick={() => navigate("/creator/invitations")}
        >
          Back to My Invitations
        </Button>
      </div>
    );
  }

  /* -------------------- derived UI data -------------------- */
  const bannerUrl =
    campaignData?.media?.coverImage?.url ||
    campaignData?.media?.coverImage ||
    invitation.image ||
    bannerImage;

  const { brandId, companyName, brandLogo, isVerified, brand } =
    getCampaignBrandInfo(campaignData);
  const daysLeft = calculateCampaignDaysLeft(campaignData);

  const status = invitation.status;
  const isPending = status === "pending";
  const isAccepted = status === "accepted";
  // Apply Now is shown ONLY when the creator has accepted AND we know
  // which campaign to redirect to. Pending / declined never see it.
  const canApply = isAccepted && Boolean(invitation.campaignPublicId);

  const handleApply = () => {
    if (invitation.campaignPublicId) {
      navigate(`/creator/campaigns/${invitation.campaignPublicId}/apply`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-[1920px] px-4 py-6 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => navigate("/creator/invitations")}
          className="mb-4 inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to My Invitations
        </button>

        <CreatorCampaignDetailBanner
          imageUrl={bannerUrl}
          altText={invitation.title}
          campaignTitle={invitation.title}
          companyName={invitation.brandName || companyName}
          brandLogo={invitation.brandLogo || brandLogo}
          isVerified={isVerified}
          status={campaignData?.status}
          daysLeft={daysLeft}
          brandProfileTo={brandId ? `/creator/brands/${brandId}` : undefined}
          brandProfileState={{
            from: `/creator/invitations/${publicId}`,
            backLabel: "Back to Invitation Details",
            brand: { ...brand, companyName, brandLogo, isVerified },
          }}
        />

        {invitation.customMessage ? (
          <blockquote className="mt-4 rounded-xl border-l-4 border-[#0c7bb3] bg-blue-50 px-4 py-3 text-sm italic text-gray-700">
            "{invitation.customMessage}"
          </blockquote>
        ) : null}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
              isAccepted
                ? "border border-emerald-200 bg-emerald-50 text-emerald-700"
                : status === "declined"
                  ? "border border-red-200 bg-red-50 text-red-700"
                  : "border border-amber-200 bg-amber-50 text-amber-700"
            }`}
          >
            {invitation.statusLabel}
          </span>
          <span className="text-xs text-gray-500">
            Sent on {invitation.invitationSent}
          </span>
          {isCampaignLoading ? (
            <span className="text-xs text-gray-400">
              · loading campaign details...
            </span>
          ) : null}
        </div>
        {isPending ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              className="rounded-xl btn-gradient px-6 hover:bg-[#0a6a9c]"
              onClick={() => setAcceptOpen(true)}
            >
              Accept Invitation
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-red-400 px-6 text-red-500 hover:border-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => setDeclineOpen(true)}
            >
              Decline Invitation
            </Button>
          </div>
        ) : null}

        <CampaignViewContent
          campaign={campaignData}
          onApplyClick={canApply ? handleApply : undefined}
          applyLabel="Apply to Campaign"
        />

       
      </div>

      {acceptOpen ? (
        <AcceptInvitationModal
          invitation={invitation}
          isProcessing={isAccepting}
          onClose={() => (isAccepting ? null : setAcceptOpen(false))}
          onConfirm={() => acceptInvite(publicId)}
        />
      ) : null}

      {declineOpen ? (
        <DeclineInvitationModal
          invitation={invitation}
          isProcessing={isDeclining}
          onClose={() => (isDeclining ? null : setDeclineOpen(false))}
          onConfirm={() => declineInvite(publicId)}
        />
      ) : null}
    </div>
  );
}
