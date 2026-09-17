export function formatProposalAmount(amount) {
  const num = Number(amount);
  if (Number.isNaN(num)) return "—";
  return `R ${num.toLocaleString("en-ZA").replace(/,/g, " ")}`;
}

export function capitalizeCreatorName(name) {
  if (!name) return "";
  return String(name)
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export function formatMediaBytes(bytes) {
  if (!bytes || Number.isNaN(Number(bytes))) return null;
  const num = Number(bytes);
  if (num < 1024) return `${num} B`;
  if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
  return `${(num / 1024 / 1024).toFixed(1)} MB`;
}

export function getVideoPitchMedia(applicationMedia) {
  return (applicationMedia || []).find((m) => m.usageType === "video_pitch");
}

export function parseApplicantsResponse(response) {
  if (Array.isArray(response)) return response;
  return (
    response?.applicants ||
    response?.applications ||
    response?.data?.applicants ||
    response?.data?.applications ||
    []
  );
}

export function getProposalCounts(proposals) {
  return {
    all: proposals.length,
    pending: proposals.filter((p) => p.status === "pending").length,
    rejected: proposals.filter((p) => p.status === "rejected").length,
  };
}

export function getAcceptedCreatorCounts(applicants) {
  const accepted = applicants.filter(
    (app) => mapApiApplicationToProposal(app).status === "accepted"
  );
  return { all: accepted.length };
}

export function filterProposalsByStatus(proposals, filter) {
  if (!filter || filter === "all") return proposals;
  return proposals.filter((p) => p.status === filter);
}

export function filterPendingProposals(proposals) {
  return proposals.filter((p) => p.status === "pending" || p.status === "rejected");
}

export function getPendingProposalBadgeCount(applicants) {
  return applicants.filter((app) => {
    const status = String(
      app?.applicationStatus || app?.status || ""
    ).toLowerCase();
    return status === "pending" || status === "applied";
  }).length;
}

function humanizeNiche(value) {
  if (!value) return "";
  return String(value)
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toNicheLabels(value) {
  if (!value) return [];
  const items = Array.isArray(value) ? value : [value];
  return items
    .map((item) => {
      if (typeof item === "string") return humanizeNiche(item.trim());
      if (item?.name) return String(item.name).trim();
      if (item?.label) return String(item.label).trim();
      return "";
    })
    .filter(Boolean);
}

export function getCreatorNicheTags(creator = {}) {
  const tags = [
    ...toNicheLabels(creator.primaryNiches ?? creator.primaryNiche),
    ...toNicheLabels(creator.secondaryNiches ?? creator.secondaryNiche),
    ...toNicheLabels(creator.niches),
    ...toNicheLabels(
      Array.isArray(creator.categories)
        ? creator.categories.map((item) => item?.name ?? item)
        : []
    ),
  ];
  return [...new Set(tags)];
}

export function getCreatorLocation(creator = {}) {
  const city = String(creator.city || "").trim();
  const country = String(creator.country || creator.countryCode || "").trim();
  const location = [city, country].filter(Boolean).join(", ");
  return location || "—";
}

export function mapApiApplicationToProposal(app) {
  const creator = app?.creator || {};
  const first = String(creator.firstName || "").trim();
  const last = String(creator.lastName || "").trim();
  const name =
    capitalizeCreatorName(`${first} ${last}`.trim()) || "Unnamed creator";
  const statusRaw = String(
    app?.applicationStatus || app?.status || "pending"
  ).toLowerCase();

  let status = "pending";
  if (statusRaw === "accepted" || statusRaw === "approved") status = "accepted";
  else if (statusRaw === "rejected" || statusRaw === "declined") {
    status = "rejected";
  }

  return {
    id: String(app.id),
    status,
    name,
    handle: creator.username ? `@${creator.username}` : "",
    initials: `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "CR",
    rating: creator.rating ?? creator.averageRating ?? 0,
    jobsDone: creator.jobsCompleted ?? creator.jobs ?? 0,
    location: getCreatorLocation(creator),
    tags: getCreatorNicheTags(creator),
    bio: creator.bio || "",
    pitch: app.pitch || "",
    applicationId: app.id,
    creatorId: creator.id,
    applicationMedia: app.applicationMedia || [],
    raw: app,
  };
}

export function mapApiApplicationToCreator(app) {
  const proposal = mapApiApplicationToProposal(app);
  return {
    id: proposal.creatorId || proposal.id,
    applicationId: proposal.applicationId,
    name: proposal.name,
    handle: proposal.handle,
    initials: proposal.initials,
    status: "hired",
    rating: proposal.rating,
    jobsDone: proposal.jobsDone,
    deliverables: "—",
    deadline: "—",
    raw: app,
  };
}

export function mapAcceptedApplicantsToCreators(applicants) {
  return applicants
    .filter((app) => mapApiApplicationToProposal(app).status === "accepted")
    .map(mapApiApplicationToCreator);
}
