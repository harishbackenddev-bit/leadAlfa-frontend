import React from "react";
import { Link } from "react-router-dom";
import { BadgeCheck } from "lucide-react";

export default function CreatorCampaignDetailBanner({
  imageUrl,
  altText = "Campaign banner",
  campaignTitle,
  companyName,
  brandLogo,
  isVerified = false,
  status,
  daysLeft,
  brandProfileTo,
  brandProfileState,
}) {
  const statusLabel = status
    ? String(status).charAt(0).toUpperCase() + String(status).slice(1)
    : null;

  const isClosed = daysLeft === 0;

  const brandContent = (
    <>
      {brandLogo ? (
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white/90 bg-white shadow-md sm:h-14 sm:w-14">
          <img
            src={brandLogo}
            alt={companyName}
            className="h-full w-full object-cover"
          />
        </div>
      ) : (
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-white/90 bg-white/20 text-sm font-bold text-white shadow-md sm:h-14 sm:w-14">
          {companyName?.charAt(0) || "B"}
        </div>
      )}

      <div className="min-w-0 text-left">
        <p className="truncate text-lg font-bold text-white underline-offset-2 sm:text-xl">
          {companyName}
        </p>
        {(
          <p className="mt-0.5 flex items-center gap-1 text-xs text-white/85 sm:text-sm">
            <BadgeCheck className="h-3.5 w-3.5 shrink-0" aria-hidden />
            Verified Brand Partner
          </p>
        )}
      </div>
    </>
  );

  return (
    <div className="mb-6">
      <div className="relative h-[280px] w-full overflow-hidden rounded-2xl shadow-lg sm:h-[340px] lg:h-[380px]">
        <img
          src={imageUrl}
          alt={altText}
          className="h-full w-full object-cover"
        />

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

        <div className="absolute right-4 top-4 z-20 flex flex-wrap items-center justify-end gap-2">
          {statusLabel && !isClosed ? (
            <span className="rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
              {statusLabel}
            </span>
          ) : null}
          {daysLeft != null ? (
            isClosed ? (
              <span className="rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow-sm">
                Closed
              </span>
            ) : (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-gray-900 shadow-sm">
                {daysLeft} {daysLeft === 1 ? "Day" : "Days"} Left
              </span>
            )
          ) : null}
        </div>

        <div className="absolute bottom-4 left-4 z-20 max-w-[calc(100%-2rem)]">
          {brandProfileTo ? (
            <Link
              to={brandProfileTo}
              state={brandProfileState}
              className="group flex min-w-0 items-end gap-3 rounded-lg transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              aria-label={`View ${companyName} profile`}
            >
              {brandContent}
            </Link>
          ) : (
            <div className="flex min-w-0 items-end gap-3">{brandContent}</div>
          )}
        </div>
      </div>

      {campaignTitle ? (
        <h1 className="mt-5 text-2xl font-extrabold text-gray-900 sm:text-3xl lg:text-4xl">
          {campaignTitle}
        </h1>
      ) : null}
    </div>
  );
}
