export type AccountType = 'USER' | 'BUSINESS' | 'TREASURY' | 'ESCROW';

export type Role = 'CEO' | 'ADMIN' | 'SUPERVISOR' | 'WORKER';

export interface AccountIdentity {
  accountId: number;
  ownerType: AccountType;
  ownerRef: string;
  currencyCode: string;
  createdAt: Date;
}

export interface DeviceBinding {
  bindingId: number;
  accountId: number;
  deviceFingerprint: string;
  boundAt: Date;
  revokedAt: Date | null;
  revocationReason: string | null;
}

export interface EmployeeProfile {
  employeeId: number;
  orgId: number;
  fullName: string;
  deviceUuid: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrganizationProfile {
  orgId: number;
  managerName: string;
  businessName: string;
  officeLatitude: number;
  officeLongitude: number;
  officeStaticIp: string;
  createdAt: Date;
  updatedAt: Date;
}
