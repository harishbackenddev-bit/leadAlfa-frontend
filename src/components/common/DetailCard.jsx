import ActionButton from "./ActionButton";
import MediaViewer from "./MediaViewer";

const CheckIcon = ({ width = 35, height = 35 }) => (
  <svg
    width={width}
    height={height}
    className="flex-shrink-0"
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1201_965)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M0 25C0 19.287 1.475 15.726 4.1005 13.1005C6.726 10.475 10.287 9 14 9C17.713 9 21.274 10.475 23.8995 13.1005C26.525 15.726 28 19.287 28 25C28 28.713 26.525 32.274 23.8995 34.8995C21.274 37.525 17.713 39 14 39C10.287 39 6.726 37.525 4.1005 34.8995C1.475 32.274 0 28.713 0 25ZM13.2011 29.992L21.2613 19.9157L19.8053 18.7509L12.9323 27.3395L8.064 23.2832L6.86933 24.7168L13.2011 29.992Z"
        fill="#0c7bb3"
      />
    </g>
    <defs>
      <clipPath id="clip0_1201_965">
        <rect width="50" height="50" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default function DetailCard({
  title,
  description,
  points,
  file,
  buttonLabel,
  mediaSide = "right",
  mediaWidth = 100,
  shadow = false,
  className = "",
  actionClass = "",
}) {
  const isImageLeft = mediaSide === "left";

  return (
    <section
      className={`flex flex-col-reverse md:flex-row ${
        isImageLeft ? "md:flex-row-reverse!" : "md:flex-row!"
      } items-center justify-between gap-10 lg:gap-20 px-6 lg:px-24 py-12`}
    >
      {/* Text Content */}
      <div className="flex-1 space-y-3">
        <h1 className="text-[24px] sm:text-[36px] lg:text-[42px] font-bold leading-[1.25] sm:leading-[1.2] tracking-[-0.02em] text-[#101727]">
          {title}
        </h1>

        <p className="text-[#606977] leading-[1.8] text-[15px]">
          {description}
        </p>

        <ul className="text-gray-700 text-[12px] ">
          {points?.length > 0 &&
            points.map((point, i) => (
              <li key={i} className="flex items-center mb-1.5">
                <CheckIcon />
                <span>{point}</span>
              </li>
            ))}
        </ul>

        {buttonLabel && (
          <ActionButton label={buttonLabel} className={actionClass} />
        )}
      </div>

      {/* Image */}
      <div className="flex-1 flex justify-center">
        <div
          className="relative w-full overflow-hidden rounded-[20px] shadow-lg"
          style={{ maxWidth: `${mediaWidth}%` }}
        >
          <MediaViewer
            file={file}
            className={`block h-auto w-full rounded-[20px] ${className}`}
          />

          {shadow && (
            <>
              {/* Top to mid gradient */}
              <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

              {/* Bottom to mid gradient */}
              <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-white/60 to-transparent pointer-events-none" />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
