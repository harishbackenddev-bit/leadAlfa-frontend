import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { selectUser, updateUser } from "../store/slices/authSlice";
import {
  fetchOnboardingProfileForRole,
  roleRequiresOnboardingProfile,
  userHasCompletedOnboardingProfile,
} from "../utils/onboardingProfile";

/**
 * Creator/brand app shell gate: load profile from API once; redirect to signup if missing.
 */
export function useOnboardingProfileGate() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [checking, setChecking] = useState(true);
  const fetchAttemptKeyRef = useRef("");

  useEffect(() => {
    if (!user?.role || !roleRequiresOnboardingProfile(user.role)) {
      fetchAttemptKeyRef.current = "";
      setChecking(false);
      return undefined;
    }

    if (userHasCompletedOnboardingProfile(user)) {
      setChecking(false);
      return undefined;
    }

    const key = `${user.email || ""}:${user.role}`;
    if (fetchAttemptKeyRef.current === key) {
      return undefined;
    }
    fetchAttemptKeyRef.current = key;

    let cancelled = false;
    setChecking(true);

    (async () => {
      try {
        const profile = await fetchOnboardingProfileForRole(user.role, {
          cacheKey: key,
        });
        if (cancelled) return;

        dispatch(updateUser({ profile: profile ?? null }));

        if (profile) {
          setChecking(false);
          return;
        }

        if (!location.pathname.startsWith("/signup")) {
          navigate("/signup", {
            replace: true,
            state: { resumeOnboarding: true },
          });
        }
      } catch {
        if (cancelled) return;
        dispatch(updateUser({ profile: null }));
        if (!location.pathname.startsWith("/signup")) {
          navigate("/signup", {
            replace: true,
            state: { resumeOnboarding: true },
          });
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user?.email, user?.role, dispatch, navigate, location.pathname]);

  return { checking };
}
