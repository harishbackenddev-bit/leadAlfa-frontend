/** Profile photo URL with cache-busting when media metadata changes. */
export function getProfilePhotoSrc(profile) {
  const media = profile?.media?.profilePhoto;
  const url =
    (typeof media === "string" ? media : media?.mediaDetails?.url || media?.url) ||
    (typeof profile?.profilePhoto === "string" ? profile.profilePhoto : profile?.profilePhoto?.url) ||
    profile?.profilePhotoUrl;
  if (!url) return null;

  const version = media?.updatedAt ?? media?.id ?? profile?.updatedAt;
  if (version == null) return url;

  const joiner = url.includes("?") ? "&" : "?";
  return `${url}${joiner}v=${encodeURIComponent(String(version))}`;
}

export function getCreatorRealName(user = {}, profile = {}) {
  const name = [
    profile?.firstName || user?.firstName,
    profile?.lastName || user?.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return name || profile?.name || user?.name || "Creator";
}

export function getCreatorProfileHandle(profile = {}, user = {}) {
  const raw =
    profile?.publicName?.trim() ||
    profile?.publicCreatorName?.trim() ||
    profile?.displayName?.trim() ||
    profile?.username?.trim() ||
    profile?.handle?.trim() ||
    user?.publicName?.trim() ||
    user?.publicCreatorName?.trim() ||
    user?.displayName?.trim() ||
    user?.username?.trim() ||
    user?.handle?.trim() ||
    "";
  if (!raw) return "";
  return raw.startsWith("@") ? raw : `@${raw}`;
}

/** Primary label for creator UI — username / handle if available, otherwise legal name. */
export function getCreatorDisplayName(user = {}, profile = {}) {
  const handle = getCreatorProfileHandle(profile, user);
  if (handle) return handle;
  return getCreatorRealName(user, profile);
}
