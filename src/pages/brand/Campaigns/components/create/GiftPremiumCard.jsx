import React from "react";
import { BarChart3, TrendingUp, Sparkles } from "lucide-react";

const PLANS = [
  {
    title: "Premium (Growth)",
    price: "R 999.00/month",
    icon: TrendingUp,
    items: ["5 Active Gift Campaigns", "Basic Analytics", "Manual Messaging"],
    button: "Select Growth",
    highlighted: false,
  },
  {
    title: "Premium (Scale)",
    price: "R 2 499.00/month",
    icon: BarChart3,
    items: [
      "Unlimited Gift Campaigns",
      "Deep Audience Data",
      "Bulk Invites & Auto-Nudges",
      "Downloadable Content Library",
    ],
    button: "Select Scale",
    highlighted: true,
    badge: "RECOMMENDED",
  },
];

export default function GiftPremiumCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-slate-100 p-6 shadow-sm">
      <div className="flex flex-col items-center text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#0F57A7]">
          <Sparkles className="h-6 w-6" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900">
          Gift Campaigns are a Premium Feature
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Upgrade to unlock gift-based campaigns and manage product gifting
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          return (
            <div
              key={plan.title}
              className={`relative rounded-2xl border bg-white p-5 shadow-sm transition-shadow ${
                plan.highlighted ? "border-[#0F57A7] shadow-md" : "border-slate-200"
              }`}
            >
              {plan.badge ? (
                <span className="absolute right-4 top-0 -translate-y-1/2 rounded-full btn-gradient px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                  {plan.badge}
                </span>
              ) : null}
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl btn-gradient text-white">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-base font-semibold text-slate-900">{plan.title}</p>
                  <p className="text-sm font-semibold text-[#0F57A7]">{plan.price}</p>
                </div>
              </div>

              <ul className="mt-4 space-y-2 text-sm text-slate-600">
                {plan.items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
                      ✓
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                className="mt-5 w-full rounded-xl btn-gradient px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors"
              >
                {plan.button}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
