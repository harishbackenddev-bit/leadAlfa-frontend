/**
 * mediaUploadService.js
 * ============================================================================
 * Reusable helper that runs a 3-step direct upload. Provider is selected by env:
 *
 *   VITE_USE_S3_UPLOAD=true            → S3 (docs/new-integration/s3-direct-upload-integration.md)
 *   VITE_USE_CLOUDINARY_UPLOAD=true    → Cloudinary (docs/initiale_signature.md)
 *
 * Set exactly one to true. If S3 is true it wins; otherwise Cloudinary (existing default).
 *
 * Cloudinary:
 *   Step 1 → POST /upload/initiate-signature
 *   Step 2 → POST https://api.cloudinary.com  (XHR)
 *   Step 3 → POST /media/register  { public_id, secure_url, … }
 *
 * S3:
 *   Step 1 → POST /upload/initiate-signature  → { presignedUrl, s3Key }
 *   Step 2 → PUT file to presignedUrl         (XHR)
 *   Step 3 → POST /media/register  { s3Key, originalName }
 *
 * Callers still send `mediaId` to feature endpoints. UI progress callbacks are unchanged.
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

export const UPLOAD_PROVIDERS = Object.freeze({
  CLOUDINARY: "cloudinary",
  S3: "s3",
});

const envFlagTrue = (value) => String(value ?? "").toLowerCase() === "true";

/** Active upload provider from env flags. S3 wins if both are true. */
export const getUploadProvider = () => {
  if (envFlagTrue(import.meta.env.VITE_USE_S3_UPLOAD)) {
    return UPLOAD_PROVIDERS.S3;
  }
  return UPLOAD_PROVIDERS.CLOUDINARY;
};

export const isS3UploadEnabled = () =>
  getUploadProvider() === UPLOAD_PROVIDERS.S3;

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
 * S3 tickets use presignedUrl / s3Key instead of signature.
 */
