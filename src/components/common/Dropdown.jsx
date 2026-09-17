import { useState } from "react";

const ChevronDown = ({ className = "" }) => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5 7.5L10 12.5L15 7.5"
      stroke="#898989"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function Dropdown({
  label = "Select",
  value = null,
  onChange = () => {},
  className = "",
  trigger = "click",
  children,
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);

  const handleSelect = (item) => {
    setSelected(item);
    onChange(item);
    setOpen(false);
  };

  const wrapperProps =
    trigger === "hover"
      ? {
          onMouseEnter: () => setOpen(true),
          onMouseLeave: () => setOpen(false),
        }
      : {};

  return (
    <div className={`relative ${className}`} {...wrapperProps}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={
          trigger === "click" ? () => setOpen((prev) => !prev) : undefined
        }
        className="flex items-center justify-between gap-2 px-5 py-2 w-full transition"
      >
        <span className="truncate">{selected || label}</span>
        <ChevronDown
          className={`transition-transform duration-200 ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Dropdown Content */}
      {open && (
        <div className="absolute -left-full top-full z-50 w-screen -translate-x-5">
          {/* Center container for max-width */}
          <div className="w-full  mx-auto -mt-1">
            {typeof children === "function"
              ? children({ handleSelect })
              : children}
          </div>
        </div>
      )}
    </div>
  );
}
