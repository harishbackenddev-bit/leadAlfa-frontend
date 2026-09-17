import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";
import { loginUser } from "../../src/services/api/apiservices";

vi.mock("axios", () => ({
  default: {
    post: vi.fn(),
    create: vi.fn(() => ({
      post: vi.fn(),
      get: vi.fn(),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    })),
  },
}));

describe("loginUser API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should POST credentials to login endpoint on success", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        user: { email: "user@example.com", auth_token: "jwt-token" },
      },
    });

    const credentials = {
      email: "user@example.com",
      password: "Password123",
    };

    const result = await loginUser(credentials);

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/users/login"),
      credentials
    );
    expect(result.user.auth_token).toBe("jwt-token");
  });

  it("should include captchaToken in login payload when provided", async () => {
    axios.post.mockResolvedValueOnce({
      data: { user: { email: "user@example.com", auth_token: "jwt-token" } },
    });

    await loginUser({
      email: "user@example.com",
      password: "Password123",
      captchaToken: "turnstile-token-abc",
    });

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/users/login"),
      {
        email: "user@example.com",
        password: "Password123",
        captchaToken: "turnstile-token-abc",
      }
    );
  });

  it("should throw captcha validation error with status on 400 response", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          error: "Turnstile verification failed",
        },
      },
    });

    await expect(
      loginUser({
        email: "user@example.com",
        password: "Password123",
        captchaToken: "bad-token",
      })
    ).rejects.toMatchObject({
      error: "Turnstile verification failed",
    });
  });

  it("should throw missing token error on 400 response", async () => {
    axios.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: {
          error: "Missing CAPTCHA token",
        },
      },
    });

    await expect(
      loginUser({
        email: "user@example.com",
        password: "Password123",
      })
    ).rejects.toMatchObject({
      error: "Missing CAPTCHA token",
    });
  });
});
