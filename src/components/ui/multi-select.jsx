import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "./badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";

export function MultiSelect({
  options = [],
  value = [],
  onChange,
  placeholder = "Select...",
}) {
  const [selectedValues, setSelectedValues] = React.useState(value);

  React.useEffect(() => {
    setSelectedValues(value);
  }, [value]);

  const handleSelect = (selectedValue) => {
    const newValues = selectedValues.includes(selectedValue)
      ? selectedValues.filter((v) => v !== selectedValue)
      : [...selectedValues, selectedValue];
    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  const handleRemove = (valueToRemove) => {
    const newValues = selectedValues.filter((v) => v !== valueToRemove);
    setSelectedValues(newValues);
    onChange?.(newValues);
  };

  const availableOptions = options.filter(
    (option) => !selectedValues.includes(option.value)
  );

  return (
    <div className="space-y-2">
      <Select onValueChange={handleSelect} value="">
        <SelectTrigger className="w-full ">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {availableOptions.length === 0 ? (
            <div className="py-6 text-center text-sm text-gray-500">
              All options selected
            </div>
          ) : (
            availableOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>

      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedValues.map((val) => {
            const option = options.find((opt) => opt.value === val);
            return (
              <Badge
                key={val}
                variant="secondary"
                className="pl-2 pr-1 py-1 text-sm"
              >
                {option?.label || val}
                <button
                  type="button"
                  onClick={() => handleRemove(val)}
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
