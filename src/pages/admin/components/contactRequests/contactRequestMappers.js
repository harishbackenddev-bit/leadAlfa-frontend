import {
  CONTACT_STATUS_LABELS,
  INQUIRY_TYPE_LABELS,
} from "../../../../constants/contactRequest";
import { buildIsoDateTimeMeta } from "./contactRequestNotes";

const formatDate = (value) => {
  const meta = buildIsoDateTimeMeta(value);
  return meta.dateLabel || "—";
};

const formatDateTime = (value) => {
  const meta = buildIsoDateTimeMeta(value);
  return meta.fullLabel || "—";
};

export const resolveContactUserProfilePhoto = (userAccount) => {
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

const resolveContactUserRole = (userAccount) => {
  if (!userAccount) return null;
  const role = userAccount?.role || userAccount?.profile?.role;
  if (!role) return null;
  return String(role).charAt(0).toUpperCase() + String(role).slice(1);
};

export const mapContactRequestRow = (item = {}) => ({
  id: item.id,
  publicId: item.publicId,
  name: item.name || "—",
  email: item.email || "—",
  inquiryType: item.inquiryType,
  inquiryTypeLabel: INQUIRY_TYPE_LABELS[item.inquiryType] || item.inquiryType || "—",
  message: item.message || "",
  status: item.status || "new",
  statusLabel: CONTACT_STATUS_LABELS[item.status] || item.status || "New",
  adminNotes: item.adminNotes || "",
  userId: item.userId ?? null,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  resolvedAt: item.resolvedAt,
  date: formatDate(item.createdAt),
});

export const extractContactRequestsResponse = (response, fallbackPage = 1, fallbackLimit = 10) => {
  const items = Array.isArray(response?.data) ? response.data : [];

  return {
    items: items.map(mapContactRequestRow),
    pagination: {
      page: response?.currentPage ?? fallbackPage,
      totalPages: response?.totalPages ?? 1,
      total: response?.totalItems ?? items.length,
      limit: response?.limit ?? fallbackLimit,
    },
  };
};

export const extractContactRequestDetail = (response) => {
  const request = response?.request || response;
  if (!request?.publicId) return null;

  return {
    ...mapContactRequestRow(request),
    ...buildIsoDateTimeMeta(request.createdAt),
    createdAtFormatted: formatDateTime(request.createdAt),
    updatedAtFormatted: formatDateTime(request.updatedAt),
    resolvedAtFormatted: formatDateTime(request.resolvedAt),
    userAccount: request.userAccount || null,
    profilePhotoUrl: resolveContactUserProfilePhoto(request.userAccount),
    roleLabel: resolveContactUserRole(request.userAccount),
    resolver: request.resolver || null,
  };
};
