import React, { useEffect, useState } from "react";
import { AlertCircle, ImageIcon, Link2, Plus } from "lucide-react";
import { Input } from "../../../../../../components/ui/input";
import { FieldLabel } from "../../CampaignFormFields";
import CampaignCreateStepCard, { ChoiceCard } from "../CampaignCreateShared";
import { CAMPAIGN_CREATE_STEPS } from "../../../data/campaignCreateStepsData";

const stepMeta = CAMPAIGN_CREATE_STEPS[3];
const MAX_MOODBOARD_IMAGES = 3;

function MoodboardImageSlot({ file, previewUrl, onSelect, onRemove }) {
  const [objectUrl, setObjectUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setObjectUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setObjectUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const src = file ? objectUrl : previewUrl;

  if (src) {
    return (
      <div className="relative aspect-square overflow-hidden rounded-xl border border-[#E2E8F0]">
        <img src={src} alt="Moodboard" className="h-full w-full object-cover" />
        <button
          type="button"
          onClick={onRemove}
          className="absolute right-2 top-2 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
        >
          Remove
        </button>
      </div>
    );
  }

  return (
    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#CBD5E1] bg-[#FAFAFA] text-[#64748B] hover:border-[#0C7BB3] hover:text-[#0C7BB3]">
      <input type="file" accept=".png,.jpg,.jpeg,.webp" className="hidden" onChange={onSelect} />
      <Plus className="h-6 w-6" />
      <span className="mt-1 text-xs font-medium">Add</span>
    </label>
  );
}

export default function StepMoodboard({
  formData,
  handleChange,
  inputClass,
  moodboards,
  existingMoodboardPreviewUrls = [null, null, null],
  handleMoodboardChange,
  errors,
}) {
  const uploadedCount = moodboards.filter(Boolean).length;
  const nextEmptyIndex = moodboards.findIndex((file) => !file);

  const handleAddImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const index = nextEmptyIndex === -1 ? moodboards.length - 1 : nextEmptyIndex;
    handleMoodboardChange(index, file);
    event.target.value = "";
  };

  return (
    <CampaignCreateStepCard title={stepMeta.title} description={stepMeta.description}>
      <p className="mb-5 text-sm text-[#64748B]">
        Share visual references to help creators understand your brand aesthetic.
      </p>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ChoiceCard
          selected={formData.moodboardSource === "url"}
          onClick={() => handleChange("moodboardSource", "url")}
          icon={Link2}
          title="Reference URL"
          description="Link to a campaign or inspiration"
        />
        <ChoiceCard
          selected={formData.moodboardSource === "upload"}
          onClick={() => handleChange("moodboardSource", "upload")}
          icon={ImageIcon}
          title="Upload Images"
          description="Up to 3 moodboard images"
        />
      </div>

      {formData.moodboardSource === "url" ? (
        <div>
          <FieldLabel>Reference URL</FieldLabel>
          <Input
            className={inputClass}
            value={formData.moodboardUrl}
            onChange={(event) => handleChange("moodboardUrl", event.target.value)}
            placeholder="https://..."
          />
          {errors.moodboardUrl ? (
            <p className="mt-1 text-xs text-red-500">{errors.moodboardUrl}</p>
          ) : null}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {moodboards.map((file, index) => (
              <MoodboardImageSlot
                key={index}
                file={file}
                previewUrl={file ? undefined : existingMoodboardPreviewUrls[index] ?? undefined}
                onSelect={(event) =>
                  handleMoodboardChange(index, event.target.files?.[0] || null)
                }
                onRemove={() => handleMoodboardChange(index, null)}
              />
            ))}
            {uploadedCount < MAX_MOODBOARD_IMAGES && nextEmptyIndex === -1 ? (
              <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-[#CBD5E1] bg-[#FAFAFA] text-[#64748B]">
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={handleAddImage}
                />
                <Plus className="h-6 w-6" />
                <span className="mt-1 text-xs font-medium">Add</span>
              </label>
            ) : null}
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-[#64748B]">
            <AlertCircle className="h-3.5 w-3.5" />
            {uploadedCount}/{MAX_MOODBOARD_IMAGES} images added
          </p>
          {errors.moodboards ? (
            <p className="mt-1 text-xs text-red-500">{errors.moodboards}</p>
          ) : null}
        </div>
      )}
    </CampaignCreateStepCard>
  );
}
