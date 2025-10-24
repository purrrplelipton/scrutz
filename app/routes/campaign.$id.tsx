import { Icon } from "@iconify-icon/react";
import { format } from "date-fns";
import { useId, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
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

export default function CampaignDetail() {
  const campaignNameId = useId();
  const campaignDescriptionId = useId();
  const startDateId = useId();
  const endDateId = useId();
  const digestCampaignId = useId();
  const dailyDigestId = useId();

  const { id } = useParams();
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
    navigate("/campaign");
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
      <div className="flex items-center justify-center h-full">
        <Icon
          icon="svg-spinners:ring-resize"
          className="text-4xl text-[#247B7B]"
        />
      </div>
    );
  }

  if (isError || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Icon icon="material-symbols:error" className="text-4xl text-red-600" />
        <p className="text-lg text-gray-600">Failed to load campaign details</p>
        <Button variant="outline" onClick={() => navigate("/campaign")}>
          Back to Campaigns
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Back Button */}
      <Link to="/campaign" className="inline-flex items-center gap-2 mb-6">
        <Icon icon="material-symbols:arrow-back" className="text-xl" />
        <span>Back</span>
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-[#247B7B]">
          Campaign Information
        </h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">Campaign Status</span>
          <Switch
            checked={campaign.campaignStatus === "Active"}
            onCheckedChange={handleStatusToggle}
            disabled={toggleStatus.isPending}
          />
          <span
            className={cn(
              "text-sm font-medium",
              campaign.campaignStatus === "Active"
                ? "text-green-700"
                : "text-red-700"
            )}
          >
            {campaign.campaignStatus}
          </span>
        </div>
      </div>

      {/* Form Content */}
      <div className="space-y-6">
        {/* Campaign Name */}
        <div className="space-y-1">
          <Label htmlFor={campaignNameId}>Campaign Name</Label>
          <Input id={campaignNameId} value={campaign.campaignName} readOnly />
        </div>

        {/* Campaign Description */}
        <div className="space-y-1">
          <Label htmlFor={campaignDescriptionId}>Campaign Description</Label>
          <Textarea
            id={campaignDescriptionId}
            value={campaign.campaignDescription}
            className="min-h-32"
            readOnly
          />
        </div>

        {/* Start Date and End Date */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor={startDateId}>Start Date</Label>
            <Input
              id={startDateId}
              value={format(new Date(campaign.startDate), "do 'of' MMMM, yyyy")}
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

        {/* Linked Keywords */}
        <div className="space-y-1">
          <Label>Linked Keywords</Label>
          <div className="min-h-24 px-2.5 py-2.25 border rounded border-[#999999] shadow-xs flex items-start flex-wrap gap-2">
            {campaign.linkedKeywords.map((keyword) => (
              <span
                key={keyword}
                className="inline-flex items-center gap-1 bg-[#247B7B] text-white pl-2 py-0.75 pr-1.25 rounded-full text-xs"
              >
                <span>{keyword}</span>
                <Icon icon="material-symbols:close" />
              </span>
            ))}
          </div>
        </div>

        {/* Want to receive daily digest */}
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

        {/* Daily Digest Frequency */}
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

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button variant="destructive" onClick={handleStopCampaign}>
            Stop Campaign
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(`/campaign/${id}/edit`)}
          >
            Edit Information
          </Button>
        </div>
      </div>

      {/* Stop Campaign Confirmation Dialog */}
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
          <DialogFooter className="grid gap-4 grid-cols-2">
            <Button variant="outline" onClick={() => setStopDialogOpen(false)}>
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
              className="font-syne font-bold"
            >
              Go Back to campaign list
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
