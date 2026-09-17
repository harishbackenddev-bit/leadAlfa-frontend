import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import BlogPagination from "../../../src/components/portfolio/Blogs/BlogPagination";

describe("BlogPagination", () => {
  it("should hide pagination when totalPages is 1 or less", () => {
    const { container } = render(
      <BlogPagination
        page={1}
        totalPages={1}
        total={5}
        perPage={6}
        onPageChange={vi.fn()}
      />
    );

    expect(container).toBeEmptyDOMElement();
  });

  it("should show range summary for current page", () => {
    render(
      <BlogPagination
        page={2}
        totalPages={3}
        total={15}
        perPage={6}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByText("Showing 7–12 of 15")).toBeInTheDocument();
  });

  it("should disable Previous on first page", () => {
    render(
      <BlogPagination
        page={1}
        totalPages={3}
        total={15}
        perPage={6}
        onPageChange={vi.fn()}
      />
    );

    expect(screen.getByRole("button", { name: "Prev" })).toBeDisabled();
  });

  it("should call onPageChange when Next is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <BlogPagination
        page={1}
        totalPages={3}
        total={15}
        perPage={6}
        onPageChange={onPageChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "Next" }));

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("should call onPageChange when a page number is clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <BlogPagination
        page={1}
        totalPages={3}
        total={15}
        perPage={6}
        onPageChange={onPageChange}
      />
    );

    await user.click(screen.getByRole("button", { name: "3" }));

    expect(onPageChange).toHaveBeenCalledWith(3);
  });
});
