import { Check } from "lucide-react";
import SectionHead from "./SectionHead";

const COMPARE_COLUMNS = ["Influencer Agency 1", "Influencer Agency 2", "Influencer Agency 3"];

const COMPARE_ROWS = [
  {
    label: "How you start",
    agencies: ['"Book a demo"', "Free to browse, pay to act", '"Consultation first"'],
    creatrend: "Self-serve — launch in 60 minutes",
  },
  {
    label: "Pricing model",
    agencies: ["Custom quotes, opaque", "R1000–R5000/mo + 10% per deal", "Custom, managed service"],
    creatrend: "5% platform fee, no subscription",
  },
  {
    label: "Typical campaign cost",
    agencies: ["R15,000–R50,000+", "Variable per creator quote", "R20,000+ (enterprise)"],
    creatrend: "From R1,250 per video",
  },
  {
    label: "Time to first content",
    agencies: ["2–4 weeks", "1–2 weeks", "2–3 weeks"],
    creatrend: "3–7 days",
  },
  {
    label: "Usage rights included",
    agencies: ["Negotiated separately", "Per-creator agreement", "Negotiated separately"],
    creatrend: "Ad-ready rights, every video",
  },
  {
    label: "Self-serve or managed",
    agencies: ["Managed only", "Self-serve + subscription", "Managed only"],
    creatrend: "Self-serve, always",
  },
];

const REASONS = [
  {
    title: "No Retainers. No Subscriptions. Just Results.",
    body: "Influencer Agency 2 charges R1000–R5000/month before you book a single creator. Influencer Agency 3 and Influencer Agency 1 require custom proposals and minimum spends.",
    checks: [
      "5% service fee — only when you book",
      "No monthly charges",
      'No "enterprise tier" gatekeeping',
      "SMEs and startups welcome",
    ],
    note: "A 15-sec UGC video starts at R1,250 total. Test one. Scale when it works.",
  },
  {
    title: "Launch Today. Content in 3–7 Days.",
    body: "Influencer Agencies: Brief → Search → Train → Manage → Report. That's weeks. Creatrend's process:",
    steps: [
      "Post your brief (5 minutes)",
      "AI matches you to vetted SA creators",
      "Creator films and uploads",
      "You approve — or request one revision",
      "Download ad-ready content",
    ],
    note: "From brief to asset: 3–7 days. Not 3–7 weeks.",
  },
  {
    title: "Every Video Is Ad-Ready, Rights Included",
    body: 'Most South African agencies deliver "content". Then you discover you can\'t run it as a Spark or Meta Ad without negotiating rights.',
    checks: [
      "Full commercial usage rights",
      "Whitelisting-ready formats (9:16, 1:1, 16:9)",
      "One-click Meta/TikTok ad deployment",
      "Raw files + edited cut",
    ],
    note: "You're not buying content. You're buying a performance asset.",
  },
  {
    title: "South African Creators. Global Brand Standards.",
    body: "Influencer Agency 1 has scale. Influencer Agency 2 has reach. Creatrend has precision.",
    checks: [
      "AI matching on cultural fit — not just demographics",
      "Creators vetted for ad-performance skills",
      "Content optimised for paid social, not organic reach",
      "ZAR pricing for local brands, USD accepted for global ones",
    ],
    note: "We do UGC that drives ROAS.",
  },
  {
    title: 'Transparent Pricing. No "Book a Demo" Black Box.',
    body: "Agencies take 30–50% margins on creator fees. We take 5%. The difference goes back into your ad budget.",
    priceTable: [
      { need: "5 UGC videos for TikTok ads", agency: "R25,000–R50,000 (quote pending)", creatrend: "R3,675–R6,300" },
      { need: "10 videos for A/B testing", agency: "R50,000+ (custom proposal)", creatrend: "R7,350–R12,600" },
      { need: "Monthly UGC retainer", agency: "R30,000–R100,000/month", creatrend: "Pay per video, cancel anytime" },
    ],
  },
];

function NumberBadge({ n }) {
  return (
    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E8F3F9] text-sm font-bold text-[#0c7bb3]">
      {n}
    </span>
  );
}

function NoteBox({ children }) {
  return (
    <div className="mt-5 rounded-lg bg-[#EAF4FA] px-4 py-3 text-sm font-medium leading-relaxed text-[#0c7bb3]">
      {children}
    </div>
  );
}

