import { Icon } from "@iconify-icon/react";
import { type KeyboardEvent, useId, useState } from "react";
import { Controller, type UseFormReturn } from "react-hook-form";
import { NaturalLanguageDatePicker } from "~/components/natural-language-date-picker";
import { Button } from "~/components/ui/button";
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
    formState: { isSubmitting, errors, isDirty },
    register,
    handleSubmit,
    control,
    watch,
  } = form;

  const linkedKeywords = watch("linkedKeywords");
  const digestCampaign = watch("digestCampaign");

  const handleKeywordKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && linkedKeyword.trim()) {
      e.preventDefault();
      const currentKeywords = form.watch("linkedKeywords") || [];
      setValue("linkedKeywords", [...currentKeywords, linkedKeyword.trim()]);
      setLinkedKeyword("");
      clearErrors("linkedKeywords");
    }
  };

  const removeKeyword = (index: number) => {
    const currentKeywords = form.watch("linkedKeywords") || [];
    const newKeywords = currentKeywords.filter((_, i) => i !== index);
    setValue("linkedKeywords", newKeywords);

    if (newKeywords.length === 0) {
      setError("linkedKeywords", {
        type: "manual",
        message: "At least one keyword is required",
      });
    }
  };

  const [linkedKeyword, setLinkedKeyword] = useState("");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
          <p className="text-xs text-red-600">{errors.campaignName.message}</p>
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
        <Input
          id={keywordsId}
          placeholder="To add keywords, type your keyword and press enter"
          value={linkedKeyword}
          onChange={(e) => setLinkedKeyword(e.target.value)}
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

      {/* Form Actions */}
      <div className="grid grid-cols-2 gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || (showDirtyCheck && !isDirty)}
        >
          {isSubmitting ? (
            <Icon icon="svg-spinners:ring-resize" />
          ) : (
            submitButtonText
          )}
        </Button>
      </div>
    </form>
  );
}
