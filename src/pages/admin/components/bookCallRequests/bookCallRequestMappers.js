import { BOOK_CALL_STATUS_LABELS } from "../../../../constants/bookCallRequest";
import { buildIsoDateTimeMeta } from "../contactRequests/contactRequestNotes";

const formatDate = (value) => {
  const meta = buildIsoDateTimeMeta(value);
  return meta.dateLabel || "—";
};

const formatDateTime = (value) => {
  const meta = buildIsoDateTimeMeta(value);
  return meta.fullLabel || "—";
};

export const resolveBookCallUserProfilePhoto = (userAccount) => {
  if (!userAccount) return null;

  return (
    userAccount?.profile?.media?.profilePhoto?.mediaDetails?.url ||
    userAccount?.media?.profilePhoto?.mediaDetails?.url ||
    userAccount?.media?.profilePhoto?.url ||
    userAccount?.profilePhoto?.mediaDetails?.url ||
    userAccount?.profilePhoto?.url ||
    (typeof userAccount?.profilePhoto === "string" ? userAccount.profilePhoto : null) ||
    userAccount?.avatar ||
    null
  );
};

const resolveBookCallUserRole = (userAccount) => {
  if (!userAccount) return null;
  const role = userAccount?.role || userAccount?.profile?.role;
  if (!role) return null;
  return String(role).charAt(0).toUpperCase() + String(role).slice(1);
};

export const mapBookCallRequestRow = (item = {}) => ({
  id: item.id,
  publicId: item.publicId,
  name: item.name || "—",
  businessEmail: item.businessEmail || "—",
  companyName: item.companyName || "—",
  companyWebsite: item.companyWebsite || "",
  status: item.status || "new",
  statusLabel: BOOK_CALL_STATUS_LABELS[item.status] || item.status || "New",
  adminNotes: item.adminNotes || "",
  userId: item.userId ?? null,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  resolvedAt: item.resolvedAt,
  resolvedBy: item.resolvedBy ?? null,
  date: formatDate(item.createdAt),
});

export const extractBookCallRequestsResponse = (
  response,
  fallbackPage = 1,
  fallbackLimit = 10
) => {
  const items = Array.isArray(response?.data) ? response.data : [];

  return {
    items: items.map(mapBookCallRequestRow),
    pagination: {
      page: response?.currentPage ?? fallbackPage,
      totalPages: response?.totalPages ?? 1,
      total: response?.totalItems ?? items.length,
      limit: response?.limit ?? fallbackLimit,
    },
  };
};

export const extractBookCallRequestDetail = (response) => {
  const request = response?.request || response;
  if (!request?.publicId) return null;

  return {
    ...mapBookCallRequestRow(request),
    ...buildIsoDateTimeMeta(request.createdAt),
    createdAtFormatted: formatDateTime(request.createdAt),
    updatedAtFormatted: formatDateTime(request.updatedAt),
    resolvedAtFormatted: formatDateTime(request.resolvedAt),
    userAccount: request.userAccount || null,
    profilePhotoUrl: resolveBookCallUserProfilePhoto(request.userAccount),
    roleLabel: resolveBookCallUserRole(request.userAccount),
    resolver: request.resolver || null,
  };
};

export const buildBookCallOriginalSummary = (request = {}) => {
  const lines = [];
  if (request.companyName && request.companyName !== "—") {
    lines.push(`Company: ${request.companyName}`);
  }
  if (request.companyWebsite) {
    lines.push(`Website: ${request.companyWebsite}`);
  }
  if (request.businessEmail && request.businessEmail !== "—") {
    lines.push(`Email: ${request.businessEmail}`);
  }
  return lines.join("\n");
};
