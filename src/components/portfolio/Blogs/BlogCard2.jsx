import { Link } from "react-router-dom";
import MediaViewer from "../Lab/MediaViewer";

export default function BlogCard2({ media, title, to = "/", className = "" }) {
  return (
    <div className={`max-w-md rounded-1xl overflow-hidden ${className}`}>
      {/* Media (image or video) */}
      <div className="w-full h-auto overflow-hidden">
        <MediaViewer file={media} className="rounded-[5px]!" />
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Title */}
        <h3 className=" text-[12px] font-semibold text-gray-800 mb-3">
          {title}
        </h3>

        {/* Read More Link */}
        <Link
          to={to}
          className="text-[#0c7bb3] text-[12px] font-medium flex items-center cursor-pointer"
        >
          Read More
          <svg
            width="20"
            height="19"
            viewBox="0 0 20 19"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="ml-1 transition-transform duration-300 group-hover:translate-x-1 -mb-2"
          >
            <path
              d="M9.39375 0.900391L9.90937 0.384766C10.1437 0.173828 10.4953 0.173828 10.7062 0.384766L15.2766 4.93164C15.4875 5.16602 15.4875 5.51758 15.2766 5.72852L10.7062 10.2988C10.4953 10.5098 10.1437 10.5098 9.90937 10.2988L9.39375 9.7832C9.18281 9.54883 9.18281 9.19727 9.39375 8.96289L12.2297 6.26758H5.50312C5.175 6.26758 4.94062 6.0332 4.94062 5.70508V4.95508C4.94062 4.65039 5.175 4.39258 5.50312 4.39258H12.2297L9.39375 1.7207C9.18281 1.48633 9.15937 1.13477 9.39375 0.900391Z"
              fill="#1E60DB"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}
