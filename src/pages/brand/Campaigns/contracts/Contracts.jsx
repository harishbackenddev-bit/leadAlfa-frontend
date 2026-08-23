import React, { useMemo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import contractsData from "./contractsData";
import CampaignsSectionShell from "../components/CampaignsSectionShell";
import starIcon from "../../../../assets/images/creator/ratingStar.svg";

const TAB_KEYS = ["active", "expiring", "expired"];

function deriveContractsFlat() {
  const flat = [];
  let i = 0;
  contractsData.forEach((campaign) => {
    campaign.proposals.forEach((p) => {
      const isExpired = p.status === "Closed";
      const listTab = isExpired ? "expired" : i % 2 === 0 ? "active" : "expiring";
      i += 1;
      flat.push({
        ...p,
        campaignNumericId: campaign.campaignId,
        campaignTitle: "Summer Fashion Campaign",
        contractId: `#${124500 + p.id}`,
        contractDate: "Jan 15, 2026",
        endDate: isExpired ? "Feb 1, 2026" : "Jun 30, 2026",
        location: "New York, USA",
        jobsCompleted: 45,
        showRating: 4.8,
        listTab,
        headlineStatus: isExpired ? "Expired" : "Active",
      });
    });
  });
  return flat;
}

const ALL_CONTRACTS = deriveContractsFlat();

function ContractGridCard({ row, onMessage, onViewCampaign }) {
  const isActive = row.headlineStatus === "Active";
  return (
    <div className="relative flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <span
        className={`absolute left-4 top-4 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          isActive
            ? "bg-green-100 text-green-700"
            : "bg-gray-100 text-gray-600"
        }`}
      >
        {row.headlineStatus}
      </span>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900">{row.campaignTitle}</h3>
        <button
          type="button"
          className="mt-1 text-sm font-medium text-[#1E60DB] hover:underline"
          onClick={() => onViewCampaign(row)}
        >
          {row.contractId}
        </button>
      </div>

      <div className="mt-4 flex items-start gap-3 border-t border-gray-100 pt-4">
        <img
          src={row.avatar}
          alt=""
          className="h-12 w-12 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-gray-900">{row.name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <img
                  key={s}
                  src={starIcon}
                  alt=""
                  className={`h-3 w-3 ${s <= Math.floor(row.showRating) ? "opacity-100" : "opacity-30"}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-600 ">
              {row.showRating} · {row.jobsCompleted} jobs completed
            </span>
          </div>
          <p className="mt-1 text-xs text-gray-500">{row.location}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-sm">
        <div>
          <p className="text-xs font-medium uppercase text-gray-400">Contract date</p>
          <p className="mt-0.5 font-medium text-gray-800">{row.contractDate}</p>
        </div>
        <div>
          <p className="text-xs font-medium uppercase text-gray-400">End date</p>
          <p className="mt-0.5 font-medium text-gray-800">{row.endDate}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onMessage(row)}
          className="flex-1 rounded-lg border border-[#1E60DB] bg-white px-4 py-2.5 text-sm font-medium text-[#1E60DB] hover:bg-gray-50 sm:flex-none"
        >
          Send Message
        </button>
        <button
          type="button"
          onClick={() => onViewCampaign(row)}
          className="flex-1 rounded-lg bg-[#1E84D6] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#167AC8] sm:flex-none"
        >
          View Campaign
        </button>
      </div>
    </div>
  );
}

const PaginationBar = ({ total, page, perPage, onChange }) => {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pages = [];
  const maxVisible = 5;
  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (page <= 3) {
    for (let i = 1; i <= maxVisible; i++) pages.push(i);
  } else if (page >= totalPages - 2) {
    for (let i = totalPages - maxVisible + 1; i <= totalPages; i++) pages.push(i);
  } else {
    for (let i = page - 2; i <= page + 2; i++) pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 border-t border-gray-100 py-6">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm ${
          page === 1 ? "cursor-not-allowed text-gray-300" : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          type="button"
          key={p}
          onClick={() => onChange(p)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium ${
            page === p
              ? "bg-[#1E84D6] text-white"
              : "border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className={`flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 text-sm ${
          page === totalPages ? "cursor-not-allowed text-gray-300" : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        ›
      </button>
    </div>
  );
};

export default function Contracts() {
  const navigate = useNavigate();
  const [listTab, setListTab] = useState("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const perPage = 4;

  const counts = useMemo(() => {
    const c = { active: 0, expiring: 0, expired: 0 };
    ALL_CONTRACTS.forEach((r) => {
      c[r.listTab] += 1;
    });
    return c;
  }, []);

  const filtered = useMemo(() => {
    let rows = ALL_CONTRACTS.filter((r) => r.listTab === listTab);
    if (searchQuery.trim()) {
      const t = searchQuery.toLowerCase();
      rows = rows.filter(
        (r) =>
          String(r.name).toLowerCase().includes(t) ||
          String(r.contractId).toLowerCase().includes(t) ||
          String(r.campaignTitle).toLowerCase().includes(t),
      );
    }
    return rows;
  }, [listTab, searchQuery]);

  const paginated = useMemo(() => {
    const start = (page - 1) * perPage;
    return filtered.slice(start, start + perPage);
  }, [filtered, page]);

  const handleCreate = useCallback(() => {
    navigate("/brand/campaigns/create");
  }, [navigate]);

  const handleMessage = useCallback(
    (row) => {
      navigate("/brand/messages", { state: { highlightCreator: row.id } });
    },
    [navigate],
  );

  const handleViewCampaign = useCallback(
    () => {
      navigate("/brand/campaigns");
    },
    [navigate],
  );

  const tabLabels = {
    active: "Active",
    expiring: "Expiring Soon",
    expired: "Expired",
  };

  return (
    <CampaignsSectionShell
      subtitle="Manage contracts, approvals and deliverables"
      searchPlaceholder="Search contracts by name, ID, or date..."
      searchValue={searchQuery}
      onSearchChange={(v) => {
        setSearchQuery(v);
        setPage(1);
      }}
      primaryAction={{
        label: "Create Campaign",
        onClick: handleCreate,
        icon: <Plus className="h-4 w-4" />,
      }}
    >
      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-4 py-3 md:px-6">
          <div className="flex flex-wrap items-center gap-6">
            {TAB_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setListTab(key);
                  setPage(1);
                }}
                className={`flex items-center gap-2 border-b-2 pb-2 text-sm font-medium transition-colors ${
                  listTab === key
                    ? "border-[#1E60DB] text-[#1E60DB]"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tabLabels[key]}
                <span
                  className={`rounded-full px-2 py-0.5 text-xs ${
                    listTab === key
                      ? "bg-blue-50 text-[#1E60DB]"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {counts[key] ?? 0}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 md:p-6">
          {paginated.length === 0 ? (
            <div className="py-12 text-center text-gray-500">No contracts in this view.</div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {paginated.map((row) => (
                <ContractGridCard
                  key={`${row.id}-${row.contractId}`}
                  row={row}
                  onMessage={handleMessage}
                  onViewCampaign={handleViewCampaign}
                />
              ))}
            </div>
          )}
        </div>

        <PaginationBar
          total={filtered.length}
          page={page}
          perPage={perPage}
          onChange={setPage}
        />
      </section>
    </CampaignsSectionShell>
  );
}
