export const FEEDBACK_STATUS_LABELS = {
  new: "New",
  in_progress: "In Progress",
  resolved: "Resolved",
};

export const FEEDBACK_STATUS_BADGE_CLASSES = {
  new: "bg-blue-50 text-blue-700 border-blue-200",
  in_progress: "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
};

export const FEEDBACK_TYPE_LABELS = {
  bug: "Bug Report",
  feedback: "Product Feedback",
};

export const FEEDBACK_TYPE_BADGE_CLASSES = {
  bug: "bg-red-50 text-red-700 border-red-200",
  feedback: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

export const formatDate = (value) => {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "—";
  }
};

export const formatDateTime = (value) => {
  if (!value) return "—";
  try {
    const d = new Date(value);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "—";
  }
};

export const resolveSubmitterName = (userAccount) => {
  if (!userAccount) return "Anonymous User";
  const firstName = userAccount.firstName || "";
  const lastName = userAccount.lastName || "";
  const fullName = `${firstName} ${lastName}`.trim();
  return fullName || userAccount.email || "User #" + (userAccount.id || "");
};

export const mapUserFeedbackRow = (item = {}) => ({
  id: item.id,
  publicId: item.publicId || "—",
  type: item.type || "feedback",
  typeLabel: FEEDBACK_TYPE_LABELS[item.type] || item.type || "Feedback",
  description: item.description || "",
  pageUrl: item.pageUrl || "/",
  status: item.status || "new",
  statusLabel: FEEDBACK_STATUS_LABELS[item.status] || item.status || "New",
  adminNotes: item.adminNotes || "",
  userId: item.userId ?? null,
  userAccount: item.userAccount || null,
  submitterName: resolveSubmitterName(item.userAccount),
  submitterEmail: item.userAccount?.email || "—",
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  resolvedAt: item.resolvedAt,
  resolvedBy: item.resolvedBy,
  resolver: item.resolver || null,
  date: formatDate(item.createdAt),
});

export const extractUserFeedbackListResponse = (
  response,
  fallbackPage = 1,
  fallbackLimit = 10
) => {
  const items = Array.isArray(response?.data) ? response.data : [];

  return {
    items: items.map(mapUserFeedbackRow),
    pagination: {
      page: response?.currentPage ?? fallbackPage,
      totalPages: response?.totalPages ?? 1,
      total: response?.totalItems ?? items.length,
      limit: response?.limit ?? fallbackLimit,
    },
  };
};

export const extractUserFeedbackDetail = (response) => {
  const feedback = response?.feedback || response;
  if (!feedback?.publicId && !feedback?.id) return null;

  return {
    ...mapUserFeedbackRow(feedback),
    createdAtFormatted: formatDateTime(feedback.createdAt),
    updatedAtFormatted: formatDateTime(feedback.updatedAt),
    resolvedAtFormatted: formatDateTime(feedback.resolvedAt),
  };
};
