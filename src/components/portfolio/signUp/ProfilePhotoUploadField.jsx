import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Camera, Crop, Loader2, User, X } from "lucide-react";
import uploadIcon from "../../../assets/images/createAccount/uploadicon.svg";
import { ProfilePhotoCropModal } from "./ProfilePhotoCropModal";

const ACCEPTED_IMAGE_ACCEPT =
  ".png,.jpeg,.jpg,.gif,.webp,image/png,image/jpeg,image/gif,image/webp";

const MAX_FILE_SIZE_BYTES = 8 * 1024 * 1024; // 8 MB

const FILE_HINT =
  ".png, .jpeg, .gif files up to 8 MB. Recommended size is 256×256 px. You can add one photo maximum.";

function ProfilePhotoPreview({ value, existingImageUrl, className = "" }) {
  const objectPreviewUrl = useMemo(() => {
    if (value instanceof File) return URL.createObjectURL(value);
    return null;
  }, [value]);

  const previewUrl = objectPreviewUrl || existingImageUrl || null;

  useEffect(() => {
    if (!objectPreviewUrl) return undefined;
    return () => URL.revokeObjectURL(objectPreviewUrl);
  }, [objectPreviewUrl]);

  if (previewUrl) {
    return (
      <img
        src={previewUrl}
        alt="Profile preview"
        className={className}
      />
    );
  }

  return (
    <img
      src={uploadIcon}
      alt="Upload"
      className="h-14 w-14 opacity-90 md:h-14 md:w-14"
    />
  );
}

function RemovePhotoButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        onClick();
      }}
      className="absolute -right-2 -top-2 z-20 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-gray-900 text-white shadow-md transition hover:bg-black hover:scale-105 cursor-pointer"
      aria-label="Remove profile photo"
    >
      <X className="h-3.5 w-3.5" strokeWidth={2.5} aria-hidden />
    </button>
  );
}

function MobileUploadOptionsSheet({ open, onClose, onTakePhoto, onChooseLibrary }) {
  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] md:hidden">
      <button
        type="button"
        aria-label="Close upload options"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Profile photo upload options"
        className="fixed bottom-0 left-0 right-0 rounded-t-2xl bg-white px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-3 shadow-xl"
      >
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-gray-200" />
        <p className="mb-4 text-center text-sm font-medium text-gray-900">
          Upload Options
        </p>
        <div className="flex flex-col gap-2">
          <button
            type="button"
            onClick={onTakePhoto}
            className="rounded-xl border border-[#e5e7eb] px-4 py-3.5 text-left text-sm font-medium text-[#0353a4] transition hover:bg-blue-50"
          >
            Take Photo
            <span className="mt-0.5 block text-xs font-normal text-gray-500">
              Open your camera to take a new picture
            </span>
          </button>
          <button
            type="button"
            onClick={onChooseLibrary}
            className="rounded-xl border border-[#e5e7eb] px-4 py-3.5 text-left text-sm font-medium text-[#0353a4] transition hover:bg-blue-50"
          >
            Choose from Library
            <span className="mt-0.5 block text-xs font-normal text-gray-500">
              Select an existing photo from your gallery
            </span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-1 rounded-xl px-4 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

