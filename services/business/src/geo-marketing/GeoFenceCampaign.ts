export interface Campaign {
  id: string;
  businessId: number;
  centerLat: number;
  centerLon: number;
  radiusMeters: number;
  message: string;
  startsAt: Date;
  endsAt: Date;
}

export function isActive(campaign: Campaign, now = new Date()): boolean {
  return now >= campaign.startsAt && now <= campaign.endsAt;
}

export function validate(campaign: Campaign): void {
  if (campaign.radiusMeters <= 0 || campaign.radiusMeters > 50_000) {
    throw new Error('invalid_campaign_radius');
  }
  if (campaign.endsAt <= campaign.startsAt) {
    throw new Error('invalid_campaign_window');
  }
  if (campaign.message.trim().length === 0) {
    throw new Error('empty_campaign_message');
  }
}
