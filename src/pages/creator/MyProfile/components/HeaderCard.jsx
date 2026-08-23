import React from "react";
import { useNavigate } from "react-router-dom";
import pitchVideo from "../../../../assets/images/creator/pitchVideo.png";

export default function HeaderCard({ user, profile, editProfileLink }) {
  const navigate = useNavigate();

  const handleEditProfile = () => {
    navigate(editProfileLink || "/creator/my-profile/edit");
  };

  return (
    <div className="bg-white rounded-lg p-3 sm:p-6 mb-6 shadow-sm border border-gray-100">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-gray-200 flex items-center justify-center">
            {profile?.media?.profilePhoto?.mediaDetails?.url ? (
              <img
                src={profile.media.profilePhoto.mediaDetails.url}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-3xl font-bold text-gray-600">
                {user?.firstName?.[0] || ""}
                {user?.lastName?.[0] || ""}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-anton text-gray-900">
              {user?.firstName} {user?.lastName}
            </h3>
            <p className="text-sm text-gray-500 ">
              {profile?.bio ||
                "N/A"}
            </p>
          </div>
        </div>

        <div className="w-full md:w-auto flex md:justify-end">
          <button
            onClick={handleEditProfile}
            className="w-full md:w-auto px-7 py-3.5 main-btn text-white rounded-full text-sm transition md:whitespace-nowrap cursor-pointer"
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
