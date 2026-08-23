import React from "react";

export default function CompanyInformation({ user, profile }) {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
      <h4 className="text-xl font-anton uppercase text-gray-900 mb-4">
        COMPANY INFORMATION
      </h4>
      <div className="flex flex-col items-start gap-3 text-sm text-gray-700">
        <div className="flex items-center gap-1 w-full">
          <span className="text-sm text-gray-500 min-w-[140px]">
            Company Name:
          </span>
          <span className="font-medium text-gray-900">
            {profile?.companyName || "Nike"}
          </span>
        </div>

        <div className="flex items-center gap-1 w-full">
          <span className="text-sm text-gray-500 min-w-[140px]">
            Company Website:
          </span>
          <span className="font-medium text-gray-900">
            {profile?.companyWebsite || "www.example.com"}
          </span>
        </div>

        <div className="flex items-center gap-1 w-full">
          <span className="text-sm text-gray-500 min-w-[140px]">
            Company Email:
          </span>
          <span className="font-medium text-gray-900">
            {profile?.companyEmail || "supportnike@nike.com"}
          </span>
        </div>

        <div className="flex items-center gap-1 w-full">
          <span className="text-sm text-gray-500 min-w-[140px]">Address:</span>
          <span className="font-medium text-gray-900">
            {profile?.companyAddress || "1475, New Street"}
          </span>
        </div>

        <div className="flex items-center gap-1 w-full">
          <span className="text-sm text-gray-500 min-w-[140px]">State:</span>
          <span className="font-medium text-gray-900">
            {profile?.companyState || "USA"}
          </span>
        </div>
      </div>
    </div>
  );
}
