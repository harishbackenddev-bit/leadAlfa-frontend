import { mapBrandProfileForDisplay } from "../../../../utils/brandProfileDisplay";

function InfoRow({ label, value }) {
  return (
    <div className="flex w-full items-center gap-1">
      <span className="min-w-[120px] text-sm text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

export default function PersonalInformation({ user, profile }) {
  const { personal } = mapBrandProfileForDisplay(user, profile);

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      <h4 className="mb-4 text-xl uppercase text-gray-900">
        PERSONAL INFORMATION
      </h4>
      <div className="flex flex-col items-start gap-3 text-sm text-gray-700">
        <InfoRow label="Name:" value={personal.name} />
        <InfoRow label="Work Email:" value={personal.workEmail} />
        <InfoRow label="Phone Number:" value={personal.phoneNumber} />
        <InfoRow label="Address:" value={personal.address} />
        <InfoRow label="City:" value={personal.city} />
        <InfoRow label="Country:" value={personal.state} />
      </div>
    </div>
  );
}
