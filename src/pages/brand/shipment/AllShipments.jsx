import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import CreateShipmentModal from "../../../features/shipment/components/CreateShipmentModal";
import ShipmentStatusBadge from "../../../features/shipment/components/ShipmentStatusBadge";
import { useShipments } from "../../../features/shipment/useShipments";
import { redirectToPayFast } from "../../../features/shipment/payments";

const FILTERS = [
  ["all", "All shipments"],
  ["awaiting_payment", "Unpaid"],
  ["awaiting_shipment", "Booked"],
  ["in_transit", "In transit"],
  ["delivered", "Delivered"],
  ["content_creation", "Content creation"],
];

const shipmentDate = (shipment) => {
  const created = shipment.events?.[0]?.occurredAt;
  return created ? new Date(created).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" }) : "—";
};

export default function AllShipments() {
  const navigate = useNavigate();
  const { shipments, createShipments, refresh, error, loading } = useShipments("brand");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [creating, setCreating] = useState(false);
  const [params, setParams] = useSearchParams();
  const payment = params.get("payment");

  useEffect(() => {
    if (payment !== "done") return;
    let tries = 0;
    const timer = setInterval(async () => {
      tries += 1;
      const list = await refresh();
      const settled = !(list || []).some((item) => item.status === "awaiting_payment");
      if (settled || tries >= 10) clearInterval(timer);
    }, 3000);
    return () => clearInterval(timer);
  }, [payment, refresh]);

  const filtered = useMemo(
    () =>
      shipments.filter((shipment) => {
        const query = search.trim().toLowerCase();
        const haystack = [shipment.id, shipment.productName, shipment.campaignTitle, shipment.creator?.name, shipment.trackingNumber];
        const matchesSearch = !query || haystack.some((value) => value?.toLowerCase().includes(query));
        return matchesSearch && (status === "all" || shipment.status === status);
      }),
    [search, shipments, status]
  );

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <div className="mx-auto max-w-[1240px] px-4 py-8 md:px-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#111827] sm:text-[28px] lg:text-[32px]">My Shipments</h1>
            <p className="mt-2 text-sm text-[#606977]">Track and manage all campaign shipments</p>
          </div>
          <button
            type="button"
            onClick={() => setCreating(true)}
            className="flex h-11 items-center gap-2 rounded-xl bg-[#0c7bb3] px-5 text-sm font-semibold text-white hover:bg-[#095a80]"
          >
            <Plus className="h-4 w-4" />
            Create Shipment
          </button>
        </div>

        <div className="relative mt-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by ID, campaign, or creator..."
            className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          {FILTERS.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatus(value)}
              className={`inline-flex h-9 items-center rounded-full px-4 text-[13px] font-medium ${
                status === value
                  ? "bg-[#0c7bb3] text-white"
                  : "border border-gray-200 bg-white text-[#606977] hover:bg-gray-50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="bg-gray-50 text-[13px] text-[#606977]">
                <tr>
                  <th className="px-5 py-4 font-medium">ID</th>
                  <th className="px-5 py-4 font-medium">Shipping Name</th>
                  <th className="px-5 py-4 font-medium">Campaign</th>
                  <th className="px-5 py-4 font-medium">Creators</th>
                  <th className="px-5 py-4 font-medium">Tracking No.</th>
                  <th className="px-5 py-4 font-medium">Date</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                  <th className="px-5 py-4 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((shipment) => (
                  <tr key={shipment.id} className="border-t border-gray-100">
                    <td className="px-5 py-4 font-semibold text-[#0c7bb3]">#{shipment.id}</td>
                    <td className="px-5 py-4 font-medium text-[#111827]">
                      {shipment.productName || shipment.campaignTitle}
                    </td>
                    <td className="px-5 py-4 text-[#606977]">{shipment.campaignTitle}</td>
                    <td className="px-5 py-4 text-[#111827]">{shipment.creator?.name || "—"}</td>
                    <td className="px-5 py-4 font-mono text-[#0c7bb3]">{shipment.trackingNumber || "Not assigned"}</td>
                    <td className="px-5 py-4 text-[#606977]">{shipmentDate(shipment)}</td>
                    <td className="px-5 py-4">
                      <ShipmentStatusBadge status={shipment.status} />
                    </td>
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => navigate(`/brand/shipments/${shipment.id}/view`)}
                        className="h-9 rounded-lg border border-[#0c7bb3] px-4 text-[13px] font-semibold text-[#0c7bb3] hover:bg-[#0c7bb3]/5"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {loading && <p className="p-10 text-center text-sm text-[#606977]">Loading shipments...</p>}
          {!loading && !filtered.length && <p className="p-10 text-center text-sm text-[#606977]">No shipments yet.</p>}
        </div>
      </div>

      {payment === "done" && (
        <div className="mx-auto mt-4 flex max-w-[1240px] items-center justify-between gap-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
          <p className="text-sm text-emerald-800">
            Payment received. We&apos;re booking your courier — this page updates on its own.
          </p>
          <button type="button" onClick={() => setParams({})} className="text-sm font-semibold text-emerald-800">
            Dismiss
          </button>
        </div>
      )}

      {payment === "cancelled" && (
        <div className="mx-auto mt-4 flex max-w-[1240px] items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
          <p className="text-sm text-amber-800">Payment was cancelled. The shipment is still waiting to be paid for.</p>
          <button type="button" onClick={() => setParams({})} className="text-sm font-semibold text-amber-800">
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <p className="mx-auto mt-4 max-w-[1240px] rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {creating && (
        <CreateShipmentModal
          onClose={() => setCreating(false)}
          onCreate={async (payload) => {
            try {
              const result = await createShipments(payload);
              if (result?.checkout) {
                redirectToPayFast(result.checkout);
                return;
              }
              setCreating(false);
            } catch {
              setCreating(false);
            }
          }}
        />
      )}
    </div>
  );
}
