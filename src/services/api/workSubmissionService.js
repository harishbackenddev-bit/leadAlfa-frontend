import axiosInstance from "./axiosInstance";

const extractError = (error, fallback) => {
  const data = error?.response?.data;
  if (typeof data === "string" && data.length < 300) return data;
  if (data?.error) return data.error;
  if (data?.message) return data.message;
  return fallback;
};

/**
 * Normalize GET submission payloads to always return `{ submission }`.
 */
const normalizeSubmissionPayload = (data) => {
  if (!data) return { submission: null };
  if (data.submission !== undefined) {
    return {
      submission: data.submission || null,
      message: data.message,
    };
  }
  if (
    Array.isArray(data.revisions) ||
    String(data.publicId || "").startsWith("SUB-")
  ) {
    return { submission: data };
  }
  return { submission: null, message: data.message };
};

/**
 * GET /api/creator/jobs/:jobPublicId/submission
 */
export const getWorkSubmission = async (jobPublicId) => {
  if (!jobPublicId) throw new Error("Job public ID is required.");
  try {
    const { data } = await axiosInstance.get(
      `/creator/jobs/${encodeURIComponent(jobPublicId)}/submission`
    );
    return normalizeSubmissionPayload(data);
  } catch (error) {
    if (error?.response?.status === 404) {
      return {
        message: "No submission found for this job yet.",
        submission: null,
      };
    }
    throw new Error(
      extractError(error, "Failed to load work submission.")
    );
  }
};

/**
 * POST /api/creator/jobs/:jobPublicId/submission
 * @param {{ notes?: string, captionOrHook?: string, assets?: Array<{ mediaId: number, usageType: string }> }} payload
 */
export const submitWork = async (jobPublicId, payload) => {
  if (!jobPublicId) throw new Error("Job public ID is required.");
  try {
    const { data } = await axiosInstance.post(
      `/creator/jobs/${encodeURIComponent(jobPublicId)}/submission`,
      payload
    );
    return data;
  } catch (error) {
    const err = new Error(
      extractError(error, "Failed to submit work.")
    );
    err.status = error?.response?.status;
    throw err;
  }
};

/**
 * POST /api/creator/jobs/:jobPublicId/submission/resubmit
 */
export const resubmitWork = async (jobPublicId, payload) => {
  if (!jobPublicId) throw new Error("Job public ID is required.");
  try {
    const { data } = await axiosInstance.post(
      `/creator/jobs/${encodeURIComponent(jobPublicId)}/submission/resubmit`,
      payload
    );
    return data;
  } catch (error) {
    const err = new Error(
      extractError(error, "Failed to resubmit work.")
    );
    err.status = error?.response?.status;
    throw err;
  }
};

/**
 * POST /api/creator/jobs/:jobPublicId/submission/remind
 * One reminder every 24 hours while submission is pending_review.
 * Success includes `nextReminderAvailableAt`.
 */
export const remindBrand = async (jobPublicId, message) => {
  if (!jobPublicId) throw new Error("Job public ID is required.");
  try {
    const { data } = await axiosInstance.post(
      `/creator/jobs/${encodeURIComponent(jobPublicId)}/submission/remind`,
      message ? { message } : {}
    );
    return data;
  } catch (error) {
    const data = error?.response?.data;
    const err = new Error(
      extractError(error, "Failed to send reminder.")
    );
    err.status = error?.response?.status;
    err.nextReminderAvailableAt =
      data?.nextReminderAvailableAt || data?.nextAvailableAt || null;
    throw err;
  }
};
