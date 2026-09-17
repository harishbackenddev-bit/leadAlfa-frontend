import downloadsImg from "../../imports/3rd-solution-2.PNG";
import cpaImg from "../../imports/3rd-solution-1.PNG";
import CreatorLocationCard from "../common/CreatorLocationCard";
import agencyReel from "../../assets/videos/agency-ugc.mp4";

export function WhyUGCSection() {
  return (
    <section className="overflow-x-clip bg-white py-14 sm:py-20 lg:py-24">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-[1240px] grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-10">
          <div>
            <h2 className="text-[24px] font-bold leading-[1.25] tracking-[-0.02em] text-[#101727] sm:text-[36px] sm:leading-[1.2] lg:text-[42px]">
              Why Top Marketing Agencies Are Pivoting to UGC
            </h2>

            <p className="mt-6 max-w-[680px] text-[15px] leading-[1.8] text-[#606977]">
              In today's digital landscape, consumers are blind to highly polished, studio-produced advertisements. They crave authenticity. For marketing agencies, this presents a massive challenge: how do you produce a high volume of engaging, native-looking content without blowing out your clients' budgets?
              The answer is User-Generated Content. By partnering with verified UGC creators, your agency can rapidly test new creatives, combat ad fatigue, and deliver the authentic social proof that modern consumers demand.
            </p>
          </div>

          <div className="flex justify-center lg:justify-end">
            <CreatorLocationCard video={agencyReel} title="Agencies" location="Durban" />
          </div>
        </div>

        <div className="mx-auto mt-10 max-w-[1240px] sm:mt-14">
          <h3 className="text-[20px] font-bold text-[#101727] sm:text-center sm:text-[24px]">
            Unlock Value for Your Agency and Clients
          </h3>

          <div className="mt-8 grid grid-cols-1 gap-7 md:grid-cols-2">
            <article className="flex flex-col rounded-[20px] border-2 border-pink-100 bg-white p-7 shadow-sm sm:p-8">
              <h4 className="text-[17px] font-bold leading-snug text-[#101727] sm:text-[19px]">
                The Agency Advantage
              </h4>

              <div className="mt-4 space-y-4 text-[15px] leading-[1.8] text-[#606977]">
                <p>
                  <strong className="font-bold text-[#101727]">Maximize ROAS:</strong> Authentic
                  videos build trust instantly, driving higher click-through and
                  conversion rates across TikTok, Meta, and Instagram.
                </p>
                <p>
                  <strong className="font-bold text-[#101727]">Minimize CAC:</strong> Lower your
                  clients' acquisition costs by feeding the algorithm a constant stream
                  of high-performing, native-looking creatives.
                </p>
                <p>
                  <strong className="font-bold text-[#101727]">Eliminate Production Constraints:</strong>{" "}
                  Skip the expensive location scouting, camera crews, and lengthy
                  post-production cycles.
                </p>
              </div>

              <div className="mt-auto flex justify-center pt-8">
                <img
                  src={cpaImg}
                  alt="Agency Dashboard"
                  className="w-full max-w-[380px] object-contain"
                />
              </div>
            </article>

            <article className="flex flex-col rounded-[20px] border-2 border-pink-100 bg-white p-7 shadow-sm sm:p-8">
              <h4 className="text-[17px] font-bold leading-snug text-[#101727] sm:text-[19px]">
                Build a New Revenue Stream
              </h4>

              <div className="mt-4 space-y-4 text-[15px] leading-[1.8] text-[#606977]">
                <p>
                  You already manage your clients' ad accounts and marketing strategies. Now, you can own the creative pipeline, too.
                </p>
                <p>
                  Our platform empowers you to offer UGC as a service to your clients,
                  creating an additional revenue stream while helping brands scale with
                  authentic creator content.
                </p>
                <p>
                  You provide the strategy, our verified creators provide the content.
                  You keep the client relationship and grow your agency margins.
                </p>
              </div>

              <div className="mt-auto flex justify-center pt-8">
                <img
                  src={downloadsImg}
                  alt="Pricing Plans"
                  className="w-full max-w-[380px] object-contain"
                />
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
