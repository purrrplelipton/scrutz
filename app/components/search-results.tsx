import { Icon } from "@iconify-icon/react";
import { format } from "date-fns";
import { useNavigate } from "react-router";
import { cn } from "~/lib/utils";
import { PaginationControls } from "./pagination-controls";

interface SearchResult {
  id: string;
  campaignName: string;
  campaignDescription: string;
  startDate: string;
  campaignStatus: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  isLoading: boolean;
  hasQuery: boolean;
  onSelect?: () => void;
  selectedIndex: number;
  totalCount?: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export function SearchResults({
  results,
  isLoading,
  hasQuery,
  onSelect,
  selectedIndex,
  totalCount,
  page,
  pageSize,
  onPageChange,
}: SearchResultsProps) {
  const navigate = useNavigate();

  if (!hasQuery) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-96 overflow-y-auto z-50">
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">
          <Icon
            icon="svg-spinners:ring-resize"
            className="text-xl mr-2 inline"
          />
          Searching...
        </div>
      ) : results.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <Icon icon="material-symbols:search-off" className="text-2xl mb-2" />
          <p>No campaigns found</p>
        </div>
      ) : (
        <ul className="py-1">
          {results.map((result, index) => (
            <li key={result.id}>
              <button
                type="button"
                onClick={() => {
                  navigate(`/campaign/${result.id}`);
                  onSelect?.();
                }}
                className={cn(
                  "w-full text-left px-4 py-3 hover:bg-teal-50 transition-colors duration-150 border-l-2",
                  selectedIndex === index
                    ? "bg-teal-50 border-l-teal-600"
                    : "border-l-transparent"
                )}
                aria-label={`Select ${result.campaignName} campaign, ${result.campaignStatus}, starts ${format(new Date(result.startDate), "MMMM d, yyyy")}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-900 truncate">
                      {result.campaignName}
                    </div>

                    <p className="text-xs text-gray-600 mt-0.5 line-clamp-1">
                      {result.campaignDescription}
                    </p>

                    <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <Icon
                          icon="material-symbols:calendar-month"
                          aria-hidden="true"
                        />
                        <time
                          dateTime={new Date(result.startDate).toISOString()}
                        >
                          {format(new Date(result.startDate), "MMM d, yyyy")}
                        </time>
                      </span>

                      <span
                        className={cn(
                          "font-medium",
                          result.campaignStatus === "Active"
                            ? "text-green-600"
                            : "text-red-600"
                        )}
                      >
                        {result.campaignStatus}
                      </span>
                    </div>
                  </div>

                  <Icon
                    icon="material-symbols:arrow-forward"
                    className="text-gray-400 text-lg shrink-0 mt-1"
                    aria-hidden="true"
                  />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {totalCount && totalCount > 0 && (
        <div className="mb-3 border-t border-gray-200">
          <PaginationControls
            currentPage={page}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </div>
      )}
      <div className="border-t border-gray-200 px-4 py-2 bg-gray-50 text-xs text-gray-600 flex items-center justify-between">
        <span>
          Use{" "}
          <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">
            ↑↓
          </kbd>{" "}
          to navigate
        </span>
        <span>
          Press{" "}
          <kbd className="px-1.5 py-0.5 bg-white border border-gray-300 rounded text-xs">
            Enter
          </kbd>{" "}
          to select
        </span>
      </div>
    </div>
  );
}
