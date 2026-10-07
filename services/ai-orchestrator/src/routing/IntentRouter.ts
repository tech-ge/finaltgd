export interface RouteDecision {
  model: 'shadow-student' | 'voice-clone' | 'speech-analytics';
  path: string;
}

export function route(intent: string): RouteDecision {
  if (intent.startsWith('voice.')) {
    return { model: 'voice-clone', path: '/synthesize' };
  }
  if (intent.startsWith('audio.')) {
    return { model: 'speech-analytics', path: '/analyze' };
  }
  return { model: 'shadow-student', path: '/infer' };
}
