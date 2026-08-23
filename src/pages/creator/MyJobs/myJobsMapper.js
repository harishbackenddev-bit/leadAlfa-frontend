import campaignImage from "../../../assets/images/creator/explorcampagainImag.png";
import { selectOptions } from "../../brand/Campaigns/campaignFormOptions";
import {
  isCampaignPublicId,
  isCreatorJobPublicId,
  pickCreatorJobPublicId,
} from "./workSubmissionMapper";

function getDeliverableLabel(value) {
  if (!value) return "Mixed Media";
  const match = selectOptions.deliverables.find(
    (opt) =>
      String(opt.value).toLowerCase() === String(value).toLowerCase() ||
      String(opt.label).toLowerCase() === String(value).toLowerCase()
  );
  if (match) return match.label;
  const v = String(value).toLowerCase();
  if (v.includes("photo")) return "Photos";
  if (v.includes("video")) return "Video";
  return String(value).replace(/_/g, " ");
}

function formatJobDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatCurrency(value) {
  if (value == null) return null;
  const num = Number(String(value).replace(/,/g, ""));
  if (Number.isNaN(num)) return null;
  const [intPart, dec = "00"] = num.toFixed(2).split(".");
  return `R ${intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ")}.${dec}`;
}

function formatPayment(campaign) {
  const min = campaign?.minBudget;
  const max = campaign?.maxBudget;
  const minStr = formatCurrency(min);
  const maxStr = formatCurrency(max);
  if (minStr && maxStr) return maxStr;
  if (minStr) return minStr;
  if (maxStr) return maxStr;
  if (campaign?.budgetValue) return `R ${campaign.budgetValue}`;
  return "—";
}

function normalizeStatus(raw) {
  const v = String(raw || "").toLowerCase().replace(/\s+/g, "_");
  if (["pending", "applied"].includes(v)) return "pending";
  if (["rejected", "declined"].includes(v)) return "rejected";
  if (["accepted", "active", "ongoing"].includes(v)) return "active";
  if (
    ["submitted", "in_review", "review", "under_review", "pending_review"].includes(v)
  )
    return "in_review";
  if (
    ["in_revision", "revision", "revision_requested", "revisions_requested"].includes(v)
  )
    return "in_revision";
  if (["completed", "done", "approved"].includes(v)) return "completed";
  return "pending";
}

/**
 * Prefer API `workStatus` for creator action CTAs.
 * - "submit" → Submit Work
 * - "resubmit" → Resubmit Work
 * - null (explicit) → no action CTA; badge from job.status (under review / approved)
 * - undefined (legacy payload) → fall back to job.status mapping
 */
function resolveUiStatus(job) {
  const rawStatus = String(job?.status || "")
    .toLowerCase()
    .replace(/\s+/g, "_");
  // Application still awaiting brand accept/decline — never promote to active/submit.
  if (["pending", "applied"].includes(rawStatus)) return "pending";
  if (["rejected", "declined"].includes(rawStatus)) return "rejected";

  const workStatus = job?.workStatus;
  if (workStatus === "submit") return "active";
  if (workStatus === "resubmit") return "in_revision";

  // Explicit null from API: latest revision is pending_review or approved.
  if (workStatus === null) {
    if (["completed", "done", "approved"].includes(rawStatus)) return "completed";
    return "in_review";
  }

  return normalizeStatus(job?.status);
}

/** True when creator applied but brand has not accepted the proposal yet (no JOB-… id). */
export function isPendingApplication(job) {
  if (!job || isRejectedApplication(job)) return false;
  const rawStatus = String(
    job.raw?.applicationStatus ??
      job.raw?.status ??
      job.application?.applicationStatus ??
      job.application?.status ??
      job.status ??
      ""
  )
    .toLowerCase()
    .replace(/\s+/g, "_");
  if (["pending", "applied"].includes(rawStatus)) return true;
  return (
    resolveUiStatus(job) === "pending" && !pickCreatorJobPublicId(job)
  );
}

/** True when the brand declined the creator's campaign application. */
export function isRejectedApplication(job) {
  if (!job) return false;
  const rawStatus = String(
    job.raw?.applicationStatus ??
      job.raw?.status ??
      job.application?.applicationStatus ??
      job.application?.status ??
      job.status ??
      ""
  )
    .toLowerCase()
    .replace(/\s+/g, "_");
  if (["rejected", "declined"].includes(rawStatus)) return true;
  return resolveUiStatus(job) === "rejected";
}

function getFilterCategory(status) {
  if (status === "completed") return "Completed Jobs";
  if (status === "pending" || status === "rejected") return "Applied Jobs";
  return "On-going Jobs";
}

