import { mapBrandProfileForDisplay } from "../../../../utils/brandProfileDisplay";

function InfoRow({ label, value }) {
  return (
    <div className="flex w-full items-center gap-1">
      <span className="min-w-[140px] text-sm text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

export default function CompanyInformation({ user, profile }) {
  const { company } = mapBrandProfileForDisplay(user, profile);

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
      <h4 className="mb-4 text-xl uppercase text-gray-900">
        COMPANY INFORMATION
      </h4>
      <div className="flex flex-col items-start gap-3 text-sm text-gray-700">
        <InfoRow label="Company Name:" value={company.companyName} />
        <InfoRow label="Company Website:" value={company.companyWebsite} />
        <InfoRow label="Company Email:" value={company.companyEmail} />
        <InfoRow label="Address:" value={company.address} />
        <InfoRow label="Country:" value={company.state} />
      </div>
    </div>
  );
}
