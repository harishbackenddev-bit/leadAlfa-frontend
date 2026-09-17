import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useEffect } from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";

import BookingForm from "../../src/components/book-a-call/BookingForm";
import authReducer from "../../src/store/slices/authSlice";
import { submitBookCallRequest } from "../../src/services/api/apiservices";
import {
  BOOK_CALL_FIELD_ERROR_DURATION_MS,
  BOOK_CALL_FIELD_MESSAGES,
} from "../../src/constants/bookCallRequest";

let turnstileAutoSuccess = true;

vi.mock("../../src/components/common/TurnstileWidget", () => ({
  default: ({ onSuccess }) => {
    useEffect(() => {
      if (turnstileAutoSuccess) {
        onSuccess?.("test-captcha-token");
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div data-testid="turnstile-widget" />;
  },
}));

vi.mock("../../src/services/api/apiservices", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    submitBookCallRequest: vi.fn(),
  };
});

const renderBookingForm = (preloadedState = undefined) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState,
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <BookingForm />
      </MemoryRouter>
    </Provider>
  );
};

describe("BookingForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    turnstileAutoSuccess = true;
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should show inline errors on empty submit and clear them after a timeout", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderBookingForm();

    await user.click(screen.getByRole("button", { name: /schedule your call/i }));

    expect(screen.getByText(BOOK_CALL_FIELD_MESSAGES.name)).toBeInTheDocument();
    expect(screen.getByText(BOOK_CALL_FIELD_MESSAGES.businessEmail)).toBeInTheDocument();
    expect(screen.getByText(BOOK_CALL_FIELD_MESSAGES.companyName)).toBeInTheDocument();
    expect(screen.getByText(BOOK_CALL_FIELD_MESSAGES.companyWebsite)).toBeInTheDocument();
    expect(screen.getByText(BOOK_CALL_FIELD_MESSAGES.agreedToTerms)).toBeInTheDocument();
    expect(submitBookCallRequest).not.toHaveBeenCalled();

    await act(async () => {
      vi.advanceTimersByTime(BOOK_CALL_FIELD_ERROR_DURATION_MS);
    });

    expect(screen.queryByText(BOOK_CALL_FIELD_MESSAGES.name)).not.toBeInTheDocument();
  });

  it("should pre-fill logged-in user details", () => {
    renderBookingForm({
      auth: {
        user: {
          firstName: "Jane",
          lastName: "Doe",
          email: "jane@acme.com",
          profile: {
            companyName: "Acme Inc.",
            website: "acme.com",
          },
        },
        token: "token",
        isAuthenticated: true,
      },
    });

    expect(screen.getByLabelText(/your name/i)).toHaveValue("Jane Doe");
    expect(screen.getByLabelText(/business email/i)).toHaveValue("jane@acme.com");
    expect(screen.getByLabelText(/company name/i)).toHaveValue("Acme Inc.");
    expect(screen.getByLabelText(/company website/i)).toHaveValue("https://acme.com");
  });

  it("should prepend https:// and POST the API payload", async () => {
    submitBookCallRequest.mockResolvedValueOnce({
      success: true,
      message: "Your call request has been received. Our team will contact you shortly.",
      publicId: "CALL-A82F91",
    });
    const user = userEvent.setup();

    renderBookingForm();

    await user.type(screen.getByLabelText(/your name/i), "John Doe");
    await user.type(screen.getByLabelText(/business email/i), "john@company.com");
    await user.type(screen.getByLabelText(/company name/i), "Acme Inc.");
    await user.type(screen.getByLabelText(/company website/i), "acme.com");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /schedule your call/i }));

    await waitFor(() => {
      expect(submitBookCallRequest).toHaveBeenCalledWith({
        name: "John Doe",
        businessEmail: "john@company.com",
        companyName: "Acme Inc.",
        companyWebsite: "https://acme.com",
        captchaToken: "test-captcha-token",
      });
    });

    expect(
      screen.getByText(/your call request has been received/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/your name/i)).toHaveValue("");
    expect(screen.getByLabelText(/business email/i)).toHaveValue("");
    expect(screen.getByLabelText(/company name/i)).toHaveValue("");
    expect(screen.getByLabelText(/company website/i)).toHaveValue("");
  });

  it("should show field errors from a 400 response", async () => {
    submitBookCallRequest.mockRejectedValueOnce({
      status: 400,
      errors: [
        { field: "businessEmail", message: "Please provide a valid email address." },
      ],
    });
    const user = userEvent.setup();

    renderBookingForm();

    await user.type(screen.getByLabelText(/your name/i), "John Doe");
    await user.type(screen.getByLabelText(/business email/i), "john@company.com");
    await user.type(screen.getByLabelText(/company name/i), "Acme Inc.");
    await user.type(screen.getByLabelText(/company website/i), "https://acme.com");
    await user.click(screen.getByRole("checkbox"));
    await user.click(screen.getByRole("button", { name: /schedule your call/i }));

    expect(await screen.findByText("Please provide a valid email address.")).toBeInTheDocument();
  });
});
