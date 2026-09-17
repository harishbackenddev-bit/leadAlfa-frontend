import React from "react";

export default function CreatorAvatar({ initials, size = "md" }) {
  const sizeClass =
    size === "sm" ? "h-9 w-9 text-xs" : size === "lg" ? "h-12 w-12 text-base" : "h-11 w-11 text-sm";
  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#0353a4] to-[#4b96e3] font-semibold text-white`}
    >
      {initials}
    </div>
  );
}
