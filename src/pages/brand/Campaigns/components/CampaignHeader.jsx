import React from "react";
import { useNavigate } from "react-router-dom";

const CampaignHeader = ({ breadcrumbs = [] }) => {
  const navigate = useNavigate();

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 text-sm">
        {breadcrumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <button
              onClick={() => crumb.path && navigate(crumb.path)}
              className={`${
                crumb.path
                  ? "text-gray-500 hover:text-gray-700 cursor-pointer"
                  : "text-[#0c7bb3] font-medium"
              }`}
            >
              {crumb.label}
            </button>
            {index < breadcrumbs.length - 1 && (
              <span className="text-gray-400">›</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CampaignHeader;
