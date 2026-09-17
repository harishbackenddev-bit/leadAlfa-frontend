import { useMemo, useState } from "react";
import { ChevronRight, CircleAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ShipmentStatusBadge from "../../../features/shipment/components/ShipmentStatusBadge";
import { useShipments } from "../../../features/shipment/useShipments";

const FILTERS = [
  ["all", "All"],
  ["pending", "Pending"],
  ["in_transit", "In Transit"],
  ["out_for_delivery", "Out for Delivery"],
  ["delivered", "Awaiting Confirmation"],
  ["content_creation", "Delivered"],
];

const shortDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })
    : "—";

const shippedAt = (shipment) =>
  shipment.events?.find((event) => event.type === "in_transit")?.occurredAt || "";

const matchesFilter = (shipment, filter) => {
  if (filter === "all") return true;
  if (filter === "pending") {
    return shipment.status === "pending" || shipment.status === "awaiting_shipment";
  }
  return shipment.status === filter;
};

function Meta({ label, value }) {
  return (
    <div className="flex gap-2">
      <dt className="text-[#606977]">{label}</dt>
      <dd className="font-medium text-[#111827]">{value}</dd>
    </div>
  );
}

function ShipmentCard({ shipment, onView }) {
  const needsConfirmation = shipment.status === "delivered";
  const title = shipment.productName || shipment.campaignTitle;
  const subtitle = [shipment.brand.name, title === shipment.campaignTitle ? null : shipment.campaignTitle]
    .filter(Boolean)
    .join(" · ");

  return (
    <article
      className={`rounded-2xl border bg-white p-5 shadow-[0_1px_2px_0_rgb(16_24_40_/_0.04)] ${
        needsConfirmation ? "border-[#EFC050]" : "border-gray-200"
      }`}
    >
      <div className="flex flex-col gap-3.5 md:flex-row md:items-start">
        {shipment.productImage ? (
          <img src={shipment.productImage} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#0c7bb3]/10 text-[13px] font-bold text-[#0c7bb3]">
            {shipment.brand.initials}
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between md:gap-4">
            <div className="min-w-0">
              <h2 className="text-base font-bold leading-tight text-[#111827]">{title}</h2>
              <p className="mt-1 text-[13px] text-[#606977]">{subtitle}</p>
            </div>
            <div className="shrink-0">
              <ShipmentStatusBadge status={shipment.status} creator />
            </div>
          </div>

          <dl className="mt-3.5 flex flex-col gap-1.5 text-[13px] md:flex-row md:flex-wrap md:gap-x-5">
            <Meta label="Tracking:" value={shipment.trackingNumber || "—"} />
            <Meta label="Shipped:" value={shortDate(shippedAt(shipment))} />
            <Meta label="Est. Delivery:" value={shortDate(shipment.estimatedDeliveryAt)} />
          </dl>
        </div>
      </div>

      {needsConfirmation && (
        <p className="mt-3.5 flex items-start gap-2 rounded-lg bg-[#FDF4D5] px-3.5 py-2 text-[13px] text-amber-900">
          <CircleAlert className="mt-px h-3.5 w-3.5 shrink-0 text-amber-600" />
          Please confirm you have received this product to start your contract
        </p>
      )}

      <button
        type="button"
        onClick={onView}
        className="mt-3.5 flex h-10 w-full items-center justify-center gap-1 rounded-lg border border-gray-200 bg-white text-[13px] font-semibold text-[#111827] hover:border-gray-300"
      >
        View Details
        <ChevronRight className="h-3.5 w-3.5" />
      </button>
    </article>
  );
}

export default function MyShipments() {
  const navigate = useNavigate();
  const { shipments } = useShipments("creator");
  const [filter, setFilter] = useState("all");

  const awaitingCount = shipments.filter((shipment) => shipment.status === "delivered").length;
  const filtered = useMemo(
    () => shipments.filter((shipment) => matchesFilter(shipment, filter)),
    [filter, shipments]
  );

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <div className="mx-auto max-w-[1240px] px-4 py-8 md:px-6">
        <h1 className="text-2xl font-bold text-[#111827] sm:text-[28px]">
          My Shipments
        </h1>
        <p className="mt-2 text-sm text-[#606977]">
          Track products shipped to you by brands for your campaigns.
        </p>

        {awaitingCount > 0 && (
          <button
            type="button"
            onClick={() => setFilter("delivered")}
            className="mt-6 flex w-full items-center gap-3 rounded-2xl border border-[#EFC050] bg-gradient-to-r from-[#FDF3D1] to-[#F8DE8A] px-5 py-2.5 text-left hover:to-[#F6D66E] md:h-[52px] md:py-0"
          >
            <CircleAlert className="h-[18px] w-[18px] shrink-0 text-amber-700" />
            <span className="flex-1 text-[13px] font-semibold text-amber-900 md:text-sm">
              You have {awaitingCount} shipment{awaitingCount > 1 ? "s" : ""} waiting for your confirmation
            </span>
            <ChevronRight className="h-[18px] w-[18px] shrink-0 text-amber-700" />
          </button>
        )}

        <div className="mt-6 flex flex-wrap gap-3">
          {FILTERS.map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setFilter(value)}
              className={`inline-flex h-9 items-center rounded-full px-4 text-[13px] font-medium ${
                filter === value
                  ? "bg-[#0c7bb3] text-white"
                  : "border border-gray-200 bg-white text-[#606977] hover:bg-gray-50"
              }`}
            >
              {label}
              {value === "delivered" && awaitingCount > 0 && (
                <span className="ml-1.5 opacity-70">({awaitingCount})</span>
              )}
            </button>
          ))}
        </div>

        {filtered.length > 0 ? (
          <div className="mt-5 space-y-4">
            {filtered.map((shipment) => (
              <ShipmentCard
                key={shipment.id}
                shipment={shipment}
                onView={() => navigate(`/creator/shipments/${shipment.id}`)}
              />
            ))}
          </div>
        ) : (
          <p className="mt-5 rounded-2xl border border-gray-200 bg-white py-12 text-center text-[13px] text-[#606977]">
            No shipments here yet.
          </p>
        )}
      </div>
    </div>
  );
}
