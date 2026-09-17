import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import uploadIcon from "../../../assets/images/createAccount/uploadicon.svg";

export default function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData, profilePhoto);
    // TODO: Implement actual update logic
    navigate("/brand/my-profile");
  };

  const handleBack = () => {
    navigate("/brand/my-profile");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* White Card Container */}
        <div className="bg-white rounded-xl p-6 sm:p-10 shadow-sm border border-gray-100">
          <h2 className="text-2xl sm:text-3xl uppercase text-gray-900 text-center mb-4">
            EDIT PROFILE
          </h2>
          <p className="text-center text-sm text-gray-500 mb-8">
            Brands create an account by submitting essential company details,
            after which their profile undergoes admin review. Upon approval,
            they gain full access to the platform's dashboard and campaign
            tools.
          </p>

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
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter Email"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter Phone Number"
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

            {/* Upload Logo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Logo
              </label>
              <div className="flex flex-col items-center gap-4 mt-4 sm:flex-row sm:items-start sm:text-left">
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
                className="w-full sm:w-auto px-7 py-4 text-sm font-medium text-white bg-[#1E60DB] rounded-full hover:bg-blue-600 transition"
              >
                Update Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
