import {
  Shield,
  UserX,
  RefreshCw,
  BadgeCheck,
  ChevronRight,
} from "lucide-react";

export default function ZeroGhostingPolicy() {
  return (
    <section className="px-6 sm:px-8 lg:px-12 pb-14 sm:pb-20 lg:pb-24">
      <div className="max-w-[1400px] mx-auto">
        <div
          className="rounded-[20px] p-7 sm:p-10 lg:p-14 relative overflow-hidden max-w-[1240px] mx-auto"
          style={{
            background:
              "linear-gradient(135deg, #EAF6FB 0%, #FFF5FB 50%, #EAF6FB 100%)",
            border: "1px solid rgba(3,83,164,0.1)",
          }}
        >
          {/* Decorative blob */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(245,166,214,0.3) 0%, transparent 70%)",
            }}
          />

          {/* Fixed Grid Ratio to give text content more horizontal space */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">

            {/* TEXT CONTENT INNER BLOCK (Changed from col-span-2 to col-span-3 for more room) */}
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 text-xs font-black px-4 py-1.5 rounded-full mb-6 tracking-wide uppercase" style={{ background: "rgba(3,83,164,0.08)", color: "#0353A4", border: "1px solid rgba(3,83,164,0.15)" }}>
                <Shield size={11} /> Creator Protection
              </div>
              <h2 className="text-[24px] sm:text-[36px] lg:text-[42px] leading-[1.25] sm:leading-[1.2] tracking-[-0.02em] font-bold mb-5 text-[#101727]">Zero-Ghosting Policy</h2>
              <p className="text-[15px] leading-[1.8] mb-8 text-[#606977] max-w-xl">
                We protect your budget and your marketing schedule with our strict Zero-Ghosting Policy. If a creator goes silent, we will instantly match you with a vetted replacement or issue a full, no-questions-asked refund.
              </p>
              
              {/* Force tags to stay in a single line on desktop */}
              <div className="flex flex-wrap gap-3">
                {["Instant Matching", "Vetted Creators", "Protected Refunds"].map((tag) => (
                  <span 
                    key={tag} 
                    className="text-xs font-black px-4 py-1.5 rounded-full"
                    style={{ background: "rgba(245,166,214,0.25)", color: "#cb45a8", border: "1px solid rgba(245,166,214,0.5)" }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* FLOW DIAGRAM BLOCK (Changed from col-span-3 to col-span-2) */}
            <div className="lg:col-span-2 grid grid-cols-2 justify-items-center gap-y-6 sm:flex sm:items-start sm:justify-center lg:justify-end gap-1 sm:gap-2 sm:flex-nowrap pb-4 lg:pb-0 w-full">
              {[
                { Icon: UserX, label: "Creator Ghost", sub: "Detected", color: "text-rose-500", bg: "bg-rose-50" },
                { Icon: Shield, label: "Policy", sub: "Activated", color: "text-[#0353A4]", bg: "bg-[#EAF6FB]" },
                { Icon: RefreshCw, label: "Replacement", sub: "Matched", color: "text-pink-600", bg: "bg-pink-50" },
                { Icon: BadgeCheck, label: "Refund", sub: "Guaranteed", color: "text-emerald-600", bg: "bg-emerald-50" },
              ].map(({ Icon, label, sub, color, bg }, i) => (
                <div key={label} className="flex items-center shrink-0">
                  <div className="flex flex-col items-center text-center w-[84px] sm:w-24 shrink-0">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 ${bg} rounded-2xl shadow-sm flex items-center justify-center mb-3 hover:scale-105 transition-transform duration-200 border border-zinc-400/20 shrink-0`}>
                      <Icon className={`${color} w-5 h-5 sm:w-6 sm:h-6`} />
                    </div>
                    <div className="text-[11px] sm:text-xs font-black text-[#101727] leading-tight min-h-[32px] flex items-center justify-center px-0.5">
                      {label}
                    </div>
                    <div className="text-[9px] sm:text-[10px] text-[#606977] font-bold mt-0.5 tracking-wide">
                      {sub}
                    </div>
                  </div>

                  {i < 3 && (
                    <div className="hidden sm:flex h-14 sm:h-16 items-center justify-center px-0.5 sm:px-1 self-start">
                      <ChevronRight size={14} className="text-zinc-400 shrink-0" />
                    </div>
                  )}
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}