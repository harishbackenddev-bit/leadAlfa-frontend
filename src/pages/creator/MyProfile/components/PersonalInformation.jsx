import React from "react";

export default function PersonalInformation({ user, profile }) {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 mb-6 shadow-sm border border-gray-100">
      <h4 className="text-xl font-anton text-gray-900 mb-4">
        Personal Information
      </h4>
      <div className="flex flex-col flex-wrap items-start justify-between gap-2 text-sm text-gray-700 lg:flex-row lg:items-center">
        <div className="flex items-center gap-3 min-w-[140px]">
          <span className="text-xs text-gray-500">Name:</span>
          <span className="font-medium text-gray-900">
            {user?.firstName} {user?.lastName}
          </span>
        </div>

        <div className="flex items-center gap-3 min-w-[220px]">
          <span className="text-xs text-gray-500">Work Email:</span>
          <span className="font-medium text-gray-900">{user?.email}</span>
        </div>

        <div className="flex items-center gap-3 min-w-[180px]">
          <span className="text-xs text-gray-500">Phone Number:</span>
          <span className="font-medium text-gray-900">
            {user?.phoneNumber || profile?.phoneNumber}
          </span>
        </div>

        <div className="flex items-center gap-3 min-w-[220px]">
          <span className="text-xs text-gray-500">Address:</span>
          <span className="font-medium text-gray-900">
            {profile?.addressLine1 || ""}
            {profile?.addressLine2 ? `, ${profile.addressLine2}` : ""}
            {profile?.country ? `, ${profile.country}` : ""}
            {profile?.postalZipCode ? ` - ${profile.postalZipCode}` : ""}
          </span>
        </div>

        <div className="flex items-center gap-3 min-w-[140px]">
          <span className="text-xs text-gray-500">City:</span>
          <span className="font-medium text-gray-900">
            {profile?.city || ""}
          </span>
        </div>
      </div>
    </div>
  );
}
