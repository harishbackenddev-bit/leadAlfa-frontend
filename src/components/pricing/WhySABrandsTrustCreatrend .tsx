import {
    Layers,
    BarChart3,
    Smartphone,
    Wallet,
} from "lucide-react";
const TRUST_CARDS = [
    {
        Icon: BarChart3,
        title: "Upfront, Transparent Pricing",
        body: "Know exactly what your UGC campaigns will cost from day one. Our pricing model is built for scalability, allowing you to plan your digital marketing budget with absolute certainty.",
        iconBg: "bg-[#0353A4]/10",
        iconColor: "text-[#0353A4]",
    },
    {
        Icon: Layers,
        title: "Flexible Video Packages",
        body: "Whether you are an emerging local e-commerce store or a large national agency, our creator-driven packages adapt to your specific campaign needs. Add on the exact features you need, when you need them.",
        iconBg: "bg-[#F5A6D6]/30",
        iconColor: "text-pink-600",
    },
    {
        Icon: Smartphone,
        title: "Authentic, High-Performing Content",
        body: "We connect you with verified South African creators who understand your local audience. Get highly engaging, relatable videos designed to stop the scroll and drive conversions.",
        iconBg: "bg-[#F5A6D6]/30",
        iconColor: "text-pink-600",
    },
    {
        Icon: Wallet,
        title: "Automated Creator Payouts",
        body: "Forget the administrative headache of managing invoices and local creator payments. Our automated payout system ensures creators are paid on time, keeping relationships strong and your accounting team happy.",
        iconBg: "bg-[#0353A4]/10",
        iconColor: "text-[#0353A4]",
    },
];

export default function WhyTrustCreatrend() {
    return (
        <section className="py-14 sm:py-20 lg:py-24 px-6 sm:px-8 lg:px-12 bg-white">
            <div className="max-w-[1400px] mx-auto">
                <div className="sm:text-center mb-6">
                    <h2 className="text-[24px] sm:text-[36px] lg:text-[42px] leading-[1.25] sm:leading-[1.2] tracking-[-0.02em] text-[#101727] font-bold mb-5">
                        Why SA Brands Trust Creatrend
                    </h2>
                    
                    {/* Updated Max-Width and Line Breaks for Exact 2 Lines */}
                    <p className="text-[15px] max-w-4xl mx-auto leading-[1.8] text-[#606977]">
                        Scaling your video marketing shouldn&apos;t mean losing control of your budget. We&apos;ve built our platform
                        <br className="hidden md:block" />
                        to give you complete financial confidence while managing the heavy lifting of content creation.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-7 mt-10 sm:mt-14 max-w-[1240px] mx-auto">
                    {TRUST_CARDS.map(({ Icon, title, body, iconBg, iconColor }) => (
                        <div
                            key={title}
                            className="bg-white rounded-[20px] p-7 sm:p-8 border border-zinc-500/20 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div
                                className={`${iconBg} w-12 h-12 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-200`}
                            >
                                <Icon size={22} className={iconColor} />
                            </div>
                            <h3 className="text-[17px] sm:text-[19px] font-bold leading-snug mb-3 text-[#101727]">{title}</h3>
                            <p className="text-[14px] sm:text-[15px] leading-[1.85] text-[#606977]">{body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}