export function resolveProfileVerificationState(profile = {}, user = {}) {
  const status = String(profile?.status || "pending").trim().toLowerCase();
  const clarificationRequested =
    profile?.clarificationRequested === true ||
    status === "clarification_requested" ||
    status === "clarify";

  const isRejected = status === "rejected";
  const isClarification = clarificationRequested && !isRejected;
  const isApproved = status === "approved";
  const isPending = !isApproved && !isRejected && !isClarification;

  const clarificationMessage =
    profile?.clarificationMessage ||
    profile?.clarificationReason ||
    profile?.adminClarificationMessage ||
    profile?.clarificationNote ||
    profile?.clarificationText ||
    null;

  const rejectionReason = profile?.rejectionReason || null;
  const role = String(user?.role || profile?.role || "").trim().toLowerCase();
  const notifyEmail =
    role === "brand"
      ? profile?.companyEmail ||
        user?.email ||
        profile?.email ||
        profile?.userAccount?.email ||
        ""
      : user?.email ||
        profile?.email ||
        profile?.companyEmail ||
        profile?.userAccount?.email ||
        "";

  return {
    status,
    isPending,
    isRejected,
    isClarification,
    isApproved,
    clarificationMessage,
    rejectionReason,
    notifyEmail,
  };
}
