import * as SecureStore from 'expo-secure-store';

const KEY = 'techgeo.assistant.voiceFingerprint';

export async function storeFingerprint(fingerprint: string): Promise<void> {
  await SecureStore.setItemAsync(KEY, fingerprint);
}

export async function loadFingerprint(): Promise<string | null> {
  return SecureStore.getItemAsync(KEY);
}

export async function clearFingerprint(): Promise<void> {
  await SecureStore.deleteItemAsync(KEY);
}
