import React from "react";
import HeaderCard from "./components/HeaderCard";
import PortfolioSection from "./components/PortfolioSection";
import PersonalInformation from "./components/PersonalInformation";
import CreatorReviews from "./components/CreatorReviews";
import AccountActions from "./components/AccountActions";
import { useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../store/slices/authSlice";

export default function MyProfile() {
  const user = useAppSelector(selectUser);
  const profile = user?.profile || {};
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h2 className="text-xl sm:text-2xl font-extrabold font-anton text-gray-900 mb-4">
          My Profile
        </h2>

        <HeaderCard user={user} profile={profile} />
        <PortfolioSection user={user} profile={profile} />
        <PersonalInformation user={user} profile={profile} />
        <CreatorReviews user={user} profile={profile} />
        {/* <AccountActions user={user} profile={profile} /> */}
      </div>
    </div>
  );
}
