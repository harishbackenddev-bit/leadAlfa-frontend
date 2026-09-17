import { useEffect, useState } from "react";

const PREFS_KEY = "brand_notification_prefs";

const DEFAULTS = {
  email: { campaign: true, messages: true, invitations: false, payments: true },
  push: { campaign: false, messages: true, invitations: true, payments: true },
};

const SECTIONS = [
  {
    key: "email",
    title: "Email Notifications",
    rows: [
      ["campaign", "Campaign Updates", "Get notified about new campaigns and opportunities"],
      ["messages", "New Messages", "Receive emails when you get new messages"],
      ["invitations", "Invitations", "Get notified when brands invite you to campaigns"],
      ["payments", "Payment Updates", "Receive notifications about earnings and payments"],
    ],
  },
  {
    key: "push",
    title: "Push Notifications",
    rows: [
      ["campaign", "Campaign Updates", "Get push notifications about new campaigns"],
      ["messages", "New Messages", "Receive push notifications for new messages"],
      ["invitations", "Invitations", "Get notified when brands send you invitations"],
      ["payments", "Payment Updates", "Receive push notifications about payments"],
    ],
  },
];

const readPrefs = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(PREFS_KEY)) || {};
    return {
      email: { ...DEFAULTS.email, ...saved.email },
      push: { ...DEFAULTS.push, ...saved.push },
    };
  } catch {
    return DEFAULTS;
  }
};

export default function NotificationSettings() {
  const [prefs, setPrefs] = useState(readPrefs);

  useEffect(() => {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
  }, [prefs]);

  const toggle = (section, key) =>
    setPrefs((prev) => ({
      ...prev,
      [section]: { ...prev[section], [key]: !prev[section][key] },
    }));

  return (
    <>
      <h1 className="text-[24px] font-bold leading-[36px] tracking-[-0.8px] text-[#1f1f1f] sm:text-[32px] sm:leading-[48px] dark:text-[#f1f5f9]">
        Notifications
      </h1>
      <p className="pt-1 text-[14px] leading-[21px] text-[#64748b] dark:text-[#94a3b8]">
        Control what notifications you receive
      </p>

      {SECTIONS.map(({ key: sectionKey, title, rows }) => (
        <div
          key={sectionKey}
          className="mt-6 rounded-[14px] border border-[#e5e7eb] bg-white p-5 sm:p-6 dark:border-[#334155] dark:bg-[#1e293b]"
        >
          <h2 className="text-[20px] font-bold leading-[30px] tracking-[-0.4px] text-[#1f1f1f] sm:text-[24px] sm:leading-[36px] dark:text-[#f1f5f9]">
            {title}
          </h2>
          <div className="space-y-6 pt-5">
            {rows.map(([key, label, description]) => {
              const on = prefs[sectionKey][key];
              return (
                <div key={key} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[15px] font-medium leading-[24px] text-[#1f2937] dark:text-[#e2e8f0]">
                      {label}
                    </p>
                    <p className="pt-0.5 text-[14px] leading-[21px] text-[#64748b] dark:text-[#94a3b8]">
                      {description}
                    </p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={on}
                    aria-label={`${title}: ${label}`}
                    onClick={() => toggle(sectionKey, key)}
                    className={`relative h-6 w-11 shrink-0 cursor-pointer rounded-full transition-colors ${
                      on ? "bg-[#0353a4]" : "bg-[#e5e7eb] dark:bg-[#334155]"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all duration-300 ${
                        on ? "left-[22px]" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </>
  );
}
