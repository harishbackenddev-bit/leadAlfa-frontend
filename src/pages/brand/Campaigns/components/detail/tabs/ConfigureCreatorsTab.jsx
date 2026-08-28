// tabs/ConfigureCreatorsTab.jsx
import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getCreatorApplications, createEscrowTransactions } from "../../../../../../services/api/apiservices";

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
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutLink, setCheckoutLink] = useState(null);
  const [paymentOpened, setPaymentOpened] = useState(false);

  // ========== FETCH APPLICANTS ==========
  const { data: applicantsData, isLoading: isLoadingApplicants, refetch } = useQuery({
    queryKey: ['campaign-applicants', campaignId],
    queryFn: () => getCreatorApplications(campaignId),
    enabled: Boolean(campaignId),
    staleTime: 5 * 60 * 1000,
  });

  // ========== PROCESS ACCEPTED APPLICANTS ==========
  useEffect(() => {
    if (applicantsData?.applicants) {
      console.log('📊 Applicants Data:', applicantsData);
      
      const acceptedApplicants = applicantsData.applicants.filter(
        (app) => app.applicationStatus === 'accepted'
      );
      
      console.log('📊 Accepted Applicants:', acceptedApplicants);

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
          email: creator.email || '',
          bio: creator.bio || '',
          city: creator.city || '',
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
          introVideo: creator.mediaLinks?.find(
            (m) => m.usageType === "intro_video"
          )?.mediaDetails?.url || null,
        };
      });

      console.log('📊 Mapped Creators:', mappedCreators);
      setCreators(mappedCreators);

      const totalBudget = mappedCreators.reduce((sum, c) => sum + (c.budget || 0), 0);
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
  // ✅ OPEN PAYMENT IN NEW TAB
  // ============================================================
  const openPaymentInNewTab = (link) => {
    console.log('🔗 Opening payment in new tab:', link);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  // ============================================================
  // ✅ HANDLE CREATE ESCROW
  // ============================================================
  const handleCreateEscrow = async () => {
    if (creators.length === 0) {
      setError("No creators to process");
      return;
    }

    setIsProcessing(true);
    setError("");
    setPaymentOpened(false);

    try {
      // Call API to create escrow transactions
      const response = await createEscrowTransactions(campaignId);
      console.log('✅ Full API Response:', response);

      let data = null;
      
      if (response.success && response.data) {
        data = response.data;
      } else if (response.success) {
        data = response;
      } else {
        throw new Error(response.message || 'Failed to create escrow');
      }

      console.log('✅ Data from response:', data);

      const link = data.checkoutLink;
      
      if (link) {
        console.log('✅ Checkout link received:', link);
        setCheckoutLink(link);
        setPaymentOpened(true);
        
        // ✅ Show alert and open payment
        alert(
          `✅ Escrow created for ${data.creatorCount} creators!\n` +
          `Total Amount: R${data.grandTotal?.toFixed(2)}\n\n` +
          `Payment page will open in a new tab...`
        );
        
        // ✅ Open in NEW TAB after alert
        setTimeout(() => {
          openPaymentInNewTab(link);
        }, 500);
        
      } else {
        console.warn('⚠️ No checkout link in response');
        setError("No payment link received. Please try again.");
      }

      refetch();

    } catch (err) {
      console.error('Error creating escrow:', err);
      setError(err?.message || 'Failed to create escrow transactions');
    } finally {
      setIsProcessing(false);
    }
  };

  // ========== LOADING ==========
  if (isLoadingApplicants) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
        <span className="ml-3 text-gray-600">Loading accepted creators...</span>
      </div>
    );
  }

  // ========== ERROR ==========
  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
        {error}
        {checkoutLink && !paymentOpened && (
          <button
            onClick={() => {
              openPaymentInNewTab(checkoutLink);
              setPaymentOpened(true);
            }}
            className="ml-3 px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700"
          >
            Open Payment
          </button>
        )}
      </div>
    );
  }

  // ========== NO CREATORS ==========
  if (creators.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">📭</div>
        <h3 className="text-lg font-semibold text-gray-900">No Accepted Creators Yet</h3>
        <p className="text-sm text-gray-500 mt-2">
          No creators have been accepted for this campaign yet.
        </p>
        <p className="text-sm text-gray-400 mt-1">
          Check the <strong>Proposals</strong> tab to review and accept creators.
        </p>
      </div>
    );
  }

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
          <button
            onClick={handleCreateEscrow}
            disabled={isProcessing || creators.length === 0}
            className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating Escrow...
              </span>
            ) : (
              "Create Escrow & Pay"
            )}
          </button>
        </div>
      </div>

      {/* ========== CHECKOUT LINK STATUS ========== */}
      {checkoutLink && paymentOpened && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-700 font-medium">✅ Payment page opened in new tab</p>
          <p className="text-xs text-green-600 mt-1">
            If payment page didn't open, click here: 
            <a 
              href={checkoutLink} 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 text-blue-600 underline hover:text-blue-800"
            >
              {checkoutLink}
            </a>
          </p>
        </div>
      )}

      {/* ========== CREATOR LIST ========== */}
      <div className="space-y-3">
        {creators.map((creator) => {
          const budget = creator.budget || 0;
          
          return (
            <div
              key={creator.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-gray-900">{creator.name}</span>
                </div>
                <p className="text-xs text-gray-500">{creator.email}</p>
                <div className="flex gap-3 mt-1 text-xs text-gray-400">
                  <span>Budget: R{budget.toFixed(2)}</span>
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
                  R {budget.toFixed(2)}
                </span>
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
              <span className="font-medium">R {totals.totalBudget?.toFixed(2) || '0.00'}</span>
            </div>
            
            <div className="flex justify-between items-center text-sm text-blue-600">
              <span>Brand Service Fee (5%):</span>
              <span className="font-medium">R {totals.totalBrandFee?.toFixed(2) || '0.00'}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-2 flex justify-between items-center text-base font-bold text-gray-900">
              <span>Grand Total Payable:</span>
              <span className="text-blue-600">R {totals.grandTotal?.toFixed(2) || '0.00'}</span>
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