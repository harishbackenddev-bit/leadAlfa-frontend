import {
  platformOptions,
  locationOptions,
  selectOptions,
} from "./campaignFormOptions";

/** Normalize for comparison: lowercase, trim, unify dashes/spaces */
export function normalizeMatchString(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\u2013|\u2014|\u2212/g, "-")
    .replace(/\s+/g, " ");
}

/** Unwrap API scalars: `{ value }`, `{ label }`, `{ name }`, JSON strings, plain strings */
export function scalarFromApi(raw) {
  if (raw === undefined || raw === null) return "";
  if (typeof raw === "number" || typeof raw === "boolean") return String(raw);
  if (typeof raw === "string") {
    const t = raw.trim();
    if (!t) return "";
    if ((t.startsWith("{") && t.endsWith("}")) || (t.startsWith("[") && t.endsWith("]"))) {
      try {
        return scalarFromApi(JSON.parse(t));
      } catch {
        return t;
      }
    }
    return t;
  }
  if (typeof raw === "object") {
    if (raw.value !== undefined && raw.value !== null)
      return scalarFromApi(raw.value);
    if (raw.label !== undefined && raw.label !== null)
      return scalarFromApi(raw.label);
    if (raw.name !== undefined && raw.name !== null) return scalarFromApi(raw.name);
  }
  return String(raw).trim();
}

/** Platform / location may arrive as JSON string or single scalar */
export function coerceToArray(raw) {
  if (raw === undefined || raw === null || raw === "") return [];
  if (Array.isArray(raw)) return raw.filter((x) => x !== undefined && x !== null);
  if (typeof raw === "string") {
    const t = raw.trim();
    if (t.startsWith("[") && t.endsWith("]")) {
      try {
        const p = JSON.parse(t);
        return Array.isArray(p) ? p : p != null ? [p] : [];
      } catch {
        return t ? [t] : [];
      }
    }
    return t ? [raw] : [];
  }
  return [raw];
}

/** First element if API sent an array / JSON array string; else the scalar */
export function firstCoercedFromApi(value) {
  const list = coerceToArray(value);
  if (list.length) return list[0];
  if (value === undefined || value === null) return "";
  if (typeof value === "string" && !value.trim()) return "";
  return value;
}

/**
 * Map API string to Radix Select `value` — exact value, exact/normalized label, fuzzy label.
 */
export function resolveOptionValue(options = [], stored) {
  const scalar = scalarFromApi(stored);
  if (scalar === undefined || scalar === null || String(scalar).trim() === "") {
    return "";
  }
  const raw = String(scalar).trim();

  const byStrictValue = options.find((o) => String(o.value) === raw);
  if (byStrictValue) return String(byStrictValue.value);

  const norm = normalizeMatchString(raw);

  const byExactLabel = options.find((o) => normalizeMatchString(o.label) === norm);
  if (byExactLabel) return String(byExactLabel.value);

  const byExactValue = options.find((o) => normalizeMatchString(o.value) === norm);
  if (byExactValue) return String(byExactValue.value);

  const byLooseLabel = options.find(
    (o) =>
      normalizeMatchString(o.label).includes(norm) ||
      norm.includes(normalizeMatchString(o.label))
  );
  if (byLooseLabel) return String(byLooseLabel.value);

  return "";
}

export function resolveDeliverablesValue(stored) {
  const direct = resolveOptionValue(selectOptions.deliverables, stored);
  if (direct) return direct;
  const n = normalizeMatchString(stored);
  if (!n) return "";
  if (n.includes("carousel") && n.includes("reel")) return "carousel_reel";
  if (
    ((n.includes("2") || n.includes("two")) && n.includes("reel")) ||
    /\b2\s*x\b.*reel\b/.test(n)
  )
    return "double_reel";
  if (n.includes("story")) return "video_story_bundle";
  if (n.includes("video") || n.includes("9:16") || n.includes("vertical")) return "video_1_short";
  return "";
}

/** Instagram Reels, YouTube Shorts, plain API labels → internal option values */
export function mapPlatformApiToValues(apiValues) {
  const list = coerceToArray(apiValues);
  const out = [];
  for (const entry of list) {
    const token = scalarFromApi(entry);
    const n = normalizeMatchString(token);
    if (!n) continue;
    let v = "";

    if (n.includes("tiktok")) v = "tiktok";
    else if (n.includes("instagram")) v = "instagram";
    else if (n.includes("twitter") || n.includes("x /") || /\bx\b/.test(n)) v = "x";
    else if (n.includes("linkedin")) v = "linkedin";
    else if (n.includes("youtube")) v = "youtube";
    else v = resolveOptionValue(platformOptions, token);

    if (v && !out.includes(v)) out.push(v);
  }
  return out;
}

export function resolveLocationValue(stored) {
  const list = coerceToArray(stored);
  if (!list.length) return "";
  const first = list[0];
  const v = resolveOptionValue(locationOptions, first);
  if (v) return v;

  const n = normalizeMatchString(scalarFromApi(first));
  if (n.includes("united states") || n === "us") return "US";
  if (n.includes("united kingdom") || n.includes("uk") || n === "gb") return "GB";
  if (n.includes("canada") || n === "ca") return "CA";
  if (n.includes("australia") || n === "au") return "AU";
  if (n.includes("india") || n === "in") return "IN";

  const globalMatch = locationOptions.find((o) => o.value === "GLOBAL");
  return globalMatch ? globalMatch.value : "";
}

/** Coerce booleans/strings from API → "yes" | "no" for form radios */
export function parsePetsRequired(campaign) {
  const raw = campaign?.petsRequired;
  if (raw === true) return "yes";
  if (raw === false) return "no";
  const s = String(raw ?? "")
    .trim()
    .toLowerCase();
  if (s === "true" || s === "yes") return "yes";
  if (s === "false" || s === "no") return "no";
  return "no";
}

/** When API saves internal slugs (`paid_90`) unchanged, keep them mapped to selects */
export function resolveNumberCreators(formValue) {
  const s = scalarFromApi(formValue);
  if (s === "" || s === undefined) return "";
  return resolveOptionValue(selectOptions.numberOfCreators, s);
}
