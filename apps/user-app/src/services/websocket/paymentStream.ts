import type { SocketClient } from './socket';

export interface PaymentEvent {
  accountId: number;
  status: 'pending' | 'settled' | 'failed';
  amountTgd: string;
  reference: string;
  at: string;
}

export class PaymentStreamClient {
  constructor(private readonly socket: SocketClient, private readonly accountId: number) {}

  subscribe(handler: (event: PaymentEvent) => void): void {
    this.socket.connect();
    void handler;
  }
}
