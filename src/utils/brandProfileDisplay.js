const FALLBACK = "—";

function hasValue(value) {
  if (value == null) return false;
  if (typeof value === "string") return value.trim() !== "";
  return true;
}

function pickValue(...candidates) {
  for (const candidate of candidates) {
    if (hasValue(candidate)) return String(candidate).trim();
  }
  return FALLBACK;
}

function resolveCity(profile = {}) {
  if (hasValue(profile.cityOther)) return String(profile.cityOther).trim();
  if (hasValue(profile.city)) return String(profile.city).trim();
  return FALLBACK;
}

function formatAddress(profile = {}) {
  const line1 = pickValue(
    profile.addressLine1,
    profile.streetNumber,
    profile.location?.addressLine1,
    null
  );

  if (line1 === FALLBACK) return FALLBACK;

  const parts = [line1];
  if (hasValue(profile.addressLine2)) {
    parts.push(String(profile.addressLine2).trim());
  }

  return parts.join(", ");
}

function formatWebsite(profile = {}) {
  const raw = pickValue(
    profile.website,
    profile.companyWebsite,
    profile.companyUrl,
    null
  );

  if (raw === FALLBACK) return FALLBACK;
  return raw.replace(/^https?:\/\//i, "");
}

export function mapBrandProfileForDisplay(user, profile = {}) {
  const fullName = [user?.firstName, user?.lastName]
    .filter(hasValue)
    .join(" ")
    .trim();

  const address = formatAddress(profile);
  const region = pickValue(profile.country, profile.state, profile.province);

  return {
    personal: {
      name: fullName || FALLBACK,
      workEmail: pickValue(user?.email, profile.companyEmail),
      phoneNumber: pickValue(profile.phoneNumber, user?.phoneNumber),
      address,
      city: resolveCity(profile),
      state: region,
    },
    company: {
      companyName: pickValue(profile.companyName),
      companyWebsite: formatWebsite(profile),
      companyEmail: pickValue(profile.companyEmail, user?.email),
      address,
      state: region,
    },
  };
}

export { FALLBACK as BRAND_PROFILE_DISPLAY_FALLBACK };
