import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { Calendar } from "./calendar";
import { CalendarIcon } from "lucide-react";

const DatePicker = ({
  value,
  onChange,
  placeholder = "Select date",
  className = "",
  error,
}) => {
  const [open, setOpen] = React.useState(false);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${month}/${day}/${year}`;
  };

  const handleSelect = (date) => {
    onChange(date);
    setOpen(false);
  };

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          className={`
            w-full px-4 py-3 border border-gray-200 rounded-lg text-sm
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            bg-[#F0F0F0] text-left flex items-center justify-between
            ${error ? "border-red-500" : ""}
            ${className}
          `}
        >
          <span className={value ? "text-gray-700" : "text-gray-500"}>
            {value ? formatDate(value) : placeholder}
          </span>
          <CalendarIcon className="w-4 h-4 text-gray-400" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="bg-white rounded-lg shadow-lg border border-gray-200 z-50"
          sideOffset={5}
          align="start"
        >
          <Calendar selected={value} onSelect={handleSelect} />
          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export { DatePicker };
