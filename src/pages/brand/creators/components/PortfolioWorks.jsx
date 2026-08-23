import React from "react";
import { Play } from "lucide-react";

export default function PortfolioWorks({ items = [], onPlayVideo }) {
  if (!items.length) return null;

  return (
    <section className="rounded-2xl border border-[#e8edf3] bg-white p-5 shadow-sm sm:p-6">
      <h2 className="mb-5 font-['Manrope:SemiBold',sans-serif] text-[18px] font-semibold text-[#1a1a1a]">
        Portfolio Works
      </h2>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-[#f1f5f9]"
          >
            {item.image ? (
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-[#94a3b8]">
                No preview
              </div>
            )}

            {item.type === "video" && item.url ? (
              <button
                type="button"
                onClick={() => onPlayVideo?.({ url: item.url, title: item.title })}
                className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-[#1E60DB] shadow-lg transition hover:scale-105"
                aria-label={`Play ${item.title}`}
              >
                <Play className="ml-0.5 h-5 w-5 fill-current" />
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
