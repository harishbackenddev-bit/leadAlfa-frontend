/**
 * mediaUploadService.js
 * ============================================================================
 * Reusable, framework-agnostic helper that runs the 3-step direct-to-Cloudinary
 * signed upload flow used everywhere across the app.
 *
 *   Step 1 → POST /upload/initiate-signature   (backend signs a short-lived ticket)
 *   Step 2 → POST https://api.cloudinary.com   (browser uploads file bytes via XHR)
 *   Step 3 → POST /media/register              (backend records the asset → mediaId)
 *
 * The caller then sends `mediaId` to whichever feature endpoint needs it
 * (e.g. campaign application, profile media, brand assets, etc.).
 *
 * XHR is used for Step 2 because fetch() cannot report real upload progress.
 * Exposed callbacks let the UI render an accurate progress bar with bytes,
 * percentage, speed, ETA and elapsed time.
 *
 * Reference docs: docs/initiale_signature.md, docs/cloudinary-upload-reference.js
 * ============================================================================
 */

import axiosInstance from "./axiosInstance";

/* -------------------------------------------------------------------------- */
/* Constants                                                                  */
/* -------------------------------------------------------------------------- */

export const UPLOAD_PHASES = Object.freeze({
  IDLE: "idle",
  SIGNATURE: "signature",
  UPLOAD: "upload",
  REGISTER: "register",
  DONE: "done",
  ERROR: "error",
});

/**
 * Translate the various error shapes that come back from our backend / axios
 * into a single, user-readable string. Without this the UI ends up showing
 * things like "Request failed with status code 404" or a raw HTML 404 page.
 */
const extractApiError = (error, fallback, { phase } = {}) => {
  const status = error?.response?.status;
  const data = error?.response?.data;

  // Backend returned plain HTML (typical Express default 404) — surface a
  // descriptive message that points at the missing route, not the HTML body.
  if (status === 404 && typeof data === "string" && data.includes("Cannot")) {
    return `${fallback}: this endpoint is not available on the backend (404). The "${phase}" route may not be deployed yet.`;
  }

  if (data && typeof data === "object") {
    if (typeof data.error === "string") return data.error;
    if (typeof data.message === "string") return data.message;
    if (Array.isArray(data.errors) && data.errors[0]?.message)
      return data.errors[0].message;
  }

  if (typeof data === "string" && data.length < 200) return data;
  if (error?.message) return `${fallback}: ${error.message}`;
  return fallback;
};

/* -------------------------------------------------------------------------- */
/* Step 1 — Get a signed upload ticket from the backend                       */
/* -------------------------------------------------------------------------- */

/**
 * Backend may wrap the ticket: { data: { signature, ... } } or { ticket: { ... } }.
 */
const unwrapSignaturePayload = (payload) => {
  if (!payload || typeof payload !== "object") return {};
  if (payload.signature != null) return payload;
  const nested = payload.data ?? payload.ticket ?? payload.result;
  if (nested && typeof nested === "object" && nested.signature != null) return nested;
  return payload;
};

/** Fields returned by initiate-signature that are NOT Cloudinary form params. */
const CLOUDINARY_TICKET_META = new Set([
  "signature",
  "apiKey",
  "api_key",
  "cloudName",
  "cloud_name",
  "resourceType",
  "resource_type",
  "signedParameters",
  "signed_parameters",
]);

const formatCloudinaryParam = (value) => {
  if (value === true) return "true";
  if (value === false) return "false";
  if (value == null || value === "") return null;
  return String(value);
};

/**
 * Every parameter the backend included in the Cloudinary signature.
 * Step 2 must send ALL of these in FormData (not only folder + timestamp).
 * Work-submission tickets also include use_filename + unique_filename.
 */
export const extractSignedUploadParams = (raw = {}) => {
  const source = unwrapSignaturePayload(raw);
  const params = {};

  const assign = (key, value) => {
    const formatted = formatCloudinaryParam(value);
    if (formatted != null) params[key] = formatted;
  };

  assign("folder", source.folder ?? source.asset_folder);
  assign("timestamp", source.timestamp);
  assign("use_filename", source.use_filename);
  assign("unique_filename", source.unique_filename);

  const explicitList =
    source.signedParameters || source.signed_parameters || null;
  if (Array.isArray(explicitList)) {
    explicitList.forEach((key) => {
      if (!CLOUDINARY_TICKET_META.has(key)) assign(key, source[key]);
    });
  }

  ["type", "tags", "eager", "public_id", "overwrite", "transformation"].forEach(
    (key) => {
      if (params[key] == null) assign(key, source[key]);
    }
  );

  return params;
};

/**
 * Normalize initiate-signature response field names (camelCase / snake_case).
 */