function calculateOverdueDays(campaign) {
  const end =
    campaign?.applicationDeadline ||
    campaign?.endDate ||
    campaign?.campaignEnds;
  if (!end) return null;
  const endDate = new Date(end);
  endDate.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.floor((today - endDate) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : null;
}

export function getDeliverableUploadType(deliverable) {
  const label = getDeliverableLabel(deliverable).toLowerCase();
  const hasPhoto = label.includes("photo") || label.includes("photography");
  const hasVideo =
    label.includes("video") ||
    label.includes("unboxing") ||
    label.includes("reels");
  if (hasPhoto && hasVideo) return "both";
  if (hasVideo) return "video";
  if (hasPhoto) return "photos";
  return "both";
}

export function mapApplicationToJob(app) {
  const campaign = app?.campaign || {};
  const status = normalizeStatus(app?.applicationStatus || app?.status);
  const deliverableRaw = campaign.deliverables || campaign.socialMediaType;
  const brand = campaign.brand || {};

  return {
    id: campaign.id || app.id,
    applicationId: app.id,
    title: campaign.campaignTitle || "Untitled Job",
    brandName: brand.companyName || campaign.companyName || "Brand",
    campaignName: campaign.campaignTitle || "Campaign",
    description: campaign.campaignBrief || "",
    image:
      campaign?.media?.coverImage?.url ||
      campaign?.media?.productImages?.[0]?.url ||
      campaign?.media?.moodboards?.[0]?.url ||
      campaignImage,
    payment: formatPayment(campaign),
    deliverable: getDeliverableLabel(deliverableRaw),
    deliverableRaw,
    startDate: formatJobDate(campaign.campaignStarts || campaign.startDate),
    endDate: formatJobDate(
      campaign.applicationDeadline || campaign.endDate
    ),
    status,
    filterCategory: getFilterCategory(status),
    overdueDays: calculateOverdueDays(campaign),
    campaign,
    application: app,
  };
}

export function filterJobsByCategory(jobs, category) {
  if (!category) return jobs;
  return jobs.filter((job) => job.filterCategory === category);
}

export function filterJobsBySearch(jobs, query) {
  const q = query.trim().toLowerCase();
  if (!q) return jobs;
  return jobs.filter((job) =>
    [job.title, job.brandName, job.campaignName, job.description]
      .join(" ")
      .toLowerCase()
      .includes(q)
  );
}

export function findJobApplication(applications, jobId) {
  return applications.find((app) => {
    const campaignId = app?.campaign?.id ?? app?.id;
    return String(campaignId) === String(jobId);
  });
}

/**
 * Map a job from the `/jobs` API response into the shape used by the UI.
 * API shape (from docs/MY-JOBS.md):
 *   { jobId, publicId, status, hiringSource, agreedBudget, deadlineAt,
 *     createdAt, campaign: {...}, brand: {...} }
 */
export function mapJobToCard(job) {
  const campaign = job?.campaign || {};
  const brand = job?.brand || {};
  const workStatus = job?.workStatus;
  const status = resolveUiStatus(job);

  const image =
    campaign?.thumbnail?.url ||
    campaign?.thumbnail ||
    brand?.logo?.url ||
    null;

  const payment = formatCurrency(job?.agreedBudget) || "—";

  const jobPublicId =
    [job?.publicId, job?.jobPublicId, campaign?.jobPublicId].find((v) =>
      String(v || "").startsWith("JOB-")
    ) || null;

  return {
    id:
      job?.campaign?.publicId ||
      campaign?.publicId ||
      jobPublicId ||
      job?.jobId ||
      campaign?.id,
    jobId: job?.jobId,
    publicId: job?.publicId,
    jobPublicId,
    applicationId: null,
    title: campaign?.title || "Untitled Job",
    brandName: brand?.name || "Brand",
    brandLogo: brand?.logo?.url || null,
    campaignName: campaign?.title || "Campaign",
    campaignPublicId: campaign?.publicId,
    campaignId: campaign?.id,
    description: campaign?.description || "",
    image,
    payment,
    deliverable: getDeliverableLabel(
      campaign?.deliverables || campaign?.compensationType
    ),
    deliverableRaw: campaign?.deliverables || campaign?.compensationType || null,
    startDate: formatJobDate(job?.createdAt),
    endDate: formatJobDate(job?.deadlineAt),
    status,
    workStatus,
    filterCategory: getFilterCategory(status),
    overdueDays: calculateOverdueDays({ applicationDeadline: job?.deadlineAt }),
    hiringSource: job?.hiringSource || null,
    campaign,
    brand,
    raw: job,
  };
}

export function getJobRouteId(job) {
  if (isCampaignPublicId(job?.campaignPublicId)) return job.campaignPublicId;
  if (isCampaignPublicId(job?.campaign?.publicId)) return job.campaign.publicId;
  if (isCampaignPublicId(job?.id)) return job.id;
  return (
    job?.campaignPublicId ||
    job?.campaign?.publicId ||
    job?.id ||
    null
  );
}

/** Merge full campaign record from GET /campaigns/active onto a card. */
export function enrichJobWithActiveCampaign(card, activeCampaign) {
  if (!card || !activeCampaign) return card;
  const enriched = {
    ...card,
    campaignPublicId: activeCampaign.publicId || card.campaignPublicId,
    campaign: { ...card.campaign, ...activeCampaign },
  };
  if (activeCampaign.publicId) {
    enriched.id = activeCampaign.publicId;
    enriched.campaignPublicId = activeCampaign.publicId;
    // Keep CreatorJob.publicId (JOB-…) for submission APIs — route uses CMP-… only.
    if (!isCreatorJobPublicId(enriched.jobPublicId)) {
      const fromRaw = [card.jobPublicId, card.publicId, card.raw?.publicId].find(
        isCreatorJobPublicId
      );
      if (fromRaw) enriched.jobPublicId = fromRaw;
    }
  }
  return enriched;
}

export function findActiveCampaignForJob(activeCampaigns, card) {
  if (!Array.isArray(activeCampaigns) || !card) return null;
  return (
    activeCampaigns.find(
      (c) =>
        (card.campaignId != null &&
          String(c.id) === String(card.campaignId)) ||
        (card.campaignPublicId &&
          String(c.publicId) === String(card.campaignPublicId)) ||
        (card.id && String(c.publicId) === String(card.id))
    ) || null
  );
}

export function findActiveCampaignByRouteId(activeCampaigns, routeId) {
  if (!routeId || !Array.isArray(activeCampaigns)) return null;
  const target = String(routeId);
  return (
    activeCampaigns.find((c) => String(c.publicId) === target) || null
  );
}

/**
 * Resolve a raw job/application record from the URL route param.
 * Route uses campaign publicId (CMP-…) from GET /campaigns/active; applications
 * often only include campaign.id, so we bridge via the active campaigns list.
 * CreatorJob.publicId (JOB-…) comes from GET /creator/jobs (merged in getMyJobs).
 */
export function resolveJobFromRouteId(routeId, jobs = [], activeCampaigns = []) {
  if (!routeId) return null;
  const target = String(routeId);

  const direct = findJobByIdentifier(jobs, routeId);
  if (direct) return direct;

  const activeCampaign = findActiveCampaignByRouteId(
    activeCampaigns,
    routeId
  );

  const byCampaign = jobs.find((job) => {
    const c = job?.campaign || {};
    return (
      String(c.id) === target ||
      String(c.publicId) === target ||
      (activeCampaign &&
        (String(c.id) === String(activeCampaign.id) ||
          String(c.publicId) === String(activeCampaign.publicId)))
    );
  });
  if (byCampaign) return byCampaign;

  // No matching application/job — do not assume "pending" (avoids masking rejected).
  return null;
}

/** Find CreatorJob.publicId (JOB-…) for a my-jobs route (CMP-… or JOB-…). */
export function findCreatorJobPublicIdForRoute(
  routeId,
  jobs = [],
  activeCampaigns = []
) {
  if (!routeId || !Array.isArray(jobs) || !jobs.length) return null;

  const target = String(routeId);
  const activeCampaign = findActiveCampaignByRouteId(activeCampaigns, routeId);

  for (const job of jobs) {
    const campaign = job?.campaign || {};
    const routeMatches =
      String(campaign?.publicId) === target ||
      String(campaign?.id) === target ||
      String(job?.publicId) === target ||
      String(job?.jobPublicId) === target ||
      (activeCampaign &&
        (String(campaign?.id) === String(activeCampaign.id) ||
          String(campaign?.publicId) === String(activeCampaign.publicId)));

    if (!routeMatches) continue;

    const resolved = [job?.jobPublicId, job?.publicId].find(isCreatorJobPublicId);
    if (resolved) return String(resolved).trim();

    const picked = pickCreatorJobPublicId(job);
    if (picked) return picked;
  }

  return null;
}

/** Build a UI card for a my-jobs route, hydrated with /campaigns/active data. */
export function buildJobCardForRoute(routeId, jobs = [], activeCampaigns = []) {
  const raw = resolveJobFromRouteId(routeId, jobs, activeCampaigns);
  if (!raw) return null;

  let card = mapJobToCard(raw);
  const activeCampaign =
    findActiveCampaignByRouteId(activeCampaigns, routeId) ||
    findActiveCampaignForJob(activeCampaigns, card);
  if (activeCampaign) {
    card = enrichJobWithActiveCampaign(card, activeCampaign);
  }
  return card;
}

/** Find a job by publicId or jobId in a /jobs response slice. */
export function findJobByIdentifier(jobs, identifier) {
  if (!identifier) return null;
  const target = String(identifier);
  return (
    jobs.find((job) => {
      const campaign = job?.campaign || {};
      return (
        String(job?.publicId) === target ||
        String(job?.jobPublicId) === target ||
        String(job?.jobId) === target ||
        String(campaign?.publicId) === target ||
        String(campaign?.id) === target
      );
    }) || null
  );
}
