import React from "react";
import { formatRandAmount } from "../../../../../../components/campaign/campaignViewUtils";
import CampaignCreateStepCard from "../CampaignCreateShared";
import { CAMPAIGN_CREATE_STEPS } from "../../../data/campaignCreateStepsData";
import { getVideoLengthPackage } from "../../../utils/campaignCreatePricingUtils";
import { CAMPAIGN_ADD_ONS } from "../../../data/campaignCreatePricingData";
import {
  platformOptions,
  locationOptions,
  compensationOptions,
  selectOptions,
} from "../../../campaignFormOptions";

const stepMeta = CAMPAIGN_CREATE_STEPS[5];

function ReviewRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#F1F5F9] py-3 sm:flex-row sm:justify-between">
      <span className="text-sm text-[#64748B]">{label}</span>
      <span className="text-sm font-medium text-[#111827] sm:max-w-[60%] sm:text-right">
        {value || "—"}
      </span>
    </div>
  );
}

function getOptionLabel(options, value) {
  if (Array.isArray(value)) {
    if (!value.length) return "—";
    if (value.includes("all")) return "All";
    return value
      .map((val) => options.find((opt) => opt.value === val)?.label || val)
      .filter(Boolean)
      .join(", ");
  }
  return options.find((option) => option.value === value)?.label || value || "—";
}

export default function StepReviewPublish({ formData, invoice }) {
  const videoPkg = getVideoLengthPackage(formData.videoLength);
  const selectedAddOnLabels = CAMPAIGN_ADD_ONS.filter((addon) =>
    (formData.selectedAddOns || []).includes(addon.id)
  ).map((addon) => addon.label);

  return (
    <CampaignCreateStepCard title={stepMeta.title} description={stepMeta.description}>
      <div className="space-y-6">
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#94A3B8]">
            Campaign Basics
          </h3>
          <ReviewRow label="Campaign Title" value={formData.campaignTitle} />
          <ReviewRow
            label="Deliverables"
            value={getOptionLabel(selectOptions.deliverables, formData.deliverables)}
          />
          <ReviewRow
            label="Platform"
            value={(Array.isArray(formData.platform) ? formData.platform : [formData.platform])
              .filter(Boolean)
              .map((value) => getOptionLabel(platformOptions, value))
              .join(", ")}
          />
          <ReviewRow label="Video Length" value={videoPkg?.duration} />
          <ReviewRow label="Product URL" value={formData.productServiceUrl} />
          <ReviewRow
            label="Compensation"
            value={getOptionLabel(compensationOptions, formData.compensationType)}
          />
          <ReviewRow
            label="Product Status"
            value={getOptionLabel(selectOptions.productStatus, formData.productStatus)}
          />
          <ReviewRow label="Campaign Goal" value={formData.campaignGoal} />
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#94A3B8]">
            Target Audience
          </h3>
          <ReviewRow
            label="Age Range"
            value={getOptionLabel(selectOptions.ageRange, formData.ageRange)}
          />
          <ReviewRow
            label="Gender"
            value={getOptionLabel(selectOptions.gender, formData.gender)}
          />
          <ReviewRow
            label="Location"
            value={getOptionLabel(locationOptions, formData.locationCountry)}
          />
          <ReviewRow label="Creators" value={formData.numberOfCreators || "—"} />
          <ReviewRow label="Key Message" value={formData.keyMessage} />
          <ReviewRow label="Campaign Brief" value={formData.campaignBrief} />
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#94A3B8]">
            Pricing
          </h3>
          <ReviewRow
            label="Base Package"
            value={
              invoice.hasVideoLength
                ? formatRandAmount(invoice.baseAmount)
                : "—"
            }
          />
          {invoice.numberOfCreators > 1 && invoice.perCreatorRate ? (
            <ReviewRow
              label="Per Creator Rate"
              value={formatRandAmount(invoice.perCreatorRate)}
            />
          ) : null}
          <ReviewRow
            label="Add-ons"
            value={selectedAddOnLabels.length ? selectedAddOnLabels.join(", ") : "None"}
          />
          <ReviewRow
            label="Campaign Budget"
            value={invoice.hasVideoLength ? formatRandAmount(invoice.cartSubtotal) : "—"}
          />
          <ReviewRow
            label="Total Due"
            value={invoice.hasVideoLength ? formatRandAmount(invoice.totalDue) : "—"}
          />
          {invoice.isFromApi ? (
            <p className="mt-2 text-xs text-[#64748B]">
              Pricing confirmed from server invoice.
            </p>
          ) : null}
        </section>
      </div>
    </CampaignCreateStepCard>
  );
}
