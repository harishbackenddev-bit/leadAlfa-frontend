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

/** Invoice-based creator-visible budget from campaign API (CampaignInvoice). */
export function getCampaignCreatorVisibleBudget(campaign) {
  if (!campaign) return null;
  const raw =
    campaign.creatorVisibleBudget ??
    campaign.invoice?.creatorVisibleBudget ??
    campaign.invoice?.cartSubtotal;
  return raw != null && raw !== "" ? raw : null;
}

/** Fixed compensation label for cards, tables, and detail views. */
export function formatCampaignCompensation(campaign) {
  if (!campaign) return "—";
  const type = String(campaign.compensationType || "").toLowerCase();
  if (type.includes("gift")) {
    return campaign.giftNameDescription?.trim() || "Gift";
  }

  const formatted = formatRandAmount(getCampaignCreatorVisibleBudget(campaign));
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

/** Same payment line as brand campaign sidebar card */
export function getSidebarPaymentRange(campaign) {
  if (!campaign) return "-";
  const isGift = String(campaign.compensationType || "").toLowerCase().includes("gift");
  if (isGift) return "Gift Campaign";
  const formatted = formatCampaignCompensation(campaign);
  return formatted === "—" ? "-" : formatted;
}
