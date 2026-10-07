export const CONFIG = {
  gatewayUrl: process.env.EXPO_PUBLIC_GATEWAY_URL ?? 'http://localhost:3000',
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT ?? 'development',
  defaultRadiusM: 50,
  meetupRadiusM: 200,
  maxRetries: 3,
} as const;
