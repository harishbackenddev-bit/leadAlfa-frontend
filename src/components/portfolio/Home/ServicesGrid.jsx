import tiktok from "../../../assets/SVGs/portfolio/section-5/tik-tok.svg"
import instagram from "../../../assets/SVGs/portfolio/section-5/instagram.svg"
import video_icon from "../../../assets/SVGs/portfolio/section-5/video.svg"
import play_icon from "../../../assets/SVGs/portfolio/section-5/logo-play.svg"
import chat_icon from "../../../assets/SVGs/portfolio/section-5/chat.svg"

const iconMap = {
  tiktok: <img src={tiktok} alt="tik-tok" className="w-[30px] h-[30px]" />,
  instagram: <img src={instagram} alt="instagram" className="w-[30px] h-[30px]" />,
  link: <img src={video_icon} alt="video_icon" className="w-[30px] h-[30px]" />,
  editing: <img src={play_icon} alt="play_icon" className="w-[30px] h-[30px]" />,
  chat: <img src={chat_icon} alt="chat_icon" className="w-[30px] h-[30px]" />,
  blank: <span />,
};

const services_part1 = [
  {
    title: "Unboxing Videos",
    description:
      `Our creators will creatively document the unboxing of your product on video, highlighting 
their genuine initial impressions and reactions. This engaging process will provide a 
captivating insight into the unboxing experience. Your brand can leverage this opportunity to 
share on social media, enhancing product discovery and reviews. Build trust and influence 
strong purchasing decisions among potential customers.`,
    icons: ["tiktok", "instagram", "link"],
  },
  {
    title: "How-to guides",
    description:
      `How-to guides can serve as valuable resources for both existing customers and potential 
clients by providing clear, step-by-step instructions on how to effectively utilise your 
products or services. By incorporating User-Generated Content (UGC) such as customer 
testimonials, raw footage of product usage, or shared tips and tricks, these guides can 
become more relatable and engaging. This approach not only enhances the instructional 
material but also builds a sense of community among users, as they can see real-life 
applications and personal experiences related to your offerings.`,
    icons: ["editing"],
  }
];

const services_part2 = [
  {
    title: "Testimonials",
    description:
      `User-generated testimonials are a powerful asset for your brand, significantly enhancing 
trust and authenticity. Potential customers connect more with real individuals than with 
polished marketing strategies. These testimonials not only drive higher engagement on 
social media but also improve conversion rates by delivering undeniable social proof. They 
cultivate a strong sense of community among customers, making them feel valued and 
recognised by your brand.`,
    icons: ["chat"],
  },
  {
    title: "Tutorials",
    description:
      `Tutorials effectively lower support costs by streamlining product use. When user-generated 
content creators deliver clear and high-quality instructional materials, your brand showcases 
its knowledge and expertise in the niche, significantly enhancing its reliability and 
trustworthiness to potential and existing customers.`,
    icons: ["blank"],
  },
];

const ServicesGrid = () => {
  return (
    <section className="px-[7vw] pb-[60px] pt-[10px] bg-white">
      {/* Part 1 */}
      <div className="flex max-w-[1200px] mx-auto gap-5 flex-col md:flex-row! md:gap-5 mb-6">
        {services_part1.map((service, index) => (
          <div
            key={index}
            className={`bg-gradient-to-b from-[#e5eeff] to-[#f3f7ff] p-6 rounded-2xl transition-transform duration-300 hover:scale-[1.02] 
            ${index === 0 ? "md:flex-[3]" : "md:flex-[2]"}`}
          >
            {service.icons.length > 0 && (
              <div className="flex justify-end mb-5 -space-x-2 relative">
                {service.icons.map((icon, i) => (
                  <div key={i} className="w-[25px] h-[25px] flex items-center justify-center rounded-full absolute top-3">
                    {iconMap[icon]}
                  </div>
                ))}
              </div>
            )}
            <div>
              <h3 className="text-[18px] md:text-[24px] font-semibold text-[#333] mb-2">{service.title}</h3>
              <p className=" text-[10px] md:text-[12px] font-light text-[#555] leading-relaxed">{service.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Part 2 */}
      <div className="flex max-w-[1200px] mx-auto gap-5 flex-col md:flex-row! md:gap-5">
        {services_part2.map((service, index) => (
          <div
            key={index}
            className={`bg-gradient-to-b from-[#e5eeff] to-[#f3f7ff] p-6 rounded-2xl transition-transform duration-300 hover:scale-[1.02] 
            ${index === 0 ? "md:flex-[2]" : "md:flex-[3]"}`}
          >
            {service.icons.length > 0 && (
              <div className="flex justify-end mb-5 -space-x-2 relative">
                {service.icons.map((icon, i) => (
                  <div key={i} className="w-[25px] h-[25px] flex items-center justify-center rounded-full absolute top-3">
                    {iconMap[icon]}
                  </div>
                ))}
              </div>
            )}
            <div>
              <h3 className="text-[18px] md:text-[24px] font-semibold text-[#333] mb-2">{service.title}</h3>
              <p className=" text-[12px] md:text-[14px] font-light text-[#555] leading-relaxed">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ServicesGrid;