import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import uploadIcon from "../../../assets/images/createAccount/uploadicon.svg";
import { getAllSkills, getCatagories } from "../../../services/api/publicApi";
import { updateCreatorProfile } from "../../../services/api/apiservices";
import {
  appearanceValuesToJsonArray,
  normalizeCreatorProfileUrl,
  normalizeIntegerArray,
} from "../../../utils/creatorProfileFormData";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { selectUser, updateUser } from "../../../store/slices/authSlice";

export default function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const profile = user?.profile || {};

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    category: [],
    skills: [],
    ethnicity: "",
    languages: "",
    appearance: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    country: "",
    postalZipCode: "",
    instagramUrl: "",
    tiktokUrl: "",
    bio: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [saving, setSaving] = useState(false);
  const categoryDropdownRef = useRef(null);
  const skillsDropdownRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const loadOptions = async () => {
      try {
        const [categoriesResponse, skillsResponse] = await Promise.all([
          getCatagories(),
          getAllSkills(),
        ]);

        if (!mounted) return;

        setAllCategories(
          Array.isArray(categoriesResponse?.data)
            ? categoriesResponse.data
            : Array.isArray(categoriesResponse)
            ? categoriesResponse
            : []
        );

        setAllSkills(
          Array.isArray(skillsResponse?.data)
            ? skillsResponse.data
            : Array.isArray(skillsResponse)
            ? skillsResponse
            : []
        );
      } catch (_error) {
        if (mounted) {
          setAllCategories([]);
          setAllSkills([]);
        }
      }
    };

    loadOptions();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      firstName: profile?.firstName || user?.firstName || "",
      lastName: profile?.lastName || user?.lastName || "",
      email: profile?.email || user?.email || "",
      phone: profile?.phoneNumber || "",
      category: Array.isArray(profile?.categories)
        ? profile.categories.map((item) => item.id)
        : [],
      skills: Array.isArray(profile?.skills) ? profile.skills.map((item) => item.id) : [],
      ethnicity: profile?.ethnicity || "",
      languages: Array.isArray(profile?.languages) ? profile.languages[0] || "" : "",
      appearance: Array.isArray(profile?.appearance)
        ? profile.appearance[0] ?? ""
        : profile?.appearance || "",
      addressLine1: profile?.addressLine1 || "",
      addressLine2: profile?.addressLine2 || "",
      city: profile?.city || "",
      country: profile?.country || "",
      postalZipCode: profile?.postalZipCode || "",
      instagramUrl: profile?.instagramUrl || "",
      tiktokUrl: profile?.tiktokUrl || "",
      bio: profile?.bio || "",
    }));
  }, [profile, user]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const clickedInsideCategory = categoryDropdownRef.current?.contains(event.target);
      const clickedInsideSkills = skillsDropdownRef.current?.contains(event.target);

      if (!clickedInsideCategory && !clickedInsideSkills) {
        setFormData((prev) => ({
          ...prev,
          _categoryOpen: false,
          _skillsOpen: false,
        }));
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const categoryNameById = useMemo(() => {
    const map = new Map();
    allCategories.forEach((item) => map.set(item.id, item.name));
    return map;
  }, [allCategories]);

  const existingProfilePhotoUrl =
    profile?.media?.profilePhoto?.mediaDetails?.url ||
    user?.profile?.media?.profilePhoto?.mediaDetails?.url ||
    "";

  const skillNameById = useMemo(() => {
    const map = new Map();
    allSkills.forEach((item) => map.set(item.id, item.name));
    return map;
  }, [allSkills]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData((prev) => {
      const current = prev[name] || [];
      if (current.includes(value)) {
        return { ...prev, [name]: current.filter((v) => v !== value) };
      } else {
        return { ...prev, [name]: [...current, value] };
      }
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setProfilePhoto(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const fd = new FormData();
      fd.append("firstName", formData.firstName || "");
      fd.append("lastName", formData.lastName || "");
      fd.append("email", formData.email || "");
      fd.append("phoneNumber", formData.phone || "");
      fd.append("addressLine1", formData.addressLine1 || "");
      fd.append("addressLine2", formData.addressLine2 || "");
      fd.append("country", formData.country || "");
      fd.append("city", formData.city || "");
      fd.append("postalZipCode", formData.postalZipCode || "");
      fd.append("ethnicity", formData.ethnicity || "");
      fd.append(
        "appearance",
        JSON.stringify(appearanceValuesToJsonArray(formData.appearance))
      );
      fd.append("languages", JSON.stringify(formData.languages ? [formData.languages] : []));
      fd.append("bio", formData.bio || "");
      const instagramUrl = normalizeCreatorProfileUrl(formData.instagramUrl);
      if (instagramUrl) fd.append("instagramUrl", instagramUrl);
      const tiktokUrl = normalizeCreatorProfileUrl(formData.tiktokUrl);
      if (tiktokUrl) fd.append("tiktokUrl", tiktokUrl);
      fd.append("categories", JSON.stringify(normalizeIntegerArray(formData.category || [])));
      fd.append("skills", JSON.stringify(normalizeIntegerArray(formData.skills || [])));

      if (profilePhoto) {
        fd.append("profilePhoto", profilePhoto);
      }

      const response = await updateCreatorProfile(fd);
      const updatedProfile =
        response?.profile || response?.data?.profile || response?.data || profile;
      dispatch(updateUser({ profile: updatedProfile }));
      navigate("/creator/my-profile");
    } catch (error) {
      window.alert(error?.message || error?.error || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate("/creator/my-profile");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* White Card Container */}
        <div className="bg-white rounded-xl p-6 sm:p-10 shadow-sm border border-gray-100">
          <h2 className="text-2xl sm:text-3xl font-anton text-gray-900 text-center mb-8">
            Edit Profile
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter First Name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter Last Name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Email & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  disabled
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  className="w-full px-4 py-3 border bg-gray-100 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 border border-r-0 border-gray-200 rounded-l-lg bg-gray-50 text-gray-500 text-sm">
                    +44
                  </span>
                  <input
                    type="number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter Phone Number"
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-r-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Category & Skills (dropdown multi-select) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="relative" ref={categoryDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="relative">
                  <div
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        _categoryOpen: !prev._categoryOpen,
                        _skillsOpen: false,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-500 bg-white cursor-pointer flex items-center justify-between"
                  >
                    <span className="truncate">
                      {formData.category && formData.category.length
                        ? formData.category
                            .map((id) => categoryNameById.get(id) || String(id))
                            .join(", ")
                        : "Select your category"}
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-400 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {formData._categoryOpen && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto py-2">
                      {allCategories.map((opt) => (
                        <label
                          key={opt.id}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.category.includes(opt.id)}
                            onChange={() => handleMultiSelect("category", opt.id)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-700">{opt.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="relative" ref={skillsDropdownRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills
                </label>
                <div className="relative">
                  <div
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        _skillsOpen: !prev._skillsOpen,
                        _categoryOpen: false,
                      }))
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-500 bg-white cursor-pointer flex items-center justify-between"
                  >
                    <span className="truncate">
                      {formData.skills && formData.skills.length
                        ? formData.skills
                            .map((id) => skillNameById.get(id) || String(id))
                            .join(", ")
                        : "Select your skills"}
                    </span>
                    <svg
                      className="w-4 h-4 text-gray-400 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  {formData._skillsOpen && (
                    <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-56 overflow-auto py-2">
                      {allSkills.map((opt) => (
                        <label
                          key={opt.id}
                          className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formData.skills.includes(opt.id)}
                            onChange={() => handleMultiSelect("skills", opt.id)}
                            className="w-4 h-4"
                          />
                          <span className="text-sm text-gray-700">{opt.name}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Ethnicity & Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ethnicity
                </label>
                <div className="relative">
                  <select
                    name="ethnicity"
                    value={formData.ethnicity}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select your ethnicity</option>
                    <option value="caucasian">Caucasian</option>
                    <option value="black">Black</option>
                    <option value="hispanic_latino">Hispanic/Latino</option>
                    <option value="asian">Asian</option>
                    <option value="multiracial_other">Multiracial/Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Languages
                </label>
                <div className="relative">
                  <select
                    name="languages"
                    value={formData.languages}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select your language proficiency</option>
                    <option value="native">
                      Native English Speaker
                    </option>
                    <option value="non-native">
                      Non-Native English Speaker
                    </option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appearance
                </label>
                <div className="relative">
                  <select
                    name="appearance"
                    value={formData.appearance}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                  >
                    <option value="">Select your appearance style</option>
                    <option value="fit_sporty">Fit & Sporty</option>
                    <option value="plus_size">Plus Size</option>
                    {/* <option value="Alternative Style">Alternative Style</option>
                    <option value="Model/Influencer">Model/Influencer</option> */}
                    <option value="casual_relatable">Casual & Relatable</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Enter Country"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Enter City"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleChange}
                  placeholder="Enter Address Line 1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleChange}
                  placeholder="Enter Address Line 2"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal / Zip Code
                </label>
                <input
                  type="text"
                  name="postalZipCode"
                  value={formData.postalZipCode}
                  onChange={handleChange}
                  placeholder="Enter Postal / Zip Code"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram URL
                </label>
                <input
                  type="text"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  placeholder="Enter Instagram URL"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  TikTok URL
                </label>
                <input
                  type="text"
                  name="tiktokUrl"
                  value={formData.tiktokUrl}
                  onChange={handleChange}
                  placeholder="Enter TikTok URL"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

             {/* Bio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bio
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Enter Bio"
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>


            {/* Profile Photo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Photo
              </label>
              <div className="flex flex-col items-start gap-4 mt-4 sm:flex-row sm:items-start sm:text-left">
                {/* Upload Box */}
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  className="w-32 h-26 border-1 border-gray-300 rounded-xl flex items-center justify-center cursor-pointer hover:border-blue-400 transition"
                >
                  <label className="cursor-pointer flex items-center justify-center w-full h-full">
                    <input
                      type="file"
                      accept=".png,.jpeg,.jpg,.gif"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {profilePhoto ? (
                      <img
                        src={URL.createObjectURL(profilePhoto)}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : existingProfilePhotoUrl ? (
                      <img
                        src={existingProfilePhotoUrl}
                        alt="Profile"
                        className="w-full h-full object-cover rounded-xl"
                      />
                    ) : (
                      <img
                        src={uploadIcon}
                        alt="Upload"
                        className="w-14 h-14 opacity-90"
                      />
                    )}
                  </label>
                </div>

                {/* Drag & Drop button and instructions */}
                <div className="flex flex-col gap-2 mt-2 items-start text-left">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept=".png,.jpeg,.jpg,.gif"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <span className="inline-block px-4 py-2 text-sm border border-[#AFC5EE] rounded-md hover:bg-blue-50 transition">
                      Drag & Drop
                    </span>
                  </label>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    .png, .jpeg, .gif files up to 8 MB. Recommended size is
                    <br />
                    256×256 px. You can add one photo maximum.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={handleBack}
                className="w-full sm:w-auto px-10 py-4 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={saving}
                className="w-full sm:w-auto px-7 py-4 text-sm font-medium text-white main-btn rounded-full transition"
              >
                {saving ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
