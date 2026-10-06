import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Building,
  CircleCheck,
  Clock,
  Download,
  Search,
  Wallet,
} from "lucide-react";
import WithdrawMoney from "../MyEarnings/components/WithdrawMoney";
import { Pill, card, control, formatDate, zar } from "../MyEarnings/components/earnings";
import {
  getCreatorBalance,
  getCreatorTransactions,
} from "../../../services/api/apiservices";

const PAGE_SIZE = 6;

const STATUS = {
  CREATED: { label: "Awaiting funding", tone: "purple" },
  FUNDED: { label: "In escrow", tone: "amber" },
  PAYOUT_TRIGGERED: { label: "Released", tone: "green" },
  COMPLETED: { label: "Paid out", tone: "blue" },
  CANCELLED: { label: "Cancelled", tone: "red" },
};

const statusOf = (s) => STATUS[s] || { label: s, tone: "blue" };

const toRow = (t) => ({
  id: t.campaignPublicId || t.reference,
  title: t.campaignTitle,
  sub: t.brandName,
  date: t.createdAt,
  status: t.status,
  amount: t.creatorNet,
});

const sumWhere = (rows, statuses) => {
  const hits = rows.filter((r) => statuses.includes(r.status));
  return {
    total: hits.reduce((sum, r) => sum + r.amount, 0),
    count: hits.length,
  };
};

