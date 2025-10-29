import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { lazy, useState } from "react";
import { useForm } from "react-hook-form";
import AppLayout from "~/components/app-layout";
import { SuccessDialog } from "~/components/campaigns/success-dialog";
import { useCreateCampaign } from "~/lib/hooks/use-campaigns";
import type { CreateCampaignDto } from "~/types";

const CampaignForm = lazy(() =>
  import("~/components/campaigns/campaign-form").then((module) => ({
    default: module.CampaignForm,
  }))
);

export const Route = createFileRoute("/campaigns/new")({
  component: NewCampaign,
});

function NewCampaign() {
  const navigate = useNavigate();
  const createCampaign = useCreateCampaign();

  const form = useForm<CreateCampaignDto>({
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

  const { reset, setError } = form;

  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const onSubmit = async (data: CreateCampaignDto) => {
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
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
  };

  const handleCancel = () => {
    reset();
  };

  const handleSuccessDialogClose = () => {
    setShowSuccessDialog(false);
    navigate({ to: "/campaigns" });
  };

  return (
    <AppLayout>
      <p className="mb-7 font-semibold text-teal-600 text-xl">
        Create new campaign
      </p>
      <div className="mx-auto w-full max-w-2xl">
        <CampaignForm
          form={form}
          onSubmit={onSubmit}
          onCancel={handleCancel}
          submitButtonText="Create Campaign"
        />
      </div>

      <SuccessDialog
        open={showSuccessDialog}
        onOpenChange={(open) => {
          if (!open) handleSuccessDialogClose();
        }}
        title="Campaign Successfully Created!"
        buttonText="Go Back to campaign list"
        onButtonClick={handleSuccessDialogClose}
      />
    </AppLayout>
  );
}
