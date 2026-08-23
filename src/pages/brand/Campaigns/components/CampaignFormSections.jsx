import React from "react";
import { Input } from "../../../../components/ui/input";
import { Textarea } from "../../../../components/ui/textarea";
import { MultiSelect } from "../../../../components/ui/multi-select";
import {
  FieldLabel,
  SelectField,
  DateField,
  UploadBox,
} from "./CampaignFormFields";
import FormSection from "./FormSection";
import { BarChart3, TrendingUp, Sparkles } from "lucide-react";

function GiftPremiumCard() {
  const plans = [
    {
      title: "Premium (Growth)",
      price: "R 999.00/month",
      icon: TrendingUp,
      items: ["5 Active Gift Campaigns", "Basic Analytics", "Manual Messaging"],
      button: "Select Growth",
      highlighted: false,
    },
    {
      title: "Premium (Scale)",
      price: "R 2 499.00/month",
      icon: BarChart3,
      items: [
        "Unlimited Gift Campaigns",
        "Deep Audience Data",
        "Bulk Invites & Auto-Nudges",
        "Downloadable Content Library",
      ],
      button: "Select Scale",
      highlighted: true,
      badge: "RECOMMENDED",
    },
  ];

  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0F57A7]">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900">
          Gift Campaigns are a Premium Feature
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Upgrade to unlock gift-based campaigns and manage product gifting
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {plans.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.title}
              className={`relative rounded-2xl border bg-white p-5 shadow-sm transition-shadow ${plan.highlighted
                  ? "border-[#0F57A7] shadow-md"
                  : "border-slate-200"
                }`}
            >
              {plan.badge ? (
                <span className="absolute right-4 top-0 -translate-y-1/2 rounded-full bg-[#0F57A7] px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {plan.badge}
                </span>
              ) : null}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0F57A7] text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900">
                    {plan.title}
                  </p>
                  <p className="text-sm font-semibold text-[#0F57A7]">
                    {plan.price}
                  </p>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className={`mt-5 w-full rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors ${plan.highlighted
                    ? "bg-gradient-to-r from-[#0F57A7] to-[#1085C8]"
                    : "bg-gradient-to-r from-[#0F57A7] to-[#1085C8]"
                  }`}
              >
                {plan.button}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function CampaignBasicsSection({
  formData,
  handleChange,
  handleCompensationChange,
  inputClass,
  selectOptions,
  platformOptions,
  compensationOptions,
  errors,
}) {
  return (
    <FormSection className="space-y-5">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <div>
          <FieldLabel required>Campaign Title</FieldLabel>
          <Input
            className={inputClass}
            value={formData.campaignTitle}
            onChange={(event) => handleChange("campaignTitle", event.target.value)}
            placeholder="Enter campaign title"
          />
          {errors.campaignTitle && (
            <p className="mt-1 text-xs text-red-500">{errors.campaignTitle}</p>
          )}
        </div>
        <SelectField
          label="Deliverables"
          required
          value={formData.deliverables}
          onChange={(value) => handleChange("deliverables", value)}
          options={selectOptions.deliverables}
          placeholder="Select deliverables"
          inputClass={inputClass}
          error={errors.deliverables}
        />

        <div>
          <FieldLabel required>Platform</FieldLabel>
          <MultiSelect
            options={platformOptions}
            value={formData.platforms}
            onChange={(value) => {
              handleChange("platforms", value);
              if (!value || !value.includes("other")) {
                handleChange("otherPlatform", "");
              }
            }}
            placeholder="Select one or more platforms"
          />
          {errors.platforms && (
            <p className="mt-1 text-xs text-red-500">{errors.platforms}</p>
          )}
          {formData.platforms && formData.platforms.includes("other") && (
            <div className="mt-3">
              <Input
                className={inputClass}
                value={formData.otherPlatform}
                onChange={(e) => handleChange("otherPlatform", e.target.value)}
                placeholder="Add other platform (specify)"
              />
              {errors.otherPlatform && (
                <p className="mt-1 text-xs text-red-500">{errors.otherPlatform}</p>
              )}
            </div>
          )}
          <p className="mt-2 text-xs text-gray-500">
            Select one or more platforms for this campaign
          </p>
        </div>

        <div>
          <SelectField
            label="Usage Rights Included"
            required
            value={formData.usageRights}
            onChange={(value) => {
              handleChange("usageRights", value);
              if (value !== "custom") {
                handleChange("customUsageRights", "");
              }
            }}
            options={selectOptions.usageRights}
            placeholder="Select usage rights"
            inputClass={inputClass}
            error={errors.usageRights}
          />

          {formData.usageRights === "custom" && (
            <div className="mt-3">
              <Input
                className={inputClass}
                value={formData.customUsageRights || ""}
                onChange={(event) =>
                  handleChange("customUsageRights", event.target.value)
                }
                placeholder="Enter custom usage rights"
              />
              {errors.customUsageRights && (
                <p className="mt-1 text-xs text-red-500">{errors.customUsageRights}</p>
              )}
            </div>
          )}
        </div>

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
                  className={`relative flex py-3 items-center justify-center gap-3 rounded-lg h-[48px] border text-base font-semibold overflow-hidden transition-colors ease-in-out ${isSelected
                      ? "border-[#1D4D8E] bg-gradient-to-r from-[#0F57A7] to-[#1085C8] text-white "
                      : "border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1] hover:bg-white"
                    }`}
                >
                  <Icon className="h-6 w-6" />
                  <span className="leading-none text-sm font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
          {errors.compensationType && (
            <p className="mt-1 text-xs text-red-500">{errors.compensationType}</p>
          )}
        </div>

        {formData.compensationType === "cash" && (
          <>
            <div>
              <FieldLabel required>Min Budget (R)</FieldLabel>
              <Input
                className={inputClass}
                value={formData.minBudget}
                onChange={(event) => handleChange("minBudget", event.target.value)}
                placeholder="R 150"
                inputMode="numeric"
              />
              {errors.minBudget && (
                <p className="mt-1 text-xs text-red-500">{errors.minBudget}</p>
              )}
            </div>

            <div>
              <FieldLabel required>Max Budget (R)</FieldLabel>
              <Input
                className={inputClass}
                value={formData.maxBudget}
                onChange={(event) => handleChange("maxBudget", event.target.value)}
                placeholder="R 300"
                inputMode="numeric"
              />
              {errors.maxBudget && (
                <p className="mt-1 text-xs text-red-500">{errors.maxBudget}</p>
              )}
            </div>
          </>
        )}

        {formData.compensationType === "gift" && (
          <div className="md:col-span-2">
            <GiftPremiumCard />
          </div>
        )}

        <SelectField
          label="Product Status"
          required
          value={formData.productStatus}
          onChange={(value) => handleChange("productStatus", value)}
          options={selectOptions.productStatus}
          inputClass={inputClass}
          error={errors.productStatus}
        />

        <SelectField
          label="Whitelisting / Spark Ads"
          value={formData.whitelisting}
          onChange={(value) => handleChange("whitelisting", value)}
          options={selectOptions.whitelisting}
          inputClass={inputClass}
        />

        <div className="md:col-span-2">
          <FieldLabel>Campaign Goal / Objective</FieldLabel>
          <Input
            className={inputClass}
            value={formData.campaignGoal}
            onChange={(event) => handleChange("campaignGoal", event.target.value)}
            placeholder="e.g., Drive conversions, Brand awareness, Educate audience (Max 50 words)"
          />
        </div>
      </div>
    </FormSection>
  );
}

