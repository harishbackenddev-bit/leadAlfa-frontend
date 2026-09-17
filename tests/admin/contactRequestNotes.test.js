import { describe, expect, it } from "vitest";
import {
  appendAdminNoteReply,
  buildContactRequestHistory,
  buildIsoDateTimeMeta,
  parseAdminNoteReplies,
} from "../../src/pages/admin/components/contactRequests/contactRequestNotes";

const SUBMITTED_AT = "2026-08-09T17:18:01.560Z";

describe("contactRequestNotes", () => {
  it("should format API createdAt ISO into date and time labels", () => {
    const meta = buildIsoDateTimeMeta(SUBMITTED_AT);

    expect(meta.dateLabel).toContain("2026");
    expect(meta.timeLabel).toMatch(/\d{1,2}:\d{2}:\d{2}/);
    expect(meta.iso).toBe(SUBMITTED_AT);
  });

  it("should include original request in history using createdAt", () => {
    const history = buildContactRequestHistory({
      adminNotes: "",
      originalMessage: "Hello, I need help with pricing.",
      submittedAt: SUBMITTED_AT,
    });

    expect(history).toHaveLength(1);
    expect(history[0].type).toBe("original");
    expect(history[0].label).toBe("Original Request");
    expect(history[0].text).toBe("Hello, I need help with pricing.");
    expect(history[0].iso).toBe(SUBMITTED_AT);
    expect(history[0].dateLabel).toBeTruthy();
    expect(history[0].timeLabel).toBeTruthy();
  });

  it("should parse ISO timestamp admin replies with separate date and time labels", () => {
    const notes = `[2026-08-09T17:18:00.000Z]
First reply
---
[2026-08-09T18:30:00.000Z]
Second reply`;

    const replies = parseAdminNoteReplies(notes);

    expect(replies).toHaveLength(2);
    expect(replies[0].text).toBe("First reply");
    expect(replies[0].dateLabel).toContain("2026");
    expect(replies[0].timeLabel).toMatch(/\d{1,2}:\d{2}:\d{2}/);
  });

  it("should build full history with original request and admin replies", () => {
    const notes = appendAdminNoteReply("", "Followed up by phone.");
    const history = buildContactRequestHistory({
      adminNotes: notes,
      originalMessage: "Need enterprise pricing details.",
      submittedAt: SUBMITTED_AT,
      updatedAt: "2026-08-09T18:00:00.000Z",
    });

    expect(history).toHaveLength(2);
    expect(history.some((entry) => entry.type === "original")).toBe(true);
    expect(history.some((entry) => entry.type === "admin")).toBe(true);
  });

  it("should reject empty reply text", () => {
    expect(() => appendAdminNoteReply("", "   ")).toThrow("Reply cannot be empty.");
  });
});
