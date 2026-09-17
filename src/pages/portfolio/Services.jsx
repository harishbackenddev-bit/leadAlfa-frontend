import img1 from "../../assets/images/portfolio/services/img-2.png";
import video1 from "../../assets/videos/portfolio/main/IMG_9357.MP4";
import video2 from "../../assets/videos/portfolio/main/czz_1.mp4";
import DetailCard from "../../components/common/DetailCard";
import CTASection from "../../components/portfolio/Home/CTASection";
import Testimonial from "../../components/portfolio/Home/Testimonial";
// import DetailCard from "../components/Lab/DetailCard";
// import Testimonial from "../components/Home/Testimonial";
// import CTASection from "../components/Home/CTASection";

export default function Services() {
  return (
    <>
      <div className="md:h-[10vh]" />
      {/* First Section */}
      <DetailCard
        title={
          <>
            Effective Creator ADS With{" "}
            <span className="text-[#0c7bb3] block">
              High-ROAS For e-Commerce
            </span>{" "}
            Brands
          </>
        }
        description="Elevate your e-commerce marketing strategy with our innovative on-demand
        creator advertisements, meticulously crafted to align with your brand’s
        vision. Our approach is powered by comprehensive analytics, ensuring every
        aspect—from the careful selection of creators tailored to your target
        audience to the final touches in the editing process—is backed by
        real-time data."
        points={[
          "Drive traffic to your Amazon storefront",
          "Drive traffic to your Takealot storefront",
          "1000+ Verified creators",
          "100+ Brands have already signed up",
        ]}
        file={video1}
        buttonLabel="Explore creators for free"
        mediaSide="right"
        mediaWidth={90}
        shadow={true}
      />

      {/* Second Section */}
      <Testimonial />

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

      {/* Fourth Section */}
      <DetailCard
        title={
          <>
            Elevate your app marketing by harnessing{" "}
            <span className="text-[#0c7bb3]">
              The Power Of Data-Driven Advertisements
            </span>
          </>
        }
        description="Supercharge your installations and slash your CPA with compelling creator videos,
        fuelled by real ad data from over 1,000 successful campaigns!"
        points={[
          "Boost downloads via the App Store and Google Play Store",
          "Get authentic reviews",
          "Create How-to guides",
          "Access over 1000+ creators",
        ]}
        file={video2}
        buttonLabel="Explore creators for free"
        mediaSide="right"
      />

      {/* Final CTA */}
      <CTASection />
    </>
  );
}
