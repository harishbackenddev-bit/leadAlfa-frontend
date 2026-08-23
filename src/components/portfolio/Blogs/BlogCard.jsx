import { Link } from "react-router-dom";
import MediaViewer from "../../common/MediaViewer";

const Svg = ({ className = "" }) => (
  <svg
    width="20"
    height="19"
    viewBox="0 0 20 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M9.39375 0.900391L9.90937 0.384766C10.1437 0.173828 10.4953 0.173828 10.7062 0.384766L15.2766 4.93164C15.4875 5.16602 15.4875 5.51758 15.2766 5.72852L10.7062 10.2988C10.4953 10.5098 10.1437 10.5098 9.90937 10.2988L9.39375 9.7832C9.18281 9.54883 9.18281 9.19727 9.39375 8.96289L12.2297 6.26758H5.50312C5.175 6.26758 4.94062 6.0332 4.94062 5.70508V4.95508C4.94062 4.65039 5.175 4.39258 5.50312 4.39258H12.2297L9.39375 1.7207C9.18281 1.48633 9.15937 1.13477 9.39375 0.900391Z"
      fill="#1E60DB"
    />
  </svg>
);

export default function BlogCard({
  media,
  author,
  avatar,
  title,
  description,
  className = "",
}) {
  // const [expanded, setExpanded] = useState(false);

  return (
    <div className={`max-w-md rounded-2 overflow-hidden  ${className}`}>
      {/* Media (image or video) */}
      <div className="w-full h-auto overflow-hidden">
        <MediaViewer
          file={media}
          className="rounded-[5px]! min-h-[180px] object-fit"
        />
      </div>

      {/* Content */}
      <div className="py-4">
        {/* Author */}
        <div className="flex items-center gap-2 mb-3">
          {avatar && (
            <img
              src={avatar}
              alt={author}
              className="w-8 h-8 rounded-full object-cover"
            />
          )}
          <span className="text-sm text-gray-600">{author}</span>
        </div>

        {/* Title */}
        <h3 className="text-[1.2rem] font-semibold text-gray-800 mb-2">
          {title}
        </h3>

        <p className="text-[0.8rem] text-[#666666] mb-3">{description}</p>
        <Link
          className="text-[#0c7bb3] text-[1rem] font-medium flex items-center cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          to="/blogs-articles"
        >
          {"Read More"}{" "}
          <Svg
            className={`ml-1 transition-transform duration-300 ${"rotate-0 -mb-2"}`}
          />
        </Link>
      </div>
    </div>
  );
}
