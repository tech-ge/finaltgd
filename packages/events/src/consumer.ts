import { Kafka, type Consumer, type EachMessagePayload } from 'kafkajs';

export interface ConsumerConfig {
  brokers: string[];
  clientId: string;
  groupId: string;
}

export type MessageHandler = (
  topic: string,
  key: string | null,
  value: unknown,
) => Promise<void>;

export class EventConsumer {
  private readonly kafka: Kafka;
  private consumer: Consumer | null = null;

  constructor(private readonly config: ConsumerConfig) {
    this.kafka = new Kafka({
      clientId: config.clientId,
      brokers: config.brokers,
      retry: {
        initialRetryTime: 300,
        retries: 5,
      },
    });
  }

  async connect(topics: string[], handler: MessageHandler): Promise<void> {
    if (this.consumer) {
      return;
    }
    this.consumer = this.kafka.consumer({ groupId: this.config.groupId });
    await this.consumer.connect();
    await this.consumer.subscribe({ topics, fromBeginning: false });

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        const { topic, message } = payload;
        const key = message.key ? message.key.toString() : null;
        let parsed: unknown = null;
        if (message.value) {
          const raw = message.value.toString();
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = raw;
          }
        }
        await handler(topic, key, parsed);
      },
    });
  }

  async disconnect(): Promise<void> {
    if (this.consumer) {
      await this.consumer.disconnect();
      this.consumer = null;
    }
  }
}
