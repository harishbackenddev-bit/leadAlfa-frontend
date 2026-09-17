/** Allowed numbers today: South African mobile E.164 (+27 then 9 digits starting 6–8). */
const ALLOWED_PHONE_PATTERNS = [/^\+27[6-8]\d{8}$/];

export function toE164Phone(value) {
  if (typeof value === "string" && value.includes("*")) {
    return value.trim();
  }
  const digits = String(value ?? "").replace(/\D/g, "");
  if (!digits) return "";
  return `+${digits}`;
}

export function isE164Phone(value) {
  if (typeof value === "string" && value.includes("*")) {
    return true;
  }
  const e164 = toE164Phone(value);
  return ALLOWED_PHONE_PATTERNS.some((pattern) => pattern.test(e164));
}

/** Country dial code only (e.g. +27) should count as empty for optional fields. */
export function normalizeOptionalE164Phone(value) {
  if (typeof value === "string" && value.includes("*")) {
    return value.trim();
  }
  const e164 = toE164Phone(value);
  const digits = e164.replace(/\D/g, "");
  if (digits.length <= 4) return "";
  return e164;
}
