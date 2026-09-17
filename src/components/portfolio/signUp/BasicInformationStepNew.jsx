import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../store/slices/authSlice";
import { getBasicInfoSchema } from "../../../schemas/basicInfoSchema";
import {
  BRAND_COUNTRY,
  getBrandCityFormDefaults,
  resolveBrandCityValue,
} from "../../../utils/location";
import { getCatagories } from "../../../services/api/publicApi";
import { Form } from "../../ui/form";
import { Button } from "../../ui/button";
import { CreatorBasicInformationFields } from "./CreatorBasicInformationFields";
import { BrandBasicInformationFields } from "./BrandBasicInformationFields";

export default function BasicInformationStep({
  formData,
  onFormDataChange,
  onNext,
  onBack,
  onSocialLogin,
  role = "creator",
  isSubmitting = false,
}) {
  const user = useAppSelector(selectUser);
  const schema = getBasicInfoSchema(role);

  const [categoryOptions, setCategoryOptions] = useState([]);

  const existingCategories = formData.categories || [];

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues:
      role === "brand"
        ? {
            companyName: formData.basicInfo?.companyName || "",
            companyWebsite:
              formData.basicInfo?.companyUrl ||
              formData.basicInfo?.companyWebsite ||
              "",
            companyEmail:
              formData.basicInfo?.email || user?.email || "",
            phoneNumber: formData.basicInfo?.phoneNumber || "",
            addressLine1: formData.basicInfo?.addressLine1 || "",
            addressLine2: formData.basicInfo?.addressLine2 || "",
            businessType: formData.basicInfo?.businessType || "",
            jobRole: formData.basicInfo?.jobRole || "",
            country: formData.basicInfo?.country || BRAND_COUNTRY,
            ...getBrandCityFormDefaults(formData.basicInfo?.city),
            postalCode: formData.basicInfo?.postalCode || "0000",
            primaryIndustries:
              Array.isArray(formData.categories) &&
              formData.categories.length > 0
                ? formData.categories.map(String)
                : [],
            bio: formData.basicInfo?.bio || "",
            companyRegistrationNumber:
              formData.basicInfo?.companyRegistrationNumber || "",
          }
        : {
            firstName: user?.firstName || formData.basicInfo?.firstName || "",
            lastName: user?.lastName || formData.basicInfo?.lastName || "",
            email: formData.basicInfo?.email || user?.email || "",
            phoneNumber: formData.basicInfo?.phoneNumber || "",
            publicCreatorName:
              formData.basicInfo?.publicCreatorName ||
              formData.basicInfo?.displayName ||
              "",
            dateOfBirth: formData.basicInfo?.dateOfBirth || "",
            ethnicity: formData.basicInfo?.ethnicity || "",
            appearance: formData.basicInfo?.appearance || "",
            gender: formData.basicInfo?.gender || "",
            bio: formData.basicInfo?.bio || "",
            saCitizen: formData.basicInfo?.saCitizen || "yes",
            saIdNumber: formData.basicInfo?.saIdNumber || "",
            passportNumber: formData.basicInfo?.passportNumber || "",
            addressLine1:
              formData.basicInfo?.addressLine1 ||
              formData.basicInfo?.streetNumber ||
              "",
            addressLine2: formData.basicInfo?.addressLine2 || "",
            suburb: formData.basicInfo?.suburb || "",
            province: formData.basicInfo?.province || "",
            city: formData.basicInfo?.city || "",
            postalCode: formData.basicInfo?.postalCode || "",
            deliveryInstructions:
              formData.basicInfo?.deliveryInstructions || "",
            languageSpoken: Array.isArray(formData.basicInfo?.languages)
              ? formData.basicInfo.languages.map(String)
              : [],
            primaryNiche: existingCategories[0]
              ? String(existingCategories[0])
              : "",
            secondaryNiche:
              existingCategories[1] != null
                ? String(existingCategories[1])
                : undefined,
            hasPets: formData.basicInfo?.hasPets || "no",
            hasChildren: formData.basicInfo?.hasChildren || "no",
            tiktokUrl: formData.basicInfo?.tiktokUrl || "",
            instagramUrl: formData.basicInfo?.instagramUrl || "",
            youtubeUrl: formData.basicInfo?.youtubeUrl || "",
            skillsUrl: formData.basicInfo?.skillsUrl || "",
            profilePhoto: formData.basicInfo?.profilePhoto || undefined,
          },
  });

  useEffect(() => {
    if (role !== "brand" && role !== "creator") return;
    getCatagories()
      .then((res) => {
        const rows = res?.data || [];
        setCategoryOptions(
          rows.map((c) => ({ value: String(c.id), label: c.name }))
        );
      })
      .catch(() => {});
  }, [role]);

  const onSubmit = (data) => {
    if (role === "creator") {
      const {
        primaryNiche,
        secondaryNiche,
        languageSpoken,
        introVideo,
        ...rest
      } = data;
      const nicheIds = [primaryNiche, secondaryNiche].filter(Boolean);
      const uniqueNiches = [...new Set(nicheIds)];

      const primaryLabel = categoryOptions.find(
        (c) => c.value === String(primaryNiche)
      )?.label;
      const secondaryLabel =
        secondaryNiche != null && String(secondaryNiche).trim() !== ""
          ? categoryOptions.find((c) => c.value === String(secondaryNiche))
              ?.label
          : null;

      onFormDataChange({
        ...formData,
        categories: uniqueNiches.length ? uniqueNiches : formData.categories,
        basicInfo: {
          ...formData.basicInfo,
          ...rest,
          languages: Array.isArray(languageSpoken) ? languageSpoken : [],
          country: BRAND_COUNTRY,
          addressLine1: rest.addressLine1,
          addressLine2: rest.addressLine2 || "",
          suburb: rest.suburb || "",
          postalCode: rest.postalCode || "",
          province: rest.province,
          streetNumber: rest.addressLine1,
          deliveryInstructions: rest.deliveryInstructions || "",
          introVideo,
          primaryNiches: primaryLabel ? [primaryLabel] : [],
          secondaryNiches: secondaryLabel ? [secondaryLabel] : [],
        },
      });
      onNext();
      return;
    }

    if (role === "brand") {
      const {
        primaryIndustries,
        logo,
        companyName,
        companyWebsite,
        companyEmail,
        phoneNumber,
        cityOther,
        city,
        ...addressRest
      } = data;
      const nextFormData = {
        ...formData,
        categories: primaryIndustries?.length
          ? primaryIndustries
          : formData.categories,
        basicInfo: {
          ...formData.basicInfo,
          ...addressRest,
          country: addressRest.country || BRAND_COUNTRY,
          city: resolveBrandCityValue(city, cityOther),
          logo,
          companyName,
          companyUrl: companyWebsite.trim(),
          email: companyEmail,
          phoneNumber,
          postalCode: addressRest.postalCode || "0000",
        },
      };
      onFormDataChange(nextFormData);
      onNext(nextFormData);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-[#5B576F]">
          Add Basic{" "}
          <span className="font-bold text-[#161C2B]">Information</span>
        </h2>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          {role === "brand" ? (
            <BrandBasicInformationFields
              form={form}
              categoryOptions={categoryOptions}
              onSocialLogin={onSocialLogin}
            />
          ) : (
            <CreatorBasicInformationFields
              form={form}
              categoryOptions={categoryOptions}
              onSocialLogin={onSocialLogin}
            />
          )}

          <div className="mt-8 flex flex-col-reverse gap-4 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            {typeof onBack === "function" ? (
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="rounded-xl"
                onClick={onBack}
              >
                Back
              </Button>
            ) : (
              <span />
            )}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="main-btn rounded-xl sm:min-w-[200px] disabled:opacity-60 disabled:pointer-events-none"
            >
              {isSubmitting ? "Please wait..." : "Save & Continue"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
