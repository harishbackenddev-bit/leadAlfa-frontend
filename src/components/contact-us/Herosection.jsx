import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import {
  MapPin,
  Phone,
  Mail,
  Briefcase,
  Rocket,
  MessageCircle,
  Loader2,
} from "lucide-react";

import {
  CONTACT_RATE_LIMIT_MESSAGE,
  CONTACT_SUCCESS_MESSAGE,
  DEFAULT_INQUIRY_TYPE,
  INQUIRY_TYPE_OPTIONS,
} from "../../constants/contactRequest";
import { submitContactRequest } from "../../services/api/apiservices";
import { selectIsAuthenticated, selectUser } from "../../store/slices/authSlice";
import TurnstileField from "../common/TurnstileField";
import { useTurnstileCaptcha } from "../../hooks/useTurnstileCaptcha";

const contactCards = [
  {
    icon: Briefcase,
    title: "Talk to Sales",
    description: "Ready to start a project? Let's discuss your needs.",
    email: "sales@creatrend.co.za",
    color: "from-blue-50 to-blue-100/50",
  },
  {
    icon: Rocket,
    title: "Join the Team",
    description: "Looking for your next big career move?",
    email: "careers@creatrend.co.za",
    color: "from-purple-50 to-purple-100/50",
  },
  {
    icon: MessageCircle,
    title: "General Inquiries",
    description: "Have a quick question or just want to connect?",
    email: "hello@creatrend.co.za",
    color: "from-teal-50 to-teal-100/50",
  },
];

const SUCCESS_BANNER_DURATION_MS = 10_000;

const EMPTY_FORM = {
  name: "",
  email: "",
  inquiryType: DEFAULT_INQUIRY_TYPE,
  message: "",
};

const buildPrefillFromUser = (user) => {
  if (!user) return EMPTY_FORM;

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();

  return {
    name,
    email: user.email || "",
    inquiryType: DEFAULT_INQUIRY_TYPE,
    message: "",
  };
};