export default function MyEarnings() {
  // ============================================================
  // 🔥 STATE
  // ============================================================
  const [allTransactions, setAllTransactions] = useState([]);
  const [available, setAvailable] = useState(0);

  const [balanceLoading, setBalanceLoading] = useState(true);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [balanceError, setBalanceError] = useState(false);
  const [transactionsError, setTransactionsError] = useState(false);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("");
  const [days, setDays] = useState("30");
  const [page, setPage] = useState(1);
  const [showWithdraw, setShowWithdraw] = useState(false);

  // ============================================================
  // 🔥 API CALLS
  // ============================================================
  const fetchBalance = useCallback(async () => {
    try {
      setBalanceLoading(true);
      setBalanceError(false);
      const res = await getCreatorBalance();
      const data = res?.data || res;
      setAvailable(Number(data?.balance ?? data?.amount ?? 0));
    } catch (err) {
      console.error("Balance fetch error:", err);
      setBalanceError(true);
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  const fetchTransactions = useCallback(async (pageNum = 1) => {
    try {
      setTransactionsLoading(true);
      setTransactionsError(false);
      const res = await getCreatorTransactions({
        page: pageNum,
        limit: 100,
      });
      const data = res?.data || res;
      const list = Array.isArray(data)
        ? data
        : Array.isArray(data?.transactions)
        ? data.transactions
        : [];
      setAllTransactions(list);
    } catch (err) {
      console.error("Transactions fetch error:", err);
      setTransactionsError(true);
    } finally {
      setTransactionsLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchBalance();
    fetchTransactions(1);
  }, [fetchBalance, fetchTransactions]);

  // ============================================================
  // 🔥 DERIVED DATA
  // ============================================================
  const all = allTransactions.map(toRow);
  const earned = sumWhere(all, ["PAYOUT_TRIGGERED", "COMPLETED"]);
  const escrow = sumWhere(all, ["FUNDED"]);
  const cancelled = sumWhere(all, ["CANCELLED"]);

  const metrics = [
    {
      label: "Total earnings",
      value: earned.total,
      note: `${earned.count} released payments`,
      Icon: Wallet,
      tint: "bg-[#eaf6fb] text-[#0c7bb3]",
    },
    {
      label: "Available balance",
      value: available,
      note: "Ready to withdraw",
      Icon: CircleCheck,
      tint: "bg-[#eaf7f0] text-[#16794a]",
    },
    {
      label: "Pending escrow",
      value: escrow.total,
      note: `Across ${escrow.count} active campaigns`,
      Icon: Clock,
      tint: "bg-[#fff6e6] text-[#a35f08]",
      to: "escrow",
    },
    {
      label: "Cancelled",
      value: cancelled.total,
      note: `${cancelled.count} cancelled payments`,
      Icon: ArrowDownLeft,
      tint: "bg-[#f0eeff] text-[#6d5bd0]",
    },
  ];

  const since = days && Date.now() - days * 86400000;
  const q = query.trim().toLowerCase();
  const rows = all.filter(
    (t) =>
      (!status || t.status === status) &&
      (!since || new Date(t.date) >= since) &&
      (!q || `${t.id} ${t.title} ${t.sub}`.toLowerCase().includes(q)),
  );
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  // ============================================================
  // 🔥 HANDLERS
  // ============================================================
  const exportCsv = () => {
    const csv = [
      "Transaction,Details,Party,Date,Status,Amount",
      ...rows.map((t) =>
        [t.id, t.title, t.sub, t.date, statusOf(t.status).label, t.amount]
          .map((v) => `"${v}"`)
          .join(","),
      ),
    ].join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv" }));
    a.download = "transactions.csv";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const filter = (setter) => (e) => {
    setter(e.target.value);
    setPage(1);
  };

  // 🔥 Called when withdrawal succeeds
  const handleWithdrawSuccess = async () => {
    await Promise.all([fetchBalance(), fetchTransactions(1)]);
  };

  // ============================================================
  // 🔥 LOADING
  // ============================================================
  if (balanceLoading || transactionsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f9fb]">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-[#0c7bb3]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f9fb]">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-16 py-6 lg:py-9 flex flex-col gap-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-bold text-[#101727]">
              Earnings
            </h1>
            <p className="text-sm text-[#606977] mt-1.5">
              Track your income, escrow releases, and payouts in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to="bank-accounts/change-request"
              className="flex items-center gap-2 h-10 px-4 rounded-lg border border-[#e2e8f0] bg-white text-sm font-semibold text-[#0c7bb3]"
            >
              <Building size={17} />
              Request Bank Account Change
            </Link>
            <Link
              to="bank-accounts/new"
              className="flex items-center gap-2 h-10 px-4 rounded-lg border border-[#e2e8f0] bg-white text-sm font-semibold text-[#0c7bb3]"
            >
              <Building size={17} />
              Add Bank Account
            </Link>
            <button
              onClick={() => setShowWithdraw(true)}
              className="main-btn flex items-center gap-2 h-10 px-[18px] rounded-lg text-sm font-semibold text-white"
            >
              <ArrowUpRight size={17} />
              Withdraw funds
            </button>
          </div>
        </div>

        {balanceError || transactionsError ? (
          <p className="rounded-xl border border-[#fecaca] bg-[#fff0ee] px-4 py-10 text-center text-sm text-[#b42318]">
            Failed to load your earnings.
          </p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map(({ label, value, note, Icon, tint, to }) => {
                const Card = to ? Link : "div";
                return (
                  <Card
                    key={label}
                    to={to}
                    className={`${card} p-6 ${to ? "hover:border-[#0c7bb3]" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[#606977]">
                        {label}
                      </p>
                      <span
                        className={`size-[38px] rounded-lg flex items-center justify-center ${tint}`}
                      >
                        <Icon size={18} />
                      </span>
                    </div>
                    <p className="text-[24px] sm:text-[28px] font-bold text-[#101727] mt-[18px]">
                      {zar(value)}
                    </p>
                    <p className="text-xs text-[#606977] mt-[18px]">{note}</p>
                  </Card>
                );
              })}
            </div>

            <div className="bg-white border border-[#e2e8f0] rounded-xl overflow-hidden">
              <div className="flex flex-col gap-4 p-4 sm:p-6 border-b border-[#e2e8f0] lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-xl font-bold text-[#101727]">
                    Recent transactions
                  </h2>
                  <p className="text-[13px] text-[#606977] mt-1">
                    Latest earnings and payout activity
                  </p>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  <label
                    className={`${control} flex items-center gap-2 w-full sm:w-[210px]`}
                  >
                    <Search size={16} className="shrink-0" />
                    <input
                      value={query}
                      onChange={filter(setQuery)}
                      placeholder="Search transactions"
                      className="w-full bg-transparent outline-none placeholder:text-[#606977]/70"
                    />
                  </label>
                  <select
                    value={status}
                    onChange={filter(setStatus)}
                    className={`${control} bg-[#f8fafc]! font-medium`}
                  >
                    <option value="">All statuses</option>
                    {Object.entries(STATUS).map(([key, s]) => (
                      <option key={key} value={key}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                  <select
                    value={days}
                    onChange={filter(setDays)}
                    className={`${control} bg-[#f8fafc]! font-medium`}
                  >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="">All time</option>
                  </select>
                  <button
                    onClick={exportCsv}
                    className={`${control} flex items-center gap-2 font-semibold text-[#101727]`}
                  >
                    <Download size={15} />
                    Export
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] text-[13px]">
                  <thead className="bg-[#f8fafc] border-b border-[#e2e8f0] text-xs font-semibold text-[#606977]">
                    <tr>
                      <th className="text-left font-semibold px-6 py-3.5">
                        Transaction
                      </th>
                      <th className="text-left font-semibold px-6 py-3.5">
                        Details
                      </th>
                      <th className="text-left font-semibold px-6 py-3.5">
                        Date
                      </th>
                      <th className="text-left font-semibold px-6 py-3.5">
                        Status
                      </th>
                      <th className="text-right font-semibold px-6 py-3.5">
                        Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map((t) => (
                      <tr key={t.id} className="border-b border-[#e2e8f0]">
                        <td className="px-6 py-4 font-semibold text-[#0c7bb3]">
                          #{t.id}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[#101727]">
                            {t.title}
                          </p>
                          <p className="text-xs text-[#606977] mt-[3px]">
                            {t.sub}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-[#606977] whitespace-nowrap">
                          {formatDate(t.date)}
                        </td>
                        <td className="px-6 py-4">
                          <Pill tone={statusOf(t.status).tone}>
                            {statusOf(t.status).label}
                          </Pill>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-[#101727] whitespace-nowrap">
                          {zar(t.amount)}
                        </td>
                      </tr>
                    ))}
                    {!visible.length && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center text-[#606977]"
                        >
                          No transactions match your filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between bg-[#f8fafc] px-4 sm:px-6 py-4">
                <p className="text-[13px] text-[#606977]">
                  Showing {visible.length} of {rows.length} transactions
                </p>
                <div className="flex gap-1.5">
                  {[
                    "‹",
                    ...Array.from({ length: pages }, (_, i) => i + 1),
                    "›",
                  ].map((p) => {
                    const target =
                      p === "‹" ? current - 1 : p === "›" ? current + 1 : p;
                    return (
                      <button
                        key={p}
                        onClick={() => setPage(target)}
                        disabled={target < 1 || target > pages}
                        className={`size-8 rounded-lg border text-[13px] font-semibold disabled:opacity-50 ${
                          p === current
                            ? "bg-[#0c7bb3] border-[#0c7bb3] text-white"
                            : "bg-white border-[#e2e8f0] text-[#606977]"
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <WithdrawMoney
        isOpen={showWithdraw}
        onClose={() => setShowWithdraw(false)}
        totalAmount={available}
        onWithdraw={handleWithdrawSuccess}
      />
    </div>
  );
}