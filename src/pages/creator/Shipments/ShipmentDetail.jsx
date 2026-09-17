import { ArrowLeft, CircleAlert, CircleCheckBig, Clock, ExternalLink } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import TrackingTimeline from "../../../features/shipment/components/TrackingTimeline";
import { useShipments } from "../../../features/shipment/useShipments";

const CONTENT_WINDOW_DAYS = 7;

const shortDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-ZA", { day: "numeric", month: "short", year: "numeric" })
    : "—";

const longDate = (value) =>
  new Date(value).toLocaleDateString("en-ZA", { month: "long", day: "numeric", year: "numeric" });

export default function ShipmentDetail() {
  const { id } = useParams();
  const { shipments, confirmReceived } = useShipments("creator");
  const shipment = shipments.find((item) => String(item.id) === String(id));

  if (!shipment) {
    return (
      <div className="min-h-screen bg-[#FAFBFC] px-4 py-16 text-center">
        <p className="text-[#606977]">We couldn&apos;t find that shipment.</p>
        <Link to="/creator/shipments" className="mt-3 inline-block font-semibold text-[#0c7bb3]">
          Back to Shipments
        </Link>
      </div>
    );
  }

  const needsConfirmation = shipment.status === "delivered";
  const title = shipment.productName || shipment.campaignTitle;
  const campaignLabel = title === shipment.campaignTitle ? "" : shipment.campaignTitle;
  const address = shipment.deliveryAddress?.streetAddress ? shipment.deliveryAddress : null;
  const daysLeft = shipment.contentDeadlineAt
    ? Math.max(0, Math.ceil((new Date(shipment.contentDeadlineAt) - Date.now()) / 86400000))
    : null;
  const previewDeadline = longDate(Date.now() + CONTENT_WINDOW_DAYS * 86400000);

  return (
    <div className="min-h-screen bg-[#FAFBFC]">
      <div className="mx-auto max-w-[1240px] px-4 py-8 md:px-6">
        <Link
          to="/creator/shipments"
          className="inline-flex items-center gap-2 text-[17px] font-semibold text-[#5B7C99] hover:text-[#0c7bb3]"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Shipments
        </Link>

        <h1 className="sr-only">{title} shipment</h1>

        {needsConfirmation && (
          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-amber-300 bg-amber-100/70 p-4 sm:flex-row sm:items-center sm:p-5">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-amber-200/80">
              <CircleAlert className="h-6 w-6 text-amber-700" />
            </span>
            <div className="flex-1">
              <p className="text-base font-bold text-amber-900 sm:text-lg">
                Action Required — Confirm You Received This Shipment
              </p>
              <p className="mt-1 text-base text-amber-900/80">
                {shipment.brand.name} has shipped the product. Confirm receipt to start your contract.
              </p>
            </div>
            <button
              type="button"
              onClick={() => confirmReceived(shipment.id)}
              className="h-[49px] shrink-0 rounded-xl bg-amber-700 px-6 text-sm font-bold text-white hover:bg-amber-800"
            >
              Confirm Receipt
            </button>
          </div>
        )}

        <div className="mt-8 grid gap-7 lg:grid-cols-2">
          <div className="space-y-7">
            <TrackingTimeline shipment={shipment} creator />

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_2px_0_rgb(16_24_40_/_0.04)] sm:p-6">
              <h2 className="text-xl font-bold text-[#111827]">Shipment Details</h2>
              <dl className="mt-5 space-y-4 text-base">
                <div className="flex justify-between gap-4">
                  <dt className="text-[#5B7C99]">Tracking Number</dt>
                  <dd className="font-mono font-semibold text-[#0c7bb3]">{shipment.trackingNumber || "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#5B7C99]">Courier</dt>
                  <dd className="font-semibold text-[#0c7bb3]">{shipment.courierName || "—"}</dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#5B7C99]">Shipped</dt>
                  <dd className="font-semibold text-[#0c7bb3]">
                    {shortDate(shipment.events?.find((event) => event.type === "in_transit")?.occurredAt)}
                  </dd>
                </div>
                <div className="flex justify-between gap-4">
                  <dt className="text-[#5B7C99]">Estimated Delivery</dt>
                  <dd className="font-semibold text-[#0c7bb3]">{shortDate(shipment.estimatedDeliveryAt)}</dd>
                </div>
                {address && (
                  <div className="border-t border-gray-100 pt-4">
                    <dt className="text-[#5B7C99]">Delivering To</dt>
                    <dd className="mt-1 font-semibold text-[#111827]">
                      {address.streetAddress}
                      <br />
                      {[address.localArea, address.city].filter(Boolean).join(", ")}
                      <br />
                      {[address.zone, address.postalCode].filter(Boolean).join(", ")}
                    </dd>
                  </div>
                )}
              </dl>
            </section>
          </div>

          <aside className="space-y-7">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_2px_0_rgb(16_24_40_/_0.04)] sm:p-6">
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
                  <p className="text-[19px] font-bold text-[#111827]">{title}</p>
                  {campaignLabel && <p className="mt-2 text-base text-[#0c7bb3]">{campaignLabel}</p>}
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-[0_1px_2px_0_rgb(16_24_40_/_0.04)] sm:p-6">
              <h2 className="text-xl font-bold text-[#111827]">Sent By</h2>
              <div className="mt-5 flex items-center gap-4">
                <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-[#0c7bb3]/10 text-base font-bold text-[#0c7bb3]">
                  {shipment.brand.initials}
                </span>
                <div className="min-w-0">
                  <p className="text-[18px] font-bold text-[#111827]">{shipment.brand.name}</p>
                  <p className="mt-1 text-base text-[#0c7bb3]">{shipment.campaignTitle}</p>
                </div>
              </div>
            </section>

            {(needsConfirmation || daysLeft !== null) && (
              <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-6">
                <Clock className="mt-0.5 h-[18px] w-[18px] shrink-0 text-amber-700" />
                <div>
                  <p className="text-[17px] font-bold text-amber-800">Contract Deadline</p>
                  {daysLeft === null ? (
                    <p className="mt-1 text-base text-amber-900">
                      Once confirmed, your content deadline will be{" "}
                      <span className="font-bold">{previewDeadline}</span>. Confirming receipt starts the countdown.
                    </p>
                  ) : (
                    <p className="mt-1 text-base text-amber-900">
                      <span className="font-bold">{daysLeft} days</span> left to upload — due{" "}
                      {longDate(shipment.contentDeadlineAt)}.
                    </p>
                  )}
                </div>
              </div>
            )}

            {needsConfirmation && (
              <button
                type="button"
                onClick={() => confirmReceived(shipment.id)}
                className="btn-gradient flex h-[55px] w-full items-center justify-center gap-2 rounded-xl text-lg font-bold"
              >
                <CircleCheckBig className="h-[22px] w-[22px]" />
                Yes, I Received the Product
              </button>
            )}

            {shipment.trackingUrl && (
              <a
                href={shipment.trackingUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-[49px] w-full items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white text-base font-semibold text-[#5B7C99] shadow-[0_1px_2px_0_rgb(16_24_40_/_0.04)] hover:bg-gray-50"
              >
                <ExternalLink className="h-5 w-5" />
                Track via Courier Website
              </a>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
