import { Icon } from "@iconify-icon/react";
import { format } from "date-fns";
import lodash from "lodash";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import { Link, useSearchParams } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useCampaigns, useDeleteCampaign } from "~/lib/hooks/use-campaigns";
import { cn } from "~/lib/utils";

type CampaignStatus = "All" | "Active" | "Inactive";

export default function Campaign() {
  const searchId = useId();
  const [searchParams, setSearchParams] = useSearchParams();

  // Get state from URL params
  const activeTab = (searchParams.get("status") as CampaignStatus) || "All";
  const currentPage = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const [dateFilter, setDateFilter] = useState(searchParams.get("date") || "");

  // Local input state for immediate UI feedback
  const [searchInputValue, setSearchInputValue] = useState(searchQuery);

  // Sync input value when URL changes (e.g., browser back/forward)
  useEffect(() => {
    setSearchInputValue(searchQuery);
  }, [searchQuery]);

  // Dialog state for deletion confirmation
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  // Update URL when filters change
  const updateParams = useCallback(
    (updates: Record<string, string | number>) => {
      const newParams = new URLSearchParams(searchParams);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, String(value));
        } else {
          newParams.delete(key);
        }
      });
      setSearchParams(newParams);
    },
    [searchParams, setSearchParams]
  );

  const handleStatusChange = (status: CampaignStatus) => {
    updateParams({
      status: status === "All" ? "" : status,
      page: 1, // Reset to page 1 on filter change
    });
  };

  // Helper to build pagination URL
  const buildPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `?${params.toString()}`;
  };

  // Fetch campaigns with filters
  const { data, isLoading, isError } = useCampaigns({
    page: currentPage,
    pageSize: 10,
    search: searchQuery,
    status: activeTab === "All" ? undefined : activeTab,
  });

  const deleteCampaign = useDeleteCampaign();

  // Apply client-side filtering (temporary until API supports all filters)
  const filteredData = data?.data || [];
  const displayedCampaigns = filteredData.filter((campaign) => {
    // Filter by status tab
    if (activeTab === "Active" && campaign.campaignStatus !== "Active")
      return false;
    if (activeTab === "Inactive" && campaign.campaignStatus !== "Inactive")
      return false;

    // Filter by search query
    if (
      searchQuery &&
      !campaign.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Calculate tab counts from all data
  const AllCount = filteredData.length;
  const ActiveCount = filteredData.filter(
    (c) => c.campaignStatus === "Active"
  ).length;
  const InactiveCount = filteredData.filter(
    (c) => c.campaignStatus === "Inactive"
  ).length;

  // Paginate the filtered results
  const pageSize = 10;
  const totalFilteredCount = displayedCampaigns.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCampaigns = displayedCampaigns.slice(startIndex, endIndex);

  // Debounced URL update function (memoized to avoid recreating on every render)
  const debouncedUpdateParams = useMemo(
    () =>
      lodash.debounce((value: string) => {
        updateParams({
          search: value,
          page: 1, // Reset to first page on search
        });
      }, 300),
    [updateParams]
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInputValue(value); // Update input immediately for responsive UI
    debouncedUpdateParams(value); // Update URL (and trigger API call) after debounce
  };

  const handleDelete = (id: string, name: string) => {
    setCampaignToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!campaignToDelete) return;

    try {
      await deleteCampaign.mutateAsync(campaignToDelete.id);
      setDeleteDialogOpen(false);
      setCampaignToDelete(null);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Failed to delete campaign:", error);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
  };

  // Generate pagination numbers
  const generatePaginationNumbers = () => {
    const calculatedTotalPages = Math.ceil(totalFilteredCount / pageSize);
    const pages: Array<
      { type: "page"; value: number } | { type: "ellipsis"; id: string }
    > = [];

    if (calculatedTotalPages <= 7) {
      // Show all pages if 7 or fewer
      for (let i = 1; i <= calculatedTotalPages; i++) {
        pages.push({ type: "page", value: i });
      }
    } else {
      // Always show first page
      pages.push({ type: "page", value: 1 });

      if (currentPage > 3) {
        pages.push({ type: "ellipsis", id: "start-ellipsis" });
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(calculatedTotalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push({ type: "page", value: i });
      }

      if (currentPage < calculatedTotalPages - 2) {
        pages.push({ type: "ellipsis", id: "end-ellipsis" });
      }

      // Always show last page
      if (calculatedTotalPages > 1) {
        pages.push({ type: "page", value: calculatedTotalPages });
      }
    }

    return pages;
  };
  return (
    <>
      <header className="mb-6">
        <p className="font-semibold text-xl text-[#247B7B] mb-4">
          All Campaigns
        </p>
        <div className="flex flex-col lg:flex-row lg:items-center">
          <fieldset className="flex items-center gap-2">
            <legend className="sr-only">Filter campaigns by status</legend>
            {(["All", "Inactive", "Active"] as const).map((status) => (
              <label
                key={status}
                className={cn(
                  "px-2.5 py-2.25 rounded border border-current text-sm font-medium cursor-pointer transition-colors",
                  activeTab === status ? "text-[#247B7B]" : "text-foreground/33"
                )}
              >
                <input
                  type="radio"
                  name="campaign-status"
                  value={status}
                  checked={activeTab === status}
                  onChange={() => handleStatusChange(status)}
                  className="sr-only"
                />
                {status} (
                {status === "All"
                  ? AllCount
                  : status === "Active"
                    ? ActiveCount
                    : InactiveCount}
                )
              </label>
            ))}
          </fieldset>

          <div className="lg:grow lg:justify-end flex flex-col lg:flex-row lg:items-center gap-4">
            <InputGroup className="min-w-0 w-full max-w-60">
              <InputGroupInput
                id={searchId}
                type="search"
                placeholder="search"
                value={searchInputValue}
                onChange={handleSearch}
              />
              <InputGroupAddon>
                <Icon icon="material-symbols:search" />
              </InputGroupAddon>
            </InputGroup>

            <Select
              value={dateFilter}
              onValueChange={(value) => {
                setDateFilter(value);
                updateParams({ date: value });
              }}
            >
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

      <div className="grow overflow-auto">
        <table className="w-full text-[#666666]">
          <thead className="bg-[#F0F4F4] text-[#455454] font-bold text-xs rounded text-left [&_th]:px-2.5 [&_th]:py-3">
            <tr>
              <th>S/N</th>
              <th>Campaign Name</th>
              <th>Start Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#F1F1F1] [&_td]:px-2.5 [&_td]:py-3.5">
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center">
                  <Icon
                    icon="svg-spinners:ring-resize"
                    className="text-2xl mr-2"
                  />
                  Loading campaigns...
                </td>
              </tr>
            ) : isError ? (
              <tr>
                <td colSpan={5} className="text-center text-red-600">
                  <Icon
                    icon="material-symbols:error"
                    className="text-2xl mr-2"
                  />
                  Failed to load campaigns
                </td>
              </tr>
            ) : paginatedCampaigns.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center">
                  No campaigns found
                </td>
              </tr>
            ) : (
              paginatedCampaigns.map((campaign, index) => (
                <tr key={campaign.id}>
                  <td>{(currentPage - 1) * pageSize + index + 1}.</td>
                  <td>{campaign.campaignName}</td>
                  <td>{format(campaign.startDate, "do 'of' MMMM, yyyy")}</td>
                  <td>
                    <span
                      className={cn(
                        "font-syne font-bold uppercase",
                        campaign.campaignStatus === "Active"
                          ? "text-[#009918]"
                          : "text-[#990000]"
                      )}
                    >
                      {campaign.campaignStatus}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-5 text-xl">
                      <Link
                        to={`/campaign/${campaign.id}`}
                        title="View campaign"
                      >
                        <Icon icon="material-symbols:visibility" />
                      </Link>
                      <Link
                        to={`/campaign/${campaign.id}/edit`}
                        title="Edit campaign"
                      >
                        <Icon icon="material-symbols:edit" />
                      </Link>
                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(campaign.id, campaign.campaignName)
                        }
                        title="Delete campaign"
                      >
                        <Icon icon="material-symbols:delete" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalFilteredCount > 0 && (
        <div className="mt-11 text-sm font-medium flex items-center justify-between px-2.5">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  to={currentPage > 1 ? buildPageUrl(currentPage - 1) : "#"}
                  inert={currentPage === 1}
                />
              </PaginationItem>

              {generatePaginationNumbers().map((item) =>
                item.type === "ellipsis" ? (
                  <PaginationItem key={item.id}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={item.value}>
                    <PaginationLink
                      to={buildPageUrl(item.value)}
                      isActive={currentPage === item.value}
                    >
                      {item.value}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  to={
                    currentPage < Math.ceil(totalFilteredCount / pageSize)
                      ? buildPageUrl(currentPage + 1)
                      : "#"
                  }
                  inert={
                    currentPage >= Math.ceil(totalFilteredCount / pageSize)
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <p>
            showing {(currentPage - 1) * pageSize + 1} to{" "}
            {Math.min(currentPage * pageSize, totalFilteredCount)} of{" "}
            {totalFilteredCount} results
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-center text-xl">
              Stop Campaign
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              Are You sure you want to delete &ldquo;{campaignToDelete?.name}
              &rdquo; campaign?
              <br />
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleteCampaign.isPending}
              variant="destructive"
            >
              {deleteCampaign.isPending ? (
                <Icon icon="svg-spinners:ring-resize" />
              ) : (
                "Delete Campaign"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog
        open={showSuccessDialog}
        onOpenChange={(open) => {
          if (!open) handleSuccessDialogClose();
        }}
      >
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader className="items-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#247B7B] flex items-center justify-center">
              <Icon
                icon="material-symbols:check"
                className="text-4xl text-white"
              />
            </div>
            <DialogTitle className="text-center text-xl">
              Campaign Successfully Deleted!
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="sm:justify-center">
            <Button
              onClick={handleSuccessDialogClose}
              className="bg-[#247B7B] text-white hover:bg-[#1e6363]"
            >
              Go Back to campaign list
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
