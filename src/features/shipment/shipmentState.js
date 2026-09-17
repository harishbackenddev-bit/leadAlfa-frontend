export const EMPTY_ADDRESS = {
  streetAddress: "",
  localArea: "",
  city: "",
  zone: "",
  postalCode: "",
  country: "South Africa",
  contactName: "",
  contactMobile: "",
  contactEmail: "",
  company: "",
};

export const PROVINCES = [
  "Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo",
  "Mpumalanga", "Northern Cape", "North West", "Western Cape",
];

const REQUIRED_ADDRESS_FIELDS = [
  "streetAddress", "localArea", "city", "zone", "postalCode", "contactName", "contactMobile",
];

export function validateAddress(address) {
  const errors = {};
  REQUIRED_ADDRESS_FIELDS.forEach((field) => {
    if (!String(address?.[field] ?? "").trim()) errors[field] = "Required";
  });
  const code = String(address?.postalCode ?? "").trim();
  if (code && !/^\d{4}$/.test(code)) errors.postalCode = "Must be 4 digits";
  return errors;
}

export const isAddressComplete = (address) => Object.keys(validateAddress(address)).length === 0;
