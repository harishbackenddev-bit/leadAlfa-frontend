/** Cloudflare dummy sitekey — always passes (see docs/turnstileIntegration.md). */
export const TURNSTILE_TEST_SITE_KEY = "1x00000000000000000000AA";

export const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || TURNSTILE_TEST_SITE_KEY;

/** Set VITE_TURNSTILE_ENABLED=false to hide the widget locally. */
export const TURNSTILE_ENABLED =
  import.meta.env.VITE_TURNSTILE_ENABLED !== "false";
