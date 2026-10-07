import type { RedisPubSub } from './RedisPubSub.js';

export interface PaymentEvent {
  accountId: number;
  status: 'pending' | 'settled' | 'failed';
  amountTgd: string;
  reference: string;
  at: string;
}

export class PaymentStream {
  constructor(private readonly pubsub: RedisPubSub) {}

  async emit(event: PaymentEvent): Promise<void> {
    const channel =
      event.status === 'settled'
        ? `payments.settled.${event.accountId}`
        : `payments.pending.${event.accountId}`;
    await this.pubsub.publish(channel, event);
  }
}
