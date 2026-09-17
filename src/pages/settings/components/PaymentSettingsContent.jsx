import React, { useState } from "react";
import SettingsPageHeading from "./SettingsPageHeading";

export default function PaymentSettingsContent() {
  const [showCVV, setShowCVV] = useState(false);
  const [saveInfo, setSaveInfo] = useState(false);

  const [formData, setFormData] = useState({
    cardHolderName: "",
    cardNumber: "",
    mmyy: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log("Saving payment settings:", formData);
    // TODO: Implement save logic
  };

  return (
    <>
    <SettingsPageHeading
      title="Payment Settings"
      subtitle="Add a card and manage how you get paid"
    />
    <div className="bg-white rounded-xl p-4 sm:p-6">
      <h2 className="mb-6 text-base font-semibold text-gray-900 sm:text-lg">
        Add Payment Method
      </h2>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Card Holder Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Card Holder Name
          </label>
          <input
            type="text"
            name="cardHolderName"
            value={formData.cardHolderName}
            onChange={handleInputChange}
            placeholder="Enter Card Holder Name"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            Card Number
          </label>
          <input
            type="text"
            name="cardNumber"
            value={formData.cardNumber}
            onChange={handleInputChange}
            placeholder="Enter Card Number"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* MM/YY */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            MM/YY
          </label>
          <input
            type="text"
            name="mmyy"
            value={formData.mmyy}
            onChange={handleInputChange}
            placeholder="Enter MM/YY"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* CVV */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            CVV
          </label>
          <div className="relative">
            <input
              type={showCVV ? "text" : "password"}
              name="cvv"
              value={formData.cvv}
              onChange={handleInputChange}
              placeholder="Enter CVV"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCVV(!showCVV)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCVV ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Save Checkbox */}
      <div className="border border-gray-200 rounded-lg p-4 mb-6">
        <label className="flex items-start gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={saveInfo}
            onChange={(e) => setSaveInfo(e.target.checked)}
            className="mt-1 w-4 h-4 text-[#0c7bb3] border-gray-300 rounded focus:ring-blue-500"
          />
          <div>
            <span className="block text-sm font-medium text-gray-900">
              Save my information
            </span>
            {/* <span className="block text-sm text-gray-500 mt-1">
              With SundayUGC, creators get paid faster while unlocking exclusive perks, seamless payouts, and unlimited benefits designed to elevate their content journey.
            </span> */}
          </div>
        </label>
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="px-8 py-3 bg-[#1E60DB] text-white text-sm font-medium rounded-full hover:bg-blue-700 transition-colors"
      >
        Save
      </button>
    </div>
    </>
  );
}
