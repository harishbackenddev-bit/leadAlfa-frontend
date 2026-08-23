import { creatorSelectOptions } from "../../../../data/creatorSignupOptions";

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

const formatBoolean = (value) => {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "—";
};

const humanizeValue = (value) =>
  String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

const optionLabel = (value, options = []) => {
  if (value === null || value === undefined || value === "") return "";
  const match = options.find((option) => option.value === value);
  return match?.label || humanizeValue(value);
};

const formatSelectValues = (values, options = []) =>
  toArray(values).map((value) => optionLabel(value, options)).filter(Boolean);

const normalizeStatus = (status) => {
  const value = String(status || "pending").trim().toLowerCase();
  if (value === "clarify" || value === "clarification_requested") {
    return "clarification_requested";
  }
  return value;
};

const formatFollowers = (followers) => {
  if (followers === null || followers === undefined || followers === "") return "—";
  if (typeof followers === "string") return followers;
  if (typeof followers !== "number") return "—";

  if (followers >= 1000000) return `${(followers / 1000000).toFixed(1)}M`;
  if (followers >= 1000) return `${(followers / 1000).toFixed(1)}K`;
  return String(followers);
};

const buildLegalName = (item) => {
  const firstName = get(item, ["firstName", "user.firstName", "user.firstname"], "");
  const lastName = get(item, ["lastName", "user.lastName", "user.lastname"], "");
  return `${firstName} ${lastName}`.trim();
};

const buildName = (item) => {
  const publicName = get(item, ["publicName"]);
  if (publicName) return publicName;

  const directName = get(item, ["name", "fullName", "displayName", "creatorName"]);
  if (directName) return directName;

  const legalName = buildLegalName(item);
  return legalName || "Unknown Creator";
};

const mapMediaAsset = (asset, fallbackName, fallbackType = "document") => {
  const details = asset?.mediaDetails || asset;
  if (!details?.url) return null;

  return {
    name: get(details, ["name", "fileName", "originalName"], fallbackName),
    type: get(details, ["type", "mimeType"], fallbackType),
    url: get(details, ["url", "fileUrl", "path"], "#"),
  };
};

const buildPortfolioFiles = (raw) => {
  const files = [];
  const media = raw?.media || {};

  const introVideo = mapMediaAsset(media.introVideo, "Intro Video", "video");
  if (introVideo) files.push(introVideo);

  toArray(media.portfolio).forEach((item, index) => {
    const mapped = mapMediaAsset(item, `Portfolio ${index + 1}`, "video");
    if (mapped) files.push(mapped);
  });

  toArray(get(raw, ["portfolio.files", "files", "documents"], [])).forEach((file) => {
    const url = get(file, ["url", "fileUrl", "path"], "");
    if (!url) return;

    files.push({
      name: get(file, ["name", "fileName", "originalName"], "Document"),
      type: get(file, ["type", "mimeType"], "document"),
      url,
    });
  });

  return files;
};

const buildIdentityDocuments = (raw) => {
  const documents = [];
  const media = raw?.media || {};

  const residencePermit = mapMediaAsset(media.residencePermit, "Residence Permit", "document");
  if (residencePermit) documents.push(residencePermit);

  const profilePhoto = mapMediaAsset(media.profilePhoto, "Profile Photo", "document");
  if (profilePhoto) documents.push(profilePhoto);

  toArray(get(raw, ["identityVerification.documents", "identityDocuments"], [])).forEach((file) => {
    const url = get(file, ["url", "fileUrl", "path"], "");
    if (!url) return;

    documents.push({
      name: get(file, ["name", "fileName", "originalName"], "Document"),
      type: get(file, ["type", "mimeType"], "document"),
      url,
    });
  });

  return documents;
};

export const normalizeCreatorRequest = (item) => {
  const id = String(get(item, ["id", "creatorProfileId", "profileId", "requestId"], ""));

  return {
    id,
    type: "creator",
    roleLabel: "Creator",
    name: buildName(item),
    channel: get(item, ["publicName", "channel", "username", "handle", "socialHandle"], "—"),
    email: get(item, ["email", "user.email"], "—"),
    country: get(
      item,
      ["country", "location.country", "address.country", "province"],
      item?.province ? "South Africa" : "—"
    ),
    followers: formatFollowers(
      get(item, ["followers", "followerCount", "followersCount", "social.followers"])
    ),
    status: normalizeStatus(get(item, ["status"], "pending")),
    date: formatDate(get(item, ["createdAt", "appliedOn", "submittedAt", "date"])),
    raw: item,
  };
};

