import {
  VIDEO_LENGTH_PACKAGES,
  CAMPAIGN_ADD_ONS,
  SERVICE_FEE_RATE,
  VAT_RATE,
} from "../data/campaignCreatePricingData";
import { MAX_CAMPAIGN_CREATORS } from "./campaignCreateStepUtils";

export function getVideoLengthPackage(value) {
  return VIDEO_LENGTH_PACKAGES.find((pkg) => pkg.value === value) ?? null;
}

function parseCreatorCount(raw) {
  const digits = String(raw ?? "").replace(/\D/g, "");
  if (!digits) return 1;
  const num = Number.parseInt(digits, 10);
  if (!Number.isFinite(num) || num < 1) return 1;
  return Math.min(MAX_CAMPAIGN_CREATORS, num);
}

export function calculateCampaignInvoice({
  videoLength,
  selectedAddOnIds = [],
  numberOfCreators = 1,
  isGiftCampaign = false,
}) {
  if (isGiftCampaign) {
    return {
      isFromApi: false,
      hasVideoLength: false,
      isGiftCampaign: true,
      basePackageLabel: null,
      perCreatorRate: 0,
      numberOfCreators: parseCreatorCount(numberOfCreators),
      baseAmount: 0,
      addOnLines: [],
      addOnsTotal: 0,
      cartSubtotal: 0,
      creatorVisibleBudget: 0,
      serviceFee: 0,
      amountBeforeTax: 0,
      vat: 0,
      totalDue: 0,
    };
  }

  const pkg = getVideoLengthPackage(videoLength);
  const creatorCount = parseCreatorCount(numberOfCreators);
  const perCreatorRate = pkg?.price ?? 0;
  const baseAmount = perCreatorRate * creatorCount;

  const addOnLines = CAMPAIGN_ADD_ONS.filter((addon) =>
    selectedAddOnIds.includes(addon.id)
  ).map((addon) => ({
    id: addon.id,
    label: addon.label,
    amount: baseAmount * addon.pct,
  }));

  const addOnsTotal = addOnLines.reduce((sum, line) => sum + line.amount, 0);
  const cartSubtotal = baseAmount + addOnsTotal;
  const serviceFee = cartSubtotal * SERVICE_FEE_RATE;
  const amountBeforeTax = cartSubtotal + serviceFee;
  const vat = amountBeforeTax * VAT_RATE;
  const totalDue = amountBeforeTax + vat;

  return {
    isFromApi: false,
    hasVideoLength: Boolean(pkg),
    isGiftCampaign: false,
    basePackageLabel: pkg ? pkg.duration : null,
    perCreatorRate,
    numberOfCreators: creatorCount,
    baseAmount,
    addOnLines,
    addOnsTotal,
    cartSubtotal,
    creatorVisibleBudget: cartSubtotal,
    serviceFee,
    amountBeforeTax,
    vat,
    totalDue,
  };
}

export function getCampaignCreateProgressPercent(currentStep) {
  const step = Math.max(1, Math.min(currentStep, 6));
  return Math.round((step / 6) * 100);
}
