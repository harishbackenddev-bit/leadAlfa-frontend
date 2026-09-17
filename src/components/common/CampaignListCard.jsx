import React from "react";
import { formatCampaignCompensation } from "../campaign/campaignViewUtils";

function budgetDisplayLabel(campaign) {
  if (typeof campaign?.budget === "string" && campaign.budget.trim()) {
    const s = campaign.budget.trim();
    return s.startsWith("$") ? s.replace(/^\$/, "R ").replace(/,/g, " ") : s;
  }
  return formatCampaignCompensation(campaign);
}

export default function CampaignListCard({
  campaign,
  onApplyClick,
  onViewDetailsClick,
  className = "",
}) {
  const {
    id,
    title,
    budget,
    originalPrice,
    description,
    image,
    isBoosted,
    boostedIcon,
  } = campaign;

  return (
    <div
      className={`bg-white border border-gray-200 rounded-xl sm:rounded-2xl overflow-hidden hover:shadow-md transition-all duration-200 ${className}`}
    >
      <div className="flex flex-col sm:flex-row gap-0 sm:gap-5 p-4 sm:p-5">
        {/* Image Section */}
        <div
          className="relative w-full sm:w-72 flex-shrink-0 rounded-lg sm:rounded-xl overflow-hidden bg-gray-100 mb-4 sm:mb-0"
          style={{ aspectRatio: "5 / 4" }}
        >
          <img src={image} alt={title} className="w-full h-full object-cover" />

          {/* Boosted Badge */}
          {isBoosted && (
            <div className="absolute top-2.5 left-2.5 bg-white text-blue-500 px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 shadow-sm">
              {boostedIcon && (
                <img src={boostedIcon} className="w-5 h-5" alt="Boosted" />
              )}
              Boosted
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Title */}
          <h2 className="font-extrabold text-lg sm:text-xl lg:text-2xl text-gray-900 mb-2 sm:mb-2.5">
            {title}
          </h2>

          {/* Budget (min–max Rand, or gift / legacy) */}
          <div className="flex items-baseline gap-2 mb-3 sm:mb-4 flex-wrap">
            <span className="text-xl sm:text-2xl lg:text-xl font-bold text-[#0c7bb3]">
              {budgetDisplayLabel(campaign)}
            </span>
            {originalPrice && (
              <span className="text-sm sm:text-base text-gray-400 line-through font-medium">
                {originalPrice}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-[13px] sm:text-sm text-gray-600 leading-relaxed mb-4 sm:mb-5 line-clamp-2 sm:line-clamp-3">
            {description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 mt-auto">
            <button
              onClick={() => onApplyClick(id)}
              className="w-full sm:w-auto main-btn text-white font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full text-sm sm:text-[15px] transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
            >
              Apply Now
            </button>
            <button
              onClick={() => onViewDetailsClick(id)}
              className="w-full sm:w-auto sec-btn font-semibold py-2.5 sm:py-3 px-6 sm:px-8 rounded-full text-sm sm:text-[15px] transition-all duration-200 cursor-pointer"
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
