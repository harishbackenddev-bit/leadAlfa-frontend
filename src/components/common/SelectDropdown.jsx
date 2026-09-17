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

export default function SelectDropdown({
  label = "Select",
  items = [],
  value = null,
  onChange = () => { },
  className = "",
  innerClassName = "",
  btnClassName = "",
  liClassName = "",
  menuAlign = "left",
  trigger = "click", // "click" | "hover"
}) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(value);

  const handleSelect = (item) => {
    setSelected(item);
    onChange(item);
    setOpen(false);
  };

  // ✅ For hover mode
  const wrapperProps =
    trigger === "hover"
      ? {
        onMouseEnter: () => setOpen(true),
        onMouseLeave: () => setOpen(false),
      }
      : {};

  return (
    <div className={`relative inline-block ${className}`} {...wrapperProps}>
      {/* Button */}
      <button
        type="button"
        onClick={
          trigger === "click" ? () => setOpen((prev) => !prev) : undefined
        }
        className={`flex items-center justify-between gap-2 px-5 py-2 border border-gray-400 rounded-full text-gray-600 bg-white hover:bg-gray-100 transition w-full ${btnClassName}`}
      >
        <span className="truncate">{selected || label}</span>
        <ChevronDown
          className={`transition-transform duration-200 ${open ? "rotate-180" : "rotate-0"
            }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div
          className={`absolute top-full z-20 w-max min-w-full max-w-[min(calc(100vw-2rem),20rem)] ${
            menuAlign === "right" ? "right-0 left-auto" : "left-0 right-auto"
          }`}
        >
          <div className="h-2" />
          <ul
            className={`overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md ${innerClassName}`}
          >
            {items.map((item, index) => (
              <li
                key={index}
                className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${liClassName} ${
                  selected === item ? "bg-gray-200 font-medium" : ""
                }`}
                onClick={() => handleSelect(item)}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
