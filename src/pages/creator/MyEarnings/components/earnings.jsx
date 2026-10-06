import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export const SUPPORT_EMAIL = "support@creatrend.co.za";

export const zar = (n) => new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR" }).format(n);

export const formatDate = (iso) => new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

export const fullName = (user) =>
  [user?.profile?.firstName || user?.firstName, user?.profile?.lastName || user?.lastName].filter(Boolean).join(" ");

export const initials = (name) => name.split(" ").map((w) => w[0]).join("").slice(0, 2);

const TONES = {
  blue: "bg-[#eaf6fb] text-[#0c7bb3]",
  green: "bg-[#eaf7f0] text-[#16794a]",
  amber: "bg-[#fff6e6] text-[#a35f08]",
  purple: "bg-[#f0eeff] text-[#6d5bd0]",
  red: "bg-[#fff0ee] text-[#b42318]",
};

export function Pill({ tone, children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap ${TONES[tone]}`}>
      <span className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function BackLink({ to, children }) {
  return (
    <Link to={to} className="flex items-center gap-2 w-fit text-sm font-semibold text-[#0c7bb3]">
      <ArrowLeft size={16} />
      {children}
    </Link>
  );
}

export const control = "h-10 rounded-lg border border-[#e2e8f0] px-3 text-[13px] text-[#606977] bg-white focus:outline-none focus:border-[#0c7bb3]";

export const card = "bg-white border border-[#e2e8f0] rounded-xl shadow-[0_8px_24px_rgba(15,23,42,0.04)]";

export const STAGES = {
  awaiting: { label: "Awaiting deliverable", tone: "amber", step: 1 },
  review: { label: "Under brand review", tone: "blue", step: 2 },
  dispute: { label: "Dispute review", tone: "red", step: 2 },
  scheduled: { label: "Release scheduled", tone: "purple", step: 3 },
  released: { label: "Released", tone: "green", step: 4 },
};

export const escrows = [
  {
    ref: "TS-ESC-91384",
    brand: "Glow Labs",
    campaign: "Summer skincare campaign",
    funded: "2026-09-18",
    submitted: "2026-09-23",
    deliverable: "1 reel + usage rights",
    amount: 2400,
    stage: "review",
    release: "Est. 29 Sep · after approval",
    next: "Glow Labs reviews your submission. Release is estimated for 29 Sep after approval and required checks.",
    condition: "Funds may be released after Glow Labs approves the reel and confirms the agreed usage rights. The 29 Sep date is an estimate and may change if review or dispute resolution is needed.",
  },
  {
    ref: "TS-ESC-91302",
    brand: "Ubuntu Mobile",
    campaign: "Heritage Day story set",
    funded: "2026-09-15",
    deliverable: "3-story sequence",
    amount: 1850,
    stage: "awaiting",
    release: "After stories are submitted",
    next: "Submit your 3-story sequence so Ubuntu Mobile can start its review.",
    condition: "Funds may be released after Ubuntu Mobile approves all three stories.",
  },
  {
    ref: "TS-ESC-91176",
    brand: "Cape Routes",
    campaign: "Weekend travel edit",
    funded: "2026-09-11",
    submitted: "2026-09-20",
    deliverable: "Final cut approval",
    amount: 1500,
    stage: "scheduled",
    release: "Est. 30 Sep · processing",
    next: "Cape Routes approved your final cut. TradeSafe is processing the release, estimated for 30 Sep.",
    condition: "The release has been approved and is being processed by TradeSafe. Bank processing times may vary.",
  },
  {
    ref: "TS-ESC-90941",
    brand: "Natura Home",
    campaign: "Autumn product review",
    funded: "2026-09-04",
    submitted: "2026-09-10",
    deliverable: "Review resolution",
    amount: 1000,
    stage: "dispute",
    release: "After TradeSafe review",
    next: "TradeSafe is reviewing a dispute on this deliverable. You will be notified once it is resolved.",
    condition: "Funds stay in escrow until TradeSafe resolves the dispute between you and Natura Home.",
  },
  {
    ref: "TS-ESC-90870",
    brand: "Glow Labs",
    campaign: "Summer skincare campaign",
    funded: "2026-09-02",
    submitted: "2026-09-15",
    deliverable: "Launch reel + 2 stills",
    amount: 4850,
    stage: "released",
    release: "2026-09-24",
    next: "Glow Labs approved your launch reel. The funds were released to your available balance on 24 Sep.",
    condition: "Released after Glow Labs approved the launch reel and stills.",
  },
  {
    ref: "TS-ESC-90655",
    brand: "Cedar & Co.",
    campaign: "Launch reel package",
    funded: "2026-08-28",
    submitted: "2026-09-09",
    deliverable: "2 reels + raw footage",
    amount: 3650,
    stage: "released",
    release: "2026-09-16",
    next: "Cedar & Co. approved your reels. The funds were released to your available balance on 16 Sep.",
    condition: "Released after Cedar & Co. approved both reels and received the raw footage.",
  },
  {
    ref: "TS-ESC-90412",
    brand: "Natura Home",
    campaign: "Product review",
    funded: "2026-08-20",
    submitted: "2026-09-01",
    deliverable: "1 review video",
    amount: 1980,
    stage: "released",
    release: "2026-09-08",
    next: "Natura Home approved your review video. The funds were released to your available balance on 8 Sep.",
    condition: "Released after Natura Home approved the review video.",
  },
];

const TINTS = ["bg-[#e8f3ef]", "bg-[#eaf0fa]", "bg-[#f4ede4]", "bg-[#edf4e7]", "bg-[#f0eeff]"];

export function BrandMark({ name, small }) {
  const tint = TINTS[[...name].reduce((sum, c) => sum + c.charCodeAt(0), 0) % TINTS.length];
  return (
    <span className={`${tint} shrink-0 flex items-center justify-center font-bold text-[#101727] ${small ? "size-7 rounded-md text-[9px]" : "size-9 rounded-lg text-[11px]"}`}>
      {initials(name)}
    </span>
  );
}

export const bankAccounts = [
  { id: 1, bank: "First National Bank", short: "FNB", type: "Cheque / Current account", last4: "4821", verified: true, primary: true, updated: "18 Sep 2026 at 14:32" },
  { id: 2, bank: "Capitec Bank", short: "Capitec", type: "Savings account", last4: "9076", verified: false, primary: false, submitted: "23 Sep 2026" },
];

export const MAX_ACCOUNTS = 3;

export const BANKS = ["Absa", "Capitec", "Discovery Bank", "First National Bank (FNB)", "Nedbank", "Standard Bank", "TymeBank"];