const normalizeUploadTicket = (ticket = {}, fallbackResourceType = "video") => {
  const raw = unwrapSignaturePayload(ticket);
  const resourceType =
    raw.resourceType ||
    raw.resource_type ||
    fallbackResourceType ||
    "video";

  const timestamp = Number(raw.timestamp);
  const folder = raw.folder ?? raw.asset_folder ?? null;

  return {
    signature: String(raw.signature || "").trim(),
    timestamp: Number.isFinite(timestamp) ? timestamp : raw.timestamp,
    apiKey: raw.apiKey || raw.api_key,
    cloudName: raw.cloudName || raw.cloud_name,
    folder,
    resourceType,
    use_filename: raw.use_filename,
    unique_filename: raw.unique_filename,
    signedParams: extractSignedUploadParams(raw),
  };
};

export const initiateUploadSignature = async (
  resourceType = "video",
  uploadType
) => {
  try {
    // docs/creator_worksubmition_flow.md Step 1
    const body = { resourceType };
    if (uploadType) body.uploadType = uploadType;

    const { data: raw } = await axiosInstance.post(
      "/upload/initiate-signature",
      body
    );
    const ticket = normalizeUploadTicket(
      unwrapSignaturePayload(raw),
      resourceType
    );

    if (import.meta.env.DEV) {
      console.debug("[initiateUploadSignature]", {
        uploadType: uploadType || "default",
        resourceType,
        signedParams: ticket.signedParams,
        cloudName: ticket.cloudName,
      });
    }

    return ticket;
  } catch (error) {
    throw new Error(
      extractApiError(error, "Failed to get upload signature", {
        phase: "/upload/initiate-signature",
      })
    );
  }
};

/* -------------------------------------------------------------------------- */
/* Step 2 — Upload file bytes directly to Cloudinary (XHR for progress)       */
/* -------------------------------------------------------------------------- */

/**
 * Upload a File directly to Cloudinary using a signed ticket.
 *
 * @param {File}     file     The browser File object from <input type="file">
 * @param {object}   ticket   The signed ticket returned by initiateUploadSignature
 * @param {object}  [options]
 * @param {(p: UploadProgress) => void} [options.onProgress]
 *        Called frequently during upload. Argument shape:
 *          { loaded, total, percent, speedBps, etaSeconds, elapsedSeconds }
 * @param {AbortSignal} [options.signal]
 *        Optional AbortSignal to cancel the upload mid-flight.
 *
 * @returns {Promise<{ public_id: string, secure_url: string, resource_type: string, bytes: number, duration?: number }>}
 */
