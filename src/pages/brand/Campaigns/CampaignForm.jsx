import React, { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Modal } from "antd";
import { ChevronLeft, CheckCircle2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import uploadimg from "../../../assets/images/campaign/upload.svg";
import {
  platformOptions,
  locationOptions,
  compensationOptions,
  selectOptions,
} from "./campaignFormOptions";
import { useCampaignForm } from "./hooks/useCampaignForm";
import {
  resolveOptionValue,
  resolveDeliverablesValue,
  mapPlatformApiToValues,
  resolveLocationValue,
  parsePetsRequired,
  firstCoercedFromApi,
} from "./campaignFormHydrationUtils";
import { CAMPAIGN_CREATE_STEPS } from "./data/campaignCreateStepsData";
import { calculateCampaignInvoice } from "./utils/campaignCreatePricingUtils";
import {
  validateCampaignCreateStep,
  validateFullCampaignForm,
  findFirstInvalidStepKey,
  MAX_CAMPAIGN_CREATORS,
} from "./utils/campaignCreateStepUtils";
import {
  fromApiVideoLength,
  mapApiInvoiceToDisplay,
  resolveAddOnIdsFromApi,
  extractSavedCampaign,
} from "./utils/campaignApiMappers";
import {
  buildCampaignPayload,
  buildPricingSignature,
  getApiErrorMessage,
} from "./utils/campaignFormPayload";
import CampaignCreateStepper from "./components/create/CampaignCreateStepper";
import CampaignCreateSidebar from "./components/create/CampaignCreateSidebar";
import StepCampaignBasics from "./components/create/steps/StepCampaignBasics";
import StepTargetAudience from "./components/create/steps/StepTargetAudience";
import StepCreativeDirection from "./components/create/steps/StepCreativeDirection";
import StepMoodboard from "./components/create/steps/StepMoodboard";
import StepAddOns from "./components/create/steps/StepAddOns";
import StepReviewPublish from "./components/create/steps/StepReviewPublish";

const inputClass =
  "bg-white h-[48px] px-[16px] border-[#e5e7eb] border-[0.8px] border-solid rounded-[12px] text-[14px] text-[#1e293b] placeholder:text-[rgba(30,41,59,0.5)] tracking-[-0.3px] outline-none focus:border-[#0353a4] transition-colors";

export default function CampaignForm({
  title = "Create Campaign",
  subtitle = "Complete all steps to create a new campaign.",
  submitLabel = "Publish Campaign",
  continueLabel,
  onSaveCampaign,
  onPublishCampaign,
  onFinalSave,
  onSaveSuccess,
  initialCampaignData = null,
  initialStep = 1,
  isReadOnly = false,
  isSubmitting = false,
  fundingQuote,
  onQuoteChange,
}) {
  const navigate = useNavigate();
  const safeInitialStep = Math.max(1, Math.min(initialStep, CAMPAIGN_CREATE_STEPS.length));
  const [currentStep, setCurrentStep] = useState(safeInitialStep);
  const [campaignPublicId, setCampaignPublicId] = useState(null);
  const [apiInvoice, setApiInvoice] = useState(null);
  const [savedPricingSignature, setSavedPricingSignature] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [saveSuccessOpen, setSaveSuccessOpen] = useState(false);

  const {
    formData,
    setFormData,
    coverImage,
    moodboards,
    errors,
    setErrors,
    handleChange,
    handleCompensationChange,
    handleToggleAddOn,
    handleFileDrop,
    handleCoverImageChange,
    handleMoodboardChange,
  } = useCampaignForm();

  const [persistedMediaUrls, setPersistedMediaUrls] = useState({
    cover: null,
    moodboards: [null, null, null],
  });

  const isGiftCampaign = formData.compensationType === "gift";

  const getValidationExtras = useCallback(
    () => ({
      coverImage: coverImage || persistedMediaUrls.cover,
      moodboards,
      existingMoodboardUrls: persistedMediaUrls.moodboards,
    }),
    [coverImage, moodboards, persistedMediaUrls]
  );

  const validateAllSteps = useCallback(() => {
    const nextErrors = validateFullCampaignForm(formData, getValidationExtras());
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [formData, getValidationExtras, setErrors]);

  const validateCurrentStep = useCallback(() => {
    const stepKey = CAMPAIGN_CREATE_STEPS[currentStep - 1]?.key;
    const stepErrors = validateCampaignCreateStep(stepKey, formData, getValidationExtras());
    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  }, [currentStep, formData, getValidationExtras, setErrors]);

  useEffect(() => {
    if (!initialCampaignData) return;

    const campaign = initialCampaignData?.campaign ?? initialCampaignData;
    if (!campaign) return;

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
        moodSlots[i] = item?.mediaDetails?.url ?? item?.url ?? null;
      });
    }

    setPersistedMediaUrls({
      cover:
        campaign?.media?.coverImage?.mediaDetails?.url ??
        campaign?.media?.coverImage?.url ??
        null,
      moodboards: moodSlots,
    });

    const videoParts = String(campaign?.creativeDirection?.videoStructure || "")
      .split("->")
      .map((s) => s.trim());

    const selectedAddOns = resolveAddOnIdsFromApi(campaign.addOns);

    if (campaign.publicId) setCampaignPublicId(campaign.publicId);

    const hydratedVideoLength =
      fromApiVideoLength(campaign.videoLength) ||
      resolveOptionValue(selectOptions.videoLength, campaign.videoLength) ||
      "";

    const hydratedCreators = (() => {
      const raw = campaign.numberOfCreators ?? campaign.creatorsNeeded;
      const digits = String(raw ?? "").replace(/\D/g, "");
      if (!digits) return "";
      const num = Number.parseInt(digits, 10);
      if (!Number.isFinite(num) || num < 1) return "";
      return String(Math.min(MAX_CAMPAIGN_CREATORS, num));
    })();

    if (campaign.invoice) {
      setApiInvoice(campaign.invoice);
      setSavedPricingSignature(
        `${hydratedVideoLength}|${hydratedCreators}|${selectedAddOns.join(",")}`
      );
    }

    setFormData((prev) => ({
      ...prev,
      campaignTitle: campaign.campaignTitle || "",
      deliverables: resolveDeliverablesValue(campaign.deliverables),
      platform: platformValues,
      videoLength: hydratedVideoLength,
      productServiceUrl: campaign.productServiceUrl || "",
      compensationType: (() => {
        const t = String(campaign.compensationType || "").toLowerCase();
        if (t.includes("gift")) return "gift";
        if (t.includes("cash") || t.includes("paid")) return "cash";
        return "";
      })(),
      productStatus: resolveOptionValue(selectOptions.productStatus, campaign.productStatus),
      campaignGoal: campaign.campaignGoal || "",
      ageRange: resolveOptionValue(selectOptions.ageRange, firstCoercedFromApi(campaign.ageRange)),
      gender: resolveOptionValue(selectOptions.gender, firstCoercedFromApi(campaign.gender)),
      locationCountry: resolveLocationValue(campaign.location),
      numberOfCreators: hydratedCreators,
      followerCount: resolveOptionValue(selectOptions.followerCount, campaign.followerCount),
      engagementRate: resolveOptionValue(selectOptions.engagementRate, campaign.engagementRate),
      keyMessage: campaign.keyMessage || "",
      campaignBrief: campaign.campaignBrief || "",
      hook:
        resolveOptionValue(selectOptions.hook, campaign?.creativeDirection?.hookStyle) ||
        resolveOptionValue(selectOptions.hook, videoParts[0]) ||
        "",
      problem: campaign?.creativeDirection?.problem || videoParts[1] || "",
      solution: campaign?.creativeDirection?.solution || videoParts[2] || "",
      cta: campaign?.creativeDirection?.callToAction || videoParts[3] || "",
      aestheticVibe:
        campaign?.creativeDirection?.aestheticVibes ||
        campaign?.creativeDirection?.aestheticVibe ||
        "",
      toneVoice:
        resolveOptionValue(
          selectOptions.toneVoice,
          campaign?.creativeDirection?.scriptingApproach ||
          campaign?.creativeDirection?.toneVoice
        ) || "",
      campaignStarts: toInputDate(campaign.campaignStarts),
      applicationDeadline: toInputDate(campaign.applicationDeadline),
      petsRequired: parsePetsRequired(campaign) === "yes",
      typeOfPet: campaign.typeOfPet || "",
      moodboardSource: campaign.moodboardInspirationUrl ? "url" : "upload",
      moodboardUrl: campaign.moodboardInspirationUrl || "",
      selectedAddOns,
    }));
  }, [initialCampaignData, setFormData]);

  const pricingSignature = buildPricingSignature(formData);

  const estimatedInvoice = useMemo(
    () =>
      calculateCampaignInvoice({
        videoLength: formData.videoLength,
        selectedAddOnIds: formData.selectedAddOns || [],
        numberOfCreators: formData.numberOfCreators,
        isGiftCampaign,
      }),
    [
      formData.videoLength,
      formData.selectedAddOns,
      formData.numberOfCreators,
      isGiftCampaign,
    ]
  );

  const invoice = useMemo(() => {
    const matchesSavedPricing =
      savedPricingSignature != null && savedPricingSignature === pricingSignature;

    if (apiInvoice && matchesSavedPricing && !isGiftCampaign) {
      return mapApiInvoiceToDisplay(apiInvoice) ?? estimatedInvoice;
    }
    return estimatedInvoice;
  }, [apiInvoice, estimatedInvoice, isGiftCampaign, pricingSignature, savedPricingSignature]);

  const currentStepMeta = CAMPAIGN_CREATE_STEPS[currentStep - 1];
  const isReviewStep = currentStepMeta?.key === "review";
  const isAddOnsStep = currentStepMeta?.key === "addons";
  const stepContinueLabel = continueLabel || (isAddOnsStep ? "Save & Continue" : "Continue");
  const canPublish = Boolean(campaignPublicId) || isGiftCampaign;

  const applySaveResponse = (response) => {
    const savedCampaign = extractSavedCampaign(response);
    if (savedCampaign?.publicId) setCampaignPublicId(savedCampaign.publicId);
    if (savedCampaign?.invoice) {
      setApiInvoice(savedCampaign.invoice);
      setSavedPricingSignature(pricingSignature);
    }
    return savedCampaign;
  };

  const notifySaveSuccess = () => {
    setSaveSuccessOpen(true);
    onSaveSuccess?.();
  };

  const persistCampaign = async () => {
    if (!onSaveCampaign) return null;

    const response = await onSaveCampaign({
      formData: buildCampaignPayload(formData),
      productImage: coverImage,
      moodboardFiles: moodboards.filter(Boolean),
      campaignPublicId,
    });

    const savedCampaign = applySaveResponse(response);
    if (!savedCampaign) {
      throw new Error(getApiErrorMessage(response) || "Failed to save campaign.");
    }

    return response;
  };

  const handleSubmit = async (event) => {
    event?.preventDefault?.();
    if (isReadOnly || isSubmitting || isSaving) return;
    setSaveError(null);

    if (isReviewStep) {
      if (!canPublish && onPublishCampaign) {
        setSaveError("Save the campaign on Step 5 before publishing.");
        return;
      }

      if (onPublishCampaign && campaignPublicId && !isGiftCampaign) {
        try {
          await onPublishCampaign(campaignPublicId);
        } catch (error) {
          setSaveError(getApiErrorMessage(error));
        }
        return;
      }

      if (onFinalSave) {
        if (!validateAllSteps()) {
          setCurrentStep(1);
          return;
        }
        setIsSaving(true);
        try {
          await onFinalSave({
            formData: buildCampaignPayload(formData),
            productImage: coverImage,
            moodboardFiles: moodboards.filter(Boolean),
            campaignPublicId,
          });
        } catch (error) {
          setSaveError(getApiErrorMessage(error));
        } finally {
          setIsSaving(false);
        }
        return;
      }

      if (onSaveCampaign) {
        if (!validateAllSteps()) {
          setCurrentStep(1);
          return;
        }
        setIsSaving(true);
        try {
          await persistCampaign();
        } catch (error) {
          setSaveError(getApiErrorMessage(error));
        } finally {
          setIsSaving(false);
        }
      }
      return;
    }

    if (!validateAllSteps()) {
      setCurrentStep(1);
      return;
    }

    setIsSaving(true);
    try {
      await persistCampaign();
    } catch (error) {
      setSaveError(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDraft = async () => {
    if (isReadOnly || isSaving || !onSaveCampaign) return;
    setSaveError(null);
    setIsSaving(true);
    try {
      await persistCampaign();
    } catch (error) {
      setSaveError(getApiErrorMessage(error));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveAndContinue = async () => {
    if (isSaving || isSubmitting) return;
    setSaveError(null);
    if (!validateCurrentStep()) return;

    if (currentStepMeta.key === "addons") {
      if (!validateAllSteps()) {
        const invalidKey = findFirstInvalidStepKey(formData, getValidationExtras());
        if (invalidKey) {
          const stepIndex = CAMPAIGN_CREATE_STEPS.findIndex((s) => s.key === invalidKey);
          if (stepIndex >= 0) setCurrentStep(stepIndex + 1);
        }
        return;
      }

      if (onSaveCampaign) {
        setIsSaving(true);
        try {
          await persistCampaign();
          notifySaveSuccess();
        } catch (error) {
          setSaveError(getApiErrorMessage(error));
          return;
        } finally {
          setIsSaving(false);
        }
      }
    }

    if (currentStep < CAMPAIGN_CREATE_STEPS.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const renderStep = () => {
    switch (currentStepMeta.key) {
      case "basics":
        return (
          <StepCampaignBasics
            formData={formData}
            handleChange={handleChange}
            handleCompensationChange={handleCompensationChange}
            inputClass={inputClass}
            selectOptions={selectOptions}
            platformOptions={platformOptions}
            compensationOptions={compensationOptions}
            errors={errors}
          />
        );
      case "audience":
        return (
          <StepTargetAudience
            formData={formData}
            handleChange={handleChange}
            inputClass={inputClass}
            selectOptions={selectOptions}
            locationOptions={locationOptions}
            errors={errors}
          />
        );
      case "creative":
        return (
          <StepCreativeDirection
            formData={formData}
            handleChange={handleChange}
            inputClass={inputClass}
            selectOptions={selectOptions}
            coverImage={coverImage}
            existingCoverPreviewUrl={coverImage ? null : persistedMediaUrls.cover}
            handleCoverImageChange={handleCoverImageChange}
            handleFileDrop={handleFileDrop}
            uploadImg={uploadimg}
            errors={errors}
          />
        );
      case "moodboard":
        return (
          <StepMoodboard
            formData={formData}
            handleChange={handleChange}
            inputClass={inputClass}
            moodboards={moodboards}
            existingMoodboardPreviewUrls={persistedMediaUrls.moodboards}
            handleMoodboardChange={handleMoodboardChange}
            errors={errors}
          />
        );
      case "addons":
        return (
          <StepAddOns
            formData={formData}
            handleToggleAddOn={handleToggleAddOn}
            hasVideoLength={invoice.hasVideoLength}
            isGiftCampaign={isGiftCampaign}
          />
        );
      case "review":
        return (
          <StepReviewPublish
            formData={formData}
            invoice={invoice}
            campaignPublicId={campaignPublicId}
            onQuoteChange={onQuoteChange}   // ✅ Add
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] px-5 py-8 sm:px-8 lg:px-12">
      <Modal
        open={saveSuccessOpen}
        title="Campaign saved"
        onCancel={() => setSaveSuccessOpen(false)}
        footer={null}
        centered
        destroyOnClose
      >
        <div className="flex gap-3 py-2">
          <CheckCircle2 className="h-10 w-10 shrink-0 text-emerald-500" aria-hidden />
          <div>
            <p className="text-[15px] leading-relaxed text-gray-700">
              Your campaign was saved successfully. You can continue to review and publish,
              or find it in the Draft section on Campaign Management.
            </p>
            <button
              type="button"
              onClick={() => setSaveSuccessOpen(false)}
              className="mt-4 rounded-lg btn-gradient px-4 py-2 text-sm font-medium text-white hover:bg-[#1a54c4]"
            >
              Continue
            </button>
          </div>
        </div>
      </Modal>

      <div className="mx-auto w-full max-w-[1400px]">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 text-[13px] leading-[21px] tracking-[-0.3px] text-[#64748B] hover:text-[#334155] md:text-[14px]"
        >
          <ChevronLeft className="h-5 w-5" />
          Back to Campaign Management
        </button>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-[-0.8px] text-[#1f1f1f] md:text-[28px] lg:text-[32px]">
              {title}
            </h1>
            <p className="mt-2 text-sm text-[#718096]">{subtitle}</p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="h-10 rounded-xl px-5"
            >
              Discard
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={
                isReadOnly ||
                isSubmitting ||
                isSaving ||
                !isReviewStep ||
                (!canPublish && Boolean(onPublishCampaign) && !isGiftCampaign)
              }
              className="h-10 rounded-xl bg-[#0C7BB3] px-5 hover:bg-[#0353A4]"
            >
              {isSubmitting ? "Publishing..." : submitLabel}
            </Button>
          </div>
        </div>

        <CampaignCreateStepper currentStep={currentStep} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div>
            <form id="campaign-form" onSubmit={handleSubmit}>
              {saveError ? (
                <div
                  role="alert"
                  className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {saveError}
                </div>
              ) : null}
              {renderStep()}

              <div className="mt-6 flex flex-wrap items-center justify-start gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(-1)}
                  className="h-11 rounded-xl px-6"
                  disabled={isSaving || isSubmitting}
                >
                  Discard
                </Button>
                {!isReviewStep ? (
                  <Button
                    type="button"
                    onClick={handleSaveAndContinue}
                    disabled={isSaving || isSubmitting}
                    className="h-11 rounded-xl btn-gradient px-6 hover:bg-[#1a54c4]"
                  >
                    {isSaving ? "Saving..." : stepContinueLabel}
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={
                      isReadOnly ||
                      isSubmitting ||
                      isSaving ||
                      (!canPublish && Boolean(onPublishCampaign) && !isGiftCampaign)
                    }
                    className="h-11 rounded-xl btn-gradient px-6 hover:bg-[#1a54c4]"
                  >
                    {isSubmitting || isSaving ? "Submitting..." : submitLabel}
                  </Button>
                )}
              </div>
            </form>
          </div>

          <CampaignCreateSidebar
            currentStep={currentStep}
            invoice={invoice}
            isGiftCampaign={isGiftCampaign}
            onPublish={handleSubmit}
            onSaveDraft={handleSaveDraft}
            publishLabel={submitLabel}
            isPublishing={isSubmitting}
            isSaving={isSaving}
            campaignSaved={Boolean(campaignPublicId)}
            hasPaymentMethod={Boolean(fundingQuote)}
            fundingQuote={fundingQuote}    // ✅ Pass quote, not handler
          />
        </div>
      </div>
    </div>
  );
}
