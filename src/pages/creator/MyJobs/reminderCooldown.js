const STORAGE_PREFIX = "creator_reminder_next_";
const COOLDOWN_MS = 24 * 60 * 60 * 1000;

function storageKey(jobPublicId) {
  return `${STORAGE_PREFIX}${String(jobPublicId)}`;
}

export function readStoredNextReminderAt(jobPublicId) {
  if (!jobPublicId || typeof localStorage === "undefined") return null;
  try {
    const value = localStorage.getItem(storageKey(jobPublicId));
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  } catch {
    return null;
  }
}

export function storeNextReminderAt(jobPublicId, nextAt) {
  if (!jobPublicId || !nextAt || typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(storageKey(jobPublicId), new Date(nextAt).toISOString());
  } catch {
    // ignore quota / private mode
  }
}

/**
 * Resolve when the creator may ping again.
 * Prefers API fields, then local cache from the last successful ping.
 */
export function getNextReminderAvailableAt(job = {}) {
  const candidates = [
    job.nextReminderAvailableAt,
    job.lastReminderSentAt
      ? new Date(new Date(job.lastReminderSentAt).getTime() + COOLDOWN_MS)
      : null,
    readStoredNextReminderAt(job.jobPublicId || job.publicId),
  ];

  for (const value of candidates) {
    if (!value) continue;
    const date = value instanceof Date ? value : new Date(value);
    if (!Number.isNaN(date.getTime())) return date;
  }
  return null;
}

export function canPingBrand(job = {}) {
  const nextAt = getNextReminderAvailableAt(job);
  if (!nextAt) return true;
  return Date.now() >= nextAt.getTime();
}

/** Human-readable cooldown, e.g. "18h 32m" or "45m". */
export function formatReminderCooldown(nextAt) {
  if (!nextAt) return null;
  const date = nextAt instanceof Date ? nextAt : new Date(nextAt);
  if (Number.isNaN(date.getTime())) return null;

  const ms = date.getTime() - Date.now();
  if (ms <= 0) return null;

  const totalMinutes = Math.ceil(ms / (60 * 1000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours >= 24) {
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return remHours > 0 ? `${days}d ${remHours}h` : `${days}d`;
  }
  if (hours > 0) {
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }
  return `${Math.max(1, minutes)}m`;
}

export function formatNextPingLabel(nextAt) {
  const cooldown = formatReminderCooldown(nextAt);
  return cooldown ? `Ping available in ${cooldown}` : null;
}
