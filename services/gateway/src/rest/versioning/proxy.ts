export interface ProxyTargets {
  currency: string;
  identity: string;
  maps: string;
  attendance: string;
  health: string;
  business: string;
  admin: string;
  'ai-orchestrator': string;
  assistant: string;
}

export interface ProxyResult {
  status: number;
  body: unknown;
}

export class ProxyClient {
  constructor(
    private readonly targets: ProxyTargets,
    private readonly timeoutMs = 15_000,
  ) {}

  async forward(
    service: keyof ProxyTargets,
    path: string,
    body: unknown,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE' = 'POST',
    extraHeaders: Record<string, string> = {},
  ): Promise<ProxyResult> {
    const baseUrl = this.targets[service];
    if (!baseUrl) {
      return { status: 503, body: { error: 'upstream_unconfigured' } };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${baseUrl}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...extraHeaders,
        },
        body: method === 'GET' ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });

      const text = await response.text();
      let parsed: unknown = null;
      if (text.length > 0) {
        try {
          parsed = JSON.parse(text);
        } catch {
          parsed = { raw: text };
        }
      }

      return { status: response.status, body: parsed };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'proxy_error';
      return { status: 502, body: { error: message } };
    } finally {
      clearTimeout(timer);
    }
  }
}
