import React, { useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../../../components/ui/select";
import { cn } from "../../../../lib/utils";

export function FieldLabel({ children, required = false, className }) {
  return (
    <label
      className={cn(
        "mb-2 block text-[14px] font-medium text-[#1a1a1a]",
        className
      )}
    >
      {children}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
}

export function SelectField({
  label,
  /** Stable id for Radix remount when API hydrates value after mount */
  name,
  required,
  value,
  onChange,
  options,
  placeholder,
  inputClass,
  /** Inline validation message — keeps label, control, and error as one visual unit */
  error,
  disabled = false,
}) {
  const hasError = Boolean(error);
  const fieldKey = name ?? label;
  const selectValue =
    value !== undefined && value !== null && String(value).trim() !== ""
      ? String(value)
      : undefined;

  return (
    <div className="w-full">
      <FieldLabel required={required}>{label}</FieldLabel>
      <Select
        key={`${fieldKey}:${selectValue ?? "∅"}`}
        value={selectValue}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger
          disabled={disabled}
          className={cn(
            inputClass,
            hasError &&
              "border-red-400 focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-200",
            disabled && "cursor-not-allowed opacity-60 bg-gray-100"
          )}
          aria-invalid={hasError}
        >
          <SelectValue placeholder={placeholder || "Select"} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={String(option.value)} value={String(option.value)}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError ? (
        <p
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-xs font-medium leading-snug text-red-500"
        >
          <span>{error}</span>
        </p>
      ) : null}
    </div>
  );
}

export function DateField({
  label,
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  max,
  min,
}) {
  const inputRef = useRef(null);

  const openPicker = () => {
    if (disabled) return;
    const el = inputRef.current;
    if (!el) return;
    if (typeof el.showPicker === "function") {
      el.showPicker();
    }
    el.focus();
  };

  const formatDateDisplay = (dateValue) => {
    if (!dateValue) return "dd/mm/yyyy";
    const [year, month, day] = dateValue.split("-");
    if (!year || !month || !day) return dateValue;
    return `${day}/${month}/${year}`;
  };

  return (
    <div className="w-full min-w-0">
      <FieldLabel required={required}>{label}</FieldLabel>
      <div
        className={cn(
          "relative h-[48px] w-full min-w-0 rounded-[12px] border border-[#e5e7eb] px-4 transition-colors",
          disabled
            ? "cursor-not-allowed bg-gray-100 opacity-60"
            : "bg-white focus-within:border-[#0353a4]"
        )}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={openPicker}
        onKeyDown={(e) => !disabled && e.key === "Enter" && openPicker()}
      >
        <span
          className={`pointer-events-none absolute left-4 top-1/2 max-w-[calc(100%-2.5rem)] -translate-y-1/2 truncate text-[14px] leading-none ${
            value ? "text-[#1e293b]" : "text-[rgba(30,41,59,0.5)]"
          }`}
        >
          {formatDateDisplay(value)}
        </span>

        <CalendarDays className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />

        <Input
          ref={inputRef}
          type="date"
          disabled={disabled}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          max={max}
          min={min}
          className="absolute inset-0 h-full w-full min-w-0 cursor-pointer border-0 bg-transparent px-4 text-transparent opacity-0 outline-none focus:outline-none focus:ring-0 disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}

export function UploadBox({
  title,
  file,
  /** Existing image URL from API when no new File chosen (edit flow) */
  existingPreviewUrl,
  onChange,
  onDrop,
  compact = false,
  uploadImg,
  error,
}) {
  const [objectPreviewUrl, setObjectPreviewUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setObjectPreviewUrl("");
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setObjectPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const previewSrc = file ? objectPreviewUrl : existingPreviewUrl || "";
  const hasPreview = Boolean(previewSrc);

  return (
    <div>
      {title ? <FieldLabel>{title}</FieldLabel> : null}
      <label
        className={`relative flex w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-5 text-center bg-[#FAFAFA] transition-colors ${
          error
            ? "border-red-400 hover:border-red-500"
            : "border-[#D4DCE7] hover:border-blue-300"
        } ${compact ? "min-h-[210px]" : "min-h-[200px]"}`}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.gif"
          onChange={onChange}
          className="hidden"
        />
        {hasPreview ? (
          <>
            <img
              src={previewSrc}
              alt={file?.name || "Campaign image"}
              className={`mb-2 rounded-xl object-cover ${compact ? "h-28 w-full" : "h-32 w-full"}`}
            />
            {file ? (
              <>
                <p className="text-xs font-medium text-gray-700 truncate max-w-full px-2">
                  {file.name}
                </p>
                <p className="mt-1 text-xs text-gray-400">Click to replace</p>
              </>
            ) : (
              <p className="mt-1 text-xs text-gray-400">Current image · click to replace</p>
            )}
          </>
        ) : (
          <>
            {uploadImg ? <img src={uploadImg} alt="" /> : null}
            <p className="text-sm font-medium text-[#1E60DB] sm:text-base">
              Drag & Drop or Click to Upload
            </p>
            <p className="mt-2 text-xs text-[#7C899D]">
              Supported formats: .png, .jpeg, .gif
            </p>
            <p className="text-[#7C899D] text-xs font-medium">
              Max size: 8 MB
            </p>
            {!compact && (
              <p className="mt-1 text-[11px] text-[#7C899D]">
                Upload one cover image only
              </p>
            )}
            {compact && (
              <p className="mt-1 text-[11px] text-[#7C899D]">
                Max 1 image per moodboard slot
              </p>
            )}
          </>
        )}
      </label>
      {error && (
        <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
