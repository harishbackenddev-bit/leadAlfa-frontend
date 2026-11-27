import {
  fundCampaign,
  getCampaignPaymentStatus,
} from "../../../../services/api/apiservices";

/**
 * One-time campaign payment (only while a DRAFT is being published).
 *
 * Flow:
 *   1. POST /fund            -> TradeSafe wallet deposit link
 *   2. open the link in a new tab (the form stays open in this tab)
 *   3. poll GET /status      -> the TradeSafe webhook marks the campaign
 *                               FUNDS_RECEIVED and activates it on the server
 *
 * The client never "publishes" the campaign itself: the server does that when
 * the payment is confirmed. Once a campaign is published it is never charged
 * again - later edits are plain updates (PATCH).
 */

const FAILED_BATCH_STATUSES = ["FUNDING_FAILED", "FAILED", "CANCELLED", "EXPIRED"];
const FUNDED_STATUSES = ["FUNDS_RECEIVED", "FUNDED"];

/** Backend wraps payloads as { success, data }; apiservices may or may not unwrap. */
const unwrap = (res) => {
  const candidates = [res, res?.data, res?.data?.data];
  return (
    candidates.find(
      (c) =>
        c &&
        typeof c === "object" &&
        (c.fundingStatus !== undefined ||
          c.fundingBatch !== undefined ||
          c.isFullyFunded !== undefined)
    ) ?? res
  );
};

export function extractWalletUrl(fundRes) {
  return unwrap(fundRes)?.fundingBatch?.walletDepositUrl ?? null;
}

export function readPaymentState(statusRes) {
  const d = unwrap(statusRes) || {};
  const fundingStatus = String(d.fundingStatus ?? "").toUpperCase();
  const batchStatus = String(d.fundingBatch?.status ?? "").toUpperCase();
  const campaignStatus = String(d.campaignStatus ?? d.status ?? "").toLowerCase();

  const paid =
    d.isFullyFunded === true ||
    FUNDED_STATUSES.includes(fundingStatus) ||
    batchStatus === "FULLY_FUNDED" ||
    campaignStatus === "active";
  const failed = !paid && FAILED_BATCH_STATUSES.includes(batchStatus);

  return { paid, failed };
}

/**
 * Must be called synchronously inside the click handler (before any await),
 * otherwise browsers block the popup.
 */
export function openPaymentTab() {
  try {
    const tab = window.open("", "_blank");
    if (tab) {
      try {
        tab.document.title = "Redirecting to payment…";
        tab.document.body.innerText = "Redirecting to secure payment…";
      } catch (_) {
        /* ignore */
      }
    }
    return tab || null;
  } catch (_) {
    return null;
  }
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * Polls until the payment is confirmed.
 * @returns {Promise<"paid"|"failed"|"timeout">}
 */
export async function waitForCampaignFunding(
  campaignPublicId,
  { intervalMs = 3000, maxAttempts = 200 } = {}
) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const { paid, failed } = readPaymentState(
        await getCampaignPaymentStatus(campaignPublicId)
      );
      if (paid) return "paid";
      if (failed) return "failed";
    } catch (err) {
      console.warn(`Payment status check ${attempt} failed:`, err?.message || err);
    }
    await sleep(intervalMs);
  }
  return "timeout";
}

/**
 * Starts the one-time payment for a draft campaign and waits for the result.
 * `paymentTab` is the tab returned by openPaymentTab().
 * @returns {Promise<"paid"|"failed"|"timeout"|"redirected">}
 */
export async function startCampaignFunding({
  campaignPublicId,
  fundingQuote,
  paymentTab = null,
}) {
  if (!fundingQuote?.paymentMethod) {
    if (paymentTab && !paymentTab.closed) paymentTab.close();
    throw new Error("Please select a payment method first");
  }

  let walletUrl;
  try {
    const fundRes = await fundCampaign(campaignPublicId, {
      paymentMethod: fundingQuote.paymentMethod,
      quoteVersion: fundingQuote.quoteVersion,
    });
    walletUrl = extractWalletUrl(fundRes);
    if (!walletUrl) throw new Error("No wallet deposit link received.");
  } catch (error) {
    if (paymentTab && !paymentTab.closed) paymentTab.close();
    throw error;
  }

  if (paymentTab && !paymentTab.closed) {
    paymentTab.location.href = walletUrl;
  } else {
    // Popup blocked: fall back to this tab. The server still activates the
    // campaign through the webhook, so nothing is lost.
    window.location.href = walletUrl;
    return "redirected";
  }

  return waitForCampaignFunding(campaignPublicId);
}
