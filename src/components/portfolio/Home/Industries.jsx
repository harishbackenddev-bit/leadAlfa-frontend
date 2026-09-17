import { useSearchParams } from "react-router-dom";

import SelectDropdown from "../../common/SelectDropdown.jsx";
import INDUSTRIES from "../../../utils/industries";

export default function Industries() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedIndustry = searchParams.get("industry");

  const handleSelect = (slug) => {
    if (slug === selectedIndustry) {
      setSearchParams({}, { replace: true, preventScrollReset: true });
      return;
    }
    setSearchParams({ industry: slug }, { replace: true, preventScrollReset: true });
  };

  const selected = INDUSTRIES.find((industry) => industry.slug === selectedIndustry);

  const renderOption = (industry) => (
    <span
      key={industry.slug}
      data-slug={industry.slug}
      className="flex w-full items-center gap-2"
    >
      <img
        src={industry.img}
        alt={industry.title}
        className="h-[22px] w-[22px] shrink-0 object-contain"
      />
      {industry.title}
    </span>
  );

  return (
    <>
      {/* Mobile: a single select keeps all options usable on a narrow screen */}
      <SelectDropdown
        className="w-full rounded-full bg-white md:hidden"
        label="Select Industry"
        items={INDUSTRIES.map(renderOption)}
        value={selected ? renderOption(selected) : null}
        onChange={(node) => {
          const slug = node?.props?.["data-slug"];
          if (slug) {
            handleSelect(slug);
          }
        }}
      />

      {/* Tablet and up: wrapping pill row */}
      <div className="mx-auto hidden max-w-[1180px] flex-wrap items-center justify-center gap-3 md:flex">
        {INDUSTRIES.map(({ img, title, slug }) => {
          const isSelected = selectedIndustry === slug;
          return (
            <button
              key={slug}
              type="button"
              onClick={() => handleSelect(slug)}
              aria-pressed={isSelected}
              className={`group flex cursor-pointer items-center gap-2.5 rounded-full border px-5 py-3 text-[15px] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0C7BB3] focus-visible:ring-offset-2 lg:text-[16px] ${
                isSelected
                  ? "border-[#0C7BB3] bg-[#0C7BB3] text-white"
                  : "border-[#E8EAEE] bg-white text-[#1A1A1A] hover:border-[#0C7BB3] hover:bg-[#0C7BB3] hover:text-white"
              }`}
            >
              <img
                src={img}
                alt={title}
                className="h-[22px] w-[22px] shrink-0 object-contain"
              />
              {title}
            </button>
          );
        })}
      </div>
    </>
  );
}
