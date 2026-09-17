import { useCallback, useEffect, useRef, useState } from "react";
import { getCreatorProfile } from "../../../../services/api/apiservices";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectUser, updateUser } from "../../../../store/slices/authSlice";
import {
  clearOnboardingProfileCache,
  mergeCreatorAuthUserFromProfile,
  normalizeProfileFromApiResponse,
} from "../../../../utils/onboardingProfile";

export function useCreatorProfile({ refreshOnMount = true } = {}) {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const userRef = useRef(user);
  userRef.current = user;

  const [profile, setProfile] = useState(user?.profile || {});
  const [loading, setLoading] = useState(refreshOnMount);

  const applyProfile = useCallback(
    (normalized) => {
      if (!normalized) return null;
      setProfile(normalized);
      dispatch(
        updateUser(mergeCreatorAuthUserFromProfile(userRef.current, normalized))
      );
      return normalized;
    },
    [dispatch]
  );

  const refreshProfile = useCallback(async () => {
    clearOnboardingProfileCache();
    const data = await getCreatorProfile();
    const normalized = normalizeProfileFromApiResponse(data);
    return applyProfile(normalized);
  }, [applyProfile]);

  useEffect(() => {
    if (!refreshOnMount) return undefined;

    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getCreatorProfile();
        const normalized = normalizeProfileFromApiResponse(data);
        if (!cancelled) {
          applyProfile(normalized);
        }
      } catch {
        if (!cancelled && userRef.current?.profile) {
          setProfile(userRef.current.profile);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [applyProfile, refreshOnMount]);

  return {
    user,
    profile,
    loading,
    refreshProfile,
  };
}
