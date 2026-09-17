export const TURNSTILE_MISSING_TOKEN_MESSAGE =
  "Please complete the security verification.";

export const TURNSTILE_FAILED_MESSAGE =
  "Security verification failed. Please try again.";

const CAPTCHA_KEYWORDS = ["turnstile", "captcha", "security verification"];

const matchesCaptchaKeyword = (value) => {
  if (typeof value !== "string") return false;
  const lower = value.toLowerCase();
  return CAPTCHA_KEYWORDS.some((keyword) => lower.includes(keyword));
};

/** Detect backend/client errors related to Turnstile verification. */
export const isTurnstileError = (err) => {
  if (err == null || typeof err !== "object") return false;

  const message = err.message || err.error || err.msg || "";
  if (matchesCaptchaKeyword(message)) return true;

  if (Array.isArray(err.errors)) {
    return err.errors.some((item) => {
      if (
        item?.field === "captchaToken" ||
        item?.field === "cf-turnstile-response"
      ) {
        return true;
      }
      return matchesCaptchaKeyword(item?.message);
    });
  }

  if (err.status === 400 && typeof message === "string" && message.includes("token")) {
    return matchesCaptchaKeyword(message) || message.toLowerCase().includes("missing");
  }

  return false;
};
