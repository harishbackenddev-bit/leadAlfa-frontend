import DetailCard from "../../components/common/DetailCard";
import BannerSectionImage from "../../assets/images/portfolio/ugc/IMG_1155.webp";
import video2 from "../../assets/videos/portfolio/main/czz_1.mp4";
import img1 from "../../assets/images/portfolio/services/img-2.png";
import CTASection from "../../components/portfolio/Home/CTASection";
import ReviewsWebpage from "../../assets/images/portfolio/review-webpage/maxresdefault.webp";

export default function WhatIsUGC() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <DetailCard
        title={
          <>
            WHAT IS UGC?
            <span className="mt-1 block text-[#0c7bb3] text-[20px] sm:text-[24px] lg:text-[26px]">
              (USER-GENERATED CONTENT)
            </span>
          </>
        }
        description={
          <>
            <p>
              User-generated content (UGC), often referred to as
              consumer-generated content, represents an influential tool for
              marketers aiming to enhance brand visibility and recognition.
              These forms can include social media posts, where users share
              their experiences or opinions about products; blog articles, where
              enthusiasts write detailed reviews or tutorials; videos uploaded
              to platforms like YouTube or TikTok that showcase personal stories
              or demonstrations; and images shared on platforms like Instagram
              that highlight personal achievements or daily life moments. By
              harnessing UGC, companies can authentically showcase their
              products and services through the lenses of satisfied customers,
              thereby fostering a sense of community and trust.
            </p>
            <p className="pt-4">
              Engaging with this type of content not only boosts a brand’s
              credibility but also encourages further interaction from potential
              customers, ultimately driving brand awareness and loyalty in an
              increasingly digital marketplace. UGC can also manifest as
              comments, testimonials, and ratings on review sites or e-commerce
              platforms, reflecting real user experiences and fostering a sense
              of community and authenticity. This type of content not only
              enhances engagement but also provides valuable insights and
              perspectives that can influence consumer behaviour
            </p>
          </>
        }
        file={BannerSectionImage}
        mediaSide="right"
        mediaWidth={90}
        shadow={true}
        actionClass="mt-10"
      />
      <DetailCard
        title={
          <>
            UGC for <span className="text-[#0c7bb3]">online storefronts</span>
          </>
        }
        description="User-generated content (UGC) is a powerful tool for enhancing the performance of online storefronts such as Shopify, Amazon, and Takealot. By tapping into real experiences shared by customers, UGC fosters a sense of authenticity that significantly boosts consumer trust. As highlighted, the organic feedback can take various
                forms, including reviews, photos, videos, and social media posts, all of which serve to engage potential buyers
                on a deeper level. As a result, UGC not only enhances the shopping experience but also encourages increased
                interaction with the brand, ultimately driving higher sales and improving customer loyalty. By showcasing
                genuine customer stories, these platforms can create a more relatable and inviting shopping environment that
                resonates with diverse audiences."
        file={img1}
        mediaSide="left"
        className=""
      />
      <DetailCard
        title={
          <>
            UGC for <span className="text-[#0c7bb3]">Social Media Reach</span>
          </>
        }
        description={
          <div className="space-y-4">
            <p>
              User-Generated Content (UGC) offers a remarkable opportunity to
              elevate your online store by deepening your understanding of your
              customers' preferences and behaviours. This powerful form of
              content can significantly broaden the visibility of a storefront,
              e-commerce website and services, effectively surpassing the
              limitations of conventional marketing strategies.
            </p>
            <p>
              When customers take to social media platforms or review websites
              to share their personal experiences with a brand, they become
              informal yet impactful brand ambassadors. Their authentic
              testimonials and engaging visuals not only enhance credibility but
              also serve to captivate a wider audience. The organic promotion
              can drive substantial traffic to your store, creating a community
              of loyal followers who are inspired by real-life experiences, thus
              fostering stronger connections and increased brand loyalty.
            </p>
            <p>
              Harnessing the power of organic word-of-mouth advertising is a
              fantastic way to stand out in e-commerce! Collaborate with
              creators, leverage UGC, and highlight authentic customer reviews.
              Don’t forget to share these treasures on social media and express
              gratitude when you repost—it fosters connection and community!
            </p>
          </div>
        }
        file={video2}
        mediaSide="right"
      />
      <DetailCard
        title={
          <>
            Reviews <span className="text-[#0c7bb3]">Webpage</span>
          </>
        }
        description="Often, when potential customers are considering a purchase, they want a brief overview of your store's reviews. It allows them to quickly grasp the positives, negatives, and any potential concerns regarding their shopping experience. Therefore, having a dedicated all-reviews page on your website is essential. The page serves as a centralised hub where visitors can easily access every review your store has received—both commendations and criticisms. By providing this transparency, you not only build trust with your audience but also give them the tools they need to make informed purchasing decisions. If you are struggling with reviews, sign up on Creatrend to work with our creators and improve your online reviews and product/service testimonials. Our flagship service is now accessible in the UK, South Africa, Zambia, and Zimbabwe, and we're excited to announce that we collaborate with over 100 dynamic brands in each of these countries. By signing up for free, you'll receive complimentary credits that you can use to launch your marketing campaigns, significantly enhance your visibility, and drive sales growth."
        file={ReviewsWebpage}
        mediaSide="left"
      />
      <CTASection />
    </div>
  );
}
