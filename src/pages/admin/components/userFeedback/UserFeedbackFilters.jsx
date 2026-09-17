import React from "react";
import { Filter, Search } from "lucide-react";
import { Input } from "../../../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../../components/ui/select";

const UserFeedbackFilters = ({
  statusFilter,
  onStatusChange,
  typeFilter,
  onTypeChange,
  searchValue,
  onSearchChange,
}) => {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-900">Filter Feedback & Bug Reports</h2>
          <p className="mt-1 text-sm text-gray-500">
            Search by Public ID, description, user name, or email.
          </p>
        </div>

        <div className="w-full lg:w-[360px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              value={searchValue}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search reports..."
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
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="w-48">
          <Select value={typeFilter} onValueChange={onTypeChange}>
            <SelectTrigger className="h-10 rounded-xl">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="bug">Bug Report</SelectItem>
              <SelectItem value="feedback">Product Feedback</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </section>
  );
};

export default UserFeedbackFilters;
