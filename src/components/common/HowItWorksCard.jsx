import React from "react";
import ActionButton from "./ActionButton";
import MediaViewer from "./MediaViewer";

export default function HowItWorksCard({
  title,
  subtitle,
  steps = [],
  file,
  poster,
  buttonLabel,
  onButtonClick,
  mediaSide = "right",
  mediaWidth = 85,
  shadow = false,
  className = "",
  actionClass = "",
  stepVariant = "filled",
  buttonPlacement = "inside",
  buttonAlign = "center",
}) {
  const isImageLeft = mediaSide === "left";
  const isFilled = stepVariant === "filled";
  const justifyClass =
    buttonAlign === "left"
      ? "justify-start"
      : buttonAlign === "right"
      ? "justify-end"
      : "justify-center";

  return (
    <section className="px-4 sm:px-6 lg:px-24 py-8 sm:py-12 lg:py-16">
      <div className="text-center mb-6 sm:mb-8 lg:mb-12">
        <h2 className="text-[28px] sm:text-[40px] lg:text-[54px] font-bold leading-[1.15] tracking-[-0.03em] text-[#1A1A1A] mb-3 px-2">
          {title}
        </h2>
        {subtitle && (
          <p className="text-[#64748A] text-[16px] lg:text-[20px] leading-[1.6] max-w-2xl mx-auto px-2">
            {subtitle}
          </p>
        )}
      </div>

      <div
        className={`flex flex-col ${
          isImageLeft ? "lg:flex-row-reverse" : "lg:flex-row"
        } items-start lg:items-center justify-between gap-8 sm:gap-10 lg:gap-16 ${className}`}
      >
        <div className="flex-1 w-full">
          <div className="relative max-w-xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4 lg:gap-5 relative">
                <div className="flex-shrink-0 flex flex-col items-center">
                  <div className={`w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl flex items-center justify-center z-10 shadow-sm flex-shrink-0 ${isFilled ? "bg-[#0c7bb3]" : "bg-[#EEF9FF] border-2 border-[#0c7bb3]"}`}>
                    <span className={`${isFilled ? "text-white" : "text-[#0c7bb3]"} text-lg font-semibold leading-none`}>{index + 1}</span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`${isFilled ? "w-[2px] h-full bg-gray-200 mt-2 mb-2 min-h-[60px]" : "w-[2px] h-full bg-[#0c7bb3] mt-2 mb-2 min-h-[60px]"}`} />
                  )}
                </div>
                <div
                  className={`flex-1 ${
                    index < steps.length - 1 ? "pb-6" : "pb-2"
                  }`}
                >
                  <h3 className="text-[16px] lg:text-[18px] font-semibold text-[#1A1A1A] mb-2 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-[#64748A] text-[14px] leading-[1.7]">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
            {buttonLabel && buttonPlacement === "inside" && (
              <ActionButton
                label={buttonLabel}
                onClick={onButtonClick}
                className={`${actionClass} mt-4`}
              />
            )}
          </div>
        </div>
        <div className="flex-1 flex justify-center">
          <div
            className={`relative rounded-[20px] ${shadow ? "shadow-lg" : ""} overflow-hidden`}
            style={{ maxWidth: `${mediaWidth}%` }}
          >
            <MediaViewer
              file={file}
              poster={poster}
              className={`rounded-[20px] h-auto ${className}`}
              style={{ maxWidth: "100%", width: "100%", height: "auto" }}
            />
            {shadow && (
              <>
                <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
              </>
            )}
          </div>
        </div>
      </div>

      {buttonLabel && buttonPlacement === "outside" && (
        <div className={`mt-8 flex ${justifyClass}`}> 
          <ActionButton
            label={buttonLabel}
            onClick={onButtonClick}
            className={`${actionClass}`}
          />
        </div>
      )}
    </section>
  );
}
