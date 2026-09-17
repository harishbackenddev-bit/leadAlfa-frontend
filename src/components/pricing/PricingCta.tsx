import { ArrowRight, ArrowUpRight } from "lucide-react";

export default function PricingCTA() {
  return (
    <section className="pb-14 sm:pb-20 lg:pb-24 px-6 sm:px-8 lg:px-12">
      <div className="max-w-[1400px] mx-auto">
        <div
          className="rounded-[20px] py-14 px-3 sm:py-20 sm:px-10 text-center relative overflow-hidden max-w-[1240px] mx-auto"
          style={{
            // background: "linear-gradient(145deg, #031D44 0%, #0353A4 55%, #0C6BC9 100%)",
            background: "#0c7bb3",
          }}
        >
          <div
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: "#F5A6D6", filter: "blur(80px)", opacity: 0.25 }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
            style={{ background: "#F5A6D6", filter: "blur(64px)", opacity: 0.2 }}
          />

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-[24px] sm:text-[36px] lg:text-[42px] font-bold text-white mb-5 leading-[1.25] sm:leading-[1.2] tracking-[-0.02em]">
              Ready to transform your
              <br />e-commerce strategy?
            </h2>
            <p className="text-white/65 text-[15px] sm:text-[16px] mb-10 leading-[1.8]">
              Explore our transparent UGC pricing packages and start building
              high-performing campaigns today.
            </p>

            <button className="sec-btn w-full sm:w-fit mx-auto justify-between pl-4 sm:pl-6 pr-1 gap-2 min-h-12 flex cursor-pointer items-center rounded-full text-[clamp(10px,calc(5.1vw_-_6.5px),16px)] tracking-tight sm:text-[16px] sm:tracking-normal font-medium whitespace-nowrap transition-all duration-300 hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c7bb3] focus-visible:ring-offset-2">
              Explore Transparent UGC Pricing Packages

              <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-full bg-[#0c7bb3] items-center justify-center">
                <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
            </button>

            <p className="text-white/35 text-sm mt-8">No contracts · No hidden fees · Cancel anytime</p>
          </div>
        </div>
      </div>
    </section>
  )
}