export const extractCreatorRequestsResponse = (response, fallbackPage = 1, fallbackLimit = 10) => {
  const list = Array.isArray(response)
    ? response
    : Array.isArray(response?.items)
    ? response.items
    : Array.isArray(response?.data)
    ? response.data
    : Array.isArray(response?.creatorProfiles)
    ? response.creatorProfiles
    : Array.isArray(response?.profiles)
    ? response.profiles
    : Array.isArray(response?.requests)
    ? response.requests
    : [];

  const items = list.map(normalizeCreatorRequest).filter((item) => item.id);

  const meta = response?.pagination || response?.meta || response || {};
  const page = Number(meta.page || meta.currentPage || fallbackPage) || fallbackPage;
  const limit = Number(meta.limit || meta.pageSize || fallbackLimit) || fallbackLimit;
  const total = Number(meta.total || meta.totalCount || items.length) || items.length;
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

export const extractCreatorRequestDetailResponse = (response) => {
  if (!response) return null;

  if (Array.isArray(response)) {
    return response[0] || null;
  }

  return (
    response?.item ||
    response?.data ||
    response?.profile ||
    response?.creatorProfile ||
    response?.request ||
    response
  );
};

const toLabelValue = (obj = {}, fallback = "—") =>
  Object.entries(obj).map(([key, value]) => ({
    label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
    value: value === null || value === undefined || value === "" ? fallback : String(value),
  }));

const mapArrayToText = (value) =>
  toArray(value)
    .map((item) => {
      if (item === null || item === undefined) return "";
      if (typeof item === "string") return item.trim();
      if (typeof item === "number" || typeof item === "boolean") return String(item);

      return String(
        get(item, ["name", "label", "title", "value", "type", "slug"], "") || ""
      ).trim();
    })
    .filter(Boolean);

const joinValues = (values, fallback = "—") => {
  const text = mapArrayToText(values).join(", ");
  return text || fallback;
};

const buildSimpleSocialLinks = (raw) => {
  const links = [
    { platform: "Instagram", value: get(raw, ["instagramUrl"], ""), url: get(raw, ["instagramUrl"], "") },
    { platform: "TikTok", value: get(raw, ["tiktokUrl"], ""), url: get(raw, ["tiktokUrl"], "") },
    {
      platform: "YouTube",
      value: get(raw, ["youtubeChannelUrl", "youtubeUrl"], ""),
      url: get(raw, ["youtubeChannelUrl", "youtubeUrl"], ""),
    },
    {
      platform: "Skills / Portfolio",
      value: get(raw, ["skillsUrl", "portfolioUrl"], ""),
      url: get(raw, ["skillsUrl", "portfolioUrl"], ""),
    },
  ];

  return links.filter((item) => item.url);
};

const buildBasicInfo = (raw, row) => {
  const legalName = buildLegalName(raw);
  const publicName = get(raw, ["publicName"], "");
  const isSouthAfrican = get(raw, ["isSouthAfricanCitizen"], null);

  const items = [
    { label: "Public / Creator Name", value: publicName || row.name || "—" },
    { label: "Legal Name", value: legalName || "—" },
    { label: "Email", value: get(raw, ["email", "user.email"], row.email || "—") },
    { label: "Phone Number", value: get(raw, ["phoneNumber", "phone"], "—") },
    { label: "Date of Birth", value: formatDate(get(raw, ["dateOfBirth"], "")) },
    {
      label: "South African Citizen",
      value: isSouthAfrican === null ? "—" : formatBoolean(isSouthAfrican),
    },
  ];

  if (isSouthAfrican === true) {
    items.push({ label: "SA ID Number", value: get(raw, ["saIdNumber", "idNumber"], "—") });
  } else if (isSouthAfrican === false) {
    items.push({ label: "Passport Number", value: get(raw, ["passportNumber"], "—") });
  } else {
    items.push({
      label: "SA ID / Passport",
      value: get(raw, ["saIdNumber", "passportNumber", "idNumber"], "—"),
    });
  }

  items.push({ label: "Bio", value: get(raw, ["bio"], "—") });

  const rejectionReason = get(raw, ["rejectionReason"], "");
  if (rejectionReason) {
    items.push({ label: "Rejection Reason", value: rejectionReason });
  }

  return [...items, ...toLabelValue(get(raw, ["basicInfo"], {}))];
};

const buildLocationDetails = (raw) => {
  const hasSaLocation = Boolean(get(raw, ["province", "city", "streetNumber"], ""));

  return [
    {
      label: "Country",
      value: get(raw, ["country", "location.country", "address.country"], hasSaLocation ? "South Africa" : "—"),
    },
    { label: "Province", value: get(raw, ["province", "location.province"], "—") },
    { label: "City / Town", value: get(raw, ["city", "location.city", "address.city"], "—") },
    {
      label: "Street Address",
      value: get(raw, ["streetNumber", "addressLine1", "location.addressLine1"], "—"),
    },
    { label: "Street Address 2", value: get(raw, ["addressLine2", "location.addressLine2"], "—") },
    // { label: "Postal Code", value: get(raw, ["postalZipCode", "postalCode", "zipCode"], "—") },
    ...toLabelValue(get(raw, ["location", "address"], {})),
  ];
};

const buildContentNiche = (raw) => {
  const categoryNames = mapArrayToText(get(raw, ["categories"], []));
  const primaryNiches = mapArrayToText(get(raw, ["primaryNiches", "primaryNiche"], []));
  const secondaryNiches = mapArrayToText(get(raw, ["secondaryNiches", "secondaryNiche"], []));

  const primary =
    joinValues(primaryNiches, "") ||
    get(raw, ["primaryNiche", "contentNiche.primaryNiche"], "") ||
    primaryNiches[0] ||
    categoryNames[0] ||
    "—";

  const secondary =
    joinValues(secondaryNiches, "") ||
    get(raw, ["secondaryNiche", "contentNiche.secondaryNiche"], "") ||
    secondaryNiches[0] ||
    categoryNames[1] ||
    "—";

  const otherCategories = categoryNames.filter(
    (name) => !primaryNiches.includes(name) && !secondaryNiches.includes(name)
  );

  return {
    languages: formatSelectValues(
      get(raw, ["languages", "contentNiche.languages"], []),
      creatorSelectOptions.languageSpoken
    ),
    primaryNiche: primary,
    secondaryNiche: secondary,
    otherNiche: otherCategories.join(", ") || "—",
  };
};

const buildDemographics = (raw) => {
  if (Object.keys(get(raw, ["demographics"], {})).length > 0) {
    return toLabelValue(get(raw, ["demographics"], {}));
  }

  const appearance = formatSelectValues(
    get(raw, ["appearance"], []),
    creatorSelectOptions.appearance
  );

  return [
    {
      label: "Ethnicity",
      value: optionLabel(get(raw, ["ethnicity"], ""), creatorSelectOptions.ethnicity) || "—",
    },
    {
      label: "Appearance",
      value: appearance.length ? appearance.join(", ") : "—",
    },
    {
      label: "Gender",
      value: optionLabel(get(raw, ["gender"], ""), creatorSelectOptions.gender) || "—",
    },
    { label: "Has Pets", value: formatBoolean(get(raw, ["hasPets"], null)) },
    { label: "Has Children", value: formatBoolean(get(raw, ["hasChildren"], null)) },
    { label: "Age", value: get(raw, ["age"], null) === 0 ? "0" : String(get(raw, ["age"], "—")) },
  ];
};

export const mapCreatorRequestToDetails = (request) => {
  const row = request?.raw ? request : normalizeCreatorRequest(request || {});
  const raw = row.raw || {};

  const socialLinks = toArray(get(raw, ["socialLinks", "socialMedia", "socials"], []))
    .map((link) => ({
      platform: get(link, ["platform", "name", "type"], "Social"),
      value: get(link, ["handle", "username", "value"], "—"),
      url: get(link, ["url", "link"], "#"),
    }));

  const mergedSocialLinks = socialLinks.length ? socialLinks : buildSimpleSocialLinks(raw);
  const skillNames = mapArrayToText(get(raw, ["skills", "contentTypes", "skillsAndContentTypes"], []));
  const portfolioFiles = buildPortfolioFiles(raw);
  const identityDocuments = buildIdentityDocuments(raw);

  const isSouthAfrican = get(raw, ["isSouthAfricanCitizen"], null);
  const idNumber = isSouthAfrican
    ? get(raw, ["saIdNumber", "idNumber"], "—")
    : get(raw, ["passportNumber", "saIdNumber", "idNumber"], "—");

  const legalDeclarationsRaw = toArray(get(raw, ["legalDeclarations", "declarations"], []));
  const legalDeclarations = legalDeclarationsRaw
    .filter((item) => item?.accepted === true || item?.value === true)
    .map((item) => ({ label: get(item, ["label", "name"], "Declaration accepted"), accepted: true }));

  return {
    id: row.id,
    type: "creator",
    roleLabel: "Creator",
    name: row.name,
    email: row.email,
    appliedOn: row.date,
    status: row.status,
    basicInfo: buildBasicInfo(raw, row),
    locationDetails: buildLocationDetails(raw),
    contentNiche: buildContentNiche(raw),
    skillsAndContentTypes: skillNames,
    demographics: buildDemographics(raw),
    socialLinks: mergedSocialLinks,
    portfolio: {
      files: portfolioFiles,
      externalLink: get(
        raw,
        [
          "skillsUrl",
          "portfolio.externalLink",
          "portfolioLink",
          "externalPortfolioLink",
          "portfolioUrl",
        ],
        ""
      ),
    },
    identityVerification: {
      idNumber: idNumber || "—",
      isSouthAfricanCitizen: isSouthAfrican === null ? "—" : formatBoolean(isSouthAfrican),
      documents: identityDocuments,
    },
    taxInformation: toLabelValue(get(raw, ["taxInformation", "tax"], {})),
    legalDeclarations,
  };
};
