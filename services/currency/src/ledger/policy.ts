/**
 * Ledger operation policy.
 *
 * The following operations are permitted. Withdrawal is intentionally
 * absent. No code path may introduce it. Any pull request that adds a
 * withdrawal operation to this list must be rejected at review.
 */

export const ALLOWED_OPERATIONS = [
  'DEPOSIT_FIAT',
  'SEND_INTERNAL',
  'SEND_BUSINESS',
  'ESCROW_LOCK',
  'ESCROW_RELEASE',
  'MOVE_TO_EARN',
] as const;

export type AllowedOperation = (typeof ALLOWED_OPERATIONS)[number];

const FORBIDDEN_OPERATIONS = ['WITHDRAW', 'WITHDRAWAL', 'CASH_OUT'] as const;

export function isAllowedOperation(op: string): op is AllowedOperation {
  return (ALLOWED_OPERATIONS as readonly string[]).includes(op);
}

export function assertOperationAllowed(op: string): asserts op is AllowedOperation {
  if (FORBIDDEN_OPERATIONS.includes(op.toUpperCase() as never)) {
    throw new Error(`operation_forbidden: ${op}`);
  }
  if (!isAllowedOperation(op)) {
    throw new Error(`operation_not_allowed: ${op}`);
  }
}
