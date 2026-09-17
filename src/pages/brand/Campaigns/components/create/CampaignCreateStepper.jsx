import React from "react";
import { Check } from "lucide-react";
import { cn } from "../../../../../lib/utils";
import { CAMPAIGN_CREATE_STEPS } from "../../data/campaignCreateStepsData";

export default function CampaignCreateStepper({ currentStep }) {
  return (
    <nav
      aria-label="Campaign creation progress"
      className="mb-6 rounded-2xl border border-[#E2E8F0] bg-white px-4 py-5 shadow-sm sm:px-6 sm:py-6"
    >
      <ol className="flex items-center">
        {CAMPAIGN_CREATE_STEPS.map((step, index) => {
          const isComplete = currentStep > step.id;
          const isActive = currentStep === step.id;
          const isLast = index === CAMPAIGN_CREATE_STEPS.length - 1;

          return (
            <li key={step.key} className="flex min-w-0 flex-1 items-center">
              <div className="flex min-w-0 items-center gap-2 sm:gap-3">
                <div
                  className={cn(
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                    (isComplete || isActive) && "bg-[#0C7BB3] text-white",
                    !isComplete && !isActive && "bg-[#E8EEF7] text-[#94A3B8]"
                  )}
                >
                  {isComplete ? <Check className="h-4 w-4" strokeWidth={3} /> : step.id}
                </div>
                <span
                  className={cn(
                    "hidden truncate text-xs font-medium sm:block sm:text-sm",
                    isActive || isComplete ? "text-[#0C7BB3]" : "text-[#94A3B8]"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {!isLast ? (
                <div
                  className={cn(
                    "mx-2 h-[2px] min-w-[12px] flex-1 rounded-full sm:mx-3",
                    isComplete ? "bg-[#0C7BB3]" : "bg-[#E8EEF7]"
                  )}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
