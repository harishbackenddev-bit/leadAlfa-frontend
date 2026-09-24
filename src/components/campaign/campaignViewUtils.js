export function formatDetailDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatRandAmount(value) {
  if (value == null || value === "") return null;
  const num = Number(String(value).replace(/,/g, ""));
  if (Number.isNaN(num)) return null;
  const [intPart, dec = "00"] = num.toFixed(2).split(".");
  const withGrouping = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `R ${withGrouping}.${dec}`;
}

// ============================================================
// ✅ Total budget (brand view)
// ============================================================
export function getCampaignCreatorVisibleBudget(campaign) {
  if (!campaign) return null;
  const raw =
    campaign.creatorVisibleBudget ??
    campaign.invoice?.creatorVisibleBudget ??
    campaign.invoice?.cartSubtotal;
  return raw != null && raw !== "" ? raw : null;
}

// ============================================================
// ✅ Per-creator amount (creator view)
// ============================================================
export function getCampaignCreatorAmount(campaign) {
  if (!campaign) return null;

  // Prefer backend `creatorAmount` if provided
  if (campaign.creatorAmount != null && campaign.creatorAmount !== "") {
    const num = Number(String(campaign.creatorAmount).replace(/,/g, ""));
    if (!Number.isNaN(num)) return num;
  }

  // Fallback: total / creators
  const totalBudget = getCampaignCreatorVisibleBudget(campaign);
  if (!totalBudget) return null;

  const creatorsRaw = campaign.numberOfCreators ?? campaign.creatorsNeeded;
  const creators = Number(creatorsRaw);
  if (!Number.isFinite(creators) || creators < 1) return null;

  return Number(totalBudget) / creators;
}

// ============================================================
// ✅ Role-aware: which amount to show
// viewerRole = "creator" → per-creator
// viewerRole = "brand"   → total budget (default)
// ============================================================
function resolveDisplayAmount(campaign, viewerRole) {
  if (!campaign) return null;
  return viewerRole === "creator"
    ? getCampaignCreatorAmount(campaign)
    : getCampaignCreatorVisibleBudget(campaign);
}

// ============================================================
// ✅ Format compensation — role-aware
// ============================================================
export function formatCampaignCompensation(campaign, viewerRole = "brand") {
  if (!campaign) return "—";
  const type = String(campaign.compensationType || "").toLowerCase();
  if (type.includes("gift")) {
    return campaign.giftNameDescription?.trim() || "Gift";
  }

  const amount = resolveDisplayAmount(campaign, viewerRole);
  const formatted = formatRandAmount(amount);
  if (formatted) return formatted;

  const parts = [];
  if (campaign.videoLength) parts.push(String(campaign.videoLength));
  if (campaign.numberOfCreators != null && campaign.numberOfCreators !== "") {
    const n = Number(campaign.numberOfCreators);
    parts.push(
      Number.isFinite(n)
        ? `${n} creator${n === 1 ? "" : "s"}`
        : `${campaign.numberOfCreators} creators`
    );
  }
  if (parts.length) return parts.join(" · ");

  return "—";
}

// ============================================================
// ✅ Sidebar payment range — role-aware
// ============================================================
export function getSidebarPaymentRange(campaign, viewerRole = "brand") {
  if (!campaign) return "-";
  const isGift = String(campaign.compensationType || "").toLowerCase().includes("gift");
  if (isGift) return "Gift Campaign";
  const formatted = formatCampaignCompensation(campaign, viewerRole);
  return formatted === "—" ? "-" : formatted;
}