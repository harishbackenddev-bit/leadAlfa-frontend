import ActionButton from "../common/ActionButton";
import ecommerceImage from "../../imports/IMG_6319.MP4";

export default function PricingHeroSection() {
    return (
        <section className="relative overflow-hidden bg-[#F7F8F9]">
            <div className="relative z-10 mx-auto max-w-[1400px] px-6 pt-6 pb-14 sm:px-8 sm:pb-20 lg:px-12 lg:pt-8 lg:pb-24 grid grid-cols-1 lg:grid-cols-2 gap-10 sm:gap-12 items-center">
                {/* Left */}
                <div>
                    <p className="inline-flex rounded-full bg-[#F0AFDA] px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#7C2D75] sm:text-[13px]">
                        South African Creator Marketplace
                    </p>

                    <h1 className="mt-7 text-[32px] sm:text-[42px] lg:text-[46px] font-bold leading-[1.18] sm:leading-[1.16] tracking-[-0.025em] text-[#101727] max-w-[900px]">
                        Transparent Pricing Built for Scalable UGC Campaigns in{" "}
                        <span className="text-[#0C7BB3]">South Africa</span>
                    </h1>

                    <p className="mt-6 text-[15px] sm:text-[16px] leading-[1.85] text-[#606977] max-w-[640px]">
                        Growing your brand in the South African market requires content that genuinely connects.
                        At Creatrend, we provide flexible, creator-driven video packages designed specifically
                        for forward-thinking brands, agencies, and e-commerce teams across SA.
                    </p>

                    <p className="mt-5 text-sm font-semibold italic text-[#606977]">
                        No hidden fees, no complex contracts - just authentic content that converts.
                    </p>

                    <div className="mt-9">
                        <ActionButton
                            label="Explore Flexible Packages"
                            onClick={() =>
                                document.getElementById("pricing")?.scrollIntoView({ behavior: "smooth" })
                            }
                        />
                    </div>

                    {/* Stats */}
                    <div className="mt-12 flex flex-wrap gap-x-8 gap-y-5">
                        {[
                            { n: "50+", label: "Campaigns" },
                            { n: "100%", label: "Payout" },
                            { n: "350+", label: "SA Creators" },
                        ].map(({ n, label }) => (
                            <div key={label}>
                                <div className="text-2xl font-black text-[#101727]">{n}</div>
                                <div className="text-[#606977] text-xs font-bold tracking-wide uppercase mt-0.5">
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="hidden lg:flex items-center justify-center">
                    <video
                        src={ecommerceImage}
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="relative z-10 w-full max-w-[620px] object-contain"
                        style={{
                            WebkitMaskImage:
                                "radial-gradient(circle, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)",
                            maskImage:
                                "radial-gradient(circle, rgba(0,0,0,1) 75%, rgba(0,0,0,0) 100%)",
                        }}
                    />
                </div>
            </div>
        </section >
    )
}