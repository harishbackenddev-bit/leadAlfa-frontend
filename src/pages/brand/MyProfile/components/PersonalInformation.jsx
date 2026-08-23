export default function PersonalInformation({ user, profile }) {
  return (
    <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-gray-100">
      <h4 className="text-xl font-anton uppercase text-gray-900 mb-4">
        PERSONAL INFORMATION
      </h4>
      <div className="flex flex-col items-start gap-3 text-sm text-gray-700">
        <div className="flex items-center gap-1 w-full">
          <span className="text-sm text-gray-500 min-w-[120px]">Name:</span>
          <span className="font-medium text-gray-900">
            {user?.firstName} {user?.lastName}
          </span>
        </div>

        <div className="flex items-center gap-1 w-full">
          <span className="text-sm text-gray-500 min-w-[120px]">
            Work Email:
          </span>
          <span className="font-medium text-gray-900">{user?.email}</span>
        </div>

        <div className="flex items-center gap-1 w-full">
          <span className="text-sm text-gray-500 min-w-[120px]">
            Phone Number:
          </span>
          <span className="font-medium text-gray-900">
            {user?.phoneNumber || profile?.phoneNumber}
          </span>
        </div>

        <div className="flex items-center gap-1 w-full">
          <span className="text-sm text-gray-500 min-w-[120px]">Address</span>
          <span className="font-medium text-gray-900">
            {profile?.addressLine1 || "1475, New Street"}
          </span>
        </div>

        <div className="flex items-center gap-1 w-full">
          <span className="text-sm text-gray-500 min-w-[120px]">City:</span>
          <span className="font-medium text-gray-900">
            {profile?.city || "California"}
          </span>
        </div>

        <div className="flex items-center gap-1 w-full">
          <span className="text-sm text-gray-500 min-w-[120px]">State:</span>
          <span className="font-medium text-gray-900">
            {profile?.state || "USA"}
          </span>
        </div>
      </div>
    </div>
  );
}
