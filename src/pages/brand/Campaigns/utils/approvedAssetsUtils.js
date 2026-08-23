import { getCreatorDisplayName } from "./brandSubmissionMapper";

export const USAGE_TYPE_FILTERS = [
  { key: "all", label: "All" },
  { key: "final_video", label: "Final Video" },
  { key: "raw_video", label: "Raw Video" },
  { key: "image", label: "Image" },
];

export const SORT_OPTIONS = [
  { key: "uploadedAt", label: "Uploaded Date" },
  { key: "approvedAt", label: "Approval Date" },
];

export const USAGE_TYPE_LABELS = {
  final_video: "Final Video",
  raw_video: "Raw Video",
  image: "Image",
};

const DEFAULT_PAGINATION = {
  totalItems: 0,
  totalPages: 1,
  currentPage: 1,
};

function formatDisplayDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getMediaKind(media = {}, assetType = "") {
  const mime = String(media?.type || "").toLowerCase();
  const usage = String(assetType || "").toLowerCase();
  if (mime.startsWith("video/") || usage.includes("video")) return "video";
  if (mime.startsWith("image/") || usage === "image") return "image";
  return "unknown";
}

function getFileTypeLabel(media = {}, assetType = "") {
  const mime = String(media?.type || "").toLowerCase();
  if (mime.includes("mp4")) return "MP4";
  if (mime.includes("png")) return "PNG";
  if (mime.includes("jpeg") || mime.includes("jpg")) return "JPG";
  if (mime.includes("webp")) return "WEBP";
  if (mime.includes("video")) return "VIDEO";
  if (mime.includes("image")) return "IMAGE";
  if (assetType === "image") return "IMAGE";
  if (assetType?.includes("video")) return "VIDEO";
  return "FILE";
}

export function parseApprovedAssetsResponse(response) {
  return {
    assets: Array.isArray(response?.assets) ? response.assets : [],
    pagination: {
      ...DEFAULT_PAGINATION,
      ...(response?.pagination || {}),
    },
  };
}

export function mapApiApprovedAsset(asset) {
  const media = asset?.media || {};
  const creatorName = getCreatorDisplayName(asset?.creator || {});
  const mediaKind = getMediaKind(media, asset?.assetType);

  return {
    id: asset?.assetPublicId || media?.url || asset?.assetName,
    assetPublicId: asset?.assetPublicId,
    title: asset?.assetName || media?.name || "Untitled asset",
    creatorName,
    creatorPublicId: asset?.creator?.publicId,
    fileType: getFileTypeLabel(media, asset?.assetType),
    assetType: asset?.assetType,
    assetTypeLabel:
      USAGE_TYPE_LABELS[asset?.assetType] || asset?.assetType || "Asset",
    mediaKind,
    mediaUrl: media?.url || null,
    mediaName: media?.name || asset?.assetName || "download",
    mediaType: media?.type || null,
    uploadedAt: formatDisplayDate(asset?.uploadedAt),
    approvedDate: formatDisplayDate(asset?.revision?.approvedAt),
    submissionPublicId: asset?.submission?.publicId,
    revisionPublicId: asset?.revision?.publicId,
  };
}

export function getApprovedAssetsEmptyMessage({
  usageType,
  search,
} = {}) {
  if (search) {
    return `No assets matching '${search}'. Try a different name.`;
  }
  if (usageType && USAGE_TYPE_LABELS[usageType]) {
    return `No approved ${USAGE_TYPE_LABELS[usageType]} assets found.`;
  }
  return "No approved assets yet for this campaign.";
}

function sanitizeFileName(name) {
  const trimmed = String(name || "download").trim() || "download";
  return trimmed.replace(/[<>:"/\\|?*\u0000-\u001F]/g, "_");
}

function getCloudinaryAttachmentUrl(url, fileName) {
  if (!url?.includes("res.cloudinary.com") || !url.includes("/upload/")) {
    return null;
  }

  const safeName = sanitizeFileName(fileName);
  return url.replace(/\/upload\//, `/upload/fl_attachment:${safeName}/`);
}

function triggerFileDownload(href, fileName) {
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName;
  link.rel = "noopener noreferrer";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export async function downloadApprovedAsset(asset) {
  if (!asset?.mediaUrl) return;

  const fileName = sanitizeFileName(
    asset.mediaName || asset.title || "download"
  );
  const mediaUrl = asset.mediaUrl;
  let objectUrl = null;

  try {
    const response = await fetch(mediaUrl, { mode: "cors" });
    if (!response.ok) {
      throw new Error("Failed to download file.");
    }

    const blob = await response.blob();
    objectUrl = URL.createObjectURL(blob);
    triggerFileDownload(objectUrl, fileName);
    return;
  } catch {
    const attachmentUrl = getCloudinaryAttachmentUrl(mediaUrl, fileName);
    if (attachmentUrl) {
      triggerFileDownload(attachmentUrl, fileName);
      return;
    }

    throw new Error("Unable to download this file. Please try again.");
  } finally {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  }
}
