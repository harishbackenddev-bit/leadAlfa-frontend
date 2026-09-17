import { describe, expect, it, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PortfolioSection from "../../../src/pages/creator/MyProfile/components/PortfolioSection";
import { addPortfolioVideo, deletePortfolioVideo } from "../../../src/services/api/apiservices";
import { uploadMediaWithProgress } from "../../../src/services/api/mediaUploadService";

vi.mock("../../../src/services/api/apiservices", () => ({
  addPortfolioVideo: vi.fn(),
  deletePortfolioVideo: vi.fn(),
}));

vi.mock("../../../src/services/api/mediaUploadService", () => ({
  uploadMediaWithProgress: vi.fn(),
}));

const renderSection = (props = {}) =>
  render(
    <MemoryRouter>
      <PortfolioSection
        profile={props.profile || {}}
        user={props.user || {}}
        onProfileUpdated={props.onProfileUpdated}
      />
    </MemoryRouter>
  );

describe("PortfolioSection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show intro empty state and add portfolio button", () => {
    renderSection();

    expect(screen.getByText("No intro video yet")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add portfolio video/i })
    ).toBeInTheDocument();
    expect(
      screen.getByText("5 remaining of 5 · MP4 or MOV, max 120MB")
    ).toBeInTheDocument();
  });

  it("should render intro and portfolio videos", () => {
    renderSection({
      profile: {
        media: {
          introVideo: {
            mediaDetails: { url: "https://cdn.example.com/intro.mp4" },
          },
          portfolio: [
            {
              id: 1,
              mediaDetails: { url: "https://cdn.example.com/p1.mp4", type: "video" },
            },
          ],
        },
      },
    });

    expect(screen.getByText("Intro")).toBeInTheDocument();
    expect(screen.getByText("Portfolio 1")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /add portfolio video/i })).toBeInTheDocument();
    expect(
      screen.getByText("4 remaining of 5 · MP4 or MOV, max 120MB")
    ).toBeInTheDocument();
  });

  it("should hide add button when five portfolio videos exist", () => {
    renderSection({
      profile: {
        media: {
          portfolio: [1, 2, 3, 4, 5].map((n) => ({
            id: n,
            mediaDetails: {
              url: `https://cdn.example.com/${n}.mp4`,
              type: "video",
            },
          })),
        },
      },
    });

    expect(screen.getByText("Portfolio 5")).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /add portfolio video/i })
    ).not.toBeInTheDocument();
  });

  it("should attach selected videos and upload using uploadMediaWithProgress and addPortfolioVideo", async () => {
    const user = userEvent.setup();
    const onProfileUpdated = vi.fn().mockResolvedValue(undefined);
    uploadMediaWithProgress.mockImplementation((file, options) => {
      options?.onProgress?.({ percent: 100 });
      return Promise.resolve({ mediaId: 101, url: "https://cdn.example.com/uploaded.mp4" });
    });
    addPortfolioVideo.mockResolvedValue({ success: true });

    const { container } = renderSection({
      profile: { firstName: "Ada", lastName: "Lovelace" },
      user: { firstName: "Ada" },
      onProfileUpdated,
    });

    const first = new File(["video-bytes"], "work.mp4", { type: "video/mp4" });
    const input = container.querySelector('input[type="file"]');
    await user.upload(input, first);

    expect(uploadMediaWithProgress).not.toHaveBeenCalled();
    expect(screen.getByText("work.mp4")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^upload$/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /^upload$/i }));

    await waitFor(() => {
      expect(uploadMediaWithProgress).toHaveBeenCalledTimes(1);
      expect(addPortfolioVideo).toHaveBeenCalledWith(101);
    });
    expect(onProfileUpdated).toHaveBeenCalledTimes(1);
  });

  it("should show an error when the file is not mp4 or mov", async () => {
    const { container } = renderSection();
    const file = new File(["x"], "photo.png", { type: "image/png" });
    const input = container.querySelector('input[type="file"]');

    fireEvent.change(input, { target: { files: [file] } });

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Use MP4 or MOV format"
    );
    expect(uploadMediaWithProgress).not.toHaveBeenCalled();
  });
});
