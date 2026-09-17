import { useEffect, useState } from "react";
import { EMPTY_ADDRESS, PROVINCES, validateAddress } from "../shipmentState";

const FIELDS = [
  { name: "contactName", label: "Contact name", placeholder: "Who the courier asks for" },
  { name: "contactMobile", label: "Contact number", placeholder: "+27 82 555 0142" },
  { name: "streetAddress", label: "Street address", placeholder: "22 Ealing Crescent" },
  { name: "localArea", label: "Suburb", placeholder: "Bryanston" },
  { name: "city", label: "City", placeholder: "Johannesburg" },
];

export default function AddressForm({ title, description, initial, onSave, saved }) {
  const [address, setAddress] = useState({ ...EMPTY_ADDRESS, ...(initial || {}) });
  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState("");

  useEffect(() => {
    if (initial) setAddress({ ...EMPTY_ADDRESS, ...initial });
  }, [initial]);

  const setField = (name) => (event) => {
    setAddress({ ...address, [name]: event.target.value });
    setDone(false);
  };

  const submit = async (event) => {
    event.preventDefault();
    const found = validateAddress(address);
    setErrors(found);
    if (Object.keys(found).length) return;

    setSaving(true);
    setFailed("");
    try {
      await onSave(address);
      setDone(true);
    } catch (saveError) {
      setFailed(saveError.message);
    } finally {
      setSaving(false);
    }
  };

  const inputClass = (name) =>
    `mt-2 w-full rounded-xl border px-3 py-3 text-sm ${
      errors[name] ? "border-red-400" : "border-slate-300"
    }`;

  return (
    <form onSubmit={submit} className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="mt-1 text-sm text-slate-500">{description}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {FIELDS.map((field) => (
          <label key={field.name} className="block text-sm font-semibold text-slate-700">
            {field.label}
            <input
              value={address[field.name]}
              onChange={setField(field.name)}
              placeholder={field.placeholder}
              className={inputClass(field.name)}
            />
            {errors[field.name] ? (
              <span className="mt-1 block text-xs font-normal text-red-600">{errors[field.name]}</span>
            ) : null}
          </label>
        ))}

        <label className="block text-sm font-semibold text-slate-700">
          Province
          <select value={address.zone} onChange={setField("zone")} className={inputClass("zone")}>
            <option value="">Choose a province</option>
            {PROVINCES.map((province) => (
              <option key={province}>{province}</option>
            ))}
          </select>
          {errors.zone ? (
            <span className="mt-1 block text-xs font-normal text-red-600">{errors.zone}</span>
          ) : null}
        </label>

        <label className="block text-sm font-semibold text-slate-700">
          Postal code
          <input
            value={address.postalCode}
            onChange={setField("postalCode")}
            placeholder="2191"
            inputMode="numeric"
            maxLength={4}
            className={inputClass("postalCode")}
          />
          {errors.postalCode ? (
            <span className="mt-1 block text-xs font-normal text-red-600">{errors.postalCode}</span>
          ) : (
            <span className="mt-1 block text-xs font-normal text-slate-400">
              Couriers can&apos;t quote without this
            </span>
          )}
        </label>
      </div>

      {failed ? <p className="mt-4 text-sm text-red-600">{failed}</p> : null}

      <div className="mt-6 flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save address"}
        </button>
        {(done || saved) && !saving ? <span className="text-sm text-green-600">Saved</span> : null}
      </div>
    </form>
  );
}
