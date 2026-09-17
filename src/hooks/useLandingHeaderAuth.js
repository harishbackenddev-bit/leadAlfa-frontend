import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectIsAuthenticated, selectUser, updateUser } from "../store/slices/authSlice";
import {
  normalizeProfileFromApiResponse,
  roleRequiresOnboardingProfile,
} from "../utils/onboardingProfile";
import { getBrandProfile, getCreatorProfile } from "../services/api/apiservices";

/**
 * Landing header auth: show logged-in user from Redux when authenticated.
 * Refreshes brand/creator profile so logo/photo is available in the header.
 */
export function useLandingHeaderAuth() {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectUser);

  const showAuthenticatedHeader = isAuthenticated && Boolean(user);

  useEffect(() => {
    if (!showAuthenticatedHeader || !roleRequiresOnboardingProfile(user.role)) {
      return undefined;
    }

    let cancelled = false;

    (async () => {
      try {
        const response =
          user.role === "brand"
            ? await getBrandProfile()
            : await getCreatorProfile();
        const normalized = normalizeProfileFromApiResponse(response);

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
  }, [dispatch, showAuthenticatedHeader, user?.role, user?.email]);

  return {
    user: showAuthenticatedHeader ? user : null,
    showAuthenticatedHeader,
  };
}
