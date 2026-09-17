import { describe, expect, it } from "vitest";
import { resolveApiBaseUrl } from "../apiBaseUrl";

describe("resolveApiBaseUrl", () => {
  it("does not use a localhost API URL from a deployed browser", () => {
    expect(resolveApiBaseUrl("http://localhost:3000", "frontend-tgaurav1k-tgaurav1ks-projects.vercel.app")).toBe("https://creatrend-backend.onrender.com/api");
  });

  it("allows the local API URL during local development", () => {
    expect(resolveApiBaseUrl("http://localhost:8080/api", "localhost")).toBe("http://localhost:8080/api");
  });
});
