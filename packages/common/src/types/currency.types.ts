import type { Decimal } from 'decimal.js';

export type LedgerOperation =
  | 'DEPOSIT_FIAT'
  | 'SEND_INTERNAL'
  | 'SEND_BUSINESS'
  | 'ESCROW_LOCK'
  | 'ESCROW_RELEASE'
  | 'MOVE_TO_EARN';

export type DepositStatus = 'PENDING' | 'CONFIRMED' | 'FAILED' | 'REVERSED';

export type EscrowState = 'LOCKED' | 'RELEASED' | 'CANCELLED' | 'EXPIRED';

export interface CurrencyRate {
  fiatCurrencyCode: string;
  fiatPerOneTgd: Decimal;
  isActive: boolean;
  lastUpdated: Date;
}

export interface LedgerTransfer {
  transferId: number;
  operation: LedgerOperation;
  fromAccount: number | null;
  toAccount: number;
  amount: Decimal;
  currencyCode: string;
  reference: string;
  idempotencyKey: string;
  memo: string | null;
  createdAt: Date;
}

export interface FiatDeposit {
  depositId: number;
  accountId: number;
  fiatAmount: Decimal;
  fiatCurrency: string;
  appliedRate: Decimal;
  tgdCredited: Decimal;
  gatewayReference: string;
  gatewayName: string;
  status: DepositStatus;
  createdAt: Date;
}

export interface EscrowTransaction {
  escrowId: number;
  reference: string;
  fromAccount: number;
  toAccount: number;
  escrowAccount: number;
  amount: Decimal;
  currencyCode: string;
  state: EscrowState;
  releaseLatitude: number | null;
  releaseLongitude: number | null;
  releaseRadiusM: number | null;
  releaseBiometric: boolean;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
