import { useEffect, useRef, useState } from "react";
import { useWatch } from "react-hook-form";
import { X } from "lucide-react";
import uplodeIcoon from "../../../assets/images/createAccount/uploadicon.svg";
import { G_icon } from "../../../assets/SVGs/portfolio/main/auth_icons";
import { brandFormInputClass, brandSelectOptions } from "../../../data/brandSignupOptions";
import { brandCountryOptions } from "../../../utils/location";
import { BrandCityComboboxField } from "./BrandCityComboboxField";
import {
  FieldLabel,
} from "../../../pages/brand/Campaigns/components/CampaignFormFields";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "../../ui/form";
import { Input } from "../../ui/input";
import { InternationalPhoneField } from "../../ui/phone-input";
import { Textarea } from "../../ui/textarea";
import { MultiSelect } from "../../ui/multi-select";
import { SignupFormSelectField } from "./SignupFormSelectField";

export function BrandBasicInformationFields({
  form,
  categoryOptions,
  onSocialLogin,
}) {
  const [logoPreview, setLogoPreview] = useState(null);
  const country = useWatch({ control: form.control, name: "country" });
  const isFirstCountryRender = useRef(true);

  useEffect(() => {
    if (isFirstCountryRender.current) {
      isFirstCountryRender.current = false;
      return;
    }
    form.setValue("city", "");
    form.setValue("cityOther", "");
  }, [country, form]);

  const handleLogoChange = (file, onChange) => {
    if (!file) {
      setLogoPreview(null);
      onChange(undefined);
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result);
      onChange(file);
    };
    reader.readAsDataURL(file);
  };

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
          name="companyName"
          render={({ field }) => (
            <FormItem>
              <FieldLabel required>Company Name</FieldLabel>
              <FormControl>
                <Input
                  placeholder="Enter Company Name"
                  className={brandFormInputClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="companyWebsite"
          render={({ field }) => (
            <FormItem>
              <FieldLabel required>
                Company Website URL/Social URL
              </FieldLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="Enter Company Link"
                  className={brandFormInputClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyEmail"
          render={({ field }) => (
            <FormItem>
              <FieldLabel required>Company Email</FieldLabel>
              <FormControl>
                <Input
                  type="email"
                  readOnly
                  aria-readonly="true"
                  title="Verified at sign-up — contact support to change"
                  placeholder="Enter Company Email"
                  className={`${brandFormInputClass} cursor-default bg-gray-50 text-gray-700 focus-visible:ring-0`}
                  {...field}
                />
              </FormControl>
              <FormDescription className="text-xs text-gray-500">
                This address was verified during sign-up.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FieldLabel>Company Phone Number</FieldLabel>
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
          name="addressLine1"
          render={({ field }) => (
            <FormItem>
              <FieldLabel required>Address Line 1</FieldLabel>
              <FormControl>
                <Input
                  placeholder="Enter Address Line 1"
                  className={brandFormInputClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="addressLine2"
          render={({ field }) => (
            <FormItem>
              <FieldLabel>Address Line 2</FieldLabel>
              <FormControl>
                <Input
                  placeholder="Enter Address Line 2"
                  className={brandFormInputClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <SignupFormSelectField
          control={form.control}
          name="businessType"
          label="Business Type"
          required
          options={brandSelectOptions.businessType}
          placeholder="Select"
          inputClass={brandFormInputClass}
        />
        <SignupFormSelectField
          control={form.control}
          name="jobRole"
          label="Job Role"
          required
          options={brandSelectOptions.jobRole}
          placeholder="Select"
          inputClass={brandFormInputClass}
        />

        <SignupFormSelectField
          control={form.control}
          name="country"
          label="Country"
          required
          options={brandCountryOptions}
          placeholder="Select"
          inputClass={brandFormInputClass}
        />
        <BrandCityComboboxField
          control={form.control}
          setValue={form.setValue}
          trigger={form.trigger}
          inputClass={brandFormInputClass}
        />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-[#161C2B]">Brand Industry</h3>
        <FormField
          control={form.control}
          name="primaryIndustries"
          render={({ field }) => (
            <FormItem>
              <FieldLabel required>Primary Industry</FieldLabel>
              <FormControl>
                <MultiSelect
                  options={categoryOptions}
                  value={field.value || []}
                  onChange={field.onChange}
                  placeholder="Select one or more industries"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
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
                className={`${brandFormInputClass} min-h-[130px] h-auto resize-y py-3`}
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
          name="logo"
          render={({ field: { onChange, ref, onBlur, name } }) => (
            <FormItem>
              <FieldLabel required>Upload Logo</FieldLabel>
              <div className="flex gap-3">
                <div className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border-2 border-[#e5e7eb] bg-gray-50">
                  {logoPreview ? (
                    <>
                      <img
                        src={logoPreview}
                        alt="Logo preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleLogoChange(undefined, onChange)}
                        className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <img src={uplodeIcoon} className="w-10" alt="" />
                  )}
                </div>
                <div className="flex flex-col justify-center gap-2">
                  <FormControl>
                    <input
                      ref={ref}
                      name={name}
                      onBlur={onBlur}
                      type="file"
                      accept="image/png,image/jpeg,image/gif"
                      className="hidden"
                      id="brand-logo-upload"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoChange(file, onChange);
                      }}
                    />
                  </FormControl>
                  <label
                    htmlFor="brand-logo-upload"
                    className="inline-flex w-fit cursor-pointer rounded-[12px] border border-[#0353a4] bg-white px-4 py-2 text-sm font-semibold text-[#0353a4] transition hover:bg-blue-50"
                  >
                    Upload Image
                  </label>
                  <FormDescription className="text-xs text-gray-500">
                    .png, .jpeg, .gif files up to 8 MB. Recommended size is
                    256×256 px
                  </FormDescription>
                </div>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="companyRegistrationNumber"
          render={({ field }) => (
            <FormItem>
              <FieldLabel>
                Company Registration Number (if available)
              </FieldLabel>
              <FormControl>
                <Input
                  placeholder="Enter Company Registration Number"
                  className={brandFormInputClass}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
