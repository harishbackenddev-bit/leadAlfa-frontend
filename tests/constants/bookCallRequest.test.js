import { describe, it, expect } from "vitest";
import {
  BOOK_CALL_FIELD_MESSAGES,
  isValidWebsiteUrl,
  normalizeWebsiteUrl,
  validateBookCallForm,
} from "../../src/constants/bookCallRequest";

const validForm = {
  name: "John Doe",
  businessEmail: "john@company.com",
  companyName: "Acme Inc.",
  companyWebsite: "https://acme.com",
  agreedToTerms: true,
};

describe("book call validation", () => {
  it("should prepend https:// when the protocol is missing", () => {
    expect(normalizeWebsiteUrl("acme.com")).toBe("https://acme.com");
    expect(normalizeWebsiteUrl("https://acme.com")).toBe("https://acme.com");
  });

  it("should accept company websites with a real hostname", () => {
    expect(isValidWebsiteUrl("acme.com")).toBe(true);
    expect(isValidWebsiteUrl("not-a-url")).toBe(false);
  });

  it("should return no errors for a valid form", () => {
    expect(validateBookCallForm(validForm)).toEqual({});
  });

  it("should return field messages for empty values", () => {
    expect(validateBookCallForm({
      name: " ",
      businessEmail: "",
      companyName: "A",
      companyWebsite: "",
      agreedToTerms: false,
    })).toEqual(BOOK_CALL_FIELD_MESSAGES);
  });

  it("should reject an invalid email", () => {
    const errors = validateBookCallForm({
      ...validForm,
      businessEmail: "john@",
    });
    expect(errors.businessEmail).toBe(BOOK_CALL_FIELD_MESSAGES.businessEmail);
  });
});
