import { CAMPAIGN_ADD_ONS } from "../data/campaignCreatePricingData";

/** UI wizard values → API `videoLength` */
export const VIDEO_LENGTH_TO_API = {
  starter: "15sec",
  standard: "30sec",
  deepdive: "60sec",
};

export const VIDEO_LENGTH_FROM_API = Object.fromEntries(
  Object.entries(VIDEO_LENGTH_TO_API).map(([ui, api]) => [api, ui])
);

export function toApiVideoLength(formValue) {
  if (!formValue) return "";
  return VIDEO_LENGTH_TO_API[formValue] || formValue;
}

export function fromApiVideoLength(apiValue) {
  if (!apiValue) return "";
  return VIDEO_LENGTH_FROM_API[apiValue] || apiValue;
}

/**
 * API may return `{ campaign: {...} }` or a flat campaign object with `publicId`.
 */
export function normalizeCampaignSaveResponse(response) {
  if (!response || typeof response !== "object") return null;

  if (response.campaign && typeof response.campaign === "object") {
    return response;
  }

  if (response.publicId != null || response.id != null) {
    return {
      message: response.message || "Campaign saved successfully.",
      campaign: response,
    };
  }

  return null;
}

export function extractSavedCampaign(response) {
  return normalizeCampaignSaveResponse(response)?.campaign ?? null;
}

export function resolveAddOnIdsFromApi(apiAddOns = []) {
  if (!Array.isArray(apiAddOns)) return [];
  return CAMPAIGN_ADD_ONS.filter((addon) =>
    apiAddOns.some((entry) => {
      const normalized = String(entry).toLowerCase();
      return (
        normalized === addon.id ||
        normalized.includes(addon.label.toLowerCase().slice(0, 8))
      );
    })
  ).map((addon) => addon.id);
}

/**
 * Maps backend invoice object to sidebar / review display shape.
 * @see docs/NW_CAMPAIGNAPI_INTEGRATION.md — Invoice Fields
 */
export function mapApiInvoiceToDisplay(apiInvoice) {
  if (!apiInvoice) return null;

  const appliedKeys = Array.isArray(apiInvoice.appliedAddOns)
    ? apiInvoice.appliedAddOns
    : [];

  const addOnsTotal = apiInvoice.addOnsAmount ?? 0;
  const matchedAddons = appliedKeys
    .map((key) => CAMPAIGN_ADD_ONS.find((item) => item.id === key))
    .filter(Boolean);

  const pctSum = matchedAddons.reduce((sum, addon) => sum + addon.pct, 0);

  const addOnLines = appliedKeys.map((key) => {
    const addon = CAMPAIGN_ADD_ONS.find((item) => item.id === key);
    const amount =
      addon && pctSum > 0
        ? (addOnsTotal * addon.pct) / pctSum
        : null;
    return {
      id: key,
      label: addon?.label || key,
      amount,
    };
  });

  return {
    isFromApi: true,
    hasVideoLength: Boolean(apiInvoice.videoLength),
    isGiftCampaign: false,
    basePackageLabel: apiInvoice.videoLength || null,
    perCreatorRate: apiInvoice.basePackagePrice ?? 0,
    numberOfCreators: apiInvoice.numberOfCreators ?? 1,
    baseAmount: apiInvoice.basePackageTotal ?? 0,
    addOnLines,
    addOnsTotal: apiInvoice.addOnsAmount ?? 0,
    cartSubtotal: apiInvoice.cartSubtotal ?? apiInvoice.creatorVisibleBudget ?? 0,
    creatorVisibleBudget: apiInvoice.creatorVisibleBudget ?? apiInvoice.cartSubtotal ?? 0,
    serviceFee: apiInvoice.serviceFeeAmount ?? 0,
    amountBeforeTax: apiInvoice.amountBeforeTax ?? 0,
    vat: apiInvoice.vatAmount ?? 0,
    totalDue: apiInvoice.totalAmountDue ?? 0,
  };
}
