import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SectionHead from "./SectionHead";
import ActionButton from "../../common/ActionButton";

const GREAT_FIT = [
  "E-commerce brands testing new creative angles weekly",
  "DTC startups who can't afford R30K agency retainers",
  "Performance marketers who need UGC for paid social, not brand awareness",
  "Global brands entering SA who need local cultural authenticity",
  "SA SMEs ready to scale beyond organic posting",
];

export default function WhoItsFor() {
  const navigate = useNavigate();

  return (
    <div className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="Built For">
          Who Creatrend <span className="text-[#0c7bb3]">Is For</span>
        </SectionHead>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Great fit */}
          <div className="rounded-2xl border border-[#BBF7D0] bg-[#F0FDF4] p-7 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#16a34a] text-white">
                <Check className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#15803D]">Great fit</h3>
            </div>
            <ul className="mt-6 space-y-4">
              {GREAT_FIT.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-[#166534] sm:text-[15px]">
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#16a34a] text-white">
                    <Check className="h-3 w-3" aria-hidden="true" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Not for */}
          <div className="flex flex-col rounded-2xl border border-[#E7E9EC] bg-[#FAFAFA] p-7 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#9CA3AF] text-white">
                <X className="h-5 w-5" aria-hidden="true" />
              </span>
              <h3 className="text-xl font-semibold tracking-[-0.01em] text-[#64748B]">Not for</h3>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-[#64748A] sm:text-[15px]">
              Brands looking for SEO services, marketing strategies or celebrity endorsements.
            </p>

            <div className="mt-auto pt-6">
              <div className="rounded-xl border border-[#E7E9EC] bg-white p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
                  Already know Creatrend is right for you?
                </p>
                <ActionButton
                  label="Start for free"
                  onClick={() => navigate("/signup")}
                  className="mt-4"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
