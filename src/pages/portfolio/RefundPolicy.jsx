export default function RefundPolicy() {
  const listClass = "list-disc ml-5 mt-6 space-y-4 text-[#444A46] text-[12px] leading-6";

  return (
    <div className='px-10 py-15 md:px-20 '>
      <h1 className='text-3xl font-semibold'>Creatrend Refund and Return Policy</h1>

      <section className='mt-10'>
        <h2 className='text-2xl font-semibold'>1. Brand Subscriptions and Cancellations</h2>
        <ul className={listClass}>
          <li><strong>Cancellation Process:</strong> Brands may cancel their monthly subscription at any time via their dashboard.</li>
          <li><strong>Billing Cycle:</strong> Upon cancellation, your access to the platform will remain active until the end of your current billing month.</li>
          <li><strong>No Subscription Refunds:</strong> Creatrend does not offer refunds for partially used subscription months.</li>
        </ul>
      </section>

      <section className='mt-10'>
        <h2 className='text-2xl font-semibold'>2. Brand Product Gifting (&quot;Seeding&quot;)</h2>
        <ul className={listClass}>
          <li><strong>Non-Returnable Gifts:</strong> Once a brand sends a product to a creator for a seeding campaign, it is considered a non-returnable gift.</li>
          <li><strong>No Returns for Content Preferences:</strong> Brands cannot ask for a product back simply because they do not like the video or content produced by the creator. You are paying for the possibility of coverage, not purchasing a guaranteed media slot.</li>
          <li><strong>No Obligation Refunds:</strong> Because no cash changes hands in a seeding campaign, creators are under no legal obligation to post, which is a recognised risk of the gifting model.</li>
        </ul>
      </section>

      <section className='mt-10'>
        <h2 className='text-2xl font-semibold'>3. Paid Campaigns and Escrow Protection</h2>
        <ul className={listClass}>
          <li><strong>Pay for Results:</strong> For cash campaigns, Creatrend utilises a secure escrow system, meaning brands only pay for results.</li>
          <li><strong>Payment Release:</strong> Funds held in escrow are only released to the creator 7 days after the content is uploaded, and the Brand approves it.</li>
        </ul>
      </section>

      <section className='mt-10'>
        <h2 className='text-2xl font-semibold'>4. Creator Product Issues and Replacements</h2>
        <ul className={listClass}>
          <li><strong>Damaged Goods or Allergies:</strong> If a product arrives broken, or if a creator experiences an allergic reaction, the creator must notify Creatrend within 48 hours of delivery.</li>
          <li><strong>Replacement Process:</strong> In the event of damage or a reaction, Creatrend will contact the Brand to either send a replacement product or cancel the campaign entirely. Creators will not be penalised for this.</li>
          <li><strong>Unwanted Products:</strong> If a creator honestly dislikes a product upon receiving it, they are encouraged not to fake a positive review; in some cases, the creator may be asked to return the product to the brand or simply not post.</li>
        </ul>
      </section>

      <section className='mt-10'>
        <h2 className='text-2xl font-semibold'>5. &quot;Ghosting&quot; and Unreturned Products</h2>
        <ul className={listClass}>
          <li><strong>Financial Penalties for Creators:</strong> If a creator receives a product and vanishes without posting or communicating (&quot;ghosting&quot;), Creatrend reserves the right to invoice the creator for the retail value of the stolen product.</li>
        </ul>
      </section>
    </div>
  );
}
