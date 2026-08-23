import image from "../../assets/images/portfolio/faq/image.jpg";
import DetailCard from "../../components/common/DetailCard";
import CTASection from "../../components/portfolio/Home/CTASection";
import FAQItem from "../../components/portfolio/main/FAQItem";

export default function FAQCreators() {
  const faqSections = [
    {
      category: "Getting Started & Eligibility",
      faqs: [
        {
          question: "Do I need 10,000 followers to join?",
          answer:
            "Not at all! We are a UGC (User Generated Content) marketplace, which means brands value your content quality more than your follower count. Whether you have 500 followers or 50,000, if you can create beautiful, authentic content that fits a brand’s style, you can get hired.",
        },
        {
          question: "Is this only for Instagram?",
          answer:
            "Primarily yes, but TikTok is growing fast. Most brands want Instagram Reels or Stories because they are easy to repost. If you are a TikTok creator, make sure you can deliver that same vertical video style for Instagram.",
        },
        {
          question: "Does it cost money to join?",
          answer:
            "No. Joining the creator database is 100% free. You never pay to apply for campaigns.",
        },
      ],
    },
    {
      category: "Gifting & Logistics (The \"Free Stuff\")",
      faqs: [
        {
          question: "Who pays for the courier/delivery?",
          answer:
            "The Brand covers 100% of the shipping costs. You should never have to pay a courier fee to receive a gift. If a brand asks you to pay for shipping, please report them immediately—that is a common scam.",
        },
        {
          question: "How do I get the product? Do I have to give my home address?",
          answer:
            "Yes, you need to provide a delivery address. To protect your privacy, we only share your address with the specific Brand sending you a gift. If you don't feel safe using your home address, we recommend using a Post Net or Pudo locker address in your profile.",
        },
        {
          question: "What if the product arrives broken, or I am allergic to it?",
          answer:
            "Please let us know within 48 hours of delivery. Do not use a product that causes a reaction! We will contact the Brand to either send a replacement or cancel the campaign. You won't be penalised for this.",
        },
      ],
    },
    {
      category: "The Work: Posting & Content",
      faqs: [
        {
          question: "What exactly do I have to do in exchange for the gift?",
          answer:
            "Every campaign has a \"Brief.\" Usually, it is 1 Instagram Reel or 1-2 Stories tagging the brand. You must keep the post up for at least 7 days. The specific requirements will be clear before you accept the gift.",
        },
        {
          question: "What if I receive the gift and I honestly hate it?",
          answer:
            "Authenticity is key. If you really dislike the product, do not fake a positive review. Instead, message the Brand through our chat immediately. Most brands prefer constructive feedback privately rather than a bad public review. In some cases, you may be asked to return the product or simply not post.",
        },
        {
          question: "Can I delete the post after a week?",
          answer:
            "Generally, we ask you to keep feed posts (photos/Reels) up for at least 30 days. Stories disappear after 24 hours, but we recommend saving them to a Highlight on your profile for better engagement.",
        },
      ],
    },
    {
      category: "Money & Payments (Cash Campaigns)",
      faqs: [
        {
          question: "Can I get paid cash, or is it just products?",
          answer:
            "We offer both! \"Seeding\" Campaigns: You get free products in exchange for content. This is great for building your portfolio. \"Partnership\" Campaigns: You get the product plus a cash fee. These are for creators with a proven track record on our platform.",
        },
        {
          question: "How do I get paid for Cash Campaigns?",
          answer:
            "We pay directly into your South African bank account. We do not use e-wallet or cash send. You must have a valid bank account in your own name.",
        },
        {
          question: "When do I get my money?",
          answer:
            "Payments are released 7 days after you upload your content, and the Brand approves it. This delay is to ensure the post stays live and meets the brief.",
        },
        {
          question: "Do I have to pay tax on gifts?",
          answer:
            "Technically, yes. SARS considers the \"market value\" of gifts received in exchange for services as taxable income. While we don't deduct tax for you (because you are an independent freelancer), we recommend keeping a log of the gifts you receive for your own tax returns.",
        },
      ],
    },
    {
      category: "Usage Rights (The Legal Stuff)",
      faqs: [
        {
          question: "Can the brand use my face on a billboard?",
          answer:
            "Not unless they pay extra! Standard Rule: Brands can repost your video on their social media (Instagram/TikTok) for 12 months. Paid Ads: If a brand wants to use your video for a sponsored ad (where they put money behind it) or on a website/billboard, they must request \"Commercial Rights\" through the platform, which usually involves an extra fee paid to you.",
        },
        {
          question: "What happens if I accept a gift and then \"Ghost\" (don't post)?",
          answer:
            "\"Ghosting\" hurts everyone. If you receive a product and vanish: 1. Your account will be suspended. 2. You will be banned from future campaigns. 3. We reserve the right to invoice you for the retail value of the stolen product. Communication is key—if you are late, just tell us!",
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
              <span className="text-[#0c7bb3] block">We’re Here To Help</span>{" "}
              You
            </>
          }
          description="For comprehensive details and answers to your questions, we encourage you to explore our Frequently Asked Questions (FAQ) section, where you'll find a wealth of information covering all topics. If you need further assistance or have specific inquiries that aren’t addressed, please don’t hesitate to reach out to our dedicated support team. The team is available to provide you with personalised support and guidance to ensure you have the best possible experience."
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
