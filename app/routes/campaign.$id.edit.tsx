import { Icon } from "@iconify-icon/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import { CampaignForm } from "~/components/campaign/campaign-form";
import { Button } from "~/components/ui/button";
import { useCampaign, useUpdateCampaign } from "~/lib/hooks/use-campaigns";
import type { UpdateCampaignDto } from "~/types";

export default function EditCampaign() {
  const { id } = useParams();
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
      navigate(`/campaign/${id}`);
    } catch (error) {
      console.error("Failed to update campaign:", error);
    }
  };

  const handleCancel = () => {
    navigate(`/campaign/${id}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Icon
          icon="svg-spinners:ring-resize"
          className="text-4xl text-teal-600"
        />
      </div>
    );
  }

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
      <Link
        to={`/campaign/${id}`}
        className="inline-flex items-center gap-2 mb-6"
      >
        <Icon icon="material-symbols:arrow-back" className="text-xl" />
        <span>Back</span>
      </Link>

      <h1 className="text-xl font-semibold text-teal-600 mb-7">
        Edit Campaign
      </h1>

      <CampaignForm
        form={form}
        onSubmit={onSubmit}
        onCancel={handleCancel}
        submitButtonText="Save Changes"
        showDirtyCheck={true}
      />
    </div>
  );
}
