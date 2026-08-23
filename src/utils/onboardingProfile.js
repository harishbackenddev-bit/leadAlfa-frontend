import { getBrandProfile, getCreatorProfile } from "../services/api/apiservices";
import { getRoleHomeRoute, normalizeRole } from "./roleRoutes";

/** Roles that must complete brand/creator profile onboarding before app access. */
const ONBOARDING_PROFILE_ROLES = new Set(["creator", "brand"]);

export function roleRequiresOnboardingProfile(role) {
  return ONBOARDING_PROFILE_ROLES.has(normalizeRole(role));
}

/** True when API body indicates creator/brand profile does not exist. */
export function isProfileNotFoundResponse(data) {
  if (data == null) return true;
  if (typeof data !== "object") return false;
  if (data.error) return true;
  if (data.data?.error) return true;
  if (data.profile?.error) return true;
  return false;
}

/**
 * Normalize profile payload from GET /creator/profile or GET /brand/profile.
 */
export function normalizeProfileFromApiResponse(data) {
  if (data == null || typeof data !== "object") return null;
  if (isProfileNotFoundResponse(data)) return null;
  const nested =
    data.profile ??
    data.data?.profile ??
    (data.data && typeof data.data === "object" && !data.data.error
      ? data.data
      : null);
  if (nested && typeof nested === "object" && !nested.error) return nested;
  if (!data.error && (data.id != null || data.companyName != null)) return data;
  return null;
}

/**
 * True when the user has a role and a persisted brand/creator profile (onboarding finished).
 */
export function userHasCompletedOnboardingProfile(user) {
  if (!user?.role) return false;
  if (!roleRequiresOnboardingProfile(user.role)) return true;
  const p = user.profile;
  if (p == null || typeof p !== "object") return false;
  if (p.error) return false;
  if (Object.keys(p).length === 0) return false;
  return true;
}

const profileFetchPromises = new Map();

function buildProfileFetchCacheKey(role, cacheKey) {
  if (cacheKey) return cacheKey;
  const normalized = typeof role === "string" ? role.trim().toLowerCase() : "";
  return normalized || "unknown";
}

async function fetchOnboardingProfileForRoleUncached(role) {
  const normalized = typeof role === "string" ? role.trim().toLowerCase() : "";
  try {
    if (normalized === "creator") {
      const data = await getCreatorProfile();
      return normalizeProfileFromApiResponse(data);
    }
    if (normalized === "brand") {
      const data = await getBrandProfile();
      return normalizeProfileFromApiResponse(data);
    }
  } catch (err) {
    if (err && typeof err === "object") {
      return normalizeProfileFromApiResponse(err);
    }
    return null;
  }
  return null;
}

/** Clear cached profile requests (call on logout). */
export function clearOnboardingProfileCache() {
  profileFetchPromises.clear();
}

/**
 * Fetch profile for onboarding gate (returns null if missing or error).
 * Dedupes in-flight / recent requests per cache key.
 */
export async function fetchOnboardingProfileForRole(role, options = {}) {
  const { cacheKey, force = false } = options;
  const key = buildProfileFetchCacheKey(role, cacheKey);

  if (force) {
    profileFetchPromises.delete(key);
  }

  if (profileFetchPromises.has(key)) {
    return profileFetchPromises.get(key);
  }

  const promise = fetchOnboardingProfileForRoleUncached(role);
  profileFetchPromises.set(key, promise);
  return promise;
}

/**
 * True when a logged-in user should leave /signup (admin, or creator/brand with profile).
 */
export function shouldLeaveSignupForUser(user) {
  if (!user?.role) return false;
  return userHasCompletedOnboardingProfile(user);
}

/**
 * Post-login / session-restore destination. Admin → dashboard; creator/brand → signup or home.
 */
export async function resolvePostAuthDestination(user) {
  if (!user?.role) {
    return { path: "/signup?step=role", state: undefined, profile: null };
  }

  if (!roleRequiresOnboardingProfile(user.role)) {
    return {
      path: getRoleHomeRoute(user.role),
      state: undefined,
      profile: null,
    };
  }

  const profile = await fetchOnboardingProfileForRole(user.role, {
    cacheKey: `${user.email || ""}:${user.role}`,
  });
  const merged = { ...user, profile: profile ?? null };

  if (userHasCompletedOnboardingProfile(merged)) {
    return {
      path: getRoleHomeRoute(user.role),
      state: undefined,
      profile: profile ?? null,
    };
  }

  return {
    path: "/signup",
    state: { resumeOnboarding: true },
    profile: profile ?? null,
  };
}
