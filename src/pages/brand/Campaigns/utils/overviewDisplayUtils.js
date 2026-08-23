export const NOT_PROVIDED = "Not provided";

export function isPresent(value) {
  if (value == null) return false;
  if (typeof value === "string") {
    const trimmed = value.trim();
    return trimmed.length > 0 && trimmed !== "—" && trimmed !== NOT_PROVIDED;
  }
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function formatOverviewValue(value, { fromApi = false, fallback = NOT_PROVIDED } = {}) {
  if (isPresent(value)) return value;
  return fromApi ? fallback : value ?? fallback;
}

export function mapApiAddOns(addOns = []) {
  if (!Array.isArray(addOns)) return [];
  return addOns
    .filter((item) => item != null && String(item).trim() !== "")
    .map((item) =>
      typeof item === "string"
        ? { title: item, description: "", pricingDetail: "", percent: "" }
        : {
            title: item.title || item.name || NOT_PROVIDED,
            description: item.description || "",
            pricingDetail: item.pricingDetail || "",
            percent: item.percent || "",
          }
    );
}
