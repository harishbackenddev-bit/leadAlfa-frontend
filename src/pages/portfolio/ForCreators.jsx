import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Check, Clock, Star, Users, X } from "lucide-react";

import CreatorReel from "../../components/portfolio/for-creators/CreatorReel";
import ActionButton from "../../components/common/ActionButton";

import jessicaReel from "../../assets/videos/IMG_7905.MP4";
import kagisoAvatar from "../../assets/images/portfolio/for-creators/testimonial-kagiso.jpg";
import sarahAvatar from "../../assets/images/portfolio/for-creators/testimonial-sarah.jpg";

// Navbar and footer come from PortfolioLayout, so this file renders sections only.

const COMPARISON_ROWS = [
  {
    feature: "Payout Speed",
    agencies: "30-90 days post-campaign",
    creatrend: "Within 24 hours of approval",
  },
  {
    feature: "Payment Security",
    agencies: "Invoiced after delivery",
    creatrend: "Funds secured in escrow upfront",
  },
  {
    feature: "Workflow",
    agencies: "Endless emails and scope creep",
    creatrend: "Streamlined dashboard with clear, ad-ready briefs",
  },
  {
    feature: "Earnings",
    agencies: "Agencies hide their 30-50% margins",
    creatrend: "Transparent, premium per-video rates",
  },
  {
    feature: "Flexibility",
    agencies: "Managed service with exclusive rosters",
    creatrend: "Self-serve-work when and how you want",
  },
];

const PROCESS_STEPS = [
  {
    title: "Apply to Join",
    body: "Submit your creator profile. We review your content quality and style within 48 hours.",
  },
  {
    title: "Get Matched",
    body: "Our algorithm connects you with brands that fit your niche, aesthetic, and audience.",
  },
  {
    title: "Create & Upload",
    body: "Receive a clear brief, create your content, and upload directly through the dashboard.",
  },
  {
    title: "Instant Payout",
    body: "Once the brand approves your content, funds are released to your account within 24 hours.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I used to wait almost three months to get paid by traditional PR agencies in Joburg. With Creatrend, the brand approved my skincare video on a Tuesday, and the money cleared into my account by Wednesday morning. It completely changed how I cash flow my creative business.",
    name: "Kagiso M.",
    role: "Tech & Lifestyle UGC Creator",
    avatar: kagisoAvatar,
  },
  {
    quote:
      "The briefs are incredibly professional. You know exactly what the brand wants for their TikTok ads before you even pick up your camera. I get to focus purely on filming and editing without the messy back-and-forth emails. Plus, knowing the funds are locked in escrow gives me total peace of mind.",
    name: "Sarah V.",
    role: "Beauty & Fashion UGC Creator",
    avatar: sarahAvatar,
  },
];

const CTA_HIGHLIGHTS = ["24-Hour Payouts", "Top-Tier Brands", "100% Creator Freedom"];

function SparkleIcon({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M12 2c.4 4.9 3.1 7.6 8 8-4.9.4-7.6 3.1-8 8-.4-4.9-3.1-7.6-8-8 4.9-.4 7.6-3.1 8-8Z" />
    </svg>
  );
}

function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="mx-auto max-w-3xl text-left sm:text-center">
      {eyebrow && (
        <p className="mb-4 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#CD47A1]">
          {eyebrow}
        </p>
      )}
      <h2 className="text-[30px] font-bold leading-[1.2] tracking-[-0.02em] text-[#101727] sm:text-[38px] lg:text-[46px]">
        {title}
      </h2>
      {children && <div className="mt-4 text-[15px] leading-[1.75] text-[#606977]">{children}</div>}
    </div>
  );
}

function BenefitCard({ icon, iconClassName, title, children, panel }) {
  return (
    <article className="flex flex-col rounded-[20px] bg-white p-7 shadow-[0_18px_40px_-24px_rgba(16,23,39,0.22)] sm:p-8">
      <div className="flex items-center gap-3.5">
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}
          aria-hidden="true"
        >
          {icon}
        </span>
        <h3 className="text-[17px] font-bold leading-snug text-[#101727] sm:text-[19px]">{title}</h3>
      </div>
      <div className="mt-5 text-[14px] leading-[1.85] text-[#606977] sm:text-[15px]">{children}</div>
      {panel && <div className="mt-6">{panel}</div>}
    </article>
  );
}

