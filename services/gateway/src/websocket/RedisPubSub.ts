import type { Redis } from 'ioredis';

export type MessageHandler = (channel: string, payload: string) => void;

export class RedisPubSub {
  private readonly subscriber: Redis;

  constructor(redis: Redis) {
    this.subscriber = redis.duplicate();
  }

  async subscribe(channel: string, handler: MessageHandler): Promise<void> {
    await this.subscriber.subscribe(channel);
    this.subscriber.on('message', (ch, payload) => {
      if (ch === channel) {
        handler(ch, payload);
      }
    });
  }

  async publish(channel: string, payload: string): Promise<void> {
    await this.subscriber.publish(channel, payload);
  }

  async close(): Promise<void> {
    await this.subscriber.quit();
  }
}
