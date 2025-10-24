import lodash from "lodash";
import {
  type ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useSearchParams } from "react-router";
import { CampaignFilters } from "~/components/campaign/campaign-filters";
import { CampaignTable } from "~/components/campaign/campaign-table";
import { DeleteConfirmationDialog } from "~/components/campaign/delete-confirmation-dialog";
import { SuccessDialog } from "~/components/campaign/success-dialog";
import { PaginationControls } from "~/components/pagination-controls";
import { useCampaigns, useDeleteCampaign } from "~/lib/hooks/use-campaigns";

type CampaignStatus = "All" | "Active" | "Inactive";

export default function Campaign() {
  const [searchParams, setSearchParams] = useSearchParams();

  const activeTab = (searchParams.get("status") as CampaignStatus) || "All";
  const currentPage = Number(searchParams.get("page")) || 1;
  const searchQuery = searchParams.get("search") || "";
  const [dateFilter, setDateFilter] = useState(searchParams.get("date") || "");
  const [searchInputValue, setSearchInputValue] = useState(searchQuery);

  useEffect(() => {
    setSearchInputValue(searchQuery);
  }, [searchQuery]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

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
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    updateParams({ page });
  };

  const { data, isLoading, isError } = useCampaigns({
    page: currentPage,
    pageSize: 10,
    search: searchQuery,
    status: activeTab === "All" ? undefined : activeTab,
  });

  const deleteCampaign = useDeleteCampaign();

  const filteredData = data?.data || [];
  const displayedCampaigns = filteredData.filter((campaign) => {
    if (activeTab === "Active" && campaign.campaignStatus !== "Active")
      return false;
    if (activeTab === "Inactive" && campaign.campaignStatus !== "Inactive")
      return false;

    if (
      searchQuery &&
      !campaign.campaignName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const AllCount = filteredData.length;
  const ActiveCount = filteredData.filter(
    (c) => c.campaignStatus === "Active"
  ).length;
  const InactiveCount = filteredData.filter(
    (c) => c.campaignStatus === "Inactive"
  ).length;

  const pageSize = 10;
  const totalFilteredCount = displayedCampaigns.length;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedCampaigns = displayedCampaigns.slice(startIndex, endIndex);

  const debouncedUpdateParams = useMemo(
    () =>
      lodash.debounce((value: string) => {
        updateParams({
          search: value,
          page: 1,
        });
      }, 300),
    [updateParams]
  );

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInputValue(value);
    debouncedUpdateParams(value);
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

  return (
    <>
      <CampaignFilters
        activeTab={activeTab}
        onStatusChange={handleStatusChange}
        searchValue={searchInputValue}
        onSearchChange={handleSearch}
        dateFilter={dateFilter}
        onDateFilterChange={(value) => {
          setDateFilter(value);
          updateParams({ date: value });
        }}
        allCount={AllCount}
        activeCount={ActiveCount}
        inactiveCount={InactiveCount}
      />

      <CampaignTable
        campaigns={paginatedCampaigns}
        isLoading={isLoading}
        isError={isError}
        currentPage={currentPage}
        pageSize={pageSize}
        onDelete={handleDelete}
      />

      <PaginationControls
        currentPage={currentPage}
        totalCount={totalFilteredCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        campaignName={campaignToDelete?.name || null}
        onConfirm={confirmDelete}
        isPending={deleteCampaign.isPending}
      />

      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={(open) => {
          if (!open) handleSuccessDialogClose();
        }}
        title="Campaign Successfully Deleted!"
        buttonText="Go Back to campaign list"
        onButtonClick={handleSuccessDialogClose}
      />
    </>
  );
}
