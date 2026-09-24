import axios from "axios";
import axiosInstance from "./axiosInstance";
import { API_BASE_URL as RESOLVED_API_BASE_URL } from "./apiBaseUrl";
export const API_BASE_URL = RESOLVED_API_BASE_URL;
export const normalizeBaseUrlWithoutApi = (baseUrl = "") => {
  const trimmed = String(baseUrl).replace(/\/+$/, "");
  return trimmed.replace(/\/api$/i, "");
};

/**
 * Public Homepage Creator Video Carousel API
 * @param {string} [category] - Optional category slug, name, or numeric ID
 * @returns {Promise<{success: boolean, data: Array}>}
 */
export const getHomepageCreatorVideos = async (category = "") => {
  try {
    const params = {};
    if (category) {
      params.category = category;
    }
    const endpoint = `${normalizeBaseUrlWithoutApi(API_BASE_URL)}/api/home/creator-videos`;
    const response = await axios.get(endpoint, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching homepage creator videos:", error);
    return {
      success: false,
      data: [],
      error: error.response?.data?.error || error.message,
    };
  }
};

/**
 * User Login API
 * @param {Object} credentials - { email, password }
 * @returns {Promise} Response with user data and token
 */
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * User Signup API
 * @param {Object} userData - { email, password, firstName, lastName, phoneNumber, etc. }
 * @returns {Promise} Response with user data
 */
export const signupUser = async (userData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/register`,
      userData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Set User Role API
 * @param {Object} roleData - { role } - Role can be 'brand' or 'creator'
 * @returns {Promise} Response with updated user data
 */
export const setUserRole = async (roleData) => {
  try {
    const response = await axiosInstance.post("/users/set-role", roleData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Social Login API — POST /auth/social
 * Body must match: { "token": "<Auth0 JWT>", "rememberMe": false }
 */
export const socialLogin = async (payload) => {
  const token =
    typeof payload === "string"
      ? payload
      : payload?.token ||
        payload?.accessToken ||
        payload?.access_token ||
        payload?.idToken ||
        payload?.id_token;

  if (!token || typeof token !== "string") {
    throw new Error("Social login requires an Auth0 token string");
  }

  const rememberMe =
    typeof payload === "object" && payload != null
      ? Boolean(payload.rememberMe)
      : false;

  try {
    const response = await axios.post(
      `${API_BASE_URL}/auth/social`,
      { token, rememberMe },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Verify Email API
 * @param {Object} verificationData - { email, code }
 * @returns {Promise} Response with verification status
 */
export const verifyEmail = async (verificationData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/verify-email`,
      verificationData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Resend Verification Code API
 * @param {Object} emailData - { email }
 * @returns {Promise} Response with resend status
 */
export const resendVerificationCode = async (emailData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/resend-code`,
      emailData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * Request a password reset link (public — no auth header).
 * @param {{ email: string }} emailData
 */
export const forgotPassword = async (emailData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/forgot-password`,
      emailData
    );
    return response.data;
  } catch (error) {
    const payload = error.response?.data || { error: error.message };
    throw { ...payload, status: error.response?.status };
  }
};

/**
 * Reset password with token from email link (public — no auth header).
 * @param {{ token: string, newPassword: string }} resetData
 */
