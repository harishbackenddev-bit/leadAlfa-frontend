import card1Img from "../../imports/solution3-icon1.png";
import card2Img from "../../imports/solution3-icon2.png";
import card3Img from "../../imports/solution3-icon3.png";

const CARDS = [
  {
    image: card1Img,
    title: "Centralized Client Management",
    description:
      "Manage all your clients' UGC accounts from a single, intuitive dashboard. Switch between brands seamlessly, ensuring each client gets content tailored perfectly to their specific niche and brand guidelines.",
  },
  {
    image: card2Img,
    title: "Outsource to Verified Creators",
    description:
      "Stop scrolling through social media trying to find reliable talent. We grant you access to a curated network of top-tier, verified creators. Simply post your brief, and we'll connect you with creators who know how to sell on camera.",
  },
  {
    image: card3Img,
    title: "Performance Tracking",
    description:
      "From the initial pitch to the final video handover, our agency-focused workflows ensure you get high-quality content delivered on time, every time—ready to be plugged directly into your ad campaigns.",
  },
];

export function MarketplacesSection() {
  return (
    <section id="solutions" className="bg-[#F8F9FA] py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        <h2 className="text-center text-[24px] font-bold leading-[1.25] tracking-[-0.02em] text-[#101727] sm:text-[36px] sm:leading-[1.2] lg:text-[42px]">
          Streamlined Workflows Built for Scale
        </h2>

        <div className="mx-auto mt-10 grid max-w-[1240px] grid-cols-1 gap-7 sm:mt-14 md:grid-cols-3">
          {CARDS.map((card) => (
            <article
              key={card.title}
              className="flex flex-col rounded-[20px] border border-[#E4E6EB] bg-white p-7 text-center sm:p-8"
            >
              <img
                src={card.image}
                alt=""
                className="mx-auto h-[140px] w-[140px] object-contain lg:h-[170px] lg:w-[170px]"
              />

              <h3 className="mt-6 text-[17px] font-bold leading-snug text-[#101727] sm:text-[19px]">
                {card.title}
              </h3>

              <p className="mt-3 text-[14px] leading-[1.85] text-[#606977] sm:text-[15px]">
                {card.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
