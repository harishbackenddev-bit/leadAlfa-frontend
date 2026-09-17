/**
 * Central option lists for creator onboarding (basic info).
 * Shape matches brand campaign forms: { label, value }.
 * Province / city options live in `src/utils/location.js`.
 */

/** Select trigger + text controls — aligned with CampaignForm `inputClass`. */
export const creatorFormInputClass =
  "bg-white h-[48px] px-[16px] border-[#e5e7eb] border-[0.8px] border-solid rounded-[12px] text-[14px] text-[#1e293b] placeholder:text-[rgba(30,41,59,0.5)] tracking-[-0.3px] outline-none focus:border-[#0353a4] transition-colors w-full";

/** Radix Select sentinel for “no secondary niche”. */
export const SECONDARY_NICHE_NONE = "__secondary_none__";

export const creatorSelectOptions = {
  ethnicity:[{ "label": "Black African", "value": "black_african" }, { "label": "Black British", "value": "black_british" }, { "label": "Black American", "value": "black_american" }, { "label": "Mixed", "value": "mixed" }, { "label": "Middle Eastern", "value": "middle_eastern" }, { "label": "Hispanic/Latino", "value": "hispanic_latino" }, { "label": "Asian", "value": "asian" }, { "label": "Indian/South Asian", "value": "indian_south_asian" }, { "label": "White American", "value": "white_american" }, { "label": "White Afrikaner", "value": "white_afrikaner" }, { "label": "White British", "value": "white_british" }],
  appearance: [
    {
      "label": "All",
      "value": "all"
    },
    {
      "label": "Fit & Sporty",
      "value": "fit_sporty"
    },
    {
      "label": "Casual",
      "value": "casual"
    },
    {
      "label": "Relatable",
      "value": "relatable"
    },
    {
      "label": "Plus Size",
      "value": "plus_size"
    }
  ],
  gender: [
    { label: "Male", value: "male" },
    { label: "Female", value: "female" },
    { label: "Prefer not to say", value: "prefer_not_say" },

  ],
  languageSpoken: [
    { "label": "English", "value": "english" },
    { "label": "IsiZulu", "value": "isizulu" },
    { "label": "IsiXhosa", "value": "isixhosa" },
    { "label": "Afrikaans", "value": "afrikaans" },
    { "label": "Sepedi", "value": "sepedi" },
    { "label": "Setswana", "value": "setswana" },
    { "label": "Sesotho", "value": "sesotho" },
    { "label": "Xitsonga", "value": "xitsonga" },
    { "label": "siSwati", "value": "siswati" },
    { "label": "Tshivenda", "value": "tshivenda" },
    { "label": "isiNdebele", "value": "isindebele" }
  ],
};