export function TargetAudienceSection({
  formData,
  handleChange,
  inputClass,
  selectOptions,
  locationOptions,
  errors = {},
}) {
  return (
    <FormSection title="Target Audience">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <SelectField
          label="Age Range"
          value={formData.ageRange}
          onChange={(value) => handleChange("ageRange", value)}
          options={selectOptions.ageRange}
          inputClass={inputClass}
          error={errors.ageRange}
        />
        <SelectField
          label="Gender"
          value={formData.gender}
          onChange={(value) => handleChange("gender", value)}
          options={selectOptions.gender}
          inputClass={inputClass}
          error={errors.gender}
        />
        <SelectField
          label="Location / City"
          value={formData.locationCountry}
          onChange={(value) => handleChange("locationCountry", value)}
          options={locationOptions}
          inputClass={inputClass}
          error={errors.locationCountry}
        />
        <SelectField
          label="Number of Creators"
          value={formData.numberOfCreators}
          onChange={(value) => handleChange("numberOfCreators", value)}
          options={selectOptions.numberOfCreators}
          inputClass={inputClass}
          error={errors.numberOfCreators}
        />
        <SelectField
          label="Follower Count"
          value={formData.followerCount}
          onChange={(value) => handleChange("followerCount", value)}
          options={selectOptions.followerCount}
          inputClass={inputClass}
          error={errors.followerCount}
        />
        <SelectField
          label="Engagement Rate"
          value={formData.engagementRate}
          onChange={(value) => handleChange("engagementRate", value)}
          options={selectOptions.engagementRate}
          inputClass={inputClass}
          error={errors.engagementRate}
        />
        <div className="md:col-span-2">
          <FieldLabel>Additional Audience Details (Optional)</FieldLabel>
          <Input
            className={inputClass}
            value={formData.additionalAudienceDetails}
            onChange={(event) =>
              handleChange("additionalAudienceDetails", event.target.value)
            }
            placeholder="e.g., Gen Z women interested in sustainable fashion; Busy parents looking for meal prep hacks"
          />
        </div>
      </div>
    </FormSection>
  );
}

