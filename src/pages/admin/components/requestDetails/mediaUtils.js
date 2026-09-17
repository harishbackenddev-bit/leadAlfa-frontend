import { getVideoPosterUrl } from "../../../brand/creators/creatorMappers";

export const resolveMediaUrl = (details) => {
  if (!details) return "";
  return details.secureUrl || details.url || details.fileUrl || details.path || "";
};

export const inferMediaKind = (type, url, name, fallbackType = "document") => {
  const typeStr = String(type || "").toLowerCase();
  const path = String(url || name || "")
    .split("?")[0]
    .toLowerCase();

  if (typeStr.includes("pdf") || /\.pdf$/i.test(path)) {
    return "document";
  }

  if (
    typeStr.includes("document") ||
    typeStr.includes("msword") ||
    typeStr.includes("wordprocessingml") ||
    typeStr.includes("excel") ||
    typeStr.includes("spreadsheetml") ||
    /\.(doc|docx|xls|xlsx|csv|txt|rtf|zip)$/i.test(path)
  ) {
    return "document";
  }

  if (typeStr.includes("video") || /\.(mp4|webm|ogg|mov|avi|m4v)$/i.test(path)) {
    return "video";
  }

  if (typeStr.includes("image") || /\.(jpg|jpeg|png|gif|webp|svg|bmp)$/i.test(path)) {
    return "image";
  }

  if (fallbackType === "video" || fallbackType === "image") return fallbackType;
  return "document";
};

export const toFullSizeImageUrl = (url) => {
  if (!url?.includes("res.cloudinary.com")) return url;

  const uploadMarker = "/upload/";
  const uploadIndex = url.indexOf(uploadMarker);
  if (uploadIndex === -1) return url;

  const prefix = url.slice(0, uploadIndex + uploadMarker.length);
  const rest = url.slice(uploadIndex + uploadMarker.length);
  const slashIndex = rest.indexOf("/");
  if (slashIndex === -1) return url;

  const transforms = rest.slice(0, slashIndex);
  const assetPath = rest.slice(slashIndex + 1);
  const kept = transforms
    .split(",")
    .filter(
      (part) =>
        part &&
        !/^w_\d+$/.test(part) &&
        !/^h_\d+$/.test(part) &&
        !/^c_/.test(part)
    )
    .join(",");

  return kept ? `${prefix}${kept}/${assetPath}` : `${prefix}${assetPath}`;
};

export const normalizeMediaGridItem = (file, index = 0) => {
  const kind = inferMediaKind(file?.type, file?.url, file?.name);
  const isVideo = kind === "video";

  return {
    id: `${file?.name || "media"}-${index}`,
    kind,
    title: file?.name || "Media",
    url: file?.url,
    previewUrl: isVideo
      ? getVideoPosterUrl(file?.url) || file?.url
      : toFullSizeImageUrl(file?.url),
  };
};
