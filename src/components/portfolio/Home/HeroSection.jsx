import { useNavigate } from "react-router-dom";
import ActionButton from "../../common/ActionButton";

// The headline's 820px measure is deliberate: it breaks over three lines.
export default function HeroSection() {
  const navigate = useNavigate();

  return (
    <section className="px-6 pb-12 pt-14 text-center sm:px-8 lg:pt-16">
      <div className="mx-auto max-w-[1140px]">
        <h1 className="mx-auto max-w-[820px] text-[34px] font-bold leading-[1.12] tracking-[-0.02em] text-[#1A1A1A] sm:text-[44px] lg:text-[56px] lg:leading-[1.107]">
          Get High-Performing Video Ads From{" "}
          <span className="text-[#0C7BB3]">South Africa&rsquo;s Top UGC Creators</span>
        </h1>

        <p className="mx-auto mt-7 max-w-[890px] text-[15px] leading-[1.56] text-[#64748A] sm:text-[17px] lg:text-[18px]">
          Connect with verified content creators who understand your market. Get authentic,
          high-converting video ads that drive real results for your brand.
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <ActionButton label="Find Your Creator" onClick={() => navigate("/login")} />

          <ActionButton
            label="Join as a Creator"
            onClick={() => navigate("/login")}
            variant="secondary"
            showArrow={false}
          />
        </div>
      </div>
    </section>
  );
}
