import { Icon } from "@iconify-icon/react";
import type { ChangeEvent } from "react";
import { useId } from "react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";

type CampaignStatus = "All" | "Active" | "Inactive";

interface CampaignFiltersProps {
  activeTab: CampaignStatus;
  onStatusChange: (status: CampaignStatus) => void;
  searchValue: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  dateFilter: string;
  onDateFilterChange: (value: string) => void;
  allCount: number;
  activeCount: number;
  inactiveCount: number;
}

export function CampaignFilters({
  activeTab,
  onStatusChange,
  searchValue,
  onSearchChange,
  dateFilter,
  onDateFilterChange,
  allCount,
  activeCount,
  inactiveCount,
}: CampaignFiltersProps) {
  const searchId = useId();

  return (
    <header className="mb-6">
      <p className="mb-4 font-semibold text-teal-600 text-xl">All Campaigns</p>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
        <fieldset className="flex items-center gap-2">
          <legend className="sr-only">Filter campaigns by status</legend>
          {(["All", "Inactive", "Active"] as const).map((status) => (
            <label
              key={status}
              className={cn(
                "rounded border border-current px-1.75 py-0.75 font-medium text-[0.625rem] transition-all duration-200 hover:shadow-sm active:scale-95 lg:p-2.25 lg:text-sm",
                activeTab === status
                  ? "bg-teal-50 text-teal-600 shadow-sm"
                  : "text-gray-400 hover:border-gray-500 hover:text-gray-600"
              )}
            >
              <input
                type="radio"
                name="campaign-status"
                value={status}
                checked={activeTab === status}
                onChange={() => onStatusChange(status)}
                className="sr-only"
              />
              {status} (
              {status === "All"
                ? allCount
                : status === "Active"
                  ? activeCount
                  : inactiveCount}
              )
            </label>
          ))}
        </fieldset>

        <div className="flex items-center gap-2 lg:grow lg:gap-4">
          <InputGroup className="w-full min-w-0 max-w-60 lg:ml-auto">
            <InputGroupInput
              id={searchId}
              type="search"
              placeholder="search"
              value={searchValue}
              onChange={onSearchChange}
            />
            <InputGroupAddon>
              <Icon icon="material-symbols:search" />
            </InputGroupAddon>
          </InputGroup>

          <Select value={dateFilter} onValueChange={onDateFilterChange}>
            <SelectTrigger className="w-full max-w-56">
              <SelectValue placeholder="Filter by date" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
              <SelectItem value="this-year">This Year</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </header>
  );
}
