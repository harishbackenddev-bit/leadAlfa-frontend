import React, { useEffect, useState } from "react";
import { Megaphone, Shield, Loader2 } from "lucide-react";
import { Button } from "../../../../../components/ui/button";
import { formatRandAmount } from "../../../../../components/campaign/campaignViewUtils";
import {
  CAMPAIGN_CREATE_STEPS,
  CAMPAIGN_CREATE_STEP_COUNT,
} from "../../data/campaignCreateStepsData";
import { getCampaignCreateProgressPercent } from "../../utils/campaignCreatePricingUtils";
import {
  getPaymentMethods,
  generateFundingQuote,
} from "../../../../../services/api/apiservices";

function SummaryRow({ label, value, bold = false, muted = false, hint, highlight = false }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3 text-sm">
        <span
          className={
            muted ? "text-[#64748B]" : highlight ? "font-semibold text-[#0C7BB3]" : "text-[#334155]"
          }
        >
          {label}
        </span>
        <span
          className={`text-right ${
            bold ? "font-semibold text-[#111827]" : highlight ? "font-semibold text-[#0C7BB3]" : "text-[#334155]"
          }`}
        >
          {value}
        </span>
      </div>
      {hint ? <p className="mt-0.5 text-right text-[10px] text-[#94A3B8]">{hint}</p> : null}
    </div>
  );
}

function formatAmountOrDash(amount) {
  if (amount === undefined || amount === null || amount === "") return "—";
  return formatRandAmount(amount) ?? "—";
}

