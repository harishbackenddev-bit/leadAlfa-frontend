// tabs/ConfigureCreatorsTab.jsx
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getCreatorApplications,
  getCampaignPaymentStatus,
  selectCreator,
  fundCreator,
} from "../../../../../../services/api/apiservices";

// ========== COMMISSION CONSTANTS ==========
const BRAND_SERVICE_FEE_RATE = 0.05; // 5% Brand Service Fee

export default function ConfigureCreatorsTab({
  campaignId,
  campaignPublicId,
}) {
  const [creators, setCreators] = useState([]);
  const [totals, setTotals] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [processingId, setProcessingId] = useState(null);

  // ✅ Payment status state
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // ========== FETCH APPLICANTS ==========
  const {
    data: applicantsData,
    isLoading: isLoadingApplicants,
    refetch,
  } = useQuery({
    queryKey: ["campaign-applicants", campaignId],
    queryFn: () => getCreatorApplications(campaignId),
    enabled: Boolean(campaignId),
    staleTime: 5 * 60 * 1000,
  });

  // ========== FETCH PAYMENT STATUS ==========
  const { data: statusData, refetch: refetchStatus } = useQuery({
    queryKey: ["campaign-payment-status", campaignId],
    queryFn: () => getCampaignPaymentStatus(campaignId),
    enabled: Boolean(campaignId),
    staleTime: 2 * 60 * 1000,
  });

  // ========== CHECK PAYMENT STATUS ==========
  useEffect(() => {
    if (statusData?.data) {
      const data = statusData.data;
      console.log("📊 Payment Status Data:", data);
      setPaymentStatus(data);
    }
    setIsLoadingStatus(false);
  }, [statusData]);

  // ========== PROCESS ACCEPTED APPLICANTS ==========
  useEffect(() => {
    if (applicantsData?.applicants) {
      console.log("📊 Applicants Data:", applicantsData);

      const acceptedApplicants = applicantsData.applicants.filter(
        (app) => app.applicationStatus === "accepted"
      );

      console.log("📊 Accepted Applicants:", acceptedApplicants);

      if (acceptedApplicants.length === 0) {
        setCreators([]);
        setTotals({});
        setIsLoading(false);
        return;
      }

      const mappedCreators = acceptedApplicants.map((applicant) => {
        const creator = applicant.creator;
        const budget = parseFloat(applicant.proposedBudget) || 0;

        return {
          id: creator.id,
          name: `${creator.firstName} ${creator.lastName}`,
          email: creator.email || "",
          bio: creator.bio || "",
          city: creator.city || "",
          primaryNiches: creator.primaryNiches || [],
          secondaryNiches: creator.secondaryNiches || [],
          budget: budget,
          proposedBudget: applicant.proposedBudget,
          pitch: applicant.pitch,
          applicationId: applicant.id,
          applicationStatus: applicant.applicationStatus,
          createdAt: applicant.createdAt,
          tradeSafeUserId: creator.tradeSafeUserId || null,
          media: applicant.applicationMedia || [],
          introVideo:
            creator.mediaLinks?.find((m) => m.usageType === "intro_video")
              ?.mediaDetails?.url || null,
        };
      });

      console.log("📊 Mapped Creators:", mappedCreators);
      setCreators(mappedCreators);

      const totalBudget = mappedCreators.reduce(
        (sum, c) => sum + (c.budget || 0),
        0
      );
      const totalBrandFee = totalBudget * BRAND_SERVICE_FEE_RATE;
      const grandTotal = totalBudget + totalBrandFee;

      setTotals({
        totalBudget,
        totalBrandFee,
        grandTotal,
        creatorCount: mappedCreators.length,
      });

      setIsLoading(false);
    }
  }, [applicantsData]);

  // ============================================================
  // ✅ HANDLE SELECT & FUND CREATOR
  // ============================================================
  const handleSelectAndFund = async (creator) => {
    setProcessingId(creator.id);
    setError("");

    try {
      // STEP 1: Create escrow (TradeSafe transaction)
      const res = await selectCreator(campaignId, {
        creatorId: creator.id,
        creatorAmount: creator.budget,
      });
      const data = res?.data?.success ? res.data : res;

      if (!data?.transactionId) {
        throw new Error("Failed to create escrow transaction.");
      }

      console.log("✅ Escrow created:", data);

      // STEP 2: Fund from brand's wallet
      await fundCreator(data.transactionId);

      console.log("✅ Creator funded from wallet");

      // STEP 3: Refresh data
      await refetch();
      await refetchStatus();
    } catch (err) {
      console.error("❌ Select & Fund error:", err);
      setError(err?.error || "Failed to select & fund creator");
    } finally {
      setProcessingId(null);
    }
  };

  // ========== LOADING ==========
  if (isLoadingApplicants || isLoadingStatus || isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading...</span>
      </div>
    );
  }

  // ========== ERROR ==========
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-red-700 text-sm font-medium">❌ Error</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
          <button
            onClick={() => {
              setError("");
              refetch();
              refetchStatus();
            }}
            className="px-4 py-2 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ========== NO CREATORS ==========
  if (creators.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-lg font-semibold text-gray-900">
          No Accepted Creators Yet
        </h3>
        <p className="text-sm text-gray-500 mt-2">
          No creators have been accepted for this campaign yet.
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Check the <strong>Proposals</strong> tab to review and accept creators.
        </p>
      </div>
    );
  }

  // ========== CAMPAIGN FUNDED CHECK ==========
  const isCampaignFunded = ["FUNDS_RECEIVED", "FUNDED"].includes(
    paymentStatus?.fundingStatus
  );

  // ========== RENDER ==========
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Campaign Creators
          </h3>
          <p className="text-sm text-gray-500">
            {creators.length} creator(s) accepted for this campaign.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {isCampaignFunded ? (
            <span className="text-sm text-green-600 font-medium">
              ✅ Campaign Funded
            </span>
          ) : (
            <span className="text-sm text-yellow-600 font-medium">
              ⏳ Awaiting Campaign Funding
            </span>
          )}
        </div>
      </div>

      {/* ========== BUDGET STATUS ========== */}
      {paymentStatus?.budget && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h4 className="text-sm font-semibold text-blue-900 mb-2">
            💰 Campaign Budget
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
            <div>
              <span className="text-gray-500">Total:</span>
              <span className="ml-1 font-medium">
                R{Number(paymentStatus.budget.total || 0).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Available:</span>
              <span className="ml-1 font-medium text-green-600">
                R{Number(paymentStatus.budget.available || 0).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Reserved:</span>
              <span className="ml-1 font-medium text-yellow-600">
                R{Number(paymentStatus.budget.reserved || 0).toFixed(2)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Committed:</span>
              <span className="ml-1 font-medium text-blue-600">
                R{Number(paymentStatus.budget.committed || 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ========== CREATOR LIST ========== */}
      <div className="space-y-3">
        {creators.map((creator) => {
          // Find this creator's transaction in payment status
          const creatorTx = paymentStatus?.transactions?.find(
            (t) => t.creatorId === creator.id
          );
          const isFunded = creatorTx?.status === "FUNDED";
          const isProcessing = processingId === creator.id;

          return (
            <div
              key={creator.id}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                isFunded
                  ? "bg-green-50 border-green-200"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">
                    {creator.name}
                  </span>
                  {isFunded && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                      ✅ In Escrow
                    </span>
                  )}
                  {creatorTx && !isFunded && (
                    <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">
                      {creatorTx.status}
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">{creator.email}</p>
                <div className="flex gap-3 mt-1 text-xs text-gray-400">
                  <span>Budget: R{creator.budget.toFixed(2)}</span>
                  {creator.introVideo && (
                    <a
                      href={creator.introVideo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Intro
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold text-gray-900">
                  R{creator.budget.toFixed(2)}
                </span>
                {!isFunded && (
                  <button
                    onClick={() => handleSelectAndFund(creator)}
                    disabled={!isCampaignFunded || isProcessing}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title={
                      !isCampaignFunded
                        ? "Campaign must be funded first"
                        : "Select this creator and fund their escrow"
                    }
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      "Select & Fund"
                    )}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ========== SUMMARY ========== */}
      {creators.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">Total Creator Budget:</span>
              <span className="font-medium">
                R {totals.totalBudget?.toFixed(2) || "0.00"}
              </span>
            </div>

            <div className="flex justify-between items-center text-sm text-blue-600">
              <span>Brand Service Fee (5%):</span>
              <span className="font-medium">
                R {totals.totalBrandFee?.toFixed(2) || "0.00"}
              </span>
            </div>

            <div className="border-t border-gray-200 pt-2 flex justify-between items-center text-base font-bold text-gray-900">
              <span>Grand Total Payable:</span>
              <span className="text-blue-600">
                R {totals.grandTotal?.toFixed(2) || "0.00"}
              </span>
            </div>

            <div className="flex gap-4 text-xs text-gray-500 mt-2">
              <span>Total: {totals.creatorCount || 0} creators</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}