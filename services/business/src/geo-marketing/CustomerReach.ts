export interface ReachInput {
  businessId: number;
  activeCampaignIds: string[];
  totalCustomersInRadius: number;
}

export interface ReachReport {
  businessId: number;
  campaigns: number;
  estimatedImpressions: number;
  estimatedEngagementRate: number;
}

const BASELINE_ENGAGEMENT = 0.04;

export function estimate(input: ReachInput): ReachReport {
  const impressions = input.totalCustomersInRadius * Math.max(1, input.activeCampaignIds.length);
  return {
    businessId: input.businessId,
    campaigns: input.activeCampaignIds.length,
    estimatedImpressions: impressions,
    estimatedEngagementRate: BASELINE_ENGAGEMENT,
  };
}
