import * as React from "react";
import { Check, ChevronDown, Search, X } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Badge } from "./badge";

export function SearchableSelect({
  options = [],
  value,
  onChange,
  placeholder = "Select...",
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  className,
  disabled = false,
  isMulti = false,
}) {
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const selectedArray = React.useMemo(() => {
    if (Array.isArray(value)) return value;
    if (value) return [value];
    return [];
  }, [value]);

  const filteredOptions = React.useMemo(() => {
    if (!searchQuery) return options;
    return options.filter((option) =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [options, searchQuery]);

  const handleSelect = (selectedValue) => {
    if (isMulti) {
      let newValues;
      if (selectedValue === "all") {
        if (selectedArray.includes("all")) {
          newValues = [];
        } else {
          newValues = ["all"];
        }
      } else {
        const withoutAll = selectedArray.filter((v) => v !== "all");
        if (withoutAll.includes(selectedValue)) {
          newValues = withoutAll.filter((v) => v !== selectedValue);
        } else {
          newValues = [...withoutAll, selectedValue];
        }
      }
      onChange?.(newValues);
    } else {
      onChange?.(selectedValue);
      setOpen(false);
      setSearchQuery("");
    }
  };

  const handleRemoveBadge = (e, valToRemove) => {
    e.stopPropagation();
    if (isMulti) {
      const newValues = selectedArray.filter((v) => v !== valToRemove);
      onChange?.(newValues);
    }
  };

  let triggerText = placeholder;
  if (!isMulti) {
    const selectedOption = options.find((opt) => opt.value === value);
    if (selectedOption) triggerText = selectedOption.label;
  } else {
    if (selectedArray.length === 0) {
      triggerText = placeholder;
    } else if (selectedArray.includes("all")) {
      triggerText = "All";
    } else if (selectedArray.length === 1) {
      const opt = options.find((o) => o.value === selectedArray[0]);
      triggerText = opt ? opt.label : selectedArray[0];
    } else {
      triggerText = `${selectedArray.length} locations selected`;
    }
  }

  return (
    <div className="space-y-2 w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled}
            className={cn(
              "w-full justify-between font-normal h-11 px-4 py-3 text-sm rounded-lg border border-gray-300",
              selectedArray.length === 0 && !value && "text-gray-500",
              className
            )}
          >
            <span className="truncate">{triggerText}</span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-[--radix-popover-trigger-width] p-0"
          align="start"
        >
          <div className="flex flex-col">
            <div className="flex items-center border-b border-gray-200 px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-11 w-full bg-transparent py-3 text-sm outline-none placeholder:text-gray-500"
              />
            </div>
            <div className="max-h-[300px] overflow-y-auto p-1">
              {filteredOptions.length === 0 ? (
                <div className="py-6 text-center text-sm text-gray-500">
                  {emptyText}
                </div>
              ) : (
                filteredOptions.map((option) => {
                  const isSelected = isMulti
                    ? selectedArray.includes(option.value)
                    : value === option.value;
                  return (
                    <div
                      key={option.value}
                      onClick={() => handleSelect(option.value)}
                      className={cn(
                        "relative flex cursor-pointer select-none items-center px-2 py-2 text-sm outline-none hover:bg-gray-100 border-b border-gray-100 last:border-0 rounded-sm",
                        isSelected && "bg-blue-50/60 text-blue-900 font-medium"
                      )}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4 text-[#0F57A7]",
                          isSelected ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {option.label}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {isMulti && selectedArray.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {selectedArray.map((val) => {
            const opt = options.find((o) => o.value === val);
            const label = opt ? opt.label : val;
            return (
              <Badge
                key={val}
                variant="secondary"
                className="pl-2.5 pr-1 py-1 text-xs bg-gray-100 text-gray-800 border border-gray-200 font-normal rounded-md flex items-center gap-1"
              >
                <span>{label}</span>
                <button
                  type="button"
                  onClick={(e) => handleRemoveBadge(e, val)}
                  className="rounded-full hover:bg-gray-300 p-0.5 text-gray-500 hover:text-gray-800"
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

