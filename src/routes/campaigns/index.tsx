import { Icon } from "@iconify-icon/react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { fallback, zodValidator } from "@tanstack/zod-adapter";
import lodash from "lodash";
import { type ChangeEvent, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import AppLayout from "~/components/app-layout";
import { CampaignFilters } from "~/components/campaigns/campaigns-filters";
import { CampaignTable } from "~/components/campaigns/campaigns-table";
import { DeleteConfirmationDialog } from "~/components/campaigns/delete-confirmation-dialog";
import { SuccessDialog } from "~/components/campaigns/success-dialog";
import { PaginationControls } from "~/components/pagination-controls";
import { useCampaigns, useDeleteCampaign } from "~/lib/hooks/use-campaigns";

const campaignSearchSchema = z.object({
  status: fallback(z.enum(["All", "Active", "Inactive"]), "All").default("All"),
  page: fallback(z.number(), 1).default(1),
  search: fallback(z.string(), "").default(""),
  date: fallback(
    z.enum(["today", "this-week", "this-month", "this-year"]),
    "today"
  ).default("today"),
});

export const Route = createFileRoute("/campaigns/")({
  component: Campaigns,
  validateSearch: zodValidator(campaignSearchSchema),
});

function Campaigns() {
  const navigate = useNavigate();
  const {
    status: activeTab,
    page: currentPage,
    search: searchQuery,
    date,
  } = Route.useSearch();

  const [dateFilter, setDateFilter] = useState(date);
  const [searchInputValue, setSearchInputValue] = useState(searchQuery);

  useEffect(() => {
    setSearchInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setDateFilter(date);
  }, [date]);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [campaignToDelete, setCampaignToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const { data, isLoading, isError, dataUpdatedAt } = useCampaigns(
    {
      page: currentPage,
      pageSize: 10,
      search: searchQuery,
      status: activeTab === "All" ? undefined : activeTab,
    },
    {
      enableRealtime: true,
      refetchInterval: 30000, // Poll every 30 seconds
    }
  );

  useEffect(() => {
    if (dataUpdatedAt) {
      setLastUpdated(new Date(dataUpdatedAt));
    }
  }, [dataUpdatedAt]);

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
        navigate({
          to: "/campaigns",
          search: {
            status: activeTab,
            page: 1,
            search: value,
            date: dateFilter,
          },
        });
      }, 300),
    [navigate, activeTab, dateFilter]
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
    <AppLayout>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <Icon
            icon="mdi:circle"
            className="animate-pulse text-green-500 text-xs"
          />
          <span>Live updates enabled</span>
        </div>
        <div className="text-gray-400 text-xs">
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      <CampaignFilters
        activeTab={activeTab}
        onStatusChange={(status) =>
          navigate({
            to: "/campaigns",
            search: { status, page: 1, search: searchQuery, date: dateFilter },
          })
        }
        searchValue={searchInputValue}
        onSearchChange={handleSearch}
        dateFilter={dateFilter}
        onDateFilterChange={(value) => {
          setDateFilter(value);
          navigate({
            to: "/campaigns",
            search: {
              status: activeTab,
              page: currentPage,
              search: searchQuery,
              date: value,
            },
          });
        }}
        allCount={filteredData.length}
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
        onPageChange={(page) =>
          navigate({
            to: "/campaigns",
            search: {
              status: activeTab,
              page,
              search: searchQuery,
              date: dateFilter,
            },
          })
        }
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
    </AppLayout>
  );
}
