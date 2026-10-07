import * as LocalAuthentication from 'expo-local-authentication';
import { useCallback, useState } from 'react';

export function useBiometrics() {
  const [available, setAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const check = useCallback(async () => {
    const supported = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    setAvailable(supported && enrolled);
    return supported && enrolled;
  }, []);

  const authenticate = useCallback(async () => {
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Authenticate',
        fallbackLabel: 'Use passcode',
      });
      if (!result.success) {
        setError('biometric_failed');
        return false;
      }
      setError(null);
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'biometric_error';
      setError(message);
      return false;
    }
  }, []);

  return { available, error, check, authenticate };
}
