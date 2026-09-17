import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PACKAGES = [
  {
    id: "starter",
    name: "Starter Reel",
    duration: "15 SEC",
    price: 1250,
    bestFor: ["Fast hooks", "Product highlights"],
    features: [
      "1 UGC Video",
      "Vertical Format",
      "Basic Editing",
    ],
  },
  {
    id: "standard",
    name: "Standard UGC Ad",
    duration: "30 SEC",
    price: 1950,
    bestFor: ["Testimonials", "CTA-driven ads"],
    features: [
      "Optimized Hooks",
      "CTA Integration",
      "Advanced Editing",
      "Paid Ad Ready",
    ],
  },
  {
    id: "deepdive",
    name: "Deep Dive Review",
    duration: "60 SEC",
    price: 2850,
    bestFor: ["Tutorials", "Full-funnel content"],
    features: [
      "Multiple Variations",
      "Premium Creator Matching",
      "Raw Footage Option",
      "Full Funnel Content",
    ],
  },
  {
    // Retainer plan — flat monthly fee, so it carries a price suffix/note and
    // routes to sales instead of the configurator.
    id: "enterprise",
    name: "Enterprise",
    duration: "RETAINER",
    price: 15000,
    priceSuffix: "/mo",
    priceNote: "+ Base Video Costs + 5% Service Fee",
    bestFor: ["Multi-brand agencies", "Large corporations"],
    features: [
      "End-to-End Campaign Execution",
      "Creative Strategy & Competitor Research",
      "Priority Rights & Licensing Management",
      "Corporate NDA Support",
      "Dedicated Creator Sourcing & Vetting",
      "Custom Brief Development",
      "Dedicated Account Manager",
      "Campaign Performance Reviews",
    ],
    cta: { label: "Contact Sales", href: "/book-a-call" },
  },
];

export default function PricingPackages({ onConfigure }) {
  const navigate = useNavigate();

  return (
    <section
      id="pricing"
      className="py-14 sm:py-20 lg:py-24 px-6 sm:px-8 lg:px-12"
      style={{
        background: "#F8FAFC",
      }}
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Header */}
        <div className="sm:text-center mb-10 sm:mb-14">
          <h2 className="text-[24px] sm:text-[36px] lg:text-[42px] font-bold mb-3 text-[#101727] leading-[1.25] sm:leading-[1.2] tracking-[-0.02em]">
            Flexible UGC Pricing Packages
          </h2>

          <p className="text-[15px] leading-[1.8] text-[#606977] max-w-xl mx-auto mb-4">
            Transparent pricing built for startups, agencies, and enterprise brands.
          </p>

          <a
            href="#configurator"
            className="inline-flex items-center gap-1.5 text-[#0C7BB3] font-bold text-sm hover:underline transition-all"
          >
            Build your custom quote below
            <ArrowRight size={14} />
          </a>
        </div>

        {/* Cards Grid — four equal columns on desktop, 2-up on tablet, stacked on mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 items-stretch">
          {PACKAGES.map((pkg) => {
            const isStandard = pkg.id === "standard";

            return (
              <div
                key={pkg.id}
                className={`h-full flex flex-col border rounded-[20px] p-7 sm:p-8 shadow-sm hover:shadow-lg transition-all duration-300 ${
                  isStandard
                    ? "bg-[#0C7BB3] border-[#0C7BB3] text-white"
                    : "bg-white border-[#E2E8F0] text-[#101727]"
                }`}
              >
                {/* Top Content Wrapper (flex-1 pushes the button down) */}
                <div className="flex-1">
                  {/* Duration Badge */}
                  <span
                    className={`inline-flex items-center justify-center w-fit px-3 py-1 rounded-full text-[10px] font-extrabold tracking-wider uppercase ${
                      isStandard ? "bg-white/20 text-white" : "bg-[#EAF3FB] text-[#0C7BB3]"
                    }`}
                  >
                    {pkg.duration}
                  </span>

                  {/* Title */}
                  <h3 className={`mt-4 text-[17px] sm:text-[19px] font-bold leading-snug ${isStandard ? "text-white" : "text-[#101727]"}`}>
                    {pkg.name}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 min-h-[28px]">
                    {pkg.bestFor.map((item) => (
                      <span
                        key={item}
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          isStandard ? "bg-white/10 text-white" : "bg-[#F1F5F9] text-[#606977]"
                        }`}
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="my-6">
                    <span className={`text-4xl font-black tracking-tight ${isStandard ? "text-white" : "text-[#101727]"}`}>
                      R{pkg.price.toLocaleString()}
                    </span>
                    {pkg.priceSuffix && (
                      <span className={`ml-1.5 text-[16px] font-semibold ${isStandard ? "text-white/70" : "text-[#606977]"}`}>
                        {pkg.priceSuffix}
                      </span>
                    )}
                    {pkg.priceNote && (
                      <p className={`mt-1.5 text-[12px] ${isStandard ? "text-white/60" : "text-[#606977]"}`}>
                        {pkg.priceNote}
                      </p>
                    )}
                  </div>

                  {/* Features List */}
                  <div className={`border-t pt-5 mb-6 space-y-3 ${isStandard ? "border-white/10" : "border-[#F1F5F9]"}`}>
                    {pkg.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-3"
                      >
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center shrink-0 ${
                            isStandard ? "bg-white/20" : "bg-[#EAF3FB]"
                          }`}
                        >
                          <Check
                            size={10}
                            strokeWidth={3}
                            className={isStandard ? "text-white" : "text-[#0C7BB3]"}
                          />
                        </div>

                        <span className={`text-[14px] font-medium ${isStandard ? "text-white/90" : "text-[#606977]"}`}>
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Button (Always pinned to the absolute bottom perfectly aligned) */}
                <button
                  type="button"
                  onClick={() => {
                    if (pkg.cta) {
                      navigate(pkg.cta.href);
                      return;
                    }
                    onConfigure(pkg.id);
                    document.getElementById("configurator")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className={`mt-auto w-fit mx-auto justify-between pl-6 pr-1 min-h-12 flex cursor-pointer items-center gap-2 rounded-full text-[14px] font-medium transition-all duration-300 hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c7bb3] focus-visible:ring-offset-2 sm:text-[16px] ${
                    isStandard ? "sec-btn" : "main-btn"
                  }`}
                >
                  {pkg.cta ? pkg.cta.label : "Configure this package"}
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                      isStandard ? "bg-[#0c7bb3]" : "bg-[#1F8FC8]"
                    }`}
                  >
                    <ArrowUpRight className="h-5 w-5 text-white" />
                  </span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
