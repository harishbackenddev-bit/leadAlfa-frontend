import boostDownloadsImg from "../../imports/img-1.png";
import strategyImg from "../../imports/img-2.png";
import ugcVideoImg from "../../imports/img-3.png";
import roasImg from "../../imports/img-4.png";

const ADVANTAGES = [
  {
    image: boostDownloadsImg,
    alt: "App store listing",
    title: "App Store Optimization (ASO)",
    body: "Drive high-intent traffic directly to your App Store and Google Play Store listings with scroll-stopping UGC content that converts browsers into installers.",
  },
  {
    image: strategyImg,
    alt: "Campaign data",
    title: "Data-Driven Content Strategy",
    body: "Leverage insights from 1,000+ successful campaigns. We know what hooks, scripts, and formats drive installs in the South African mobile market.",
  },
  {
    image: ugcVideoImg,
    alt: "Creator filming a video",
    title: "Professional UGC Video Production",
    body: "Get authentic creator videos that showcase your app's real value. From unboxing to tutorials, we create content that resonates with your target users.",
  },
  {
    image: roasImg,
    alt: "Return on ad spend",
    title: "Lower CPA, Higher ROAS",
    body: "Proven frameworks that lower your Cost Per Acquisition and maximize Return on Ad Spend through authentic, performance-driven creator content.",
  },
];

export function MarketplacesSection() {
  return (
    <section id="solutions" className="bg-[#F8F9FA] py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        <h2 className="text-[24px] font-bold leading-[1.25] tracking-[-0.02em] text-[#101727] sm:text-[36px] sm:leading-[1.2] lg:text-[42px]">
          The Data-Driven UGC Advantage
        </h2>

        <div className="mx-auto mt-10 grid max-w-[1240px] grid-cols-1 gap-7 md:grid-cols-2">
          {ADVANTAGES.map((item) => (
            <article
              key={item.title}
              className="flex gap-5 rounded-[20px] border border-[#E4E6EB] bg-white p-7 sm:p-8"
            >
              <img
                src={item.image}
                alt={item.alt}
                className="h-auto w-20 shrink-0 object-contain"
              />
              <div>
                <h3 className="text-[17px] font-bold leading-snug text-[#101727] sm:text-[19px]">
                  {item.title}
                </h3>
                <p className="mt-3 text-[14px] leading-[1.85] text-[#606977] sm:text-[15px]">
                  {item.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
