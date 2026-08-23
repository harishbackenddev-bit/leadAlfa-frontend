import React from 'react';
import avatarImg from '../../../../assets/images/creator/explorcampagainImag.png';
import starIcon from '../../../../assets/images/creator/ratingStar.svg';

export default function CreatorDetails({ creator = null, noContainer = false }) {
  if (!creator || typeof creator !== 'object') return null;

  const data = {
    name: creator.name ?? '-',
    rating: creator.rating ?? '-',
    jobsCompleted: creator.jobsCompleted ?? '-',
    address: creator.address ?? '-',
  };

  const inner = (
    <div>
      <h3 className="text-2xl font-extrabold font-anton mb-4">Creator Details</h3>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-start">
        <div className="flex items-center gap-4">
          <img
            src={creator.avatarUrl || avatarImg}
            alt={data.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <div className="text-sm text-gray-700">Name</div>
            <div className="text-base font-medium text-gray-800">{data.name}</div>
          </div>
        </div>

        <div className="border-l border-gray-200 pl-6">
          <div className="text-sm text-gray-700">Ratings</div>
          <div className="mt-2 flex items-center gap-2">
            <img src={starIcon} alt="star" className="w-5 h-5" />
            <div className="text-sm text-gray-700">{data.rating}/5</div>
          </div>
        </div>

        <div className="border-l border-gray-200 pl-6">
          <div className="text-sm text-gray-700">Jobs Completed</div>
          <div className="mt-2 text-sm text-gray-700">{data.jobsCompleted}</div>
        </div>

        <div className="border-l border-gray-200 pl-6">
          <div className="text-sm text-gray-700">Address</div>
          <div className="mt-2 text-sm text-gray-700">{data.address}</div>
        </div>
      </div>
    </div>
  );

  if (noContainer) return <div className="py-6">{inner}</div>;

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">{inner}</div>
  );
}
