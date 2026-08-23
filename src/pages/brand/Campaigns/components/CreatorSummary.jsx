import React from 'react';
import avatarImg from '../../../../assets/images/creator/explorcampagainImag.png';
import starIcon from '../../../../assets/images/creator/ratingStar.svg';
import { ChevronDownBlueIcon } from '../../../../assets/SVGs/brands/customSVGs';

export default function CreatorSummary({
  name,
  rating = '—',
  avatar,
}) {
  if (name == null || String(name).trim() === '' || String(name).trim() === '-') {
    return null;
  }

  return (
    <div className="w-full bg-gray-200 mt-8 rounded-xl px-4 py-5 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img src={avatar || avatarImg} alt={name} className="w-12 h-12 rounded-full object-cover" />

        <div className="flex items-center gap-2">
          <div className="text-2xl font-extrabold font-anton">{name}</div>
          <div className="h-8 border-l-3 border-gray-700" />

          <div className="flex items-center gap-2 text-sm">
            <img src={starIcon} alt="star" className="w-4 h-4" />
            <div className="font-extrabold text-2xl">{rating}/5</div>
          </div>
        </div>
      </div>

      <div>
        <ChevronDownBlueIcon className="w-10 h-10" />
      </div>
    </div>
  );
}
