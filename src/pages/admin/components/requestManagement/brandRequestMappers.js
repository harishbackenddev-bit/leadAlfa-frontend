import INDUSTRIES from "../../../../utils/industries";
import { inferMediaKind, resolveMediaUrl } from "../requestDetails/mediaUtils";

const toArray = (value) => (Array.isArray(value) ? value : []);

const get = (obj, paths, fallback = undefined) => {
  for (const path of paths) {
    const value = path.split(".").reduce((acc, part) => acc?.[part], obj);
    if (value !== undefined && value !== null && value !== "") return value;
  }
  return fallback;
};

const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
};

const humanizeValue = (value) =>
  String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const normalizeStatus = (status) => {
  const value = String(status || "pending").trim().toLowerCase();
  if (value === "clarify" || value === "clarification_requested") {
    return "clarification_requested";
  }
  return value;
};

const mapMediaAsset = (asset, fallbackName, fallbackType = "document") => {
  if (!asset) return null;
  const details = asset?.mediaDetails || asset;
  const url = resolveMediaUrl(details);
  if (!url) return null;

  const name = get(details, ["name", "fileName", "originalName"], fallbackName);
  const rawType = get(details, ["type", "mimeType"], fallbackType);

  return {
    name,
    type: inferMediaKind(rawType, url, name, fallbackType),
    url,
  };
};

const resolveIndustryLabel = (item) => {
  if (typeof item === "number") {
    return INDUSTRIES.find((industry) => industry.id === item)?.title || String(item);
  }

  if (typeof item === "string") {
    const numericId = Number(item);
    if (!Number.isNaN(numericId) && String(numericId) === item.trim()) {
      return INDUSTRIES.find((industry) => industry.id === numericId)?.title || item;
    }
    return item;
  }

  const label = get(item, ["title", "name", "label"], "");
  if (label) return label;

  const nestedId = get(item, ["id"], null);
  if (nestedId !== null && nestedId !== undefined) {
    return INDUSTRIES.find((industry) => industry.id === nestedId)?.title || String(nestedId);
  }

  return "";
};

const buildContactName = (userAccount = {}) => {
  const firstName = get(userAccount, ["firstName"], "");
  const lastName = get(userAccount, ["lastName"], "");
  return `${firstName} ${lastName}`.trim();
};

export const normalizeBrandRequest = (item) => {
  const userAccount = item?.userAccount || {};
  const contactName = buildContactName(userAccount);

  return {
    id: String(get(item, ["id", "brandProfileId", "profileId"], "")),
    type: "brand",
    roleLabel: "Brand",
    name: get(item, ["companyName"], contactName || "Unknown Brand"),
    email: get(item, ["companyEmail", "userAccount.email"], "—"),
    country: get(item, ["country"], "—"),
    status: normalizeStatus(get(item, ["status"], "pending")),
    date: formatDate(get(item, ["createdAt", "appliedOn", "submittedAt"], "")),
    raw: item,
  };
};

export const extractBrandRequestsResponse = (response, fallbackPage = 1, fallbackLimit = 10) => {
  const list = Array.isArray(response)
    ? response
    : Array.isArray(response?.items)
    ? response.items
    : Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response?.brandProfiles)
    ? response.brandProfiles
    : Array.isArray(response?.profiles)
    ? response.profiles
    : [];

  const items = list.map(normalizeBrandRequest).filter((item) => item.id);

  const meta = response?.pagination || response?.meta || response || {};
  const page = Number(meta.page || meta.currentPage || fallbackPage) || fallbackPage;
  const limit = Number(meta.limit || meta.pageSize || fallbackLimit) || fallbackLimit;
  const total = Number(meta.total || meta.totalItems || meta.totalCount || items.length) || items.length;
  const totalPages = Number(meta.totalPages || Math.max(1, Math.ceil(total / limit))) || 1;

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
};

export const extractBrandRequestDetailResponse = (response) => {
  if (!response) return null;

  if (Array.isArray(response)) {
    return response[0] || null;
  }

  return (
    response?.item ||
    response?.data ||
    response?.profile ||
    response?.brandProfile ||
    response?.request ||
    response
  );
};

const buildBasicInfo = (raw, row) => {
  const items = [
    { label: "Company Name", value: get(raw, ["companyName"], row.name || "—") },
    { label: "Company Email", value: get(raw, ["companyEmail"], row.email || "—") },
    { label: "Phone Number", value: get(raw, ["phoneNumber"], "—") },
    { label: "Website", value: get(raw, ["website"], "—") },
    {
      label: "Business Type",
      value: humanizeValue(get(raw, ["businessType"], "—")),
    },
    { label: "Job Role", value: get(raw, ["jobRole"], "—") },
    {
      label: "Registration Number",
      value: get(raw, ["companyRegistrationNumber"], "—"),
    },
    { label: "Bio", value: get(raw, ["bio"], "—") },
  ];

  const rejectionReason = get(raw, ["rejectionReason"], "");
  if (rejectionReason) {
    items.push({ label: "Rejection Reason", value: rejectionReason });
  }

  return items;
};

const buildLocationDetails = (raw) => [
  { label: "Country", value: get(raw, ["country"], "—") },
  { label: "City", value: get(raw, ["city"], "—") },
  { label: "Address Line 1", value: get(raw, ["addressLine1"], "—") },
  { label: "Address Line 2", value: get(raw, ["addressLine2"], "—") },
];

const buildContactPerson = (raw) => {
  const userAccount = raw?.userAccount || {};

  return [
    { label: "Contact Name", value: buildContactName(userAccount) || "—" },
    { label: "Contact Email", value: get(userAccount, ["email"], "—") },
  ];
};

const buildIndustryTags = (raw) => {
  const industries = toArray(get(raw, ["brandPrimaryIndustry"], []));
  return industries.map(resolveIndustryLabel).filter(Boolean);
};

const buildDocuments = (raw) => {
  const documents = [];
  const media = raw?.media || {};

  const logo = mapMediaAsset(media.logo, "Company Logo", "image");
  if (logo) documents.push(logo);

  const operatingAttachment = mapMediaAsset(
    media.operatingAttachment,
    "Operating Document",
    "document"
  );
  if (operatingAttachment) documents.push(operatingAttachment);

  return documents;
};

export const mapBrandRequestToDetails = (request) => {
  const row = request?.raw ? request : normalizeBrandRequest(request || {});
  const raw = row.raw || {};

  return {
    id: row.id,
    type: "brand",
    roleLabel: "Brand",
    name: row.name,
    email: row.email,
    appliedOn: row.date,
    status: row.status,
    basicInfo: buildBasicInfo(raw, row),
    locationDetails: buildLocationDetails(raw),
    contactPerson: buildContactPerson(raw),
    industries: buildIndustryTags(raw),
    documents: buildDocuments(raw),
  };
};
