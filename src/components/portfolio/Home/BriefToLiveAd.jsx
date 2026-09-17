import { ClipboardList, Sparkles, Lock, Video, CheckCircle2, Send, Clock } from "lucide-react";
import SectionHead from "./SectionHead";

const STEPS = [
  { icon: ClipboardList, title: "Brief", body: "Describe your product, audience, and creative direction", time: "5 minutes" },
  { icon: Sparkles, title: "Match", body: "AI suggests vetted creators who fit your brand", time: "Instant" },
  { icon: Lock, title: "Book", body: "Select creator, deposit funds to TradeSafe escrow", time: "2 minutes" },
  { icon: Video, title: "Create", body: "Creator films and uploads your UGC video", time: "3–5 days" },
  { icon: CheckCircle2, title: "Approve", body: "Review, request revision, or approve", time: "24–48 hours" },
  { icon: Send, title: "Deploy", body: "Download files or push directly to Meta/TikTok Ads Manager", time: "Instant" },
];

export default function BriefToLiveAd() {
  return (
    <div className="bg-[#F9FAFB] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <SectionHead eyebrow="The Process" subtitle="Six steps. As fast as 5 days total.">
          From Brief to <span className="text-[#0c7bb3]">Live Ad</span>
        </SectionHead>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <article key={step.title} className="relative rounded-2xl border border-[#E7E9EC] bg-white p-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#E8F3F9] text-[#0c7bb3]">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-lg font-semibold tracking-[-0.01em] text-[#1A1A1A]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[#64748A]">{step.body}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-[#CFE6F2] px-3 py-1.5 text-xs font-medium text-[#0c7bb3]">
                  <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                  {step.time}
                </span>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
