import { describe, it, expect } from "vitest";
import { buildCampaignPayload } from "../../src/pages/brand/Campaigns/utils/campaignFormPayload";

describe("buildCampaignPayload platform", () => {
  it("maps multiple selected platforms to labels", () => {
    const payload = buildCampaignPayload({ platform: ["tiktok", "instagram"] });
    expect(payload.platform).toEqual(["TikTok", "Instagram"]);
  });

  it("returns an empty array when nothing is selected", () => {
    expect(buildCampaignPayload({ platform: [] }).platform).toEqual([]);
  });

  it("still handles a legacy single string value", () => {
    expect(buildCampaignPayload({ platform: "tiktok" }).platform).toEqual(["TikTok"]);
  });
});
