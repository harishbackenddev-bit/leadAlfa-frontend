import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { formatRandAmount } from "../../../../../../components/campaign/campaignViewUtils";
import CampaignCreateStepCard from "../CampaignCreateShared";
import { CAMPAIGN_CREATE_STEPS } from "../../../data/campaignCreateStepsData";
import { getVideoLengthPackage } from "../../../utils/campaignCreatePricingUtils";
import { CAMPAIGN_ADD_ONS } from "../../../data/campaignCreatePricingData";
import {
  platformOptions,
  locationOptions,
  compensationOptions,
  selectOptions,
} from "../../../campaignFormOptions";
import {
  getPaymentMethods,
  generateFundingQuote,
} from "../../../../../../services/api/apiservices";

const stepMeta = CAMPAIGN_CREATE_STEPS[5];

function ReviewRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1 border-b border-[#F1F5F9] py-3 sm:flex-row sm:justify-between">
      <span className="text-sm text-[#64748B]">{label}</span>
      <span className="text-sm font-medium text-[#111827] sm:max-w-[60%] sm:text-right">
        {value || "—"}
      </span>
    </div>
  );
}

function getOptionLabel(options, value) {
  if (Array.isArray(value)) {
    if (!value.length) return "—";
    if (value.includes("all")) return "All";
    return value
      .map((val) => options.find((opt) => opt.value === val)?.label || val)
      .filter(Boolean)
      .join(", ");
  }
  return options.find((option) => option.value === value)?.label || value || "—";
}

function formatAmountOrDash(amount) {
  if (amount === undefined || amount === null || amount === "") return "—";
  return formatRandAmount(amount) ?? "—";
}

