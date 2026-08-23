import axiosInstance from "./axiosInstance";

const extractError = (error, fallback) => {
  const data = error?.response?.data;
  if (typeof data === "string" && data.length < 300) return data;
  if (data?.error) return data.error;
  if (data?.message) return data.message;
  return fallback;
};

/**
 * GET /api/campaigns/:campaignPublicId/submissions
 */
export const getCampaignSubmissions = async (
  campaignPublicId,
  { status, page = 1, limit = 50 } = {}
) => {
  if (!campaignPublicId) throw new Error("Campaign public ID is required.");
  try {
    const params = { page, limit };
    if (status) params.status = status;
    const { data } = await axiosInstance.get(
      `/campaigns/${encodeURIComponent(campaignPublicId)}/submissions`,
      { params }
    );
    return data;
  } catch (error) {
    throw new Error(
      extractError(error, "Failed to load campaign submissions.")
    );
  }
};

/**
 * GET /api/campaigns/:campaignPublicId/submissions/stats
 */
export const getCampaignSubmissionStats = async (campaignPublicId) => {
  if (!campaignPublicId) throw new Error("Campaign public ID is required.");
  try {
    const { data } = await axiosInstance.get(
      `/campaigns/${encodeURIComponent(campaignPublicId)}/submissions/stats`
    );
    return data;
  } catch (error) {
    throw new Error(
      extractError(error, "Failed to load submission stats.")
    );
  }
};

/**
 * GET /api/campaigns/:campaignPublicId/submissions/assets
 */
export const getCampaignApprovedAssets = async (
  campaignPublicId,
  { page = 1, limit = 10, usageType, sort = "uploadedAt", search } = {}
) => {
  if (!campaignPublicId) throw new Error("Campaign public ID is required.");
  try {
    const params = { page, limit, sort };
    if (usageType) params.usageType = usageType;
    if (search) params.search = search;
    const { data } = await axiosInstance.get(
      `/campaigns/${encodeURIComponent(campaignPublicId)}/submissions/assets`,
      { params }
    );
    return data;
  } catch (error) {
    throw new Error(
      extractError(error, "Failed to load approved assets.")
    );
  }
};

/**
 * GET /api/submissions/:submissionPublicId
 */
export const getSubmissionDetail = async (submissionPublicId) => {
  if (!submissionPublicId) throw new Error("Submission public ID is required.");
  try {
    const { data } = await axiosInstance.get(
      `/submissions/${encodeURIComponent(submissionPublicId)}`
    );
    return data;
  } catch (error) {
    throw new Error(
      extractError(error, "Failed to load submission detail.")
    );
  }
};

/**
 * PATCH /api/submissions/:submissionPublicId/approve
 */
export const approveSubmission = async (submissionPublicId) => {
  if (!submissionPublicId) throw new Error("Submission public ID is required.");
  try {
    const { data } = await axiosInstance.patch(
      `/submissions/${encodeURIComponent(submissionPublicId)}/approve`
    );
    return data;
  } catch (error) {
    const err = new Error(
      extractError(error, "Failed to approve submission.")
    );
    err.status = error?.response?.status;
    throw err;
  }
};

/**
 * PATCH /api/submissions/:submissionPublicId/request-revision
 */
export const requestSubmissionRevision = async (submissionPublicId, payload) => {
  if (!submissionPublicId) throw new Error("Submission public ID is required.");
  try {
    const { data } = await axiosInstance.patch(
      `/submissions/${encodeURIComponent(submissionPublicId)}/request-revision`,
      payload
    );
    return data;
  } catch (error) {
    const err = new Error(
      extractError(error, "Failed to request revision.")
    );
    err.status = error?.response?.status;
    throw err;
  }
};

/**
 * PATCH /api/submissions/:submissionPublicId/reject
 */
export const rejectSubmission = async (submissionPublicId, payload) => {
  if (!submissionPublicId) throw new Error("Submission public ID is required.");
  try {
    const { data } = await axiosInstance.patch(
      `/submissions/${encodeURIComponent(submissionPublicId)}/reject`,
      payload
    );
    return data;
  } catch (error) {
    const err = new Error(
      extractError(error, "Failed to reject submission.")
    );
    err.status = error?.response?.status;
    throw err;
  }
};
