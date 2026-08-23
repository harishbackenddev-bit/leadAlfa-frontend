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
  liClassName="",
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
        <div className="absolute left-0 top-full z-20 w-auto min-w-full max-w-[90vw]   
            max-h-60 overflow-auto  ">
          <div className="h-2"></div>
          <ul
            className={`
            bg-white border border-gray-200 rounded-lg shadow-md
            
             ${innerClassName}         
          `}
          >

            {items.map((item, index) => (
              <li
                key={index}
                className={`px-4 py-2 whitespace-nowrap cursor-pointer hover:bg-gray-100  ${liClassName} ${selected === item ? "bg-gray-200 font-medium" : ""
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
