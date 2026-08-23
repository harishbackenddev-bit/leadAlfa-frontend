import DetailCard from "../../components/common/DetailCard";
import CTASection from "../../components/portfolio/Home/CTASection";
import Industries from "../../components/portfolio/Home/Industries";
import Pricing from "../../components/portfolio/Home/Pricing";
import Testimonial from "../../components/portfolio/Home/Testimonial";
import VideoCarousel from "../../components/portfolio/Home/VideoCarousel";
import video1 from "../../assets/videos/portfolio/main/IMG_9357.MP4";
import img1 from "../../assets/images/portfolio/services/img-2.png";
export default function TikTokVideoAds() {
  return (
    <div>
      <div className="md:h-[10vh]" />
      {/* First Section */}
      <DetailCard
        title={
          <>
            TikTok Video Ads,{" "}
            <span className="text-[#0c7bb3]">Optimized To Convert</span>
          </>
        }
        description="For comprehensive details and answers to your questions, we encourage you to explore our Frequently Asked Questions (FAQ) section, where you'll find a wealth of information covering all topics. If you need further assistance or have specific inquiries that aren’t addressed, please don’t hesitate to reach out to our dedicated support team. The team is available to provide you with personalised help and guidance to ensure you have the best experience possible."
        file={video1}
        buttonLabel="Explore creators for free"
        mediaSide="right"
        mediaWidth={90}
        shadow={true}
        actionClass="mt-10"
      />

      {/* Second Section */}
      <Testimonial />
      {/* s-6 Industries Section */}
      <section>
        <div className="px-[10vw] py-[10vh] bg-primary">
          <h1 className="text-center font-semibold text-3xl mb-10 md:mb-5 md:text-4xl">
            UGC Videos For All <span className="mark">Industries</span>
          </h1>
          <Industries />
          <VideoCarousel />
        </div>
      </section>

      {/* Third Section */}
      <DetailCard
        title={
          <>
            Video Marketing Solutions{" "}
            <span className="text-[#0c7bb3]">For Marketing Agencies</span>
          </>
        }
        description="Create effective campaigns by leveraging top-tier user-generated content
                            (UGC) from verified creators. Utilise our streamlined workflows designed
                            for Marketing Agencies to maximise ROAS and minimise CAC."
        points={[
          "Establish a new revenue stream for your agency by offering user-generated content for resale to clients",
          "Manage your clients UGC accounts and outsource creators on their behalf",
          "Explore creator for free",
        ]}
        file={img1}
        buttonLabel="Book a Call"
        mediaSide="left"
        className=""
      />

      <section>
        <h1 className="text-center font-semibold text-3xl mb-10 md:mb-5 md:text-4xl">
          Pricing
        </h1>
        <Pricing />
      </section>

      {/* s-10 Final CTA Section */}
      <section>
        <CTASection />
      </section>
    </div>
  );
}
