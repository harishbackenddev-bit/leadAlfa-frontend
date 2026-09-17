import { useEffect, useState } from "react";
import { getTheme, setTheme } from "../../../utils/theme";
import SettingsPageHeading from "../../settings/components/SettingsPageHeading";

const CARD =
  "rounded-[14px] border border-[#e5e7eb] bg-white p-5 sm:p-6 dark:border-[#334155] dark:bg-[#1e293b]";
const HEADING =
  "text-[20px] font-bold leading-[30px] tracking-[-0.4px] text-[#1f1f1f] sm:text-[24px] sm:leading-[36px] dark:text-[#f1f5f9]";

const THEMES = [
  { value: "light", label: "Light", swatch: "border border-[#e5e7eb] bg-white" },
  { value: "dark", label: "Dark", swatch: "bg-[#111827]" },
  {
    value: "auto",
    label: "Auto",
    swatch: "border border-[#e5e7eb] bg-gradient-to-r from-white to-[#111827]",
  },
];

export default function AppearanceSettings() {
  const [theme, setThemeState] = useState(getTheme);
  const [compact, setCompact] = useState(
    () => localStorage.getItem("compact_mode") === "1"
  );

  useEffect(() => {
    localStorage.setItem("compact_mode", compact ? "1" : "0");
  }, [compact]);

  const pickTheme = (value) => {
    setTheme(value);
    setThemeState(value);
  };

  return (
    <>
      <SettingsPageHeading
        title="Appearance"
        subtitle="Customize how the dashboard looks and feels"
      />

      <div className={CARD}>
        <h2 className={HEADING}>Theme</h2>
        <div className="grid gap-4 pt-5 sm:grid-cols-3">
          {THEMES.map(({ value, label, swatch }) => (
            <button
              key={value}
              type="button"
              onClick={() => pickTheme(value)}
              aria-pressed={theme === value}
              className={`flex cursor-pointer flex-col items-center gap-3 rounded-[14px] border px-4 py-8 transition-colors ${
                theme === value
                  ? "border-[#0353a4] bg-[#eff6ff] dark:bg-[#0353a4]/20"
                  : "border-[#e5e7eb] hover:border-[#0353a4]/40 dark:border-[#334155]"
              }`}
            >
              <span className={`h-10 w-10 rounded-full ${swatch}`} />
              <span className="text-[15px] font-medium text-[#1f2937] dark:text-[#e2e8f0]">
                {label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className={`mt-6 ${CARD}`}>
        <h2 className={HEADING}>Display Settings</h2>
        <div className="flex items-center justify-between gap-4 pt-5">
          <div>
            <p className="text-[15px] font-medium leading-[24px] text-[#1f2937] dark:text-[#e2e8f0]">
              Compact Mode
            </p>
            <p className="pt-0.5 text-[14px] leading-[21px] text-[#64748b] dark:text-[#94a3b8]">
              Reduce spacing between elements for a denser layout
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={compact}
            onClick={() => setCompact((v) => !v)}
            className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
              compact ? "bg-[#0353a4]" : "bg-[#e5e7eb] dark:bg-[#334155]"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
                compact ? "left-[22px]" : "left-0.5"
              }`}
            />
          </button>
        </div>
      </div>
    </>
  );
}
