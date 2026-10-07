export interface HfVoiceCallInput {
  url: string;
  path: string;
  body: unknown;
  token: string;
  timeoutMs: number;
}

export interface HfVoiceResult {
  ok: boolean;
  status: number;
  body: unknown;
}

export class HfVoiceClient {
  async call(input: HfVoiceCallInput): Promise<HfVoiceResult> {
    if (!input.url) {
      return { ok: false, status: 503, body: { error: 'voice_space_unconfigured' } };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), input.timeoutMs);

    try {
      const response = await fetch(`${input.url}${input.path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: input.token ? `Bearer ${input.token}` : '',
        },
        body: JSON.stringify(input.body),
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
      return { ok: response.ok, status: response.status, body: parsed };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'voice_space_error';
      return { ok: false, status: 502, body: { error: message } };
    } finally {
      clearTimeout(timer);
    }
  }
}
