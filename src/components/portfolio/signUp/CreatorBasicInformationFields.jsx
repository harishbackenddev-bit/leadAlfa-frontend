import { useEffect, useMemo, useRef, useState } from "react";
import { Info, Lightbulb, Upload } from "lucide-react";
import {
  SECONDARY_NICHE_NONE,
  creatorFormInputClass,
  creatorSelectOptions,
} from "../../../data/creatorSignupOptions";
import {
  DateField,
  FieldLabel,
} from "../../../pages/brand/Campaigns/components/CampaignFormFields";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { InternationalPhoneField } from "../../ui/phone-input";
import { Textarea } from "../../ui/textarea";
import { MultiSelect } from "../../ui/multi-select";
import { SignupFormSelectField } from "./SignupFormSelectField";
import { ProfilePhotoUploadField } from "./ProfilePhotoUploadField";
import { CreatorDeliveryAddressFields } from "./CreatorDeliveryAddressFields";
import { IntroVideoGuidelinesModal } from "./IntroVideoGuidelinesModal";
import { validateSAIdNumber } from "../../../utils/validateSAIdNumber";
import { checkPublicNameAvailability } from "../../../services/api/apiservices";

function getMax18YearsAgoDate() {
  const today = new Date();
  const year = today.getFullYear() - 18;
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function RadioYesNo({ value, onChange, name, disabled = false }) {
  return (
    <div className="flex gap-8" role="radiogroup" aria-label={name}>
      {["yes", "no"].map((v) => (
        <label
          key={v}
          className={`flex items-center gap-2 text-sm font-medium text-gray-800 ${
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer"
          }`}
        >
          <input
            type="radio"
            name={name}
            checked={value === v}
            onChange={() => !disabled && onChange(v)}
            disabled={disabled}
            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500 disabled:cursor-not-allowed"
          />
          <span className="capitalize">{v}</span>
        </label>
      ))}
    </div>
  );
}

export function CreatorBasicInformationFields({
  form,
  categoryOptions,
  onSocialLogin,
  mode = "signup",
  existingProfilePhotoUrl = "",
  existingIntroVideoUrl = "",
}) {
  const saCitizen = form.watch("saCitizen");
  const publicCreatorNameValue = form.watch("publicCreatorName");
  const maxDobDate = useMemo(() => getMax18YearsAgoDate(), []);
  const [isGuidelinesModalOpen, setIsGuidelinesModalOpen] = useState(false);
  const [nameAvailability, setNameAvailability] = useState({
    checking: false,
    available: null,
    message: "",
  });
  const fileInputRef = useRef(null);

  const secondaryNicheSelectOptions = useMemo(
    () => [
      { label: "— None —", value: SECONDARY_NICHE_NONE },
      ...categoryOptions,
    ],
    [categoryOptions]
  );

  useEffect(() => {
    if (saCitizen === "yes") {
      form.setValue("passportNumber", "");
      form.setValue("residencePermit", undefined);
      form.clearErrors(["passportNumber", "residencePermit"]);
    } else if (saCitizen === "no") {
      form.setValue("saIdNumber", "");
      form.clearErrors(["saIdNumber"]);
    }
  }, [saCitizen, form]);

  // Public Creator Name real-time debounced availability check
  useEffect(() => {
    if (mode === "edit") return;

    const trimmed = (publicCreatorNameValue || "").trim();

    if (!trimmed || trimmed.length < 2 || trimmed.length > 50) {
      setNameAvailability({ checking: false, available: null, message: "" });
      return;
    }

    setNameAvailability({ checking: true, available: null, message: "" });

    const timer = setTimeout(async () => {
      try {
        const res = await checkPublicNameAvailability(trimmed);
        if (res?.available) {
          setNameAvailability({
            checking: false,
            available: true,
            message: "Name is available!",
          });
          if (form.getFieldState("publicCreatorName").error?.type === "manual") {
            form.clearErrors("publicCreatorName");
          }
        } else {
          const msg = res?.message || "This creator name is already taken.";
          setNameAvailability({
            checking: false,
            available: false,
            message: msg,
          });
          form.setError("publicCreatorName", {
            type: "manual",
            message: msg,
          });
        }
      } catch (err) {
        const errorMsg =
          typeof err === "string"
            ? err
            : err?.error || err?.message || "Error checking public name availability";
        setNameAvailability({
          checking: false,
          available: false,
          message: errorMsg,
        });
        form.setError("publicCreatorName", {
          type: "manual",
          message: errorMsg,
        });
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [publicCreatorNameValue, mode, form]);

  return (
    <div className="flex flex-col gap-8">
      {mode !== "edit" ? (
        <div className="text-center">
          <p className="mx-auto mb-2 max-w-lg text-sm text-gray-500">
            Fill out the basic information below to get things rolling.
          </p>
        </div>
      ) : null}
  

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FieldLabel required>First Name</FieldLabel>
              <FormControl>
                <Input
                  placeholder="Enter First Name"
                  className={creatorFormInputClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FieldLabel required>Last Name</FieldLabel>
              <FormControl>
                <Input
                  placeholder="Enter Last Name"
                  className={creatorFormInputClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FieldLabel required>Email</FieldLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter Email"
                  disabled
                  className={creatorFormInputClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FieldLabel required>Phone Number</FieldLabel>
              <FormControl>
                <InternationalPhoneField
                  placeholder="Enter Phone Number"
                  name={field.name}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  className="[--react-international-phone-border-radius:12px] [--react-international-phone-border-color:#e5e7eb]"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="publicCreatorName"
          render={({ field }) => {
            const trimmedValue = (field.value || "").trim();
            const isAvailable =
              nameAvailability.available === true &&
              trimmedValue.length >= 2 &&
              !nameAvailability.checking;
            const isUnavailable =
              nameAvailability.available === false &&
              trimmedValue.length >= 2 &&
              !nameAvailability.checking;

            return (
              <FormItem>
                <FieldLabel required>Public / Creator Name</FieldLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Public / Creator Name"
                    disabled={mode === "edit"}
                    maxLength={50}
                    className={`${creatorFormInputClass} ${
                      isAvailable
                        ? "border-green-500 focus-visible:ring-green-500"
                        : isUnavailable
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                    }`}
                    {...field}
                    onChange={(e) => {
                      const val = e.target.value;
                      field.onChange(val);
                      if (!val.trim() || val.trim().length < 2) {
                        setNameAvailability({ checking: false, available: null, message: "" });
                      }
                    }}
                    onBlur={async (e) => {
                      field.onBlur(e);
                      if (mode === "edit") return;
                      const currentTrimmed = (field.value || "").trim();
                      if (!currentTrimmed || currentTrimmed.length < 2 || currentTrimmed.length > 50) {
                        setNameAvailability({ checking: false, available: null, message: "" });
                        form.trigger("publicCreatorName");
                        return;
                      }
                      const isValid = await form.trigger("publicCreatorName");
                      if (isValid) {
                        try {
                          setNameAvailability({
                            checking: true,
                            available: null,
                            message: "",
                          });
                          const res = await checkPublicNameAvailability(currentTrimmed);
                          if (res?.available) {
                            setNameAvailability({
                              checking: false,
                              available: true,
                              message: "Name is available!",
                            });
                            form.clearErrors("publicCreatorName");
                          } else {
                            const msg =
                              res?.message || "This creator name is already taken.";
                            setNameAvailability({
                              checking: false,
                              available: false,
                              message: msg,
                            });
                            form.setError("publicCreatorName", {
                              type: "manual",
                              message: msg,
                            });
                          }
                        } catch (err) {
                          const errorMsg =
                            typeof err === "string"
                              ? err
                              : err?.error ||
                                err?.message ||
                                "Error checking public name availability";
                          setNameAvailability({
                            checking: false,
                            available: false,
                            message: errorMsg,
                          });
                          form.setError("publicCreatorName", {
                            type: "manual",
                            message: errorMsg,
                          });
                        }
                      }
                    }}
                  />
                </FormControl>
                {nameAvailability.checking && trimmedValue.length >= 2 && (
                  <p className="mt-1 text-xs text-gray-500">Checking availability...</p>
                )}
                {isAvailable && (
                  <p className="mt-1 text-xs font-medium text-green-600">
                    ✓ {nameAvailability.message}
                  </p>
                )}
                {isUnavailable && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    ✗ {nameAvailability.message}
                  </p>
                )}
                {!isAvailable && !isUnavailable && !nameAvailability.checking && (
                  <FormMessage />
                )}
              </FormItem>
            );
          }}
        />
        <FormField
          control={form.control}
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem className="min-w-0">
              <FormControl>
                <DateField
                  label="Date of Birth"
                  required
                  disabled={mode === "edit"}
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  max={maxDobDate}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        <SignupFormSelectField
          control={form.control}
          name="ethnicity"
          label="Ethnicity"
          required
          disabled={mode === "edit"}
          options={creatorSelectOptions.ethnicity}
          placeholder="Select"
          inputClass={creatorFormInputClass}
        />
        <SignupFormSelectField
          control={form.control}
          name="appearance"
          label="Appearance"
          required
          options={creatorSelectOptions.appearance}
          placeholder="Select"
          inputClass={creatorFormInputClass}
        />
        <SignupFormSelectField
          control={form.control}
          name="gender"
          label="Gender"
          required
          disabled={mode === "edit"}
          options={creatorSelectOptions.gender}
          placeholder="Select"
          inputClass={creatorFormInputClass}
        />
      </div>

      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FieldLabel required>Bio</FieldLabel>
            <FormControl>
              <Textarea
                placeholder="Enter Bio"
                rows={4}
                className={`${creatorFormInputClass} min-h-[130px] h-auto resize-y py-3`}
                {...field}
              />
            </FormControl>
            <p className="mt-1.5 text-xs text-gray-500">
              Write about your past works, brands you would like to work with and your skills.
            </p>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="profilePhoto"
        render={({ field: { onChange, value, ref, onBlur, name } }) => (
          <FormItem>
            <FieldLabel required>Profile Photo</FieldLabel>
            <FormControl>
              <ProfilePhotoUploadField
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                inputRef={ref}
                name={name}
                existingImageUrl={existingProfilePhotoUrl}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <FormField
          control={form.control}
          name="saCitizen"
          render={({ field }) => (
            <FormItem>
              <FieldLabel required>South African National?</FieldLabel>
              <FormControl>
                <RadioYesNo
                  value={field.value}
                  onChange={field.onChange}
                  name={field.name}
                  disabled={mode === "edit"}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {saCitizen === "yes" ? (
        <FormField
          control={form.control}
          name="saIdNumber"
          render={({ field }) => (
            <FormItem className="max-w-xl">
              <FieldLabel required>SA ID Number</FieldLabel>
              <FormControl>
                <Input
                  placeholder="13 digits"
                  inputMode={mode === "edit" ? undefined : "numeric"}
                  maxLength={mode === "edit" ? undefined : 13}
                  disabled={mode === "edit"}
                  className={creatorFormInputClass}
                  name={field.name}
                  ref={field.ref}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    if (mode === "edit") return;
                    field.onChange(
                      e.target.value.replace(/\D/g, "").slice(0, 13)
                    );
                  }}
                  onBlur={(e) => {
                    field.onBlur();
                    if (mode === "edit") return;
                    const value = e.target.value.trim();
                    if (!value) {
                      form.clearErrors("saIdNumber");
                      return;
                    }
                    const result = validateSAIdNumber(value);
                    if (!result.valid) {
                      form.setError("saIdNumber", {
                        type: "manual",
                        message: result.message,
                      });
                    } else {
                      form.clearErrors("saIdNumber");
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      ) : (
        <div
          className="grid grid-cols-1 gap-5 md:grid-cols-2"
          key="non-sa-citizen-docs"
        >
          <FormField
            control={form.control}
            name="passportNumber"
            render={({ field }) => (
              <FormItem>
                <FieldLabel required>Passport Number</FieldLabel>
                <FormControl>
                  <Input
                    placeholder="Enter Passport Number"
                    disabled={mode === "edit"}
                    className={creatorFormInputClass}
                    {...field}
                  />
                </FormControl>
                <p className="mt-1 text-xs text-gray-500">
                  Note: Creatrend will not be able to initiate your payments from brands if we can’t verify your identity.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="residencePermit"
            render={({
              field: { onChange, value, ref, onBlur, name },
            }) => (
              <FormItem>
                <FieldLabel required>Residence Permit</FieldLabel>
                <FormControl>
                  <div
                    className={`flex overflow-hidden rounded-[12px] border border-[#e5e7eb] ${
                      mode === "edit"
                        ? "cursor-not-allowed bg-gray-100 opacity-60"
                        : "bg-white"
                    }`}
                  >
                    <span className="flex shrink-0 items-center justify-center border-r border-[#e5e7eb] bg-gray-50 px-3">
                      <Upload
                        className="h-5 w-5 text-gray-600"
                        aria-hidden
                      />
                    </span>
                    <label
                      htmlFor={mode === "edit" ? undefined : "creator-residence-permit"}
                      className={`flex flex-1 items-center px-4 py-2.5 text-sm text-gray-600 ${
                        mode === "edit" ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                    >
                      {value instanceof File
                        ? value.name
                        : "Choose File (.pdf)"}
                    </label>
                    <input
                      ref={ref}
                      name={name}
                      id="creator-residence-permit"
                      type="file"
                      disabled={mode === "edit"}
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onBlur={onBlur}
                      onChange={(e) => {
                        if (mode === "edit") return;
                        const file = e.target.files?.[0];
                        if (file) onChange(file);
                      }}
                    />
                  </div>
                </FormControl>
                <p className="mt-1 text-xs text-gray-500">
                 Note: We need to verify  your right to live and work in South Africa.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      <CreatorDeliveryAddressFields form={form} />

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">About you</h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FormField
            control={form.control}
            name="languageSpoken"
            render={({ field }) => (
              <FormItem>
                <FieldLabel required>Language Spoken</FieldLabel>
                <FormControl>
                  <MultiSelect
                    options={creatorSelectOptions.languageSpoken}
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Select one or more languages"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <SignupFormSelectField
            control={form.control}
            name="primaryNiche"
            label="Primary Niche"
            required
            options={categoryOptions}
            placeholder="Select"
            inputClass={creatorFormInputClass}
          />
          <SignupFormSelectField
            control={form.control}
            name="secondaryNiche"
            label="Secondary Niche"
            required={false}
            options={secondaryNicheSelectOptions}
            placeholder="Optional"
            inputClass={creatorFormInputClass}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4">
          <FormField
            control={form.control}
            name="hasPets"
            render={({ field }) => (
              <FormItem>
                <FieldLabel required className="text-base">
                  Do you have pets?
                </FieldLabel>
                <FormControl>
                  <RadioYesNo
                    value={field.value}
                    onChange={field.onChange}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50/80 p-4">
          <FormField
            control={form.control}
            name="hasChildren"
            render={({ field }) => (
              <FormItem>
                <FieldLabel required className="text-base">
                  Do you have children?
                </FieldLabel>
                <FormControl>
                  <RadioYesNo
                    value={field.value}
                    onChange={field.onChange}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">
          Social media & links
        </h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <FormField
            control={form.control}
            name="tiktokUrl"
            render={({ field }) => (
              <FormItem>
                <FieldLabel>TikTok URL</FieldLabel>
                <FormControl>
                  <div className="flex">
                    <span className="inline-flex shrink-0 items-center rounded-l-[12px] border border-r-0 border-[#e5e7eb] bg-gray-50 px-3 text-sm text-gray-500">
                      https://
                    </span>
                    <Input
                      placeholder="Enter URL here..."
                      className={`${creatorFormInputClass} rounded-l-none`}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="instagramUrl"
            render={({ field }) => (
              <FormItem>
                <FieldLabel>Instagram URL</FieldLabel>
                <FormControl>
                  <div className="flex">
                    <span className="inline-flex shrink-0 items-center rounded-l-[12px] border border-r-0 border-[#e5e7eb] bg-gray-50 px-3 text-sm text-gray-500">
                      https://
                    </span>
                    <Input
                      placeholder="Enter URL here..."
                      className={`${creatorFormInputClass} rounded-l-none`}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="youtubeUrl"
            render={({ field }) => (
              <FormItem>
                <FieldLabel>YouTube Channel (Optional)</FieldLabel>
                <FormControl>
                  <div className="flex">
                    <span className="inline-flex shrink-0 items-center rounded-l-[12px] border border-r-0 border-[#e5e7eb] bg-gray-50 px-3 text-sm text-gray-500">
                      https://
                    </span>
                    <Input
                      placeholder="Enter URL here..."
                      className={`${creatorFormInputClass} rounded-l-none`}
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:items-start">
          <FormField
            control={form.control}
            name="skillsUrl"
            render={({ field }) => (
              <FormItem>
                <FieldLabel required>A link to your portfolio</FieldLabel>
                <FormControl>
                  <div className="flex min-h-12 w-full overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white transition-colors focus-within:border-[#0353a4]">
                    <span className="flex shrink-0 items-center border-r border-[#e5e7eb] bg-gray-50 px-3 text-sm text-gray-500">
                      https://
                    </span>
                    <Input
                      type="text"
                      inputMode="url"
                      autoComplete="url"
                      placeholder="e.g your canva portfolio link"
                      className="h-12 min-h-12 flex-1 rounded-none border-0 bg-transparent px-4 text-sm text-[#1e293b] shadow-none outline-none ring-0 placeholder:text-[rgba(30,41,59,0.5)] focus-visible:ring-0"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="introVideo"
            render={({ field: { onChange, value, ref, onBlur, name } }) => (
              <FormItem>
                <div className="mb-2 flex items-center gap-1.5">
                  <FieldLabel required={mode !== "edit"} className="mb-0">
                    Upload Intro Video
                  </FieldLabel>
                  <button
                    type="button"
                    onClick={() => setIsGuidelinesModalOpen(true)}
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
                    title="View Video Guidelines"
                  >
                    <Info className="h-4 w-4 shrink-0" aria-hidden />
                  </button>
                </div>
                <FormControl>
                  <div className="flex min-h-12 w-full overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white transition-colors focus-within:border-[#0353a4]">
                    <span className="flex shrink-0 items-center justify-center border-r border-[#e5e7eb] bg-gray-50 px-3 text-gray-600">
                      <Upload className="h-5 w-5" aria-hidden />
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsGuidelinesModalOpen(true)}
                      className="flex min-h-12 flex-1 items-center px-4 text-sm text-gray-600 text-left hover:bg-gray-50 transition-colors"
                    >
                      {value instanceof File
                        ? value.name
                        : existingIntroVideoUrl
                          ? "Current video uploaded — choose file to replace"
                          : "Choose File"}
                    </button>
                    <input
                      ref={(el) => {
                        ref(el);
                        fileInputRef.current = el;
                      }}
                      name={name}
                      onBlur={onBlur}
                      type="file"
                      accept="video/mp4,video/quicktime,.mp4,.mov"
                      className="hidden"
                      id="intro-video-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onChange(file);
                      }}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="rounded-xl border border-[#BEDBFF] bg-[#EFF6FF] p-4 text-sm text-slate-700 md:p-5">
          <p className="flex items-center gap-2 font-semibold text-slate-900">
            <Lightbulb
              className="h-5 w-5 shrink-0 text-amber-500"
              strokeWidth={2}
              aria-hidden
            />
            Intro Video Guidelines :
          </p>
          <div className="mt-3 list-inside list-disc space-y-1.5 text-[#193CB8]">
            <p>
              <span className="font-semibold ">Aspect ratio:</span>{" "}
              9:16
            </p>
            <p>
              <span className="font-semibold">File format:</span>{" "}
              .MP4 or .MOV
            </p>
          </div>
          <p className="mt-3 leading-relaxed text-[#193CB8]">
            <span className="font-semibold">Pro tip:</span> While
            you can shoot in 4K (2160 × 3840), most social platforms compress 4K
            videos heavily, which can sometimes result in glitches or quality
            loss. Sticking to a crisp, high-bitrate{" "}
            <span className="font-medium">1080 × 1920</span> is
            generally the safest and best-looking option for mobile-first UGC
            content.
          </p>
        </div>
      </div>

      <IntroVideoGuidelinesModal
        isOpen={isGuidelinesModalOpen}
        onClose={() => setIsGuidelinesModalOpen(false)}
        onConfirmUpload={() => fileInputRef.current?.click()}
      />
    </div>
  );
}