export default function StepReviewPublish({
  formData,
  invoice,
  campaignPublicId,
  fundingQuote,
  onQuoteChange,
}) {
  const videoPkg = getVideoLengthPackage(formData.videoLength);
  const selectedAddOnLabels = CAMPAIGN_ADD_ONS.filter((addon) =>
    (formData.selectedAddOns || []).includes(addon.id)
  ).map((addon) => addon.label);

  // ============================================================
  // ✅ Payment method state
  // ============================================================
  const [methods, setMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [isLoadingMethods, setIsLoadingMethods] = useState(false);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState(null);

  const showAmounts = invoice.hasVideoLength;

  // ============================================================
  // Load available payment methods
  // ============================================================
  useEffect(() => {
    if (!campaignPublicId || !showAmounts) return;

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
  }, [campaignPublicId, showAmounts]);

  // ============================================================
  // Handle payment method select
  // ============================================================
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

  // Final total = invoice total + TradeSafe fee
  const finalTotal =
    showAmounts && invoice.totalDue != null
      ? invoice.totalDue + (fundingQuote?.tradesafeFeeInclVat || 0)
      : invoice.totalDue;

  return (
    <CampaignCreateStepCard title={stepMeta.title} description={stepMeta.description}>
      <div className="space-y-6">
        {/* Campaign Basics */}
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#94A3B8]">
            Campaign Basics
          </h3>
          <ReviewRow label="Campaign Title" value={formData.campaignTitle} />
          <ReviewRow
            label="Deliverables"
            value={getOptionLabel(selectOptions.deliverables, formData.deliverables)}
          />
          <ReviewRow
            label="Platform"
            value={(Array.isArray(formData.platform) ? formData.platform : [formData.platform])
              .filter(Boolean)
              .map((value) => getOptionLabel(platformOptions, value))
              .join(", ")}
          />
          <ReviewRow label="Video Length" value={videoPkg?.duration} />
          <ReviewRow label="Product URL" value={formData.productServiceUrl} />
          <ReviewRow
            label="Compensation"
            value={getOptionLabel(compensationOptions, formData.compensationType)}
          />
          <ReviewRow
            label="Product Status"
            value={getOptionLabel(selectOptions.productStatus, formData.productStatus)}
          />
          <ReviewRow label="Campaign Goal" value={formData.campaignGoal} />
        </section>

        {/* Target Audience */}
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#94A3B8]">
            Target Audience
          </h3>
          <ReviewRow
            label="Age Range"
            value={getOptionLabel(selectOptions.ageRange, formData.ageRange)}
          />
          <ReviewRow
            label="Gender"
            value={getOptionLabel(selectOptions.gender, formData.gender)}
          />
          <ReviewRow
            label="Location"
            value={getOptionLabel(locationOptions, formData.locationCountry)}
          />
          <ReviewRow label="Creators" value={formData.numberOfCreators || "—"} />
          <ReviewRow label="Key Message" value={formData.keyMessage} />
          <ReviewRow label="Campaign Brief" value={formData.campaignBrief} />
        </section>

        {/* Pricing */}
        <section>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#94A3B8]">
            Pricing
          </h3>
          <ReviewRow
            label="Base Package"
            value={invoice.hasVideoLength ? formatRandAmount(invoice.baseAmount) : "—"}
          />
          {invoice.numberOfCreators > 1 && invoice.perCreatorRate ? (
            <ReviewRow
              label="Per Creator Rate"
              value={formatRandAmount(invoice.perCreatorRate)}
            />
          ) : null}
          <ReviewRow
            label="Add-ons"
            value={selectedAddOnLabels.length ? selectedAddOnLabels.join(", ") : "None"}
          />
          <ReviewRow
            label="Campaign Budget"
            value={invoice.hasVideoLength ? formatRandAmount(invoice.cartSubtotal) : "—"}
          />
        </section>

        {/* ============================================================
            ✅ PAYMENT METHOD SECTION (moved from sidebar)
            ============================================================ */}
        {showAmounts && (
          <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#94A3B8]">
              Payment Method
            </h3>

            {isLoadingMethods ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading payment methods...
              </div>
            ) : methods.length === 0 ? (
              <p className="text-sm text-gray-500">No payment methods available.</p>
            ) : (
              <div className="space-y-2">
                {methods.map((method) => (
                  <label
                    key={method.code}
                    className={`flex items-center gap-3 rounded-lg border p-3 cursor-pointer transition ${
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
                      className="h-4 w-4 text-[#0C7BB3]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {method.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(method.rateExVat * 100).toFixed(2)}% ex VAT
                        {method.min ? ` • Min R${method.min}` : ""}
                        {method.max ? ` • Max R${method.max.toLocaleString()}` : ""}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            )}

            {quoteError && (
              <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {quoteError}
              </div>
            )}

            {isQuoting && (
              <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Calculating TradeSafe fee...
              </div>
            )}

            {/* ============================================================
                ✅ PRICING BREAKDOWN (per client's screenshot)
                ============================================================ */}
            {fundingQuote && !isQuoting && (
              <div className="mt-4 space-y-2.5 border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Campaign Budget</span>
                  <span className="font-medium">
                    {formatAmountOrDash(invoice.cartSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Platform Fee (5%)</span>
                  <span className="font-medium">
                    {formatAmountOrDash(invoice.serviceFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Amount Before Tax</span>
                  <span className="font-medium">
                    {formatAmountOrDash(invoice.amountBeforeTax)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT (SARS @ 15%)</span>
                  <span className="font-medium">
                    {formatAmountOrDash(invoice.vat)}
                  </span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-200 pt-2">
                  <span className="font-semibold text-[#0C7BB3]">
                    TradeSafe Escrow & Processing Fee
                  </span>
                  <span className="font-semibold text-[#0C7BB3]">
                    {formatAmountOrDash(fundingQuote.tradesafeFeeInclVat)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 text-base">
                  <span className="font-bold text-gray-900">Total Amount Due</span>
                  <span className="font-bold text-[#0C7BB3]">
                    {formatAmountOrDash(finalTotal)}
                  </span>
                </div>
                <p className="pt-1 text-xs text-gray-500">
                  TradeSafe Escrow & Processing Fee — calculated from your selected payment method.
                </p>
              </div>
            )}
          </section>
        )}
      </div>
    </CampaignCreateStepCard>
  );
}