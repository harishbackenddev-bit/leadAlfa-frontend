import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BookCallRequestDetails from "../../src/pages/admin/BookCallRequestDetails";
import {
  getBookCallRequestByPublicId,
  updateBookCallRequest,
} from "../../src/services/api/apiservices";

vi.mock("../../src/services/api/apiservices", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getBookCallRequestByPublicId: vi.fn(),
    updateBookCallRequest: vi.fn(),
  };
});

const mockRequest = {
  id: 1,
  publicId: "CALL-A82F91",
  name: "John Doe",
  businessEmail: "john@company.com",
  companyName: "Acme Inc.",
  companyWebsite: "https://acme.com",
  status: "new",
  adminNotes: null,
  userId: null,
  createdAt: "2026-09-03T19:00:00.000Z",
  updatedAt: "2026-09-03T19:00:00.000Z",
  resolvedAt: null,
  userAccount: null,
  resolver: null,
};

const renderDetails = (publicId = "CALL-A82F91") =>
  render(
    <MemoryRouter initialEntries={[`/admin/book-call-requests/${publicId}`]}>
      <Routes>
        <Route
          path="/admin/book-call-requests/:publicId"
          element={<BookCallRequestDetails />}
        />
        <Route path="/admin/book-call-requests" element={<div>Call list</div>} />
      </Routes>
    </MemoryRouter>
  );

describe("BookCallRequestDetails admin page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render request details from the API", async () => {
    getBookCallRequestByPublicId.mockResolvedValueOnce({ request: mockRequest });

    renderDetails();

    expect(await screen.findByRole("heading", { name: "John Doe" })).toBeInTheDocument();
    expect(screen.getByText("john@company.com")).toBeInTheDocument();
    expect(screen.getByText("CALL-A82F91")).toBeInTheDocument();
    expect(screen.getAllByText("https://acme.com").length).toBeGreaterThan(0);
  });

  it("should show not found copy on 404", async () => {
    getBookCallRequestByPublicId.mockRejectedValueOnce({
      status: 404,
      error: "Book a call request not found",
    });

    renderDetails("CALL-MISSING");

    expect(await screen.findByText("Book a call request not found")).toBeInTheDocument();
  });

  it("should show Access Denied on 403", async () => {
    getBookCallRequestByPublicId.mockRejectedValueOnce({
      status: 403,
      error: "Forbidden",
    });

    renderDetails();

    expect(await screen.findByRole("heading", { name: /access denied/i })).toBeInTheDocument();
  });

  it("should require a status change before saving", async () => {
    getBookCallRequestByPublicId.mockResolvedValueOnce({ request: mockRequest });
    const user = userEvent.setup();

    renderDetails();
    await screen.findByRole("heading", { name: "John Doe" });

    await user.click(screen.getByRole("button", { name: /save changes/i }));

    expect(
      await screen.findByText(/change the status before saving/i)
    ).toBeInTheDocument();
    expect(updateBookCallRequest).not.toHaveBeenCalled();
  });

  it("should send a reply from the Save Note button", async () => {
    getBookCallRequestByPublicId.mockResolvedValueOnce({ request: mockRequest });
    updateBookCallRequest.mockResolvedValueOnce({
      message: "Book a call request updated successfully.",
      request: {
        ...mockRequest,
        adminNotes: "[2026-09-03T19:15:00.000Z]\nCalled John.",
      },
    });
    const user = userEvent.setup();

    renderDetails();
    await screen.findByRole("heading", { name: "John Doe" });

    await user.type(screen.getByLabelText(/add note/i), "Called John.");
    await user.click(screen.getByRole("button", { name: /save note/i }));

    await waitFor(() => {
      expect(updateBookCallRequest).toHaveBeenCalledWith(
        "CALL-A82F91",
        expect.objectContaining({
          adminNotes: expect.stringContaining("Called John."),
        })
      );
    });

    expect(await screen.findByText("Reply sent successfully.")).toBeInTheDocument();
    expect(screen.getByLabelText(/add note/i)).toHaveValue("");
  });
});
