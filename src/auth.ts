/**
 * Cognito authentication.
 *
 * Talks to the Cognito IDP REST endpoint directly rather than pulling in
 * `aws-amplify`, which would add well over a megabyte to a bundle that
 * currently has three runtime dependencies. The two calls we need
 * (InitiateAuth, RespondToAuthChallenge) are plain JSON POSTs.
 *
 * The ID token is what the platform authorizer expects: it validates
 * `tokenUse: 'id'` and checks `aud` against the app-client id, so sending the
 * ACCESS token instead is rejected with 401.
 */
import { config } from './config'

const IDP_ENDPOINT = `https://cognito-idp.${config.cognito.region}.amazonaws.com/`
const STORAGE_KEY = 'prajna.session'

/** Canonical role strings, exactly as the platform authorizer emits them. */
export type CanonicalRole = 'ADMIN' | 'PROVC' | 'IQAC' | 'DIRECTOR' | 'HOD' | 'FACULTY'

export interface Session {
  idToken: string
  accessToken: string
  refreshToken?: string
  /** Epoch ms when the ID token expires. */
  expiresAt: number
  facultyId: string
  email: string
  role: CanonicalRole
  /** All campuses the user can see — more than one for IQAC. */
  campuses: string[]
  department: string
}

export class AuthError extends Error {
  // Declared explicitly rather than as a constructor parameter property:
  // this project builds with `erasableSyntaxOnly`.
  readonly code?: string

  constructor(message: string, code?: string) {
    super(message)
    this.name = 'AuthError'
    this.code = code
  }
}

async function idpCall(target: string, body: unknown): Promise<any> {
  const res = await fetch(IDP_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-amz-json-1.1',
      'X-Amz-Target': `AWSCognitoIdentityProviderService.${target}`,
    },
    body: JSON.stringify(body),
  })

  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    // Cognito returns "__type" like "NotAuthorizedException".
    const code = String(json.__type ?? '').split('#').pop()
    throw new AuthError(friendlyMessage(code, json.message), code)
  }
  return json
}

function friendlyMessage(code: string | undefined, fallback?: string): string {
  switch (code) {
    case 'NotAuthorizedException':
      return 'Incorrect email or password.'
    case 'UserNotFoundException':
      // Deliberately identical to the wrong-password message: distinguishing
      // them tells an attacker which accounts exist.
      return 'Incorrect email or password.'
    case 'PasswordResetRequiredException':
      return 'Your password must be reset before you can sign in.'
    case 'UserNotConfirmedException':
      return 'This account has not been confirmed yet.'
    case 'TooManyRequestsException':
      return 'Too many attempts. Please wait a moment and try again.'
    default:
      return fallback || 'Sign-in failed. Please try again.'
  }
}

/** Decodes a JWT payload. Does NOT verify — the API does that server-side. */
function decodeJwt(token: string): Record<string, any> {
  const part = token.split('.')[1]
  if (!part) return {}
  const padded = part.replace(/-/g, '+').replace(/_/g, '/')
  const json = atob(padded + '='.repeat((4 - (padded.length % 4)) % 4))
  try {
    return JSON.parse(decodeURIComponent(escape(json)))
  } catch {
    return JSON.parse(json)
  }
}

/**
 * Resolves ONE role from the user's Cognito groups.
 *
 * Cognito groups are UPPERCASE (ADMIN, PVC, IQAC, DIRECTOR, HOD, FACULTY) and
 * a user may hold several, so this mirrors the backend authorizer exactly:
 * highest rank wins, and the `PVC` group is normalised to `PROVC`, which is
 * the role string the API actually emits. Matching title-case names against
 * `cognito:groups` silently drops everyone except IQAC to Faculty.
 */
export function resolveRole(groups: unknown, customRole?: string): CanonicalRole {
  const RANK: Record<string, number> = {
    ADMIN: 4, PVC: 3, PROVC: 3, IQAC: 3, DIRECTOR: 2, HOD: 1, FACULTY: 0,
  }
  const CANON: Record<string, CanonicalRole> = {
    ADMIN: 'ADMIN', PVC: 'PROVC', PROVC: 'PROVC', IQAC: 'IQAC',
    DIRECTOR: 'DIRECTOR', HOD: 'HOD', FACULTY: 'FACULTY',
  }

  let bestRank = -1
  let best: CanonicalRole | null = null
  for (const raw of Array.isArray(groups) ? groups : []) {
    const g = String(raw).trim().toUpperCase()
    if (RANK[g] !== undefined && RANK[g] > bestRank) {
      bestRank = RANK[g]
      best = CANON[g]
    }
  }
  return best ?? CANON[String(customRole ?? '').trim().toUpperCase()] ?? 'FACULTY'
}

/**
 * `custom:campus` is comma-separated for multi-campus roles — an IQAC user
 * carries "BENGALURU,VIZAG,HYDERABAD". Reading it as a single string renders
 * one bogus campus, so always parse to a list.
 */
export function parseCampuses(claim: unknown): string[] {
  return String(claim ?? '')
    .split(',')
    .map((c) => c.trim().toUpperCase())
    .filter(Boolean)
}

function sessionFromTokens(r: any): Session {
  const idToken: string = r.IdToken
  const claims = decodeJwt(idToken)
  return {
    idToken,
    accessToken: r.AccessToken,
    refreshToken: r.RefreshToken,
    expiresAt: Date.now() + (Number(r.ExpiresIn ?? 3600) * 1000),
    // The authorizer resolves facultyId as custom:facultyId falling back to sub;
    // mirror that so the UI requests the same key the API scores against.
    facultyId: claims['custom:facultyId'] || claims.sub || '',
    email: claims.email || '',
    role: resolveRole(claims['cognito:groups'], claims['custom:role']),
    campuses: parseCampuses(claims['custom:campus']),
    department: claims['custom:department'] || '',
  }
}

/** Signs in with username + password. Throws `AuthError` on failure. */
export async function signIn(username: string, password: string): Promise<Session> {
  const res = await idpCall('InitiateAuth', {
    AuthFlow: 'USER_PASSWORD_AUTH',
    ClientId: config.cognito.clientId,
    AuthParameters: { USERNAME: username, PASSWORD: password },
  })

  if (res.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
    throw new AuthError(
      'A new password is required for this account. Please set one before signing in.',
      'NEW_PASSWORD_REQUIRED',
    )
  }
  if (!res.AuthenticationResult?.IdToken) {
    throw new AuthError(`Unsupported sign-in challenge: ${res.ChallengeName ?? 'unknown'}`)
  }

  const session = sessionFromTokens(res.AuthenticationResult)
  saveSession(session)
  return session
}

export function saveSession(s: Session): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
  } catch {
    /* private browsing — session simply won't persist across reloads */
  }
}

/** Returns the stored session, or null when absent or expired. */
export function getSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const s = JSON.parse(raw) as Session
    // 30s skew so we don't hand out a token that dies mid-flight.
    if (!s.idToken || s.expiresAt - 30_000 < Date.now()) {
      localStorage.removeItem(STORAGE_KEY)
      return null
    }
    return s
  } catch {
    return null
  }
}

export function signOut(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* nothing to clear */
  }
}

export const isSignedIn = (): boolean => getSession() !== null
