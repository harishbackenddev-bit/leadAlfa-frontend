import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useEffect } from "react";
import { render, screen, waitFor, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import ContactHero from "../../src/components/contact-us/Herosection";
import authReducer from "../../src/store/slices/authSlice";
import { submitContactRequest } from "../../src/services/api/apiservices";
import { TURNSTILE_FAILED_MESSAGE } from "../../src/utils/turnstileErrors";

let turnstileAutoSuccess = true;

vi.mock("../../src/components/common/TurnstileWidget", () => ({
  default: ({ onSuccess, onExpire, onError }) => {
    useEffect(() => {
      if (turnstileAutoSuccess) {
        onSuccess?.("test-captcha-token");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div data-testid="turnstile-widget">
        <button type="button" onClick={() => onError?.()}>
          Fail verification
        </button>
      </div>
    );
  },
}));

vi.mock("../../src/services/api/apiservices", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    submitContactRequest: vi.fn(),
  };
});

const renderContactHero = (preloadedState = undefined) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <ContactHero />
    </Provider>
  );
};

describe("ContactHero form", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    turnstileAutoSuccess = true;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render contact form with inquiry type options", () => {
    renderContactHero();

    expect(screen.getByRole("heading", { name: /send a message/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email Address")).toBeInTheDocument();
    expect(screen.getByLabelText(/i am looking to/i)).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Talk to Sales" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Inquire about Career" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Ask a General Question" })).toBeInTheDocument();
  });

  it("should pre-fill name and email when user is logged in", () => {
    renderContactHero({
      auth: {
        user: {
          firstName: "Alex",
          lastName: "Smith",
          email: "alex.smith@example.com",
          role: "brand",
        },
        token: "token",
        isAuthenticated: true,
      },
    });

    expect(screen.getByPlaceholderText("Name")).toHaveValue("Alex Smith");
    expect(screen.getByPlaceholderText("Email Address")).toHaveValue("alex.smith@example.com");
  });

  it("should show success banner and clear all fields after successful submit", async () => {
    submitContactRequest.mockResolvedValueOnce({
      message: "Your request has been received. Our team will contact you shortly.",
    });
    const user = userEvent.setup();

    renderContactHero();

    await user.type(screen.getByPlaceholderText("Name"), "Alex Smith");
    await user.type(screen.getByPlaceholderText("Email Address"), "alex.smith@example.com");
    await user.selectOptions(screen.getByLabelText(/i am looking to/i), "inquire_about_career");
    await user.type(
      screen.getByPlaceholderText("Message"),
      "Hello, I am interested in enterprise pricing and custom campaign solutions."
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(submitContactRequest).toHaveBeenCalledWith({
        name: "Alex Smith",
        email: "alex.smith@example.com",
        inquiryType: "inquire_about_career",
        message: "Hello, I am interested in enterprise pricing and custom campaign solutions.",
        captchaToken: "test-captcha-token",
      });
    });

    expect(
      screen.getByText(/thank you! your message has been sent/i)
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Name")).toHaveValue("");
    expect(screen.getByPlaceholderText("Email Address")).toHaveValue("");
    expect(screen.getByLabelText(/i am looking to/i)).toHaveValue("talk_to_sales");
    expect(screen.getByPlaceholderText("Message")).toHaveValue("");
  });

  it("should clear pre-filled fields for logged-in users after successful submit", async () => {
    submitContactRequest.mockResolvedValueOnce({ message: "ok" });
    const user = userEvent.setup();

    renderContactHero({
      auth: {
        user: {
          firstName: "Creator",
          lastName: "Two",
          email: "newcreator02@yopmail.com",
          role: "creator",
        },
        token: "token",
        isAuthenticated: true,
      },
    });

    await user.type(
      screen.getByPlaceholderText("Message"),
      "Hello, I am interested in enterprise pricing and custom campaign solutions."
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(submitContactRequest).toHaveBeenCalled();
    });

    expect(screen.getByPlaceholderText("Name")).toHaveValue("");
    expect(screen.getByPlaceholderText("Email Address")).toHaveValue("");
    expect(screen.getByPlaceholderText("Message")).toHaveValue("");
  });

  it("should hide success banner after 30 seconds", async () => {
    vi.useFakeTimers();
    submitContactRequest.mockResolvedValueOnce({ message: "ok" });

    renderContactHero();

    fireEvent.change(screen.getByPlaceholderText("Name"), {
      target: { value: "Alex Smith" },
    });
    fireEvent.change(screen.getByPlaceholderText("Email Address"), {
      target: { value: "alex.smith@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Message"), {
      target: {
        value: "Hello, I am interested in enterprise pricing and custom campaign solutions.",
      },
    });
    fireEvent.click(screen.getByRole("button", { name: /send message/i }));

    await act(async () => {
      await Promise.resolve();
    });

    expect(
      screen.getByText(/thank you! your message has been sent/i)
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(
      screen.queryByText(/thank you! your message has been sent/i)
    ).not.toBeInTheDocument();
  });

  it("should show inline validation error on 400 response", async () => {
    submitContactRequest.mockRejectedValueOnce({
      status: 400,
      errors: [{ field: "message", message: "Message must be between 10 and 2000 characters." }],
    });
    const user = userEvent.setup();

    renderContactHero();

    await user.type(screen.getByPlaceholderText("Name"), "Alex Smith");
    await user.type(screen.getByPlaceholderText("Email Address"), "alex.smith@example.com");
    await user.type(screen.getByPlaceholderText("Message"), "Too short");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText("Message must be between 10 and 2000 characters.")
    ).toBeInTheDocument();
  });

  it("should show rate limit banner on 429 response", async () => {
    submitContactRequest.mockRejectedValueOnce({
      status: 429,
      error: "Too many contact requests submitted. Please try again after 15 minutes.",
    });
    const user = userEvent.setup();

    renderContactHero();

    await user.type(screen.getByPlaceholderText("Name"), "Alex Smith");
    await user.type(screen.getByPlaceholderText("Email Address"), "alex.smith@example.com");
    await user.type(
      screen.getByPlaceholderText("Message"),
      "Hello, I am interested in enterprise pricing and custom campaign solutions."
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(
      await screen.findByText(/too many contact requests submitted/i)
    ).toBeInTheDocument();
  });

  it("should disable submit button while request is in flight", async () => {
    let resolveSubmit;
    submitContactRequest.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveSubmit = resolve;
        })
    );
    const user = userEvent.setup();

    renderContactHero();

    await user.type(screen.getByPlaceholderText("Name"), "Alex Smith");
    await user.type(screen.getByPlaceholderText("Email Address"), "alex.smith@example.com");
    await user.type(
      screen.getByPlaceholderText("Message"),
      "Hello, I am interested in enterprise pricing and custom campaign solutions."
    );

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    expect(submitButton).toBeDisabled();
    expect(screen.getByText("Sending...")).toBeInTheDocument();

    resolveSubmit({ message: "ok" });

    await waitFor(() => {
      expect(screen.getByText(/thank you! your message has been sent/i)).toBeInTheDocument();
    });
  });

  it("should include captchaToken when submitting contact form", async () => {
    submitContactRequest.mockResolvedValueOnce({ message: "ok" });
    const user = userEvent.setup();

    renderContactHero();

    await user.type(screen.getByPlaceholderText("Name"), "Alex Smith");
    await user.type(screen.getByPlaceholderText("Email Address"), "alex.smith@example.com");
    await user.type(
      screen.getByPlaceholderText("Message"),
      "Hello, I am interested in enterprise pricing and custom campaign solutions."
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    await waitFor(() => {
      expect(submitContactRequest).toHaveBeenCalledWith(
        expect.objectContaining({ captchaToken: "test-captcha-token" })
      );
    });
  });

  it("should show captcha error when widget fails", async () => {
    turnstileAutoSuccess = false;
    const user = userEvent.setup();

    renderContactHero();

    await user.click(screen.getByRole("button", { name: /fail verification/i }));

    expect(screen.getByText(TURNSTILE_FAILED_MESSAGE)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeDisabled();
  });

  it("should show captcha error when backend rejects token", async () => {
    submitContactRequest.mockRejectedValueOnce({
      status: 400,
      error: "Turnstile verification failed",
    });
    const user = userEvent.setup();

    renderContactHero();

    await user.type(screen.getByPlaceholderText("Name"), "Alex Smith");
    await user.type(screen.getByPlaceholderText("Email Address"), "alex.smith@example.com");
    await user.type(
      screen.getByPlaceholderText("Message"),
      "Hello, I am interested in enterprise pricing and custom campaign solutions."
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText("Turnstile verification failed")).toBeInTheDocument();
  });
});
