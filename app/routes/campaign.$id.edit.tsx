import { Icon } from "@iconify-icon/react";
import { useEffect, useId, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
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
import { useCampaign, useUpdateCampaign } from "~/lib/hooks/use-campaigns";
import type { UpdateCampaignDto } from "~/types";

export default function EditCampaign() {
  const { id } = useParams();
  const navigate = useNavigate();
  const updateCampaign = useUpdateCampaign();

  const campaignNameId = useId();
  const campaignDescriptionId = useId();
  const dailyDigestId = useId();
  const keywordsId = useId();
  const digestFrequencyId = useId();

  // Fetch existing campaign data
  const { data: campaign, isLoading, isError } = useCampaign(id || "");

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    setError,
    clearErrors,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<Omit<UpdateCampaignDto, "id">>({
    defaultValues: {
      campaignName: "",
      campaignDescription: "",
      startDate: "",
      endDate: "",
      digestCampaign: false,
      linkedKeywords: [],
      dailyDigest: "",
    },
    mode: "onBlur",
  });

  const [linkedKeywordInput, setLinkedKeywordInput] = useState("");
  const linkedKeywords = watch("linkedKeywords");
  const digestCampaign = watch("digestCampaign");

  // Populate form when campaign data is loaded
  useEffect(() => {
    if (campaign) {
      reset({
        campaignName: campaign.campaignName,
        campaignDescription: campaign.campaignDescription,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        digestCampaign: campaign.digestCampaign === "Yes",
        linkedKeywords: campaign.linkedKeywords,
        dailyDigest: campaign.dailyDigest,
      });
    }
  }, [campaign, reset]);

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && linkedKeywordInput.trim()) {
      e.preventDefault();
      setValue("linkedKeywords", [
        ...(linkedKeywords || []),
        linkedKeywordInput.trim(),
      ]);
      setLinkedKeywordInput("");
      clearErrors("linkedKeywords");
    }
  };

  const removeKeyword = (index: number) => {
    const newKeywords = (linkedKeywords || []).filter((_, i) => i !== index);
    setValue("linkedKeywords", newKeywords);

    if (newKeywords.length === 0) {
      setError("linkedKeywords", {
        type: "manual",
        message: "At least one keyword is required",
      });
    }
  };

  const onSubmit = async (data: Omit<UpdateCampaignDto, "id">) => {
    // Validate keywords
    if (!data.linkedKeywords || data.linkedKeywords.length === 0) {
      setError("linkedKeywords", {
        type: "manual",
        message: "At least one keyword is required",
      });
      return;
    }

    if (!id) return;

    try {
      await updateCampaign.mutateAsync({ id, ...data });
      navigate(`/campaign/${id}`);
    } catch (error) {
      console.error("Failed to update campaign:", error);
    }
  };

  const handleCancel = () => {
    navigate(`/campaign/${id}`);
  };

  // Loading state
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

  // Error state
  if (isError || !campaign) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <Icon icon="material-symbols:error" className="text-4xl text-red-600" />
        <p className="text-lg text-gray-600">Failed to load campaign</p>
        <Link to="/campaign">
          <Button variant="outline">Back to Campaigns</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Back Button */}
      <Link
        to={`/campaign/${id}`}
        className="inline-flex items-center gap-2 mb-6"
      >
        <Icon icon="material-symbols:arrow-back" className="text-xl" />
        <span>Back</span>
      </Link>

      {/* Header */}
      <h1 className="text-xl font-semibold text-[#247B7B] mb-7">
        Edit Campaign
      </h1>

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
          <Label htmlFor={keywordsId}>Linked Keywords</Label>
          {linkedKeywords && linkedKeywords.length > 0 && (
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
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? (
              <Icon icon="svg-spinners:ring-resize" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
