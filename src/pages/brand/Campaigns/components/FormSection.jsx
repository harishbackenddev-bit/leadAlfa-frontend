import React from "react";

export default function FormSection({ title, className = "", children }) {
  return (
    <section className={`space-y-4 ${className}`.trim()}>
      {title ? <h2 className="text-base font-semibold text-gray-900">{title}</h2> : null}
      {children}
    </section>
  );
}
