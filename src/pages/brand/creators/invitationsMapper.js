import { formatCampaignCompensation } from "../../../components/campaign/campaignViewUtils";

/**
 * Mappers / formatters for the Campaign Invitations module.
 * Spec: docs/CAMPAGAIN_INVITATION_BRAND.MD
 *
 * The brand UI table needs a flat row shape:
 *   { id, publicId, name, avatar, totalPrice, inviteSent, status, raw }
 *
 * The creator picker needs:
 *   { id, name, handle, location, avatar, initials }
 */

const FALLBACK_AVATAR = "";

/** Format compensation for invitation/campaign display (invoice-based). */
export const formatCompensation = (campaign = {}) => formatCampaignCompensation(campaign);

/* -------------------------------------------------------------------------- */
/*  Date formatting                                                           */
/* -------------------------------------------------------------------------- */

export const formatInviteSentDate = (iso) => {
  if (!iso) return "—";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

/* -------------------------------------------------------------------------- */
/*  Creator helpers (avatar, initials, name)                                  */
/* -------------------------------------------------------------------------- */

const trim = (value) => String(value ?? "").trim();

export const getCreatorFullName = (creator = {}) => {
  const first = trim(creator?.firstName);
  const last = trim(creator?.lastName);
  const combined = `${first} ${last}`.trim();
  return combined || trim(creator?.publicName) || trim(creator?.name) || "Creator";
};

export const getCreatorInitials = (creator = {}) => {
  const first = trim(creator?.firstName).charAt(0);
  const last = trim(creator?.lastName).charAt(0);
  const initials = `${first}${last}`.toUpperCase();
  if (initials) return initials;

  const fallback = getCreatorFullName(creator);
  return fallback
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
};

export const getCreatorAvatar = (creator = {}) =>
  creator?.media?.profilePhoto?.mediaDetails?.url ||
  creator?.media?.profilePhoto?.url ||
  creator?.profilePhoto?.url ||
  creator?.profilePhoto ||
  creator?.avatar ||
  FALLBACK_AVATAR;

export const getCreatorLocation = (creator = {}) => {
  const city = trim(creator?.city);
  const country = trim(creator?.country);
  return [city, country].filter(Boolean).join(", ") || "Location N/A";
};

export const getCreatorHandle = (creator = {}) => {
  const handle = trim(creator?.publicName);
  if (handle) return handle.startsWith("@") ? handle : `@${handle}`;
  const fullName = trim(creator?.firstName) + trim(creator?.lastName);
  return fullName ? `@${fullName.toLowerCase()}` : "@creator";
};

/* -------------------------------------------------------------------------- */
/*  Picker creator (used by SendInviteModal)                                  */
/* -------------------------------------------------------------------------- */

/**
 * Map an API creator record (from /creator/list) into the SendInviteModal
 * picker's shape. The picker filters by name/handle/location.
 */
export const mapCreatorToPickerOption = (creator = {}) => ({
  id: creator?.id,
  name: getCreatorFullName(creator),
  handle: getCreatorHandle(creator),
  location: getCreatorLocation(creator),
  avatar: getCreatorAvatar(creator),
  initials: getCreatorInitials(creator),
  raw: creator,
});

/* -------------------------------------------------------------------------- */
/*  Campaign select (used by SendInviteModal)                                 */
/* -------------------------------------------------------------------------- */

/** Map a brand campaign record to a `<select>` option { value, label, raw }. */
export const mapCampaignToOption = (campaign = {}) => ({
  value: campaign?.id, // numeric id required by /campaigns/:id/invitations
  label:
    campaign?.campaignTitle?.trim() ||
    campaign?.title?.trim() ||
    `Campaign ${campaign?.publicId || campaign?.id || ""}`.trim(),
  raw: campaign,
});

/* -------------------------------------------------------------------------- */
/*  Invitation status label / badge class                                     */
/* -------------------------------------------------------------------------- */

const STATUS_TO_LABEL = {
  pending: "Pending",
  accepted: "Accepted",
  declined: "Declined",
};

export const getInvitationStatusLabel = (status) =>
  STATUS_TO_LABEL[String(status || "").toLowerCase()] || "Pending";

/* -------------------------------------------------------------------------- */
/*  Brand sent-invitation row mapper                                          */
/* -------------------------------------------------------------------------- */

/**
 * Convert a brand-side invitation record into the flat row shape the
 * `SentInvitesTable` consumes. Always returns a valid row even if some
 * fields are missing (defensive).
 */
export const mapBrandInvitationToRow = (invitation = {}) => {
  const creator = invitation?.creator || {};
  const campaign = invitation?.campaign || {};
  const status = String(invitation?.status || "pending").toLowerCase();

  return {
    id: invitation?.invitationId || invitation?.publicId || "",
    publicId: invitation?.invitationId || invitation?.publicId || "",
    name: getCreatorFullName(creator),
    handle: getCreatorHandle(creator),
    initials: getCreatorInitials(creator),
    avatar: getCreatorAvatar(creator),
    campaignTitle: mapCampaignToOption(campaign).label,
    campaignPublicId: campaign?.publicId || null,
    totalPrice: formatCompensation(campaign),
    inviteSent: formatInviteSentDate(invitation?.createdAt),
    status,
    statusLabel: getInvitationStatusLabel(status),
    raw: invitation,
  };
};

/* -------------------------------------------------------------------------- */
/*  Creator received-invitation card mapper                                   */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  API error parsing                                                         */
/* -------------------------------------------------------------------------- */

/**
 * Extract a user-friendly error message from any of the shapes the backend
 * may return (per docs/CAMPAGAIN_INVITATION_BRAND.MD section 2 & 3 errors).
 * Always returns a non-empty string; falls back to the provided default.
 */
export const parseApiError = (
  error,
  fallback = "Something went wrong. Please try again."
) => {
  if (!error) return fallback;
  if (typeof error === "string") return error;

  // Direct shapes thrown by apiservices.js (`error.response?.data || error.message`)
  const direct =
    error.error ||
    error.message ||
    error.detail ||
    error.statusText ||
    null;
  if (direct && typeof direct === "string") return direct;

  // Axios error fallback (in case caller forgets to unwrap)
  const axiosData = error.response?.data;
  if (axiosData) {
    if (typeof axiosData === "string") return axiosData;
    if (axiosData.error) return axiosData.error;
    if (axiosData.message) return axiosData.message;
    if (Array.isArray(axiosData.errors) && axiosData.errors.length) {
      return axiosData.errors
        .map((e) => (typeof e === "string" ? e : e?.message))
        .filter(Boolean)
        .join("; ");
    }
  }

  return fallback;
};

/**
 * Pull the numeric creator IDs the backend mentions in error strings like:
 *   - "Creator with ID 50 has already applied to this campaign."
 *   - "Creator with ID 1 has already been invited to this campaign."
 *   - "Invalid or unapproved creator IDs: 9, 12"
 * Returns an array of numbers (deduped). Empty array if none found.
 */
export const extractConflictingCreatorIds = (errorMessage) => {
  if (!errorMessage || typeof errorMessage !== "string") return [];
  const ids = new Set();

  // "Creator with ID <n>"
  const singleRe = /creator\s+with\s+id\s+(\d+)/gi;
  let match;
  while ((match = singleRe.exec(errorMessage)) !== null) {
    ids.add(Number(match[1]));
  }

  // "creator IDs: 1, 2, 3"
  const listRe = /creator\s+ids?\s*:\s*([0-9,\s]+)/i;
  const listMatch = listRe.exec(errorMessage);
  if (listMatch?.[1]) {
    listMatch[1]
      .split(/[,\s]+/)
      .map((part) => Number(part))
      .filter((n) => Number.isFinite(n) && n > 0)
      .forEach((n) => ids.add(n));
  }

  return Array.from(ids);
};

/**
 * Replace machine-style "Creator with ID 50" / "creator IDs: 9, 12" mentions
 * in an API error message with the corresponding creator names so brands see
 * something they recognise. Falls back to the original phrase when a name
 * is not available.
 *
 * @param {string} errorMessage - raw API error string
 * @param {Map<number, string> | Record<string, string>} idToName
 *        - lookup of creator id -> displayable name
 */
export const humanizeApiError = (errorMessage, idToName) => {
  if (!errorMessage || typeof errorMessage !== "string") return errorMessage;
  if (!idToName) return errorMessage;

  const lookup = (id) => {
    const numericId = Number(id);
    if (!Number.isFinite(numericId)) return null;
    if (idToName instanceof Map) return idToName.get(numericId) || null;
    return idToName[numericId] || idToName[String(numericId)] || null;
  };

  let result = errorMessage;

  // 1. "Creator with ID <n>" → "<Name>"
  result = result.replace(
    /creator\s+with\s+id\s+(\d+)/gi,
    (match, id) => lookup(id) || match
  );

  // 2. "creator IDs: 9, 12, 13" → "creators: User One, User Two, User Three"
  result = result.replace(
    /creator\s+ids?\s*:\s*([0-9,\s]+)/gi,
    (match, idsBlob) => {
      const names = idsBlob
        .split(/[,\s]+/)
        .map((part) => part.trim())
        .filter(Boolean)
        .map((id) => lookup(id) || `ID ${id}`);
      if (!names.length) return match;
      const label = names.length === 1 ? "creator" : "creators";
      return `${label}: ${names.join(", ")}`;
    }
  );

  // 3. Standalone "ID <n>" leftovers (only after rule #1 already mapped some)
  //    e.g. "ID 50 ..." in custom backend strings.
  result = result.replace(/\bID\s+(\d+)\b/g, (match, id) => {
    const name = lookup(id);
    return name ? name : match;
  });

  return result;
};

/** Map a creator-side invitation record into the grid card shape. */
export const mapCreatorInvitationToCard = (invitation = {}) => {
  const brand = invitation?.brand || {};
  const campaign = invitation?.campaign || {};
  const status = String(invitation?.status || "pending").toLowerCase();

  return {
    id: invitation?.invitationId || invitation?.publicId || "",
    publicId: invitation?.invitationId || invitation?.publicId || "",
    title: campaign?.title || campaign?.campaignTitle || "Campaign",
    brandName: brand?.name || brand?.companyName || "Brand",
    brandLogo: brand?.logo?.url || brand?.logo || null,
    campaignName: campaign?.title || campaign?.campaignTitle || "",
    description: campaign?.campaignBrief || invitation?.customMessage || "",
    customMessage: invitation?.customMessage || "",
    image:
      campaign?.media?.coverImage?.url ||
      campaign?.media?.coverImage ||
      brand?.logo?.url ||
      "",
    offerAmount: formatCompensation(campaign),
    deliverable: campaign?.deliverables || "",
    platform: Array.isArray(campaign?.platform) ? campaign.platform : [],
    invitationSent: formatInviteSentDate(invitation?.createdAt),
    status,
    statusLabel: getInvitationStatusLabel(status),
    campaignPublicId: campaign?.publicId || null,
    raw: invitation,
  };
};
