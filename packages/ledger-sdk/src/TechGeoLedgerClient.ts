export interface LedgerClientConfig {
  baseUrl: string;
  bearerToken: string;
  timeoutMs?: number;
  defaultHeaders?: Record<string, string>;
}

export interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface ResponseEnvelope<T> {
  status: number;
  ok: boolean;
  data: T | null;
  raw: string;
}

export class TechGeoLedgerClient {
  private readonly baseUrl: string;
  private readonly bearerToken: string;
  private readonly timeoutMs: number;
  private readonly defaultHeaders: Record<string, string>;

  constructor(config: LedgerClientConfig) {
    if (!config.baseUrl) {
      throw new Error('baseUrl_required');
    }
    if (!config.bearerToken) {
      throw new Error('bearerToken_required');
    }
    this.baseUrl = config.baseUrl.replace(/\/+$/, '');
    this.bearerToken = config.bearerToken;
    this.timeoutMs = config.timeoutMs ?? 15_000;
    this.defaultHeaders = config.defaultHeaders ?? {};
  }

  async request<T>(options: RequestOptions): Promise<ResponseEnvelope<T>> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${options.path}`, {
        method: options.method ?? 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.bearerToken}`,
          ...this.defaultHeaders,
          ...options.headers,
        },
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        signal: controller.signal,
      });

      const raw = await response.text();
      let parsed: T | null = null;
      if (raw.length > 0) {
        try {
          parsed = JSON.parse(raw) as T;
        } catch {
          parsed = null;
        }
      }

      return {
        status: response.status,
        ok: response.ok,
        data: parsed,
        raw,
      };
    } finally {
      clearTimeout(timer);
    }
  }
}
