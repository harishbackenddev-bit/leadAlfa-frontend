import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import UserFeedbackModal from "../../src/components/feedback/UserFeedbackModal";
import { submitUserFeedback } from "../../src/services/api/apiservices";

vi.mock("../../src/services/api/apiservices", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    submitUserFeedback: vi.fn(),
  };
});

const renderUserFeedbackModal = (initialEntries = ["/creator/profile"]) => {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <UserFeedbackModal />
    </MemoryRouter>
  );
};

describe("UserFeedbackModal Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render floating trigger button", () => {
    renderUserFeedbackModal();

    const triggerButton = screen.getByRole("button", { name: /feedback and bug report/i });
    expect(triggerButton).toBeInTheDocument();
  });

  it("should open modal dialog when trigger button is clicked", async () => {
    const user = userEvent.setup();
    renderUserFeedbackModal();

    const triggerButton = screen.getByRole("button", { name: /feedback and bug report/i });
    await user.click(triggerButton);

    expect(screen.getByRole("heading", { name: /feedback & bug report/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/describe what happened/i)).toBeInTheDocument();
    expect(screen.getByText(/Page:/i)).toBeInTheDocument();
    expect(screen.getByText(/\/creator\/profile/i)).toBeInTheDocument();
  });

  it("should validate description minimum character requirement", async () => {
    const user = userEvent.setup();
    renderUserFeedbackModal();

    await user.click(screen.getByRole("button", { name: /feedback and bug report/i }));

    const textarea = screen.getByPlaceholderText(/describe what happened/i);
    await user.type(textarea, "123"); // 3 characters

    const submitBtn = screen.getByRole("button", { name: /submit report/i });
    await user.click(submitBtn);

    expect(
      screen.getByText(/description must be at least 5 characters long/i)
    ).toBeInTheDocument();
    expect(submitUserFeedback).not.toHaveBeenCalled();
  });

  it("should successfully submit bug report and display success banner", async () => {
    submitUserFeedback.mockResolvedValueOnce({
      success: true,
      message: "Submitted successfully.",
      publicId: "FBK-A82F91",
    });

    const user = userEvent.setup();
    renderUserFeedbackModal(["/brand/campaigns"]);

    await user.click(screen.getByRole("button", { name: /feedback and bug report/i }));

    const textarea = screen.getByPlaceholderText(/describe what happened/i);
    await user.type(textarea, "The campaign save button produces a blank screen when clicked.");

    const submitBtn = screen.getByRole("button", { name: /submit report/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(submitUserFeedback).toHaveBeenCalledWith({
        type: "bug",
        description: "The campaign save button produces a blank screen when clicked.",
        pageUrl: "/brand/campaigns",
      });
    });

    expect(screen.getByText(/Thank you!/i)).toBeInTheDocument();
  });

  it("should allow switching to Product Feedback type", async () => {
    const user = userEvent.setup();
    renderUserFeedbackModal();

    await user.click(screen.getByRole("button", { name: /feedback and bug report/i }));

    const feedbackSegmentBtn = screen.getByRole("button", { name: /provide feedback/i });
    await user.click(feedbackSegmentBtn);

    expect(
      screen.getByPlaceholderText(/share your ideas, suggestions, or feature requests/i)
    ).toBeInTheDocument();
  });
});
