import React from 'react';

export default function LegalComplianceContent() {
  return (
    <div className="bg-white rounded-xl p-4 sm:p-6">
      {/* Privacy Policy Section */}
      <div className="mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
          Privacy Policy - Creatrend
        </h2>
        
        <div className="space-y-4 text-sm text-gray-400 leading-7">
          <p className='pb-4'>
            At Creatrend ("we," "our," or "us"), we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your information when you access or use our platform, including our website and mobile applications. We collect personal information such as your name, email address, contact number, billing information, and profile details, along with any content or media you upload, like images and videos. Additionally, we collect usage data such as your device information, IP address, browser type, pages visited, and engagement statistics. If you connect your social media accounts, we may also collect follower counts and engagement metrics to verify creator profiles.
          </p>
          
          <p className='pb-4'> 
            We use this information to operate and maintain the platform, facilitate collaborations between brands and creators, process payments, resolve disputes, improve our services, and communicate updates, offers, or support information. We may share your data with other users where necessary for collaboration, with service providers who help us run the platform (such as payment processors), or if required by law to protect our rights and the safety of our users.
          </p>
          
          <p className='pb-4'>
            Creatrend uses cookies and similar technologies to enhance user experience and analyze how the platform is used; you can manage cookie settings through your browser. Depending on your jurisdiction, you may have rights to access, correct, delete, or restrict the use of your personal data, and you can contact us at support@leadsalpha.com to exercise those rights.
          </p>
          
          <p className='pb-4'>
            While we implement industry-standard security measures to protect your data, no system can be guaranteed as completely secure. We may occasionally update this Privacy Policy, and we will notify you of any significant changes by posting an updated policy with a new effective date. If you have any questions or concerns about this Privacy Policy, please contact us at support@leadsalpha.com .
          </p>
        </div>
      </div>

      {/* Terms of Use Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">
          Terms of Use – Creatrend
        </h2>
        
        <div className="space-y-4 text-sm text-gray-400 leading-7">
          <p className='pb-4'>
            By creating an account or using Creatrend, you agree to these Terms of Use as well as our Privacy Policy. Creatrend serves as a digital platform connecting three types of users: brands, who can post paid gigs and collaborate with creators; creators, who can discover gigs and produce content; and admins, who oversee platform moderation and support.
          </p>
          
          <p className='pb-4'>
            As a user of Creatrend, you are responsible for providing accurate and current information on your profile, maintaining professional and respectful communication with other users, and ensuring that any content you upload does not violate any laws, infringe on others' rights, or breach our platform policies. You remain the owner of all content you upload, but by posting it on Creatrend, you grant us a non-exclusive license to host, use, and display your content as needed for platform operations.
          </p>
          
          <p className='pb-4'>
            Brands agree to fund gigs they post, and payments may be held in escrow until completion to protect both parties. Creatrend may deduct a platform fee from transactions, with full details provided during payment processing. We reserve the right to suspend or terminate accounts that violate these terms or act in ways that disrupt the platform or harm other users.
          </p>
          
          <p className='pb-4'>
            Creatrend cannot be held responsible for user-generated content, direct interactions between brands and creators, or any damages resulting from platform use. Disputes between users should first be resolved among themselves; if needed, disputes may be escalated to our admin team for review, and our decision may be considered final.
          </p>
          
          <p className='pb-4'>
            We may revise these Terms of Use periodically, and continued use of the platform after changes indicates your acceptance of the updated terms. For questions about these terms or for support, please contact us at support@leadsalpha.com .
          </p>
        </div>
      </div>
    </div>
  );
}
