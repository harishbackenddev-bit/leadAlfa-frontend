import React from "react";
import { useNavigate } from "react-router-dom";
import bannerImage from "../../../../assets/images/campaign/bannerImage.jpg";

export default function CampaignViewHeader({
  breadcrumbs = [],
  title,
  bannerImg,
  brandLogo,
  brandName,
  isVerified = false,
  budget,
  daysLeft,
  onApplyNow,
}) {
  const navigate = useNavigate();

  return (
    <div className="bg-white">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              )}
              {crumb.link ? (
                <button
                  onClick={() => navigate(crumb.link)}
                  className="hover:text-[#096a9a] transition-colors"
                >
                  {crumb.label}
                </button>
              ) : (
                <span
                  className={
                    index === breadcrumbs.length - 1
                      ? "text-[#0c7bb3] font-medium"
                      : ""
                  }
                >
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>

        <div className="flex items-start justify-between mb-6">
          <h1 className="text-2xl lg:text-3xl font-extrabold font-anton text-gray-900">
            {title}
          </h1>
          <button
            onClick={onApplyNow}
            className="main-btn text-white font-semibold md:px-6 md:py-3 px-4 py-2 rounded-full text-base transition-colors whitespace-nowrap"
          >
            Apply Now
          </button>
        </div>

        <div className="relative w-full h-64 rounded-xl overflow-hidden mb-4">
          <img
            src={bannerImg || bannerImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          {daysLeft && (
            <div className="absolute top-3 right-3 bg-blue-200 text-[#0c7bb3] px-2.5 py-2.5 rounded-lg">
              <div className="text-2xl text-center font-extrabold tracking-tighter">
                {daysLeft}
              </div>
              <div className="text-xs font-medium text-gray-800">Days Left</div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {brandLogo && (
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={brandLogo}
                  alt={brandName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black font-anton text-gray-900">
                {brandName}
              </h2>
              {isVerified && (
                <svg
                  className="w-5 h-5 text-[#0c7bb3]"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          </div>
          {budget && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">
                Budget
              </span>
              <span className="text-xl tracking-tighter font-extrabold text-[#0c7bb3]">
                {budget}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