export default function CampaignCreateSidebar({
  currentStep,
  invoice,
  isGiftCampaign = false,
  onPublish,
  onSaveDraft,
  publishLabel = "Publish Campaign",
  isPublishing = false,
  isSaving = false,
  campaignSaved = false,
  campaignPublicId,
  fundingQuote,
  onQuoteChange,
}) {
  const progress = getCampaignCreateProgressPercent(currentStep);
  const stepMeta = CAMPAIGN_CREATE_STEPS[currentStep - 1];
  const selectedAddOnCount = invoice.addOnLines.length;
  const showAmounts = !isGiftCampaign && invoice.hasVideoLength;
  const basePackageHint =
    showAmounts && invoice.numberOfCreators > 1 && invoice.perCreatorRate
      ? `${invoice.numberOfCreators} × ${formatAmountOrDash(invoice.perCreatorRate)}`
      : null;

  // ✅ Payment method state
  const [methods, setMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isLoadingMethods, setIsLoadingMethods] = useState(false);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState(null);

  // Load methods when on review step
  useEffect(() => {
    if (!campaignPublicId || !showAmounts) return;
    if (currentStep < CAMPAIGN_CREATE_STEP_COUNT) return;

    const fetchMethods = async () => {
      try {
        setIsLoadingMethods(true);
        const res = await getPaymentMethods(campaignPublicId);
        const data = res?.data || res;
        setMethods(data?.methods || []);
      } catch (err) {
        console.error("Failed to load payment methods:", err);
        setQuoteError(err?.message || "Failed to load payment methods");
      } finally {
        setIsLoadingMethods(false);
      }
    };

    fetchMethods();
  }, [campaignPublicId, currentStep, showAmounts]);

  // Handle method select
  const handleSelectMethod = async (code) => {
    if (!campaignPublicId) return;

    setSelectedMethod(code);
    setQuoteError(null);
    setIsQuoting(true);

    try {
      const res = await generateFundingQuote(campaignPublicId, code);
      const data = res?.data || res;
      onQuoteChange?.(data);
    } catch (err) {
      setQuoteError(err?.message || "Failed to calculate fee");
      onQuoteChange?.(null);
    } finally {
      setIsQuoting(false);
    }
  };

  const finalTotal =
    showAmounts && invoice.totalDue != null
      ? invoice.totalDue + (fundingQuote?.tradesafeFeeInclVat || 0)
      : invoice.totalDue;

  return (
    <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
      {/* Progress */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#64748B]">Progress</p>
          <span className="text-sm font-semibold text-[#0C7BB3]">{progress}%</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[#E2E8F0]">
          <div className="h-full rounded-full bg-[#0C7BB3] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <p className="mt-3 text-sm text-[#64748B]">
          Step {currentStep} of {CAMPAIGN_CREATE_STEP_COUNT} — {stepMeta?.label}
        </p>
      </div>

      {/* Invoice Summary */}
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <h3 className="text-base font-semibold text-[#111827]">Invoice Summary</h3>
        <p className="mt-1 text-xs text-[#64748B]">
          {isGiftCampaign
            ? "Gift campaigns use premium billing — pricing not shown here"
            : invoice.isFromApi
              ? "Confirmed pricing from your saved campaign"
              : "Estimated from your current selections"}
        </p>

        <div className="mt-4 space-y-3 border-b border-[#E2E8F0] pb-4">
          <div className="grid grid-cols-[1fr_auto] gap-2 text-[10px] font-semibold uppercase tracking-wide text-[#94A3B8]">
            <span>Description</span>
            <span className="text-right">Amount (ZAR)</span>
          </div>
          <SummaryRow
            label="Base Package"
            value={isGiftCampaign ? "—" : showAmounts ? formatAmountOrDash(invoice.baseAmount) : "Select length"}
            hint={basePackageHint}
          />
          <div>
            <SummaryRow
              label="Add-ons"
              value={showAmounts && selectedAddOnCount ? formatAmountOrDash(invoice.addOnsTotal) : "—"}
            />
            {!isGiftCampaign && selectedAddOnCount === 0 ? (
              <p className="mt-1 rounded-lg bg-[#EFF6FF] px-3 py-2 text-xs text-[#0C7BB3]">
                No add-ons selected
              </p>
            ) : !isGiftCampaign && selectedAddOnCount > 0 ? (
              <ul className="mt-1 space-y-1 text-xs text-[#64748B]">
                {invoice.addOnLines.map((line) => (
                  <li key={line.id} className="flex justify-between gap-2">
                    <span>{line.label}</span>
                    <span>{line.amount != null ? formatAmountOrDash(line.amount) : "—"}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>

        <div className="mt-4 space-y-2.5">
          <SummaryRow label="Campaign Budget" value={showAmounts ? formatAmountOrDash(invoice.cartSubtotal) : "—"} muted />
          <SummaryRow label="Platform Fee (5%)" value={showAmounts ? formatAmountOrDash(invoice.serviceFee) : "—"} muted />
          <SummaryRow label="Amount Before Tax" value={showAmounts ? formatAmountOrDash(invoice.amountBeforeTax) : "—"} muted />
          <SummaryRow label="VAT (SARS @ 15%)" value={showAmounts ? formatAmountOrDash(invoice.vat) : "—"} muted />
        </div>

        {/* ✅ PAYMENT METHOD SELECTOR */}
        {showAmounts && currentStep >= CAMPAIGN_CREATE_STEP_COUNT && (
          <div className="mt-4 border-t border-[#E2E8F0] pt-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#64748B]">
              Payment Method
            </p>

            {isLoadingMethods ? (
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading methods...
              </div>
            ) : methods.length === 0 ? (
              <p className="text-xs text-gray-500">No payment methods available.</p>
            ) : (
              <div className="space-y-2">
                {methods.map((method) => (
                  <label
                    key={method.code}
                    className={`flex items-center gap-2 rounded-lg border p-2.5 cursor-pointer transition ${
                      selectedMethod === method.code
                        ? "border-[#0C7BB3] bg-[#EFF6FF]"
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.code}
                      checked={selectedMethod === method.code}
                      onChange={() => handleSelectMethod(method.code)}
                      className="h-3.5 w-3.5 text-[#0C7BB3]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-gray-900 truncate">{method.label}</p>
                      <p className="text-[10px] text-gray-500">
                        {(method.rateExVat * 100).toFixed(2)}% ex VAT
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {quoteError && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700">
                {quoteError}
              </div>
            )}

            {isQuoting && (
              <div className="mt-3 flex items-center gap-2 text-xs text-gray-500">
                <Loader2 className="h-3 w-3 animate-spin" />
                Calculating TradeSafe fee...
              </div>
            )}
          </div>
        )}

        {/* ✅ TradeSafe Fee */}
        {showAmounts && fundingQuote && (
          <div className="mt-4 space-y-2.5 border-t border-[#E2E8F0] pt-4">
            <SummaryRow
              label={`TradeSafe Escrow & Processing Fee (${fundingQuote.paymentMethodLabel || ""})`}
              value={formatAmountOrDash(fundingQuote.tradesafeFeeInclVat)}
              highlight
            />
            <p className="pt-1 text-[10px] leading-relaxed text-[#64748B]">
              {(fundingQuote.tradesafeRateExVat * 100).toFixed(2)}% ex VAT — Official TradeSafe rate.
            </p>
          </div>
        )}

        {/* Total */}
        <div className="mt-4 rounded-xl bg-[#EFF6FF] px-4 py-3">
          <SummaryRow label="Total Amount Due" value={showAmounts ? formatAmountOrDash(finalTotal) : "—"} bold />
        </div>

        {!isGiftCampaign ? (
          <p className="mt-3 text-[11px] leading-relaxed text-[#94A3B8]">
            {invoice.isFromApi
              ? "Totals include all creators and match the server invoice."
              : "Estimate includes creator count. Save on Step 5 to confirm with the server."}
          </p>
        ) : null}

        <Button
          type="button"
          onClick={onPublish}
          disabled={
            isPublishing ||
            isSaving ||
            currentStep < CAMPAIGN_CREATE_STEP_COUNT ||
            (!isGiftCampaign &&
              currentStep >= CAMPAIGN_CREATE_STEP_COUNT &&
              (!campaignSaved || !fundingQuote?.paymentMethod))
          }
          className="mt-5 h-11 w-full rounded-xl bg-[#93C5FD] text-white hover:bg-[#60A5FA] disabled:opacity-60"
          title={!fundingQuote?.paymentMethod ? "Please select a payment method" : ""}
        >
          <Megaphone className="mr-2 h-4 w-4" />
          {isPublishing ? "Publishing..." : publishLabel}
        </Button>

        <button
          type="button"
          onClick={onSaveDraft}
          disabled={isSaving}
          className="mt-3 w-full text-center text-sm font-medium text-[#64748B] hover:text-[#334155] disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save as Draft"}
        </button>
      </div>

      {!fundingQuote?.paymentMethod ? (
        <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <Shield className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <div>
            <p className="text-sm font-semibold text-amber-900">
              Payment method required
            </p>
            <p className="mt-0.5 text-xs text-amber-800">
              Select a payment method to see the TradeSafe fee and continue
            </p>
          </div>
        </div>
      ) : null}
    </aside>
  );
}