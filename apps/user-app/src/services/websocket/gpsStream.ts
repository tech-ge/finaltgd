import type { SocketClient } from './socket';

export interface GpsEvent {
  orgId: number;
  employeeId: number;
  lat: number;
  lon: number;
  at: string;
}

export class GpsStreamClient {
  constructor(private readonly socket: SocketClient, private readonly orgId: number) {}

  subscribe(handler: (event: GpsEvent) => void): void {
    this.socket.connect();
    void handler;
  }
}
