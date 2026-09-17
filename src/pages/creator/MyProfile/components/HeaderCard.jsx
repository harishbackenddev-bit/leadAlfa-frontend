import React from "react";
import { useNavigate } from "react-router-dom";
import {
  getCreatorProfileHandle,
  getCreatorRealName,
  getProfilePhotoSrc,
} from "../../../../utils/profileMedia";

export default function HeaderCard({
  user,
  profile,
  editProfileLink,
  showEditButton = true,
}) {
  const navigate = useNavigate();
  const profilePhotoSrc = getProfilePhotoSrc(profile);

  const realName = getCreatorRealName(user, profile);
  const profileName = getCreatorProfileHandle(profile, user);

  const handleEditProfile = () => {
    navigate(editProfileLink || "/creator/my-profile/edit");
  };

  return (
    <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary sm:h-[70px] sm:w-[70px]">
            {profilePhotoSrc ? (
              <img
                key={profilePhotoSrc}
                src={profilePhotoSrc}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl font-semibold text-white">
                {user?.firstName?.[0] || profile?.firstName?.[0] || ""}
                {user?.lastName?.[0] || profile?.lastName?.[0] || ""}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 sm:text-xl">
              {realName}
            </h3>
            {profileName ? (
              <p className="mt-0.5 text-sm text-gray-500">
                {profileName}
              </p>
            ) : null}
            {profile?.bio ? (
              <p className="mt-2 max-w-5xl text-sm leading-6 text-gray-600">
                {profile.bio}
              </p>
            ) : null}
          </div>
        </div>

        {showEditButton ? (
          <div className="flex w-full md:w-auto md:justify-end">
            <button
              onClick={handleEditProfile}
              className="main-btn w-full cursor-pointer rounded-full px-7 py-3.5 text-sm text-white transition md:w-auto md:whitespace-nowrap"
            >
              Edit Profile
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
