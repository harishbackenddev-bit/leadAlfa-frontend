import { useEffect, useMemo, useRef } from "react";
import { Info, Lightbulb, Upload } from "lucide-react";
import { G_icon } from "../../../assets/SVGs/portfolio/main/auth_icons";
import {
  SECONDARY_NICHE_NONE,
  creatorFormInputClass,
  creatorSelectOptions,
} from "../../../data/creatorSignupOptions";
import {
  creatorCitiesByProvince,
  creatorProvinces,
} from "../../../utils/location";
import {
  FieldLabel,
} from "../../../pages/brand/Campaigns/components/CampaignFormFields";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { SignupFormSelectField } from "./SignupFormSelectField";
import { validateSAIdNumber } from "../../../utils/validateSAIdNumber";

function RadioYesNo({ value, onChange, name }) {
  return (
    <div className="flex gap-8" role="radiogroup" aria-label={name}>
      {["yes", "no"].map((v) => (
        <label
          key={v}
          className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-800"
        >
          <input
            type="radio"
            name={name}
            checked={value === v}
            onChange={() => onChange(v)}
            className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
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
}) {
  const province = form.watch("province");
  const saCitizen = form.watch("saCitizen");
  const prevProvince = useRef();

  const cityOptions = creatorCitiesByProvince[province] || [];

  const secondaryNicheSelectOptions = useMemo(
    () => [
      { label: "— None —", value: SECONDARY_NICHE_NONE },
      ...categoryOptions,
    ],
    [categoryOptions]
  );

  useEffect(() => {
    if (
      prevProvince.current !== undefined &&
      prevProvince.current !== province
    ) {
      form.setValue("city", "");
    }
    prevProvince.current = province;
  }, [province, form]);

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

  return (
    <div className="flex flex-col gap-8">
      <div className="text-center">
        <p className="mx-auto mb-2 max-w-lg text-sm text-gray-500">
          Fill out the basic information below to get things rolling.
        </p>
      </div>
  

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
                <Input
                  type="tel"
                  placeholder="Enter Phone Number"
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
          name="publicCreatorName"
          render={({ field }) => (
            <FormItem>
              <FieldLabel required>Public / Creator Name</FieldLabel>
              <FormControl>
                <Input
                  placeholder="Enter Public / Creator Name"
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
          name="dateOfBirth"
          render={({ field }) => (
            <FormItem>
              <FieldLabel required>Date of Birth</FieldLabel>
              <FormControl>
                <div className="relative w-full">
                  <Input
                    type="date"
                    className={`${creatorFormInputClass} relative h-12 min-h-12 w-full cursor-pointer pr-11 [color-scheme:light] [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-3 [&::-webkit-calendar-picker-indicator]:top-1/2 [&::-webkit-calendar-picker-indicator]:h-5 [&::-webkit-calendar-picker-indicator]:w-5 [&::-webkit-calendar-picker-indicator]:-translate-y-1/2 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                    {...field}
                  />
                </div>
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
              <FieldLabel required>South African Citizen?</FieldLabel>
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
                  inputMode="numeric"
                  maxLength={13}
                  className={creatorFormInputClass}
                  name={field.name}
                  ref={field.ref}
                  value={field.value ?? ""}
                  onChange={(e) => {
                    field.onChange(
                      e.target.value.replace(/\D/g, "").slice(0, 13)
                    );
                  }}
                  onBlur={(e) => {
                    field.onBlur();
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
            name="residencePermit"
            render={({
              field: { onChange, value, ref, onBlur, name },
            }) => (
              <FormItem>
                <FieldLabel required>Residence Permit</FieldLabel>
                <FormControl>
                  <div className="flex overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white">
                    <span className="flex shrink-0 items-center justify-center border-r border-[#e5e7eb] bg-gray-50 px-3">
                      <Upload
                        className="h-5 w-5 text-gray-600"
                        aria-hidden
                      />
                    </span>
                    <label
                      htmlFor="creator-residence-permit"
                      className="flex flex-1 cursor-pointer items-center px-4 py-2.5 text-sm text-gray-600"
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
                      accept="application/pdf,.pdf"
                      className="hidden"
                      onBlur={onBlur}
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
      )}

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        <SignupFormSelectField
          control={form.control}
          name="province"
          label="Province"
          required
          options={creatorProvinces}
          placeholder="Select"
          inputClass={creatorFormInputClass}
        />
        <SignupFormSelectField
          control={form.control}
          name="city"
          label="City / Town"
          required
          options={cityOptions}
          placeholder={province ? "Select" : "Select province first"}
          inputClass={creatorFormInputClass}
          disabled={!province}
        />
      </div>

      <FormField
        control={form.control}
        name="streetNumber"
        render={({ field }) => (
          <FormItem>
            <FieldLabel required>Street Number</FieldLabel>
            <FormControl>
              <Input
                placeholder="Enter Street Number"
                className={creatorFormInputClass}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-900">About you</h3>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          <SignupFormSelectField
            control={form.control}
            name="languageSpoken"
            label="Language Spoken"
            required
            options={creatorSelectOptions.languageSpoken}
            placeholder="Select"
            inputClass={creatorFormInputClass}
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
                <FieldLabel required>Show us your skills</FieldLabel>
                <FormControl>
                  <div className="flex min-h-12 w-full overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white transition-colors focus-within:border-[#0353a4]">
                    <span className="flex shrink-0 items-center border-r border-[#e5e7eb] bg-gray-50 px-3 text-sm text-gray-500">
                      https://
                    </span>
                    <Input
                      type="text"
                      inputMode="url"
                      autoComplete="url"
                      placeholder="Enter URL here..."
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
                  <FieldLabel required className="mb-0">
                    Upload Intro Video
                  </FieldLabel>
                  <span
                    className="inline-flex text-blue-500"
                    title="Short intro for brands"
                  >
                    <Info className="h-4 w-4 shrink-0" aria-hidden />
                  </span>
                </div>
                <FormControl>
                  <div className="flex min-h-12 w-full overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white transition-colors focus-within:border-[#0353a4]">
                    <span className="flex shrink-0 items-center justify-center border-r border-[#e5e7eb] bg-gray-50 px-3 text-gray-600">
                      <Upload className="h-5 w-5" aria-hidden />
                    </span>
                    <label
                      htmlFor="intro-video-upload"
                      className="flex min-h-12 flex-1 cursor-pointer items-center px-4 text-sm text-gray-600"
                    >
                      {value instanceof File ? value.name : "Choose File"}
                    </label>
                    <input
                      ref={ref}
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
            Note:
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
    </div>
  );
}
