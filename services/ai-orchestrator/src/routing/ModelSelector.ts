export type ModelName = 'shadow-student' | 'voice-clone' | 'speech-analytics';

export interface ModelEndpoints {
  shadowStudent: string;
  voiceClone: string;
  speechAnalytics: string;
}

export function selectModel(intent: string): ModelName {
  if (intent.startsWith('voice.')) {
    return 'voice-clone';
  }
  if (intent.startsWith('audio.') || intent.startsWith('speech.')) {
    return 'speech-analytics';
  }
  return 'shadow-student';
}

export function endpointFor(model: ModelName, endpoints: ModelEndpoints): string {
  switch (model) {
    case 'shadow-student':
      return endpoints.shadowStudent;
    case 'voice-clone':
      return endpoints.voiceClone;
    case 'speech-analytics':
      return endpoints.speechAnalytics;
  }
}
