import { Icon } from "@iconify-icon/react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { lazy, useEffect } from "react";
import { useForm } from "react-hook-form";
import AppLayout from "~/components/app-layout";
import { Button } from "~/components/ui/button";
import { useCampaign, useUpdateCampaign } from "~/lib/hooks/use-campaigns";
import type { UpdateCampaignDto } from "~/types";

const CampaignForm = lazy(() =>
  import("~/components/campaigns/campaign-form").then((module) => ({
    default: module.CampaignForm,
  }))
);

export const Route = createFileRoute("/campaigns/$id/edit")({
  component: EditCampaign,
});

function EditCampaign() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const updateCampaign = useUpdateCampaign();

  const { data: campaign, isLoading, isError } = useCampaign(id || "");

  const form = useForm<Omit<UpdateCampaignDto, "id">>({
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

  const onSubmit = async (data: Omit<UpdateCampaignDto, "id">) => {
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
      navigate({ to: "/campaigns/$id", params: { id } });
    } catch (error) {
      console.error("Failed to update campaign:", error);
    }
  };

  const handleCancel = () => {
    navigate({ to: "/campaigns/$id", params: { id } });
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
          <p className="text-gray-600 text-lg">Failed to load campaign</p>
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
        <Link
          to="/campaigns/$id"
          params={{ id }}
          className="mb-6 inline-flex items-center gap-2"
        >
          <Icon icon="material-symbols:arrow-back" className="text-xl" />
          <span>Back</span>
        </Link>

        <h1 className="mb-7 font-semibold text-teal-600 text-xl">
          Edit Campaign
        </h1>

        <CampaignForm
          form={form}
          onSubmit={onSubmit}
          onCancel={handleCancel}
          submitButtonText="Save Changes"
          showDirtyCheck={true}
          initialStartDate={campaign.startDate}
        />
      </div>
    </AppLayout>
  );
}
