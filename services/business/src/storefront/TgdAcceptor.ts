import { Decimal } from 'decimal.js';

export interface PaymentIntent {
  businessAccountId: number;
  customerAccountId: number;
  amountTgd: Decimal;
  idempotencyKey: string;
  reference: string;
}

export interface AcceptedPayment {
  accepted: true;
  reference: string;
  amountTgd: string;
}

export interface RejectedPayment {
  accepted: false;
  reason: string;
}

export type PaymentOutcome = AcceptedPayment | RejectedPayment;

export class TgdAcceptor {
  async validate(intent: PaymentIntent): Promise<PaymentOutcome> {
    if (intent.amountTgd.lte(0)) {
      return { accepted: false, reason: 'amount_must_be_positive' };
    }
    if (intent.customerAccountId === intent.businessAccountId) {
      return { accepted: false, reason: 'self_payment_not_allowed' };
    }
    if (intent.idempotencyKey.length < 8) {
      return { accepted: false, reason: 'invalid_idempotency_key' };
    }
    return {
      accepted: true,
      reference: intent.reference,
      amountTgd: intent.amountTgd.toString(),
    };
  }
}
