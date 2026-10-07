import { Kafka, type Producer, type ProducerRecord } from 'kafkajs';

export interface ProducerConfig {
  brokers: string[];
  clientId: string;
  idempotent?: boolean;
}

export class EventProducer {
  private readonly kafka: Kafka;
  private producer: Producer | null = null;

  constructor(private readonly config: ProducerConfig) {
    this.kafka = new Kafka({
      clientId: config.clientId,
      brokers: config.brokers,
      retry: {
        initialRetryTime: 300,
        retries: 5,
      },
    });
  }

  async connect(): Promise<void> {
    if (this.producer) {
      return;
    }
    this.producer = this.kafka.producer({
      idempotent: this.config.idempotent ?? true,
      maxInFlightRequests: 1,
    });
    await this.producer.connect();
  }

  async publish(topic: string, key: string, value: unknown): Promise<void> {
    if (!this.producer) {
      await this.connect();
    }
    if (!this.producer) {
      throw new Error('producer_not_connected');
    }
    const record: ProducerRecord = {
      topic,
      messages: [
        {
          key,
          value: JSON.stringify(value),
          timestamp: Date.now().toString(),
        },
      ],
    };
    await this.producer.send(record);
  }

  async disconnect(): Promise<void> {
    if (this.producer) {
      await this.producer.disconnect();
      this.producer = null;
    }
  }
}
