import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  Sparkles,
} from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { MultiSelect } from "../../../components/ui/multi-select";
import ModuleActionButton from "../../../components/common/ModuleActionButton";
import uploadimg from "../../../assets/images/campaign/upload.svg";
import {
  platformOptions,
  locationOptions,
  compensationOptions,
  selectOptions,
} from "./campaignFormOptions";
import {
  CampaignBasicsSection,
  TargetAudienceSection,
  CreativeDirectionSection,
  SchedulingSection,
  AssetsSection,
} from "./components/CampaignFormSections";
import { useCampaignForm } from "./hooks/useCampaignForm";
import {
  resolveOptionValue,
  resolveDeliverablesValue,
  mapPlatformApiToValues,
  resolveLocationValue,
  parsePetsRequired,
  resolveNumberCreators,
  firstCoercedFromApi,
} from "./campaignFormHydrationUtils";


const inputClass =
  "bg-white h-[48px] px-[16px] border-[#e5e7eb] border-[0.8px] border-solid rounded-[12px] font-['Manrope:Regular',sans-serif] text-[14px] text-[#1e293b] placeholder:text-[rgba(30,41,59,0.5)] tracking-[-0.3px] outline-none focus:border-[#0353a4] transition-colors";

export default function CampaignForm({
  title = "Create Campaign",
  subtitle = "Complete all steps to create a new campaign",
  submitLabel = "Publish Campaign",
  onSubmit: externalSubmit,
  onActionButton,
  initialCampaignData = null,
  isReadOnly = false,
}) {
  const navigate = useNavigate();
  const {
    formData,
    setFormData,
    coverImage,
    setCoverImage,
    moodboards,
    addOnInput,
    setAddOnInput,
    errors,
    handleChange,
    handleCompensationChange,
    handleFileDrop,
    handleCoverImageChange,
    handleMoodboardChange,
    handleMoodboardDrop,
    handleAddOnKeyDown,
    handleRemoveAddOn,
    validateForm,
  } = useCampaignForm();

  const [persistedMediaUrls, setPersistedMediaUrls] = useState({
    cover: null,
    moodboards: [null, null, null],
  });

  useEffect(() => {
    if (!initialCampaignData) return;

    const campaign = initialCampaignData?.campaign ?? initialCampaignData;
    if (!campaign) return;

    const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
    const toInputDate = (value) => {
      if (!value) return "";
      const d = new Date(value);
      if (Number.isNaN(d.getTime())) return "";
      return d.toISOString().slice(0, 10);
    };

    const platformValues = mapPlatformApiToValues(campaign.platform);

    const moodSlots = [null, null, null];
    const mb = campaign?.media?.moodboards;
    if (Array.isArray(mb)) {
      mb.slice(0, 3).forEach((item, i) => {
        moodSlots[i] =
          item?.mediaDetails?.url ?? item?.url ?? null;
      });
    }

    setPersistedMediaUrls({
      cover:
        campaign?.media?.coverImage?.mediaDetails?.url ??
        campaign?.media?.coverImage?.url ??
        null,
      moodboards: moodSlots,
    });

    const locationValue = resolveLocationValue(campaign.location);
    const usageRightsRaw =
      campaign.usageRightsIncluded ?? campaign.usageRights ?? "";
    const usageRightsValue = resolveOptionValue(
      selectOptions.usageRights,
      usageRightsRaw
    );

    const videoParts = String(campaign?.creativeDirection?.videoStructure || "")
      .split("->")
      .map((s) => s.trim());

    const normalizedFormData = {
      campaignTitle: campaign.campaignTitle || "",
      deliverables: resolveDeliverablesValue(campaign.deliverables),
      platforms: platformValues,
      usageRights: usageRightsValue || (usageRightsRaw ? "custom" : ""),
      customUsageRights: usageRightsValue ? "" : String(usageRightsRaw || ""),
      productServiceUrl: campaign.productServiceUrl || "",
      compensationType: (() => {
        const t = String(campaign.compensationType || "").toLowerCase();
        if (t.includes("gift")) return "gift";
        if (t.includes("cash") || t.includes("paid")) return "cash";
        return "";
      })(),
      minBudget: campaign.minBudget ? String(campaign.minBudget) : "",
      maxBudget: campaign.maxBudget ? String(campaign.maxBudget) : "",
      giftName: campaign.giftNameDescription || "",
      otherPlatform: "",
      productStatus: resolveOptionValue(
        selectOptions.productStatus,
        campaign.productStatus
      ),
      whitelisting: (() => {
        const raw = String(campaign.whitelistingSparkAds || "").toLowerCase();
        if (raw.includes("not")) return "not_required";
        if (raw.includes("required") || raw.includes("mandatory")) return "required";
        return (
          resolveOptionValue(
            selectOptions.whitelisting,
            campaign.whitelistingSparkAds
          ) || ""
        );
      })(),
      campaignGoal: campaign.campaignGoal || "",
      ageRange: resolveOptionValue(
        selectOptions.ageRange,
        firstCoercedFromApi(campaign.ageRange)
      ),
      gender: resolveOptionValue(
        selectOptions.gender,
        firstCoercedFromApi(campaign.gender)
      ),
      locationCountry: locationValue,
      numberOfCreators: resolveNumberCreators(
        campaign.numberOfCreators ?? campaign.creatorsNeeded
      ),
      followerCount: resolveOptionValue(
        selectOptions.followerCount,
        campaign.followerCount
      ),
      engagementRate: resolveOptionValue(
        selectOptions.engagementRate,
        campaign.engagementRate
      ),
      additionalAudienceDetails: campaign.additionalAudienceDetails || "",
      keyMessage: campaign.keyMessage || "",
      campaignBrief: campaign.campaignBrief || "",
      hook: resolveOptionValue(selectOptions.hook, videoParts[0]) || "",
      problem:
        resolveOptionValue(selectOptions.problem, videoParts[1]) || "",
      solution:
        resolveOptionValue(selectOptions.solution, videoParts[2]) || "",
      cta: videoParts[3] || "",
      aestheticVibe: campaign?.creativeDirection?.aestheticVibe || "",
      toneVoice: campaign?.creativeDirection?.scriptingApproach || "",
      dos: Array.isArray(campaign.dos) ? campaign.dos.join("\n") : String(campaign.dos || ""),
      donts: Array.isArray(campaign.donts)
        ? campaign.donts.join("\n")
        : String(campaign.donts || ""),
      addOns: toArray(campaign.addOns),
      campaignStarts: toInputDate(campaign.campaignStarts),
      applicationDeadline: toInputDate(campaign.applicationDeadline),
      petsRequired: parsePetsRequired(campaign),
      typeOfPet: campaign.typeOfPet || "",
      moodboardSource:
        String(campaign.moodboardsInspiration || "").toLowerCase().includes("upload")
          ? "upload"
          : campaign.moodboardInspirationUrl
            ? "url"
            : "upload",
      moodboardUrl: campaign.moodboardInspirationUrl || "",
    };

    setFormData((prev) => ({ ...prev, ...normalizedFormData }));
  }, [initialCampaignData, setFormData]);

  const buildCampaignPayload = () => {
    const toPositiveInteger = (value) => {
      const raw = String(value ?? "").trim();
      if (!raw) return "";
      const match = raw.match(/\d+/);
      if (!match) return "";
      const parsed = Number.parseInt(match[0], 10);
      return Number.isInteger(parsed) && parsed > 0 ? parsed : "";
    };

    const sanitizeBudget = (value) => {
      const raw = String(value ?? "").trim();
      if (!raw) return "";
      const cleaned = raw.replace(/[^\d.]/g, "");
      if (!cleaned) return "";
      const parsed = Number.parseFloat(cleaned);
      return Number.isFinite(parsed) && parsed > 0 ? String(parsed) : "";
    };

    const normalizeUrl = (value) => {
      const raw = String(value ?? "").trim();
      if (!raw) return "";
      const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
      try {
        const url = new URL(withProtocol);
        return url.toString();
      } catch {
        return "";
      }
    };

    const petsRequired = formData.petsRequired === "yes";
    const videoStructure = [
      formData.hook,
      formData.problem,
      formData.solution,
      formData.cta,
    ]
      .filter(Boolean)
      .join(" -> ");

    const getLabel = (options, value) =>
      options.find((option) => option.value === value)?.label || "";

    const platformLabels = (formData.platforms || [])
      .map((value) => getLabel(platformOptions, value))
      .filter(Boolean);

    const locationLabel = getLabel(locationOptions, formData.locationCountry);
    const locationLabels =
      formData.locationCountry === "all"
        ? locationOptions
            .filter((option) => option.value !== "all")
            .map((option) => option.label)
        : locationLabel
          ? [locationLabel]
          : [];

    const deliverablesLabel = getLabel(
      selectOptions.deliverables,
      formData.deliverables
    );
    const usageRightsLabel = getLabel(
      selectOptions.usageRights,
      formData.usageRights
    );
    const usageRightsPayload =
      formData.usageRights === "custom"
        ? String(formData.customUsageRights || "").trim()
        : usageRightsLabel;
    const productStatusLabel = getLabel(
      selectOptions.productStatus,
      formData.productStatus
    );
    const whitelistingLabel = getLabel(
      selectOptions.whitelisting,
      formData.whitelisting
    );
    const ageRangeLabel = getLabel(selectOptions.ageRange, formData.ageRange);
    const genderLabel = getLabel(selectOptions.gender, formData.gender);
    const followerCountLabel = getLabel(
      selectOptions.followerCount,
      formData.followerCount
    );
    const engagementRateLabel = getLabel(
      selectOptions.engagementRate,
      formData.engagementRate
    );
    const compensationLabel =
      compensationOptions.find(
        (option) => option.value === formData.compensationType
      )?.label || "";
    const moodboardSourceLabel =
      formData.moodboardSource === "upload" ? "Upload Images" : "URL";

    const normalizeTextList = (value) => {
      if (Array.isArray(value)) {
        return value.map((item) => String(item).trim()).filter(Boolean).join("\n");
      }
      return String(value || "")
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean)
        .join("\n");
    };

    return {
      campaignTitle: formData.campaignTitle,
      deliverables: deliverablesLabel,
      platform: platformLabels,
      location: locationLabels,
      numberOfCreators: toPositiveInteger(formData.numberOfCreators),
      productServiceUrl: formData.productServiceUrl,
      addOns: formData.addOns,
      ageRange: ageRangeLabel ? [ageRangeLabel] : [],
      gender: genderLabel ? [genderLabel] : [],
      usageRightsIncluded: usageRightsPayload,
      productStatus: productStatusLabel,
      compensationType: compensationLabel,
      minBudget:
        formData.compensationType === "cash" ? sanitizeBudget(formData.minBudget) : "",
      maxBudget:
        formData.compensationType === "cash" ? sanitizeBudget(formData.maxBudget) : "",
      giftNameDescription:
        formData.compensationType === "gift" ? formData.giftName : "",
      whitelistingSparkAds: whitelistingLabel,
      campaignGoal: formData.campaignGoal,
      followerCount: followerCountLabel,
      engagementRate: engagementRateLabel,
      additionalAudienceDetails: formData.additionalAudienceDetails,
      keyMessage: formData.keyMessage,
      campaignBrief: formData.campaignBrief,
      creativeDirection: {
        videoStructure,
        aestheticVibe: formData.aestheticVibe,
        scriptingApproach: formData.toneVoice,
      },
      dos: normalizeTextList(formData.dos),
      donts: normalizeTextList(formData.donts),
      applicationDeadline: formData.applicationDeadline,
      campaignStarts: formData.campaignStarts,
      petsRequired,
      typeOfPet: petsRequired ? formData.typeOfPet : "",
      moodboardsInspiration: moodboardSourceLabel,
      moodboardInspirationUrl:
        formData.moodboardSource === "url" ? normalizeUrl(formData.moodboardUrl) : "",
      coverImage,
      moodboards: moodboards.filter(Boolean),
    };
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isReadOnly) return;
    if (!validateForm()) return;
    const submissionData = buildCampaignPayload();

    if (externalSubmit) {
      return externalSubmit({
        formData: submissionData,
        productImage: coverImage,
        moodboards: moodboards.find(Boolean) || null,
        moodboardFiles: moodboards.filter(Boolean),
      });
    }

    console.log("Campaign form payload", submissionData);
  };

  const handleDiscard = () => navigate(-1);

  const getActionPayload = () => ({
    module: "south-africa",
    formData,
    coverImage,
    moodboards,
  });

  const handleActionButton = ({ actionKey, payload, event }) => {
    onActionButton?.({ actionKey, payload, event });

    if (actionKey === "discard") {
      event?.preventDefault();
      handleDiscard();
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] px-5 py-8 sm:px-8 lg:px-12">
      <div className="mx-auto w-full max-w-[1880px]">
        <button
          type="button"
          onClick={handleDiscard}
          className="mb-6 inline-flex items-center gap-2 text-[#64748B] hover:text-[#334155]
           text-[13px] md:text-[14px] leading-[21px] tracking-[-0.3px]"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to Campaign Management
        </button>

        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold leading-none text-[#111827]  md:text-2xl
            
             text-[24px] md:text-[28px] lg:text-[32px] leading-[1.3] md:leading-[48px] text-[#1f1f1f] tracking-[-0.8px] font-bold
            ">
              {title}
            </h1>
            <p className="mt-3 text-sm text-[#718096] sm:text-sm">{subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <ModuleActionButton
              label="Discard"
              type="button"
              variant="outline"
              actionKey="discard"
              payload={getActionPayload()}
              onAction={handleActionButton}
              className=""
            />
            <ModuleActionButton
              label={submitLabel}
              type="submit"
              variant="filled"
              actionKey="publish"
              payload={getActionPayload()}
              onAction={handleActionButton}
              form="campaign-form"
              disabled={isReadOnly}
              className=""
            />
          </div>
        </div>

        <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 sm:p-7 lg:p-8">
          <form id="campaign-form" onSubmit={handleSubmit} className="space-y-8">
            <CampaignBasicsSection
              formData={formData}
              handleChange={handleChange}
              handleCompensationChange={handleCompensationChange}
              inputClass={inputClass}
              selectOptions={selectOptions}
              platformOptions={platformOptions}
              compensationOptions={compensationOptions}
              errors={errors}
            />

            <TargetAudienceSection
              formData={formData}
              handleChange={handleChange}
              inputClass={inputClass}
              selectOptions={selectOptions}
              locationOptions={locationOptions}
              errors={errors}
            />

            <CreativeDirectionSection
              formData={formData}
              handleChange={handleChange}
              inputClass={inputClass}
              selectOptions={selectOptions}
              addOnInput={addOnInput}
              setAddOnInput={setAddOnInput}
              handleAddOnKeyDown={handleAddOnKeyDown}
              handleRemoveAddOn={handleRemoveAddOn}
              errors={errors}
            />

            <SchedulingSection
              formData={formData}
              handleChange={handleChange}
              inputClass={inputClass}
              errors={errors}
            />

            <AssetsSection
              formData={formData}
              coverImage={coverImage}
              moodboards={moodboards}
              existingCoverPreviewUrl={
                coverImage ? null : persistedMediaUrls.cover
              }
              existingMoodboardPreviewUrls={persistedMediaUrls.moodboards}
              handleChange={handleChange}
              handleCoverImageChange={handleCoverImageChange}
              handleMoodboardChange={handleMoodboardChange}
              handleMoodboardDrop={handleMoodboardDrop}
              handleFileDrop={handleFileDrop}
              inputClass={inputClass}
              uploadImg={uploadimg}
              errors={errors}
            />

            <div className="flex flex-wrap items-center justify-start gap-3 pt-3">
              <ModuleActionButton
                label="Discard"
                type="button"
                variant="outline"
                actionKey="discard"
                payload={getActionPayload()}
                onAction={handleActionButton}
              />
              <ModuleActionButton
                label={submitLabel}
                type="submit"
                variant="filled"
                actionKey="publish"
                payload={getActionPayload()}
                onAction={handleActionButton}
                disabled={isReadOnly}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
