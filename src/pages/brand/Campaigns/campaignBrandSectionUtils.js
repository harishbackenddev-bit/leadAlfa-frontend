/**
 * Derive which brand campaign detail sections should render, based on API payload.
 * Supports multiple possible backend field names; extend as contracts stabilize.
 */

function isNonemptyObject(val) {
  return val != null && typeof val === "object" && Object.keys(val).length > 0;
}

/** First accepted / assigned creator-like object from campaign. */
export function pickActiveCampaignCreator(campaign) {
  if (!campaign || typeof campaign !== "object") return null;

  const direct =
    campaign.assignedCreator ||
    campaign.activeCreator ||
    campaign.selectedCreator ||
    null;
  if (isNonemptyObject(direct)) return direct;

  const c = campaign.creator;
  if (isNonemptyObject(c) && (c.firstName || c.lastName || c.name || c.fullName || c.id))
    return c;

  const apps = campaign.applications || campaign.campaignApplications;
  if (Array.isArray(apps)) {
    const accepted = apps.find((a) => {
      const s = String(a?.applicationStatus || a?.status || "").toLowerCase();
      return s === "accepted" || s === "approved" || s === "active";
    });
    if (accepted?.creator && isNonemptyObject(accepted.creator)) return accepted.creator;
  }

  const creators = campaign.creators || campaign.acceptedCreators;
  if (Array.isArray(creators) && creators.length > 0) {
    const first = creators[0];
    if (isNonemptyObject(first)) return first;
  }

  return null;
}

export function mapCreatorToDetailsShape(creator) {
  if (!creator) return null;
  const name =
    [creator.firstName, creator.lastName].filter(Boolean).join(" ").trim() ||
    creator.name ||
    creator.fullName ||
    creator.displayName ||
    "";
  const rating = creator.rating ?? creator.averageRating ?? null;
  const jobsCompleted =
    creator.jobsCompleted ??
    creator.completedJobs ??
    (creator.completedCampaignsCount != null
      ? `${creator.completedCampaignsCount} Jobs`
      : null);
  const address =
    creator.address ||
    creator.shippingAddress ||
    creator.fullAddress ||
    [
      creator.addressLine1,
      creator.addressLine2,
      creator.city,
      creator.country,
    ]
      .filter(Boolean)
      .join(", ") ||
    "";

  const displayName =
    String(name || "").trim() ||
    (creator.id != null ? `Creator #${creator.id}` : "") ||
    String(creator.email || "").trim() ||
    "";

  if (!displayName) return null;

  return {
    name: displayName,
    rating: rating ?? "-",
    jobsCompleted: jobsCompleted ?? "-",
    address: address || "-",
    avatarUrl: creator.avatarUrl || creator.profilePhotoUrl || creator.profilePicture,
  };
}

export function pickAssignmentPayload(campaign) {
  if (!campaign) return null;
  const a =
    campaign.assignment ||
    campaign.creatorAssignment ||
    campaign.submittedAssignment ||
    campaign.viewAssignment;
  if (isNonemptyObject(a)) return a;
  if (Array.isArray(campaign.submittedDeliverables) && campaign.submittedDeliverables.length) {
    return { deliverables: campaign.submittedDeliverables };
  }
  if (
    Array.isArray(campaign.assignmentDeliverables) &&
    campaign.assignmentDeliverables.length
  ) {
    return { deliverables: campaign.assignmentDeliverables };
  }
  if (
    campaign.assignmentStatus != null &&
    String(campaign.assignmentStatus).trim() !== ""
  ) {
    return { status: campaign.assignmentStatus };
  }
  return null;
}

/** Normalized rows for ShippingDetails2 table, or null if none. */
export function getShippingDetails2Rows(campaign) {
  if (!campaign) return null;
  const raw =
    campaign.shipmentTrackingRows ||
    campaign.shippingTracking ||
    campaign.trackingShipments ||
    campaign.shipments ||
    campaign.shippingDetails2;
  if (!Array.isArray(raw) || raw.length === 0) return null;
  return raw.map((r, idx) => ({
    id: r.id ?? r.trackingId ?? r.trackingID ?? `#${idx + 1}`,
    name: r.name ?? r.recipientName ?? r.creatorName ?? "-",
    sku: r.sku ?? r.skuId ?? "-",
    qty: r.qty ?? r.quantity ?? "-",
    date: r.date ?? r.shippedOn ?? "-",
    deliveringDate:
      r.deliveringDate ?? r.deliveredAt ?? r.expectedDelivery ?? r.date ?? "-",
    status: r.status ?? "-",
    imageUrl: r.imageUrl ?? r.thumbnailUrl,
  }));
}

export function mapCreatorToSummaryProps(campaign, activeCreator) {
  const s = campaign?.creatorSummary;
  if (isNonemptyObject(s)) {
    const nameRaw = String(s.name || s.fullName || "").trim();
    if (nameRaw && nameRaw !== "-") {
      return {
        name: nameRaw,
        rating: s.rating != null ? String(s.rating) : "—",
        avatar: s.avatar || s.avatarUrl || s.profilePhotoUrl,
      };
    }
  }
  const d = mapCreatorToDetailsShape(activeCreator);
  if (!d) return null;
  const ratingStr =
    activeCreator?.rating != null || activeCreator?.averageRating != null
      ? String(activeCreator.rating ?? activeCreator.averageRating)
      : typeof d.rating === "number"
        ? String(d.rating)
        : String(d.rating || "—");
  return {
    name: d.name,
    rating: ratingStr,
    avatar: activeCreator?.profilePhotoUrl || activeCreator?.avatarUrl,
  };
}
