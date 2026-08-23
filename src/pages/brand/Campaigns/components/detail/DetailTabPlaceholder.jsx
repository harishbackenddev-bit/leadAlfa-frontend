import React from "react";

export default function DetailTabPlaceholder({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
      <p className="text-lg font-semibold text-gray-900">{title}</p>
      <p className="mt-2 max-w-md text-sm text-gray-500">{description}</p>
    </div>
  );
}
