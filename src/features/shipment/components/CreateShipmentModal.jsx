import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronDown, ChevronUp, MapPin, Package, Pencil, Phone, Upload, X } from "lucide-react";
import CourierRateList from "./CourierRateList";
import { fetchCreatorDeliveryAddress } from "../../../services/api/shipmentApi";
import { normalizeCampaignList } from "../../../pages/brand/Campaigns/utils/campaignCardUtils";
import { mapAcceptedApplicantsToCreators, parseApplicantsResponse } from "../../../pages/brand/Campaigns/utils/proposalUtils";
import {
  getAllBrandCampaignsQueryOptions,
  getCreatorApplicationsQueryOptions,
} from "../../../services/tanstack/queryService";

const STEPS = ["Campaign", "Creators", "Product Details", "Courier"];

const emptyDetails = { productName: "", weightKg: "", length: "", width: "", height: "" };

const profileOf = (creator) => creator.raw?.creator || {};

const creatorLocation = (creator) => {
  const profile = profileOf(creator);
  return [profile.city, profile.province].filter(Boolean).join(", ");
};

const creatorPhoto = (creator) =>
  profileOf(creator).mediaLinks?.find((link) => link.usageType === "profile_photo")?.mediaDetails
    ?.url || null;

const ADDRESS_ROWS = [
  { field: "contactName", label: "Creator name" },
  { field: "contactMobile", label: "Phone number" },
  { field: "streetAddress", label: "Street address" },
  { field: "localArea", label: "Suburb" },
  { field: "city", label: "City" },
  { field: "zone", label: "Province" },
  { field: "postalCode", label: "Postal code" },
];

function AddressForm({ address, onSave, onCancel }) {
  const [draft, setDraft] = useState(() =>
    ADDRESS_ROWS.reduce((acc, row) => ({ ...acc, [row.field]: address?.[row.field] || "" }), {})
  );

  const complete = ADDRESS_ROWS.every((row) => draft[row.field].trim());

  return (
    <div className="mx-3 mb-3 rounded-lg bg-[#f7f8f9] p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-[#98a1ae]">Edit delivery address</p>
      <div className="mt-2 space-y-2">
        {ADDRESS_ROWS.map((row) => (
          <label key={row.field} className="block">
            <span className="text-xs text-[#606977]">{row.label}</span>
            <input
              value={draft[row.field]}
              onChange={(event) => setDraft({ ...draft, [row.field]: event.target.value })}
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#111827] outline-none focus:border-[#0c7bb3]"
            />
          </label>
        ))}
      </div>
      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#606977] hover:bg-white"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={!complete}
          onClick={() => onSave({ ...address, ...draft })}
          className="rounded-lg bg-[#0c7bb3] px-3 py-2 text-sm font-semibold text-white disabled:opacity-50"
        >
          Save address
        </button>
      </div>
    </div>
  );
}

