import { useEffect, useState } from "react";
import { fetchAddress, quoteRates } from "../../../services/api/shipmentApi";

const rand = (amount) => `R ${Number(amount).toFixed(2)}`;

export default function CourierRateList({ parcel, creatorId, creatorCount = 1, selectedId, onSelect, deliveryTo, addressOverride }) {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    fetchAddress("brand").then(setCollection).catch(() => setCollection(null));
  }, []);

  useEffect(() => {
    let active = true;
    setLoading(true);
    quoteRates({ ...parcel, creatorId, deliveryAddress: addressOverride })
      .then((list) => {
        if (!active) return;
        setRates(list);
        setError("");
        if (!list.some((rate) => rate.id === selectedId)) onSelect(list[0]?.id ?? "");
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parcel.weightKg, parcel.lengthCm, parcel.widthCm, parcel.heightCm, creatorId, addressOverride]);

  const selected = rates.find((rate) => rate.id === selectedId);
  const billedOnSize = Number(selected?.chargeableKg) > Number(parcel.weightKg);

  if (loading) {
    return <p className="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500">Checking couriers...</p>;
  }

  if (!rates.length) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <h3 className="font-bold text-slate-900">No couriers available</h3>
        <p className="mt-1 text-sm text-slate-600">{error || "Check the parcel weight and size."}</p>
      </div>
    );
  }

  const line = (a) =>
    a ? [a.streetAddress, a.localArea, a.city, a.zone, a.postalCode].filter(Boolean).join(", ") : "Not set";

  return (
    <div>
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm">
        <div>
          <p className="font-semibold text-slate-700">Collecting from</p>
          <p className="mt-1 text-slate-600">{line(collection)}</p>
        </div>
        <div className="mt-3 border-t border-slate-200 pt-3">
          <p className="font-semibold text-slate-700">Delivering to</p>
          <p className="mt-1 text-slate-600">
            {creatorCount > 1
              ? `${creatorCount} creators, each to their own delivery address`
              : line(deliveryTo)}
          </p>
          {creatorCount === 1 && (
            <p className="mt-1 text-xs font-semibold text-[#0c7bb3]">
              {addressOverride ? "Edited by you for this shipment" : "The creator's saved address"}
            </p>
          )}
        </div>
      </div>

      <div className="mt-4 text-sm text-slate-500">
        <p>Priced on {selected?.chargeableKg} kg chargeable weight.</p>
        {billedOnSize && (
          <p className="mt-1">
            Your parcel weighs {Number(parcel.weightKg)} kg, but at {Number(parcel.lengthCm)} x{" "}
            {Number(parcel.widthCm)} x {Number(parcel.heightCm)} cm it takes up the space of{" "}
            {selected?.chargeableKg} kg, so the courier charges for the larger of the two.
          </p>
        )}
      </div>

      <div className="mt-4 space-y-2">
        {rates.map((rate) => (
          <label
            key={rate.id}
            className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 ${
              rate.id === selectedId ? "border-blue-500 bg-blue-50" : "border-slate-200"
            }`}
          >
            <input
              type="radio"
              name="courier"
              value={rate.id}
              checked={rate.id === selectedId}
              onChange={() => onSelect(rate.id)}
              className="h-4 w-4"
            />
            <span className="flex-1">
              <span className="block text-sm font-semibold text-slate-900">
                {rate.courierName} — {rate.serviceLevel}
              </span>
              <span className="block text-xs text-slate-500">{rate.eta}</span>
            </span>
            <span className="text-sm font-bold text-slate-900">{rand(rate.amount)}</span>
          </label>
        ))}
      </div>

      {selected && (
        <div className="mt-5 space-y-1 border-t border-slate-200 pt-4 text-sm">
          {creatorCount > 1 && (
            <div className="flex justify-between text-slate-600">
              <span>
                {rand(selected.amount)} x {creatorCount} creators
              </span>
              <span>{rand(selected.amount * creatorCount)}</span>
            </div>
          )}
          <div className="flex justify-between font-bold text-slate-900">
            <span>Total to pay</span>
            <span>{rand(selected.amount * creatorCount)}</span>
          </div>
        </div>
      )}

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
