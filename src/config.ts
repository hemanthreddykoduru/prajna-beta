/**
 * Runtime configuration, supplied at build time by Vite env vars.
 *
 * Nothing here is a secret — a Cognito user-pool id and app-client id are
 * public by design; the pool enforces auth. Do NOT put an AWS access key here.
 *
 * Discover the values from SSM rather than hardcoding them, since they change
 * whenever the gateway or pool is recreated:
 *   /prajna/{stage}/api/api-endpoint
 *   /prajna/{stage}/auth/user-pool-id
 *   /prajna/{stage}/auth/user-pool-client-id
 */
export const config = {
  /** Shared platform API Gateway base URL, no trailing slash. */
  apiUrl: (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, ''),
  cognito: {
    region: import.meta.env.VITE_AWS_REGION ?? 'ap-south-2',
    userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID ?? '',
    clientId: import.meta.env.VITE_COGNITO_CLIENT_ID ?? '',
  },
} as const

/**
 * True when the build has enough configuration to talk to a real backend.
 * When false the app runs on bundled mock data instead of failing outright,
 * which keeps `npm run dev` useful with no AWS at all.
 */
export const isBackendConfigured = Boolean(
  config.apiUrl && config.cognito.userPoolId && config.cognito.clientId,
)
