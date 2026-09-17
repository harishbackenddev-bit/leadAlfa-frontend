import { useState } from "react";
import { ArrowLeft, Check, MapPin, Package } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useShipments } from "../../../features/shipment/useShipments";
import { STAGES, eventForStage, reachedFor } from "../../../features/shipment/stages";

const stamp = (value) => {
  if (!value) return "";
  const date = new Date(value);
  const day = date.toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" });
  const time = date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  return `${day}, ${time}`;
};

const shortDate = (value) =>
  value ? new Date(value).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" }) : "—";

function Row({ label, value }) {
  return (
    <div className="mt-5 first:mt-0">
      <p className="text-sm text-[#606977]">{label}</p>
      <p className="mt-1 text-[15px] text-[#111827]">{value}</p>
    </div>
  );
}

export default function ViewShipment() {
  const { id } = useParams();
  const { shipments, markDelivered } = useShipments("brand");
  const shipment = shipments.find((item) => String(item.id) === String(id));
  const [error, setError] = useState("");

  if (!shipment) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] px-4 py-16 text-center">
        <p className="text-[#606977]">We couldn&apos;t find that shipment.</p>
        <Link to="/brand/shipments" className="mt-3 inline-block font-semibold text-[#0c7bb3]">
          Back to shipments
        </Link>
      </div>
    );
  }

  const reached = reachedFor(shipment.status);
  const address = shipment.deliveryAddress || {};
  const dimensions = shipment.dimensions;
  const canMarkDelivered = ["awaiting_shipment", "in_transit"].includes(shipment.status);

  const run = async (action, ...args) => {
    try {
      await action(shipment.id, ...args);
      setError("");
    } catch (actionError) {
      setError(actionError.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <div className="mx-auto max-w-[1240px] px-4 py-8 md:px-6">
        <div className="flex items-center gap-4">
          <Link
            to="/brand/shipments"
            aria-label="Back to shipments"
            className="text-[#606977] hover:text-[#0c7bb3]"
          >
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-extrabold text-[#111827] sm:text-[28px]">Shipment Details - #{shipment.id}</h1>
        </div>

        {error && (
          <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-[#111827]">
                <Package className="h-[22px] w-[22px] text-[#0c7bb3]" />
                Tracking Information
              </h2>

              <ol className="mt-6">
                {STAGES.map((stage, index) => {
                  const done = index < reached;
                  const current = index === reached;
                  const event = eventForStage(shipment.events, stage);
                  return (
                    <li key={stage.label} className="relative flex gap-3 pb-7 last:pb-0">
                      {index < STAGES.length - 1 && (
                        <span
                          className={`absolute bottom-0 left-[11px] top-[26px] w-0.5 ${
                            done ? "bg-[#0c7bb3]" : "bg-gray-200"
                          }`}
                          aria-hidden
                        />
                      )}
                      <span
                        className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                          done || current ? "bg-[#0c7bb3] text-white" : "border-2 border-gray-300 bg-white"
                        }`}
                      >
                        {done && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                        {current && <span className="h-2 w-2 rounded-full bg-white" />}
                      </span>
                      <div className="min-w-0">
                        <p className={`font-semibold ${done || current ? "text-[#111827]" : "text-[#9AA3B0]"}`}>
                          {stage.label}
                        </p>
                        {event && <p className="mt-1 text-sm text-[#5B7C99]">{stamp(event.occurredAt)}</p>}
                        <p className={`mt-1 text-sm ${done || current ? "text-[#606977]" : "text-[#9AA3B0]"}`}>
                          {stage.note}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>

              {canMarkDelivered && (
                <button
                  type="button"
                  onClick={() => run(markDelivered)}
                  className="mt-4 h-11 w-full rounded-xl bg-emerald-600 text-sm font-semibold text-white"
                >
                  Mark as delivered
                </button>
              )}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="flex items-center gap-2 text-xl font-bold text-[#111827]">
                <MapPin className="h-[22px] w-[22px] text-[#0c7bb3]" />
                Shipping Details
              </h2>

              <Row
                label="Shipping Address"
                value={
                  <>
                    {address.streetAddress || "No address on file"}
                    <br />
                    {address.localArea}, {address.city}
                    <br />
                    {address.zone}, {address.postalCode}
                    <br />
                    {address.country}
                  </>
                }
              />
              <Row label="Carrier" value={shipment.courierName || "Not assigned"} />

              <div className="mt-5">
                <p className="text-sm text-[#606977]">Tracking Number</p>
                <p className="mt-1 font-mono text-[15px] text-[#0c7bb3]">{shipment.trackingNumber || "—"}</p>
              </div>

              <Row label="Estimated Delivery" value={shortDate(shipment.estimatedDeliveryAt)} />
            </section>
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-bold text-[#111827]">Product Information</h2>
              <div className="mt-5 flex items-start gap-5">
                {shipment.productImage ? (
                  <img src={shipment.productImage} alt="" className="h-24 w-24 shrink-0 rounded-xl object-cover" />
                ) : (
                  <span className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl bg-[#0c7bb3]/10 text-xl font-bold text-[#0c7bb3]">
                    {shipment.brand.initials}
                  </span>
                )}
                <div className="min-w-0">
                  <p className="text-[19px] font-bold text-[#111827]">
                    {shipment.productName || shipment.campaignTitle}
                  </p>
                  <p className="mt-1 text-[15px] text-[#606977]">{shipment.campaignTitle}</p>
                  {shipment.weightKg && <p className="mt-2 text-[15px] text-[#111827]">Weight: {shipment.weightKg} kg</p>}
                </div>
              </div>

              {dimensions && (
                <div className="mt-5 border-t border-gray-100 pt-5">
                  <p className="text-sm text-[#606977]">Dimensions</p>
                  <p className="mt-1 text-[15px] text-[#111827]">
                    {dimensions.length} × {dimensions.width} × {dimensions.height} cm
                  </p>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-6">
              <h2 className="text-xl font-bold text-[#111827]">Creator</h2>
              <div className="mt-5 flex items-center gap-4">
                <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#0c7bb3]/10 text-base font-bold text-[#0c7bb3]">
                  {shipment.creator.initials}
                </span>
                <div className="min-w-0">
                  <p className="text-[18px] font-bold text-[#111827]">{shipment.creator.name}</p>
                  <p className="mt-1 text-[15px] text-[#0c7bb3]">{shipment.creator.handle}</p>
                </div>
              </div>
            </section>

            {shipment.quotedAmount ? (
              <section className="rounded-2xl border border-gray-200 bg-white p-6">
                <h2 className="text-xl font-bold text-[#111827]">Booking</h2>
                <div className="mt-4 space-y-2 text-[15px]">
                  <div className="flex justify-between">
                    <span className="text-[#606977]">Courier</span>
                    <span className="font-semibold text-[#111827]">
                      {shipment.courierName} · {shipment.serviceLevel}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between">
                      <span className="text-[#606977]">Chargeable weight</span>
                      <span className="text-[#111827]">{shipment.chargeableKg} kg</span>
                    </div>
                    {Number(shipment.chargeableKg) > Number(shipment.weightKg) && (
                      <p className="mt-1 text-xs text-[#606977]">
                        Charged on parcel size, not its {Number(shipment.weightKg)} kg weight.
                      </p>
                    )}
                  </div>
                  <div className="flex justify-between border-t border-gray-100 pt-2">
                    <span className="text-[#606977]">Shipping paid</span>
                    <span className="font-bold text-[#111827]">R {Number(shipment.quotedAmount).toFixed(2)}</span>
                  </div>
                </div>
                {shipment.status === "awaiting_payment" ? (
                  <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
                    Waiting for payment. The courier is booked once payment clears.
                  </p>
                ) : shipment.paid === false ? (
                  <p className="mt-4 rounded-xl bg-slate-100 px-3 py-2 text-xs text-slate-600">
                    Booked without a charge.
                  </p>
                ) : null}
              </section>
            ) : null}

            {shipment.trackingUrl && (
              <a
                href={shipment.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-gradient flex h-[52px] w-full items-center justify-center rounded-xl text-base font-bold"
              >
                Track Package
              </a>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
