import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { CreatorBasicInformationFields } from "../../../components/portfolio/signUp/CreatorBasicInformationFields";
import { Form } from "../../../components/ui/form";
import { Button } from "../../../components/ui/button";
import { creatorEditProfileSchema } from "../../../schemas/basicInfoSchema";
import { getCatagories } from "../../../services/api/publicApi";
import { updateCreatorProfile } from "../../../services/api/apiservices";
import {
  buildCreatorEditProfileFormData,
  mapCreatorProfileToEditFormValues,
} from "../../../utils/creatorProfileFormData";
import { getProfilePhotoSrc } from "../../../utils/profileMedia";
import {
  fetchFreshCreatorProfile,
  mergeCreatorAuthUserFromProfile,
} from "../../../utils/onboardingProfile";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectUser, updateUser } from "../../../store/slices/authSlice";

export default function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const profile = user?.profile || {};
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [saving, setSaving] = useState(false);

  const existingProfilePhotoUrl =
    getProfilePhotoSrc(profile) ||
    profile?.media?.profilePhoto?.mediaDetails?.url ||
    "";
  const existingIntroVideoUrl =
    profile?.media?.introVideo?.mediaDetails?.url ||
    profile?.media?.introVideo?.url ||
    "";

  const form = useForm({
    resolver: zodResolver(creatorEditProfileSchema),
    defaultValues: mapCreatorProfileToEditFormValues(profile, user),
  });

  useEffect(() => {
    form.reset(mapCreatorProfileToEditFormValues(profile, user));
  }, [profile, user, form]);

  useEffect(() => {
    getCatagories()
      .then((res) => {
        const rows = res?.data || res || [];
        setCategoryOptions(
          (Array.isArray(rows) ? rows : []).map((category) => ({
            value: String(category.id),
            label: category.name,
          }))
        );
      })
      .catch(() => {});
  }, []);

  const onSubmit = async (data) => {
    try {
      setSaving(true);

      const existingSkillIds = Array.isArray(profile.skills)
        ? profile.skills.map((skill) => skill.id).filter(Boolean)
        : [];

      const formData = buildCreatorEditProfileFormData({
        formValues: data,
        categoryOptions,
        existingSkillIds,
      });

      await updateCreatorProfile(formData);

      const freshProfile = await fetchFreshCreatorProfile();
      dispatch(
        updateUser(mergeCreatorAuthUserFromProfile(user, freshProfile))
      );
      navigate("/creator/my-profile");
    } catch (error) {
      window.alert(error?.message || error?.error || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6">
          <button
            type="button"
            onClick={() => navigate("/creator/my-profile")}
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-[#1E60DB] transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Profile
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 sm:p-10 shadow-sm border border-gray-100">
          <h2 className="text-2xl sm:text-3xl text-gray-900 text-center mb-8">
            Edit Profile
          </h2>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <CreatorBasicInformationFields
                form={form}
                categoryOptions={categoryOptions}
                mode="edit"
                existingProfilePhotoUrl={existingProfilePhotoUrl}
                existingIntroVideoUrl={existingIntroVideoUrl}
              />

              <div className="flex flex-col items-center gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto rounded-full"
                  onClick={() => navigate("/creator/my-profile")}
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  size="lg"
                  disabled={saving}
                  className="w-full sm:w-auto main-btn rounded-full disabled:opacity-60 disabled:pointer-events-none"
                >
                  {saving ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