export default function ProblemComparison() {
  return (
    <div className="bg-[#F9FAFB] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="Why Creatrend" subtitle="They Move Slow. They Cost More. They Hide the Price.">
          The Problem With Traditional <span className="text-[#0c7bb3]">SA Influencer Agencies</span>
        </SectionHead>

        {/* Comparison table */}
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[760px] border-separate border-spacing-0 overflow-hidden rounded-2xl border border-[#E7E9EC] bg-white text-sm">
            <caption className="sr-only">How traditional agencies compare with Creatrend</caption>
            <thead>
              <tr className="bg-[#FBFCFD]">
                <th scope="col" className="px-6 py-5 text-left font-medium text-gray-400" />
                {COMPARE_COLUMNS.map((col) => (
                  <th
                    key={col}
                    scope="col"
                    className="border-l border-[#EEF0F2] px-6 py-5 text-center font-medium text-[#64748A]"
                  >
                    {col}
                  </th>
                ))}
                <th
                  scope="col"
                  className="border-l border-[#EEF0F2] bg-[#EAF4FA] px-6 py-5 text-center font-bold text-[#0c7bb3]"
                >
                  Creatrend
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_ROWS.map((row) => (
                <tr key={row.label} className="border-t border-[#EEF0F2]">
                  <th scope="row" className="border-t border-[#EEF0F2] px-6 py-5 text-left font-semibold text-[#111827]">
                    {row.label}
                  </th>
                  {row.agencies.map((cell, i) => (
                    <td
                      key={i}
                      className="border-l border-t border-[#EEF0F2] px-6 py-5 text-center text-[#64748A]"
                    >
                      {cell}
                    </td>
                  ))}
                  <td className="border-l border-t border-[#EEF0F2] bg-[#EAF4FA] px-6 py-5 text-center font-semibold text-[#0c7bb3]">
                    {row.creatrend}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Why SA Brands Choose Creatrend */}
        <h3 className="mt-16 text-center text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-[#1A1A1A] sm:text-3xl lg:text-[38px]">
          Why SA Brands Choose <span className="text-[#0c7bb3]">Creatrend</span>
        </h3>

        <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REASONS.map((reason, index) => (
            <article
              key={reason.title}
              className={`flex flex-col rounded-2xl border border-[#E7E9EC] bg-white p-6 ${
                index === 4 ? "lg:col-span-2" : ""
              }`}
            >
              <NumberBadge n={index + 1} />
              <h4 className="mt-4 text-lg font-semibold tracking-[-0.01em] text-[#1A1A1A]">{reason.title}</h4>
              <p className="mt-3 text-sm leading-relaxed text-[#64748A]">{reason.body}</p>

              {reason.checks && (
                <ul className="mt-4 space-y-2.5">
                  {reason.checks.map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-[#374151]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#16a34a]" aria-hidden="true" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}

              {reason.steps && (
                <ol className="mt-4 space-y-2.5">
                  {reason.steps.map((item, i) => (
                    <li key={item} className="flex items-center gap-3 text-sm text-[#374151]">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0c7bb3] text-[11px] font-bold text-white">
                        {i + 1}
                      </span>
                      {item}
                    </li>
                  ))}
                </ol>
              )}

              {reason.priceTable && (
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-[420px] border-separate border-spacing-0 overflow-hidden rounded-xl border border-[#E7E9EC] text-sm">
                    <thead>
                      <tr className="bg-[#FBFCFD] text-xs uppercase tracking-wide text-gray-400">
                        <th scope="col" className="px-4 py-3 text-left font-medium">What You Need</th>
                        <th scope="col" className="px-4 py-3 text-center font-medium">Traditional Agency</th>
                        <th scope="col" className="px-4 py-3 text-center font-medium text-[#0c7bb3]">Creatrend</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reason.priceTable.map((r) => (
                        <tr key={r.need} className="border-t border-[#EEF0F2]">
                          <th scope="row" className="border-t border-[#EEF0F2] px-4 py-3 text-left font-medium text-[#111827]">
                            {r.need}
                          </th>
                          <td className="border-t border-[#EEF0F2] px-4 py-3 text-center text-[#e0575a]">{r.agency}</td>
                          <td className="border-t border-[#EEF0F2] px-4 py-3 text-center font-semibold text-[#0c7bb3]">
                            {r.creatrend}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {reason.note && <NoteBox>{reason.note}</NoteBox>}
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
