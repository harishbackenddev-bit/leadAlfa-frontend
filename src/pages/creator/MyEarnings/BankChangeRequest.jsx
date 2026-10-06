import React, { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Check,
  ClipboardCheck,
  Info,
  Landmark,
  LockKeyhole,
  MailCheck,
  Send,
  ShieldCheck,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { useAppSelector } from "../../../store/hooks";
import { selectUser } from "../../../store/slices/authSlice";
import {
  BackLink,
  Pill,
  SUPPORT_EMAIL,
  card,
  fullName,
} from "../MyEarnings/components/earnings";
import {
  getTradeSafeStatus,
  requestBankAccountChange,
} from "../../../services/api/apiservices";

const REASONS = [
  "I need to use a different payout account",
  "My bank details have changed",
  "My current account was closed",
  "Other",
];

const input =
  "w-full rounded-lg border border-[#e2e8f0] bg-white px-3 text-[13px] text-[#101727] focus:outline-none focus:border-[#0c7bb3]";
const label = "block text-xs font-semibold text-[#101727] mb-2";
const hint = "text-[11px] leading-normal text-[#606977] mt-2";

const NEXT_STEPS = [
  [Send, "Submit your request", "Your request is sent to the admin team."],
  [
    ClipboardCheck,
    "Review & verification",
    "We'll contact you for any required information through a secure process.",
  ],
  [
    MailCheck,
    "Receive confirmation",
    "An account change is only applied after review and confirmation.",
  ],
];

const maskName = (name) =>
  name
    .split(" ")
    .map((w) => w[0] + "•".repeat(Math.max(w.length - 1, 4)))
    .join(" ");

function Notice() {
  return (
    <p className="flex gap-3 items-start rounded-lg bg-[#eaf6fb] p-4 text-[13px] leading-[1.6] text-[#101727]">
      <Info size={18} className="shrink-0 text-[#0c7bb3] mt-0.5" />
      To change your payout account, please submit a request. Your current
      account will remain active until the change is confirmed.
    </p>
  );
}

// 🔥 Displays TradeSafe User ID as the account identifier
function AccountRow({ tradeSafeUserId, children }) {
  return (
    <div className="flex gap-3 items-center">
      <span className="size-9 shrink-0 rounded-lg bg-white text-[#0c7bb3] flex items-center justify-center">
        <Landmark size={18} />
      </span>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-[#101727]">
          TradeSafe Verified Account
        </p>
        <p className="text-xs text-[#606977] mt-1 font-mono">
          ID: {tradeSafeUserId || "—"}
        </p>
      </div>
      {children}
    </div>
  );
}

export default function BankChangeRequest() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const [tradeSafeData, setTradeSafeData] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);

  // 🔥 Submit states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const [form, setForm] = useState({
    reason: REASONS[0],
    details: "",
    email: user?.profile?.email || user?.email || "",
  });

  const set = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  // ---------- Fetch TradeSafe status ----------
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoadingAccount(true);
        const res = await getTradeSafeStatus();
        const data = res?.data || res;

        if (data) {
          setTradeSafeData(data);
          setIsRegistered(Boolean(data.registered));
        }
      } catch (err) {
        console.error("Failed to load TradeSafe status:", err);
      } finally {
        setLoadingAccount(false);
      }
    };

    fetchStatus();
  }, []);

  // ---------- Submit (API-integrated) ----------
  const submit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    if (!form.reason) {
      setSubmitError("Please select a reason");
      return;
    }
    if (!form.details || form.details.length < 10) {
      setSubmitError("Additional information must be at least 10 characters");
      return;
    }
    if (!form.email) {
      setSubmitError("Email is required");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await requestBankAccountChange({
        reason: form.reason,
        details: form.details,
        email: form.email,
        tradeSafeUserId: tradeSafeData?.tradeSafeUserId,
      });

      const data = res?.data || res;

      if (data?.success === false) {
        throw new Error(data?.message || "Request failed");
      }

      navigate("submitted", {
        state: {
          ...form,
          requestId: data?.requestId || null,
          submittedAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error("Change request error:", err);
      setSubmitError(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to submit request. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // ---------- LOADING ----------
  if (loadingAccount) {
    return (
      <div className="min-h-screen bg-[#f7f9fb]">
        <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-16 py-6 lg:py-8 flex flex-col gap-6">
          <BackLink to="/creator/earnings">Back to My Earnings</BackLink>
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[#0c7bb3]" />
          </div>
        </div>
      </div>
    );
  }

  // ---------- NOT REGISTERED ----------
  if (!isRegistered) {
    return (
      <div className="min-h-screen bg-[#f7f9fb]">
        <div className="max-w-[840px] mx-auto px-4 sm:px-6 py-6 lg:py-8">
          <BackLink to="/creator/earnings">Back to My Earnings</BackLink>

          <div className={`${card} mt-6 p-6 sm:p-8 flex flex-col gap-6`}>
            <div className="flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <div>
                <p className="font-semibold">No Payout Account Found</p>
                <p className="text-yellow-700">
                  You don't have a registered payout account yet. Please
                  register a bank account first before requesting a change.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t border-[#e2e8f0] pt-6">
              <Link
                to="/creator/earnings"
                className="flex items-center h-10 px-4 rounded-lg border border-[#e2e8f0] bg-white text-[13px] font-semibold text-[#101727]"
              >
                Cancel
              </Link>
              <Link
                to="/creator/earnings/bank-accounts"
                className="main-btn flex items-center gap-2 h-10 px-4 rounded-lg text-[13px] font-semibold text-white"
              >
                Register Payout Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------- REGISTERED ----------
  const tradeSafeUserId = tradeSafeData?.tradeSafeUserId;

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-16 py-6 lg:py-8 flex flex-col gap-6">
        <BackLink to="/creator/earnings">Back to My Earnings</BackLink>

        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-[#101727]">
            Request Bank Account Change
          </h1>
          <p className="text-sm text-[#606977] mt-1.5">
            Tell us what you need to change. Our admin team will review your
            request before any banking update.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px] xl:grid-cols-[minmax(0,1fr)_368px] items-start">
          <form
            onSubmit={submit}
            className={`${card} p-5 sm:p-7 flex flex-col gap-6`}
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-[#101727]">
                Request details
              </h2>
              <Pill tone="blue">Admin review required</Pill>
            </div>

            <Notice />

            <div>
              <p className={label}>Account this request relates to</p>
              <p className="flex items-center gap-2.5 min-h-[42px] rounded-lg border border-[#e2e8f0] bg-[#f8fafc] px-3 text-[13px] text-[#606977]">
                <span className="flex-1 font-mono">
                  TradeSafe Verified · ID: {tradeSafeUserId || "—"} · Active
                  payout account
                </span>
                <LockKeyhole size={15} className="shrink-0" />
              </p>
            </div>

            <div>
              <label htmlFor="reason" className={label}>
                Reason for change *
              </label>
              <select
                id="reason"
                required
                value={form.reason}
                onChange={set("reason")}
                className={`${input} h-[42px]`}
              >
                {REASONS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="details" className={label}>
                Additional information *
              </label>
              <textarea
                id="details"
                required
                minLength={10}
                rows={4}
                value={form.details}
                onChange={set("details")}
                placeholder="For example: I would like future payouts to go to a different account in my name."
                className={`${input} py-3 leading-normal resize-y`}
              />
              <p className={hint}>
                Describe your request. Do not include full account numbers, PINs
                or passwords.
              </p>
            </div>

            <div>
              <label htmlFor="email" className={label}>
                Contact email *
              </label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={set("email")}
                className={`${input} h-[42px]`}
              />
              <p className={hint}>
                We'll use this email to follow up and confirm next steps.
              </p>
            </div>

            {/* 🔥 Error display */}
            {submitError && (
              <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>{submitError}</p>
              </div>
            )}

            <label className="flex gap-2.5 items-start text-xs leading-[1.6] text-[#101727] cursor-pointer">
              <input
                type="checkbox"
                required
                className="size-[18px] mt-0.5 shrink-0 accent-[#0c7bb3]"
              />
              I understand that this is a request for review, not an immediate
              account change. My current payout account will remain active until
              the change is confirmed.
            </label>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e2e8f0] pt-6">
              <Link
                to="/creator/earnings"
                className="flex items-center h-10 px-4 rounded-lg border border-[#e2e8f0] bg-white text-[13px] font-semibold text-[#101727]"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className="main-btn flex items-center gap-2 h-10 px-4 rounded-lg text-[13px] font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    Submit request for review
                  </>
                )}
              </button>
            </div>
          </form>

          <aside className="flex flex-col gap-5">
            <div className={`${card} shadow-none p-5 flex flex-col gap-4`}>
              <p className="text-[15px] font-bold text-[#101727]">
                Your current payout account
              </p>
              <div className="rounded-lg border border-[#cfe7f2] bg-[#eaf6fb] p-4 flex flex-col gap-3.5 items-start">
                <AccountRow tradeSafeUserId={tradeSafeUserId} />
                <Pill tone="blue">Active payout account</Pill>
              </div>
              <p className="text-xs leading-[1.6] text-[#606977]">
                This account stays active while your request is being reviewed.
                All saved accounts remain preserved.
              </p>
            </div>

            <div className={`${card} shadow-none p-5 flex flex-col gap-5`}>
              <p className="text-[15px] font-bold text-[#101727]">
                What happens next?
              </p>
              {NEXT_STEPS.map(([Icon, title, copy]) => (
                <div key={title} className="flex gap-3 items-start">
                  <Icon size={18} className="shrink-0 text-[#0c7bb3]" />
                  <div className="text-xs">
                    <p className="font-bold text-[#101727]">{title}</p>
                    <p className="leading-[1.6] text-[#606977] mt-1.5">
                      {copy}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// SUBMITTED VIEW
// ============================================================
export function BankChangeSubmitted() {
  const { state } = useLocation();
  const user = useAppSelector(selectUser);

  const [tradeSafeData, setTradeSafeData] = useState(null);
  const [loadingAccount, setLoadingAccount] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        setLoadingAccount(true);
        const res = await getTradeSafeStatus();
        const data = res?.data || res;
        if (data) {
          setTradeSafeData(data);
        }
      } catch (err) {
        console.error("Failed to load TradeSafe status:", err);
      } finally {
        setLoadingAccount(false);
      }
    };
    fetchStatus();
  }, []);

  if (!state)
    return (
      <Navigate
        to="/creator/earnings/bank-accounts/change-request"
        replace
      />
    );

  const summary = [
    [
      "Submitted",
      new Date(state.submittedAt).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    ],
    ["Reason", state.reason],
    ["Status", <span className="text-[#0c7bb3]">Pending admin review</span>],
  ];

  const tradeSafeUserId = tradeSafeData?.tradeSafeUserId;

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <div className="max-w-[840px] mx-auto px-4 sm:px-6 py-6 lg:py-8">
        <div className={`${card} p-5 sm:p-8 flex flex-col gap-6`}>
          <div className="flex flex-col items-center gap-4 text-center">
            <span className="size-14 rounded-full bg-[#eaf6fb] text-[#0c7bb3] flex items-center justify-center">
              <Check size={28} />
            </span>
            <div>
              <h1 className="text-[24px] sm:text-[28px] font-bold text-[#101727]">
                Your request has been submitted
              </h1>
              <p className="text-sm leading-[1.6] text-[#606977] mt-2.5">
                The admin team will review your bank account change request.
                We'll contact you at{" "}
                <span className="font-semibold text-[#101727]">
                  {state.email}
                </span>{" "}
                with the next steps.
              </p>
            </div>
            <Pill tone="blue">Pending admin review</Pill>
          </div>

          <Notice />

          <div className="flex flex-col gap-4">
            <p className="text-[15px] font-bold text-[#101727]">
              Request summary
            </p>
            <dl className="flex flex-col gap-4 text-xs">
              {summary.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4">
                  <dt className="text-[#606977]">{k}</dt>
                  <dd className="font-semibold text-[#101727] text-right">
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {!loadingAccount && tradeSafeUserId && (
            <div className="flex flex-col gap-3.5 border-t border-[#e2e8f0] pt-6">
              <p className="text-[15px] font-bold text-[#101727]">
                Your current account is still active
              </p>
              <div className="rounded-lg border border-[#cfe7f2] bg-[#eaf6fb] p-4 flex flex-col gap-3.5">
                <AccountRow tradeSafeUserId={tradeSafeUserId}>
                  <span className="hidden sm:block">
                    <Pill tone="blue">Active payout account</Pill>
                  </span>
                </AccountRow>
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[11px] text-[#606977]">
                      Account holder
                    </p>
                    <p className="text-xs text-[#101727] mt-1">
                      {maskName(fullName(user) || "Account holder")}
                    </p>
                  </div>
                  <span className="flex items-center gap-1.5 text-[11px] text-[#606977]">
                    <LockKeyhole size={13} />
                    Read-only
                  </span>
                </div>
              </div>
              <p className="flex gap-2.5 items-start text-xs leading-[1.6] text-[#606977]">
                <ShieldCheck size={18} className="shrink-0 text-[#0c7bb3]" />
                No banking or payout changes have been applied. Your existing
                saved accounts remain preserved, and your current account stays
                active until a change is confirmed.
              </p>
            </div>
          )}

          <div className="border-t border-[#e2e8f0] pt-6">
            <p className="text-[15px] font-bold text-[#101727]">
              What happens next?
            </p>
            <p className="text-[13px] leading-[1.6] text-[#606977] mt-2.5">
              We'll review your request and explain how to provide any required
              details securely. You can continue using your account while the
              request is pending.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/creator/earnings"
              className="main-btn flex items-center h-10 px-4 rounded-lg text-[13px] font-semibold text-white"
            >
              Back to My Earnings
            </Link>
            <a
              href={`mailto:${SUPPORT_EMAIL}?subject=Bank%20account%20change%20request`}
              className="flex items-center h-10 px-4 rounded-lg border border-[#e2e8f0] bg-white text-[13px] font-semibold text-[#101727]"
            >
              Contact support
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}