export default function ContactHero() {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const captcha = useTurnstileCaptcha();

  const [formData, setFormData] = useState(EMPTY_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [bannerError, setBannerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const skipPrefillRef = useRef(false);

  useEffect(() => {
    if (skipPrefillRef.current) return;
    if (isAuthenticated && user) {
      setFormData((prev) => ({
        ...prev,
        ...buildPrefillFromUser(user),
      }));
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (!success) return undefined;

    const timer = setTimeout(() => {
      setSuccess(false);
    }, SUCCESS_BANNER_DURATION_MS);

    return () => clearTimeout(timer);
  }, [success]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});
    setBannerError("");
    setSuccess(false);
    captcha.clearCaptchaError();

    if (!captcha.requireCaptchaToken()) {
      return;
    }

    try {
      setSubmitting(true);
      await submitContactRequest(
        captcha.withCaptchaPayload({
          name: formData.name.trim(),
          email: formData.email.trim(),
          inquiryType: formData.inquiryType,
          message: formData.message.trim(),
        })
      );

      setSuccess(true);
      skipPrefillRef.current = true;
      setFormData({ ...EMPTY_FORM });
      captcha.resetTurnstile();
    } catch (err) {
      if (captcha.handleCaptchaApiError(err)) {
        return;
      }
      if (err?.status === 429) {
        setBannerError(err.error || CONTACT_RATE_LIMIT_MESSAGE);
        return;
      }

      if (err?.status === 400 && Array.isArray(err.errors) && err.errors.length) {
        const nextFieldErrors = err.errors.reduce((acc, item) => {
          if (item?.field) {
            acc[item.field] = item.message;
          }
          return acc;
        }, {});
        setFieldErrors(nextFieldErrors);
        return;
      }

      if (err?.status >= 500 || !err?.status) {
        setBannerError("Something went wrong. Please try again later.");
        return;
      }

      setBannerError(err?.error || err?.message || "Unable to send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputClassName = (field) =>
    `w-full min-w-0 max-w-full px-4 py-3.5 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0C7BBC]/20 focus:border-[#0C7BBC] transition-all ${
      fieldErrors[field] ? "border-red-400" : "border-slate-200"
    }`;

  return (
    <section className="max-w-7xl mx-auto w-full min-w-0 overflow-x-clip px-4 py-20 sm:px-6">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6 leading-tight">
          Let's create something
          <span className="block bg-gradient-to-r from-[#0C7BBC] to-[#0a90d8] bg-clip-text text-transparent">
            great together.
          </span>
        </h1>
        <p className="text-lg text-slate-600 leading-relaxed">
          Whether you're looking to scale your business, join our growing team,
          or simply say hello—we'd love to hear from you.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-20">
        {contactCards.map((card, index) => (
          <div
            key={index}
            className="group relative bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:border-[#0C7BBC]/20 overflow-hidden"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            />
            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-[#0C7BBC] to-[#0a90d8] rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                <card.icon className="w-7 h-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
              <p className="text-slate-600 mb-4 leading-relaxed">{card.description}</p>
              <a
                href={`mailto:${card.email}`}
                className="text-[#0C7BBC] hover:text-[#0a5d94] font-medium inline-flex items-center gap-1 group/link"
              >
                {card.email}
                <span className="group-hover/link:translate-x-1 transition-transform duration-200">
                  →
                </span>
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="grid w-full min-w-0 lg:grid-cols-2 gap-8">
        <div className="min-w-0 w-full max-w-full bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Send a Message</h2>

          {bannerError ? (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm flex justify-between gap-3">
              <span>{bannerError}</span>
              <button
                type="button"
                onClick={() => setBannerError("")}
                className="text-red-400 hover:text-red-600 shrink-0"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          ) : null}

          {success ? (
            <div className="mb-5 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">
              {CONTACT_SUCCESS_MESSAGE}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="min-w-0 space-y-5">
            <div className="min-w-0">
              <input
                type="text"
                name="name"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClassName("name")}
                required
                minLength={2}
                maxLength={100}
                disabled={submitting}
              />
              {fieldErrors.name ? (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.name}</p>
              ) : null}
            </div>

            <div className="min-w-0">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClassName("email")}
                required
                maxLength={255}
                disabled={submitting}
              />
              {fieldErrors.email ? (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              ) : null}
            </div>

            <div className="min-w-0">
              <label
                htmlFor="inquiryType"
                className="block text-sm text-slate-700 mb-2 font-medium"
              >
                I am looking to...
              </label>
              <select
                id="inquiryType"
                name="inquiryType"
                value={formData.inquiryType}
                onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                className={`${inputClassName("inquiryType")} appearance-none cursor-pointer`}
                disabled={submitting}
              >
                {INQUIRY_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {fieldErrors.inquiryType ? (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.inquiryType}</p>
              ) : null}
            </div>

            <div className="min-w-0">
              <textarea
                name="message"
                placeholder="Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                rows={5}
                className={`${inputClassName("message")} resize-none`}
                required
                minLength={10}
                maxLength={2000}
                disabled={submitting}
              />
              {fieldErrors.message ? (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.message}</p>
              ) : null}
            </div>

            <TurnstileField captcha={captcha} />

            <button
              type="submit"
              disabled={submitting || !captcha.isCaptchaReady}
              className="w-full py-4 bg-gradient-to-r from-[#0C7BBC] to-[#0a90d8] text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-[#0C7BBC]/25 active:scale-[0.98] transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
                  Sending...
                </>
              ) : (
                "Send Message"
              )}
            </button>
          </form>
        </div>

        <div className="min-w-0 w-full max-w-full bg-white rounded-2xl p-5 sm:p-8 shadow-sm border border-slate-100">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Visit Us</h2>

          <div className="space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 mb-3">Creatrend (PTY) LTD</h3>
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-slate-600">
                <MapPin className="w-5 h-5 text-[#0C7BBC] flex-shrink-0 mt-0.5" />
                <address className="not-italic leading-relaxed">
                  <span className="block">1st Floor</span>
                  <span className="block">Constantia Emporium</span>
                  <span className="block">
                    c/o Ladies Mile & Spaanschemat River Road, Constantia, Cape Town,
                  </span>
                  <span className="block">7806, South Africa</span>
                </address>
              </div>
            </div>

            <div className="relative h-64 w-full max-w-full rounded-xl overflow-hidden border border-slate-200 shadow-sm">
              <iframe
                src="https://maps.google.com/maps?q=Constantia+Emporium,+Ladies+Mile,+Constantia,+Cape+Town,+7806,+South+Africa&hl=en&z=16&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Creatrend Office — Constantia Emporium"
                className="w-full h-full"
              />
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <a
                href="tel:+27784558222"
                className="flex items-center gap-3 text-slate-700 hover:text-[#0C7BBC] transition-colors group"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-[#0C7BBC]/10 transition-colors">
                  <Phone className="w-5 h-5 text-[#0C7BBC]" />
                </div>
                <span>+27 784558222</span>
              </a>
              <a
                href="mailto:hello@creatrend.co.za"
                className="flex items-center gap-3 text-slate-700 hover:text-[#0C7BBC] transition-colors group"
              >
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center group-hover:bg-[#0C7BBC]/10 transition-colors">
                  <Mail className="w-5 h-5 text-[#0C7BBC]" />
                </div>
                <span>hello@creatrend.co.za</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
