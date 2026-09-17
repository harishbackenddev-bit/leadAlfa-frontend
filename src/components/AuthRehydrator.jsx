import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  loadAuthFromToken,
  updateUser,
  selectUser,
} from "../store/slices/authSlice";
import {
  fetchOnboardingProfileForRole,
  roleRequiresOnboardingProfile,
  userHasCompletedOnboardingProfile,
} from "../utils/onboardingProfile";

/**
 * AuthRehydrator component to restore auth state on app load
 * Decodes token from localStorage and sets Redux state
 */
const AuthRehydrator = ({ children }) => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(selectUser);
  const profileFetchAttemptKeyRef = useRef("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    dispatch(loadAuthFromToken({ token }));
  }, [dispatch]);

  useEffect(() => {
    if (!user?.role || !roleRequiresOnboardingProfile(user.role)) {
      profileFetchAttemptKeyRef.current = "";
      return;
    }

    const key = `${user.email || ""}:${user.role}`;
    if (userHasCompletedOnboardingProfile(user)) {
      return;
    }
    if (profileFetchAttemptKeyRef.current === key) {
      return;
    }
    profileFetchAttemptKeyRef.current = key;

    let cancelled = false;

    (async () => {
      try {
        const profile = await fetchOnboardingProfileForRole(user.role, {
          cacheKey: key,
        });
        if (cancelled) return;
        dispatch(updateUser({ profile: profile ?? null }));
      } catch {
        if (!cancelled) {
          dispatch(updateUser({ profile: null }));
        }
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- bootstrap profile once per email+role
  }, [user?.email, user?.role, dispatch]);

  return children;
};

export default AuthRehydrator;
