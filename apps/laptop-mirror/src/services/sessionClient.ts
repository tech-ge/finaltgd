export interface SessionClientConfig {
  baseUrl: string;
}

export class SessionClient {
  private readonly baseUrl: string;

  constructor(config: SessionClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
  }

  async startSession(phoneToken: string): Promise<{ sessionId: string }> {
    const response = await fetch(`${this.baseUrl}/v1/mirror/session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phoneToken }),
    });
    if (!response.ok) {
      throw new Error(`session_start_failed_${response.status}`);
    }
    return (await response.json()) as { sessionId: string };
  }

  async closeSession(sessionId: string): Promise<void> {
    await fetch(`${this.baseUrl}/v1/mirror/session/${sessionId}`, {
      method: 'DELETE',
    });
  }
}