const unwrapSignaturePayload = (payload) => {
  if (!payload || typeof payload !== "object") return {};
  if (
    payload.signature != null ||
    payload.presignedUrl != null ||
    payload.s3Key != null
  ) {
    return payload;
  }
  const nested = payload.data ?? payload.ticket ?? payload.result;
  if (nested && typeof nested === "object") {
    if (
      nested.signature != null ||
      nested.presignedUrl != null ||
      nested.s3Key != null
    ) {
      return nested;
    }
  }
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

const normalizeS3UploadTicket = (ticket = {}, fallbackResourceType = "video") => {
  const raw = unwrapSignaturePayload(ticket);
  return {
    provider: UPLOAD_PROVIDERS.S3,
    presignedUrl: String(raw.presignedUrl || raw.presigned_url || "").trim(),
    s3Key: String(raw.s3Key || raw.s3_key || "").trim(),
    s3Bucket: raw.s3Bucket || raw.s3_bucket || null,
    expiresAt: raw.expiresAt || raw.expires_at || null,
    resourceType:
      raw.resourceType || raw.resource_type || fallbackResourceType || "video",
    uploadType: raw.uploadType || raw.upload_type || null,
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

    let raw;
    try {
      const { data } = await axiosInstance.post(
        "/upload/initiate-signature",
        body
      );
      raw = data;
    } catch (err) {
      const errResData = err?.response?.data;
      const errMsg =
        (typeof errResData === "object"
          ? errResData?.message || errResData?.error
          : errResData) || err?.message || "";

      if (
        uploadType &&
        typeof errMsg === "string" &&
        errMsg.toLowerCase().includes("uploadtype must be")
      ) {
        const { data: fallbackData } = await axiosInstance.post(
          "/upload/initiate-signature",
          { resourceType }
        );
        raw = fallbackData;
      } else {
        throw err;
      }
    }

    const unwrapped = unwrapSignaturePayload(raw);
    const ticket = isS3UploadEnabled()
      ? normalizeS3UploadTicket(unwrapped, resourceType)
      : normalizeUploadTicket(unwrapped, resourceType);

    if (import.meta.env.DEV) {
      console.debug("[initiateUploadSignature]", {
        provider: getUploadProvider(),
        uploadType: uploadType || "default",
        resourceType,
        signedParams: ticket.signedParams,
        cloudName: ticket.cloudName,
        s3Key: ticket.s3Key,
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
/* Step 2 (S3) — PUT file bytes to the presigned URL (XHR for progress)       */
/* -------------------------------------------------------------------------- */

const wireXhrUploadProgress = (xhr, onProgress) => {
  const startedAt = performance.now();
  let lastTickAt = startedAt;
  let lastLoaded = 0;
  let lastInstSpeed = 0;

  xhr.upload.addEventListener("progress", (event) => {
    if (!event.lengthComputable) return;

    const now = performance.now();
    const elapsedSeconds = (now - startedAt) / 1000;
    const dtSeconds = (now - lastTickAt) / 1000;
    const dBytes = event.loaded - lastLoaded;

    const rawInstSpeed = dtSeconds > 0 ? dBytes / dtSeconds : 0;
    lastInstSpeed =
      lastInstSpeed === 0
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
        console.warn("[upload] onProgress callback threw", cbErr);
      }
    }
  });
};

/**
 * Upload a File directly to S3 using a presigned PUT URL.
 *
 * @returns {Promise<{ s3Key: string, originalName: string }>}
 */
export const uploadToS3 = (file, ticket, options = {}) => {
  const { onProgress, signal } = options;
  const normalized = normalizeS3UploadTicket(ticket, ticket?.resourceType);
  const { presignedUrl, s3Key } = normalized;

  if (!presignedUrl || !s3Key) {
    throw new Error("S3 upload ticket is incomplete. Please retry.");
  }

  if (import.meta.env.DEV) {
    console.debug("[uploadToS3]", { s3Key, expiresAt: normalized.expiresAt });
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    wireXhrUploadProgress(xhr, onProgress);

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve({ s3Key, originalName: file.name });
      } else {
        reject(new Error(`Direct S3 upload failed (HTTP ${xhr.status}).`));
      }
    });

    xhr.addEventListener("error", () =>
      reject(new Error("Network error while uploading to S3."))
    );
    xhr.addEventListener("timeout", () =>
      reject(new Error("S3 upload timed out. Please retry."))
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

    xhr.open("PUT", presignedUrl);
    xhr.setRequestHeader("Content-Type", file.type || "application/octet-stream");
    xhr.send(file);
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
  s3Key,
}) => {
  try {
    const body = s3Key
      ? {
          s3Key,
          originalName: original_name,
        }
      : {
          public_id,
          secure_url,
          resource_type,
          original_name,
        };
    if (!s3Key && bytes != null) body.bytes = bytes;
    if (!s3Key && uploadType) {
      body.uploadType = uploadType;
      body.upload_type = uploadType;
    }
    const { data } = await axiosInstance.post("/media/register", body);
    // Cloudinary: { mediaId }  |  S3: { mediaId, media }
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
 * Run the complete upload pipeline (initiate → provider upload → register).
 * Provider is selected by VITE_USE_S3_UPLOAD / VITE_USE_CLOUDINARY_UPLOAD.
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

  const useS3 = isS3UploadEnabled();

  onPhaseChange?.(UPLOAD_PHASES.SIGNATURE);
  const ticket = await initiateUploadSignature(inferredType, uploadType);

  onPhaseChange?.(UPLOAD_PHASES.UPLOAD);

  if (useS3) {
    const s3Result = await uploadToS3(file, ticket, { onProgress, signal });

    onPhaseChange?.(UPLOAD_PHASES.REGISTER);
    const registered = await registerMedia({
      s3Key: s3Result.s3Key,
      original_name: file.name,
    });

    const media = registered?.media || {};
    const mediaId = registered?.mediaId ?? media.id;

    onPhaseChange?.(UPLOAD_PHASES.DONE);

    return {
      mediaId,
      public_id: media.storageKey || s3Result.s3Key,
      secure_url: media.url,
      resource_type: media.type || inferredType,
    };
  }

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