export const resetPassword = async (resetData) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/users/reset-password`,
      resetData
    );
    return response.data;
  } catch (error) {
    const payload = error.response?.data || { error: error.message };
    throw { ...payload, status: error.response?.status };
  }
};

export const getRole = async () => {
  //multipart form data
  try {
    const response = await axiosInstance.get("/users/role");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const checkPublicNameAvailability = async (name) => {
  try {
    const response = await axiosInstance.get(
      "/creator/profile/public-name/availability",
      {
        params: { name },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || error;
  }
};

export const createCreatorProfile = async (creatorData) => {
  //multipart form data
  try {
    const response = await axiosInstance.post("/creator/profile", creatorData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const getCreatorProfile = async () => {
  try {
    const response = await axiosInstance.get("/creator/profile");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const updateCreatorProfile = async (creatorData) => {
  try {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    const response = await axiosInstance.post("/creator/profile", creatorData, config);
    return response.data;
  } catch (error) {
    try {
      const fallbackResponse = await axiosInstance.patch(
        "/creator/profile",
        creatorData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return fallbackResponse.data;
    } catch (fallbackError) {
      console.log(fallbackError);
      throw fallbackError.response?.data || fallbackError.message;
    }
  }
};

export const reuploadCreatorDocuments = async (formData) => {
  try {
    const response = await axiosInstance.post(
      "/creator/profile/reupload-documents",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const getPortfolioVideos = async () => {
  try {
    const response = await axiosInstance.get("/creator/profile/portfolio-videos");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const addPortfolioVideo = async (mediaId) => {
  try {
    const response = await axiosInstance.post("/creator/profile/portfolio-videos", {
      mediaId: Number(mediaId),
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const deletePortfolioVideo = async (mediaId) => {
  try {
    const response = await axiosInstance.delete(
      `/creator/profile/portfolio-videos/${mediaId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const createBrandProfile = async (brandData) => {
  //multipart form data
  try {
    const response = await axiosInstance.post("/brand/profile", brandData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const getBrandProfile = async () => {
  try {
    const response = await axiosInstance.get("/brand/profile");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const createCampaign = async (campaignData) => {
  try {
    const response = await axiosInstance.post("/campaigns", campaignData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

// Fetch all campaigns (for brand dashboard)
export const getCampaigns = async ({ status, page, limit } = {}) => {
  try {
    const params = {};
    if (status) params.status = status;
    if (page) params.page = page;
    if (limit) params.limit = limit;

    const response = await axiosInstance.get("/campaigns", { params });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const getCampaignById = async (campaignId) => {
  try {
    const response = await axiosInstance.get(`/campaigns/${campaignId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const deleteCampaignByPublicId = async (publicId) => {
  try {
    const response = await axiosInstance.delete(`/campaigns/${publicId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const updateCampaignByPublicId = async (publicId, campaignData) => {
  try {
    const response = await axiosInstance.patch(`/campaigns/${publicId}`, campaignData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const getCampaignInvoice = async (publicId) => {
  try {
    const response = await axiosInstance.get(`/campaigns/${publicId}/invoice`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const publishCampaign = async (publicId) => {
  try {
    const response = await axiosInstance.post(`/campaigns/${publicId}/publish`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const getActiveCreatorsList = async ({ page = 1, limit = 10 } = {}) => {
  try {
    const response = await axiosInstance.get("/creator/list", {
      params: { page, limit },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/**
 * Refresh Access Token
 * Calls the backend refresh endpoint which should return a new access token
 * @returns {Promise<{access_token: string}>}
 */
export const refreshToken = async () => {
  try {
    const response = await axiosInstance.post("/users/refresh-token", {});
    return response.data;
  } catch (error) {
    console.log("refreshToken error", error);
    throw error.response?.data || error.message;
  }
};

export const getActiveCampaigns = async () => {
  try {
    const response = await axiosInstance.get("/campaigns/active");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/**
 * Submit a campaign application.
 *
 * NOTE: As of the direct-to-Cloudinary upload migration this endpoint accepts
 * a small JSON payload — the pitch video bytes are NOT routed through the
 * backend anymore. Instead the browser uploads the file directly to
 * Cloudinary (see `mediaUploadService.uploadMediaWithProgress`) and forwards
 * the resulting `mediaId` here.
 *
 * @param {number|string} campaignId
 * @param {{ pitch: string, mediaId: number }} applicationData
 */
export const creatorApplyToCampaign = async (campaignId, applicationData) => {
  try {
    const response = await axiosInstance.post(
      `campaign-applications/apply/${campaignId}`,
      applicationData
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};


export const getCreatorApplications = async (campaignId) => {
  try {
    const response = await axiosInstance.get(`/campaign-applications/${campaignId}/applicants`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const changeCreatorApplicationStatus = async (applicationId, newStatus) => {
  try {
    const response = await axiosInstance.put(
      `/campaign-applications/update-status/${applicationId}`,
      { newStatus }
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};


export const myCampaignsApplications = async () => {
  try {
    const response = await axiosInstance.get(`/campaign-applications/my-applications`);   
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/** Detect whether a record already matches the creator job shape (vs application). */
const looksLikeCreatorJob = (record) =>
  record &&
  !record.applicationStatus &&
  (String(record.publicId || "").startsWith("JOB-") ||
    record.hiringSource != null ||
    (record.jobId != null && record.deadlineAt != null));

/**
 * Convert a `/campaign-applications/my-applications` "application" record
 * into the unified "job" shape consumed by the Creator UI (MY-JOBS.md).
 */
const applicationToJob = (app = {}) => {
  const campaign = app?.campaign || {};
  const brand = campaign?.brand || {};
  const jobPublicId =
    [app?.jobPublicId, app?.job?.publicId, app?.creatorJob?.publicId].find(
      (v) => String(v || "").startsWith("JOB-")
    ) || null;

  return {
    jobId: app?.jobId ?? app?.creatorJobId ?? app?.creatorJob?.id ?? app?.id ?? null,
    publicId: jobPublicId,
    jobPublicId,
    status: app?.applicationStatus || app?.status || null,
    applicationStatus: app?.applicationStatus || app?.status || null,
    workStatus: app?.workStatus ?? app?.creatorJob?.workStatus ?? null,
    hiringSource: "campaign_application",
    agreedBudget:
      campaign?.creatorVisibleBudget ??
      campaign?.invoice?.creatorVisibleBudget ??
      campaign?.invoice?.cartSubtotal ??
      null,
    deadlineAt:
      campaign?.applicationDeadline ||
      campaign?.endDate ||
      campaign?.campaignEnds ||
      null,
    createdAt: app?.createdAt ?? null,
    pitch: app?.pitch ?? null,
    applicationMedia: app?.applicationMedia || [],
    campaign: {
      id: campaign?.id ?? null,
      publicId: campaign?.publicId ?? null,
      title: campaign?.campaignTitle || campaign?.title || null,
      status: campaign?.status ?? null,
      compensationType: campaign?.compensationType ?? null,
      thumbnail:
        campaign?.media?.coverImage ||
        campaign?.media?.moodboards ||
        campaign?.media?.productImages?.[0] ||
        null,
      ...campaign,
    },
    brand: {
      id: brand?.id ?? null,
      name: brand?.companyName || brand?.name || null,
      logo: brand?.logo || null,
    },
  };
};

/**
 * Locate the jobs/applications array no matter how the backend wraps it.
 * Handles top-level keys, `data.*` envelopes, and a few fallback names.
 */
const extractJobsArray = (payload) => {
  if (!payload) return [];
  if (Array.isArray(payload)) return payload;

  const candidates = [
    payload.jobs,
    payload.applications,
    payload.applicants,
    payload.items,
    payload.results,
    payload.data?.jobs,
    payload.data?.applications,
    payload.data?.applicants,
    payload.data?.items,
    payload.data?.results,
  ];

  for (const value of candidates) {
    if (Array.isArray(value)) return value;
  }
  return [];
};

/** Detect whether a record already matches the job shape (vs application). */
const looksLikeJob = (record) => looksLikeCreatorJob(record);

/** Pick CreatorJob.publicId (JOB-…) from a record if present. */
const pickCreatorJobPublicId = (record) => {
  const candidates = [
    record?.jobPublicId,
    record?.publicId,
    record?.job?.publicId,
    record?.creatorJob?.publicId,
  ];
  return (
    candidates.find((v) => String(v || "").trim().startsWith("JOB-")) || null
  );
};

/** Attach creator-job fields (JOB-… id, status, budget) from GET /creator/jobs. */
const mergeCreatorJobsIntoApplications = (jobs = [], creatorJobs = []) => {
  if (!creatorJobs.length) return jobs;

  const creatorByCampaignId = new Map();
  const creatorByCampaignPublicId = new Map();

  creatorJobs.forEach((record) => {
    const job = looksLikeCreatorJob(record) ? record : applicationToJob(record);
    const campaign = job?.campaign || {};
    if (campaign.id != null) creatorByCampaignId.set(String(campaign.id), job);
    if (campaign.publicId) {
      creatorByCampaignPublicId.set(String(campaign.publicId), job);
    }
  });

  const merged = jobs.map((job) => {
    const applicationStatus = String(job?.status || "").toLowerCase();
    if (["rejected", "declined"].includes(applicationStatus)) {
      return job;
    }

    const campaign = job?.campaign || {};
    const creatorJob =
      (campaign.publicId &&
        creatorByCampaignPublicId.get(String(campaign.publicId))) ||
      (campaign.id != null && creatorByCampaignId.get(String(campaign.id))) ||
      null;

    const jobPublicId =
      pickCreatorJobPublicId(creatorJob) || pickCreatorJobPublicId(job);

    if (!creatorJob && !jobPublicId) return job;

    return {
      ...job,
      ...(creatorJob || {}),
      campaign: { ...job.campaign, ...(creatorJob?.campaign || {}) },
      brand: creatorJob?.brand || job.brand,
      publicId: jobPublicId || job.publicId,
      jobPublicId,
      status: creatorJob?.status || job.status,
      workStatus: creatorJob?.workStatus ?? job.workStatus ?? null,
      agreedBudget: creatorJob?.agreedBudget ?? job.agreedBudget,
      deadlineAt: creatorJob?.deadlineAt ?? job.deadlineAt,
      hiringSource: creatorJob?.hiringSource || job.hiringSource,
    };
  });

  const seenCampaignKeys = new Set(
    merged.map((job) => {
      const c = job?.campaign || {};
      return `${c.id ?? ""}:${c.publicId ?? ""}`;
    })
  );

  creatorJobs.forEach((record) => {
    const job = looksLikeCreatorJob(record) ? record : applicationToJob(record);
    const c = job?.campaign || {};
    const key = `${c.id ?? ""}:${c.publicId ?? ""}`;
    if (seenCampaignKeys.has(key)) return;
    seenCampaignKeys.add(key);
    merged.push(job);
  });

  return merged;
};

/**
 * Fetch creator jobs (CreatorJob records with JOB-… publicId).
 * Endpoint: GET /creator/jobs — see docs/MY-JOBS.md
 */
export const getCreatorJobs = async ({ page = 1, limit = 100, status } = {}) => {
  try {
    const params = { page, limit };
    if (status) params.status = status;
    const response = await axiosInstance.get("/creator/jobs", { params });
    const payload = response.data || {};
    const rawList = extractJobsArray(payload);
    return {
      jobs: rawList.map((record) => {
        const job = looksLikeJob(record) ? record : applicationToJob(record);
        const jobPublicId = pickCreatorJobPublicId(job);
        return jobPublicId
          ? { ...job, publicId: jobPublicId, jobPublicId }
          : job;
      }),
      pagination:
        payload.pagination ||
        payload.data?.pagination || {
          totalItems: rawList.length,
          totalPages: 1,
          currentPage: page,
        },
    };
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/**
 * Fetch current creator's jobs.
 * Merges GET /campaign-applications/my-applications with GET /creator/jobs so
 * each accepted application gets its CreatorJob.publicId (JOB-…) for submission APIs.
 * Downstream consumers always receive `{ jobs, pagination }`.
 */
export const getMyJobs = async ({ page = 1, limit = 8, status } = {}) => {
  try {
    const params = { page, limit };
    if (status) params.status = status;

    const [applicationsResult, creatorJobsResult] = await Promise.allSettled([
      axiosInstance.get("/campaign-applications/my-applications", { params }),
      axiosInstance.get("/creator/jobs", { params: { page: 1, limit: 100 } }),
    ]);

    if (applicationsResult.status === "rejected") {
      throw applicationsResult.reason;
    }

    const response = applicationsResult.value;
    const payload = response.data || {};
    const rawList = extractJobsArray(payload);
    let jobs = rawList.map((record) =>
      looksLikeJob(record) ? record : applicationToJob(record)
    );

    if (creatorJobsResult.status === "fulfilled") {
      const creatorPayload = creatorJobsResult.value.data || {};
      const creatorRaw = extractJobsArray(creatorPayload);
      const creatorJobs = creatorRaw.map((record) =>
        looksLikeJob(record) ? record : applicationToJob(record)
      );
      jobs = mergeCreatorJobsIntoApplications(jobs, creatorJobs);
    }

    if (import.meta.env.DEV) {
      console.debug("[getMyJobs] params", params, "jobs:", jobs.length, payload);
    }

    return {
      jobs,
      pagination:
        payload.pagination ||
        payload.data?.pagination || {
          totalItems: jobs.length,
          totalPages: 1,
          currentPage: 1,
        },
    };
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/**
 * =========================
 * Campaign Invitations
 * Contract: docs/CAMPAGAIN_INVITATION_BRAND.MD
 * =========================
 */

/**
 * Brand: Send (single or bulk) invitations for a campaign.
 * @param {number|string} campaignId - Numeric campaign id (per spec).
 * @param {{ creatorIds: Array<number>, customMessage?: string }} payload
 */
export const sendCampaignInvitations = async (campaignId, payload = {}) => {
  try {
    const body = {
      creatorIds: Array.isArray(payload.creatorIds)
        ? payload.creatorIds.map((id) => Number(id)).filter(Boolean)
        : [],
    };
    if (payload.customMessage && payload.customMessage.trim()) {
      body.customMessage = payload.customMessage.trim();
    }
    const response = await axiosInstance.post(
      `/campaigns/${campaignId}/invitations`,
      body
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/** Brand: List sent invitations (paginated, optionally filtered). */
export const getBrandInvitations = async ({
  campaignId,
  status,
  page = 1,
  limit = 10,
} = {}) => {
  try {
    const params = { page, limit };
    if (campaignId) params.campaignId = campaignId;
    if (status) params.status = status;
    const response = await axiosInstance.get("/brand/invitations", { params });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/** Brand: Withdraw a pending invitation by its public id (INV-XXXXXX). */
export const withdrawBrandInvitation = async (publicId) => {
  try {
    const response = await axiosInstance.delete(
      `/brand/invitations/${publicId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/** Creator: List received invitations (paginated, optionally filtered). */
export const getCreatorInvitations = async ({
  status,
  page = 1,
  limit = 10,
} = {}) => {
  try {
    const params = { page, limit };
    if (status) params.status = status;
    const response = await axiosInstance.get("/creator/invitations", {
      params,
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/** Creator: Get a single invitation's full details. */
export const getCreatorInvitationDetail = async (publicId) => {
  try {
    const response = await axiosInstance.get(
      `/creator/invitations/${publicId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/** Creator: Accept an invitation. Returns `{ invitation: { campaignPublicId } }`. */
export const acceptCreatorInvitation = async (publicId) => {
  try {
    const response = await axiosInstance.put(
      `/creator/invitations/${publicId}/accept`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/** Creator: Decline an invitation. */
export const declineCreatorInvitation = async (publicId) => {
  try {
    const response = await axiosInstance.put(
      `/creator/invitations/${publicId}/decline`
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/**
 * =========================
 * Admin: Creator Requests
 * =========================
 */

const CREATOR_PROFILES_BASE_URL = normalizeBaseUrlWithoutApi(API_BASE_URL);

const creatorProfilesEndpoint = (path = "") =>
  `${CREATOR_PROFILES_BASE_URL}/api/admin/creator-profiles${path}`;

export const getCreatorProfileRequests = async (params = {}) => {
  try {
    const query = new URLSearchParams();

    if (params.status) query.append("status", params.status);
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));

    const queryString = query.toString();
    const endpoint = creatorProfilesEndpoint(queryString ? `?${queryString}` : "");

    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const getCreatorProfileRequestById = async (id) => {
  try {
    const response = await axiosInstance.get(creatorProfilesEndpoint(`/${id}`));
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const approveCreatorProfileRequest = async (id) => {
  try {
    const response = await axiosInstance.put(creatorProfilesEndpoint(`/${id}/approve`));
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const rejectCreatorProfileRequest = async (id, reason) => {
  try {
    const payload = reason ? { reason } : {};
    const response = await axiosInstance.put(creatorProfilesEndpoint(`/${id}/reject`), payload);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const clarifyCreatorProfileRequest = async (id, message) => {
  try {
    const response = await axiosInstance.put(creatorProfilesEndpoint(`/${id}/clarify`), { message });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const deleteCreatorProfileRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(creatorProfilesEndpoint(`/${id}`));
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/**
 * =========================
 * Admin: Brand Profile Requests
 * =========================
 */

const brandProfilesEndpoint = (path = "") =>
  `${CREATOR_PROFILES_BASE_URL}/api/admin/brand-profiles${path}`;

export const getBrandProfileRequests = async (params = {}) => {
  try {
    const query = new URLSearchParams();

    if (params.status) query.append("status", params.status);
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));

    const queryString = query.toString();
    const endpoint = brandProfilesEndpoint(queryString ? `?${queryString}` : "");

    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const getBrandProfileRequestById = async (id) => {
  try {
    const response = await axiosInstance.get(brandProfilesEndpoint(`/${id}`));
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const approveBrandProfileRequest = async (id) => {
  try {
    const response = await axiosInstance.put(brandProfilesEndpoint(`/${id}/approve`), {});
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const rejectBrandProfileRequest = async (id, reason) => {
  try {
    const payload = reason ? { reason } : {};
    const response = await axiosInstance.put(brandProfilesEndpoint(`/${id}/reject`), payload);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const clarifyBrandProfileRequest = async (id, message) => {
  try {
    const response = await axiosInstance.put(brandProfilesEndpoint(`/${id}/clarify`), { message });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const deleteBrandProfileRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(brandProfilesEndpoint(`/${id}`));
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/**
 * =========================
 * Contact Requests (Public + Admin)
 * =========================
 */

const contactRequestsBaseUrl = () => normalizeBaseUrlWithoutApi(API_BASE_URL);

const publicContactEndpoint = (path = "") =>
  `${contactRequestsBaseUrl()}/api/contact-requests${path}`;

const adminContactEndpoint = (path = "") =>
  `${contactRequestsBaseUrl()}/api/admin/contact-requests${path}`;

const buildOptionalAuthHeaders = () => {
  const headers = { "Content-Type": "application/json" };
  const token = localStorage.getItem("access_token");
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
};

const throwContactRequestError = (error) => {
  const payload = error.response?.data || { error: error.message };
  throw { ...payload, status: error.response?.status };
};

/** Public: submit a contact request (optional Bearer token if logged in). */
export const submitContactRequest = async (payload) => {
  try {
    const response = await axios.post(publicContactEndpoint(""), payload, {
      headers: buildOptionalAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

/** Admin: list contact requests with pagination and filters. */
export const getContactRequests = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));
    if (params.status) query.append("status", params.status);
    if (params.inquiryType) query.append("inquiryType", params.inquiryType);
    if (params.search) query.append("search", params.search);

    const queryString = query.toString();
    const endpoint = adminContactEndpoint(queryString ? `?${queryString}` : "");
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/** Admin: get a single contact request by publicId. */
export const getContactRequestByPublicId = async (publicId) => {
  try {
    const response = await axiosInstance.get(adminContactEndpoint(`/${publicId}`));
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/** Admin: update contact request status and/or admin notes. */
export const updateContactRequest = async (publicId, payload) => {
  try {
    const response = await axiosInstance.patch(
      adminContactEndpoint(`/${publicId}`),
      payload
    );
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

/**
 * =========================
 * Book a Call Requests (Public)
 * =========================
 */

const publicBookCallEndpoint = (path = "") =>
  `${contactRequestsBaseUrl()}/api/book-call-requests${path}`;

const adminBookCallEndpoint = (path = "") =>
  `${contactRequestsBaseUrl()}/api/admin/book-call-requests${path}`;

/** Public: submit a book-a-call request (optional Bearer token if logged in). */
export const submitBookCallRequest = async (payload) => {
  try {
    const response = await axios.post(publicBookCallEndpoint(""), payload, {
      headers: buildOptionalAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

/** Admin: list book-a-call requests with pagination and filters. */
export const getBookCallRequests = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));
    if (params.status) query.append("status", params.status);
    if (params.search) query.append("search", params.search);

    const queryString = query.toString();
    const endpoint = adminBookCallEndpoint(queryString ? `?${queryString}` : "");
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

/** Admin: get a single book-a-call request by publicId. */
export const getBookCallRequestByPublicId = async (publicId) => {
  try {
    const response = await axiosInstance.get(adminBookCallEndpoint(`/${publicId}`));
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

/** Admin: update book-a-call request status and/or admin notes. */
export const updateBookCallRequest = async (publicId, payload) => {
  try {
    const response = await axiosInstance.patch(
      adminBookCallEndpoint(`/${publicId}`),
      payload
    );
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

/**
 * =========================
 * User Feedback & Bug Reports (User + Admin)
 * =========================
 */

const userFeedbackBaseUrl = () => normalizeBaseUrlWithoutApi(API_BASE_URL);

const publicUserFeedbackEndpoint = (path = "") =>
  `${userFeedbackBaseUrl()}/api/user-feedback${path}`;

const adminUserFeedbackEndpoint = (path = "") =>
  `${userFeedbackBaseUrl()}/api/admin/user-feedback${path}`;

/** Authenticated User: Submit feedback or bug report */
export const submitUserFeedback = async (payload) => {
  try {
    const response = await axiosInstance.post(publicUserFeedbackEndpoint(""), payload);
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

/** Admin: list user feedback & bug reports with pagination and filters */
export const getUserFeedbackList = async (params = {}) => {
  try {
    const query = new URLSearchParams();
    if (params.page) query.append("page", String(params.page));
    if (params.limit) query.append("limit", String(params.limit));
    if (params.status) query.append("status", params.status);
    if (params.type) query.append("type", params.type);
    if (params.search) query.append("search", params.search);

    const queryString = query.toString();
    const endpoint = adminUserFeedbackEndpoint(queryString ? `?${queryString}` : "");
    const response = await axiosInstance.get(endpoint);
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

/** Admin: get a single user feedback report by publicId */
export const getUserFeedbackByPublicId = async (publicId) => {
  try {
    const response = await axiosInstance.get(adminUserFeedbackEndpoint(`/${publicId}`));
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

/** Admin: update user feedback status and/or admin notes */
export const updateUserFeedback = async (publicId, payload) => {
  try {
    const response = await axiosInstance.patch(
      adminUserFeedbackEndpoint(`/${publicId}`),
      payload
    );
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};


// ============================================================
// TradeSafe Campaign Funding APIs
// ============================================================
export const getEstimatedFee = async (campaignId) => {
  try {
    const response = await axiosInstance.get(
      `/tradesafe-payment/campaign/${campaignId}/estimated-fee`
    );
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

// ============================================================
// ✅ Fund Campaign (with paymentMethod)
// ============================================================
export const fundCampaign = async (campaignId, payload = {}) => {
  try {
    const response = await axiosInstance.post(
      `/tradesafe-payment/campaign/${campaignId}/fund`,
      payload
    );
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};


export const simulateFunded = async (campaignId) => {
  try {
    const response = await axiosInstance.post(
      `/tradesafe-payment/campaign/${campaignId}/simulate-funded`
    );
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

export const selectCreator = async (campaignId, payload) => {
  try {
    const response = await axiosInstance.post(
      `/tradesafe-payment/campaign/${campaignId}/select-creator`,
      payload
    );
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

export const fundCreator = async (transactionId) => {
  try {
    const response = await axiosInstance.post(
      `/tradesafe-payment/transaction/${transactionId}/fund-creator`
    );
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

export const refundUnused = async (campaignId) => {
  try {
    const response = await axiosInstance.post(
      `/tradesafe-payment/campaign/${campaignId}/refund-unused`
    );
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

export const getCampaignPaymentStatus = async (campaignId) => {
  try {
    const response = await axiosInstance.get(
      `/tradesafe-payment/campaign/${campaignId}/status`
    );
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

export const releaseFundsToCreator = async (campaignId, creatorId) => {
  const response = await axiosInstance.post(
    `/tradesafe-payment/campaign/${campaignId}/release`,
    { creatorId }
  );
  return response.data;
};

export const getTradeSafeStatus = async () => {
  try {
    const response = await axiosInstance.get('/tradesafe/status');
    return response.data;
  } catch (error) {
    console.error('Error fetching TradeSafe status:', error);
    throw error.response?.data || { error: 'Failed to fetch TradeSafe status' };
  }
};

export const submitTradeSafeDetails = async (payload) => {
  try {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const endpoint = user?.role === 'brand' 
      ? '/tradesafe/register/brand' 
      : '/tradesafe/register/creator';
    
    const response = await axiosInstance.post(endpoint, payload);
    return response.data;
  } catch (error) {
    console.error('Error submitting TradeSafe details:', error);
    throw error.response?.data || { error: 'Failed to submit TradeSafe details' };
  }
};

export const getCreatorBalance = async () => {
  try {
    const response = await axiosInstance.get(
      `/tradesafe-payment/creator/balance`
    );
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

export const requestCreatorWithdrawal = async (amount) => {
  try {
    const response = await axiosInstance.post(
      `/tradesafe-payment/creator/withdraw`,
      { amount }
    );
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

export const getCreatorTransactions = async (params = {}) => {
  try {
    const response = await axiosInstance.get(
      `/tradesafe-payment/creator/transactions`,
      { params }
    );
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

// ✅ Cancel creator escrow
export const cancelCreatorEscrow = async (campaignId, payload) => {
  try {
    const response = await axiosInstance.post(
      `/tradesafe-payment/campaign/${campaignId}/cancel-creator`,
      payload
    );
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};


// ============================================================
// ✅ Payment Methods (fetch available for campaign)
// ============================================================
export const getPaymentMethods = async (campaignId) => {
  try {
    const response = await axiosInstance.get(
      `/tradesafe-payment/campaign/${campaignId}/payment-methods`
    );
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

// ============================================================
// ✅ Generate Funding Quote (method-specific)
// ============================================================
export const generateFundingQuote = async (campaignId, paymentMethod) => {
  try {
    const response = await axiosInstance.post(
      `/tradesafe-payment/campaign/${campaignId}/funding-quote`,
      { paymentMethod }
    );
    return response.data;
  } catch (error) {
    throwContactRequestError(error);
  }
};

