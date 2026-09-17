import { useNavigate } from "react-router-dom";
import {
  ArrowUpRight,
  BarChart3,
  Check,
  FileText,
  Filter,
  Globe,
  Package,
  Play,
  RefreshCw,
  Search,
  Shield,
  ShoppingBag,
  Smartphone,
  Star,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";

import ActionButton from "../../components/common/ActionButton";

import heroShoppableUgc from "../../assets/images/portfolio/for-brands/hero-shoppable-ugc.jpg";

// Navbar and footer come from PortfolioLayout, so this file renders sections only.

const HERO_TICKS = ["300+ vetted creators", "Full usage rights", "No hidden fees"];

const HERO_STATS = [
  { value: "300+", label: "Vetted SA Creators" },
  { value: "50%", label: "CAC Reduction (avg)" },
  { value: "28%", label: "Higher Ad Engagement" },
  { value: "100%", label: "Usage Rights Owned" },
];

const COMPARISON_ROWS = [
  {
    metric: "Primary Goal",
    influencers: "Brand Awareness (Vanity Metrics)",
    creatrend: "Direct Conversions & ROI",
  },
  {
    metric: "Average Engagement",
    influencers: "1.5% – 3%",
    creatrend: "Up to 28% higher ad engagement",
  },
  {
    metric: "Asset Ownership",
    influencers: "Often restricted or limited",
    creatrend: "Full usage rights managed in-dashboard",
  },
  {
    metric: "Impact on CAC",
    influencers: "High (Costly flat fees)",
    creatrend: "Reduces CAC by up to 50%",
  },
  {
    metric: "Reusability",
    influencers: "Post disappears in 24 hours",
    creatrend: "Evergreen assets for continuous ad testing",
  },
];

const FUNNEL_CHANNELS = [
  {
    title: "Paid Social",
    icon: <Smartphone className="h-5 w-5" />,
    iconClass: "bg-[#E4F1F8] text-[#0C7BB3]",
    items: ["Meta Ads (Facebook & Instagram)", "TikTok Ads"],
  },
  {
    title: "Organic Social",
    icon: <Play className="h-5 w-5" />,
    iconClass: "bg-[#FEECEC] text-[#E23D3D]",
    items: ["Instagram Reels", "YouTube Shorts", "LinkedIn"],
  },
  {
    title: "E-Commerce Website",
    icon: <Globe className="h-5 w-5" />,
    iconClass: "bg-[#E4F1F8] text-[#0C7BB3]",
    items: ["Homepage embed videos", "Landing page trust builders"],
  },
  {
    title: "Marketplace Storefronts",
    icon: <ShoppingBag className="h-5 w-5" />,
    iconClass: "bg-[#DBFBE6] text-[#2EC767]",
    items: ["Amazon product listings", "Takealot storefronts", "Shopify stores"],
  },
];

const ADVANTAGES = [
  {
    title: "Elite SA Creator Network",
    icon: <Users className="h-5 w-5" />,
    iconClass: "bg-[#E4F1F8] text-[#0C7BB3]",
    body: "Stop wasting time sifting through thousands of unverified portfolios. Get instant access to 300+ highly vetted UGC creators in South Africa — screened for camera presence, marketing knowledge, and production quality.",
  },
  {
    title: "Deep Competitor Ad Research",
    icon: <Search className="h-5 w-5" />,
    iconClass: "bg-[#EEEBFB] text-[#6D5BD0]",
    body: "Don't guess what works — know exactly what does. Our platform lets you check the exact ads your competitors have been running for the past year. Counter their strategies and launch with proven data.",
  },
  {
    title: "Data-Driven Creator Filtering",
    icon: <Filter className="h-5 w-5" />,
    iconClass: "bg-[#E4F1F8] text-[#0C7BB3]",
    body: "Not all creators fit every niche. Use advanced search to filter by Historical Ad Performance, Location & Demographics, and Brand Ratings & Reviews to find your perfect match every time.",
  },
  {
    title: "End-to-End Campaign & Shipping Dashboard",
    icon: <Package className="h-5 w-5" />,
    iconClass: "bg-[#FFF6ED] text-[#F97216]",
    body: "Say goodbye to messy spreadsheets and lost tracking numbers. Select creators, input your brief, and ship your physical products to them for filming — all tracked in one place.",
  },
  {
    title: "Secure Escrow Payments",
    icon: <Shield className="h-5 w-5" />,
    iconClass: "bg-[#DBFBE6] text-[#2EC767]",
    body: "Your budget is fully protected. Our secure escrow system holds your funds safely and only releases payment to the creator once you have received and approved your ad-ready assets.",
  },
  {
    title: "Built-in Usage Rights Management",
    icon: <FileText className="h-5 w-5" />,
    iconClass: "bg-[#FEECEC] text-[#E23D3D]",
    body: "No confusing legal jargon or hidden licensing fees. Manage and secure your commercial usage rights directly within your dashboard, ensuring assets are cleared for scaling on any ad network.",
  },
  {
    title: "Re-hire Top Performers Instantly",
    icon: <RefreshCw className="h-5 w-5" />,
    iconClass: "bg-[#E4F1F8] text-[#0C7BB3]",
    body: "Did a specific creator's video drop your CAC by 30%? Easily invite your previously high-performing creators to your next campaign with a single click to build long-term, profitable partnerships.",
  },
];

function Eyebrow({ icon, label, className }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[12px] font-semibold leading-[18px] ${className}`}
    >
      {icon}
      {label}
    </span>
  );
}

function SectionHeading({ eyebrow, title, children }) {
  return (
    <div className="mx-auto max-w-3xl text-left sm:text-center">
      {eyebrow}
      <h2 className="mt-5 text-[28px] font-bold leading-[1.2] tracking-[-0.02em] text-[#101727] sm:text-[36px] lg:text-[42px]">
        {title}
      </h2>
      {children && <div className="mt-4 text-[15px] leading-[1.75] text-[#606977]">{children}</div>}
    </div>
  );
}

export default function ForBrands() {
  const navigate = useNavigate();

  return (
    <main className="bg-white text-[#101727]">
      {/* Hero */}
      <section className="overflow-x-clip bg-[#F7F8F9]">
        <div className="mx-auto max-w-[1400px] px-6 pb-16 pt-8 sm:px-8 lg:px-12 lg:pb-20">
          <Eyebrow
            icon={<ShoppingBag className="h-[13px] w-[13px]" />}
            label="For Brands on Shopify, Amazon & Takealot"
            className="border-[#0C7BB3]/20 bg-[#EEF9FF] text-[#0C7BB3]"
          />

          {/* H1 spans the container so line two holds at 46px — the two-up row below it is copy | image */}
          <h1 className="mt-7 text-[32px] font-bold leading-[1.18] tracking-[-0.025em] text-[#101727] sm:text-[42px] lg:text-[52px]">
            Stop Paying for <span className="text-[#0C7BB3]">Vanity Metrics.</span>
            <br className="hidden sm:block" /> Start Scaling with
            <br className="hidden sm:block" /> Ad-Ready UGC.
          </h1>

          {/* image column only widens at 2xl — below that the copy column needs the width to keep both CTAs on one line */}
          <div className="mt-6 grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)]">
            <div>
              <p className="max-w-[600px] text-[15px] leading-[1.85] text-[#606977] sm:text-[16px]">
                Likes, views, and followers don&apos;t pay the bills &mdash; conversions do. Creatrend is
                the premier UGC marketplace built for performance marketers and e-commerce brands on
                Shopify, Amazon, and Takealot. We deliver authentic, high-converting ad assets designed to
                drive maximum ROI while slashing your CAC.
              </p>

              <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                <ActionButton
                  label="Create Your Brand Account Today"
                  onClick={() => navigate("/signup")}
                  arrow_bg="#ffffff"
                  stroke="#0C7BB3"
                  className="w-full! max-w-[280px] justify-center! gap-3! pl-5! text-[13px]! sm:w-fit! sm:max-w-none sm:justify-between! sm:gap-2! sm:pl-6! sm:text-[16px]!"
                />

                <button
                  type="button"
                  onClick={() => navigate("/case-studies")}
                  className="inline-flex h-12 w-full max-w-[280px] items-center justify-center rounded-full border border-[#E4E6EB] bg-white px-8 text-[15px] font-medium text-[#101727] transition-colors hover:bg-[#F7F8F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0C7BB3] focus-visible:ring-offset-2 sm:w-fit sm:max-w-none"
                >
                  Explore Our Work
                </button>
              </div>

              <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2.5">
                {HERO_TICKS.map((tick) => (
                  <li key={tick} className="flex items-center gap-2 text-[13px] text-[#606977]">
                    <Check className="h-4 w-4 shrink-0 text-[#0C7BB3]" aria-hidden="true" />
                    {tick}
                  </li>
                ))}
              </ul>
            </div>

            <img
              src={heroShoppableUgc}
              alt="Shoppable UGC videos of a skincare brand alongside a checkout summary"
              width={1376}
              height={768}
              className="w-full max-w-[720px] rounded-[20px] bg-[#F4F4F4] lg:-mt-10 lg:justify-self-end xl:-mt-[129px]"
            />
          </div>

          {/* 1px gap on a tinted parent gives the cell dividers at every breakpoint */}
          <dl className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-[16px] bg-[#E9ECF0] lg:grid-cols-4">
            {HERO_STATS.map((stat) => (
              <div key={stat.label} className="bg-white px-5 py-7 text-center">
                <dt className="text-[28px] font-bold leading-none text-[#0C7BB3] sm:text-[34px]">
                  {stat.value}
                </dt>
                <dd className="mt-2.5 text-[13px] text-[#606977] sm:text-[14px]">{stat.label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow={
              <Eyebrow
                icon={<BarChart3 className="h-[13px] w-[13px]" />}
                label="Performance Comparison"
                className="border-[#F59E0B]/25 bg-[#FFF7ED] text-[#D97706]"
              />
            }
            title={
              <>
                Why Ad-Ready UGC Beats
                <br className="hidden sm:block" /> Traditional Influencer Marketing
              </>
            }
          >
            Influencers charge a premium for access to their audience &mdash; but that audience
            doesn&apos;t always convert. Ad-ready UGC focuses purely on the creative asset.
          </SectionHeading>

          <div className="mx-auto mt-12 max-w-[1240px] overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse overflow-hidden rounded-[16px] text-left ring-1 ring-[#E4E6EB]">
              <caption className="sr-only">
                Ad-ready UGC on Creatrend compared with traditional influencer marketing
              </caption>
              <thead>
                <tr className="bg-[#FAFBFC]">
                  <th
                    scope="col"
                    className="w-1/3 border-b border-[#E4E6EB] px-7 py-5 text-[12px] font-medium uppercase tracking-[0.08em] text-[#8A919E]"
                  >
                    Metric
                  </th>
                  <th
                    scope="col"
                    className="w-1/3 border-b border-l border-[#E4E6EB] px-7 py-5 text-[14px] font-medium text-[#606977]"
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EFF1F4]"
                        aria-hidden="true"
                      >
                        <X className="h-3 w-3 text-[#8A919E]" />
                      </span>
                      Traditional Influencers
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="w-1/3 border-b border-l border-[#E4E6EB] bg-[#F4FAFD] px-7 py-5 text-[14px] font-semibold text-[#0C7BB3]"
                  >
                    <span className="flex items-center gap-2.5">
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#CFE6F2]"
                        aria-hidden="true"
                      >
                        <Check className="h-3 w-3 text-[#0C7BB3]" />
                      </span>
                      Ad-Ready UGC (Creatrend)
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map((row) => (
                  <tr key={row.metric} className="border-b border-[#E4E6EB] last:border-b-0">
                    <th
                      scope="row"
                      className="px-7 py-5 text-left text-[15px] font-medium text-[#101727]"
                    >
                      {row.metric}
                    </th>
                    <td className="border-l border-[#E4E6EB] px-7 py-5 text-[14px] text-[#606977]">
                      <span className="flex items-center gap-3">
                        <X className="h-4 w-4 shrink-0 text-[#F15F5F]" aria-hidden="true" />
                        {row.influencers}
                      </span>
                    </td>
                    <td className="border-l border-[#E4E6EB] bg-[#F4FAFD] px-7 py-5 text-[14px] font-medium text-[#0C7BB3]">
                      <span className="flex items-center gap-3">
                        <Check className="h-4 w-4 shrink-0 text-[#0C7BB3]" aria-hidden="true" />
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

      {/* Funnel placements */}
      <section className="bg-[#F8FAFC] py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow={
              <Eyebrow
                icon={<Zap className="h-[13px] w-[13px]" />}
                label="Full Funnel Deployment"
                className="border-[#0C7BB3]/20 bg-[#EEF9FF] text-[#0C7BB3]"
              />
            }
            title="Where Ad-Ready UGC Works Best"
          >
            Because you own full usage rights to every asset created on Creatrend, you can deploy
            high-converting video across your entire marketing funnel.
          </SectionHeading>

          <div className="mx-auto mt-12 grid max-w-[1240px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FUNNEL_CHANNELS.map(({ title, icon, iconClass, items }) => (
              <article
                key={title}
                className="rounded-[16px] border border-[#EFF1F4] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(16,23,39,0.22)]"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
                  aria-hidden="true"
                >
                  {icon}
                </span>
                <h3 className="mt-5 text-[17px] font-bold text-[#101727]">{title}</h3>
                <ul className="mt-4 space-y-2.5">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[14px] text-[#606977]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#0C7BB3]" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Platform advantages */}
      <section className="bg-white py-16 lg:py-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <SectionHeading
            eyebrow={
              <Eyebrow
                icon={<Star className="h-[13px] w-[13px]" />}
                label="Platform Advantages"
                className="border-[#059669]/20 bg-[#F0FDF4] text-[#059669]"
              />
            }
            title={
              <>
                Why Top E-Commerce Brands
                <br className="hidden sm:block" /> Choose Creatrend
              </>
            }
          >
            A seamless, end-to-end platform that takes the headache out of sourcing, managing, and
            launching UGC campaigns.
          </SectionHeading>

          <div className="mx-auto mt-12 grid max-w-[1240px] grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {ADVANTAGES.map(({ title, icon, iconClass, body }) => (
              <article
                key={title}
                className="rounded-[16px] border border-[#EFF1F4] bg-white p-6 shadow-[0_18px_40px_-30px_rgba(16,23,39,0.22)] sm:p-7"
              >
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
                  aria-hidden="true"
                >
                  {icon}
                </span>
                <h3 className="mt-5 text-[17px] font-bold leading-snug text-[#101727]">{title}</h3>
                <p className="mt-3 text-[14px] leading-[1.85] text-[#606977]">{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Closing call to action */}
      <section className="bg-white pb-16 lg:pb-24">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-8 lg:px-12">
          <div className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#0A5A93] via-[#0C7BB3] to-[#2094CE] px-6 py-14 text-center text-white sm:px-10 lg:px-16 lg:py-20">
            <span
              className="pointer-events-none absolute -right-16 -top-24 h-64 w-64 rounded-full bg-white/10"
              aria-hidden="true"
            />
            <span
              className="pointer-events-none absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-white/10"
              aria-hidden="true"
            />

            <div className="relative mx-auto max-w-[720px]">
              <span
                className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"
                aria-hidden="true"
              >
                <TrendingUp className="h-6 w-6" />
              </span>

              <h2 className="mt-6 text-[28px] font-bold leading-[1.2] tracking-[-0.02em] sm:text-[38px] lg:text-[44px]">
                Ready to Lower Your CAC and Scale?
              </h2>

              <p className="mt-5 text-[15px] leading-[1.8] text-white/90 sm:text-[16px]">
                Transform your e-commerce storefront with authentic, conversion-focused video assets. Join
                the brands on Shopify, Amazon, and Takealot already winning with Creatrend.
              </p>

              <div className="mt-9 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-center">
                <button
                  type="button"
                  onClick={() => navigate("/signup")}
                  className="group inline-flex h-12 w-full items-center justify-center gap-2 whitespace-nowrap rounded-full bg-white pl-4 pr-1 text-[12px] font-semibold text-[#0C7BB3] transition-colors hover:bg-[#F7F8F9] focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C7BB3] sm:w-fit sm:justify-between sm:pl-6 sm:text-[16px]"
                >
                  <span className="min-w-0">Create Your Brand Account Today</span>
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0C7BB3] text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/case-studies")}
                  className="inline-flex h-12 w-full items-center justify-center rounded-full border border-white/60 px-8 text-[15px] font-medium text-white transition-colors hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0C7BB3] sm:w-fit"
                >
                  Explore Our Work
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
