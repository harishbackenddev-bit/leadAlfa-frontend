import React from "react";
import HeaderCard from "../../creator/MyProfile/components/HeaderCard";
import CreatorReviews from "../../creator/MyProfile/components/CreatorReviews";
import PersonalInformation from "./components/PersonalInformation";
import CompanyInformation from "./components/CompanyInformation";
import { useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../store/slices/authSlice";

export default function MyProfile() {
  const user = useAppSelector(selectUser);
  const profile = user?.profile || {};

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-xl sm:text-2xl font-extrabold uppercase font-anton text-gray-900 mb-4">
          MY PROFILE
        </h2>

        <HeaderCard
          user={user}
          profile={profile}
          editProfileLink="/brand/edit-profile"
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <PersonalInformation user={user} profile={profile} />
          <CompanyInformation user={user} profile={profile} />
        </div>
        <CreatorReviews user={user} profile={profile} />
      </div>
    </div>
  );
}
