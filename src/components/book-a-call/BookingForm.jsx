import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ActionButton from "../common/ActionButton";

export default function BookingForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    website: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.warn("Booking form submitted (no endpoint yet)", formData, agreedToTerms);
  };

  return (
    <section className="relative overflow-hidden bg-[#F7F8F9]">
      <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 items-center gap-12 px-6 py-10 sm:px-8 lg:grid-cols-2 lg:px-12 lg:py-16 xl:gap-20">
        <div>
          <h1 className="text-[32px] font-bold leading-[1.18] tracking-[-0.025em] text-[#101727] sm:text-[42px] sm:leading-[1.16] lg:text-[46px]">
            Book A Call
          </h1>

          <p className="mt-6 max-w-[560px] text-[15px] leading-[1.85] text-[#606977] sm:text-[16px]">
            Ready to scale with authentic user-generated content? Book a discovery call with Creatrend&apos;s UGC experts.
          </p>
          <p className="mt-4 max-w-[560px] text-[15px] leading-[1.85] text-[#606977] sm:text-[16px]">
            We&apos;ll walk you through our platform, showcase our solutions in action, and explore how the trust economy can drive your brand&apos;s growth. Here&apos;s what we&apos;ll cover during our chat:
          </p>

          <p className="mt-5 text-sm font-semibold italic text-[#606977]">
            No obligation — just a focused chat with our UGC team.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
            <ActionButton label="Join as a Brand" onClick={() => navigate("/login")} />
            <ActionButton
              label="Explore Case Study"
              onClick={() => navigate("/case-studies")}
              variant="secondary"
              arrow_bg="#0c7bb3"
            />
          </div>
        </div>

        <div className="rounded-3xl border border-gray-100 bg-white p-8 shadow-xl shadow-gray-200/50 lg:p-10">
          <div className="mb-8">
            <h2 className="mb-2 text-[24px] font-bold tracking-[-0.02em] text-[#101727] sm:text-[28px]">Booking form</h2>
            <p className="text-[14px] text-[#606977]">Fill in your details to schedule a call</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#101727]">Your name</label>
              <input
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50/50 px-4 py-3.5 outline-none transition-all focus:border-[#0c7bb3] focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#101727]">Business Email</label>
              <input
                type="email"
                placeholder="john@company.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50/50 px-4 py-3.5 outline-none transition-all focus:border-[#0c7bb3] focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#101727]">Company Name</label>
              <input
                type="text"
                placeholder="Your Company Inc."
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50/50 px-4 py-3.5 outline-none transition-all focus:border-[#0c7bb3] focus:bg-white"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#101727]">Company Website</label>
              <input
                type="url"
                placeholder="https://yourcompany.com"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                className="w-full rounded-xl border-2 border-gray-200 bg-gray-50/50 px-4 py-3.5 outline-none transition-all focus:border-[#0c7bb3] focus:bg-white"
                required
              />
            </div>

            <button
              type="submit"
              className="main-btn mt-6 h-12 w-full rounded-full font-medium transition-colors hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0c7bb3] focus-visible:ring-offset-2"
            >
              Schedule your call
            </button>

            <div className="space-y-3 border-t border-gray-200 pt-4">
              <p className="text-xs leading-relaxed text-[#606977]">
                This call is for brands and agencies only. If you&apos;re a creator, please follow{" "}
                <Link to="/for-creators" className="text-[#0c7bb3] underline hover:opacity-80">
                  All Creators For Free
                </Link>
              </p>
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 h-4 w-4 cursor-pointer rounded border-gray-300 text-[#0c7bb3] focus:ring-[#0c7bb3] focus:ring-offset-0"
                  required
                />
                <span className="text-xs leading-relaxed text-[#606977]">
                  By submitting your email, you agree to be contacted by Creatrend. You reserve the right to unsubscribe at your convenience. View{" "}
                  <Link to="/privacy-policy" className="text-[#0c7bb3] underline hover:opacity-80">Privacy Policy</Link>.
                </span>
              </label>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
