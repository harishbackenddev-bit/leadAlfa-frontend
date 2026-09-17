import { useEffect, useMemo, useRef, useState } from "react";
import { useFormState, useWatch } from "react-hook-form";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "../../../lib/utils";
import {
  CITY_OTHER_VALUE,
  brandCityOptions,
} from "../../../utils/location";
import { FieldLabel } from "../../../pages/brand/Campaigns/components/CampaignFormFields";
import { FormField, FormItem } from "../../ui/form";
import { Input } from "../../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";

const cityListOptions = brandCityOptions.filter(
  (option) => option.value !== CITY_OTHER_VALUE
);

function getTriggerLabel(city, cityOther) {
  if (!city) return null;
  if (city === CITY_OTHER_VALUE) {
    const custom = (cityOther || "").trim();
    return custom || "Other";
  }
  return cityListOptions.find((option) => option.value === city)?.label || city;
}

function BrandCityCombobox({
  value,
  onValueChange,
  cityOther,
  onCityOtherChange,
  onValidateOther,
  inputClass,
  hasError,
}) {
  const [open, setOpen] = useState(false);
  const [otherPanel, setOtherPanel] = useState(value === CITY_OTHER_VALUE);
  const [search, setSearch] = useState("");
  const [popoverWidth, setPopoverWidth] = useState(undefined);
  const triggerRef = useRef(null);
  const otherInputRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (open && triggerRef.current) {
      setPopoverWidth(triggerRef.current.offsetWidth);
    }
    if (open && !otherPanel) {
      const id = requestAnimationFrame(() => searchInputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    if (!open) {
      setSearch("");
    }
    return undefined;
  }, [open, otherPanel]);

  useEffect(() => {
    if (open && value === CITY_OTHER_VALUE) {
      setOtherPanel(true);
    }
  }, [open, value]);

  useEffect(() => {
    if (otherPanel && open) {
      const id = requestAnimationFrame(() => otherInputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
    return undefined;
  }, [otherPanel, open]);

  const filteredCities = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return cityListOptions;
    return cityListOptions.filter(
      (option) =>
        option.label.toLowerCase().includes(query) ||
        option.value.toLowerCase().includes(query)
    );
  }, [search]);

  const displayLabel = getTriggerLabel(value, cityOther);
  const hasValue = Boolean(displayLabel);

  const handleCitySelect = (selected) => {
    if (selected === CITY_OTHER_VALUE) {
      onValueChange(CITY_OTHER_VALUE);
      setOtherPanel(true);
      setSearch("");
      return;
    }
    onCityOtherChange("");
    onValueChange(selected);
    setOtherPanel(false);
    setSearch("");
    setOpen(false);
  };

  const handleOtherDone = async () => {
    const valid = await onValidateOther?.();
    if (!valid) return;
    setOpen(false);
    setOtherPanel(false);
  };

  const handleOpenChange = (next) => {
    setOpen(next);
    if (!next) {
      setOtherPanel(value === CITY_OTHER_VALUE);
      setSearch("");
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          ref={triggerRef}
          type="button"
          role="combobox"
          aria-expanded={open}
          className={cn(
            inputClass,
            "flex w-full items-center justify-between text-left",
            !hasValue && "text-[rgba(30,41,59,0.5)]",
            hasError &&
              "border-red-400 focus-visible:border-red-500 focus-visible:ring-1 focus-visible:ring-red-200"
          )}
        >
          <span className="truncate">{displayLabel || "Select"}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={4}
        className="z-[100] rounded-lg border border-gray-200 bg-white p-0 shadow-md"
        style={{ width: popoverWidth ? `${popoverWidth}px` : undefined }}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        {otherPanel ? (
          <div className="space-y-3 p-3">
            <p className="text-xs font-medium text-gray-600">Enter your city</p>
            <Input
              ref={otherInputRef}
              value={cityOther || ""}
              onChange={(e) => onCityOtherChange(e.target.value)}
              placeholder="City name"
              className={cn(inputClass, "h-10 w-full")}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleOtherDone();
                }
              }}
            />
            <div className="flex gap-2">
              <button
                type="button"
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => {
                  setOtherPanel(false);
                  if (value === CITY_OTHER_VALUE && !(cityOther || "").trim()) {
                    onValueChange("");
                  }
                }}
              >
                Back
              </button>
              <button
                type="button"
                className="flex-1 rounded-lg bg-[#0353a4] px-3 py-2 text-sm font-medium text-white hover:bg-[#024a92]"
                onClick={handleOtherDone}
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <div className="flex w-full flex-col">
            <div className="flex items-center border-b border-gray-200 px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 text-gray-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city..."
                className="h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-500"
              />
            </div>
            <ul
              className="max-h-[280px] overflow-y-auto overflow-x-hidden p-1"
              role="listbox"
            >
              {filteredCities.length === 0 ? (
                <li className="py-6 text-center text-sm text-gray-500">
                  No city found.
                </li>
              ) : (
                filteredCities.map((option) => {
                  const isSelected = value === option.value;
                  return (
                    <li key={option.value} role="option" aria-selected={isSelected}>
                      <button
                        type="button"
                        className={cn(
                          "flex w-full cursor-pointer items-center rounded-sm px-2 py-2 text-left text-sm hover:bg-gray-100",
                          isSelected && "bg-gray-100"
                        )}
                        onClick={() => handleCitySelect(option.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4 shrink-0",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {option.label}
                      </button>
                    </li>
                  );
                })
              )}
              <li role="option" aria-selected={value === CITY_OTHER_VALUE}>
                <button
                  type="button"
                  className={cn(
                    "flex w-full cursor-pointer items-center rounded-sm border-t border-gray-100 px-2 py-2 text-left text-sm hover:bg-gray-100",
                    value === CITY_OTHER_VALUE && "bg-gray-100"
                  )}
                  onClick={() => handleCitySelect(CITY_OTHER_VALUE)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 shrink-0",
                      value === CITY_OTHER_VALUE ? "opacity-100" : "opacity-0"
                    )}
                  />
                  Other
                </button>
              </li>
            </ul>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function BrandCityComboboxField({ control, inputClass, setValue, trigger }) {
  const { errors } = useFormState({ control });
  const cityOther = useWatch({ control, name: "cityOther" });
  const errorMessage = errors.city?.message || errors.cityOther?.message;

  return (
    <div className="w-full">
      <FormField
        control={control}
        name="city"
        render={({ field }) => (
          <FormItem className="w-full space-y-0">
            <FieldLabel required>City</FieldLabel>
            <BrandCityCombobox
              inputClass={inputClass}
              value={field.value ?? ""}
              onValueChange={field.onChange}
              cityOther={cityOther}
              onCityOtherChange={(next) =>
                setValue("cityOther", next, { shouldValidate: true })
              }
              onValidateOther={() => trigger(["city", "cityOther"])}
              hasError={Boolean(errorMessage)}
            />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="cityOther"
        render={({ field }) => (
          <input type="hidden" {...field} value={field.value ?? ""} />
        )}
      />
      {errorMessage ? (
        <p
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-xs font-medium leading-snug text-red-500"
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
