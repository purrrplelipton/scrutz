import { Icon } from "@iconify-icon/react";
import { useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
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
    <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-96 overflow-y-auto rounded border border-gray-300 bg-white shadow-lg">
      {isLoading ? (
        <div className="p-4 text-center text-gray-500">
          <Icon
            icon="svg-spinners:ring-resize"
            className="mr-2 inline text-xl"
          />
          Searching...
        </div>
      ) : results.length === 0 ? (
        <div className="p-4 text-center text-gray-500">
          <Icon icon="material-symbols:search-off" className="mb-2 text-2xl" />
          <p>No campaigns found</p>
        </div>
      ) : (
        <ul className="py-1">
          {results.map((result, index) => (
            <li key={result.id}>
              <button
                type="button"
                onClick={() => {
                  navigate({ to: "/campaigns/$id", params: { id: result.id } });
                  onSelect?.();
                }}
                className={cn(
                  "w-full border-l-2 px-4 py-3 text-left transition-colors duration-150 hover:bg-teal-50",
                  selectedIndex === index
                    ? "border-l-teal-600 bg-teal-50"
                    : "border-l-transparent"
                )}
                aria-label={`Select ${result.campaignName} campaign, ${result.campaignStatus}, starts ${format(new Date(result.startDate), "MMMM d, yyyy")}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 grow">
                    <div className="truncate font-semibold text-gray-900 text-sm">
                      {result.campaignName}
                    </div>

                    <p className="mt-0.5 line-clamp-1 text-gray-600 text-xs">
                      {result.campaignDescription}
                    </p>

                    <div className="mt-1.5 flex items-center gap-3 text-gray-500 text-xs">
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
                    className="mt-1 shrink-0 text-gray-400 text-lg"
                    aria-hidden="true"
                  />
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
      {totalCount && totalCount > 0 && (
        <div className="mb-3 border-gray-200 border-t">
          <PaginationControls
            currentPage={page}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </div>
      )}
      <div className="flex items-center justify-between border-gray-200 border-t bg-gray-50 px-4 py-2 text-gray-600 text-xs">
        <span>
          Use{" "}
          <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs">
            ↑↓
          </kbd>{" "}
          to navigate
        </span>
        <span>
          Press{" "}
          <kbd className="rounded border border-gray-300 bg-white px-1.5 py-0.5 text-xs">
            Enter
          </kbd>{" "}
          to select
        </span>
      </div>
    </div>
  );
}
