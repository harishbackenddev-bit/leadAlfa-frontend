import React, { useMemo, useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectUser, updateUser } from "../../../store/slices/authSlice";
import BrandHeader from "./components/BrandHeader";
import BrandSidebar from "./components/BrandSidebar";
import BrandProfileVerification from "../../../pages/brand/ProfileVerification";
import { useOnboardingProfileGate } from "../../../hooks/useOnboardingProfileGate";
import {
  isProfileApproved,
  normalizeProfileFromApiResponse,
} from "../../../utils/onboardingProfile";
import { getBrandProfile } from "../../../services/api/apiservices";
import UserFeedbackModal from "../../feedback/UserFeedbackModal";

const BrandLayout = () => {
  const dispatch = useAppDispatch();
  const { checking: onboardingGateChecking } = useOnboardingProfileGate();
  const user = useAppSelector(selectUser);

  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : false
  );
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const profile = useMemo(() => {
    const p = user?.profile;
    if (p == null || typeof p !== "object" || p.error) return null;
    if (Object.keys(p).length === 0) return null;
    return p;
  }, [user?.profile]);

  const isApprovedProfile = useMemo(() => isProfileApproved(profile), [profile]);

  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isApprovedProfile || user?.role !== "brand") return undefined;

    let cancelled = false;

    (async () => {
      try {
        const data = await getBrandProfile();
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
        Loading profile...
      </div>
    );
  }

  const showVerificationGate = !isApprovedProfile;

  return (
    <div className="dash-theme h-screen bg-gray-50 flex overflow-hidden relative">
      {isApprovedProfile && sidebarOpen ? (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      {isApprovedProfile ? (
        <BrandSidebar
          isOpen={sidebarOpen}
          isCollapsed={sidebarCollapsed}
          onClose={() => setSidebarOpen(false)}
          onMenuToggle={() => setSidebarOpen((open) => !open)}
          onCollapseToggle={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />
      ) : null}

      <div
        className={`flex min-w-0 flex-1 flex-col transition-[margin-left] duration-[350ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
          isApprovedProfile ? (sidebarCollapsed ? "md:ml-[72px]" : "md:ml-64") : "md:ml-0"
        }`}
      >
        <BrandHeader disableNavigation={!isApprovedProfile} />
        <main
          data-scroll-root
          className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden"
        >
          {showVerificationGate ? (
            <BrandProfileVerification profile={profile} />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
      <UserFeedbackModal />
    </div>
  );
};

export default BrandLayout;
