import { Audio } from 'expo-av';

export interface TtsPlayback {
  uri: string;
}

export async function playTts(playback: TtsPlayback): Promise<void> {
  const { sound } = await Audio.Sound.createAsync({ uri: playback.uri });
  await sound.playAsync();
}
