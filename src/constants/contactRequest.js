export const INQUIRY_TYPE_OPTIONS = [
  { value: "talk_to_sales", label: "Talk to Sales" },
  { value: "inquire_about_career", label: "Inquire about Career" },
  { value: "ask_general_question", label: "Ask a General Question" },
];

export const DEFAULT_INQUIRY_TYPE = INQUIRY_TYPE_OPTIONS[0].value;

export const INQUIRY_TYPE_LABELS = INQUIRY_TYPE_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

export const CONTACT_SUCCESS_MESSAGE =
  "Thank you! Your message has been sent. We'll get back to you soon.";

export const CONTACT_RATE_LIMIT_MESSAGE =
  "Please wait 15 minutes before submitting again.";

export const CONTACT_STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

export const CONTACT_STATUS_LABELS = CONTACT_STATUS_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

export const CONTACT_STATUS_BADGE_CLASS = {
  new: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  resolved: "bg-emerald-100 text-emerald-700",
};
