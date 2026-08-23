export default function SiteNotice() {
  const paragraphClass = "mt-6 text-[#444A46] text-[12px] leading-6";
  const listClass = "list-disc ml-5 mt-6 space-y-2 text-[#444A46] text-[12px] leading-6";

  return (
    <div className="px-10 md:px-20 py-15">
      <h1 className="text-3xl font-semibold">SITE NOTICE / LEGAL MENTIONS</h1>

      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-[#444A46]">1. COMPANY INFORMATION</h2>
        <p className={paragraphClass}>
          In compliance with Section 43 of the Electronic Communications and Transactions Act (ECT
          Act) of 2002, the following information is disclosed:
        </p>
        <ul className={listClass}>
          <li>Legal Name: Creatrend (Pty) Ltd]</li>
          <li>Registration Number: 2025/465256/07</li>
          <li>
            Primary Business Description: Online marketplace facilitating influencer marketing and
            user-generated content (UGC) campaigns.
          </li>
          <li>Website URL: www.creatrend.co.za</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-[#444A46]">2. CONTACT DETAILS</h2>
        <ul className={listClass}>
          <li>General Enquiries: hello@creatrend.co.za</li>
          <li>Support Desk: support@creatrend.co.za</li>
          <li>Telephone: +27 784 558 222</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-[#444A46]">3. PHYSICAL ADDRESS FOR LEGAL SERVICE</h2>
        <ul className={listClass}>
          <li>Physical Address: 79 URBAN SPIN ALWNICK ROAD</li>
          <li>Plumstead, Cape Town, Western Cape, 7800</li>
          <li>Director(s): Sanele P. Mdlalose and Ronald Masuku</li>
          <li>Information Officer: Sanele P. Mdlalose</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-[#444A46]">4. DISCLAIMER OF LIABILITY</h2>
        <ul className={listClass}>
          <li>
            Service Nature: Creatrend acts solely as a technological facilitator between Brands and
            Creators. We are not a party to any direct agreements entered into between users.
          </li>
          <li>
            No Guarantees: While we verify user identities to the best of our ability, we make no
            warranty regarding the quality, safety, or legality of the products offered by Brands or
            the content created by Creators.
          </li>
          <li>
            Use at Own Risk: Your use of this website and reliance on any information on the platform
            are entirely at your own risk. To the extent permitted by law, Creatrend accepts no
            liability for any direct, indirect, incidental, or consequential damages resulting from
            the use of our services.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-[#444A46]">5. EARNINGS &amp; TAX DISCLAIMER</h2>
        <ul className={listClass}>
          <li>
            No Income Guarantee: [Platform Name] does not guarantee that Creators will receive gifts,
            cash campaigns, or any specific level of income.
          </li>
          <li>
            Tax Responsibility: Users (Brands and Creators) are solely responsible for their own tax
            obligations, including VAT and Income Tax, arising from transactions on this site.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-[#444A46]">6. COPYRIGHT &amp; INTELLECTUAL PROPERTY</h2>
        <ul className={listClass}>
          <li>
            Site Content: All text, graphics, user interfaces, visual interfaces, photographs,
            trademarks, logos, and computer code (collectively, "Content") on this site is owned,
            controlled, or licensed by or to Creatrend (PTY) LTD and is protected by copyright and
            trademark laws.
          </li>
          <li>
            User Content: Content uploaded by users remains the property of the respective user,
            subject to the license rights granted in our Terms of Service.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold text-[#444A46]">7. GOVERNING LAW</h2>
        <ul className={listClass}>
          <li>
            This website is controlled, operated, and administered by Creatrend (PTY) LTD from its
            offices within the Republic of South Africa. Access to this website from territories or
            countries where the content or purchase of the products sold on the website is illegal is
            prohibited.
          </li>
          <li>These Terms shall be governed by the laws of the Republic of South Africa.</li>
        </ul>
      </section>
    </div>
  );
}
