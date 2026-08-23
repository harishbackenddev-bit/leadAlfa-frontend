import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SectionHead from "./SectionHead";
import ActionButton from "../../common/ActionButton";

// Questions are from the Figma design; the accordion answers are collapsed in
// the design, so these are written from the facts stated elsewhere on the page.
const FAQS = [
  {
    q: "How much does a UGC video cost?",
    a: "A 15-second UGC video starts at R1,250. You pay per video with a flat 5% platform fee — no subscriptions, retainers, or minimum spend. Test one video, then scale when it works.",
  },
  {
    q: "How is this different from local influencer agencies?",
    a: "Agencies lock you into retainers, opaque quotes, and 2–4 week timelines. Creatrend is self-serve: browse creators for free, book in minutes, and get ad-ready content in 3–7 days for a flat 5% fee.",
  },
  {
    q: "Do I own the content?",
    a: "Yes. Every video includes full commercial usage rights and whitelisting-ready formats (9:16, 1:1, 16:9). You get the raw files plus the edited cut to run as ads, post organically, or use anywhere.",
  },
  {
    q: "What if I don't like the video?",
    a: "Every booking includes a revision round — review the content, request one revision, or approve it. Your funds stay secured in TradeSafe escrow until you approve, so you only pay for work you're happy with.",
  },
  {
    q: "Can global brands use Creatrend?",
    a: "Yes. Local brands pay in ZAR and global brands can pay in USD. Our South African creators deliver local cultural authenticity with global brand standards.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="bg-[#F9FAFB] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-3xl">
        <SectionHead eyebrow="FAQs">
          Frequently Asked <span className="text-[#0c7bb3]">Questions</span>
        </SectionHead>

        <div className="mt-12 space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.q} className="overflow-hidden rounded-xl border border-[#E7E9EC] bg-white">
                <h3>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left text-[15px] font-medium text-[#111827] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c7bb3] sm:px-6"
                  >
                    {faq.q}
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F1F3F5] text-[#64748A]">
                      {isOpen ? <Minus className="h-4 w-4" aria-hidden="true" /> : <Plus className="h-4 w-4" aria-hidden="true" />}
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <p className="px-5 pb-5 text-sm leading-relaxed text-[#64748A] sm:px-6">{faq.a}</p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-400">Still have questions?</p>
          <ActionButton
            label="Book A Call"
            onClick={() => navigate("/book-a-call")}
            className="mx-auto mt-4"
          />
        </div>
      </div>
    </div>
  );
}
