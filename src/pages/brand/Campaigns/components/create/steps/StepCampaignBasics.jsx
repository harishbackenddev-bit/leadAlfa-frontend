import React from "react";
import { Pencil } from "lucide-react";
import { Input } from "../../../../../../components/ui/input";
import { Textarea } from "../../../../../../components/ui/textarea";
import { CheckboxMultiSelect } from "../../../../../../components/ui/checkbox-multi-select";
import { FieldLabel, SelectField } from "../../CampaignFormFields";
import CampaignCreateStepCard from "../CampaignCreateShared";
import GiftPremiumCard from "../GiftPremiumCard";
import { CAMPAIGN_CREATE_STEPS } from "../../../data/campaignCreateStepsData";
import { VIDEO_LENGTH_PACKAGES } from "../../../data/campaignCreatePricingData";

const stepMeta = CAMPAIGN_CREATE_STEPS[0];

export default function StepCampaignBasics({
  formData,
  handleChange,
  handleCompensationChange,
  inputClass,
  selectOptions,
  platformOptions,
  compensationOptions,
  errors,
}) {
  const videoLengthOptions = VIDEO_LENGTH_PACKAGES.map((pkg) => ({
    label: pkg.label,
    value: pkg.value,
  }));

  return (
    <CampaignCreateStepCard title={stepMeta.title} description={stepMeta.description}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <FieldLabel required>Campaign Title</FieldLabel>
          <Input
            className={inputClass}
            value={formData.campaignTitle}
            onChange={(event) => handleChange("campaignTitle", event.target.value)}
            placeholder="Enter campaign title"
          />
          {errors.campaignTitle ? (
            <p className="mt-1 text-xs text-red-500">{errors.campaignTitle}</p>
          ) : null}
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between">
            <FieldLabel required>Campaign Brief</FieldLabel>
            <button
              type="button"
              className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-[#0C7BB3]"
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#0C7BB3]">
                <Pencil className="h-2.5 w-2.5 text-white" />
              </span>
              Generate With AI
            </button>
          </div>
          <Textarea
            className={`${inputClass} min-h-[130px]`}
            value={formData.campaignBrief}
            onChange={(event) => handleChange("campaignBrief", event.target.value)}
            placeholder="e.g., Drive conversions, Brand awareness, Educate audience"
          />
          {errors.campaignBrief ? (
            <p className="mt-1 text-xs text-red-500">{errors.campaignBrief}</p>
          ) : null}
        </div>

        <SelectField
          label="Deliverables"
          name="deliverables"
          required
          value={formData.deliverables}
          onChange={(value) => handleChange("deliverables", value)}
          options={selectOptions.deliverables}
          inputClass={inputClass}
          error={errors.deliverables}
        />

        <div>
          <FieldLabel required>Platform</FieldLabel>
          <CheckboxMultiSelect
            options={platformOptions.filter((option) => option.value !== "other")}
            value={formData.platform}
            onChange={(value) => handleChange("platform", value)}
            placeholder="Select one or more platforms"
          />
          {errors.platform ? (
            <p className="mt-1 text-xs text-red-500">{errors.platform}</p>
          ) : null}
        </div>

        <SelectField
          label="Video Length"
          name="videoLength"
          required
          value={formData.videoLength}
          onChange={(value) => handleChange("videoLength", value)}
          options={videoLengthOptions}
          inputClass={inputClass}
          error={errors.videoLength}
        />

        <div>
          <FieldLabel>Product / Service URL</FieldLabel>
          <Input
            className={inputClass}
            value={formData.productServiceUrl}
            onChange={(event) => handleChange("productServiceUrl", event.target.value)}
            placeholder="https://example.com/product"
          />
        </div>

        <div>
          <FieldLabel required>Compensation Type</FieldLabel>
          <div className="grid grid-cols-2 gap-3">
            {compensationOptions.map((option) => {
              const isSelected = formData.compensationType === option.value;
              const Icon = option.icon;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleCompensationChange(option.value)}
                  className={`relative flex h-[48px] items-center justify-center gap-2 rounded-lg border text-base font-semibold transition-colors ${
                    isSelected
                      ? "border-[#1D4D8E] btn-gradient text-white"
                      : "border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
          {errors.compensationType ? (
            <p className="mt-1 text-xs text-red-500">{errors.compensationType}</p>
          ) : null}
        </div>

        {formData.compensationType === "gift" ? (
          <div className="md:col-span-2">
            <GiftPremiumCard />
          </div>
        ) : null}

        <SelectField
          label="Product Status"
          name="productStatus"
          required
          value={formData.productStatus}
          onChange={(value) => handleChange("productStatus", value)}
          options={selectOptions.productStatus}
          inputClass={inputClass}
          error={errors.productStatus}
        />

        <div className="md:col-span-2">
          <FieldLabel>Campaign Goal / Objective</FieldLabel>
          <Textarea
            className={`${inputClass} min-h-[96px]`}
            value={formData.campaignGoal}
            onChange={(event) => handleChange("campaignGoal", event.target.value)}
            placeholder="e.g., Drive conversions, Brand awareness, Educate audience"
          />
        </div>
      </div>
    </CampaignCreateStepCard>
  );
}
