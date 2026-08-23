import React from "react";
import { Star } from "lucide-react";

const StatItem = ({ label, value }) => (
  <div className="min-w-0">
    <p className="mb-1 font-['Manrope:Medium',sans-serif] text-[12px] font-medium text-[#64748b]">
      {label}
    </p>
    <p className="font-['Manrope:SemiBold',sans-serif] text-[14px] font-semibold text-[#1a1a1a] break-words">
      {value}
    </p>
  </div>
);

export default function CreatorHeader({ creator }) {
  const {
    name,
    legalName,
    image,
    bio,
    verified,
    initials,
    stats = [],
    rating,
    reviewCount,
  } = creator;

  const hasImage = Boolean(image);
  const showRating = rating !== null && rating !== undefined;
  const showReviews = reviewCount !== null && reviewCount !== undefined;

  return (
    <div className="px-4 py-5 sm:px-6 sm:py-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {hasImage ? (
          <img
            src={image}
            alt={name}
            className="h-20 w-20 flex-shrink-0 rounded-full object-cover sm:h-24 sm:w-24"
          />
        ) : (
          <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-b from-[#0353a4] to-[#4b96e3] text-xl font-semibold text-white sm:h-24 sm:w-24">
            {initials || "NA"}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h2 className="font-['Manrope:Bold',sans-serif] text-[22px] font-bold text-[#1a1a1a] sm:text-[24px]">
              {name}
            </h2>
            {verified ? (
              <span className="rounded-full bg-[#e8f1fd] px-2 py-0.5 text-[11px] font-medium text-[#1E60DB]">
                Verified
              </span>
            ) : null}
          </div>

          {legalName ? (
            <p className="mb-2 text-[13px] text-[#64748b]">Legal name: {legalName}</p>
          ) : null}

          {(showRating || showReviews) && (
            <div className="mb-3 flex items-center gap-2">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className={`h-4 w-4 ${
                      showRating && index < Math.round(rating)
                        ? "fill-[#fbbf24] text-[#fbbf24]"
                        : "fill-[#e2e8f0] text-[#e2e8f0]"
                    }`}
                  />
                ))}
              </div>
              {showRating ? (
                <span className="font-['Manrope:SemiBold',sans-serif] text-[14px] font-semibold text-[#1a1a1a]">
                  {rating}
                </span>
              ) : null}
              {showReviews ? (
                <span className="text-[13px] text-[#64748b]">({reviewCount} reviews)</span>
              ) : null}
            </div>
          )}

          {bio ? (
            <p className="mb-5 font-['Manrope:Regular',sans-serif] text-[14px] leading-6 text-[#475569]">
              {bio}
            </p>
          ) : null}

          {stats.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-3 lg:grid-cols-5">
              {stats.map((stat) => (
                <StatItem key={stat.label} label={stat.label} value={stat.value} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
