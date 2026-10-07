import { createHmac, timingSafeEqual } from 'node:crypto';

export interface MpesaCallback {
  transactionId: string;
  amount: string;
  currency: string;
  phone: string;
  timestamp: string;
  signature: string;
}

export interface MpesaConfig {
  consumerKey: string;
  consumerSecret: string;
  shortcode: string;
  passkey: string;
  callbackUrl: string;
  signatureSecret: string;
}

export class MpesaGateway {
  constructor(private readonly config: MpesaConfig) {}

  verifyCallback(callback: MpesaCallback): boolean {
    const payload = `${callback.transactionId}:${callback.amount}:${callback.currency}:${callback.phone}:${callback.timestamp}`;
    const expected = createHmac('sha256', this.config.signatureSecret).update(payload).digest('hex');
    const a = Buffer.from(expected, 'hex');
    const b = Buffer.from(callback.signature, 'hex');
    if (a.length !== b.length) {
      return false;
    }
    return timingSafeEqual(a, b);
  }
}
