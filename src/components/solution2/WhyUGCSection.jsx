import downloadsImg from "../../imports/why-2.png";
import cpaImg from "../../imports/why-3.png";
import CreatorLocationCard from "../common/CreatorLocationCard";
import appReel from "../../assets/videos/IMG_7858.MP4";

const CARDS = [
  {
    image: downloadsImg,
    alt: "App store downloads",
    background: "bg-[#EDF6FA]",
    title: "Maximise Downloads on the App Store and Google Play Store",
    body: "Algorithm changes and rising ad costs make app store visibility tough. Compelling UGC videos act as scroll-stopping assets on platforms like TikTok, Instagram Reels, and Facebook.",
  },
  {
    image: cpaImg,
    alt: "Cost per acquisition",
    background: "bg-[#F7EFF6]",
    title: "Slash your CPA with Data-backed Content",
    body: "Our approach to UGC is fueled by real ad data extracted from over 1,000 successful campaigns. We know exactly what hooks, scripts, and video formats convert best.",
  },
];

export function WhyUGCSection() {
  return (
    <section className="overflow-x-clip bg-white py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10">
          <div>
            <h2 className="text-[24px] font-bold leading-[1.25] tracking-[-0.02em] text-[#101727] sm:text-[36px] sm:leading-[1.2] lg:text-[42px]">
              Why UGC is the Ultimate Growth Hack for South African Apps
            </h2>

            <p className="mt-6 max-w-[680px] text-[15px] leading-[1.8] text-[#606977]">
              Traditional, highly polished ads often feel out of touch, leading
              to ad fatigue and low conversion rates. South African users
              resonate with authentic, localized content created by people just
              like them. UGC bridges the gap between your brand and your target
              audience, acting as high-converting word-of-mouth marketing at
              scale.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <CreatorLocationCard video={appReel} title="App Downloads" location="Johannesburg" />
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-[1240px]">
          <h3 className="text-[18px] font-bold text-[#101727] lg:text-[20px]">
            Here is how our platform helps you scale your app:
          </h3>

          <div className="mt-8 grid grid-cols-1 gap-7 lg:grid-cols-2">
            {CARDS.map((card) => (
              <article
                key={card.title}
                className={`flex flex-col gap-6 rounded-[20px] p-7 sm:flex-row sm:items-start sm:p-8 ${card.background}`}
              >
                <img
                  src={card.image}
                  alt={card.alt}
                  className="w-[120px] shrink-0 object-contain lg:w-[140px]"
                />
                <div>
                  <h4 className="text-[17px] font-bold leading-snug text-[#101727] sm:text-[19px]">
                    {card.title}
                  </h4>
                  <p className="mt-3 text-[14px] leading-[1.85] text-[#606977] sm:text-[15px]">
                    {card.body}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
