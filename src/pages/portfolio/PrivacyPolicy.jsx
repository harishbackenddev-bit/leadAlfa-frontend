export default function PrivacyPolicy() {
  const paragraphClass = "mt-6 text-[#444A46] text-[12px] leading-6";
  const listClass = "list-disc ml-5 mt-6 space-y-2 text-[#444A46] text-[12px] leading-6";

  return (
    <div className="px-10 md:px-20 py-15">
      <h1 className="text-3xl font-semibold">PRIVACY POLICY</h1>

      <section className="mt-6">
        <h3 className="text-1xl font-semibold">Effective Date: 01 January 2026</h3>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">1. Introduction</h2>
        <p className={paragraphClass}>
          Welcome to Creatrend ("we," "us," or "our"). We respect your privacy and are
          committed to protecting your personal information.
        </p>
        <p className={paragraphClass}>
          This Privacy Policy explains how we collect, use, disclose, and safeguard your information
          when you visit our website [www.yourdomain.co.za] or use our mobile application. This policy
          is drafted in compliance with the Protection of Personal Information Act 4 of 2013 ("POPIA")
          and the Promotion of Access to Information Act 2 of 2000 ("PAIA").
        </p>
        <p className={paragraphClass}>
          By using our Platform, you consent to the data practices described in this statement.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">2. Information Officer</h2>
        <p className={paragraphClass}>
          We have appointed an Information Officer who is responsible for overseeing questions in
          relation to this Privacy Policy.
        </p>
        <ul className={listClass}>
          <li>Name: Sanele Mdlalose</li>
          <li>Email: info@creatrend.co.za</li>
          <li>Physical Address: 79 Urban Spin Alwick Road, Plumstead, Cape Town, Western Cape, 7800</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">3. Information We Collect</h2>
        <p className={paragraphClass}>
          We collect data to facilitate the gifting and payment process between Brands and Creators.
        </p>

        <h3 className="text-1xl font-semibold mt-6">A. From Creators (Influencers)</h3>
        <ul className={listClass}>
          <li>Identity Data: Full name, ID number (for tax/payment purposes), and Date of Birth (to verify you are 18+).</li>
          <li>Contact Data: Email address, mobile number.</li>
          <li>Delivery Data: Physical address or Pudo/PostNet locker location (strictly for receiving gifts).</li>
          <li>Social Media Data: Instagram/TikTok handle, public profile statistics (follower count, engagement rate), and content links.</li>
          <li>Financial Data: Bank account details (for cash payouts).</li>
        </ul>

        <h3 className="text-1xl font-semibold mt-6">B. From Brands (Businesses)</h3>
        <ul className={listClass}>
          <li>Corporate Data: Company name, CIPC registration number, VAT number.</li>
          <li>Contact Data: Representative name, email, phone number.</li>
          <li>
            Payment Data: Credit card or EFT details (processed securely via our third-party payment
            gateway; we do not store raw card numbers).
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">4. How We Collect Information</h2>
        <ul className={listClass}>
          <li>
            Direct Interactions: You provide data by filling in forms during sign-up, updating your
            profile, or applying for campaigns.
          </li>
          <li>
            Automated Technologies: As you interact with our website, we may automatically collect
            Technical Data (IP address, browser type) and Usage Data using cookies and server logs.
          </li>
          <li>
            Third Parties: We may receive data about you from social media platforms (e.g., Meta Graph
            API) when you link your Instagram account.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">5. How We Use Your Information</h2>
        <p className={paragraphClass}>
          We will only use your Personal Information when the law allows us to. Most commonly, we use
          it for:
        </p>
        <ul className={listClass}>
          <li>
            Contractual Performance: To facilitate the agreement between Creator and Brand (e.g.,
            sharing a shipping address so a gift can be delivered).
          </li>
          <li>Payments: To process subscription fees (Brands) or payouts (Creators).</li>
          <li>Legal Compliance: To comply with SARS tax regulations and FICA requirements.</li>
          <li>Platform Security: To verify identities and prevent "ghosting" or fraud.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">6. Disclosure of Your Information</h2>
        <p className={paragraphClass}>
          We do not sell your data. However, we must share specific data to make the marketplace work:
        </p>
        <ul className={listClass}>
          <li>
            To Brands: If a Creator accepts a gifting campaign, we share their Shipping Address and
            Name with the specific Brand for delivery purposes.
          </li>
          <li>
            To Couriers: We share contact details with logistics partners (e.g., The Courier Guy,
            Pudo) to ensure delivery.
          </li>
          <li>To Payment Processors: We share data with Flutterwave to process transactions.</li>
          <li>Legal Authorities: If required by law (e.g., a SARS audit or court order).</li>
        </ul>
        <p className={paragraphClass}>
          Privacy Note for Creators: We do not display your home address publicly on your profile. It
          is only revealed to a Brand after a campaign is confirmed.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">7. International Data Transfers</h2>
        <p className={paragraphClass}>
          Our servers may be located outside South Africa (e.g., Amazon Web Services or Google Cloud
          in the EU/USA).
        </p>
        <ul className={listClass}>
          <li>By using the Platform, you consent to the transfer of your Personal Information to these servers.</li>
          <li>
            We ensure that any cross-border transfer complies with Section 72 of POPIA, ensuring the
            receiving country has adequate data protection laws.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">8. Data Security</h2>
        <p className={paragraphClass}>
          We have implemented appropriate security measures to prevent your personal information from
          being accidentally lost, used, or accessed in an unauthorised way.
        </p>
        <ul className={listClass}>
          <li>We use SSL encryption for all data transmission.</li>
          <li>Access to personal data is limited to employees and contractors who have a business need to know.</li>
          <li>We regularly audit our systems for vulnerabilities.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">9. Data Retention</h2>
        <p className={paragraphClass}>
          We will only retain your personal information for as long as necessary to fulfil the
          purposes we collected it for, including satisfying any legal, accounting, or reporting
          requirements.
        </p>
        <ul className={listClass}>
          <li>Inactive Accounts: Data is archived after [e.g., 24 months] of inactivity.</li>
          <li>Transaction Records: Kept for 5 years as required by South African Tax Law.</li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">10. Your Legal Rights</h2>
        <p className={paragraphClass}>Under POPIA, you have the right to:</p>
        <ul className={listClass}>
          <li>Request Access: You can ask for a copy of the personal information we hold about you.</li>
          <li>Request Correction: You can ask us to correct incomplete or inaccurate data.</li>
          <li>
            Request Deletion: You can ask us to delete your data where there is no good reason for us
            continuing to process it (Note: This may close your account).
          </li>
          <li>Objection: You may object to the processing of your personal information for direct marketing.</li>
        </ul>
        <p className={paragraphClass}>
          To exercise any of these rights, please email us at [privacy@yourdomain.co.za].
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">11. Cookies Policy</h2>
        <p className={paragraphClass}>We use cookies to improve your experience.</p>
        <ul className={listClass}>
          <li>Essential Cookies: Required for the website to function (e.g., keeping you logged in).</li>
          <li>Analytics Cookies: Help us understand how you use the site (e.g., Google Analytics).</li>
          <li>
            You can set your browser to refuse all or some browser cookies, but some parts of this
            website may become inaccessible.
          </li>
        </ul>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">12. Children's Privacy</h2>
        <p className={paragraphClass}>
          Our Platform is not intended for children under the age of 18. We do not knowingly collect
          data from children. If we learn that we have collected personal information from a child
          under 18 without parental consent, we will delete that information immediately.
        </p>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">13. Contact the Regulator</h2>
        <p className={paragraphClass}>
          If you feel that we are not processing your data in accordance with the law, you have the
          right to lodge a complaint with the South African Information Regulator:
        </p>
        <ul className={listClass}>
          <li>
            Website:{" "}
            <a
              href="https://inforegulator.org.za/"
              target="_blank"
              rel="noreferrer"
              className="text-[#1e60db] hover:underline"
            >
              https://inforegulator.org.za/
            </a>
          </li>
          <li>Email: POPIAComplaints@inforegulator.org.za</li>
        </ul>
      </section>
    </div>
  );
}