export function CreativeDirectionSection({
  formData,
  handleChange,
  inputClass,
  selectOptions,
  addOnInput,
  setAddOnInput,
  handleAddOnKeyDown,
  handleRemoveAddOn,
  errors,
}) {
  return (
    <FormSection>
      <div>
        <FieldLabel>Key Message</FieldLabel>
        <Input
          className={inputClass}
          value={formData.keyMessage}
          onChange={(event) => handleChange("keyMessage", event.target.value)}
          placeholder="e.g., This serum saves you 10 minutes in the morning"
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <FieldLabel required>Campaign Brief</FieldLabel>
          {/* <button
            type="button"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#1E60DB]"
          >
            Made With AI
          </button> */}
        </div>
        <Textarea
          className={`${inputClass} min-h-[130px]`}
          value={formData.campaignBrief}
          onChange={(event) => handleChange("campaignBrief", event.target.value)}
          placeholder="Enter your campaign title here..."
        />
        {errors.campaignBrief && (
          <p className="mt-1 text-xs text-red-500">{errors.campaignBrief}</p>
        )}
      </div>

      <FormSection title="Creative Direction">
        <div className="rounded-xl border border-gray-200 p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Video Structure
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField
              label="Hook"
              value={formData.hook}
              onChange={(value) => handleChange("hook", value)}
              options={selectOptions.hook}
              inputClass={inputClass}
            />
            <SelectField
              label="Problem"
              value={formData.problem}
              onChange={(value) => handleChange("problem", value)}
              options={selectOptions.problem}
              inputClass={inputClass}
            />
            <SelectField
              label="Solution"
              value={formData.solution}
              onChange={(value) => handleChange("solution", value)}
              options={selectOptions.solution}
              inputClass={inputClass}
            />
            <div>
              <FieldLabel>CTA</FieldLabel>
              <Input
                className={inputClass}
                value={formData.cta}
                onChange={(event) => handleChange("cta", event.target.value)}
                placeholder="e.g., Link in bio to shop now"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Aesthetic / Vibe
          </p>
          <Input
            className={inputClass}
            value={formData.aestheticVibe}
            onChange={(event) => handleChange("aestheticVibe", event.target.value)}
            placeholder="e.g., Clean, minimalist, morning routine vibes, natural lighting"
          />
        </div>

        <div className="rounded-xl border border-gray-200 p-4">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
            Tone / Voice
          </p>
          <Textarea
            className={`${inputClass} min-h-[84px]`}
            value={formData.toneVoice}
            onChange={(event) => handleChange("toneVoice", event.target.value)}
            placeholder="e.g., Conversational tone, speak directly to camera, keep it under 20 seconds"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <FieldLabel>Do's</FieldLabel>
            <Textarea
              className={`${inputClass} min-h-[110px]`}
              value={formData.dos}
              onChange={(event) => handleChange("dos", event.target.value)}
              placeholder="Show product clearly\nMaintain brand tone\nBe authentic"
            />
          </div>
          <div>
            <FieldLabel>Don'ts</FieldLabel>
            <Textarea
              className={`${inputClass} min-h-[110px]`}
              value={formData.donts}
              onChange={(event) => handleChange("donts", event.target.value)}
              placeholder="Use competitor products\nMake false claims\nInclude copyrighted content"
            />
          </div>
        </div>

        <div>
          <FieldLabel>Add-Ons</FieldLabel>
          <Input
            className={inputClass}
            value={addOnInput}
            onChange={(event) => setAddOnInput(event.target.value)}
            onKeyDown={handleAddOnKeyDown}
            placeholder="e.g., Raw Footage, 2 Hooks, 2 Still Images (Press Enter to add)"
          />
          <p className="mt-2 text-xs text-gray-500">
            Press Enter after typing each requirement to add it as a tag
          </p>

          {formData.addOns.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.addOns.map((item, index) => (
                <button
                  key={`${item}-${index}`}
                  type="button"
                  onClick={() => handleRemoveAddOn(index)}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs text-[#1E60DB]"
                >
                  {item} ×
                </button>
              ))}
            </div>
          )}
        </div>
      </FormSection>
    </FormSection>
  );
}

