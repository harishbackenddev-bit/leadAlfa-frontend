import * as React from "react";
import { Check, X } from "lucide-react";
import { Badge } from "./badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export function CheckboxMultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "Select...",
}) {
  const toggle = (optionValue) => {
    onChange?.(
      value.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue]
    );
  };

  return (
    <div className="space-y-2">
      <Select onValueChange={toggle} value="">
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500">
              No options available
            </div>
          ) : (
            options.map((option) => {
              const isChecked = value.includes(option.value);
              return (
                <SelectItem key={option.value} value={option.value} className="pl-2">
                  <span className="flex items-center gap-2">
                    <span
                      aria-hidden="true"
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[4px] border ${
                        isChecked
                          ? "border-[#0F57A7] bg-[#0F57A7] text-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isChecked ? <Check className="h-3 w-3" /> : null}
                    </span>
                    {option.label}
                  </span>
                </SelectItem>
              );
            })
          )}
        </SelectContent>
      </Select>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((val) => {
            const option = options.find((opt) => opt.value === val);
            return (
              <Badge key={val} variant="secondary" className="pl-2 pr-1 py-1 text-sm">
                {option?.label || val}
                <button
                  type="button"
                  onClick={() => onChange?.(value.filter((v) => v !== val))}
                  className="ml-1 rounded-full hover:bg-gray-300 p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            );
          })}
        </div>
      )}
    </div>
  );
}
