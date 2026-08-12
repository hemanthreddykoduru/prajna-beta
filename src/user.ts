/**
 * The signed-in user, for display.
 *
 * Sourced from the Cognito ID token claims, which are available the moment the
 * user logs in — no backend call, and specifically no dependency on Module 7,
 * whose `/faculty/*` routes are not currently reachable.
 *
 * Falls back to the bundled sample identity only when there is no session at
 * all (design/demo mode with no backend configured), so a signed-in user is
 * never greeted by somebody else's name.
 */
import { getSession, type CanonicalRole } from './auth'

export interface DisplayUser {
  name: string
  initials: string
  email: string
  department: string
  campus: string
  role: CanonicalRole
  facultyId: string
  /** False when this is the bundled placeholder rather than a real session. */
  isReal: boolean
}

const DEPARTMENT_NAMES: Record<string, string> = {
  CSE: 'Computer Science & Engineering',
  ECE: 'Electronics & Communication',
  ME: 'Mechanical Engineering',
}

const CAMPUS_NAMES: Record<string, string> = {
  BENGALURU: 'Bengaluru',
  VIZAG: 'Vizag',
  HYDERABAD: 'Hyderabad',
}

const ROLE_LABELS: Record<CanonicalRole, string> = {
  ADMIN: 'Admin',
  PROVC: 'Pro Vice-Chancellor',
  IQAC: 'IQAC',
  DIRECTOR: 'Director',
  HOD: 'Head of Department',
  FACULTY: 'Faculty',
}

/** "priya.sharma@gitam.edu" -> "Priya Sharma" */
function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? ''
  if (!local) return 'Faculty'
  return local
    .split(/[._\-+]/)
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ')
}

function initialsOf(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean)
  if (!parts.length) return '?'
  return ((parts[0][0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase()
}

const PLACEHOLDER: DisplayUser = {
  name: 'Dr. Ananya Rao',
  initials: 'AR',
  email: '',
  department: 'Computer Science & Engineering',
  campus: 'Bengaluru',
  role: 'FACULTY',
  facultyId: '',
  isReal: false,
}

export function currentUser(): DisplayUser {
  const s = getSession()
  if (!s) return PLACEHOLDER

  const name = nameFromEmail(s.email)
  const campus = s.campuses.length > 1
    // Multi-campus roles (IQAC) legitimately span all three.
    ? s.campuses.map((c) => CAMPUS_NAMES[c] ?? c).join(' · ')
    : CAMPUS_NAMES[s.campuses[0] ?? ''] ?? s.campuses[0] ?? ''

  return {
    name,
    initials: initialsOf(name),
    email: s.email,
    department: DEPARTMENT_NAMES[s.department] ?? s.department,
    campus,
    role: s.role,
    facultyId: s.facultyId,
    isReal: true,
  }
}

export const roleLabel = (r: CanonicalRole): string => ROLE_LABELS[r]
