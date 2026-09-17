/** Cloudinary delivery tweaks — smaller files, faster starts, browser-cache friendly. */
const POSTER_TRANSFORMS = "so_0,w_720,c_fill,f_auto,q_auto";

function cloudinaryVideoToPoster(url) {
  if (!url?.includes("res.cloudinary.com")) return null;
  return url
    .replace("/video/upload/", `/video/upload/${POSTER_TRANSFORMS}/`)
    .replace(/\.(mp4|mov)$/i, ".jpg");
}

export function getPortfolioReelPosterFromSrc(src) {
  return src ? cloudinaryVideoToPoster(src) : null;
}
