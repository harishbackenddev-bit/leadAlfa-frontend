// pages/brand/EditProfile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useAppSelector } from "../../../store/hooks";
import { selectUser, updateUser } from "../../../store/slices/authSlice";
import {
  getBrandProfile,
  updateBrandProfile,
  getTradeSafeStatus,
  submitBrandTradeSafeDetails,
} from "../../../services/api/apiservices";
import uploadIcon from "../../../assets/images/createAccount/uploadicon.svg";

// ========== TRADESAFE CONSTANTS ==========
const SA_BANK_OPTIONS = [
  { label: "ABSA Bank", value: "ABSA" },
  { label: "Access Bank", value: "ACCESS" },
  { label: "African Bank", value: "AFRICAN" },
  { label: "Bank Zero", value: "BANKZERO" },
  { label: "Bidvest Bank", value: "BIDVEST" },
  { label: "Capitec Bank", value: "CAPITEC" },
  { label: "Capitec Business / Mercantile", value: "CAPITEC_BUSINESS" },
  { label: "Discovery Bank", value: "DISCOVERY" },
  { label: "First National Bank (FNB)", value: "FNB" },
  { label: "Investec Bank", value: "INVESTEC" },
  { label: "Ithala", value: "ITHALA" },
  { label: "Mercantile", value: "MERCANTILE" },
  { label: "Nedbank", value: "NEDBANK" },
  { label: "RMB Private Bank", value: "RMB" },
  { label: "Sasfin Bank", value: "SASFIN" },
  { label: "Standard Bank South Africa", value: "SBSA" },
  { label: "TymeBank", value: "TYME" },
  { label: "Other Bank", value: "OTHER" },
];

const BANK_ACCOUNT_TYPES = [
  { label: "Savings Account", value: "SAVINGS" },
  { label: "Cheque Account", value: "CHEQUE" },
  { label: "Transmission Account", value: "TRANSMISSION" },
];

const BUSINESS_TYPES = [
  { label: "Single Brand", value: "single_brand" },
  { label: "Multi-Brand Company", value: "multi_brand_company" },
  { label: "Agency", value: "agency" },
  { label: "Freelancer", value: "freelancer" },
  { label: "Partnership", value: "partnership" },
  { label: "Trust", value: "trust" },
  { label: "Non-Profit", value: "non_profit" },
  { label: "Close Corporation", value: "close_corporation" },
  { label: "Public Company", value: "public_company" },
];

const JOB_ROLES = [
  { label: "CEO / Owner", value: "ceo_owner" },
  { label: "Marketing Manager", value: "marketing_manager" },
  { label: "Brand Manager", value: "brand_manager" },
  { label: "Social Media Manager", value: "social_media_manager" },
  { label: "Operations Admin", value: "operations_admin" },
  { label: "Other", value: "other" },
];

const COUNTRY_OPTIONS = [
  { label: "South Africa", value: "South Africa" },
  { label: "United States", value: "United States" },
  { label: "United Kingdom", value: "United Kingdom" },
  { label: "Canada", value: "Canada" },
  { label: "Australia", value: "Australia" },
  { label: "India", value: "India" },
  { label: "Other", value: "Other" },
];
// =============================================

