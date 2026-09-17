import React from "react";
import { useNavigate } from "react-router-dom";
import BrandAvatar from "../../../../components/brand/BrandAvatar";

export default function BrandHeaderCard({ user, profile, editProfileLink }) {
  const navigate = useNavigate();
  const companyName = profile?.companyName || "Brand";

  const handleEditProfile = () => {
    navigate(editProfileLink || "/brand/edit-profile");
  };

  return (
    <div className="mb-6 rounded-lg border border-gray-100 bg-white p-3 shadow-sm sm:p-6">
      <div className="flex flex-col items-center justify-between gap-4 md:flex-row md:items-start">
        <div className="flex w-full items-center gap-4 md:w-auto">
          <BrandAvatar profile={profile} size="lg" />
          <div>
            <h3 className="text-lg text-gray-900 sm:text-xl">
              {companyName}
            </h3>
            <p className="text-sm text-gray-500">
              {profile?.bio || profile?.description || "N/A"}
            </p>
          </div>
        </div>

        <div className="flex w-full md:w-auto md:justify-end">
          {/* <button
            type="button"
            onClick={handleEditProfile}
            className="main-btn w-full cursor-pointer rounded-full px-7 py-3.5 text-sm text-white transition md:w-auto md:whitespace-nowrap"
          >
            Edit Profile
          </button> */}
        </div>
      </div>
    </div>
  );
}
