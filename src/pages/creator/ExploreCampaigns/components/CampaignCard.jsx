import React from "react";
import BoostedIcon from "../../../../assets/SVGs/creator/boostedIcon";
export default function CampaignCard({
  campaign,
  onApplyClick,
  onViewDetailsClick,
  applyLabel = "Apply Now",
  viewLabel = "View Details",
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="relative h-40 sm:h-55 bg-gray-100 flex-shrink-0">
        {campaign.media ? (
          campaign.mediaType === "video" ? (
            <video
              src={campaign?.media}
              poster={campaign?.media}
              className="w-full h-full object-cover"
              muted
              playsInline
            />
          ) : (
            <img
              src={campaign.media}
              alt={campaign.title}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-[#0c7bb3]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
        )}

        {campaign.isBookmarked && (
          <div className="absolute top-2 left-2 bg-white text-blue-500 px-1.5 py-1.5 rounded-sm text-xs flex items-center gap-0.5">
            <BoostedIcon className="w-5 h-5" />
            Boosted
          </div>
        )}
      </div>

      <div className="p-3 sm:p-4 lg:p-5 flex flex-col flex-1">
        <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-1.5 sm:mb-2 line-clamp-2">
          {campaign.title}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2 flex-1">
          {campaign.description}
        </p>
        {campaign.tags && campaign.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3 sm:mb-4">
            {campaign.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 sm:px-3 py-0.5 sm:py-1 bg-gray-100 text-gray-700 text-[10px] sm:text-xs rounded-full whitespace-nowrap"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-auto">
          {onApplyClick && (
            <button
              onClick={() => onApplyClick(campaign.id)}
              className="w-full sm:flex-1 main-btn font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-full text-xs sm:text-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              {applyLabel}
            </button>
          )}
          {onViewDetailsClick && (
            <button
              onClick={() => onViewDetailsClick(campaign.id)}
              className="w-full sm:flex-1 sec-btn font-semibold py-2 sm:py-2.5 px-3 sm:px-4 rounded-full text-xs sm:text-sm transition-colors whitespace-nowrap cursor-pointer"
            >
              {viewLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
