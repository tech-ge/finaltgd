import type { RedisPubSub } from './RedisPubSub.js';

export interface AiEvent {
  accountId: number;
  intent: string;
  outcome: string;
  at: Date;
}

export class AiEventStream {
  constructor(private readonly pubsub: RedisPubSub) {}

  async emit(event: AiEvent): Promise<void> {
    await this.pubsub.publish(`ai.event.${event.accountId}`, JSON.stringify(event));
  }
}
