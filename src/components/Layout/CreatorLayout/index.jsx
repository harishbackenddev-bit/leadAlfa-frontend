import React, { useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useAppSelector } from '../../../store/hooks'
import { selectUser } from '../../../store/slices/authSlice'
import CreatorHeader from './components/CreatorHeader';
import { NotificationProvider } from '../../../context/NotificationContext';
import CreatorProfileVerification from '../../../pages/creator/ProfileVerification';
import { useOnboardingProfileGate } from '../../../hooks/useOnboardingProfileGate';

const CreatorLayout = () => {
  const location = useLocation();
  const { checking: onboardingGateChecking } = useOnboardingProfileGate();
  const user = useAppSelector(selectUser);

  const profile = useMemo(() => {
    const p = user?.profile;
    if (p == null || typeof p !== "object" || p.error) return null;
    if (Object.keys(p).length === 0) return null;
    return p;
  }, [user?.profile]);

  const isApprovedProfile = useMemo(
    () => String(profile?.status || "").trim().toLowerCase() === "approved",
    [profile?.status]
  );

  const isMyProfileRoute = location.pathname.startsWith('/creator/my-profile');

  if (onboardingGateChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-gray-600">
        Loading...
      </div>
    );
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50">
        <CreatorHeader disableNavigation={!isApprovedProfile} />
        <main>
          {!isApprovedProfile && !isMyProfileRoute ? (
            <CreatorProfileVerification profile={profile} />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </NotificationProvider>
  );
};

export default CreatorLayout;