export function ProfilePhotoUploadField({
  value,
  onChange,
  onBlur,
  inputRef,
  name,
  existingImageUrl = "",
}) {
  const [showMobileOptions, setShowMobileOptions] = useState(false);
  const [clearedExisting, setClearedExisting] = useState(false);
  const [fileToCrop, setFileToCrop] = useState(null);
  const [validationError, setValidationError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const fileInputInternalRef = useRef(null);
  const cameraInputRef = useRef(null);
  const libraryInputRef = useRef(null);

  useEffect(() => {
    setClearedExisting(false);
  }, [existingImageUrl]);

  const hasPreview =
    value instanceof File || Boolean(existingImageUrl && !clearedExisting);

  const triggerFileInput = () => {
    if (fileInputInternalRef.current) {
      fileInputInternalRef.current.click();
    }
  };

  const validateFile = (file) => {
    if (!file) return false;

    // Validate type
    const fileType = file.type?.toLowerCase() || "";
    const isImage =
      fileType.startsWith("image/") ||
      /\.(png|jpe?g|gif|webp)$/i.test(file.name);

    if (!isImage) {
      setValidationError("Invalid file type. Please select a .png, .jpeg, .jpg, or .gif image.");
      return false;
    }

    // Validate size (max 8 MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setValidationError("File size exceeds 8 MB limit. Please choose a smaller photo.");
      return false;
    }

    setValidationError("");
    return true;
  };

  const handleRawFileSelected = (file) => {
    if (file) {
      if (validateFile(file)) {
        setFileToCrop(file);
        setShowMobileOptions(false);
      }
    }
  };

  const handleOpenCropCurrent = () => {
    if (value instanceof File) {
      setFileToCrop(value);
    } else if (existingImageUrl && !clearedExisting) {
      setFileToCrop(existingImageUrl);
    }
  };

  const handleCropComplete = async (croppedFile) => {
    if (croppedFile) {
      setIsProcessing(true);
      try {
        onChange(croppedFile);
        setClearedExisting(false);
        setValidationError("");
      } finally {
        setIsProcessing(false);
      }
    }
    setFileToCrop(null);
  };

  const handleFileInputChange = (event) => {
    handleRawFileSelected(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleRemove = () => {
    onChange(undefined);
    setClearedExisting(true);
    setValidationError("");
    onBlur?.();
  };

  const visibleExistingUrl = clearedExisting ? "" : existingImageUrl;

  return (
    <div className="flex flex-col gap-1">
      {/* Mobile Layout */}
      <div className="mt-2 flex flex-col items-center gap-4 md:hidden">
        <div className="relative h-24 w-24">
          <button
            type="button"
            onClick={triggerFileInput}
            className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-50 text-left transition hover:border-[#0353a4] ${
              hasPreview ? "cursor-pointer" : "cursor-pointer"
            }`}
            title="Click to select profile photo"
          >
            {hasPreview ? (
              <ProfilePhotoPreview
                value={value}
                existingImageUrl={visibleExistingUrl}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-10 w-10 text-gray-300" strokeWidth={1.5} />
            )}

            {isProcessing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-xs">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            )}
          </button>
          {hasPreview && !isProcessing ? <RemovePhotoButton onClick={handleRemove} /> : null}
        </div>

        <p className="text-sm text-gray-500">Upload profile pic</p>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            onClick={triggerFileInput}
            className="inline-flex items-center gap-2 rounded-full border border-[#0353a4] bg-white px-5 py-2 text-sm font-medium text-[#0353a4] transition hover:bg-blue-50 cursor-pointer"
          >
            Upload photo
            <Camera className="h-4 w-4 shrink-0" aria-hidden />
          </button>
          {hasPreview ? (
            <button
              type="button"
              onClick={handleOpenCropCurrent}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 cursor-pointer"
            >
              <Crop className="h-3.5 w-3.5 text-[#0353a4]" />
              Crop photo
            </button>
          ) : null}
        </div>

        <p className="max-w-xs text-center text-xs leading-relaxed text-gray-400">
          {FILE_HINT}
        </p>
      </div>

      {/* Desktop Layout */}
      <div className="mt-2 hidden flex-col items-start gap-4 md:flex md:flex-row md:items-start">
        <div className="relative">
          <div
            onDrop={(e) => {
              e.preventDefault();
              handleRawFileSelected(e.dataTransfer.files?.[0]);
            }}
            onDragOver={(e) => e.preventDefault()}
            onClick={triggerFileInput}
            className="group relative flex h-26 w-26 cursor-pointer items-center justify-center overflow-hidden rounded-xl border border-gray-300 transition hover:border-blue-400"
            title="Click to select profile photo"
          >
            {hasPreview ? (
              <div
                className="absolute inset-0 z-5 flex flex-col items-center justify-center bg-black/40 text-white opacity-0 transition-opacity group-hover:opacity-100"
                title="Change or crop photo"
              >
                <Crop className="h-5 w-5 mb-0.5" />
                <span className="text-[10px] font-medium">Crop photo</span>
              </div>
            ) : null}

            {isProcessing ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/50 backdrop-blur-xs">
                <Loader2 className="h-6 w-6 animate-spin text-white" />
              </div>
            ) : null}

            <ProfilePhotoPreview
              value={value}
              existingImageUrl={visibleExistingUrl}
              className="h-full w-full rounded-xl object-cover"
            />
          </div>
          {hasPreview && !isProcessing ? <RemovePhotoButton onClick={handleRemove} /> : null}
        </div>

        <div className="mt-2 flex flex-col items-start gap-2 text-left">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={triggerFileInput}
              className="inline-block rounded-md border border-[#AFC5EE] bg-white px-4 py-2 text-sm font-medium text-[#0353a4] transition hover:bg-blue-50 cursor-pointer"
            >
              Upload photo
            </button>

            {hasPreview ? (
              <button
                type="button"
                onClick={handleOpenCropCurrent}
                className="inline-flex items-center gap-1.5 rounded-md border border-gray-300 bg-white px-3.5 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 cursor-pointer"
              >
                <Crop className="h-4 w-4 text-[#0353a4]" />
                Crop photo
              </button>
            ) : null}
          </div>
          <p className="text-xs leading-relaxed text-gray-400">{FILE_HINT}</p>
        </div>
      </div>

      {/* Hidden File Input (Shared across Desktop & Mobile) */}
      <input
        ref={(node) => {
          fileInputInternalRef.current = node;
          if (typeof inputRef === "function") {
            inputRef(node);
          } else if (inputRef) {
            inputRef.current = node;
          }
        }}
        name={name}
        type="file"
        accept={ACCEPTED_IMAGE_ACCEPT}
        className="hidden"
        onBlur={onBlur}
        onChange={handleFileInputChange}
      />

      <input
        ref={cameraInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_ACCEPT}
        capture="user"
        className="hidden"
        onBlur={onBlur}
        onChange={handleFileInputChange}
      />
      <input
        ref={libraryInputRef}
        type="file"
        accept={ACCEPTED_IMAGE_ACCEPT}
        className="hidden"
        onBlur={onBlur}
        onChange={handleFileInputChange}
      />

      {/* Validation Error Message */}
      {validationError ? (
        <p className="mt-1.5 text-xs font-medium text-red-500">{validationError}</p>
      ) : null}

      <MobileUploadOptionsSheet
        open={showMobileOptions}
        onClose={() => setShowMobileOptions(false)}
        onTakePhoto={() => cameraInputRef.current?.click()}
        onChooseLibrary={() => libraryInputRef.current?.click()}
      />

      <ProfilePhotoCropModal
        file={fileToCrop}
        isOpen={Boolean(fileToCrop)}
        defaultShape="circle"
        onClose={() => setFileToCrop(null)}
        onCropComplete={handleCropComplete}
      />
    </div>
  );
}
