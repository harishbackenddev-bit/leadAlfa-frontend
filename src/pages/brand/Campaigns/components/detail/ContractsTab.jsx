import React, { useMemo, useState } from "react";
import ContractCard, {
  CONTRACT_TAB_CONFIG,
  ContractSubTabs,
} from "./contracts/ContractCard";

/**
 * Contracts tab (per-campaign).
 *
 * Current: no API — sub-tabs stay visible with zero counts and an empty state.
 * Card UI is kept ready for wiring. When backend ships contracts API, pass
 * contracts from the query and wire `onViewDetail` / `onRenew`.
 * See docs/BRAND_CAMPAIGN_UI_API_GUIDE.md §3.8.
 */
export default function ContractsTab({ contracts = [] }) {
  const [activeTab, setActiveTab] = useState("active");

  const tabCounts = useMemo(() => {
    const counts = { active: 0, expiring: 0, expired: 0 };
    contracts.forEach((c) => {
      if (counts[c.tab] != null) counts[c.tab] += 1;
    });
    return counts;
  }, [contracts]);

  const tabs = CONTRACT_TAB_CONFIG.map((t) => ({
    ...t,
    count: tabCounts[t.key] ?? 0,
  }));

  const filtered = contracts.filter((c) => c.tab === activeTab);

  return (
    <div className="space-y-4">
      <ContractSubTabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500">
            No contracts present.
          </div>
        ) : (
          filtered.map((contract) => (
            <ContractCard
              key={contract.id}
              contract={contract}
              onViewDetail={() => {}}
              onRenew={() => {}}
            />
          ))
        )}
      </div>
    </div>
  );
}
