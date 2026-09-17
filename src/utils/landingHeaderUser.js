import { getCompanyInitials, resolveBrandLogo } from "./brandProfileMapper";
import { normalizeRole } from "./roleRoutes";
import { getCreatorProfileHandle } from "./profileMedia";

function resolveCreatorAvatarUrl(profile = {}) {
  const photo = profile?.media?.profilePhoto;
  const details = photo?.mediaDetails || photo;

  return (
    details?.url ||
    details?.secureUrl ||
    (typeof photo === "string" ? photo : null) ||
    null
  );
}

function buildPersonInitials(firstName = "", lastName = "") {
  const initials = `${firstName?.[0] || ""}${lastName?.[0] || ""}`.trim();
  return initials.toUpperCase() || "U";
}

/**
 * Resolve avatar, label, and initials for the public landing header.
 * Brands use company logo/name; creators use profile photo/person name.
 */
export function resolveLandingHeaderUserDisplay(user) {
  if (!user) {
    return {
      avatarUrl: null,
      displayName: "User",
      initials: "U",
      roleLabel: "User",
    };
  }

  const role = normalizeRole(user.role);
  const profile = user.profile || {};

  if (role === "brand") {
    const companyName =
      profile.companyName ||
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      "Brand";

    return {
      avatarUrl: resolveBrandLogo(profile),
      displayName: companyName,
      initials: getCompanyInitials(companyName),
      roleLabel: "Brand",
    };
  }

  if (role === "creator") {
    const handle = getCreatorProfileHandle(profile, user);
    const displayName =
      handle ||
      `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      "Creator";

    return {
      avatarUrl: resolveCreatorAvatarUrl(profile),
      displayName,
      initials: buildPersonInitials(user.firstName, user.lastName),
      roleLabel: "Creator",
    };
  }

  const displayName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || "User";

  return {
    avatarUrl: null,
    displayName,
    initials: buildPersonInitials(user.firstName, user.lastName),
    roleLabel: role || "User",
  };
}
