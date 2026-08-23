// src/pages/brand/Campaigns/components/CreatorSelectionSection.jsx
import React, { useState, useEffect } from 'react';
import { getActiveCreatorsList } from '../../../../services/api/apiservices';

export function CreatorSelectionSection({ 
  selectedCreators, 
  setSelectedCreators,
  isBrandVerified = false,
  errors 
}) {
  const [creators, setCreators] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  console.log('🔍 isBrandVerified:', isBrandVerified);

  useEffect(() => {
    fetchCreators();
  }, []);

  const fetchCreators = async () => {
    setLoading(true);
    try {
      const response = await getActiveCreatorsList();
      console.log('📊 Creators response:', response);
      
      const creatorsList = response.creators || response.data?.creators || response.data || [];
      setCreators(creatorsList);
    } catch (error) {
      console.error('Error fetching creators:', error);
    } finally {
      setLoading(false);
    }
  };

  // ========== Get creator status - Updated to use backend eligibility ==========
  const getCreatorStatus = (creator) => {
    // Use the eligibility from backend
    const isEligible = creator.isEligibleForPayout === true;
    const tradeSafeUserId = creator.tradeSafeUserId;
    const tradeSafeStatus = creator.tradeSafeStatus || 'PENDING';
    const bankStatus = creator.bankVerificationStatus || 'PENDING';

    console.log(`🔍 Creator ${creator.id} eligibility:`, {
      isEligible,
      tradeSafeUserId,
      tradeSafeStatus,
      bankStatus,
      eligibilityDetails: creator.eligibilityDetails,
    });

    // Case 1: No TradeSafe ID
    if (!tradeSafeUserId) {
      return { 
        label: 'Not Registered', 
        color: 'text-red-600', 
        bg: 'bg-red-50',
        eligible: false,
        reason: 'Creator has not registered for payouts'
      };
    }

    // Case 2: Backend says not eligible (pending verification)
    if (!isEligible) {
      return { 
        label: '⏳ Pending', 
        color: 'text-yellow-600', 
        bg: 'bg-yellow-50',
        eligible: false,
        reason: 'Payout verification pending. Please wait for approval.'
      };
    }

    // Case 3: All verified ✅
    return { 
      label: '✅ Verified', 
      color: 'text-green-600', 
      bg: 'bg-green-50',
      eligible: true,
      reason: 'Ready for payouts'
    };
  };
  // ===============================================================

  const addCreator = (creator) => {
    if (selectedCreators.find(c => c.id === creator.id)) return;

    const status = getCreatorStatus(creator);
    
    if (!status.eligible) {
      alert(`❌ ${creator.name || creator.publicName || 'Creator'} cannot be added.\nReason: ${status.reason}`);
      return;
    }

    setSelectedCreators([
      ...selectedCreators,
      {
        id: creator.id,
        name: creator.name || creator.publicName || `Creator ${creator.id}`,
        email: creator.email || '',
        budget: 0,
        tradeSafeUserId: creator.tradeSafeUserId,
        tradeSafeReference: creator.tradeSafeReference,
        tradeSafeStatus: creator.tradeSafeStatus,
        bankVerificationStatus: creator.bankVerificationStatus,
        isEligibleForPayout: creator.isEligibleForPayout,
      }
    ]);
  };

  const removeCreator = (creatorId) => {
    setSelectedCreators(selectedCreators.filter(c => c.id !== creatorId));
  };

  const updateCreatorBudget = (creatorId, budget) => {
    setSelectedCreators(selectedCreators.map(c => 
      c.id === creatorId ? { ...c, budget: parseFloat(budget) || 0 } : c
    ));
  };

  const filteredCreators = creators.filter(c => {
    const name = c.name || c.publicName || '';
    const email = c.email || '';
    const search = searchTerm.toLowerCase();
    return name.toLowerCase().includes(search) || email.toLowerCase().includes(search);
  });

  const totalBudget = selectedCreators.reduce((sum, c) => sum + (c.budget || 0), 0);

  return (
    <div className="space-y-4 border-t border-gray-200 pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Select Creators
        </h3>
        <span className="text-sm text-gray-500">
          {selectedCreators.length} selected
        </span>
      </div>

      {/* Brand Verification Warning */}
      {!isBrandVerified && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700">
            ⚠️ Please complete TradeSafe verification first to add creators.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Creator List */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="mb-3">
            <input
              type="text"
              placeholder="Search creators..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="max-h-80 overflow-y-auto space-y-2">
            {loading ? (
              <p className="text-sm text-gray-500 text-center py-4">Loading...</p>
            ) : filteredCreators.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No creators found</p>
            ) : (
              filteredCreators.map((creator) => {
                const status = getCreatorStatus(creator);
                
                return (
                  <div
                    key={creator.id}
                    className={`flex items-center justify-between p-2 rounded-lg transition ${
                      status.eligible ? 'hover:bg-gray-50' : 'opacity-70'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {creator.name || creator.publicName || `Creator ${creator.id}`}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {creator.email || ''}
                      </p>
                      <div className={`inline-block px-2 py-0.5 rounded-full text-xs mt-1 ${status.bg} ${status.color}`}>
                        {status.label}
                      </div>
                      {!status.eligible && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {status.reason}
                        </p>
                      )}
                      {/* Show eligibility details for debugging */}
                      {creator.eligibilityDetails && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          Token: {creator.eligibilityDetails.tokenExists ? '✅' : '❌'} 
                          Org: {creator.eligibilityDetails.hasOrganization ? '✅' : '❌'}
                          Balance: {creator.eligibilityDetails.hasBalance ? '✅' : '❌'}
                        </p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => addCreator(creator)}
                      disabled={!status.eligible || !isBrandVerified}
                      className={`ml-2 px-3 py-1 text-xs rounded-lg whitespace-nowrap ${
                        status.eligible && isBrandVerified
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Add
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Selected Creators */}
        <div className="border border-gray-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">
            Selected Creators ({selectedCreators.length})
          </p>

          {selectedCreators.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              No creators selected yet
            </p>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {selectedCreators.map((creator) => (
                <div
                  key={creator.id}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {creator.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {creator.email}
                    </p>
                    {creator.tradeSafeStatus === 'VERIFIED' ? (
                      <span className="text-xs text-green-600">✅ Verified</span>
                    ) : (
                      <span className="text-xs text-yellow-600">⏳ Pending</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={creator.budget || ''}
                      onChange={(e) => updateCreatorBudget(creator.id, e.target.value)}
                      placeholder="Budget"
                      className="w-24 px-2 py-1 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeCreator(creator.id)}
                      className="text-red-500 hover:text-red-700 text-sm p-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedCreators.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">
                  Total Budget:
                </span>
                <span className="text-lg font-bold text-blue-600">
                  R {totalBudget.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {selectedCreators.length} creator(s) selected
              </p>
            </div>
          )}
        </div>
      </div>

      {errors?.creators && (
        <p className="text-xs text-red-500">{errors.creators}</p>
      )}
    </div>
  );
}