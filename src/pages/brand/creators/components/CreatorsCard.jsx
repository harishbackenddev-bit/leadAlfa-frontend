import React from "react";
import { Play, Star } from "lucide-react";
import { Button } from "../../../../components/ui/button";

const MAX_DESCRIPTION_WORDS = 18;
const MAX_TAGS = 3;

const truncateWords = (text = "", maxWords = MAX_DESCRIPTION_WORDS) => {
  const words = String(text).trim().split(/\s+/).filter(Boolean);
  if (words.length <= maxWords) return text;
  return `${words.slice(0, maxWords).join(" ")}...`;
};

const getDisplayName = (creator) =>
  creator?.raw?.publicName?.trim() || creator?.name || "Creator";

const getCity = (creator) =>
  creator?.raw?.city?.trim() ||
  creator?.location?.split(",")[0]?.trim() ||
  "Location N/A";

const getVideoPosterUrl = (videoUrl) => {
  if (!videoUrl?.includes("res.cloudinary.com")) return null;

  const uploadMarker = "/upload/";
  const uploadIndex = videoUrl.indexOf(uploadMarker);
  if (uploadIndex === -1) return null;

  const prefix = videoUrl.slice(0, uploadIndex + uploadMarker.length);
  const suffix = videoUrl.slice(uploadIndex + uploadMarker.length);
  const normalizedSuffix = suffix.replace(/\.(mp4|mov|webm)(\?.*)?$/i, ".jpg");

  return `${prefix}so_0,w_720,c_fill,f_jpg,q_auto/${normalizedSuffix}`;
};

const getHeroImage = (creator) => {
  const introUrl = creator?.raw?.media?.introVideo?.mediaDetails?.url;
  const introPoster = getVideoPosterUrl(introUrl);
  if (introPoster) return introPoster;

  const portfolioUrl = creator?.raw?.media?.portfolio?.[0]?.mediaDetails?.url;
  if (portfolioUrl) return portfolioUrl;

  if (creator?.avatar) return creator.avatar;

  return null;
};

const getIntroVideoUrl = (creator) =>
  creator?.raw?.media?.introVideo?.mediaDetails?.url || null;

export default function CreatorsCard({ creator, onViewDetails, onPlayVideo, onSendInvite }) {
  const displayName = getDisplayName(creator);
  const city = getCity(creator);
  const heroImage = getHeroImage(creator);
  const introVideoUrl = getIntroVideoUrl(creator);
  const hasAvatar = Boolean(creator?.avatar);
  const shortBio = truncateWords(creator?.bio || "");
  const tags = (creator?.categories?.length ? creator.categories : creator?.skills || []).slice(
    0,
    MAX_TAGS
  );

  const handlePlayClick = (event) => {
    event.stopPropagation();
    if (introVideoUrl) {
      onPlayVideo?.({ url: introVideoUrl, title: displayName });
    }
  };

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#e8edf3] bg-white shadow-[0_8px_24px_rgba(15,23,42,0.06)] transition-shadow hover:shadow-[0_12px_28px_rgba(15,23,42,0.1)] sm:p-3 sm:pb-0 p-2 pb-1">
      <div className="relative aspect-[16/12] w-full overflow-hidden bg-[#dbeafe] sm:aspect-[9/12] rounded-t-xl">
        {heroImage ? (
          <img src={heroImage} alt={displayName} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#0353a4] to-[#4b96e3]">
            <span className="text-4xl font-semibold text-white/90">{creator?.initials}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

        {introVideoUrl ? (
          <button
            type="button"
            onClick={handlePlayClick}
            className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#1E60DB] shadow-lg transition hover:scale-105 hover:bg-white"
            aria-label={`Play ${displayName} intro video`}
          >
            <Play className="ml-0.5 h-5 w-5 fill-current" />
          </button>
        ) : null}

        <button
          type="button"
          onClick={() => onViewDetails(creator.id)}
          className="absolute bottom-0 left-0 right-0 flex cursor-pointer items-center gap-3 px-4 pb-4 text-left transition hover:opacity-95"
          aria-label={`View ${displayName} profile`}
        >
          {hasAvatar ? (
            <img
              src={creator.avatar}
              alt={displayName}
              className="h-11 w-11 flex-shrink-0 rounded-full border-2 border-white object-cover shadow-md"
            />
          ) : (
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full border-2 border-white bg-gradient-to-b from-[#0353a4] to-[#4b96e3] text-sm font-semibold text-white shadow-md">
              {creator?.initials}
            </div>
          )}

          <div className="min-w-0">
            <h3 className="truncate font-['Manrope:SemiBold',sans-serif] text-[15px] font-semibold text-white">
              {displayName}
            </h3>
            <p className="truncate font-['Manrope:Regular',sans-serif] text-[13px] text-white/85">
              {city}
            </p>
          </div>
        </button>
      </div>

      <div className="flex flex-1 flex-col sm:pt-4 sm:pb-4">
        <div className="mb-3 flex items-center gap-1.5 text-[13px] text-[#64748b]">
          <Star className="h-4 w-4 fill-[#fbbf24] text-[#fbbf24]" />
          <span className="font-medium text-[#334155]">{creator?.raw?.rating ?? "New"}</span>
          <span className="text-[#94a3b8]">·</span>
          <span>{creator?.raw?.jobsCompleted ?? "0"} jobs</span>
        </div>

        <div className="mb-3 flex min-h-[28px] flex-wrap gap-2">
          {tags.length ? (
            tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#E0F2FE] px-3 py-1 font-['Manrope:Medium',sans-serif] text-[12px] font-medium text-[#0284C7]"
              >
                {tag}
              </span>
            ))
          ) : (
            <span className="rounded-full bg-[#f1f5f9] px-3 py-1 text-[12px] text-[#64748b]">
              No tags
            </span>
          )}
        </div>

        <p className="mb-5 line-clamp-2 flex-1 font-['Manrope:Regular',sans-serif] text-[13px] leading-5 text-[#475569]">
          {shortBio || "No bio available."}
        </p>

        <Button
          type="button"
          onClick={() => onSendInvite?.(creator.id)}
          className="h-12 w-full rounded-xl bg-gradient-to-b from-[#0353a4] to-[#4b96e3] font-['Manrope:SemiBold',sans-serif] text-[14px] font-semibold hover:bg-[#1a54c4]"
        >
          Invite to Campaign
        </Button>
      </div>
    </article>
  );
}
