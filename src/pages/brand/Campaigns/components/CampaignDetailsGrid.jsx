import React from 'react';

const CampaignDetailsGrid = ({ description, startDate, creatorsNeeded, deliverable }) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-base font-semibold text-gray-900 mb-3">
        Campaign Description
      </h3>
      <p className="text-gray-700 text-sm leading-relaxed mb-6">
        {description}
      </p>

      <div className="gap-6 flex">
        <div className="border-r border-gray-200 pr-6">
          <p className="text-xs uppercase tracking-wide">
            Campaign Start On:
          </p>
          <p className="mt-2 text-sm text-neutral-600">{startDate}</p>
        </div>
        <div className="border-r border-gray-200 pr-6">
          <p className="text-xs uppercase tracking-wide">
            Creators Needed:
          </p>
          <p className="mt-2 text-sm text-neutral-600">{creatorsNeeded}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide">
            Deliverable:
          </p>
          <p className="mt-2 text-sm text-neutral-600">{deliverable}</p>
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailsGrid;
