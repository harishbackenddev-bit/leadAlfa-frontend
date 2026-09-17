const REPLY_SEPARATOR = "\n---\n";

export const formatIsoDateLabel = (date) =>
  date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "2-digit",
    year: "numeric",
  });

export const formatIsoTimeLabel = (date) =>
  date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

export const formatIsoFullLabel = (date) =>
  `${formatIsoDateLabel(date)} at ${formatIsoTimeLabel(date)}`;

const parseIsoDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const buildIsoDateTimeMeta = (isoValue) => {
  const parsedDate = parseIsoDate(isoValue);

  if (!parsedDate) {
    return {
      iso: isoValue || null,
      timestamp: isoValue || null,
      dateLabel: null,
      timeLabel: null,
      fullLabel: null,
      sortDate: 0,
    };
  }

  return {
    iso: isoValue,
    timestamp: isoValue,
    dateLabel: formatIsoDateLabel(parsedDate),
    timeLabel: formatIsoTimeLabel(parsedDate),
    fullLabel: formatIsoFullLabel(parsedDate),
    sortDate: parsedDate.getTime(),
  };
};

const buildReplyMeta = (rawTimestamp, fallbackIso = null) => {
  const parsedDate = parseIsoDate(rawTimestamp) || parseIsoDate(fallbackIso);

  if (!parsedDate) {
    return {
      iso: rawTimestamp || fallbackIso || null,
      timestamp: rawTimestamp || fallbackIso || null,
      dateLabel: rawTimestamp || "Earlier note",
      timeLabel: null,
      fullLabel: rawTimestamp || "Earlier note",
      sortDate: 0,
    };
  }

  const iso = rawTimestamp || fallbackIso;

  return {
    iso,
    timestamp: iso,
    dateLabel: formatIsoDateLabel(parsedDate),
    timeLabel: formatIsoTimeLabel(parsedDate),
    fullLabel: formatIsoFullLabel(parsedDate),
    sortDate: parsedDate.getTime(),
  };
};

export const parseAdminNoteReplies = (adminNotes = "", fallbackIso = null) => {
  if (!adminNotes?.trim()) return [];

  return adminNotes
    .split(REPLY_SEPARATOR)
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return null;

      const match = trimmed.match(/^\[(.+?)\]\n([\s\S]*)$/);
      if (match) {
        return {
          ...buildReplyMeta(match[1], fallbackIso),
          type: "admin",
          label: "Admin Note",
          text: match[2].trim(),
        };
      }

      return {
        ...buildReplyMeta(null, fallbackIso),
        type: "admin",
        label: "Admin Reply",
        text: trimmed,
      };
    })
    .filter(Boolean);
};

export const buildContactRequestHistory = ({
  adminNotes = "",
  originalMessage = "",
  submittedAt = null,
  updatedAt = null,
} = {}) => {
  const fallbackIso = updatedAt || submittedAt;
  const entries = parseAdminNoteReplies(adminNotes, fallbackIso);

  if (originalMessage?.trim()) {
    entries.push({
      ...buildIsoDateTimeMeta(submittedAt),
      type: "original",
      label: "Original Request",
      text: originalMessage.trim(),
    });
  }

  return entries.sort((a, b) => b.sortDate - a.sortDate);
};

export const appendAdminNoteReply = (existingNotes = "", newReply = "") => {
  const trimmedReply = newReply.trim();
  if (!trimmedReply) {
    throw new Error("Reply cannot be empty.");
  }

  const entry = `[${new Date().toISOString()}]\n${trimmedReply}`;
  const combined = existingNotes?.trim()
    ? `${existingNotes.trim()}${REPLY_SEPARATOR}${entry}`
    : entry;

  if (combined.length > 1000) {
    throw new Error("Reply history exceeds the 1000 character limit.");
  }

  return combined;
};

export const ADMIN_NOTES_MAX_LENGTH = 1000;
