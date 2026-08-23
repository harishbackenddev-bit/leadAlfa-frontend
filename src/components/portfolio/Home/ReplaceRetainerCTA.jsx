import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReplaceRetainerCTA() {
  const navigate = useNavigate();

  return (
    <div className="bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#1183BE] to-[#075A87] px-6 py-14 text-center text-white sm:px-10 lg:py-16">
        {/* soft decorative circles, as in the design */}
        <span className="pointer-events-none absolute -left-10 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-xl" aria-hidden="true" />
        <span className="pointer-events-none absolute -right-8 -top-6 h-48 w-48 rounded-full bg-white/10 blur-xl" aria-hidden="true" />

        <div className="relative">
          <h2 className="text-[26px] font-bold leading-[1.2] tracking-[-0.02em] sm:text-[34px] lg:text-[42px]">
            Ready to Replace Your Agency Retainer?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-white/90 sm:text-base">
            Launch your first UGC campaign on Creatrend today.
          </p>
          <p className="mt-2 text-sm text-white/75">No demo. No sales call. No minimum spend.</p>

          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="mt-8 inline-flex h-12 items-center gap-2 whitespace-nowrap rounded-full bg-white px-7 text-sm font-semibold text-[#0c7bb3] transition-colors hover:bg-white/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0c7bb3] sm:text-base"
          >
            {/* The full label needs ~350px; a 375px screen leaves 295px inside the card. */}
            <span className="sm:hidden">Get Started — Free</span>
            <span className="hidden sm:inline">Get Started — Free to Browse Creators</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </button>

          <p className="mt-6 text-xs text-white/70">
            Campaigns start from R1,250. Funds held securely in TradeSafe escrow until you approve the content.
          </p>
        </div>
      </div>
    </div>
  );
}
