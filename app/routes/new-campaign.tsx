import { Icon } from "@iconify-icon/react";
import { useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { NaturalLanguageDatePicker } from "~/components/natural-language-date-picker";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
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
import { useCreateCampaign } from "~/lib/hooks/use-campaigns";
import type { CreateCampaignDto } from "~/types";

export default function NewCampaign() {
  const navigate = useNavigate();
  const createCampaign = useCreateCampaign();
  const campaignNameId = useId();
  const campaignDescriptionId = useId();
  const dailyDigestId = useId();
  const keywordsId = useId();
  const digestFrequencyId = useId();
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<CreateCampaignDto>({
    defaultValues: {
      campaignName: "",
      campaignDescription: "",
      startDate: "",
      endDate: "",
      digestCampaign: false,
      linkedKeywords: [],
      dailyDigest: "",
    },
    mode: "onBlur", // Validate on blur for better UX
  });

  const [linkedKeywordInput, setLinkedKeywordInput] = useState("");
  const linkedKeywords = watch("linkedKeywords");
  const digestCampaign = watch("digestCampaign");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && linkedKeywordInput.trim()) {
      e.preventDefault();
      setValue("linkedKeywords", [
        ...linkedKeywords,
        linkedKeywordInput.trim(),
      ]);
      setLinkedKeywordInput("");
      // Clear any existing error when keyword is added
      clearErrors("linkedKeywords");
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = linkedKeywords.filter((_, i) => i !== index);
    setValue("linkedKeywords", newKeywords);

    // Show error if removing the last keyword
    if (newKeywords.length === 0) {
      setError("linkedKeywords", {
        type: "manual",
        message: "At least one keyword is required",
      });
    }
  };

  const onSubmit = async (data: CreateCampaignDto) => {
    // Validate keywords
    if (data.linkedKeywords.length === 0) {
      setError("linkedKeywords", {
        type: "manual",
        message: "At least one keyword is required",
      });
      return;
    }

    try {
      await createCampaign.mutateAsync(data);
      reset();
      setLinkedKeywordInput("");
      setShowSuccessDialog(true);
    } catch (error) {
      // Error toast is shown automatically by the hook
      console.error("Failed to create campaign:", error);
    }
  };

  const handleCancel = () => {
    reset();
    setLinkedKeywordInput("");
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate("/campaign");
  };

  return (
    <>
      <p className="font-semibold text-[#247B7B] text-xl mb-7">
        Create new campaign
      </p>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-2xl mx-auto"
      >
        {/* Campaign Name */}
        <div className="space-y-1">
          <Label htmlFor={campaignNameId}>Campaign Name</Label>
          <Input
            id={campaignNameId}
            placeholder="e.g The Future is now"
            {...register("campaignName", {
              required: "Campaign name is required",
              minLength: {
                value: 3,
                message: "Campaign name must be at least 3 characters",
              },
            })}
            aria-invalid={errors.campaignName ? "true" : "false"}
          />
          {errors.campaignName && (
            <p className="text-xs text-red-600">
              {errors.campaignName.message}
            </p>
          )}
        </div>

        {/* Campaign Description */}
        <div className="space-y-1">
          <Label htmlFor={campaignDescriptionId}>Campaign Description</Label>
          <Textarea
            id={campaignDescriptionId}
            placeholder="Please add a description to your campaign"
            {...register("campaignDescription", {
              required: "Campaign description is required",
              minLength: {
                value: 10,
                message: "Campaign description must be at least 10 characters",
              },
            })}
            aria-invalid={errors.campaignDescription ? "true" : "false"}
            className="min-h-32"
          />
          {errors.campaignDescription && (
            <p className="text-xs text-red-600">
              {errors.campaignDescription.message}
            </p>
          )}
        </div>

        {/* Date Range */}
        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="startDate"
            control={control}
            rules={{ required: "Start date is required" }}
            render={({ field }) => (
              <NaturalLanguageDatePicker
                label="Start Date"
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date?.toISOString())}
                placeholder="e.g., tomorrow, next week"
                error={errors.startDate?.message}
              />
            )}
          />
          <Controller
            name="endDate"
            control={control}
            rules={{ required: "End date is required" }}
            render={({ field }) => (
              <NaturalLanguageDatePicker
                label="End Date"
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => field.onChange(date?.toISOString())}
                placeholder="e.g., in 2 weeks"
                error={errors.endDate?.message}
              />
            )}
          />
        </div>

        {/* Daily Digest Toggle */}
        <div className="flex items-center justify-between py-2">
          <Label htmlFor={dailyDigestId} className="cursor-pointer">
            Want to receive daily digest about the campaign?
          </Label>
          <Controller
            name="digestCampaign"
            control={control}
            render={({ field }) => (
              <Switch
                id={dailyDigestId}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>

        {/* Linked Keywords */}
        <div className="space-y-1">
          <Label htmlFor="keywords">Linked Keywords</Label>
          {linkedKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {linkedKeywords.map((keyword, index) => (
                <span
                  key={`${index}-${keyword}`}
                  className="inline-flex items-center gap-1 bg-[#247B7B] text-white pl-2 py-0.5 pr-1 rounded-full text-xs"
                >
                  <span>{keyword}</span>
                  <button
                    type="button"
                    onClick={() => removeKeyword(index)}
                    className="hover:bg-white/20 rounded-full p-px"
                    aria-label="Remove keyword"
                  >
                    <Icon icon="material-symbols:close" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <Input
            id={keywordsId}
            placeholder="To add keywords, type your keyword and press enter"
            value={linkedKeywordInput}
            onChange={(e) => setLinkedKeywordInput(e.target.value)}
            onKeyDown={handleKeywordKeyDown}
            aria-invalid={errors.linkedKeywords ? "true" : "false"}
          />
          {errors.linkedKeywords && (
            <p className="text-xs text-red-600">
              {errors.linkedKeywords.message}
            </p>
          )}
        </div>

        {/* Digest Frequency */}
        {digestCampaign && (
          <div className="space-y-1">
            <Label htmlFor="digest-frequency">
              Kindly select how often you want to receive daily digest
            </Label>
            <Controller
              name="dailyDigest"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id={digestFrequencyId}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Daily">Daily</SelectItem>
                    <SelectItem value="Weekly">Weekly</SelectItem>
                    <SelectItem value="Monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
        )}

        {/* Form Actions */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Icon icon="svg-spinners:ring-resize" />
            ) : (
              "Create Campaign"
            )}
          </Button>
        </div>
      </form>

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
              Campaign Successfully Created!
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
    </>
  );
}
