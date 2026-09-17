import React from "react";

const CampaignBannerImage = ({
  imageUrl,
  altText = "Campaign Banner",
  title,
  status,
}) => {
  return (
    <div className="w-full mb-6">
      <div className="relative w-full h-[420px] rounded-xl overflow-hidden shadow-lg">
        <img
          src={imageUrl}
          alt={altText}
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

        {status ? (
          <span className="absolute right-4 top-4 rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white">
            {String(status).charAt(0).toUpperCase() + String(status).slice(1)}
          </span>
        ) : null}

        {title ? (
          <div className="absolute bottom-4 left-4">
            <h2 className="text-2xl font-semibold text-white drop-shadow">
              {title}
            </h2>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CampaignBannerImage;
