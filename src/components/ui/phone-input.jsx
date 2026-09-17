import * as React from "react";
import {
  PhoneInput as InternationalPhoneInput,
  defaultCountries,
  parseCountry,
} from "react-international-phone";
import "react-international-phone/style.css";
import { cn } from "../../lib/utils";
import { toE164Phone } from "../../utils/phone";

export const DEFAULT_PHONE_COUNTRY = "za";

/** Expand this list when more countries are enabled. */
const ENABLED_PHONE_COUNTRIES = defaultCountries.filter((country) =>
  ["za"].includes(parseCountry(country).iso2)
);

const InternationalPhoneField = React.forwardRef(
  (
    {
      value,
      onChange,
      onBlur,
      name,
      disabled,
      placeholder = "Enter Phone Number",
      error,
      className,
      inputClassName,
      ...props
    },
    ref
  ) => {
    const isMasked = typeof value === "string" && value.includes("*");

    const formatMaskedDisplay = (val) => {
      if (!val) return "";
      let s = String(val).trim();
      if (s.startsWith("+27")) {
        const body = s.slice(3).trim();
        return `+27 ${body}`;
      }
      return s;
    };

    const handleMaskedInputChange = (e) => {
      const typed = e.target.value;
      if (!typed || !typed.includes("*")) {
        onChange?.(toE164Phone(typed));
      } else {
        const digitsOnly = typed.replace(/\D/g, "");
        if (digitsOnly.length > 4) {
          onChange?.(toE164Phone(digitsOnly));
        } else {
          onChange?.(typed);
        }
      }
    };

    const inputProps = isMasked
      ? {
          value: formatMaskedDisplay(value),
          onChange: handleMaskedInputChange,
        }
      : undefined;

    return (
      <InternationalPhoneInput
        ref={ref}
        defaultCountry={DEFAULT_PHONE_COUNTRY}
        countries={ENABLED_PHONE_COUNTRIES}
        hideDropdown
        disableCountryGuess
        forceDialCode
        value={value || ""}
        onChange={(phone) => {
          if (!isMasked) {
            onChange?.(toE164Phone(phone));
          }
        }}
        onBlur={onBlur}
        name={name}
        disabled={disabled}
        placeholder={placeholder}
        inputProps={inputProps}
        className={cn(
          "w-full [--react-international-phone-height:48px] [--react-international-phone-font-size:14px] [--react-international-phone-border-radius:8px] [--react-international-phone-border-color:#d1d5db] [--react-international-phone-selected-dropdown-item-background-color:#f3f4f6]",
          error &&
            "[--react-international-phone-border-color:#ef4444]",
          className
        )}
        inputClassName={cn(
          "!w-full !text-sm ",
          inputClassName
        )}
        {...props}
      />
    );
  }
);

InternationalPhoneField.displayName = "InternationalPhoneField";

export { InternationalPhoneField };
