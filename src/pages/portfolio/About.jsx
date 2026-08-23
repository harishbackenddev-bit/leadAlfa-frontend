import img1 from "../../assets/images/portfolio/about/img1.webp";
import img2 from "../../assets/images/portfolio/about/img2.webp";
import img3_1 from "../../assets/images/portfolio/about/img3_1.webp";
import img3_2 from "../../assets/images/portfolio/about/img3_2.webp";
import img3_3 from "../../assets/images/portfolio/about/img3_3.webp";
import { useNavigate } from "react-router-dom";
import ActionButton from "../../components/common/ActionButton";

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="about">
      {/* About Section (image first on mobile) */}
      <div className="mx-auto flex max-w-[1400px] flex-col-reverse items-center gap-10 px-6 py-12 sm:px-8 md:flex-row lg:px-12 lg:py-16">
        {/* Text Section */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-[24px] sm:text-[36px] lg:text-[42px] font-bold leading-[1.25] sm:leading-[1.2] tracking-[-0.02em] text-[#101727] mb-4">
            About <span className="text-[#0c7bb3] font-semibold">Us</span>
          </h2>
          <p className="text-[#606977] text-[15px] leading-[1.8]">
            We are the heartbeat of South African storytelling—connecting
            Mzansi&apos;s most exciting brands with the creators who love them.
          </p>
           <h3 className="text-[18px] font-semibold text-[#101727] mt-6 mb-2">Who We Are</h3>
           <p className="text-[#606977] text-[15px] leading-[1.8]">
             Welcome to Creatrend, South Africa&apos;s premier marketplace for User
            Generated Content (UGC) and authentic influencer marketing.
          </p>
          <p className="text-[#606977] text-[15px] leading-[1.8] mt-4">
            We aren&apos;t a traditional agency. We are a community-first technology
            platform built to solve a simple problem: Brands need real content,
            and Creators need real opportunities.
          </p>
          <p className="text-[#606977] text-[15px] leading-[1.8] mt-4">
            In the past, influencer marketing was a VIP club for big budgets
            and celebrities. We&apos;re changing that. We believe that influence
            isn&apos;t about follower count—it&apos;s about authenticity, creativity,
            and trust. Whether you are a small business in Cape Town launching
            your first product, or a student in Durban with a knack for making
            viral TikToks, Creatrend is your meeting place.
          </p>
        </div>

        {/* Image Section */}
        <div
          style={{ backgroundImage: `url(${img1})` }}
          className={` bg-no-repeat h-[50vw] md:h-[28vw]! mb-[1rem] w-full md:w-[49%]! bg-cover bg-center rounded-[20px]`}
        />
      </div>

      {/* Mission Section (keep order: image first on desktop) */}
      <div className="mx-auto flex max-w-[1400px] flex-col items-center px-6 py-12 sm:px-8 md:flex-row lg:px-12 lg:py-16">
        {/* Image Section */}
        <div
          style={{ backgroundImage: `url(${img2})` }}
          className={`bg-no-repeat bg-cover bg-position-[25%_64%] md:bg-position-[25%_95%]! h-[50vw] md:h-[35vw]! w-full md:w-[49%]! mb-[2rem] rounded-[20px]`}
        />

        {/* Text Section */}
        <div className="flex-1 text-center md:text-left md:ml-[2rem]">
          <h2 className="text-[24px] sm:text-[36px] lg:text-[42px] font-bold leading-[1.25] sm:leading-[1.2] tracking-[-0.02em] text-[#101727] mb-4">
            Our <span className="text-[#0c7bb3] font-semibold">Mission</span>
          </h2>
          <p className="text-[#606977] text-[15px] leading-[1.8]">
            &quot;To democratise the creator economy in Africa. We exist to make
            professional marketing accessible to every local business and to
            turn &apos;content creation&apos; into a sustainable career for every
            creative in South Africa.&quot;
          </p>

          <h3 className="text-[18px] font-semibold text-[#101727] mt-6 mb-2">Why We Started</h3>
          <p className="text-[#606977] text-[15px] leading-[1.8]">
            We saw a gap in the market.
          </p>
          <ul className="list-disc ml-5 mt-3 space-y-2 text-[#606977] text-[15px] leading-[1.8] text-left">
            <li>
              <strong>For Brands:</strong> finding the right influencers was a
              nightmare of DMs, spreadsheets, and ghosting. Agencies were too
              expensive, and pay-per-post felt risky.
            </li>
            <li>
              <strong>For Creators:</strong> getting noticed by brands was
              impossible unless you had 100k followers. Talented creators were
              being ignored because they were &quot;too small.&quot;
            </li>
          </ul>
          <p className="text-[#606977] text-[15px] leading-[1.8] mt-4">
            We built Creatrend to bridge that gap. We replaced the chaos with a
            simple, secure platform where products are gifted, content is
            created, and relationships are built.
          </p>
        </div>
      </div>

      {/* Flagship Section */}
      <div className="mx-auto flex max-w-[1400px] flex-col-reverse items-center gap-10 bg-primary px-6 py-12 sm:px-8 md:flex-row lg:px-12 lg:py-16">
        {/* Text Section */}
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-[24px] sm:text-[36px] lg:text-[42px] font-bold leading-[1.25] sm:leading-[1.2] tracking-[-0.02em] text-[#101727] mb-4">
            How We Are <span className="text-[#0c7bb3] font-semibold">Different</span>
          </h2>
          <p className="text-[#606977] text-[15px] leading-[1.8]">
            <strong>For Brands: The Power of &quot;Real&quot;.</strong> Consumers are
            tired of polished, fake ads. They want to see real people using your
            products in their daily lives.
          </p>
          <ul className="list-disc ml-5 mt-3 space-y-2 text-[#606977] text-[15px] leading-[1.8] text-left">
            <li>
              <strong>Access to Thousands:</strong> Browse a vetted database of
              SA&apos;s best micro-influencers and UGC creators.
            </li>
            <li>
              <strong>Safety First:</strong> Our secure escrow system means you
              only pay for results, and our No Ghosting policy protects your
              products.
            </li>
            <li>
              <strong>From Gifting to Growth:</strong> Start with product seeding
              (gifting) to build buzz, then scale up to paid partnerships when
              you find your ambassadors.
            </li>
          </ul>

          <h3 className="text-[18px] font-semibold text-[#101727] mt-6 mb-2">Our Values</h3>
          <ol className="list-decimal ml-5 mt-2 space-y-2 text-[#606977] text-[15px] leading-[1.8] text-left">
            <li>
              <strong>Local First:</strong> We champion South African businesses
              and homegrown talent.
            </li>
            <li>
              <strong>Transparency:</strong> No hidden fees, no confusing
              contracts. What you see is what you get.
            </li>
            <li>
              <strong>Quality Over Quantity:</strong> We care more about
              engagement and content quality than vanity metrics like follower
              counts.
            </li>
          </ol>

          <h3 className="text-[18px] font-semibold text-[#101727] mt-6 mb-2">Ready to Tell Your Story?</h3>
          <p className="text-[#606977] text-[15px] leading-[1.8]">
            Whether you are here to discover your next favourite product or to
            find the voice for your brand, you&apos;re in the right place.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4 justify-center md:justify-start px-3 md:px-0">
            <ActionButton
              label="Join as a Creator"
              onClick={() => navigate("/signup")}
              showArrow={false}
            />
            <ActionButton
              label="Join as a Brand"
              onClick={() => navigate("/signup")}
              variant="secondary"
              showArrow={false}
            />
          </div>
        </div>

        {/* Images Section */}
        <div className="w-80 md:w-[35vw]! flex flex-row gap-[1rem] items-center md:py-[1rem] relative">
          <div className="flex flex-col gap-[1rem] w-full z-1 sm:pl-0 pl-3">
            <div
              style={{ backgroundImage: `url(${img3_1})` }}
              className={`bg-no-repeat bg-position-[53%_95%] h-[25vh] md:h-[23vw]! md:w-full w-[150px] bg-cover rounded-[20px] w-full`}
            />
            <div
              style={{ backgroundImage: `url(${img3_3})` }}
              className={` bg-no-repeat h-[20vh] md:h-[17vw]! md:w-full w-[150px] bg-cover rounded-[20px]`}
            />
          </div>
          <div className="flex flex-col gap-[1rem] w-full z-2">
            <div
              style={{ backgroundImage: `url(${img3_2})` }}
              className={` bg-no-repeat bg-position-[45%_95%] h-[20vh] md:h-[20vw]! w-[40vw] md:w-full! bg-cover rounded-[20px]`}
            />
          </div>
          <div className="absolute bg-primary-dark w-[45vw] md:w-[20vw]! h-[30vh] md:h-[28vw]! rounded-[20px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
        </div>
      </div>
    </div>
  );
}
