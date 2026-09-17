import React from "react";
import { AlertCircle } from "lucide-react";
import CampaignCreateStepCard from "../CampaignCreateShared";
import { CAMPAIGN_CREATE_STEPS } from "../../../data/campaignCreateStepsData";
import { CAMPAIGN_ADD_ONS } from "../../../data/campaignCreatePricingData";

const stepMeta = CAMPAIGN_CREATE_STEPS[4];

function AddOnOption({ addon, checked, onToggle, disabled }) {
  return (
    <label
      className={`flex cursor-pointer items-start gap-4 rounded-xl border p-4 transition-colors ${
        checked
          ? "border-[#0C7BB3] bg-[#EFF6FF]"
          : "border-[#E2E8F0] bg-white hover:border-[#CBD5E1]"
      } ${disabled ? "cursor-not-allowed opacity-60" : ""}`}
    >
      <input
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-[#CBD5E1] text-[#0C7BB3] focus:ring-[#0C7BB3]"
        checked={checked}
        disabled={disabled}
        onChange={onToggle}
      />
      <span className="flex-1">
        <span className="flex items-start justify-between gap-3">
          <span className="text-sm font-semibold text-[#111827]">{addon.label}</span>
          <span className="shrink-0 text-sm font-semibold text-[#0C7BB3]">
            {addon.priceLabel}
          </span>
        </span>
        <span className="mt-1 block text-xs text-[#64748B]">{addon.description}</span>
      </span>
    </label>
  );
}

export default function StepAddOns({
  formData,
  handleToggleAddOn,
  hasVideoLength,
  isGiftCampaign = false,
}) {
  const selectedIds = formData.selectedAddOns || [];

  if (isGiftCampaign) {
    return (
      <CampaignCreateStepCard title={stepMeta.title} description={stepMeta.description}>
        <p className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 text-sm text-[#64748B]">
          Add-ons apply to cash campaigns only. Gift campaigns use premium billing.
        </p>
      </CampaignCreateStepCard>
    );
  }

  return (
    <CampaignCreateStepCard title={stepMeta.title} description={stepMeta.description}>
      {!hasVideoLength ? (
        <div className="mb-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-900">
            Please select a video length in Step 1 to see add-on pricing.
          </p>
        </div>
      ) : null}

      <div className="space-y-3">
        {CAMPAIGN_ADD_ONS.map((addon) => (
          <AddOnOption
            key={addon.id}
            addon={addon}
            checked={selectedIds.includes(addon.id)}
            disabled={!hasVideoLength}
            onToggle={() => handleToggleAddOn(addon.id)}
          />
        ))}
      </div>
    </CampaignCreateStepCard>
  );
}
