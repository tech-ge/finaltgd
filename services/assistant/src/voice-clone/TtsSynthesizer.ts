import type { HfVoiceClient } from './HfVoiceClient.js';
import type { VoiceVault } from './VoiceVault.js';

export interface SynthesisInput {
  accountId: number;
  text: string;
}

export interface SynthesisResult {
  accountId: number;
  audioUrl: string;
}

export class TtsSynthesizer {
  constructor(
    private readonly vault: VoiceVault,
    private readonly hf: HfVoiceClient,
    private readonly spaceUrl: string,
    private readonly token: string,
  ) {}

  async synthesize(input: SynthesisInput): Promise<SynthesisResult> {
    const entry = await this.vault.load(input.accountId);
    if (!entry) {
      throw new Error('voice_not_enrolled');
    }

    const result = await this.hf.call({
      url: this.spaceUrl,
      path: '/synthesize',
      body: { accountId: input.accountId, text: input.text },
      token: this.token,
      timeoutMs: 20_000,
    });

    if (!result.ok) {
      throw new Error(`synthesis_failed: ${result.status}`);
    }

    const body = result.body as { audio_url?: string } | null;
    return {
      accountId: input.accountId,
      audioUrl: body?.audio_url ?? `/static/${input.accountId}/output.wav`,
    };
  }
}
