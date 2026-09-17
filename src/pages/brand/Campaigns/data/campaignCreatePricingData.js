/** Dummy pricing — replace with API when ready */
export const VIDEO_LENGTH_PACKAGES = [
  { value: "starter", label: "15 sec", duration: "15 sec", price: 1250 },
  { value: "standard", label: "30 sec", duration: "30 sec", price: 1950 },
  { value: "deepdive", label: "60 sec", duration: "60 sec", price: 2850 },
];

/** Keys match POST /api/campaigns `addOns` — see NW_CAMPAIGNAPI_INTEGRATION.md */
export const CAMPAIGN_ADD_ONS = [
  {
    id: "raw_footage",
    label: "Raw Footage",
    description:
      "Receive all unedited clips, alternate takes, and extra angles.",
    pct: 0.3,
    priceLabel: "+30%",
  },
  {
    id: "usage_rights_30_day",
    label: "30-Day Paid Usage Rights",
    description: "Permission to run creator content as paid advertisements.",
    pct: 0.4,
    priceLabel: "+40%",
  },
  {
    id: "extra_hooks",
    label: "Extra Hooks / Variations",
    description:
      "Additional intro hooks optimised for testing and paid media.",
    pct: 0.25,
    priceLabel: "+25%",
  },
  {
    id: "still_images",
    label: "Still Images",
    description:
      "High-quality product and lifestyle photography delivered alongside video content.",
    pct: 0.2,
    priceLabel: "+20%",
  },
];

export const SERVICE_FEE_RATE = 0.05;
export const VAT_RATE = 0.15;