export function SchedulingSection({ formData, handleChange, inputClass, errors = {} }) {
  return (
    <FormSection>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <DateField
          label="Campaign Starts"
          value={formData.campaignStarts}
          onChange={(value) => handleChange("campaignStarts", value)}
        />
        {errors.campaignStarts && (
          <p className="-mt-3 text-xs text-red-500">{errors.campaignStarts}</p>
        )}
        <DateField
          label="Application Deadline"
          value={formData.applicationDeadline}
          onChange={(value) => handleChange("applicationDeadline", value)}
        />
        {errors.applicationDeadline && (
          <p className="-mt-3 text-xs text-red-500">{errors.applicationDeadline}</p>
        )}

        <div className="md:col-span-2">
          <FieldLabel>Pet's Required</FieldLabel>
          <div className="flex items-center gap-6">
            {['yes', 'no'].map((choice) => (
              <label
                key={choice}
                className="inline-flex cursor-pointer items-center gap-2 text-sm text-gray-700"
              >
                <input
                  type="radio"
                  name="petsRequired"
                  value={choice}
                  checked={formData.petsRequired === choice}
                  onChange={(event) => handleChange("petsRequired", event.target.value)}
                  className="h-4 w-4 border-gray-300 text-[#1E60DB] focus:ring-[#1E60DB]"
                />
                {choice[0].toUpperCase() + choice.slice(1)}
              </label>
            ))}
          </div>
        </div>

        {formData.petsRequired === "yes" && (
          <div>
            <FieldLabel>Type Of Pet</FieldLabel>
            <Input
              className={inputClass}
              value={formData.typeOfPet}
              onChange={(event) => handleChange("typeOfPet", event.target.value)}
              placeholder="e.g., Dog, Cat"
            />
            {errors.typeOfPet && (
              <p className="mt-1 text-xs text-red-500">{errors.typeOfPet}</p>
            )}
          </div>
        )}
      </div>
    </FormSection>
  );
}

export function AssetsSection({
  formData,
  coverImage,
  moodboards,
  existingCoverPreviewUrl,
  existingMoodboardPreviewUrls = [null, null, null],
  handleChange,
  handleFileDrop,
  handleCoverImageChange,
  handleMoodboardChange,
  handleMoodboardDrop,
  inputClass,
  uploadImg,
  errors = {},
}) {
  return (
    <FormSection>
      <UploadBox
        title="Upload Cover Image"
        file={coverImage}
        existingPreviewUrl={existingCoverPreviewUrl ?? undefined}
        onChange={(event) => handleCoverImageChange(event.target.files?.[0] || null)}
        onDrop={(event) => handleFileDrop(event, handleCoverImageChange)}
        uploadImg={uploadImg}
        error={errors.coverImage}
      />

      <div>
        <FieldLabel>Moodboard / Inspiration / Examples / Previous Campaigns</FieldLabel>
        <p className="mb-2 text-xs font-semibold text-gray-500">NOTE:</p>
        <p className="mb-3 text-xs text-gray-500">
          Show your creators what type of content you're looking for.
        </p>

        <div className="mb-4 flex items-center gap-6 text-sm">
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="moodboardSource"
              checked={formData.moodboardSource === "url"}
              onChange={() => handleChange("moodboardSource", "url")}
              className="h-4 w-4 text-[#1E60DB]"
            />
            URL
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="radio"
              name="moodboardSource"
              checked={formData.moodboardSource === "upload"}
              onChange={() => handleChange("moodboardSource", "upload")}
              className="h-4 w-4 text-[#1E60DB]"
            />
            Upload Images
          </label>
        </div>

        {formData.moodboardSource === "upload" ? (
          <div>
            <FieldLabel>Upload Moodboard (Max 3 Moodboards)</FieldLabel>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {moodboards.map((file, index) => (
                <UploadBox
                  key={index}
                  title=""
                  file={file}
                  existingPreviewUrl={
                    file
                      ? undefined
                      : existingMoodboardPreviewUrls[index] ?? undefined
                  }
                  compact
                  onChange={(event) =>
                    handleMoodboardChange(index, event.target.files?.[0] || null)
                  }
                  onDrop={(event) =>
                    handleMoodboardDrop
                      ? handleMoodboardDrop(event, index)
                      : handleFileDrop(event, (f) => handleMoodboardChange(index, f))
                  }
                  uploadImg={uploadImg}
                  error={errors[`moodboard_${index}`]}
                />
              ))}
            </div>
          </div>
        ) : (
          <div>
            <Input
              className={inputClass}
              value={formData.moodboardUrl}
              onChange={(event) => handleChange("moodboardUrl", event.target.value)}
              placeholder="Paste moodboard URL"
            />
            {errors.moodboardUrl && (
              <p className="mt-1 text-xs text-red-500">{errors.moodboardUrl}</p>
            )}
          </div>
        )}
      </div>
    </FormSection>
  );
}
