import React from "react";
import BrandHeaderCard from "./components/BrandHeaderCard";
import CreatorReviews from "../../creator/MyProfile/components/CreatorReviews";
import PersonalInformation from "./components/PersonalInformation";
import CompanyInformation from "./components/CompanyInformation";
import TradeSafePayoutSettings from "./components/TradeSafePayoutSettings";
import { useBrandProfile } from "./hooks/useBrandProfile";

export default function MyProfile() {
  const { user, profile, loading } = useBrandProfile();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-xl sm:text-2xl font-extrabold uppercase text-gray-900 mb-4">
          MY PROFILE
        </h2>

        {loading ? (
          <div className="mb-6 rounded-lg border border-gray-100 bg-white p-6 text-sm text-gray-500 shadow-sm">
            Loading profile...
          </div>
        ) : (
          <BrandHeaderCard
            user={user}
            profile={profile}
            editProfileLink="/brand/edit-profile"
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PersonalInformation user={user} profile={profile} />
          <CompanyInformation user={user} profile={profile} />
        </div>

        {/* ✅ TradeSafe Payout Settings */}
        <div className="mb-6">
          <TradeSafePayoutSettings />
        </div>

        {/* <CreatorReviews user={user} profile={profile} /> */}
      </div>
    </div>
  );
}