import { Icon } from "@iconify-icon/react";
import { format } from "date-fns";
import { Link } from "react-router";
import { cn } from "~/lib/utils";

interface Campaign {
  id: string;
  campaignName: string;
  startDate: string;
  campaignStatus: "Active" | "Inactive";
}

interface CampaignTableProps {
  campaigns: Campaign[];
  isLoading: boolean;
  isError: boolean;
  currentPage: number;
  pageSize: number;
  onDelete: (id: string, name: string) => void;
}

export function CampaignTable({
  campaigns,
  isLoading,
  isError,
  currentPage,
  pageSize,
  onDelete,
}: CampaignTableProps) {
  return (
    <div className="grow overflow-auto">
      <table className="w-full text-gray-500">
        <thead className="bg-gray-100 text-gray-600 font-bold text-xs rounded text-left [&_th]:px-2.5 [&_th]:py-3">
          <tr>
            <th>S/N</th>
            <th>Campaign Name</th>
            <th>Start Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 [&_td]:px-2.5 [&_td]:py-3.5">
          {isLoading ? (
            <tr>
              <td colSpan={5} className="text-center">
                <Icon
                  icon="svg-spinners:ring-resize"
                  className="text-2xl mr-2 inline"
                />
                Loading campaigns...
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={5} className="text-center text-red-600">
                <Icon
                  icon="material-symbols:error"
                  className="text-2xl mr-2 inline"
                />
                Failed to load campaigns
              </td>
            </tr>
          ) : campaigns.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center">
                No campaigns found
              </td>
            </tr>
          ) : (
            campaigns.map((campaign, index) => (
              <tr
                key={campaign.id}
                className="transition-all duration-200 hover:bg-gray-50 hover:shadow-sm cursor-pointer"
              >
                <td>{(currentPage - 1) * pageSize + index + 1}.</td>
                <td>{campaign.campaignName}</td>
                <td>{format(campaign.startDate, "do 'of' MMMM, yyyy")}</td>
                <td>
                  <span
                    className={cn(
                      "font-syne font-bold uppercase",
                      campaign.campaignStatus === "Active"
                        ? "text-green-600"
                        : "text-red-700"
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
                      className="transition-all duration-200 hover:text-teal-600 hover:scale-110"
                    >
                      <Icon icon="material-symbols:visibility" />
                    </Link>
                    <Link
                      to={`/campaign/${campaign.id}/edit`}
                      title="Edit campaign"
                      className="transition-all duration-200 hover:text-blue-600 hover:scale-110"
                    >
                      <Icon icon="material-symbols:edit" />
                    </Link>
                    <button
                      type="button"
                      className="transition-all duration-200 hover:text-red-600 hover:scale-110"
                      onClick={() =>
                        onDelete(campaign.id, campaign.campaignName)
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
  );
}
