import { Star } from "lucide-react";
import SectionHead from "./SectionHead";

const TESTIMONIALS = [
  {
    lead: "We used to wait 3 weeks for agency content that cost R20K. With Creatrend, we launched 8 UGC videos in 10 days for under R8,000. ",
    accent: "Our CPA dropped 34%.",
    initial: "M",
    role: "Marketing Director",
    company: "Johannesburg DTC Skincare Brand",
  },
  {
    lead: "The cultural matching is unreal. Our first creator was from Soweto, spoke perfect isiZulu, and ",
    accent: "our engagement rate on that ad was 4× our English-only content.",
    initial: "G",
    role: "Growth Lead",
    company: "Cape Town Fintech Startup",
  },
];

export default function BrandTestimonials() {
  return (
    <div className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="Testimonials">
          What SA Brands <span className="text-[#0c7bb3]">Say</span>
        </SectionHead>

        <div className="scrollbar-thin -mx-4 mt-12 flex snap-x snap-mandatory scroll-pl-4 gap-6 overflow-x-auto px-4 pb-4 sm:-mx-6 sm:scroll-pl-6 sm:px-6 md:mx-0 md:grid md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.company}
              className="w-[85%] shrink-0 snap-start rounded-2xl border border-[#EEF0F2] bg-[#FAFAFA] p-7 sm:p-8 md:w-auto md:shrink"
            >
              <div className="flex gap-1 text-[#FBBF24]">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-current" aria-hidden="true" />
                ))}
              </div>
              <blockquote className="mt-5 text-[15px] leading-[1.8] text-[#374151] sm:text-base">
                &ldquo;{t.lead}
                <span className="font-medium text-[#0c7bb3]">{t.accent}</span>&rdquo;
              </blockquote>
              <hr className="mt-6 border-[#EEF0F2]" />
              <figcaption className="mt-5 flex items-center gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#0c7bb3] text-lg font-bold text-white">
                  {t.initial}
                </span>
                <span>
                  <span className="block font-bold text-[#111827]">{t.role}</span>
                  <span className="mt-0.5 block text-sm text-[#64748A]">{t.company}</span>
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