export default function ForCreators() {
  const navigate = useNavigate();

  return (
    <main className="bg-white text-[#101727]">
      {/* Hero */}
      <section className="overflow-x-clip bg-[#F7F8F9]">
        <div className="mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-6 pb-16 pt-6 sm:px-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-12 lg:px-12 lg:pb-20 lg:pt-8">
          <div className="max-w-[920px]">
            <p className="inline-flex rounded-full bg-[#F0AFDA] px-5 py-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#7C2D75] sm:text-[13px]">
              Premium UGC marketplace for South African creators
            </p>

            <h1 className="mt-7 text-[30px] font-bold leading-[1.16] tracking-[-0.025em] text-[#101727] sm:text-[48px] lg:text-[58px]">
              Create Exceptional UGC.
              <br className="hidden sm:block" />
              Get Paid in <span className="whitespace-nowrap text-[#0C7BB3]">24 Hours</span>.
            </h1>

            <p className="mt-6 max-w-[560px] text-[15px] leading-[1.85] text-[#606977] sm:text-[16px]">
              Bring your talent. We bring the dream clients. Creatrend is South Africa&apos;s premium UGC
              marketplace built for high-end creators. Stop waiting 60 days for agency payouts&mdash;produce
              high-quality content, skip the endless negotiations, and get your money within 24 hours of
              approval.
            </p>

            <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center">
              <ActionButton
                label="Apply as a Creator"
                onClick={() => navigate("/signup")}
                arrow_bg="#ffffff"
                stroke="#0C7BB3"
                className="min-w-[232px]"
              />

              <button
                type="button"
                onClick={() => navigate("/case-studies")}
                className="inline-flex h-12 min-w-[232px] items-center justify-center rounded-full border border-[#E4E6EB] bg-white px-8 text-[15px] font-medium text-[#101727] transition-colors hover:bg-[#F7F8F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0C7BB3] focus-visible:ring-offset-2"
              >
                View Examples
              </button>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <CreatorReel
              videoSrc={jessicaReel}
              creator="jessica_beautytalks"
              description="filming a glow-up makeup review for a beauty brand"
              className="w-full max-w-[420px] lg:-mt-5"
            />
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-white pt-16 pb-20 lg:pt-24 lg:pb-28">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-4xl text-left sm:text-center">
            <h2 className="text-[28px] font-bold leading-[1.25] tracking-[-0.02em] text-[#101727] sm:text-[36px] lg:text-[42px]">
              They Make you Wait. They Cap your Earnings.
              <br className="hidden sm:block" /> They Treat you Like an Afterthought.
            </h2>
            <p className="mx-auto mt-6 max-w-[1000px] text-[15px] leading-[1.8] text-[#606977]">
              They make you wait. They cap your earnings. They treat you like an afterthought. Traditional
              South African platforms are built to protect the brand, not empower the creator. They lock you
              into lengthy managed campaigns, negotiate down your rates, and force you to wait 30, 60, or even
              90 days to see your money.
            </p>
            <p className="mx-auto mt-6 max-w-[1000px] text-[15px] leading-[1.8] text-[#606977]">
              Creatrend flips the script. We treat your content like the performance asset it is. How we
              compare to local agencies and platforms.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-[1240px] overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <caption className="sr-only">
                Creatrend compared with traditional South African agencies
              </caption>
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="w-1/3 border border-[#E4E6EB] px-7 py-5 text-[13px] font-medium uppercase tracking-[0.06em] text-[#606977]"
                  >
                    Feature
                  </th>
                  <th
                    scope="col"
                    className="w-1/3 border border-[#E4E6EB] px-7 py-5 text-[13px] font-medium uppercase tracking-[0.06em] text-[#606977]"
                  >
                    Traditional SA agencies
                  </th>
                  <th
                    scope="col"
                    className="w-1/3 border border-[#E4E6EB] bg-[#FDF9FD] px-7 py-5 text-[13px] font-semibold uppercase tracking-[0.06em] text-[#0C7BB3]"
                  >
                    <span className="flex items-center gap-2">
                      Creatrend
                      <SparkleIcon className="h-3.5 w-3.5" />
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.feature}>
                    <th
                      scope="row"
                      className="border border-[#E4E6EB] px-7 py-5 text-left text-[15px] font-medium text-[#101727]"
                    >
                      {row.feature}
                    </th>
                    <td className="border border-[#E4E6EB] px-7 py-5 text-[15px] text-[#606977]">
                      <span className="flex items-center gap-3">
                        <X className="h-4 w-4 shrink-0 text-[#F15F5F]" aria-hidden="true" />
                        {row.agencies}
                      </span>
                    </td>
                    <td className="border border-[#E4E6EB] bg-[#FDF9FD] px-7 py-5 text-[15px] font-medium text-[#0C7BB3]">
                      <span className="flex items-center gap-3">
                        <Check className="h-4 w-4 shrink-0 text-[#2EC767]" aria-hidden="true" />
                        {row.creatrend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="bg-[#F8F9FA] py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <SectionHeading title="Why High-End Creators Choose Creatrend">
            Everything you need. Nothing you don&apos;t.
          </SectionHeading>

          <div className="mx-auto mt-14 grid max-w-[1240px] grid-cols-1 gap-7 md:grid-cols-2">
            <BenefitCard
              icon={<Check className="h-5 w-5 text-[#2EC767]" />}
              iconClassName="bg-[#DBFBE6]"
              title="Get Paid Without the Wait"
              panel={
                <ul className="space-y-2.5">
                  {[
                    "No chasing invoices",
                    "No following up with accounting",
                    "Funds escrowed before you film",
                  ].map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-3 rounded-[10px] bg-[#F9F9F9] px-4 py-3 text-[14px] font-medium text-[#101727]"
                    >
                      <Check className="h-4 w-4 shrink-0 text-[#2EC767]" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              }
            >
              Your time is money. Why act as a free credit line for big brands? With our secure{" "}
              <strong className="font-bold text-[#101727]">TradeSafe escrow integration</strong>, the brand
              deposits the funds before you even start filming. Once your content is approved, your payment is
              automatically released and clears within 24 hours.
            </BenefitCard>

            <BenefitCard
              icon={<Users className="h-5 w-5 text-[#0C7BB3]" />}
              iconClassName="bg-[#E4F1F8]"
              title="Focus on Your Craft, Not Cold Emails"
              panel={
                <div className="rounded-[12px] bg-[#F9F9F9] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#606977]">
                    How it works
                  </p>
                  <ol className="mt-3.5 space-y-3">
                    {[
                      "Log in to your creator dashboard",
                      "Review detailed project opportunities",
                      "Claim the briefs that excite you",
                    ].map((item, index) => (
                      <li key={item} className="flex items-center gap-3 text-[14px] text-[#101727]">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0C7BB3] text-[10px] font-bold text-white">
                          {index + 1}
                        </span>
                        {item}
                      </li>
                    ))}
                  </ol>
                </div>
              }
            >
              Leave the outreach, sales pitches, and price haggling behind. We match you with top-tier SA and
              global e-commerce brands actively looking for your specific{" "}
              <strong className="font-bold text-[#101727]">cultural fit and aesthetic</strong>.
            </BenefitCard>

            <BenefitCard
              icon={<Star className="h-5 w-5 text-[#F97216]" />}
              iconClassName="bg-[#FFF6ED]"
              title="Clear Expectations. Zero Scope Creep."
              panel={
                <div className="rounded-[12px] bg-[#F9F9F9] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#606977]">
                    Every brief includes
                  </p>
                  <ul className="mt-3.5 space-y-2.5">
                    {[
                      "Exact hooks & opening scripts",
                      "Specific CTA requirements",
                      "Video format & duration specs",
                      "Capped at one revision round",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-[14px] text-[#101727]">
                        <span
                          className="flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] bg-[#DBFBE6]"
                          aria-hidden="true"
                        >
                          <Check className="h-2.5 w-2.5 text-[#2EC767]" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              }
            >
              Say goodbye to vague requests like &ldquo;just make it go viral.&rdquo; Our brands provide{" "}
              <strong className="font-bold text-[#101727]">structured, performance-driven briefs</strong>{" "}
              detailing the exact hooks, CTAs, and video formats required.
            </BenefitCard>

            <BenefitCard
              icon={<Clock className="h-5 w-5 text-[#0C7BB3]" />}
              iconClassName="bg-[#E4F1F8]"
              title="Flexibility"
              panel={
                <div className="rounded-[12px] bg-[#F9F9F9] p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-[16px] font-bold text-[#101727]">Campaign Invitations</h4>
                      <p className="mt-1 text-[13px] text-[#606977]">Brands can book you now</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => navigate("/creator/invitations")}
                      className="main-btn shrink-0 rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0C7BB3] focus-visible:ring-offset-2"
                    >
                      See Invites
                    </button>
                  </div>
                  <ul className="mt-5 space-y-3">
                    {[
                      "Accept or decline invitations from brands.",
                      "Brands revision requests capped to only two.",
                      "In-App chat. Ask the brand for more information if needed to reduce revision requests risks.",
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-[13px] leading-[1.6] text-[#606977]">
                        <span
                          className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[#2EC767]"
                          aria-hidden="true"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              }
            >
              Apply to campaign briefs based on your availability and flexibility.
            </BenefitCard>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-white py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <SectionHeading eyebrow="What SA creators are saying" title="Real Creators. Real Results." />

          <div className="scrollbar-thin -mx-6 mt-14 flex snap-x snap-mandatory scroll-pl-6 gap-7 overflow-x-auto px-6 pb-4 sm:-mx-8 sm:scroll-pl-8 sm:px-8 md:mx-auto md:grid md:max-w-[1240px] md:grid-cols-2 md:overflow-visible md:px-0 md:pb-0">
            {TESTIMONIALS.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="w-[85%] shrink-0 snap-start rounded-[20px] border border-[#EFF1F4] bg-white p-8 shadow-[0_18px_40px_-24px_rgba(16,23,39,0.22)] md:w-auto md:shrink"
              >
                <span
                  className="block font-serif text-[44px] leading-none text-[#F3C1EA]"
                  aria-hidden="true"
                >
                  &ldquo;
                </span>
                <blockquote className="mt-3 text-[15px] leading-[1.9] text-[#606977]">
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-8 flex items-center gap-4">
                  <img
                    src={testimonial.avatar}
                    alt=""
                    width={48}
                    height={48}
                    loading="lazy"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[15px] font-bold text-[#101727]">{testimonial.name}</p>
                    <p className="mt-0.5 text-[13px] text-[#606977]">{testimonial.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-[#F8F9FA] py-20 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <SectionHeading title="How It Works: From Brief To Bank Account">
            Four simple steps from application to payday.
          </SectionHeading>

          <div className="relative mx-auto mt-14 max-w-[1240px]">
            <span
              className="absolute left-[12.5%] right-[12.5%] top-10 hidden border-t-2 border-dashed border-[#F2BAE8] lg:block"
              aria-hidden="true"
            />
            <ol className="relative grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {PROCESS_STEPS.map((step, index) => (
                <li
                  key={step.title}
                  className="flex flex-col items-start text-left sm:items-center sm:text-center"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#0C7BB3] text-[20px] font-bold text-white sm:h-20 sm:w-20 sm:text-[24px]">
                    {index + 1}
                  </span>
                  <h3 className="mt-6 text-[18px] font-bold text-[#101727]">{step.title}</h3>
                  <p className="mt-3 text-[14px] leading-[1.8] text-[#606977] sm:max-w-[280px]">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="bg-[#0C7BB3] py-16 text-white lg:py-24">
        <div className="mx-auto flex max-w-[1750px] flex-col items-start justify-between gap-10 px-6 sm:px-8 lg:flex-row lg:items-center lg:px-12">
          <div className="max-w-[640px]">
            <h2 className="text-[34px] font-bold leading-[1.2] tracking-[-0.02em] sm:text-[44px] lg:text-[50px]">
              Ready To Elevate Your UGC Career?
            </h2>
            <p className="mt-6 max-w-[560px] text-[15px] leading-[1.8] text-white/90 sm:text-[16px]">
              Join hundreds of South African creators already earning more, working smarter, and getting paid
              faster with Creatrend.
            </p>
            <ul className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-3">
              {CTA_HIGHLIGHTS.map((item) => (
                <li key={item} className="flex items-center gap-2 text-[14px] font-semibold">
                  <Check className="h-4 w-4" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="group inline-flex h-12 w-fit shrink-0 items-center justify-between gap-2 whitespace-nowrap rounded-full bg-[#F2BAE8] pl-6 pr-1 text-[14px] font-semibold text-[#101727] transition-colors hover:bg-[#EBA6DF] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C7BB3] sm:text-[16px]"
          >
            Start Your Creator Application
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#101727] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
            </span>
          </button>
        </div>
      </section>
    </main>
  );
}
