import React from "react";
import { useNavigate } from "react-router-dom";
import starSvg from "../../../../assets/SVGs/creator/star.svg";
import bannerShape from "../../../../assets/SVGs/creator/bannerShape.png";

export default function CampaignBanner({
  subtitle = "Apply For Collaborations",
  title = "Get matched with brands in your city.",
  buttonLabel = "Explore Collabs",
  buttonRoute = "/creator/campaigns",
}) {
  const navigate = useNavigate();

  return (
    <div
      className="relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 my-6"
      style={{
        background:
          "linear-gradient(135deg, rgba(12, 123, 179, 0.85) 0%, rgba(242, 186, 232, 0.85) 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden sm: hidden md:block">
        <img
          src={starSvg}
          alt="sparkle"
          className="absolute right-10 top-10 w-[420px] transform hidden"
        />
        <img
          src={starSvg}
          alt="sparkle"
          className="absolute -right-22 top-52 w-[260px] opacity-35 transform hidden"
        />
        <img
          src={starSvg}
          alt="sparkle"
          className="absolute right-72 -bottom-8 w-[240px] opacity-30 transform hidden"
        />
        <img
          src={starSvg}
          alt="sparkle"
          className="absolute right-80 top-10 w-[280px] opacity-30 transform hidden"
        />
        <img
          src={starSvg}
          alt="sparkle"
          className="absolute right-10 -top-12 w-[250px] opacity-70 transform hidden"
        />
        <img
          src={bannerShape}
          alt="sparkle"
          className="absolute right-75 top-25 w-[210px] transform hidden"
        />
        <img
          src={bannerShape}
          alt="sparkle"
          className="absolute left-30 top-8 w-[210px] transform rotate-y-180 hidden"
        />
      </div>
      <div className="relative px-6 sm:px-8 lg:px-12 py-8 sm:py-10 lg:py-12">
        <div className="max-w-3xl">
          <p className="text-white/90 text-xs sm:text-sm font-medium mb-3 sm:mb-4">
            {subtitle}
          </p>
          <h1 className="font-anton text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-4 sm:mb-6">
            {title}
          </h1>
          <button
            onClick={() => navigate(buttonRoute)}
            className="bg-white text-[#0c7bb3] px-6 sm:px-8 py-4 sm:py-4.5 rounded-full font-medium cursor-pointer text-sm sm:text-base transition-all shadow-lg hover:shadow-2xl transform hover:-translate-y-0.5"
          >
            {buttonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
