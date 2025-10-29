import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api, queryKeys } from "~/lib/api-client";
import { toast } from "~/lib/toast";
import type {
  Campaign,
  CampaignFilters,
  CampaignListResponse,
  CreateCampaignDto,
  UpdateCampaignDto,
} from "~/types";

export function useCampaigns(
  filters: CampaignFilters = {},
  options?: { enableRealtime?: boolean; refetchInterval?: number }
) {
  const { enableRealtime = false, refetchInterval = 30000 } = options || {};

  return useQuery({
    queryKey: queryKeys.campaigns.list(filters as Record<string, unknown>),
    queryFn: async () => {
      const response = await api.get<CampaignListResponse | Campaign[]>(
        "/Campaign",
        {
          params: filters as Record<string, string | number | boolean>,
        }
      );

      if (Array.isArray(response)) {
        return {
          data: response,
          total: response.length,
          page: filters.page || 1,
          pageSize: filters.pageSize || 10,
        } satisfies CampaignListResponse;
      }

      return response;
    },
    placeholderData: (previousData) => previousData,
    refetchInterval: enableRealtime ? refetchInterval : false,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: queryKeys.campaigns.detail(id),
    queryFn: () => api.get<Campaign>(`/Campaign/${id}`),
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateCampaignDto) => {
      return await api.post<Campaign>("/Campaign", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.campaigns.lists() });
    },
    onError: () => {
      toast.error("Failed to create campaign", {
        description: "Please try again",
      });
    },
  });
}

export function useUpdateCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...data }: UpdateCampaignDto) => {
      const campaign = await api.put<Campaign>(`/Campaign/${id}`, {
        id,
        ...data,
      });
      toast.success("Campaign updated", {
        description: "Changes saved successfully",
      });
      return campaign;
    },
    onSuccess: (updatedCampaign) => {
      queryClient.setQueryData(
        queryKeys.campaigns.detail(updatedCampaign.id),
        updatedCampaign
      );

      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.lists(),
      });
    },
    onError: () => {
      toast.error("Failed to update campaign", {
        description: "Please try again",
      });
    },
  });
}

export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/Campaign/${id}`);
    },
    onSuccess: (_, deletedId) => {
      queryClient.removeQueries({
        queryKey: queryKeys.campaigns.detail(deletedId),
      });

      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.lists(),
      });
    },
    onError: () => {
      toast.error("Failed to delete campaign", {
        description: "Please try again",
      });
    },
  });
}

export function useToggleCampaignStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: Campaign["campaignStatus"];
    }) =>
      api.put<Campaign>(`/CampaignStatus/${id}`, {
        id,
        campaignStatus: status === "Active",
      }),
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.campaigns.detail(id),
      });

      const previousCampaign = queryClient.getQueryData<Campaign>(
        queryKeys.campaigns.detail(id)
      );

      if (previousCampaign) {
        queryClient.setQueryData(queryKeys.campaigns.detail(id), {
          ...previousCampaign,
          campaignStatus: status,
        });
      }

      return { previousCampaign };
    },
    onError: (_err, { id }, context) => {
      if (context?.previousCampaign) {
        queryClient.setQueryData(
          queryKeys.campaigns.detail(id),
          context.previousCampaign
        );
      }
    },
    onSettled: (_data, _error, { id }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.lists(),
      });
    },
  });
}
