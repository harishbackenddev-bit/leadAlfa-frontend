import image from "../../assets/images/portfolio/faq/image.jpg";
import DetailCard from "../../components/common/DetailCard";
import CTASection from "../../components/portfolio/Home/CTASection";
import FAQItem from "../../components/portfolio/main/FAQItem";

export default function FAQBrand() {
  const faqSections = [
    {
      category: "How It Works & Pricing",
      faqs: [
        {
          question: "Is this an agency?",
          answer:
            "No, we are a self-service technology platform. Think of us as a dating app for brands and creators. We provide the tools, data, and connections, but you manage the relationship directly. If you need a fully managed service (where we do everything for you), please contact our Enterprise team.",
        },
        {
          question: "What is the difference between the 'Growth' and 'Scale' plans?",
          answer:
            "Growth (R999/m): Best for small businesses wanting to send 5-10 gifts a month to build awareness. You get basic organic reposting rights. Scale (R2,499/m): Best for brands that want to run ads. You get Commercial Usage Rights (downloadable files), unlimited creator chats, and bulk-invite tools to manage 50+ creators at once.",
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer:
            "Yes. You can cancel via your dashboard. Your access will remain active until the end of your current billing month. We do not offer refunds for partially used months.",
        },
      ],
    },
    {
      category: "Gifting & Logistics (The 'Seeding' Model)",
      faqs: [
        {
          question: "Do I have to pay the creator if I send a gift?",
          answer:
            "No. In a 'Seeding' campaign, the product is the payment. However, because no cash changes hands, the creator is under no legal obligation to post (though 85% do, to maintain their rating).",
        },
        {
          question: "Who pays for shipping?",
          answer:
            "You (the Brand) are responsible for shipping costs. You can use your own courier or generate a Pudo/The Courier Guy locker code through our system.",
        },
        {
          question: "What happens if a creator takes the product and doesn't post ('Ghosting')?",
          answer:
            "This is the risk of gifting. While we cannot legally force a creator to post for a gift, we have a 'Three Strike' policy. If you flag a creator for ghosting, we investigate. Repeated offenders are banned from the platform. Tip: Use our 'Paid Partnership' feature for a binding contract.",
        },
        {
          question: "Can I ask for the product back if I don't like the video?",
          answer:
            "No. Once sent, the product is considered a non-returnable gift. You are paying for the possibility of coverage, not purchasing a media slot.",
        },
      ],
    },
    {
      category: "Paid Campaigns & Commissions",
      faqs: [
        {
          question: "When should I pay cash instead of gifting?",
          answer:
            "1. Strict Deadlines: If you need a post specifically on Black Friday. 2. Specific Deliverables: If you need exactly '1 Reel + 3 Stories with a Link Sticker.' 3. Macro-Influencers: Creators with 50k+ followers rarely work for gifts alone.",
        },
        {
          question: "What is your commission on cash deals?",
          answer:
            "We charge a 20% service fee on top of the creator's rate. Example: Creator charges R1,000. You pay R1,200. We pay the creator R1,000 and keep R200. This covers the escrow service and contract generation.",
        },
        {
          question: "How do invoices work?",
          answer:
            "You make one single payment to our platform. We hold the funds in escrow and pay the creators individually. You receive one tax invoice from us for the total amount, simplifying your bookkeeping.",
        },
      ],
    },
    {
      category: "Content Rights & Usage (Crucial)",
      faqs: [
        {
          question: "Can I use the creator's video in a Facebook/Instagram Ad?",
          answer:
            "On the Growth Plan: No. You only have 'Organic Rights' (reposting to your own timeline). On the Scale Plan: Yes! You have 'Commercial Rights' to download the raw file and run it as a paid ad (Dark Posting) for up to 12 months.",
        },
        {
          question: "Do I own the content forever?",
          answer:
            "No. The creator retains copyright. You are purchasing a license to use it. If you want full ownership (a buyout) to use it on TV or billboards, you must negotiate an additional fee with the creator using the 'Make an Offer' button.",
        },
      ],
    },
    {
      category: "Legal & Safety (South African Context)",
      faqs: [
        {
          question: "Are my products safe?",
          answer:
            "We verify creator identities using ID numbers and mobile verification, but we cannot control what happens after delivery. Liability: Our platform is not liable for lost packages. Please ensure your parcels are with your courier.",
        },
        {
          question: "What about the Consumer Protection Act (CPA)?",
          answer:
            "Our system automatically reminds creators to use #Ad or #Gifted tags. However, as the advertiser, you are ultimately responsible for ensuring your brand complies with the ARB (Advertising Regulatory Board) code. We recommend you check all posts for proper disclosure.",
        },
        {
          question: "Can I dictate exactly what they say?",
          answer:
            "You can provide a 'Mood Board' and 'Key Talking Points,' but you cannot force a creator to say something false. Under the CPA, creators must give their honest opinion. If they hate the product, they are allowed to say so (though most will privately decline to post instead).",
        },
      ],
    },
  ];

  return (
    <>
      <div className="md:h-[5vh]" />
      <section>
        <DetailCard
          title={
            <>
              Have A Question In Mind?{" "}
              <span className="text-[#0c7bb3] block">We're Here To Help</span>{" "}
              You
            </>
          }
          description="For comprehensive details and answers to your questions, we encourage you to explore our Frequently Asked Questions (FAQ) section, where you'll find a wealth of information covering all topics. If you need further assistance or have specific inquiries that aren't addressed, please don't hesitate to reach out to our dedicated support team. The team is available to provide you with personalised support and guidance to ensure you have the best possible experience."
          file={image}
        />
      </section>

      <section className="flex flex-col md:flex-row! gap-10 md:gap-20! px-6 lg:px-24 py-12">
        <h1 className="text-2xl lg:text-4xl font-semibold leading-snug text-gray-900">
          Frequently Asked{" "}
          <span className="text-[#0c7bb3] block">Questions</span>
        </h1>
        <div className="flex-1">
          {faqSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="mb-12">
              <h2 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-6">
                {section.category}
              </h2>
              {section.faqs.map((faq, faqIndex) => (
                <FAQItem
                  key={`${sectionIndex}-${faqIndex}`}
                  initialOpen={sectionIndex === 0 && faqIndex === 0}
                  question={faq.question}
                  answer={faq.answer}
                />
              ))}
            </div>
          ))}
        </div>
      </section>
      <section>
        <CTASection />
      </section>
    </>
  );
}