export default function EditProfile() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useAppSelector(selectUser);

  // ========== LOADING STATES ==========
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTradeSafeSubmitting, setIsTradeSafeSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  // ========== PROFILE STATE ==========
  const [formData, setFormData] = useState({
    companyName: "",
    website: "",
    companyEmail: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    country: "",
    city: "",
    bio: "",
    businessType: "",
    jobRole: "",
    companyRegistrationNumber: "",
  });

  // ========== TRADESAFE STATE ==========
  const [tradeSafeData, setTradeSafeData] = useState({
    bank: "",
    accountNumber: "",
    accountType: "CHEQUE",
  });
  const [tradeSafeStatus, setTradeSafeStatus] = useState(null);
  const [tradeSafeUserId, setTradeSafeUserId] = useState(null);
  const [tradeSafeReference, setTradeSafeReference] = useState(null);
  const [isTradeSafeRegistered, setIsTradeSafeRegistered] = useState(false);

  // ========== UI STATE ==========
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // ========== FETCH PROFILE ==========
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError("");

      try {
        // Fetch brand profile
        const profileResponse = await getBrandProfile();
        console.log("📊 Profile Response:", profileResponse);

        if (profileResponse?.profile) {
          const profile = profileResponse.profile;
          setFormData({
            companyName: profile.companyName || "",
            website: profile.website || "",
            companyEmail: profile.companyEmail || user?.email || "",
            phoneNumber: profile.phoneNumber || "",
            addressLine1: profile.addressLine1 || "",
            addressLine2: profile.addressLine2 || "",
            country: profile.country || "",
            city: profile.city || "",
            bio: profile.bio || "",
            businessType: profile.businessType || "",
            jobRole: profile.jobRole || "",
            companyRegistrationNumber: profile.companyRegistrationNumber || "",
          });

          // Set logo preview if available
          if (profile.media?.logo?.url) {
            setLogoPreview(profile.media.logo.url);
          }
        }

        // Fetch TradeSafe status
        try {
          const statusResponse = await getTradeSafeStatus();
          console.log("📊 TradeSafe Status:", statusResponse);

          if (statusResponse) {
            setTradeSafeStatus(statusResponse.status || null);
            setTradeSafeUserId(statusResponse.tradeSafeUserId || null);
            setTradeSafeReference(statusResponse.tradeSafeReference || null);
            setIsTradeSafeRegistered(!!statusResponse.tradeSafeUserId);
          }
        } catch (statusError) {
          console.warn("⚠️ Could not fetch TradeSafe status:", statusError.message);
        }

      } catch (error) {
        console.error("❌ Error fetching profile:", error);
        setError(error?.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  // ========== HANDLERS ==========

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleTradeSafeChange = (e) => {
    const { name, value } = e.target;
    setTradeSafeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePhoto(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setProfilePhoto(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  // ========== SUBMIT PROFILE ==========
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess(false);

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (profilePhoto) {
        formDataToSend.append("logo", profilePhoto);
      }

      console.log("📤 Submitting profile update...");
      const response = await updateBrandProfile(formDataToSend);
      console.log("✅ Profile update response:", response);

      if (response?.profile) {
        dispatch(updateUser({ profile: response.profile }));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      }

    } catch (error) {
      console.error("❌ Error updating profile:", error);
      setError(error?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ========== REGISTER WITH TRADESAFE ==========
  const handleTradeSafeRegistration = async () => {
    if (!tradeSafeData.bank || !tradeSafeData.accountNumber) {
      setError("Please fill in bank details to register for payouts");
      return;
    }

    setIsTradeSafeSubmitting(true);
    setError("");

    try {
      console.log("📤 Registering brand with TradeSafe...");
      console.log("   Bank:", tradeSafeData.bank);
      console.log("   Account Number:", tradeSafeData.accountNumber);

      const payload = {
        bank: tradeSafeData.bank,
        accountNumber: tradeSafeData.accountNumber,
        accountType: tradeSafeData.accountType || "CHEQUE",
      };

      const response = await submitBrandTradeSafeDetails(payload);
      console.log("✅ TradeSafe registration response:", response);

      if (response?.success) {
        setTradeSafeStatus("PENDING");
        setTradeSafeUserId(response.data?.tradeSafeUserId);
        setTradeSafeReference(response.data?.tradeSafeReference);
        setIsTradeSafeRegistered(true);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError(response?.error || "Failed to register with TradeSafe");
      }

    } catch (error) {
      console.error("❌ TradeSafe registration error:", error);
      setError(error?.message || "Failed to register with TradeSafe");
    } finally {
      setIsTradeSafeSubmitting(false);
    }
  };

  // ========== RENDER TRADESAFE STATUS ==========
  const renderTradeSafeStatus = () => {
    if (!isTradeSafeRegistered) {
      return (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-700">
            ⚠️ Not registered for payouts. Please add bank details below.
          </p>
        </div>
      );
    }

    if (tradeSafeStatus === "VERIFIED") {
      return (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">
            ✅ TradeSafe Verified!
            <br />
            <span className="text-xs text-green-600">
              Reference: {tradeSafeReference}
            </span>
          </p>
        </div>
      );
    }

    if (tradeSafeStatus === "PENDING") {
      return (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-sm text-blue-700">
            ⏳ TradeSafe verification pending.
            <br />
            <span className="text-xs text-blue-600">
              Reference: {tradeSafeReference}
            </span>
          </p>
        </div>
      );
    }

    if (tradeSafeStatus === "FAILED") {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">
            ❌ TradeSafe verification failed. Please try again.
          </p>
        </div>
      );
    }

    return null;
  };

  // ========== LOADING STATE ==========
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  // ========== MAIN RENDER ==========
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl p-6 sm:p-10 shadow-sm border border-gray-100">
          <h2 className="text-2xl sm:text-3xl font-anton uppercase text-gray-900 text-center mb-4">
            EDIT PROFILE
          </h2>
          <p className="text-center text-sm text-gray-500 mb-8">
            Brands create an account by submitting essential company details,
            after which their profile undergoes admin review. Upon approval,
            they gain full access to the platform's dashboard and campaign
            tools.
          </p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
              ✅ Profile updated successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* ========== COMPANY INFORMATION ========== */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter Company Name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Enter Website URL"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Email
                </label>
                <input
                  type="email"
                  name="companyEmail"
                  value={formData.companyEmail}
                  onChange={handleChange}
                  placeholder="Enter Company Email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Country</option>
                  {COUNTRY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City / Town
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type
                </label>
                <select
                  name="businessType"
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Business Type</option>
                  {BUSINESS_TYPES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Role
                </label>
                <select
                  name="jobRole"
                  value={formData.jobRole}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Select Job Role</option>
                  {JOB_ROLES.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Company Registration Number
              </label>
              <input
                type="text"
                name="companyRegistrationNumber"
                value={formData.companyRegistrationNumber}
                onChange={handleChange}
                placeholder="Enter Company Registration Number"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
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

            {/* Upload Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Logo
              </label>
              <div className="flex flex-col items-center gap-4 mt-4 sm:flex-row sm:items-start sm:text-left">
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
                    {logoPreview ? (
                      <img
                        src={logoPreview}
                        alt="Preview"
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

                <div className="flex flex-col gap-2 mt-2 items-center text-center sm:items-start sm:text-left">
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

            {/* ========== TRADESAFE PAYOUT SETTINGS ========== */}
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Payout Settings (TradeSafe)
              </h3>

              {renderTradeSafeStatus()}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <select
                    name="bank"
                    value={tradeSafeData.bank}
                    onChange={handleTradeSafeChange}
                    disabled={isTradeSafeRegistered}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Bank</option>
                    {SA_BANK_OPTIONS.map((bank) => (
                      <option key={bank.value} value={bank.value}>
                        {bank.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Type
                  </label>
                  <select
                    name="accountType"
                    value={tradeSafeData.accountType}
                    onChange={handleTradeSafeChange}
                    disabled={isTradeSafeRegistered}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    {BANK_ACCOUNT_TYPES.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    name="accountNumber"
                    value={tradeSafeData.accountNumber}
                    onChange={handleTradeSafeChange}
                    disabled={isTradeSafeRegistered}
                    placeholder="Enter Account Number"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              {!isTradeSafeRegistered && (
                <button
                  type="button"
                  onClick={handleTradeSafeRegistration}
                  disabled={isTradeSafeSubmitting || !tradeSafeData.bank || !tradeSafeData.accountNumber}
                  className={`mt-4 px-6 py-2 text-sm font-medium rounded-lg transition ${
                    isTradeSafeSubmitting || !tradeSafeData.bank || !tradeSafeData.accountNumber
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isTradeSafeSubmitting ? "Registering..." : "Register for Payouts"}
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col items-center gap-3 pt-4 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => navigate("/brand/my-profile")}
                className="w-full sm:w-auto px-10 py-4 text-sm font-medium text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition"
              >
                Back
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-7 py-4 text-sm font-medium text-white bg-[#1E60DB] rounded-full hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Saving..." : "Update Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}