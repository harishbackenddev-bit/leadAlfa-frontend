// Shared pill button for the marketing pages. Height is pinned with h-12 so the
// arrow and no-arrow variants stay the same size as each other.
export default function ActionButton({
  label = "Click Me",
  onClick = () => {},
  arrow_bg = "#1F8FC8",
  stroke = "#ffffff",
  variant = "primary",
  showArrow = true,
  type = "button",
  className = "",
}) {
  const variantClass = variant === "secondary" ? "sec-btn" : "main-btn";

  return (
    <button
      type={type}
      onClick={onClick}
      className={`flex h-12 w-fit cursor-pointer items-center gap-2 whitespace-nowrap rounded-full text-[14px] font-medium transition-all duration-300 hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c7bb3] focus-visible:ring-offset-2 sm:text-[16px] ${
        showArrow ? "justify-between pl-6 pr-1" : "justify-center px-7"
      } ${variantClass} ${className}`}
    >
      {label}
      {showArrow && (
        <svg
          viewBox="0 0 41 40"
          xmlns="http://www.w3.org/2000/svg"
          className="h-10 w-10 shrink-0"
          aria-hidden="true"
        >
          <rect x="0.279785" width="40" height="40" rx="20" fill={arrow_bg} />
          <path
            d="M16.1573 23.1248L24.4068 14.8752M24.4068 14.8752H16.1573M24.4068 14.8752V23.1248"
            stroke={stroke}
            strokeWidth="1.66667"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}
