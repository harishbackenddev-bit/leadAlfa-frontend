// services/api/apiservices.js
import axios from "axios";
import axiosInstance from "./axiosInstance";
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

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
 * Social Login API - Send Auth0 token to backend
 * @param {Object} tokenData - { access_token, id_token, user }
 * @returns {Promise} Response with user data and backend token
 */
export const socialLogin = async (token) => {
  try {
    const response = await axiosInstance.post("/auth/social", {
      token: token,
      rememberMe: false,
    });
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
  try {
    const response = await axiosInstance.get("/users/role");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};

export const createCreatorProfile = async (creatorData) => {
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

export const createBrandProfile = async (brandData) => {
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

export const updateBrandProfile = async (formData) => {
  try {
    const response = await axiosInstance.post("/brand/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating brand profile:', error);
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

/**
 * Publish campaign with escrow
 * POST /api/campaigns/publish
 */
export const publishCampaignWithEscrow = async (campaignData) => {
  try {
    const response = await axiosInstance.post("/campaigns/publish", campaignData, {
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
 * @param {number|string} campaignId
 * @param {{ pitch: string, proposedBudget: number|string, mediaId: number }} applicationData
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
    agreedBudget: app?.proposedBudget ?? null,
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

const looksLikeJob = (record) => looksLikeCreatorJob(record);

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
 * =========================
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

const normalizeBaseUrlWithoutApi = (baseUrl = "") => {
  const trimmed = String(baseUrl).replace(/\/+$/, "");
  return trimmed.replace(/\/api$/i, "");
};

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

// ========== TRADESAFE FUNCTIONS ==========

/**
 * Get TradeSafe status for current user
 * GET /api/tradesafe/status
 */
export const getTradeSafeStatus = async () => {
  try {
    const response = await axiosInstance.get('/tradesafe/status');
    return response.data;
  } catch (error) {
    console.error('Error fetching TradeSafe status:', error);
    throw error.response?.data || { error: 'Failed to fetch TradeSafe status' };
  }
};

/**
 * Submit TradeSafe bank details for creator
 * POST /api/tradesafe/register/creator
 */
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

/**
 * Submit TradeSafe details for brand
 * POST /api/tradesafe/register/brand
 */
export const submitBrandTradeSafeDetails = async (payload) => {
  try {
    const response = await axiosInstance.post("/tradesafe/register/brand", payload);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error.response?.data || error.message;
  }
};


// ========== TRADESAFE PAYMENT APIS ==========

/**
 * Get payment-ready creators for a campaign
 * GET /api/tradesafe-payment/campaign/:campaignId/creators
 */
export const getCampaignPaymentCreators = async (campaignId) => {
  try {
    const response = await axiosInstance.get(`/tradesafe-payment/campaign/${campaignId}/creators`);
    return response.data;
  } catch (error) {
    console.error("Error fetching payment creators:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Create escrow transactions for campaign
 * POST /api/tradesafe-payment/campaign/:campaignId/create-escrow
 */
export const createEscrowTransactions = async (campaignId) => {
  try {
    const response = await axiosInstance.post(`/tradesafe-payment/campaign/${campaignId}/create-escrow`);
    return response.data;
  } catch (error) {
    console.error("Error creating escrow transactions:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Fund campaign transactions
 * POST /api/tradesafe-payment/campaign/:campaignId/fund
 */
export const fundCampaignTransactions = async (campaignId) => {
  try {
    const response = await axiosInstance.post(`/tradesafe-payment/campaign/${campaignId}/fund`);
    return response.data;
  } catch (error) {
    console.error("Error funding campaign:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Get campaign payment status
 * GET /api/tradesafe-payment/campaign/:campaignId/status
 */
export const getCampaignPaymentStatus = async (campaignId) => {
  try {
    const response = await axiosInstance.get(`/tradesafe-payment/campaign/${campaignId}/status`);
    return response.data;
  } catch (error) {
    console.error("Error fetching payment status:", error);
    throw error.response?.data || error.message;
  }
};

/**
 * Get creator payment status
 * GET /api/tradesafe-payment/creator/:creatorId/transactions
 */
export const getCreatorPaymentStatus = async (creatorId) => {
  try {
    const response = await axiosInstance.get(`/tradesafe-payment/creator/${creatorId}/transactions`);
    return response.data;
  } catch (error) {
    console.error("Error fetching creator payment status:", error);
    throw error.response?.data || error.message;
  }
};