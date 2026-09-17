export const BOOK_CALL_SUCCESS_MESSAGE =
  "Your call request has been received. Our team will contact you shortly.";

export const BOOK_CALL_RATE_LIMIT_MESSAGE =
  "Please wait 15 minutes before submitting again.";

export const EMPTY_BOOK_CALL_FORM = {
  name: "",
  businessEmail: "",
  companyName: "",
  companyWebsite: "",
};

export const BOOK_CALL_FIELD_ERROR_DURATION_MS = 6_000;
export const BOOK_CALL_BANNER_DURATION_MS = 8_000;

export const BOOK_CALL_FIELD_MESSAGES = {
  name: "Please enter your name (2–100 characters).",
  businessEmail: "Please provide a valid email address.",
  companyName: "Please enter your company name (2–150 characters).",
  companyWebsite: "Please provide a valid website URL starting with http:// or https://.",
  agreedToTerms: "Please agree to be contacted before submitting.",
};

export const BOOK_CALL_STATUS_OPTIONS = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

export const BOOK_CALL_STATUS_LABELS = BOOK_CALL_STATUS_OPTIONS.reduce((acc, option) => {
  acc[option.value] = option.label;
  return acc;
}, {});

export const BOOK_CALL_STATUS_BADGE_CLASS = {
  new: "bg-blue-100 text-blue-700",
  in_progress: "bg-amber-100 text-amber-700",
  resolved: "bg-emerald-100 text-emerald-700",
};

export const BOOK_CALL_ADMIN_NOTES_MAX_LENGTH = 1000;

export function getBookCallAdminErrorMessage(err, fallback = "Something went wrong. Please try again later.") {
  if (err?.status === 403) {
    return "Access Denied";
  }

  if (err?.status === 404) {
    return err.error || "Book a call request not found";
  }

  if (err?.status === 401) {
    return "Your session has expired. Please sign in again.";
  }

  if (Array.isArray(err?.errors) && err.errors[0]?.message) {
    return err.errors[0].message;
  }

  if (err?.status >= 500 || !err?.status) {
    return err?.error || err?.message || fallback;
  }

  return err?.error || err?.message || fallback;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

export function normalizeWebsiteUrl(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export function isValidWebsiteUrl(value) {
  try {
    const url = new URL(normalizeWebsiteUrl(value));
    if (url.protocol !== "http:" && url.protocol !== "https:") return false;
    return url.hostname.includes(".");
  } catch {
    return false;
  }
}

export function validateBookCallForm({
  name,
  businessEmail,
  companyName,
  companyWebsite,
  agreedToTerms,
}) {
  const errors = {};
  const trimmedName = String(name || "").trim();
  const trimmedEmail = String(businessEmail || "").trim();
  const trimmedCompany = String(companyName || "").trim();
  const trimmedWebsite = String(companyWebsite || "").trim();

  if (trimmedName.length < 2 || trimmedName.length > 100) {
    errors.name = BOOK_CALL_FIELD_MESSAGES.name;
  }

  if (!EMAIL_PATTERN.test(trimmedEmail) || trimmedEmail.length > 255) {
    errors.businessEmail = BOOK_CALL_FIELD_MESSAGES.businessEmail;
  }

  if (trimmedCompany.length < 2 || trimmedCompany.length > 150) {
    errors.companyName = BOOK_CALL_FIELD_MESSAGES.companyName;
  }

  if (!isValidWebsiteUrl(trimmedWebsite)) {
    errors.companyWebsite = BOOK_CALL_FIELD_MESSAGES.companyWebsite;
  }

  if (!agreedToTerms) {
    errors.agreedToTerms = BOOK_CALL_FIELD_MESSAGES.agreedToTerms;
  }

  return errors;
}
