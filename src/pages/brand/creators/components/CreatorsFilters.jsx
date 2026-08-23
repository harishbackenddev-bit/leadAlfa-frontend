import React, { useMemo } from "react";
import { X } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import { creatorCitiesByProvince, creatorProvinces } from "../../../../utils/location";

const RATING_OPTIONS = [
  { label: "Any rating", value: "" },
  { label: "3.0+", value: "3" },
  { label: "4.0+", value: "4" },
  { label: "4.5+", value: "4.5" },
  { label: "5.0", value: "5" },
];

const inputClassName =
  "h-11 w-full rounded-lg border border-[#e5e7eb] bg-white px-3 font-['Manrope:Regular',sans-serif] text-[14px] text-[#1e293b] outline-none transition focus:border-[#1E60DB] focus:ring-2 focus:ring-[#1E60DB]/20 disabled:cursor-not-allowed disabled:border-[#e2e8f0] disabled:bg-[#f8fafc] disabled:text-[#94a3b8]";

const labelClassName =
  "mb-2 block font-['Manrope:Medium',sans-serif] text-[13px] font-medium text-[#64748b]";

export const emptyCreatorFilters = {
  province: "",
  city: "",
  industry: "",
  minRating: "",
};

export default function CreatorsFilters({
  values,
  onChange,
  onApply,
  onClear,
  onClose,
  industryOptions = [],
}) {
  const cityOptions = useMemo(() => {
    if (!values.province) return [];
    return creatorCitiesByProvince[values.province] || [];
  }, [values.province]);

  const handleFieldChange = (field, value) => {
    if (field === "province") {
      onChange({ ...values, province: value, city: "" });
      return;
    }
    onChange({ ...values, [field]: value });
  };

  return (
    <section className="mb-6 rounded-2xl border border-[#e8edf3] bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-['Manrope:SemiBold',sans-serif] text-[16px] font-semibold text-[#1a1a1a]">
          Filter Creators
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#64748b] transition hover:bg-[#f1f5f9]"
          aria-label="Close filters"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <label className={labelClassName} htmlFor="filter-province">
            Province
          </label>
          <select
            id="filter-province"
            value={values.province}
            onChange={(event) => handleFieldChange("province", event.target.value)}
            className={inputClassName}
          >
            <option value="">Select province</option>
            {creatorProvinces.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClassName} htmlFor="filter-city">
            City
          </label>
          <select
            id="filter-city"
            value={values.province ? values.city : ""}
            onChange={(event) => handleFieldChange("city", event.target.value)}
            className={inputClassName}
            disabled={!values.province}
            aria-disabled={!values.province}
          >
            <option value="">
              {values.province ? "All cities" : "Select province first"}
            </option>
            {cityOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClassName} htmlFor="filter-industry">
            Industry
          </label>
          <select
            id="filter-industry"
            value={values.industry}
            onChange={(event) => handleFieldChange("industry", event.target.value)}
            className={inputClassName}
          >
            <option value="">All industries</option>
            {industryOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClassName} htmlFor="filter-rating">
            Minimum Rating
          </label>
          <select
            id="filter-rating"
            value={values.minRating}
            onChange={(event) => handleFieldChange("minRating", event.target.value)}
            className={inputClassName}
          >
            {RATING_OPTIONS.map((option) => (
              <option key={option.value || "any"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={onClear}
          className="h-11 rounded-lg border-[#e5e7eb] px-6 font-['Manrope:Medium',sans-serif] text-[14px] text-[#475569] hover:bg-[#f8fafc]"
        >
          Clear All
        </Button>
        <Button
          type="button"
          onClick={onApply}
          className="h-11 rounded-lg bg-gradient-to-b from-[#0353a4] to-[#4b96e3] px-8 font-['Manrope:SemiBold',sans-serif] text-[14px] font-semibold"
        >
          Apply Filters
        </Button>
      </div>
    </section>
  );
}
