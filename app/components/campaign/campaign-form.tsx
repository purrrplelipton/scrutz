import { Icon } from "@iconify-icon/react";
import { useEffect, useId, useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { useBlocker } from "react-router";
import { NaturalLanguageDatePicker } from "~/components/natural-language-date-picker";
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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group";
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
import type { CreateCampaignDto } from "~/types";

interface CampaignFormProps {
  form: UseFormReturn<CreateCampaignDto>;
  onSubmit: (data: CreateCampaignDto) => unknown;
  onCancel: () => unknown;
  submitButtonText?: string;
  showDirtyCheck?: boolean;
}

export function CampaignForm({
  form,
  onSubmit,
  onCancel,
  submitButtonText = "Submit",
  showDirtyCheck = false,
}: CampaignFormProps) {
  const campaignNameId = useId();
  const campaignDescriptionId = useId();
  const dailyDigestId = useId();
  const keywordsId = useId();
  const digestFrequencyId = useId();

  const {
    setValue,
    setError,
    clearErrors,
    trigger,
    formState: { isSubmitting, errors, isDirty },
    register,
    handleSubmit,
    control,
    watch,
  } = form;

  const linkedKeywords = watch("linkedKeywords");
  const digestCampaign = watch("digestCampaign");
  const campaignName = watch("campaignName");
  const campaignDescription = watch("campaignDescription");
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  const [showExitDialog, setShowExitDialog] = useState(false);
  const [linkedKeyword, setLinkedKeyword] = useState("");

  const hasFormData = Boolean(
    campaignName ||
      campaignDescription ||
      startDate ||
      endDate ||
      (linkedKeywords && linkedKeywords.length > 0)
  );

  // Determine if user has unsaved changes based on context
  const hasUnsavedChanges = showDirtyCheck ? isDirty : hasFormData;

  // Prevent browser navigation (back/forward/refresh) when there's unsaved data
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Block React Router navigation when there's unsaved data
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      hasUnsavedChanges && currentLocation.pathname !== nextLocation.pathname
  );

  // Sync blocker state with dialog state
  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowExitDialog(true);
    }
  }, [blocker.state]);

  useEffect(() => {
    if (endDate && startDate) {
      trigger("endDate");
    }
  }, [startDate, endDate, trigger]);

  const validateDates = () => {
    if (!startDate || !endDate) return false;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (start < today) return false;

    const oneDayAfterStart = new Date(start);
    oneDayAfterStart.setDate(oneDayAfterStart.getDate() + 1);

    if (end < oneDayAfterStart) return false;

    return true;
  };

  const isFormValid = Boolean(
    campaignName &&
      campaignName.length >= 3 &&
      campaignDescription &&
      campaignDescription.length >= 10 &&
      startDate &&
      endDate &&
      linkedKeywords &&
      linkedKeywords.length > 0 &&
      validateDates()
  );

  const handleCancelClick = () => {
    if (hasUnsavedChanges) {
      setShowExitDialog(true);
    } else {
      onCancel();
    }
  };

  const handleConfirmExit = () => {
    setShowExitDialog(false);

    if (blocker.state === "blocked") {
      // If navigation was blocked, proceed with it
      blocker.proceed();
    } else {
      // Otherwise it was the cancel button
      onCancel();
    }
  };

  const handleCancelExit = () => {
    setShowExitDialog(false);

    // If navigation was blocked, reset it
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  };

  const addKeyword = () => {
    if (linkedKeyword.trim()) {
      const currentKeywords = watch("linkedKeywords") || [];
      setValue("linkedKeywords", [...currentKeywords, linkedKeyword.trim()]);
      setLinkedKeyword("");
      clearErrors("linkedKeywords");
    }
  };

  const removeKeyword = (index: number) => {
    const currentKeywords = watch("linkedKeywords") || [];
    const newKeywords = currentKeywords.filter((_, i) => i !== index);
    setValue("linkedKeywords", newKeywords);

    if (newKeywords.length === 0) {
      setError("linkedKeywords", {
        type: "manual",
        message: "At least one keyword is required",
      });
    }
  };

  return (
    <>
      <Dialog open={showExitDialog} onOpenChange={handleCancelExit}>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-center text-xl">
              Confirm Exit
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              You have unsaved changes. Are you sure you want to leave? All
              progress will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="grid grid-cols-2 gap-4">
            <Button variant="outline" onClick={handleCancelExit}>
              Continue Editing
            </Button>
            <Button onClick={handleConfirmExit} variant="destructive">
              Discard Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

        <div className="grid grid-cols-2 gap-4">
          <Controller
            name="startDate"
            control={control}
            rules={{
              required: "Start date is required",
              validate: (value) => {
                if (!value) return true;
                const selectedDate = new Date(value);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                selectedDate.setHours(0, 0, 0, 0);

                if (selectedDate < today) {
                  return "Start date cannot be in the past";
                }
                return true;
              },
            }}
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
            rules={{
              required: "End date is required",
              validate: (value) => {
                if (!value || !startDate) return true;
                const start = new Date(startDate);
                const end = new Date(value);

                const oneDayAfterStart = new Date(start);
                oneDayAfterStart.setDate(oneDayAfterStart.getDate() + 1);

                if (end < oneDayAfterStart) {
                  return "End date must be at least one day after start date";
                }
                return true;
              },
            }}
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

        <div className="flex items-center justify-between py-2">
          <Label htmlFor={dailyDigestId}>
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

        <div className="space-y-1">
          <Label htmlFor={keywordsId}>Linked Keywords</Label>
          {linkedKeywords && linkedKeywords.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {linkedKeywords.map((keyword, index) => (
                <span
                  key={`${index}-${keyword}`}
                  className="inline-flex items-center gap-1 bg-teal-600 text-white pl-2 py-0.5 pr-1 rounded-full text-xs"
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
          <InputGroup>
            <InputGroupInput
              id={keywordsId}
              placeholder="Enter a keyword"
              value={linkedKeyword}
              onChange={(e) => setLinkedKeyword(e.target.value)}
              aria-invalid={errors.linkedKeywords ? "true" : "false"}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                onClick={addKeyword}
                disabled={!linkedKeyword.trim()}
                className="py-0.5"
              >
                Add
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {errors.linkedKeywords && (
            <p className="text-xs text-red-600">
              {errors.linkedKeywords.message}
            </p>
          )}
        </div>

        {digestCampaign && (
          <div className="space-y-1">
            <Label htmlFor={digestFrequencyId}>
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

        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancelClick}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              isSubmitting || (showDirtyCheck && !isDirty) || !isFormValid
            }
          >
            {isSubmitting ? (
              <Icon icon="svg-spinners:ring-resize" />
            ) : (
              submitButtonText
            )}
          </Button>
        </div>
      </form>
    </>
  );
}
