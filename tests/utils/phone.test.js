import { describe, expect, it } from "vitest";
import { isE164Phone, normalizeOptionalE164Phone, toE164Phone } from "../../src/utils/phone";

describe("phone helpers", () => {
  it("normalizes formatted numbers to E.164", () => {
    expect(toE164Phone("+27 82 123 4567")).toBe("+27821234567");
    expect(toE164Phone("")).toBe("");
  });

  it("accepts South African mobile E.164 numbers", () => {
    expect(isE164Phone("+27821234567")).toBe(true);
    expect(isE164Phone("+27 82 123 4567")).toBe(true);
  });

  it("rejects missing, landline, or non-SA numbers", () => {
    expect(isE164Phone("")).toBe(false);
    expect(isE164Phone("+27")).toBe(false);
    expect(isE164Phone("0821234567")).toBe(false);
    expect(isE164Phone("+27211234567")).toBe(false);
    expect(isE164Phone("+12025551234")).toBe(false);
  });

  it("treats a dial code alone as empty for optional fields", () => {
    expect(normalizeOptionalE164Phone("+27")).toBe("");
    expect(normalizeOptionalE164Phone("+27821234567")).toBe("+27821234567");
  });
});
