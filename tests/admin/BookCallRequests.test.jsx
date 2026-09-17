import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import BookCallRequests from "../../src/pages/admin/BookCallRequests";
import { getBookCallRequests } from "../../src/services/api/apiservices";

vi.mock("../../src/services/api/apiservices", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    getBookCallRequests: vi.fn(),
  };
});

const renderList = () =>
  render(
    <MemoryRouter>
      <BookCallRequests />
    </MemoryRouter>
  );

const mockRow = {
  id: 1,
  publicId: "CALL-A82F91",
  name: "John Doe",
  businessEmail: "john@company.com",
  companyName: "Acme Inc.",
  companyWebsite: "https://acme.com",
  status: "new",
  createdAt: "2026-09-03T19:00:00.000Z",
  updatedAt: "2026-09-03T19:00:00.000Z",
};

describe("BookCallRequests admin page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render listed call requests", async () => {
    getBookCallRequests.mockResolvedValueOnce({
      totalItems: 1,
      totalPages: 1,
      currentPage: 1,
      limit: 10,
      data: [mockRow],
    });

    renderList();

    expect(screen.getByRole("heading", { name: /call requests/i })).toBeInTheDocument();
    expect(await screen.findByText("CALL-A82F91")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Acme Inc.")).toBeInTheDocument();
  });

  it("should show an error banner when the list request fails", async () => {
    getBookCallRequests.mockRejectedValueOnce({
      status: 500,
      error: "Internal server error",
    });

    renderList();

    expect(await screen.findByText("Internal server error")).toBeInTheDocument();
  });

  it("should show Access Denied when the API returns 403", async () => {
    getBookCallRequests.mockRejectedValueOnce({
      status: 403,
      error: "Forbidden",
    });

    renderList();

    expect(await screen.findByRole("heading", { name: /access denied/i })).toBeInTheDocument();
  });

  it("should search and refetch with the query", async () => {
    getBookCallRequests.mockResolvedValue({
      totalItems: 0,
      totalPages: 1,
      currentPage: 1,
      limit: 10,
      data: [],
    });

    const user = userEvent.setup();
    renderList();

    await user.type(screen.getByPlaceholderText(/search requests/i), "Acme");

    await waitFor(() => {
      expect(getBookCallRequests).toHaveBeenCalledWith(
        expect.objectContaining({ search: "Acme", page: 1, limit: 10 })
      );
    });
  });
});
