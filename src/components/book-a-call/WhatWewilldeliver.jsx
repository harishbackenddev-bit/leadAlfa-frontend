const sections = [
    {
        title: 'Current Content Bottlenecks',
        content: 'We will begin by diagnosing your existing content creation process. Our team will look at your current mix of studio-produced versus authentic content looks like, and identify where you are experiencing friction (e.g., high costs, slow turnaround times, or lack of volume).'
    },
    {
        title: 'Leveraging the "Trust Economy"',
        content: 'Shift the conversation to the impact of authenticity. Discuss how modern consumers respond to user-generated assets over highly polished ads and explore how you are currently building social proof and trust with your target audience.'
    },
    {
        title: 'E-commerce & Social Commerce Integration',
        content: 'Understand your tech stack and distribution channels. Our team will ask where this content will live—whether it\'s for paid social ads, organic feeds, or direct integration into shoppable feeds on your storefront.'
    },
    {
        title: 'Creator Alignment & Brand Voice',
        content: 'Discuss the importance of matching your brand with the right aesthetic and demographic. Ask about your ideal customer profile so our team can explain how Creatrend matches your brand with creators who genuinely reflect your audience.'
    },
    {
        title: 'Campaign Goals & KPIs',
        content: 'We will clearly define what success looks like for your brand. Our team will pinpoint whether the primary objective is increasing conversion rates, lowering Customer Acquisition Cost (CAC), boosting engagement, or simply scaling your content library.'
    },
    {
        title: 'Budget & Subscription Fit',
        content: 'Once the value is established, we will align your needs with the appropriate fee structures and subscription tiers. The goal here is to determine your monthly content needs and recommend the tier that provides the best ROI for your brand.'
    }
];

export default function WhatwewillDeliver() {
    return (
        <section className="mx-auto max-w-[1400px] px-6 py-12 lg:px-12 lg:py-20">
            <h2 className="mb-12 text-center text-[24px] font-bold leading-[1.25] tracking-[-0.02em] text-[#101727] sm:text-[36px] sm:leading-[1.2] lg:text-[42px]">
                What we&apos;ll cover during our chat
            </h2>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {sections.map((section, index) => (
                    <div
                        key={index}
                        className="rounded-2xl border-2 border-gray-100 bg-white p-7 transition-all hover:shadow-md"
                    >
                        <h3 className="mb-4 text-[17px] font-bold text-[#101727] sm:text-[18px]">
                            {section.title}
                        </h3>

                        <p className="border-t border-gray-100 pt-4 text-[14px] leading-[1.8] text-[#606977] sm:text-[15px]">
                            {section.content}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    )
}