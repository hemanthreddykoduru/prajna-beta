/**
 * Runtime module discovery.
 *
 * Availability is decided by calling the service, never by a hardcoded list.
 * The consequence that matters: when a module is finally deployed, its screen
 * starts working on the next page load with no change to this app.
 *
 * The HTTP status tells us which of four different situations we are in, and
 * they must not be collapsed into a single "error" — "you may not see this"
 * and "this service does not exist" are very different messages to show a
 * faculty member.
 */
import { useEffect, useState } from 'react'
import { ApiError, apiGet } from './api'
import { getSession } from './auth'
import { isBackendConfigured } from './config'
import type { ModuleSpec } from './modules'

export type ModuleStatus =
  /** Service answered. `rows` may still be empty — that is a real "nothing yet". */
  | { state: 'ready'; rows: unknown[]; raw: unknown }
  /** Service answered, but this role may not read it. Correct RBAC, not a fault. */
  | { state: 'forbidden'; reason: string }
  /** Route is not published, or the stack is not deployed. */
  | { state: 'not-deployed' }
  /** Deployed and routed, but the Lambda itself failed (5xx). */
  | { state: 'unhealthy'; reason: string }
  | { state: 'loading' }
  | { state: 'signed-out' }

/** Pulls the list out of whatever wrapper the service uses. */
function extractRows(raw: unknown, listKey?: string): unknown[] {
  if (Array.isArray(raw)) return raw
  if (raw && typeof raw === 'object') {
    const obj = raw as Record<string, unknown>
    if (listKey && Array.isArray(obj[listKey])) return obj[listKey] as unknown[]
    // Fall back to the first array-valued property, so a service that wraps its
    // list under an unexpected key still renders instead of showing nothing.
    for (const v of Object.values(obj)) if (Array.isArray(v)) return v as unknown[]
  }
  return []
}

export function useModuleData(spec: ModuleSpec): ModuleStatus {
  const [status, setStatus] = useState<ModuleStatus>({ state: 'loading' })

  useEffect(() => {
    if (!isBackendConfigured || !getSession()) {
      setStatus({ state: 'signed-out' })
      return
    }

    let cancelled = false
    setStatus({ state: 'loading' })

    void (async () => {
      try {
        const raw = await apiGet<unknown>(spec.endpoint)
        if (!cancelled) setStatus({ state: 'ready', rows: extractRows(raw, spec.listKey), raw })
      } catch (e) {
        if (cancelled) return

        if (e instanceof ApiError) {
          // 403 from API Gateway with no matching route reads the same as a
          // role denial, so distinguish on the body: our services explain a
          // role refusal in the message, the gateway does not.
          if (e.status === 403) {
            const roleDenied = /role|forbidden|permission|not authorized to access/i.test(e.message)
            setStatus(
              roleDenied && !/no identity-based policy/i.test(e.message)
                ? { state: 'forbidden', reason: e.message }
                : { state: 'not-deployed' },
            )
            return
          }
          if (e.status === 404) {
            setStatus({ state: 'not-deployed' })
            return
          }
          if (e.status >= 500) {
            setStatus({
              state: 'unhealthy',
              reason: 'The service is deployed but returned an error.',
            })
            return
          }
        }
        setStatus({ state: 'not-deployed' })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [spec.endpoint, spec.listKey])

  return status
}
