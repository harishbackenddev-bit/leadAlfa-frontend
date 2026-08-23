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

/** Same payment line as brand campaign sidebar card */
export function getSidebarPaymentRange(campaign) {
  if (!campaign) return "-";
  const minBudget = campaign.minBudget;
  const maxBudget = campaign.maxBudget;
  const isGift = String(campaign.compensationType || "").toLowerCase().includes("gift");
  if (isGift) return "Gift Campaign";
  const min = formatRandAmount(minBudget);
  const max = formatRandAmount(maxBudget);
  if (min && max) return `${min} – ${max}`;
  if (min) return min;
  if (max) return max;
  return "-";
}
