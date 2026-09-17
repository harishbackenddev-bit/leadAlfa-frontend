import React from "react";

const cardClassName =
  "rounded-2xl border border-[#e8edf3] bg-white p-5 shadow-sm sm:p-6";

const TagGroup = ({ title, items, variant = "blue" }) => {
  if (!items?.length) return null;

  const tagClass =
    variant === "orange"
      ? "bg-[#fff4e5] text-[#c26b00]"
      : "bg-[#E0F2FE] text-[#0284C7]";

  return (
    <div>
      <h3 className="mb-3 text-[15px] font-semibold text-[#1a1a1a]">
        {title}
      </h3>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={`${title}-${item}`}
            className={`rounded-full px-3 py-1.5  text-[12px] font-medium ${tagClass}`}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export default function CreatorDetails({
  primaryNiches = [],
  secondaryNiches = [],
  appearance = [],
  skills = [],
}) {
  const hasNiches = primaryNiches.length > 0 || secondaryNiches.length > 0;
  const hasAppearance = appearance.length > 0;
  const hasSkills = skills.length > 0;

  if (!hasNiches && !hasAppearance && !hasSkills) return null;

  return (
    <div className="space-y-4">
      {hasNiches ? (
        <section className={cardClassName}>
          <div className="space-y-5">
            <TagGroup title="Primary Niche" items={primaryNiches} variant="blue" />
            <TagGroup title="Secondary Niche" items={secondaryNiches} variant="blue" />
          </div>
        </section>
      ) : null}

      {hasAppearance ? (
        <section className={cardClassName}>
          <TagGroup title="Appearance" items={appearance} variant="orange" />
        </section>
      ) : null}

      {hasSkills ? (
        <section className={cardClassName}>
          <TagGroup title="Skills" items={skills} variant="blue" />
        </section>
      ) : null}
    </div>
  );
}
