import { Filter, Search } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";
import {
  CONTACT_STATUS_OPTIONS,
  INQUIRY_TYPE_OPTIONS,
} from "../../../../constants/contactRequest";

const ContactRequestFilters = ({
  statusFilter,
  onStatusChange,
  inquiryTypeFilter,
  onInquiryTypeChange,
  searchValue,
  onSearchChange,
}) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Filter Requests</h2>
          <p className="mt-1 text-sm text-gray-500">
            Search by name, email, request ID, or message content.
          </p>
        </div>

        <div className="w-full lg:w-[360px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search requests..."
              className="h-10 rounded-xl pl-10"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Filter className="h-4 w-4 text-gray-500" />

        <div className="w-44">
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {CONTACT_STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-52">
          <Select value={inquiryTypeFilter} onValueChange={onInquiryTypeChange}>
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder="Inquiry type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Inquiry Types</SelectItem>
              {INQUIRY_TYPE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};

export default ContactRequestFilters;
