import React, { useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import CreatorHeader from "./components/CreatorHeader";
import CreatorDetails from "./components/CreatorDetails";
import PortfolioWorks from "./components/PortfolioWorks";
import CustomerReviews from "./components/CustomerReviews";
import CreatorVideoModal from "./components/CreatorVideoModal";
import CreatorApplicationPanel from "./components/CreatorApplicationPanel";
import SendInviteModal from "./components/SendInviteModal";
import { useBrandCreatorById } from "./hooks/useBrandCreators";

export default function ViewCreator() {
  const location = useLocation();
  const { id } = useParams();
  const { creator, isLoading, isError, error, refetch } = useBrandCreatorById(id);
  const [videoModal, setVideoModal] = useState({ open: false, url: "", title: "" });
  const [inviteOpen, setInviteOpen] = useState(false);

  // When navigated from a campaign's "Pending Creators" → View Proposal modal,
  // we get the full application record + the originating campaign so we can
  // render the proposal section + accept/reject controls inline.
  const application = location.state?.application || null;
  const applicationCampaignId = location.state?.campaignId || null;
  const returnTo = location.state?.returnTo || null;

  const handleInviteCreator = () => {
    setInviteOpen(true);
  };

  const handlePlayVideo = ({ url, title }) => {
    if (!url) return;
    setVideoModal({ open: true, url, title: title || "Creator video" });
  };

  const closeVideoModal = () => {
    setVideoModal({ open: false, url: "", title: "" });
  };

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      <div className="mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link to="/brand/creators" className="text-[#64748b] hover:text-[#1E60DB]">
            Creators
          </Link>
          <span className="text-[#cbd5e1]">/</span>
          <span className="font-medium text-[#1E60DB]">View Creator</span>
        </div>

        {isLoading && (
          <div className="rounded-2xl bg-white py-12 text-center text-[#64748b]">
            Loading creator profile...
          </div>
        )}

        {isError && (
          <div className="rounded-2xl bg-white py-12 text-center">
            <p className="mb-4 text-red-500">
              {error?.message || "Failed to load creator profile."}
            </p>
            <Button type="button" onClick={refetch}>
              Retry
            </Button>
          </div>
        )}

        {!isLoading && !isError && !creator && (
          <div className="rounded-2xl bg-white py-12 text-center">
            <p className="mb-3 text-[#64748b]">Creator not found.</p>
            <Link to="/brand/creators" className="text-[#1E60DB] hover:underline">
              Back to Creators
            </Link>
          </div>
        )}       

        {!isLoading && !isError && creator && (
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="font-['Manrope:Bold',sans-serif] text-[24px] font-bold text-[#1a1a1a] sm:text-[28px]">
                View Creator
              </h1>
              <Button
                type="button"
                onClick={handleInviteCreator}
                className="h-12 rounded-xl bg-gradient-to-b from-[#0353a4] to-[#4b96e3] px-8 font-['Manrope:SemiBold',sans-serif] text-[14px] font-semibold hover:bg-[#1a54c4]"
              >
                Invite Creator
              </Button>
            </div>

            <div className="rounded-2xl border border-[#e8edf3] bg-white shadow-sm">
              <CreatorHeader creator={creator.creatorHeader} />
            </div>

            {application ? (
              <CreatorApplicationPanel
                application={application}
                campaignId={applicationCampaignId}
                returnTo={returnTo}
              />
            ) : null}

            <CreatorDetails
              primaryNiches={creator.primaryNiches}
              secondaryNiches={creator.secondaryNiches}
              appearance={creator.appearance}
              skills={creator.skills}
            />

            <PortfolioWorks items={creator.portfolio} onPlayVideo={handlePlayVideo} />

            {creator.reviews.length > 0 && (
              <div className="rounded-2xl border border-[#e8edf3] bg-white shadow-sm">
                <CustomerReviews reviews={creator.reviews} />
              </div>
            )}
          </div>
        )}
      </div>

      <CreatorVideoModal
        open={videoModal.open}
        videoUrl={videoModal.url}
        title={videoModal.title}
        onClose={closeVideoModal}
      />

      <SendInviteModal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        presetCreatorId={id}
      />
    </div>
  );
}
