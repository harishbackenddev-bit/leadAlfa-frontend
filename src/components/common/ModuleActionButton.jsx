import React from "react";

const baseClass =
  "inline-flex items-center justify-center rounded-lg border-1 px-6 py-3 text-base font-medium transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-60";

const variantClassMap = {
  filled: "border-[#0E5AAE] bg-[#0E5AAE] text-white hover:bg-[#0A4B93]",
  outline: "border-[#0E5AAE] bg-white text-[#0E5AAE] hover:bg-[#EFF6FF]",
};

export default function ModuleActionButton({
  label,
  type = "button",
  variant = "filled",
  onAction,
  actionKey,
  payload,
  className = "",
  ...rest
}) {
  const handleClick = (event) => {
    onAction?.({ actionKey, payload, event });
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      className={`${baseClass} ${variantClassMap[variant] || variantClassMap.filled} ${className}`}
      {...rest}
    >
      {label}
    </button>
  );
}
