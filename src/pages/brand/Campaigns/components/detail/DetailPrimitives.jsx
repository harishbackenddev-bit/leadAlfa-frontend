import React from "react";

export function DetailSection({ icon: Icon, title, subtitle, children, className = "" }) {
  return (
    <section
      className={`overflow-hidden rounded-xl border border-gray-200 bg-white ${className}`}
    >
      <div className="flex items-start gap-3 border-b border-gray-100 bg-blue-50/60 px-5 py-4">
        {Icon ? (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[#1E60DB]">
            <Icon className="h-4 w-4" strokeWidth={2} />
          </div>
        ) : null}
        <div className="min-w-0">
          <h2 className="text-base font-semibold text-gray-900">{title}</h2>
          {subtitle ? (
            <p className="mt-0.5 text-sm text-gray-500">{subtitle}</p>
          ) : null}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function DetailField({ label, children, className = "", fullWidth = false }) {
  return (
    <div className={fullWidth ? `col-span-full ${className}` : className}>
      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
        {label}
      </p>
      <div className="mt-1.5 text-sm text-gray-800">{children}</div>
    </div>
  );
}

export function DetailGrid({ children, cols = 2 }) {
  const colClass =
    cols === 1
      ? "grid-cols-1"
      : cols === 3
        ? "grid-cols-1 md:grid-cols-3"
        : "grid-cols-1 md:grid-cols-2";
  return <div className={`grid gap-5 ${colClass}`}>{children}</div>;
}

export function PillBadge({
  children,
  tone = "blue",
  icon: Icon,
  className = "",
}) {
  const tones = {
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    green: "bg-green-50 text-green-700 border-green-100",
    orange: "bg-orange-50 text-orange-700 border-orange-100",
    purple: "bg-purple-50 text-purple-700 border-purple-100",
    gray: "bg-gray-50 text-gray-600 border-gray-200",
    red: "bg-red-50 text-red-600 border-red-100",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${tones[tone] || tones.blue} ${className}`}
    >
      {Icon ? <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={2} /> : null}
      {children}
    </span>
  );
}

export function InfoBox({ children, tone = "blue", className = "" }) {
  const tones = {
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    red: "border-red-200 bg-red-50 text-red-800",
    green: "border-green-200 bg-green-50 text-green-800",
    yellow: "border-amber-200 bg-amber-50 text-amber-900",
    gray: "border-gray-200 bg-gray-50 text-gray-700",
  };
  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm leading-relaxed ${tones[tone]} ${className}`}
    >
      {children}
    </div>
  );
}