export const uploadToCloudinary = (file, ticket, options = {}) => {
  const { onProgress, signal, resourceType: resourceTypeOverride } = options;
  const normalized = normalizeUploadTicket(
    ticket,
    resourceTypeOverride || ticket?.resourceType
  );
  const {
    signature,
    apiKey,
    cloudName,
    resourceType,
    signedParams,
  } = normalized;

  if (!signature || !apiKey || !cloudName) {
    throw new Error("Upload signature response is incomplete. Please retry.");
  }
  if (!signedParams?.timestamp) {
    throw new Error("Upload signature is missing timestamp. Please retry.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("signature", signature);

  // Append every param the backend signed (folder, timestamp, use_filename, …).
  Object.entries(signedParams).forEach(([key, value]) => {
    formData.append(key, value);
  });

  const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  if (import.meta.env.DEV) {
    console.debug("[uploadToCloudinary]", { uploadUrl, signedParams });
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const startedAt = performance.now();
    let lastTickAt = startedAt;
    let lastLoaded = 0;
    let lastInstSpeed = 0; // EMA-smoothed instantaneous speed (bytes / sec)

    xhr.upload.addEventListener("progress", (event) => {
      if (!event.lengthComputable) return;

      const now = performance.now();
      const elapsedSeconds = (now - startedAt) / 1000;
      const dtSeconds = (now - lastTickAt) / 1000;
      const dBytes = event.loaded - lastLoaded;

      // Instantaneous speed smoothed with a simple EMA so the ETA does not
      // jitter wildly on slow networks.
      const rawInstSpeed = dtSeconds > 0 ? dBytes / dtSeconds : 0;
      lastInstSpeed = lastInstSpeed === 0
        ? rawInstSpeed
        : lastInstSpeed * 0.7 + rawInstSpeed * 0.3;

      const avgSpeed = elapsedSeconds > 0 ? event.loaded / elapsedSeconds : 0;
      const speedBps = lastInstSpeed > 0 ? lastInstSpeed : avgSpeed;
      const remaining = Math.max(0, event.total - event.loaded);
      const etaSeconds = speedBps > 0 ? remaining / speedBps : Infinity;

      lastTickAt = now;
      lastLoaded = event.loaded;

      try {
        onProgress?.({
          loaded: event.loaded,
          total: event.total,
          percent: Math.min(100, Math.round((event.loaded / event.total) * 100)),
          speedBps,
          etaSeconds,
          elapsedSeconds,
        });
      } catch (cbErr) {
        if (import.meta.env?.DEV) {
          console.warn("[uploadToCloudinary] onProgress callback threw", cbErr);
        }
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("Cloudinary returned an unparseable response."));
        }
      } else {
        let message = `Cloudinary upload failed (HTTP ${xhr.status}).`;
        try {
          const body = JSON.parse(xhr.responseText);
          const cloudinaryMsg = body?.error?.message || "";
          if (cloudinaryMsg.toLowerCase().includes("invalid signature")) {
            message =
              "Cloudinary rejected the upload signature. Ensure every signed " +
              "parameter from initiate-signature is sent in the upload FormData " +
              "(folder, timestamp, use_filename, unique_filename, etc.). " +
              `(${cloudinaryMsg})`;
          } else {
            message = cloudinaryMsg || message;
          }
        } catch { /* ignore parse error */ }
        reject(new Error(message));
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Network error while uploading to Cloudinary."))
    );
    xhr.addEventListener("timeout", () =>
      reject(new Error("Cloudinary upload timed out. Please retry."))
    );
    xhr.addEventListener("abort", () => {
      const err = new Error("Upload cancelled.");
      err.name = "AbortError";
      reject(err);
    });

    if (signal) {
      if (signal.aborted) {
        xhr.abort();
        return;
      }
      signal.addEventListener("abort", () => xhr.abort(), { once: true });
    }

    xhr.open("POST", uploadUrl);
    xhr.send(formData);
  });
};

/* -------------------------------------------------------------------------- */
/* Step 3 — Register the uploaded asset with the backend                      */
/* -------------------------------------------------------------------------- */

export const registerMedia = async ({
  public_id,
  secure_url,
  resource_type,
  original_name,
  bytes,
  uploadType,
}) => {
  try {
    const body = {
      public_id,
      secure_url,
      resource_type,
      original_name,
    };
    if (bytes != null) body.bytes = bytes;
    if (uploadType) {
      body.uploadType = uploadType;
      body.upload_type = uploadType;
    }
    const { data } = await axiosInstance.post("/media/register", body);
    // Shape: { mediaId }
    return data;
  } catch (error) {
    throw new Error(
      extractApiError(error, "Failed to register media", {
        phase: "/media/register",
      })
    );
  }
};

/* -------------------------------------------------------------------------- */
/* Orchestrator — wire all three steps together                               */
/* -------------------------------------------------------------------------- */

/**
 * Run the complete signed-upload pipeline (signature → cloudinary → register).
 *
 * @param {File} file
 * @param {object} [options]
 * @param {"video"|"image"|"raw"} [options.resourceType]
 *        Override auto-detection. Falls back to file.type.
 * @param {(phase: keyof typeof UPLOAD_PHASES) => void} [options.onPhaseChange]
 *        Called when the pipeline moves between phases: signature → upload → register → done.
 * @param {(p: UploadProgress) => void} [options.onProgress]
 *        Forwarded to uploadToCloudinary (Step 2 only).
 * @param {AbortSignal} [options.signal]
 *        Cancels the in-flight upload (Step 2). The other steps are sub-second.
 *
 * @returns {Promise<{ mediaId: number, public_id: string, secure_url: string, resource_type: string }>}
 */
export const uploadMediaWithProgress = async (file, options = {}) => {
  if (!file) throw new Error("No file selected.");

  const { resourceType, uploadType, onPhaseChange, onProgress, signal } =
    options;

  const inferredType =
    resourceType ||
    (file.type?.startsWith("video/")
      ? "video"
      : file.type?.startsWith("image/")
      ? "image"
      : "raw");

  onPhaseChange?.(UPLOAD_PHASES.SIGNATURE);
  const ticket = await initiateUploadSignature(inferredType, uploadType);

  onPhaseChange?.(UPLOAD_PHASES.UPLOAD);
  const cloudinaryResult = await uploadToCloudinary(file, ticket, {
    resourceType: inferredType,
    onProgress,
    signal,
  });

  onPhaseChange?.(UPLOAD_PHASES.REGISTER);
  const { mediaId } = await registerMedia({
    public_id: cloudinaryResult.public_id,
    secure_url: cloudinaryResult.secure_url,
    resource_type: cloudinaryResult.resource_type,
    original_name: file.name,
    bytes: cloudinaryResult.bytes,
    uploadType,
  });

  onPhaseChange?.(UPLOAD_PHASES.DONE);

  return {
    mediaId,
    public_id: cloudinaryResult.public_id,
    secure_url: cloudinaryResult.secure_url,
    resource_type: cloudinaryResult.resource_type,
  };
};

/* -------------------------------------------------------------------------- */
/* Small formatting helpers (re-export so any caller can render progress UI)  */
/* -------------------------------------------------------------------------- */

export const formatBytes = (bytes) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
};

export const formatSpeed = (bytesPerSec) => {
  if (!Number.isFinite(bytesPerSec) || bytesPerSec <= 0) return "—";
  return `${formatBytes(bytesPerSec)}/s`;
};

export const formatDuration = (seconds) => {
  if (!Number.isFinite(seconds) || seconds < 0) return "—";
  if (seconds < 1) return "<1s";
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}h ${m}m`;
  if (m > 0) return `${m}m ${s}s`;
  return `${s}s`;
};
