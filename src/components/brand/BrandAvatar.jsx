import React from "react";
import {
  getCompanyInitials,
  resolveBrandLogo,
} from "../../utils/brandProfileMapper";
import ellipseIcon from "../../assets/SVGs/brands/headerIcons/Ellipse.svg";

const SIZE_CONFIG = {
  sm: { outer: "h-8 w-8", inset: "inset-0", text: "text-xs", ring: false },
  md: { outer: "h-11 w-11", inset: "inset-0.75", text: "text-sm", ring: true },
  lg: { outer: "h-20 w-20", inset: "inset-0", text: "text-2xl", ring: false },
};

export default function BrandAvatar({
  user,
  profile: profileProp,
  size = "md",
  className = "",
}) {
  const profile = profileProp || user?.profile || {};
  const companyName = profile.companyName || "Brand";
  const logoUrl = resolveBrandLogo(profile);
  const initials = getCompanyInitials(companyName);
  const config = SIZE_CONFIG[size] || SIZE_CONFIG.md;

  return (
    <div className={`relative shrink-0 ${config.outer} ${className}`}>
      <div
        className={`absolute ${config.inset} overflow-hidden rounded-full bg-gray-100`}
      >
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={companyName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-[#1E60DB26] font-semibold text-[#0353a4] dark:text-[#8ab1fa] ${config.text}`}
          >
            {initials}
          </div>
        )}
      </div>
      {config.ring ? (
        <img
          src={ellipseIcon}
          alt=""
          className="absolute inset-0.25 h-full w-full pl-1"
        />
      ) : null}
    </div>
  );
}
