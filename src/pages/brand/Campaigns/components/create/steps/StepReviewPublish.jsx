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
  getEstimatedFee,
  // ❌ getPaymentMethods,         // comment out — future use
  // ❌ generateFundingQuote,       // comment out — future use
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

export default function StepReviewPublish({
  formData,
  invoice,
  campaignPublicId,
  onQuoteChange,
}) {
  const videoPkg = getVideoLengthPackage(formData.videoLength);
  const selectedAddOnLabels = CAMPAIGN_ADD_ONS.filter((addon) =>
    (formData.selectedAddOns || []).includes(addon.id)
  ).map((addon) => addon.label);

  // ============================================================
  // ✅ ESTIMATED FEE STATE (no payment method)
  // ============================================================
  const [estimatedQuote, setEstimatedQuote] = useState(null);
  const [isLoadingEstimate, setIsLoadingEstimate] = useState(false);
  const [estimateError, setEstimateError] = useState(null);

  useEffect(() => {
    if (!campaignPublicId) return;

    const fetchEstimate = async () => {
      try {
        setIsLoadingEstimate(true);
        setEstimateError(null);
        const res = await getEstimatedFee(campaignPublicId);
        const data = res?.data || res;
        setEstimatedQuote(data);
        onQuoteChange?.(data);
      } catch (err) {
        console.error("Failed to fetch estimated fee:", err);
        setEstimateError(err?.message || "Failed to load fee estimate");
        setEstimatedQuote(null);
        onQuoteChange?.(null);
      } finally {
        setIsLoadingEstimate(false);
      }
    };

    fetchEstimate();
  }, [campaignPublicId]);

  // ============================================================
  // ❌ PAYMENT METHOD SELECTION — COMMENTED OUT FOR LATER
  // ============================================================
  /*
  const [methods, setMethods] = useState([]);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [quote, setQuote] = useState(null);
  const [isLoadingMethods, setIsLoadingMethods] = useState(false);
  const [isQuoting, setIsQuoting] = useState(false);
  const [quoteError, setQuoteError] = useState(null);

  useEffect(() => {
    if (!campaignPublicId) return;
    const fetchMethods = async () => {
      try {
        setIsLoadingMethods(true);
        const res = await getPaymentMethods(campaignPublicId);
        const data = res?.data || res;
        setMethods(data?.methods || []);
      } catch (err) {
        console.error("Failed to load payment methods:", err);
      } finally {
        setIsLoadingMethods(false);
      }
    };
    fetchMethods();
  }, [campaignPublicId]);

  const handleSelectMethod = async (code) => {
    setSelectedMethod(code);
    setIsQuoting(true);
    setQuoteError(null);
    try {
      const res = await generateFundingQuote(campaignPublicId, code);
      const data = res?.data || res;
      setQuote(data);
      onQuoteChange?.(data);
    } catch (err) {
      setQuoteError(err?.message || "Failed");
      setQuote(null);
      onQuoteChange?.(null);
    } finally {
      setIsQuoting(false);
    }
  };
  */

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

        {/* ✅ ESTIMATED TRADESAFE FEE */}
        <section className="rounded-2xl border border-[#e5e7eb] bg-white p-5">
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#94A3B8]">
            TradeSafe Fee Estimate
          </h3>

          {isLoadingEstimate ? (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="h-4 w-4 animate-spin" />
              Calculating estimated fee...
            </div>
          ) : estimateError ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {estimateError}
            </div>
          ) : estimatedQuote ? (
            <div className="space-y-2 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Campaign Budget</span>
                <span className="font-medium">
                  R {Number(estimatedQuote.campaignAmount || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Platform Fee (5%)</span>
                <span className="font-medium">
                  R {Number(estimatedQuote.creatrendBrandServiceFee || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Amount Before Tax</span>
                <span className="font-medium">
                  R {Number(estimatedQuote.amountBeforeTax || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">VAT (SARS @ 15%)</span>
                <span className="font-medium">
                  R {Number(estimatedQuote.creatrendVat || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm border-t border-gray-300 pt-2">
                <span className="font-semibold text-[#1E60DB]">
                  TradeSafe Escrow & Processing Fee (est. 5.5%)
                </span>
                <span className="font-semibold text-[#1E60DB]">
                  R {Number(estimatedQuote.tradesafeFeeInclVat || 0).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between border-t border-gray-300 pt-2 text-base">
                <span className="font-bold text-gray-900">Total Amount Due</span>
                <span className="font-bold text-[#1E60DB]">
                  R {Number(estimatedQuote.totalAmountDue || 0).toFixed(2)}
                </span>
              </div>
              <p className="pt-1 text-xs text-gray-500">
                {estimatedQuote.estimateNote ||
                  "TradeSafe fee is an estimate. Final amount depends on payment method selected at TradeSafe."}
              </p>
            </div>
          ) : null}

          {/* ❌ PAYMENT METHOD SELECTION — COMMENTED OUT FOR LATER */}
          {/*
          <div className="mt-4">
            <h4>Payment Method</h4>
            {methods.map((method) => (
              <label key={method.code}>
                <input type="radio" checked={selectedMethod === method.code} onChange={() => handleSelectMethod(method.code)} />
                {method.label} — {(method.rateExVat * 100).toFixed(2)}% ex VAT
              </label>
            ))}
          </div>
          */}
        </section>
      </div>
    </CampaignCreateStepCard>
  );
}