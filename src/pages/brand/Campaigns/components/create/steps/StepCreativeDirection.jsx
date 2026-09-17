import React from "react";
import { Upload } from "lucide-react";
import { Input } from "../../../../../../components/ui/input";
import { Textarea } from "../../../../../../components/ui/textarea";
import { FieldLabel, SelectField, DateField, UploadBox } from "../../CampaignFormFields";
import CampaignCreateStepCard, { ToggleSwitch } from "../CampaignCreateShared";
import { CAMPAIGN_CREATE_STEPS } from "../../../data/campaignCreateStepsData";

const stepMeta = CAMPAIGN_CREATE_STEPS[2];

export default function StepCreativeDirection({
  formData,
  handleChange,
  inputClass,
  selectOptions,
  coverImage,
  existingCoverPreviewUrl,
  handleCoverImageChange,
  handleFileDrop,
  uploadImg,
  errors,
}) {
  return (
    <CampaignCreateStepCard title={stepMeta.title} description={stepMeta.description}>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <SelectField
          label="Hook Style"
          name="hook"
          required
          value={formData.hook}
          onChange={(value) => handleChange("hook", value)}
          options={selectOptions.hook}
          inputClass={inputClass}
          error={errors.hook}
        />

        <SelectField
          label="Tone / Voice"
          name="toneVoice"
          required
          value={formData.toneVoice}
          onChange={(value) => handleChange("toneVoice", value)}
          options={selectOptions.toneVoice}
          inputClass={inputClass}
          error={errors.toneVoice}
        />

        <div className="md:col-span-2">
          <FieldLabel>Problem</FieldLabel>
          <Textarea
            className={`${inputClass} min-h-[96px]`}
            value={formData.problem}
            onChange={(event) => handleChange("problem", event.target.value)}
            placeholder="What problem does your product solve?"
          />
        </div>

        <div className="md:col-span-2">
          <FieldLabel>Solution</FieldLabel>
          <Textarea
            className={`${inputClass} min-h-[96px]`}
            value={formData.solution}
            onChange={(event) => handleChange("solution", event.target.value)}
            placeholder="How does your product solve it?"
          />
        </div>

        <div className="md:col-span-2">
          <FieldLabel>Call To Action (CTA)</FieldLabel>
          <Textarea
            className={`${inputClass} min-h-[96px]`}
            value={formData.cta}
            onChange={(event) => handleChange("cta", event.target.value)}
            placeholder="What action should viewers take?"
          />
        </div>

        <div className="md:col-span-2">
          <FieldLabel>Aesthetic / Vibes</FieldLabel>
          <Input
            className={inputClass}
            value={formData.aestheticVibe}
            onChange={(event) => handleChange("aestheticVibe", event.target.value)}
            placeholder="e.g. Clean, Luxury, Minimal, Authentic, UGC Native..."
          />
        </div>

        <DateField
          label="Campaign Start Date"
          value={formData.campaignStarts}
          onChange={(value) => handleChange("campaignStarts", value)}
        />

        <DateField
          label="Application Date"
          value={formData.applicationDeadline}
          onChange={(value) => handleChange("applicationDeadline", value)}
        />

        <div className="md:col-span-2">
          <ToggleSwitch
            label="Is a pet required?"
            description="Toggle if creators need a pet in the content"
            checked={Boolean(formData.petsRequired)}
            onChange={(value) => handleChange("petsRequired", value)}
          />
        </div>

        {formData.petsRequired ? (
          <div className="md:col-span-2">
            <FieldLabel required>Which pet?</FieldLabel>
            <Input
              className={inputClass}
              value={formData.typeOfPet}
              onChange={(event) => handleChange("typeOfPet", event.target.value)}
              placeholder="e.g., Dog, Cat"
            />
            {errors.typeOfPet ? (
              <p className="mt-1 text-xs text-red-500">{errors.typeOfPet}</p>
            ) : null}
          </div>
        ) : null}

        <div className="md:col-span-2">
          <UploadBox
            title="Upload Cover Image"
            file={coverImage}
            existingPreviewUrl={existingCoverPreviewUrl ?? undefined}
            onChange={(event) => handleCoverImageChange(event.target.files?.[0] || null)}
            onDrop={(event) => handleFileDrop(event, handleCoverImageChange)}
            uploadImg={uploadImg}
            error={errors.coverImage}
          />
          {!coverImage && !existingCoverPreviewUrl ? (
            <p className="mt-2 flex items-center gap-2 text-xs text-[#64748B]">
              <Upload className="h-3.5 w-3.5" />
              Drop file or click to upload · JPG, PNG or MP4
            </p>
          ) : null}
        </div>
      </div>
    </CampaignCreateStepCard>
  );
}
