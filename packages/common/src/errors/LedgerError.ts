import { AppError } from './AppError.js';

export class LedgerError extends AppError {
  constructor(code: string, message: string, metadata: Record<string, unknown> = {}) {
    super(code, message, 422, metadata);
    this.name = 'LedgerError';
  }
}

export const LEDGER_ERRORS = {
  INSUFFICIENT_BALANCE: 'insufficient_balance',
  OPERATION_NOT_ALLOWED: 'operation_not_allowed',
  OPERATION_FORBIDDEN: 'operation_forbidden',
  IDEMPOTENCY_CONFLICT: 'idempotency_conflict',
  ESCROW_NOT_LOCKED: 'escrow_not_locked',
  ESCROW_EXPIRED: 'escrow_expired',
  RELEASE_OUTSIDE_RADIUS: 'release_outside_radius',
  BIOMETRIC_REQUIRED: 'biometric_required',
  FROM_TO_MUST_DIFFER: 'from_and_to_must_differ',
  AMOUNT_MUST_BE_POSITIVE: 'amount_must_be_positive',
} as const;
