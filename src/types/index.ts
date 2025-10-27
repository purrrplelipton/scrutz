export interface Campaign {
  id: string;
  campaignName: string;
  campaignDescription: string;
  startDate: string;
  endDate: string;
  digestCampaign: "Yes" | "No";
  linkedKeywords: string[];
  dailyDigest: "Daily" | "Weekly" | "Monthly" | "";
  campaignStatus: "Active" | "Inactive";
}

export interface CreateCampaignDto
  extends Omit<Campaign, "id" | "campaignStatus" | "digestCampaign"> {
  digestCampaign: boolean;
}

export interface UpdateCampaignDto extends CreateCampaignDto {
  id: string;
}

export interface CampaignListResponse {
  data: Campaign[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CampaignFilters {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: string;
}
