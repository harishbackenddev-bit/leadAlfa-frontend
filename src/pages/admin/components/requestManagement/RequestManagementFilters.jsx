import { Filter, Search } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

const tabClassName = (isActive) =>
  isActive
    ? "btn-gradient text-white shadow"
    : "text-gray-600 hover:text-gray-900";

const RequestManagementFilters = ({
  activeType,
  onTypeChange,
  statusFilter,
  onStatusChange,
  searchValue,
  onSearchChange,
}) => {
  const isCreator = activeType === "creator";
  const isBrand = activeType === "brand";

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="inline-flex w-fit items-center gap-2 rounded-xl bg-gray-50 p-1">
          <button
            type="button"
            onClick={() => onTypeChange("creator")}
            className={`min-w-24 rounded-lg px-5 py-2 text-sm font-medium transition-all ${tabClassName(isCreator)}`}
          >
            Creator Requests
          </button>
          <button
            type="button"
            onClick={() => onTypeChange("brand")}
            className={`min-w-24 rounded-lg px-5 py-2 text-sm font-medium transition-all ${tabClassName(isBrand)}`}
          >
            Brand Requests
          </button>
        </div>

        <div className="w-full lg:w-[360px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search by name or email..."
              className="h-10 rounded-xl pl-10"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <Filter className="h-4 w-4 text-gray-500" />

        <div className="w-44">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="clarification_requested">Clarification Requested</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};

export default RequestManagementFilters;
