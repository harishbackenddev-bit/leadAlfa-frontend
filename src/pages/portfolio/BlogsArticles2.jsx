import img1 from "../../assets/images/portfolio/blogs/Background.png";
import img2 from "../../assets/images/portfolio/blogs/Background_2.png";
import {
  FacebookIcon,
  TelegramIcon,
  TwitterIcon,
  WhatsappIcon,
} from "../../assets/SVGs/portfolio/share_icons/ShareIcons";

export default function BlogsArticles2() {
  return (
    <div className="max-w-[85vw] mx-auto mb-[7vh]">
      <div className="h-[5vh] md:h-[10vh]" />
      <section className="text-center">
        <h2 className="text-lg md:text-[2rem]! font-medium mb-4">
          Blogs <span className="text-[#0c7bb3] font-semibold">& Articles</span>
        </h2>
        <p className="text-[#444A46] text-[11.5px] md:mx-[20%]!">
          Creatrend is a vibrant and growing team of creative professionals,
          all about supporting creators and businesses across the world with
          genuine and impactful User-Generated Content. We work together
          remotely from various locations in the world, which helps us to bring
          a rich mix of ideas and talents to our mission. We are excited to
          empower our community and make a difference together! One thing we all
          have in common is our passion for what we do!
        </p>
      </section>

      <section className="mt-8 flex flex-col gap-4 md:flex-row! md:gap-0">
        <div className="flex items-center gap-2 md:block!">
          <h4 className="text-[#444A46] text-[10px]">Share</h4>
          <FacebookIcon className="fill-white w-7" />
          <TwitterIcon className="fill-white w-7" />
          <WhatsappIcon className="fill-white w-7" />
          <TelegramIcon className="fill-white w-7" />
        </div>
        <div className="w-[80vw] mx-auto">
          <img src={img2} className="w-full " />
        </div>
      </section>
      <section className="mt-10 w-[78vw] mx-auto space-y-5 text-[#666666] text-[12px] leading-6">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamcolaboris nisi ut aliquip
          ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
          voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit.
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamcolaboris nisi ut aliquip
          ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
          voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur
          sint occaecat cupidatat non proident, sunt in culpa qui officia
          deserunt mollit.Lorem ipsum dolor sit amet, consectetur adipiscing
          elit, sed do eiusmod tempor incididunt ut labore et dolore magna
          aliqua. Ut enim ad minim veniam, quis nostrud exercitation
          ullamcolaboris nisi ut aliquip ex ea commodo consequat. Duis aute
          irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
          sunt in culpa qui officia deserunt mollit.
        </p>
      </section>

      <section className="mt-10 w-[78vw] mx-auto">
        <h2 className="text-2xl font-semibold">Lorem Ipsum</h2>
        <ol className="list-decimal ml-5 mt-6 space-y-5 text-[#444A46] text-[12px] leading-6">
          <li>
            The Creatrend Brand General Terms and Conditions (GTC) outline the
            formal legal relationship between Creatrend and affiliated brands.
            It is important to note that any unique agreements formulated in
            specific instances will take precedence over these overarching Brand
            GTCS. Unless there is evidence to suggest otherwise, the terms and
            conditions outlined in these unique agreements will be primarily
            determined by a formal written contract or a written confirmation
            provided by us. Additionally, the Creatrend Creator General Terms
            and Conditions (GTC) apply specifically to all Creators engaged
            under this framework.
          </li>
          <li>
            In the realm of commerce, it is essential to recognise that only
            brands can embody the role of entrepreneurs. An entrepreneur may be
            an individual, commonly referred to as a natural person, or an
            organisation, such as a corporation, or even a partnership
            recognised under the law, all of which possess the legal capacity to
            engage in business activities. When such entities enter into legal
            agreements, they do so in the context of fulfilling their commercial
            objectives or executing their professional services independently.
            Importantly, any terms and conditions set forth by these brands will
            not hold validity in this context. This stipulation stands firm even
            in cases where Creatrend has not explicitly contested the
            application of such terms, reinforcing that the contractual
            obligations are governed by different principles and do not adhere
            to the brand’s specified regulations.
          </li>
        </ol>
      </section>

      <section className="mt-10 w-[75vw] mx-auto flex flex-col gap-5 md:flex-row!">
        <img
          src={img2}
          alt="image 2"
          className="w-80 h-40 object-cover rounded-lg"
        />
        <img
          src={img1}
          alt="image 1"
          className="w-80 h-40 object-cover rounded-lg"
        />
      </section>
    </div>
  );
}
