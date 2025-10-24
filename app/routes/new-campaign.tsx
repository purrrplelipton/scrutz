import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { CampaignForm } from "~/components/campaign/campaign-form";
import { SuccessDialog } from "~/components/campaign/success-dialog";
import { useCreateCampaign } from "~/lib/hooks/use-campaigns";
import type { CreateCampaignDto } from "~/types";

export default function NewCampaign() {
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
    navigate("/campaign");
  };

  return (
    <>
      <p className="font-semibold text-teal-600 text-xl mb-7">
        Create new campaign
      </p>
      <div className="w-full max-w-2xl mx-auto">
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
    </>
  );
}
