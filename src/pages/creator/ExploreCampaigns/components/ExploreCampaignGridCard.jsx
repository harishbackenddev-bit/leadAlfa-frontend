import React from "react";
import { MapPin, Clock, User } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import starIcon from "../../../../assets/images/creator/ratingStar.svg";

const TAG_STYLES = [
  "bg-orange-50 text-orange-600",
  "bg-blue-50 text-blue-600",
  "bg-purple-50 text-purple-600",
  "bg-emerald-50 text-emerald-600",
];

export default function ExploreCampaignGridCard({
  campaign,
  onApplyClick,
  onViewDetailsClick,
  isApplied = false,
}) {
  const {
    id,
    title,
    description,
    image,
    tags,
    rating,
    jobsCompleted,
    location,
    ageRange,
    gender,
  } = campaign;

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
        <img src={image} alt={title} className="h-full w-full object-cover object-top" />
        <span className="absolute left-3 top-3 rounded-md bg-black/60 px-2 py-0.5 text-xs font-medium text-white">
          #{id}
        </span>
        {isApplied ? (
          <span className="absolute right-3 top-3 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 shadow-sm">
            Applied
          </span>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <h3 className="font-anton text-lg font-extrabold text-gray-900 sm:text-xl">
          {title}
        </h3>

        {(rating != null || jobsCompleted != null) && (
          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm">
            {rating != null && (
              <span className="inline-flex items-center gap-1 font-semibold text-gray-900">
                <img src={starIcon} alt="" className="h-4 w-4" aria-hidden />
                {Number(rating).toFixed(1)}
              </span>
            )}
            {jobsCompleted != null && (
              <span className="text-gray-500">
                {jobsCompleted} jobs completed
              </span>
            )}
          </div>
        )}

        {tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {tags.slice(0, 2).map((tag, index) => (
              <span
                key={tag}
                className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                  TAG_STYLES[index % TAG_STYLES.length]
                }`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {description && (
          <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
            {description}
          </p>
        )}

        <div className="mt-4 rounded-xl border border-gray-200 bg-gray-50/50 p-3">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-500">
            Target Audience
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-700">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-[#0c7bb3]" aria-hidden />
              {location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-[#0c7bb3]" aria-hidden />
              {ageRange}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[#0c7bb3]" aria-hidden />
              {gender}
            </span>
          </div>
        </div>

        <div className="mt-4 md:flex flex-col md:flex-row gap-2 md:space-y-0 space-y-2">
          {isApplied ? (
            <Button
              type="button"
              className="w-full rounded-xl btn-gradient text-sm font-semibold"
              onClick={() => onViewDetailsClick(id)}
            >
              View Detail
            </Button>
          ) : (
            <>
              <Button
                type="button"
                className="w-full block rounded-xl btn-gradient text-sm font-semibold"
                onClick={() => onApplyClick(id)}
              >
                Apply Now
              </Button>
              <Button
                type="button"
                variant="outline"
                className="w-full block rounded-xl border-[#0c7bb3] text-sm font-semibold text-[#0c7bb3] hover:bg-blue-50"
                onClick={() => onViewDetailsClick(id)}
              >
                View Detail
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