function DeliveryAddress({ campaignId, creatorId, override, onOverride }) {
  const [editing, setEditing] = useState(false);
  const { data: saved, isLoading, error } = useQuery({
    queryKey: ["creatorDeliveryAddress", campaignId, creatorId],
    queryFn: () => fetchCreatorDeliveryAddress(campaignId, creatorId),
    staleTime: 5 * 60 * 1000,
  });

  const address = override || saved;

  if (isLoading) return <p className="px-3 pb-3 text-sm text-[#606977]">Loading address...</p>;
  if (error) return <p className="px-3 pb-3 text-sm text-red-600">{error.message}</p>;

  if (editing) {
    return (
      <AddressForm
        address={address}
        onSave={(next) => {
          onOverride(next);
          setEditing(false);
        }}
        onCancel={() => setEditing(false)}
      />
    );
  }

  if (!address) {
    return (
      <div className="mx-3 mb-3 rounded-lg bg-amber-50 p-3">
        <p className="text-sm text-amber-800">This creator has not added a delivery address yet.</p>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-2 text-sm font-semibold text-[#0c7bb3]"
        >
          Add a delivery address
        </button>
      </div>
    );
  }

  return (
    <div className="mx-3 mb-3 flex gap-3 rounded-lg bg-[#f7f8f9] p-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#98a1ae]">
        <MapPin className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-[#98a1ae]">
            Delivery address{override ? " (edited)" : ""}
          </p>
          <div className="flex items-center gap-2">
            {override && (
              <button
                type="button"
                onClick={() => onOverride(null)}
                className="text-xs font-semibold text-[#606977] hover:text-[#111827]"
              >
                Reset
              </button>
            )}
            <button
              type="button"
              onClick={() => setEditing(true)}
              aria-label="Edit delivery address"
              className="text-[#606977] hover:text-[#0c7bb3]"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
        <div className="mt-1.5 text-sm leading-6 text-[#111827]">
          {address.contactName && <p className="font-semibold">{address.contactName}</p>}
          <p>{address.streetAddress}</p>
          <p>{[address.localArea, address.city].filter(Boolean).join(", ")}</p>
          <p>{[address.zone, address.postalCode].filter(Boolean).join(", ")}</p>
          {address.contactMobile && (
            <p className="flex items-center gap-1.5 text-[#606977]">
              <Phone className="h-3.5 w-3.5 shrink-0" />
              {address.contactMobile}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Stepper({ step }) {
  return (
    <div className="flex items-center">
      {STEPS.map((label, index) => {
        const number = index + 1;
        const done = step > number;
        return (
          <div key={label} className={`flex items-center ${index < STEPS.length - 1 ? "flex-1" : ""}`}>
            <div className="flex flex-col items-center gap-2">
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                  step >= number ? "bg-[#0c7bb3] text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                {done ? <Check className="h-4 w-4" strokeWidth={3} /> : number}
              </span>
              <span className={`text-xs ${step >= number ? "text-[#0c7bb3]" : "text-gray-500"}`}>{label}</span>
            </div>
            {index < STEPS.length - 1 && (
              <span className={`mx-3 mb-6 h-0.5 flex-1 ${step > number ? "bg-[#0c7bb3]" : "bg-gray-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function CreateShipmentModal({ onClose, onCreate }) {
  const [step, setStep] = useState(1);
  const [campaign, setCampaign] = useState(null);
  const [creatorIds, setCreatorIds] = useState([]);
  const [addressOpenId, setAddressOpenId] = useState(null);
  const [addressOverrides, setAddressOverrides] = useState({});
  const [details, setDetails] = useState(emptyDetails);
  const [productImage, setProductImage] = useState("");
  const [rateId, setRateId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { data: apiCampaigns = [], isLoading: loadingCampaigns } = useQuery(getAllBrandCampaignsQueryOptions());
  const campaigns = useMemo(() => normalizeCampaignList(apiCampaigns), [apiCampaigns]);
  const campaignId = campaign?.raw?.id;

  const { data: applicants, isLoading: loadingCreators } = useQuery({
    ...getCreatorApplicationsQueryOptions(campaignId),
    enabled: !!campaignId,
  });

  const creators = useMemo(
    () => mapAcceptedApplicantsToCreators(parseApplicantsResponse(applicants)),
    [applicants]
  );
  const selected = creators.filter((creator) => creatorIds.includes(creator.id));
  const detailsValid =
    details.productName.trim() &&
    Number(details.weightKg) > 0 &&
    [details.length, details.width, details.height].every((value) => Number(value) > 0);

  const setField = (field) => (event) => setDetails({ ...details, [field]: event.target.value });

  const pickCampaign = (event) => {
    setCampaign(campaigns.find((item) => String(item.raw?.id) === event.target.value) || null);
    setCreatorIds([]);
    setAddressOpenId(null);
    setAddressOverrides({});
  };

  const firstSelectedId = selected[0]?.id;
  const { data: firstSavedAddress } = useQuery({
    queryKey: ["creatorDeliveryAddress", campaignId, firstSelectedId],
    queryFn: () => fetchCreatorDeliveryAddress(campaignId, firstSelectedId),
    enabled: Boolean(campaignId && firstSelectedId),
    staleTime: 5 * 60 * 1000,
  });
  const courierDeliveryTo = addressOverrides[firstSelectedId] || firstSavedAddress;

  const setOverride = (creatorId) => (address) =>
    setAddressOverrides((current) => {
      const next = { ...current };
      if (address) next[creatorId] = address;
      else delete next[creatorId];
      return next;
    });

  const toggleCreator = (id) =>
    setCreatorIds(creatorIds.includes(id) ? creatorIds.filter((item) => item !== id) : [...creatorIds, id]);

  const readImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, 500 / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);

        let quality = 0.7;
        let url = canvas.toDataURL("image/jpeg", quality);
        while (url.length > 90000 && quality > 0.3) {
          quality -= 0.1;
          url = canvas.toDataURL("image/jpeg", quality);
        }
        setProductImage(url);
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  };

  const chargeable = Math.round(
    Math.max(
      Number(details.weightKg) || 0,
      ((Number(details.length) || 0) * (Number(details.width) || 0) * (Number(details.height) || 0)) / 4000
    )
  );
  const overCourierLimit = chargeable > 300;

  const parcel = {
    weightKg: Number(details.weightKg),
    lengthCm: Number(details.length),
    widthCm: Number(details.width),
    heightCm: Number(details.height),
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submit();
    } finally {
      setSubmitting(false);
    }
  };

  const submit = () =>
    onCreate({
      campaignId,
      creatorIds: selected.map((creator) => creator.id),
      productName: details.productName.trim(),
      productImage,
      rateId,
      deliveryAddresses: addressOverrides,
      ...parcel,
    });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 p-4">
      <div className="flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between gap-4 px-6 pt-6">
          <div>
            <h2 className="text-xl font-bold text-[#111827]">Create Shipment</h2>
            <p className="mt-1 text-sm text-[#606977]">Step {step} of {STEPS.length}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="text-gray-400 hover:text-gray-600">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-gray-100 px-6 py-5">
          <Stepper step={step} />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {step === 1 && (
            <>
              <p className="text-sm font-semibold text-[#111827]">
                Select Campaign <span className="text-red-500">*</span>
              </p>
              <p className="mt-1 text-sm text-[#606977]">Choose the campaign you want to ship products for.</p>
              <select
                value={campaignId ? String(campaignId) : ""}
                onChange={pickCampaign}
                disabled={loadingCampaigns}
                className="mt-4 h-12 w-full rounded-xl border border-gray-300 px-3 text-sm text-[#111827] disabled:bg-gray-50"
              >
                <option value="">{loadingCampaigns ? "Loading campaigns..." : "Select a campaign..."}</option>
                {campaigns.map((item) => (
                  <option key={item.publicId} value={String(item.raw?.id)}>
                    {item.title}
                  </option>
                ))}
              </select>

              {campaign && (
                <div className="mt-4 flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0c7bb3]/10 text-[#0c7bb3]">
                    <Package className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-semibold text-[#111827]">{campaign.title}</p>
                    <p className="text-sm text-[#606977]">
                      {loadingCreators ? "Loading creators..." : `${creators.length} creators assigned`}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          {step === 2 && (
            <>
              <p className="text-sm font-semibold text-[#111827]">
                Select Creators <span className="text-red-500">*</span>
              </p>
              <p className="mt-1 text-sm text-[#606977]">
                Select creators to ship to. Verify each delivery address before proceeding.
              </p>
              <button
                type="button"
                onClick={() => setCreatorIds(creatorIds.length === creators.length ? [] : creators.map((c) => c.id))}
                className="mt-4 text-sm font-semibold text-[#0c7bb3]"
              >
                {creatorIds.length === creators.length ? "Clear all" : "Select all"}
              </button>

              {loadingCreators && <p className="mt-4 text-sm text-[#606977]">Loading creators...</p>}

              {!loadingCreators && !creators.length && (
                <p className="mt-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm text-[#606977]">
                  No creators have been hired for this campaign yet.
                </p>
              )}

              <div className="mt-3 space-y-3">
                {creators.map((creator) => {
                  const checked = creatorIds.includes(creator.id);
                  const location = creatorLocation(creator);
                  const photo = creatorPhoto(creator);
                  const showAddress = addressOpenId === creator.id;
                  return (
                    <div
                      key={creator.id}
                      className={`rounded-xl border ${
                        checked ? "border-[#0c7bb3] bg-[#0c7bb3]/5" : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3 p-3">
                        <label className="flex min-w-0 flex-1 cursor-pointer items-center gap-3">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggleCreator(creator.id)}
                            className="h-5 w-5 shrink-0 accent-[#0c7bb3]"
                          />
                          {photo ? (
                            <img
                              src={photo}
                              alt={creator.name}
                              className="h-10 w-10 shrink-0 rounded-full object-cover"
                            />
                          ) : (
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0c7bb3]/10 text-sm font-bold text-[#0c7bb3]">
                              {creator.initials}
                            </span>
                          )}
                          <span className="min-w-0">
                            <span className={`block font-semibold ${checked ? "text-[#0c7bb3]" : "text-[#111827]"}`}>
                              {creator.name}
                            </span>
                            <span className="block text-sm text-[#606977]">{creator.handle}</span>
                            {location && (
                              <span className="mt-0.5 flex items-center gap-1 text-sm text-[#98a1ae]">
                                <MapPin className="h-3.5 w-3.5 shrink-0" />
                                {location}
                              </span>
                            )}
                          </span>
                        </label>
                        <button
                          type="button"
                          onClick={() => setAddressOpenId(showAddress ? null : creator.id)}
                          aria-expanded={showAddress}
                          className={`flex shrink-0 items-center gap-1.5 rounded-lg border px-3 py-2 text-sm ${
                            showAddress
                              ? "border-[#0c7bb3] bg-[#0c7bb3]/5 text-[#0c7bb3]"
                              : "border-gray-200 text-[#606977] hover:bg-gray-50"
                          }`}
                        >
                          <MapPin className="h-4 w-4" />
                          Address
                          {showAddress ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </button>
                      </div>
                      {showAddress && (
                        <DeliveryAddress
                          campaignId={campaignId}
                          creatorId={creator.id}
                          override={addressOverrides[creator.id]}
                          onOverride={setOverride(creator.id)}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {selected.length > 0 && (
                <p className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
                  <Check className="h-4 w-4" strokeWidth={3} />
                  {selected.length} creator{selected.length > 1 ? "s" : ""} selected
                </p>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <label className="block text-sm font-semibold text-[#111827]">
                Shipping Name <span className="text-red-500">*</span>
                <input
                  value={details.productName}
                  onChange={setField("productName")}
                  placeholder="e.g. Summer Fashion Collection Product"
                  className="mt-2 h-12 w-full rounded-xl border border-gray-300 px-3 text-sm font-normal"
                />
              </label>

              <label className="mt-4 block text-sm font-semibold text-[#111827]">
                Weight (kg) <span className="text-red-500">*</span>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={details.weightKg}
                  onChange={setField("weightKg")}
                  placeholder="e.g. 1.5"
                  className="mt-2 h-12 w-full rounded-xl border border-gray-300 px-3 text-sm font-normal"
                />
              </label>

              <p className="mt-4 text-sm font-semibold text-[#111827]">
                Dimensions (cm) <span className="text-red-500">*</span>
              </p>
              <div className="mt-2 grid grid-cols-3 gap-3">
                {[["length", "L"], ["width", "W"], ["height", "H"]].map(([field, suffix]) => (
                  <div key={field} className="relative">
                    <input
                      type="number"
                      min="0"
                      value={details[field]}
                      onChange={setField(field)}
                      placeholder="0"
                      className="h-12 w-full rounded-xl border border-gray-300 pl-3 pr-8 text-sm"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">{suffix}</span>
                  </div>
                ))}
              </div>
              <p className="mt-2 text-xs text-gray-400">Length × Width × Height in centimetres</p>

              <p
                className={`mt-2 text-xs ${
                  overCourierLimit ? "font-semibold text-red-600" : "text-gray-400"
                }`}
              >
                Couriers take up to 300 kg chargeable weight, whichever is greater of the actual
                weight or L × W × H / 4000.
                {chargeable > 0 && ` This parcel is ${chargeable} kg.`}
              </p>

              <p className="mt-4 text-sm font-semibold text-[#111827]">
                Product Image <span className="font-normal text-gray-400">(optional)</span>
              </p>
              <label className="mt-2 flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gray-300 py-8 hover:bg-gray-50">
                {productImage ? (
                  <img src={productImage} alt="" className="h-20 w-20 rounded-xl object-cover" />
                ) : (
                  <Upload className="h-6 w-6 text-gray-400" />
                )}
                <span className="text-sm text-[#606977]">
                  {productImage ? "Change product image" : "Click to upload product image"}
                </span>
                <input type="file" accept="image/*" onChange={readImage} className="hidden" />
              </label>

              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-gray-500">Summary</p>
                <div className="mt-3 flex justify-between text-sm">
                  <span className="text-[#606977]">Campaign</span>
                  <span className="font-semibold text-[#111827]">{campaign?.title}</span>
                </div>
                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-[#606977]">Creators</span>
                  <span className="font-semibold text-[#111827]">{selected.length} selected</span>
                </div>
              </div>
            </>
          )}
          {step === 4 && (
            <>
              <p className="text-sm font-semibold text-[#111827]">Choose a courier</p>
              <p className="mt-1 text-sm text-[#606977]">
                Shipping is charged per creator and paid before the courier is booked.
              </p>
              <div className="mt-4">
                <CourierRateList
                  parcel={parcel}
                  creatorId={selected[0]?.id}
                  creatorCount={selected.length}
                  addressOverride={addressOverrides[firstSelectedId]}
                  deliveryTo={courierDeliveryTo}
                  selectedId={rateId}
                  onSelect={setRateId}
                />
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-gray-100 px-6 py-4">
          <button
            type="button"
            onClick={step === 1 ? onClose : () => setStep(step - 1)}
            className="h-11 rounded-xl border border-gray-300 px-5 text-sm font-semibold text-[#111827] hover:bg-gray-50"
          >
            {step === 1 ? "Cancel" : "Back"}
          </button>

          {step < STEPS.length ? (
            <button
              type="button"
              disabled={
                (step === 1 && (!campaign || loadingCreators)) ||
                (step === 2 && !selected.length) ||
                (step === 3 && (!detailsValid || overCourierLimit))
              }
              onClick={() => setStep(step + 1)}
              className="h-11 rounded-xl bg-[#0c7bb3] px-6 text-sm font-semibold text-white disabled:opacity-40"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              disabled={!rateId || submitting}
              onClick={handleSubmit}
              className="flex h-11 items-center gap-2 rounded-xl bg-[#0c7bb3] px-6 text-sm font-semibold text-white disabled:opacity-40"
            >
              <Package className="h-4 w-4" />
              {submitting ? "Opening payment..." : "Pay & book"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
