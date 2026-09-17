import React from "react";
import { Input } from "../../../../../../components/ui/input";
import { SearchableSelect } from "../../../../../../components/ui/searchable-select";
import { FieldLabel, SelectField } from "../../CampaignFormFields";
import CampaignCreateStepCard from "../CampaignCreateShared";
import { CAMPAIGN_CREATE_STEPS } from "../../../data/campaignCreateStepsData";
import { sanitizeCreatorCountInput, MAX_CAMPAIGN_CREATORS } from "../../../utils/campaignCreateStepUtils";

const stepMeta = CAMPAIGN_CREATE_STEPS[1];

export default function StepTargetAudience({
  formData,
  handleChange,
  inputClass,
  selectOptions,
  locationOptions,
  errors,
}) {
  return (
    <CampaignCreateStepCard title={stepMeta.title} description={stepMeta.description}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <SelectField
          label="Age Range"
          name="ageRange"
          required
          value={formData.ageRange}
          onChange={(value) => handleChange("ageRange", value)}
          options={selectOptions.ageRange}
          inputClass={inputClass}
          error={errors.ageRange}
        />

        <SelectField
          label="Gender"
          name="gender"
          required
          value={formData.gender}
          onChange={(value) => handleChange("gender", value)}
          options={selectOptions.gender}
          inputClass={inputClass}
          error={errors.gender}
        />

        <div>
          <FieldLabel>Location / City</FieldLabel>
          <SearchableSelect
            options={locationOptions}
            value={formData.locationCountry}
            onChange={(value) => handleChange("locationCountry", value)}
            placeholder="Select locations..."
            searchPlaceholder="Search South African city..."
            isMulti={true}
            className={`${inputClass} h-[48px] rounded-[12px]`}
          />
        </div>

        <div>
          <FieldLabel>Number Of Creators</FieldLabel>
          <Input
            className={inputClass}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            min={1}
            max={MAX_CAMPAIGN_CREATORS}
            value={formData.numberOfCreators}
            onChange={(event) =>
              handleChange("numberOfCreators", sanitizeCreatorCountInput(event.target.value))
            }
            placeholder={`1 – ${MAX_CAMPAIGN_CREATORS}`}
          />
          {errors.numberOfCreators ? (
            <p className="mt-1 text-xs text-red-500">{errors.numberOfCreators}</p>
          ) : (
            <p className="mt-1 text-xs text-[#64748B]">
              Enter a whole number from 1 to {MAX_CAMPAIGN_CREATORS}
            </p>
          )}
        </div>

        <SelectField
          label="Follower Count"
          name="followerCount"
          required
          value={formData.followerCount}
          onChange={(value) => handleChange("followerCount", value)}
          options={selectOptions.followerCount}
          inputClass={inputClass}
          error={errors.followerCount}
        />

        <SelectField
          label="Engagement Rate"
          name="engagementRate"
          required
          value={formData.engagementRate}
          onChange={(value) => handleChange("engagementRate", value)}
          options={selectOptions.engagementRate}
          inputClass={inputClass}
          error={errors.engagementRate}
        />

        <div className="md:col-span-2">
          <FieldLabel>Key Message</FieldLabel>
          <Input
            className={inputClass}
            value={formData.keyMessage}
            onChange={(event) => handleChange("keyMessage", event.target.value)}
            placeholder="What key message should creators communicate?"
          />
        </div>

      </div>
    </CampaignCreateStepCard>
  );
}
