import { useEffect, useState } from "react";
import { fetchReels, filterReelsBySlug } from "../../apis/reels";

import HeroSection2 from "../../components/portfolio/Home/HeroSection";
import MarqueeSection from "../../components/portfolio/Home/MarqueeSection";
import Testimonial from "../../components/portfolio/Home/Testimonial";
import ServicesSection from "../../components/portfolio/Home/ServicesSection";
import ServicesGrid from "../../components/portfolio/Home/ServicesGrid";
import Industries from "../../components/portfolio/Home/Industries";
import VideoCarousel from "../../components/portfolio/Home/VideoCarousel";
import Connect from "../../components/portfolio/Home/Connect";
import Pricing from "../../components/portfolio/Home/Pricing";
import CTASection from "../../components/portfolio/Home/CTASection";

export default function Home() {
  const [reels, setReels] = useState([]);

  useEffect(() => {
    const loadReels = async () => {
      try {
        const data = await fetchReels();
        setReels(data);
        // const urls = data.map(item => item.url);
      } catch (error) {
        console.error("Error loading reels:", error.message);
      }
    };
    loadReels();
  }, []);

  const action = (slug) => {
    let filteredReels = filterReelsBySlug(slug);
    setReels(filteredReels);
  };

  return (
    <>
      {/* s-1 Hero Section */}
      <section className="bg-primary">
        <div className="md:h-[5vh]" />
        <HeroSection2 action={action} />
      </section>

      {/* s-2 Marquee Section */}
      <section className="pb-[50px]">
        <MarqueeSection
          details={reels}
          direction="left"
          mediaClassName="h-[30vh] md:h-[77vh] flex-shrink-0"
        />
      </section>

      {/* s-3 Testimonial Section */}
      <section>
        <Testimonial />
      </section>

      {/* s-4 Services Section */}
      <section>
        <ServicesSection />
      </section>

      {/* s-5 Services Grid Section */}
      <section>
        <ServicesGrid />
      </section>

      {/* s-6 Industries Section */}
      <section>
        <div className="px-[10vw] py-[10vh] bg-primary">
          <h1 className="text-center font-semibold text-3xl mb-10 md:mb-5 md:text-4xl">
            UGC Videos For All{" "}
            <span className="mark text-[#0c7bb3] font-semibold">
              Industries
            </span>
          </h1>
          <Industries />
          <VideoCarousel />
        </div>
      </section>

      {/* s-7 Connect Section */}
      <section className="px-[7vw] py-[60px] bg-white">
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-10 flex-wrap">
          <h1 className="text-[40px] font-medium leading-[1.2] text-[#111] max-md:text-[28px]">
            Connect With{" "}
            <span className="text-[#0c7bb3] font-semibold">
              1000+ <br /> UGC Creators
            </span>
          </h1>
          <p className="flex-1 text-[11px] font-light text-[#444] leading-[1.6] max-w-[500px] max-md:text-[13px] max-md:max-w-full">
            Access Creators who speak 2 or more languages to advertise your
            product and services in a language of your choice. From *English to
            Nyanja, to IsiZulu and more!
          </p>
        </div>
      </section>

      <section>
        <Connect />
      </section>

      <section>
        <h1 className="text-center font-semibold text-3xl mb-5 md:text-4xl">
          Pricing
        </h1>
        <Pricing />
      </section>

      {/* s-10 Final CTA Section */}
      <section>
        <CTASection />
      </section>
    </>
  );
}
