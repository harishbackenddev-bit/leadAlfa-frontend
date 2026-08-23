import React from "react";
import Button from "../Button";

const CampaignCard = () => {
  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6 bg-white border border-gray-200 rounded-2xl shadow-sm py-4 px-2  mx-auto">
      {/* Left Image Section */}
      <div className="relative flex-shrink-0">
        <img
          src="https://via.placeholder.com/200x150"
          alt="Campaign"
          className="w-56 h-40 object-cover rounded-lg"
        />
        <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded">
          Boosted
        </span>
      </div>

      {/* Right Details Section */}
      <div className="flex flex-col justify-between h-full w-full">
        <h2 className=" font-anton text-2xl text-gray-900 mb-2">
          Unboxing Photo Shoot
        </h2>

        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#0c7bb3] font-semibold text-lg">$19,500</span>
          <span className="text-gray-400 line-through text-sm">$28,500</span>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry's standard dummy text ever
          since the 1500s, when an unknown printer took a galley of type and
          scrambled it to make a type specimen book. It has survived not only
          five centuries, but also the leap into electronic typesetting,
          remaining essentially unchanged. It was popularised in the 1960s.
        </p>

        <div className="flex gap-3">
          <Button variant="primary">Apply Now</Button>
          <Button variant="secondary">View Details</Button>
        </div>
      </div>
    </div>
  );
};

export default CampaignCard;
