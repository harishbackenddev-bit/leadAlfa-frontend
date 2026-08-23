import axiosInstance from "./axiosInstance";

const extractError = (error, fallback) => {
  const data = error?.response?.data;
  if (typeof data === "string" && data.length < 300) return data;
  if (data?.error) return data.error;
  if (data?.message) return data.message;
  return fallback;
};

/**
 * GET /api/campaigns/:campaignPublicId/activity
 * Paginated campaign activity feed (entries expire after 30 days).
 */
export const getCampaignActivity = async (
  campaignPublicId,
  { page = 1, limit = 20, eventType } = {}
) => {
  if (!campaignPublicId) throw new Error("Campaign public ID is required.");
  try {
    const params = { page, limit };
    if (eventType) params.eventType = eventType;
    const { data } = await axiosInstance.get(
      `/campaigns/${encodeURIComponent(campaignPublicId)}/activity`,
      { params }
    );
    return data;
  } catch (error) {
    throw new Error(extractError(error, "Failed to load campaign activity."));
  }
};
