import { useEffect, useState } from "react";
import { getBrandProfile } from "../../../../services/api/apiservices";
import { useAppDispatch, useAppSelector } from "../../../../store/hooks";
import { selectUser, updateUser } from "../../../../store/slices/authSlice";
import { normalizeProfileFromApiResponse } from "../../../../utils/onboardingProfile";

export function useBrandProfile() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const [profile, setProfile] = useState(user?.profile || {});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      try {
        setLoading(true);
        const data = await getBrandProfile();
        const normalized = normalizeProfileFromApiResponse(data);

        if (cancelled) return;

        if (normalized) {
          setProfile(normalized);
          dispatch(updateUser({ profile: normalized }));
        }
      } catch {
        // Keep the profile already seeded from auth state.
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  return { user, profile, loading };
}
