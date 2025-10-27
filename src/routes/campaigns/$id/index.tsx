import { Icon } from "@iconify-icon/react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { format } from "date-fns";
import { useId, useState } from "react";
import AppLayout from "~/components/app-layout";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import {
  useCampaign,
  useDeleteCampaign,
  useToggleCampaignStatus,
} from "~/lib/hooks/use-campaigns";
import { cn } from "~/lib/utils";

export const Route = createFileRoute("/campaigns/$id/")({
  component: CampaignDetails,
});

function CampaignDetails() {
  const campaignNameId = useId();
  const campaignDescriptionId = useId();
  const startDateId = useId();
  const endDateId = useId();
  const digestCampaignId = useId();
  const dailyDigestId = useId();

  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: campaign, isLoading, isError } = useCampaign(id || "");
  const deleteCampaign = useDeleteCampaign();
  const toggleStatus = useToggleCampaignStatus();

  const [stopDialogOpen, setStopDialogOpen] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleStopCampaign = () => {
    setStopDialogOpen(true);
  };

  const confirmStop = async () => {
    if (!id) return;

    try {
      await deleteCampaign.mutateAsync(id);
      setStopDialogOpen(false);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Failed to stop campaign:", error);
    }
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate({ to: "/campaigns" });
  };

  const handleStatusToggle = async (checked: boolean) => {
    if (!id) return;

    const newStatus = checked ? "Active" : "Inactive";
    try {
      await toggleStatus.mutateAsync({ id, status: newStatus });
    } catch (error) {
      console.error("Failed to toggle campaign status:", error);
    }
  };

  if (isLoading) {
    return (
      <AppLayout>
        <Icon
          icon="svg-spinners:ring-resize"
          className="m-auto text-4xl text-teal-600"
        />
      </AppLayout>
    );
  }

  if (isError || !campaign) {
    return (
      <AppLayout>
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <Icon
            icon="material-symbols:error"
            className="text-4xl text-red-600"
          />
          <p className="text-gray-600 text-lg">
            Failed to load campaign details
          </p>
          <Button
            variant="outline"
            onClick={() => navigate({ to: "/campaigns" })}
          >
            Back to Campaigns
          </Button>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-2xl">
        <Link to="/campaigns" className="mb-6 inline-flex items-center gap-2">
          <Icon icon="material-symbols:arrow-back" className="text-xl" />
          <span>Back</span>
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <h1 className="font-semibold text-teal-600 text-xl">
            Campaign Information
          </h1>
          <div className="flex items-center gap-3">
            <span className="text-gray-600 text-sm">Campaign Status</span>
            <Switch
              checked={campaign.campaignStatus === "Active"}
              onCheckedChange={handleStatusToggle}
              disabled={toggleStatus.isPending}
            />
            <span
              className={cn(
                "font-medium text-sm",
                campaign.campaignStatus === "Active"
                  ? "text-green-700"
                  : "text-red-700"
              )}
            >
              {campaign.campaignStatus}
            </span>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor={campaignNameId}>Campaign Name</Label>
            <Input id={campaignNameId} value={campaign.campaignName} readOnly />
          </div>

          <div className="space-y-1">
            <Label htmlFor={campaignDescriptionId}>Campaign Description</Label>
            <Textarea
              id={campaignDescriptionId}
              value={campaign.campaignDescription}
              className="min-h-32"
              readOnly
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor={startDateId}>Start Date</Label>
              <Input
                id={startDateId}
                value={format(
                  new Date(campaign.startDate),
                  "do 'of' MMMM, yyyy"
                )}
                readOnly
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor={endDateId}>End Date</Label>
              <Input
                id={endDateId}
                value={format(new Date(campaign.endDate), "do 'of' MMMM, yyyy")}
                readOnly
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label>Linked Keywords</Label>
            <div className="flex min-h-24 flex-wrap items-start gap-2 rounded border border-gray-400 px-2.5 py-2.25 shadow-xs">
              {campaign.linkedKeywords.map((keyword) => (
                <span
                  key={keyword}
                  className="inline-flex items-center gap-1 rounded-full bg-teal-600 py-0.75 pr-1.25 pl-2 text-white text-xs"
                >
                  <span>{keyword}</span>
                  <Icon icon="material-symbols:close" />
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between py-2">
            <Label htmlFor={digestCampaignId}>
              Want to receive daily digest about the campaign?
            </Label>
            <Switch
              id={digestCampaignId}
              name="digestCampaign"
              checked={campaign.digestCampaign === "Yes"}
              disabled
            />
          </div>

          {campaign.digestCampaign && (
            <div className="space-y-1">
              <Label htmlFor={dailyDigestId}>
                Kindly select the time you want to receive daily digest
              </Label>
              <Select value={campaign.dailyDigest} disabled>
                <SelectTrigger id={dailyDigestId}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                  <SelectItem value="Monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 pt-4">
            <Button variant="destructive" onClick={handleStopCampaign}>
              Stop Campaign
            </Button>
            <Button
              variant="outline"
              onClick={() =>
                navigate({ to: "/campaigns/$id/edit", params: { id } })
              }
            >
              Edit Information
            </Button>
          </div>
        </div>

        <Dialog open={stopDialogOpen} onOpenChange={setStopDialogOpen}>
          <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-center text-xl">
                Stop Campaign
              </DialogTitle>
              <DialogDescription className="text-center text-gray-600">
                Are You sure you want to delete &ldquo;{campaign.campaignName}
                &rdquo; campaign?
                <br />
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => setStopDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmStop}
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

        <Dialog
          open={showSuccessDialog}
          onOpenChange={(open) => {
            if (!open) handleSuccessDialogClose();
          }}
        >
          <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
            <DialogHeader className="items-center space-y-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-teal-600">
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
                className="font-bold font-syne"
              >
                Go Back to campaign list
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppLayout>
  );
}
