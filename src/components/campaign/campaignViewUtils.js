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

/** Invoice-based total creator budget from campaign API (CampaignInvoice). */
export function getCampaignCreatorVisibleBudget(campaign) {
  if (!campaign) return null;
  const raw =
    campaign.creatorVisibleBudget ??
    campaign.invoice?.creatorVisibleBudget ??
    campaign.invoice?.cartSubtotal;
  return raw != null && raw !== "" ? raw : null;
}

// ============================================================
// ✅ NEW: Per-creator amount (creator view)
// Total budget / numberOfCreators
// Prefers backend `creatorAmount` if provided
// ============================================================
export function getCampaignCreatorAmount(campaign) {
  if (!campaign) return null;

  // ✅ 1. Prefer backend `creatorAmount` (already divided)
  if (campaign.creatorAmount != null && campaign.creatorAmount !== "") {
    const num = Number(String(campaign.creatorAmount).replace(/,/g, ""));
    if (!Number.isNaN(num)) return num;
  }

  // ✅ 2. Fallback: calculate from total / creators
  const totalBudget = getCampaignCreatorVisibleBudget(campaign);
  if (!totalBudget) return null;

  const creatorsRaw = campaign.numberOfCreators ?? campaign.creatorsNeeded;
  const creators = Number(creatorsRaw);
  if (!Number.isFinite(creators) || creators < 1) return null;

  return Number(totalBudget) / creators;
}

/** Fixed compensation label — shows PER-CREATOR amount for cash campaigns. */
export function formatCampaignCompensation(campaign) {
  if (!campaign) return "—";
  const type = String(campaign.compensationType || "").toLowerCase();
  if (type.includes("gift")) {
    return campaign.giftNameDescription?.trim() || "Gift";
  }

  // ✅ Use per-creator amount
  const perCreator = getCampaignCreatorAmount(campaign);
  const formatted = formatRandAmount(perCreator);
  if (formatted) return formatted;

  // Fallback: video length + creator count
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

/** Same payment line as brand campaign sidebar card — PER-CREATOR amount. */
export function getSidebarPaymentRange(campaign) {
  if (!campaign) return "-";
  const isGift = String(campaign.compensationType || "").toLowerCase().includes("gift");
  if (isGift) return "Gift Campaign";
  const formatted = formatCampaignCompensation(campaign);
  return formatted === "—" ? "-" : formatted;
}