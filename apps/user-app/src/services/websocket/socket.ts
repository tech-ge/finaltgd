export interface SocketConfig {
  url: string;
  token: string;
  onMessage: (channel: string, payload: unknown) => void;
  onClose?: () => void;
}

export class SocketClient {
  private ws: WebSocket | null = null;
  private closedByUser = false;

  constructor(private readonly config: SocketConfig) {}

  connect(): void {
    const url = `${this.config.url}?token=${encodeURIComponent(this.config.token)}`;
    this.ws = new WebSocket(url);

    this.ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const parsed = JSON.parse(event.data) as { channel: string; payload: unknown };
        this.config.onMessage(parsed.channel, parsed.payload);
      } catch {
        // Ignore malformed frames.
      }
    };

    this.ws.onclose = () => {
      if (!this.closedByUser) {
        setTimeout(() => this.connect(), 2000);
      }
      this.config.onClose?.();
    };
  }

  send(channel: string, payload: unknown): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ channel, payload }));
    }
  }

  close(): void {
    this.closedByUser = true;
    this.ws?.close();
    this.ws = null;
  }
}
