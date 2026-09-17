export default function CampaignDetailsSection({
  description,
  website,
  city,
  country,
  campaignStartDate,
  creatorsNeeded,
  status,
  deliverable,
  applicants,
}) {
  return (
    <div className="bg-white">
      <div className="px-4 sm:px-6 lg:px-8 py-2">
        <div className="mb-6">
          <p className="text-gray-700 leading-loose text-xs md:text-sm">
            {description}
          </p>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-3 md:grid-cols-8 gap-2 mb-10">
          <div className="md:pr-6">
            <h4 className="md:text-sm text-xs font-semibold text-gray-900 mb-2">Website</h4>
            <p className="text-gray-700 md:text-sm text-xs">{website}</p>
          </div>
          <div className="md:px-6 md:border-l md:border-r border-gray-200">
            <h4 className="md:text-sm text-xs font-semibold text-gray-900 mb-2">City</h4>
            <p className="text-gray-700 md:text-sm text-xs">{city}</p>
          </div>
          <div className="md:pl-6">
            <h4 className="md:text-sm text-xs font-semibold text-gray-900 mb-2">Country</h4>
            <p className="text-gray-700 md:text-sm text-xs">{country}</p>
          </div>
        </div>

        <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-10">
          Campaign Details
        </h3>
        <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-3 md:grid-cols-8 gap-2 items-start mb-8">
          <div>
            <div className="md:text-sm text-xs font-semibold text-gray-900">Campaigns Start On:</div>
            <div className="mt-2 text-gray-700 md:text-sm text-xs">{campaignStartDate}</div>
          </div>
          <div className="md:border-l md:pl-6 border-gray-200">
            <div className="md:text-sm text-xs font-semibold text-gray-900">Creators Needed:</div>
            <div className="mt-2 text-gray-700 md:text-sm text-xs">{creatorsNeeded}</div>
          </div>
          <div className="md:pl-6 md:border-l border-gray-200">
            <div className="md:text-sm text-xs font-semibold text-gray-900">Status</div>
            <div className="mt-2">
              <span className={`inline-flex items-center px-4 py-1 rounded-sm md:text-sm text-xs border-1 border-green-600 ${status === 'Active' ? 'bg-green-100 ' : 'bg-gray-100 text-gray-700'}`}>
                {status}
              </span>
            </div>
          </div>
          <div className="md:pl-6 md:border-l border-gray-200">
            <div className="md:text-sm text-xs font-semibold text-gray-900">Deliverable:</div>
            <div className="mt-2 md:text-sm text-xs text-gray-700">{deliverable}</div>
          </div>
          <div className="md:pl-6 md:border-l border-gray-200">
            <div className="md:text-sm text-xs font-semibold text-gray-900">Applicants:</div>
            <div className="mt-2 md:text-sm text-xs text-gray-700">{applicants}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
