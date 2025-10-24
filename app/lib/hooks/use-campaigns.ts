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

/**
 * Fetch all campaigns with optional filters
 */
export function useCampaigns(filters: CampaignFilters = {}) {
  return useQuery({
    queryKey: queryKeys.campaigns.list(filters as Record<string, unknown>),
    queryFn: async () => {
      const response = await api.get<CampaignListResponse | Campaign[]>(
        "/Campaign",
        {
          params: filters as Record<string, string | number | boolean>,
        }
      );

      // Handle API returning array instead of paginated response
      // TODO: Remove this adapter once API returns proper pagination metadata
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
    // Keep previous data while fetching new data
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Fetch a single campaign by ID
 */
export function useCampaign(id: string) {
  return useQuery({
    queryKey: queryKeys.campaigns.detail(id),
    queryFn: () => api.get<Campaign>(`/Campaign/${id}`),
    // Don't fetch if no ID provided
    enabled: !!id,
  });
}

/**
 * Create a new campaign
 */
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

/**
 * Update an existing campaign
 */
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
      // Update the specific campaign in cache
      queryClient.setQueryData(
        queryKeys.campaigns.detail(updatedCampaign.id),
        updatedCampaign
      );

      // Invalidate lists to reflect changes
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

/**
 * Delete a campaign
 */
export function useDeleteCampaign() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/Campaign/${id}`);
    },
    onSuccess: (_, deletedId) => {
      // Remove from cache
      queryClient.removeQueries({
        queryKey: queryKeys.campaigns.detail(deletedId),
      });

      // Invalidate lists
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

/**
 * Toggle campaign status between Active and Inactive
 */
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
    // Optimistic update
    onMutate: async ({ id, status }) => {
      // Cancel outgoing queries
      await queryClient.cancelQueries({
        queryKey: queryKeys.campaigns.detail(id),
      });

      // Snapshot previous value
      const previousCampaign = queryClient.getQueryData<Campaign>(
        queryKeys.campaigns.detail(id)
      );

      // Optimistically update
      if (previousCampaign) {
        queryClient.setQueryData(queryKeys.campaigns.detail(id), {
          ...previousCampaign,
          campaignStatus: status,
        });
      }

      // Return context for rollback
      return { previousCampaign };
    },
    // Rollback on error
    onError: (_err, { id }, context) => {
      if (context?.previousCampaign) {
        queryClient.setQueryData(
          queryKeys.campaigns.detail(id),
          context.previousCampaign
        );
      }
    },
    // Always refetch after success or error
    onSettled: (_data, _error, { id }) => {
      // Invalidate both detail and list queries
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.campaigns.lists(),
      });
    },
  });
}
