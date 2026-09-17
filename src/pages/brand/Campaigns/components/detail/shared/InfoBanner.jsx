import React from "react";
import { AlertCircle, Info } from "lucide-react";

export function InfoBanner({ message, tone = "blue" }) {
  if (!message) return null;
  const tones = {
    blue: "border-blue-200 bg-blue-50 text-blue-800",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
  };
  const Icon = tone === "amber" ? AlertCircle : Info;

  return (
    <div
      className={`flex items-start gap-3 rounded-lg border px-4 py-3 text-sm ${tones[tone]}`}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <p>{message}</p>
    </div>
  );
}
