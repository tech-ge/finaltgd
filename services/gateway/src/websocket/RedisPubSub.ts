import type { Redis } from 'ioredis';

export type MessageHandler = (channel: string, payload: string) => void;

export class RedisPubSub {
  private readonly subscriber: Redis;
  private readonly handlers = new Map<string, Set<MessageHandler>>();

  constructor(redis: Redis) {
    this.subscriber = redis.duplicate();
    this.subscriber.on('message', (channel, payload) => {
      const set = this.handlers.get(channel);
      if (!set) {
        return;
      }
      for (const handler of set) {
        try {
          handler(channel, payload);
        } catch (err) {
          console.error('pubsub_handler_error', err);
        }
      }
    });
  }

  async subscribe(channel: string, handler: MessageHandler): Promise<void> {
    const set = this.handlers.get(channel) ?? new Set<MessageHandler>();
    set.add(handler);
    this.handlers.set(channel, set);
    await this.subscriber.subscribe(channel);
  }

  async publish(channel: string, payload: string | object): Promise<void> {
    const serialized = typeof payload === 'string' ? payload : JSON.stringify(payload);
    await this.subscriber.publish(channel, serialized);
  }

  async close(): Promise<void> {
    await this.subscriber.quit();
  }
}
