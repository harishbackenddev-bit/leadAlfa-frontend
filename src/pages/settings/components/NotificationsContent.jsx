import React, { useState } from "react";
import SettingsPageHeading from "./SettingsPageHeading";

export default function NotificationsContent() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyNewsletter, setWeeklyNewsletter] = useState(true);
  const [websiteNotifications, setWebsiteNotifications] = useState(true);

  const [notificationOptions, setNotificationOptions] = useState({
    campaign: false,
    proposal: false,
    message: false,
  });

  const handleCheckboxChange = (option) => {
    setNotificationOptions((prev) => ({
      ...prev,
      [option]: !prev[option],
    }));
  };

  const handleSaveChanges = () => {
    console.log("Saving notification settings:", {
      emailNotifications,
      weeklyNewsletter,
      websiteNotifications,
      notificationOptions,
    });
  };

  return (
    <>
    <SettingsPageHeading
      title="Notifications"
      subtitle="Choose which updates you get and where they reach you"
    />
    <div className="bg-white rounded-xl">
      {/* Email Notifications Section */}
      <div className="border-b border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
            Email Notifications
          </h2>
          <button
            onClick={() => setEmailNotifications(!emailNotifications)}
            className="relative w-14 h-6 rounded-full transition-colors flex-shrink-0 bg-[#EAEAEA]"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${
                emailNotifications
                  ? "left-0.5 bg-[#1E60DB]"
                  : "left-8 bg-[#1E60DB]"
              }`}
            />
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter Email Address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Weekly Newsletter Section */}
      <div className="border-b border-gray-200 p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
            Weekly Newsletter
          </h2>
          <button
            onClick={() => setWeeklyNewsletter(!weeklyNewsletter)}
            className="relative w-14 h-6 rounded-full transition-colors flex-shrink-0 bg-[#EAEAEA]"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${
                weeklyNewsletter
                  ? "left-0.5 bg-[#1E60DB]"
                  : "left-8 bg-[#1E60DB]"
              }`}
            />
          </button>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-2">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter Email Address"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-400 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Website Notifications Section */}
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
            Website Notifications
          </h2>
          <button
            onClick={() => setWebsiteNotifications(!websiteNotifications)}
            className="relative w-14 h-6 rounded-full transition-colors flex-shrink-0 bg-[#EAEAEA]"
          >
            <span
              className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 ${
                websiteNotifications
                  ? "left-0.5 bg-[#1E60DB]"
                  : "left-8 bg-[#1E60DB]"
              }`}
            />
          </button>
        </div>

        {/* Checkbox Options */}
        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationOptions.campaign}
              onChange={() => handleCheckboxChange("campaign")}
              className="w-4 h-4 border-2 border-gray-300 rounded text-[#0c7bb3] focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              Campaign Notifications
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationOptions.proposal}
              onChange={() => handleCheckboxChange("proposal")}
              className="w-4 h-4 border-2 border-gray-500 rounded text-[#0c7bb3] focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">
              Proposal Notifications
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={notificationOptions.message}
              onChange={() => handleCheckboxChange("message")}
              className="w-4 h-4 border-2 border-gray-500 rounded text-[#0c7bb3] focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">Message Notifications</span>
          </label>
        </div>

        {/* Save Button */}
        <button
          onClick={handleSaveChanges}
          className="mt-6 px-6 py-3 bg-[#1E60DB] text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
        >
          Save Changes
        </button>
      </div>
    </div>
    </>
  );
}
