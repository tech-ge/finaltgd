export interface AudioFrame {
  sampleRateHz: number;
  samples: Float32Array;
}

export interface ClassificationResult {
  label: string;
  confidence: number;
}

export interface OnDeviceModelConfig {
  endpointUrl: string;
  token: string;
  timeoutMs: number;
}

export class OnDeviceModel {
  constructor(private readonly config: OnDeviceModelConfig) {}

  async classify(frame: AudioFrame): Promise<ClassificationResult> {
    if (!this.config.endpointUrl) {
      return { label: 'unknown', confidence: 0 };
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.config.timeoutMs);

    try {
      const response = await fetch(this.config.endpointUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.config.token}`,
        },
        body: JSON.stringify({
          sampleRateHz: frame.sampleRateHz,
          samples: Array.from(frame.samples.slice(0, 16_000)),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`model_status_${response.status}`);
      }

      const body = (await response.json()) as { label?: string; confidence?: number };
      return {
        label: typeof body.label === 'string' ? body.label : 'unknown',
        confidence: typeof body.confidence === 'number' ? body.confidence : 0,
      };
    } catch {
      return { label: 'unknown', confidence: 0 };
    } finally {
      clearTimeout(timer);
    }
  }
}
