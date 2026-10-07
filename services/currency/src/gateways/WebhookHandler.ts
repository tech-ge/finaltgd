import type { FiatIngestion } from '../minting/FiatIngestion.js';
import { verifyHmac } from './CallbackVerifier.js';

export interface WebhookPayload {
  accountId: number;
  amount: string;
  currency: string;
  reference: string;
  gateway: string;
  signature: string;
}

export class WebhookHandler {
  constructor(private readonly ingestion: FiatIngestion, private readonly secret: string) {}

  async handle(payload: WebhookPayload): Promise<{ depositId: number }> {
    const raw = `${payload.accountId}:${payload.amount}:${payload.currency}:${payload.reference}:${payload.gateway}`;
    if (!verifyHmac(raw, payload.signature, this.secret)) {
      throw new Error('webhook_signature_invalid');
    }

    const depositId = await this.ingestion.confirmDeposit({
      accountId: payload.accountId,
      fiatAmount: payload.amount,
      fiatCurrency: payload.currency,
      gatewayReference: payload.reference,
      gatewayName: payload.gateway,
    });

    return { depositId };
  }
}
