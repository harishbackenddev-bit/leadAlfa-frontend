// ServiceCategory.jsx

import { Link } from "react-router-dom";
import HoverLinkArrow from "./HoverLinkArrow";

export default function ServiceCategory({
  title = "",
  titleLink = "#",
  items = [],
  onItemClick,
}) {
  return (
    <div className="px-6 py-4">
      {/* Header Area */}
      <div className="h-10 flex items-center">
        {title.trim() && (
          <HoverLinkArrow
            title={title}
            titleLink={titleLink}
          />
        )}
      </div>

      {/* Items */}
      <div className="space-y-8">
        {items.map(({ heading, desc, to }, index) => (
          <Link
            key={index}
            to={to}
            onClick={onItemClick}
            className="block hover:opacity-70 transition-all duration-200 ease-in-out"
          >
            <h4 className="text-[16px] font-semibold text-black mb-2">
              {heading}
            </h4>

            <p className="text-[13px] max-w-80 text-[#6A6A70] leading-relaxed">
              {desc}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}