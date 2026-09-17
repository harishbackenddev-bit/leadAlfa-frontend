import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { IntroVideoGuidelinesModal } from "../../src/components/portfolio/signUp/IntroVideoGuidelinesModal";

describe("IntroVideoGuidelinesModal", () => {
  it("renders guidelines content and handles scroll to enable upload button", () => {
    const onClose = vi.fn();
    const onConfirmUpload = vi.fn();

    render(
      <IntroVideoGuidelinesModal
        isOpen={true}
        onClose={onClose}
        onConfirmUpload={onConfirmUpload}
      />
    );

    // Title and sections exist
    expect(screen.getByText("VIDEO GUIDELINES")).toBeInTheDocument();
    expect(screen.getByText("Video Structure")).toBeInTheDocument();
    expect(
      screen.getByText('"Invite me to your next campaign on Creatrend."')
    ).toBeInTheDocument();
    expect(screen.getByText("Technical Specifications")).toBeInTheDocument();
    expect(screen.getByText("Production Quality Standards")).toBeInTheDocument();

    const uploadButton = screen.getByRole("button", { name: /upload video/i });
    expect(uploadButton).toBeInTheDocument();

    // Trigger scroll to bottom on the scrollable container
    const scrollContainer = screen.getByText("Video Structure").closest(".overflow-y-auto");
    if (scrollContainer) {
      Object.defineProperty(scrollContainer, "scrollTop", { value: 500, configurable: true });
      Object.defineProperty(scrollContainer, "scrollHeight", { value: 600, configurable: true });
      Object.defineProperty(scrollContainer, "clientHeight", { value: 200, configurable: true });
      fireEvent.scroll(scrollContainer);
    }

    // Clicking proceed triggers callbacks
    fireEvent.click(uploadButton);
    expect(onClose).toHaveBeenCalled();
    expect(onConfirmUpload).toHaveBeenCalled();
  });

  it("does not render when isOpen is false", () => {
    render(
      <IntroVideoGuidelinesModal
        isOpen={false}
        onClose={vi.fn()}
        onConfirmUpload={vi.fn()}
      />
    );

    expect(screen.queryByText("VIDEO GUIDELINES")).not.toBeInTheDocument();
  });
});
