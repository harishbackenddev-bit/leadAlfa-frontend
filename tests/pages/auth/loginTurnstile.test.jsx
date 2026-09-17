import { describe, it, expect, vi, beforeEach } from "vitest";
import { useEffect } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Login from "../../../src/pages/auth/Login";
import authReducer from "../../../src/store/slices/authSlice";
import {
  TURNSTILE_FAILED_MESSAGE,
  TURNSTILE_MISSING_TOKEN_MESSAGE,
} from "../../../src/utils/turnstileErrors";

const mockLogin = vi.fn();
const mockNavigate = vi.fn();
let turnstileAutoSuccess = true;

vi.mock("@auth0/auth0-react", () => ({
  useAuth0: () => ({
    loginWithRedirect: vi.fn(),
  }),
}));

vi.mock("../../../src/pages/auth/hooks/useAuthHook", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useAuth: () => ({
      login: mockLogin,
      loading: false,
    }),
  };
});

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("../../../src/constants/turnstile", () => ({
  TURNSTILE_ENABLED: true,
  TURNSTILE_SITE_KEY: "1x0000000000000000000000000000000AA",
}));

vi.mock("../../../src/components/common/TurnstileWidget", () => ({
  default: ({ onSuccess, onExpire, onError }) => {
    useEffect(() => {
      if (turnstileAutoSuccess) {
        onSuccess?.("test-captcha-token");
      }
      // Only auto-verify once on mount; retry is tested via manual button.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div data-testid="turnstile-widget">
        <button type="button" onClick={() => onSuccess?.("manual-captcha-token")}>
          Complete verification
        </button>
        <button type="button" onClick={() => onExpire?.()}>
          Expire verification
        </button>
        <button type="button" onClick={() => onError?.()}>
          Fail verification
        </button>
      </div>
    );
  },
}));

const renderLogin = () => {
  const store = configureStore({
    reducer: { auth: authReducer },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/login"]}>
        <Login />
      </MemoryRouter>
    </Provider>
  );
};

describe("Login page Turnstile integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    turnstileAutoSuccess = true;
  });

  it("should render Turnstile widget on login form", () => {
    renderLogin();

    expect(screen.getByTestId("turnstile-widget")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login now/i })).toBeInTheDocument();
  });

  it("should send captchaToken with login credentials on submit", async () => {
    mockLogin.mockResolvedValueOnce({ user: { email: "user@example.com" } });
    const user = userEvent.setup();

    renderLogin();

    await user.type(screen.getByPlaceholderText("Enter Email Address"), "user@example.com");
    await user.type(screen.getByPlaceholderText("Enter Password"), "Password123");
    await user.click(screen.getByRole("button", { name: /login now/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "user@example.com",
        password: "Password123",
        captchaToken: "test-captcha-token",
      });
    });
  });

  it("should block submit when captcha is missing", async () => {
    turnstileAutoSuccess = false;
    const user = userEvent.setup();

    renderLogin();

    await user.type(screen.getByPlaceholderText("Enter Email Address"), "user@example.com");
    await user.type(screen.getByPlaceholderText("Enter Password"), "Password123");

    expect(screen.getByRole("button", { name: /login now/i })).toBeDisabled();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("should show error and allow retry when backend rejects captcha", async () => {
    mockLogin.mockRejectedValueOnce({
      status: 400,
      error: "Turnstile verification failed",
    });
    const user = userEvent.setup();

    renderLogin();

    await user.type(screen.getByPlaceholderText("Enter Email Address"), "user@example.com");
    await user.type(screen.getByPlaceholderText("Enter Password"), "Password123");
    await user.click(screen.getByRole("button", { name: /login now/i }));

    expect(await screen.findByText("Turnstile verification failed")).toBeInTheDocument();

    mockLogin.mockResolvedValueOnce({ user: { email: "user@example.com" } });
    await user.click(screen.getByRole("button", { name: /complete verification/i }));
    await user.click(screen.getByRole("button", { name: /login now/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenLastCalledWith({
        email: "user@example.com",
        password: "Password123",
        captchaToken: "manual-captcha-token",
      });
    });
  });

  it("should show error when Turnstile widget fails", async () => {
    turnstileAutoSuccess = false;
    const user = userEvent.setup();

    renderLogin();

    await user.click(screen.getByRole("button", { name: /fail verification/i }));

    expect(screen.getByText(TURNSTILE_FAILED_MESSAGE)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login now/i })).toBeDisabled();
  });
});
