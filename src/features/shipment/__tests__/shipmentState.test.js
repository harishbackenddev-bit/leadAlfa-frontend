import { describe, expect, it } from "vitest";
import { EMPTY_ADDRESS, validateAddress } from "../shipmentState";

const complete = {
  streetAddress: "22 Ealing Crescent",
  localArea: "Bryanston",
  city: "Johannesburg",
  zone: "Gauteng",
  postalCode: "2191",
  country: "South Africa",
  contactName: "Jane Doe",
  contactMobile: "+27 82 555 0142",
};

describe("address validation", () => {
  it("flags every required field on an empty address", () => {
    const errors = validateAddress(EMPTY_ADDRESS);

    expect(errors.streetAddress).toBeDefined();
    expect(errors.localArea).toBeDefined();
    expect(errors.city).toBeDefined();
    expect(errors.zone).toBeDefined();
    expect(errors.postalCode).toBeDefined();
    expect(errors.contactName).toBeDefined();
    expect(errors.contactMobile).toBeDefined();
  });

  it("rejects a postal code that is not four digits", () => {
    expect(validateAddress({ ...complete, postalCode: "21" }).postalCode).toBe("Must be 4 digits");
    expect(validateAddress({ ...complete, postalCode: "21910" }).postalCode).toBe("Must be 4 digits");
  });

  it("passes a complete address", () => {
    expect(validateAddress(complete)).toEqual({});
  });

  it("treats whitespace as missing", () => {
    expect(validateAddress({ ...complete, city: "   " }).city).toBe("Required");
  });

  it("does not require company or email", () => {
    const { ...withoutOptional } = complete;

    expect(validateAddress(withoutOptional)).toEqual({});
  });
});
