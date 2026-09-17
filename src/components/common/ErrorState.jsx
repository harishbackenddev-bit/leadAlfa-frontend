import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  ServerCrash,
  WifiOff,
  ShieldAlert,
  FileQuestion,
} from "lucide-react";

/**
 * Premium Standardized UI Error State Component.
 * Inspired by modern minimal aesthetic with theme colors (#0C7BB3 / #1E60DB brand blue, #f9edf5 brand pink).
 */
export default function ErrorState({
  title,
  description,
  statusCode,
  type = "general",
  variant = "page",
  onRetry,
  primaryAction,
  secondaryAction,
  errorDetails,
  className = "",
}) {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  // Determine configuration based on status code or type
  const is500 = statusCode === 500 || type === "server";
  const is404 = statusCode === 404 || type === "notFound";
  const is403 = statusCode === 403 || type === "forbidden";
  const isNetwork = type === "network";

  const codeDisplay = statusCode || (is500 ? 500 : is404 ? 404 : is403 ? 403 : "ERR");

  const defaultTitle = is500
    ? "Internal server error"
    : is404
    ? "Page or campaign not found"
    : is403
    ? "Access restricted"
    : isNetwork
    ? "Connection issue"
    : "Something went wrong";

  const defaultDescription = is500
    ? "We're sorry, but something went wrong on our end. Our team has been notified, and we're working to fix the issue. Please try again later."
    : is404
    ? "We're sorry, but the campaign or page you requested could not be found. It may have been moved or removed."
    : is403
    ? "You don't have permission to access this resource. Please verify your account privileges."
    : isNetwork
    ? "Unable to connect to the server. Please check your internet connection and try again."
    : "An unexpected error occurred while processing your request. Please try again.";

  const displayTitle = title || defaultTitle;
  const displayDescription = description || defaultDescription;

  const handlePrimaryClick = () => {
    if (primaryAction?.onClick) {
      primaryAction.onClick();
    } else if (onRetry) {
      onRetry();
    } else {
      window.location.reload();
    }
  };

  const handleSecondaryClick = () => {
    if (secondaryAction?.onClick) {
      secondaryAction.onClick();
    } else {
      navigate("/brand/campaigns");
    }
  };

  const PrimaryIcon = primaryAction?.icon || RefreshCw;
  const SecondaryIcon = secondaryAction?.icon || ArrowLeft;
  const IconComponent = is500
    ? ServerCrash
    : isNetwork
    ? WifiOff
    : is403
    ? ShieldAlert
    : is404
    ? FileQuestion
    : AlertTriangle;

  // Compact Inline Card Layout
  if (variant === "card") {
    return (
      <div
        className={`relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-[#f9edf5]/40 via-white to-[#edf6fb]/60 p-6 text-center shadow-sm ${className}`}
      >
        <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[#1E60DB]/10 text-[#1E60DB]">
          <IconComponent className="h-6 w-6" />
        </div>

        <span className="inline-block mb-1.5 rounded-full bg-[#1E60DB]/10 px-3 py-0.5 text-xs font-bold text-[#0C7BB3]">
          {codeDisplay !== "ERR" ? `HTTP ${codeDisplay}` : "Error"}
        </span>

        <h4 className="text-base font-bold text-[#161C2B]">{displayTitle}</h4>
        <p className="mt-1 max-w-md mx-auto text-xs sm:text-sm text-[#5B576F] leading-relaxed">
          {displayDescription}
        </p>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
          {onRetry || primaryAction ? (
            <button
              type="button"
              onClick={handlePrimaryClick}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#0C7BB3] px-5 py-2 text-xs font-semibold text-white transition-all hover:bg-[#1E60DB] shadow-sm cursor-pointer"
            >
              <PrimaryIcon className="h-3.5 w-3.5" />
              {primaryAction?.label || "Try Again"}
            </button>
          ) : null}
          {secondaryAction ? (
            <button
              type="button"
              onClick={handleSecondaryClick}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-5 py-2 text-xs font-semibold text-[#161C2B] transition-all hover:bg-gray-50 shadow-2xs cursor-pointer"
            >
              <SecondaryIcon className="h-3.5 w-3.5" />
              {secondaryAction.label}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  // Full Page View Layout (Inspired by reference screenshot)
  return (
    <div
      className={`relative isolate min-h-[80vh] w-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#f9edf5] via-[#fcfbfe] to-[#edf6fb] px-4 py-12 sm:px-6 lg:px-8 ${className}`}
    >
      {/* Decorative Subtle Background Ambient Glows */}
      <div
        className="pointer-events-none absolute -top-24 -left-20 h-[380px] w-[380px] rounded-full bg-[#f9edf5] opacity-70 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-20 h-[380px] w-[380px] rounded-full bg-[#edf6fb] opacity-80 blur-3xl"
        aria-hidden="true"
      />

      {/* Giant Translucent Status Code Watermark */}
      <div
        className="pointer-events-none select-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-[140px] font-extrabold leading-none tracking-tight text-white sm:text-[200px] md:text-[260px] lg:text-[320px] drop-shadow-[0_15px_30px_rgba(249,237,245,0.8)] opacity-95"
        style={{ textShadow: "0 10px 40px rgba(12,123,179,0.06)" }}
        aria-hidden="true"
      >
        {codeDisplay}
      </div>

      {/* Foreground Error Content */}
      <div className="relative z-10 mx-auto max-w-xl text-center">
        {/* Main Title */}
        <h1 className="text-lg font-bold tracking-tight text-[#161C2B] sm:text-xl lg:text-2xl">
          {displayTitle}
        </h1>

        {/* Description Subtitle */}
        <p className="mx-auto mt-4 max-w-md text-xs font-medium text-[#5B576F] leading-relaxed sm:text-sm">
          {displayDescription}
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handlePrimaryClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full btn-gradient px-8 py-3 text-sm font-semibold text-white shadow-md shadow-[#0C7BB3]/20 transition-all hover:bg-[#1E60DB] hover:scale-[1.02] cursor-pointer"
          >
            <PrimaryIcon className="h-4 w-4" />
            {primaryAction?.label || "Try Again"}
          </button>

          <button
            type="button"
            onClick={handleSecondaryClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white/90 backdrop-blur-md px-8 py-3 text-sm font-semibold text-[#161C2B] shadow-2xs transition-all hover:bg-gray-50 hover:scale-[1.02] cursor-pointer"
          >
            <SecondaryIcon className="h-4 w-4" />
            {secondaryAction?.label || "Back to Campaigns"}
          </button>
        </div>

       
      </div>
    </div>
  );
}
