/**
 * Brand onboarding — dropdown / multi-select option lists.
 * Country / city options live in `src/utils/location.js`.
 */

export const brandFormInputClass =
  "bg-white h-[48px] px-[16px] border-[#e5e7eb] border-[0.8px] border-solid rounded-[12px] text-[14px] text-[#1e293b] placeholder:text-[rgba(30,41,59,0.5)] tracking-[-0.3px] outline-none focus:border-[#0353a4] transition-colors w-full";

export const brandSelectOptions = {
 businessType: [
  { label: "Agency", value: "agency" },
  { label: "Single Brand", value: "single_brand" },
  { label: "Multi-Brand Company", value: "multi_brand_company" },
],

jobRole: [
  { label: "CEO / Owner", value: "ceo_owner" },
  { label: "Marketing Lead / Director", value: "marketing_lead_director" },
  { label: "Operations / Admin", value: "operations_admin" },
  {
    label: "Creative / Content Manager / Brand Manager",
    value: "creative_content_brand_manager",
  },
  {
    label: "Media Buyer / Paid Social Manager",
    value: "media_buyer_paid_social_manager",
  },
  { label: "Other", value: "other" },
],
};
