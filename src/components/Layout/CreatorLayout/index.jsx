import React, { useEffect, useMemo } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectUser, updateUser } from "../../../store/slices/authSlice";
import CreatorHeader from "./components/CreatorHeader";
import { NotificationProvider } from "../../../context/NotificationContext";
import CreatorProfileVerification from "../../../pages/creator/ProfileVerification";
import { useOnboardingProfileGate } from "../../../hooks/useOnboardingProfileGate";
import {
  isProfileApproved,
  normalizeProfileFromApiResponse,
} from "../../../utils/onboardingProfile";
import { getCreatorProfile } from "../../../services/api/apiservices";
import UserFeedbackModal from "../../feedback/UserFeedbackModal";

const CreatorLayout = () => {
  const dispatch = useAppDispatch();
  const { checking: onboardingGateChecking } = useOnboardingProfileGate();
  const user = useAppSelector(selectUser);

  const profile = useMemo(() => {
    const p = user?.profile;
    if (p == null || typeof p !== "object" || p.error) return null;
    if (Object.keys(p).length === 0) return null;
    return p;
  }, [user?.profile]);

  const isApprovedProfile = useMemo(() => isProfileApproved(profile), [profile]);

  useEffect(() => {
    if (isApprovedProfile || user?.role !== "creator") return undefined;

    let cancelled = false;

    (async () => {
      try {
        const data = await getCreatorProfile();
        const normalized = normalizeProfileFromApiResponse(data);
        if (!cancelled && normalized) {
          dispatch(updateUser({ profile: normalized }));
        }
      } catch {
        // Keep existing profile from auth state.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch, isApprovedProfile, user?.role]);

  if (onboardingGateChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <NotificationProvider>
      <div className="dash-theme min-h-screen bg-gray-50">
        <CreatorHeader disableNavigation={!isApprovedProfile} />
        <main>
          {!isApprovedProfile ? (
            <CreatorProfileVerification profile={profile} />
          ) : (
            <Outlet />
          )}
        </main>
        <UserFeedbackModal />
      </div>
    </NotificationProvider>
  );
};

export default CreatorLayout;
