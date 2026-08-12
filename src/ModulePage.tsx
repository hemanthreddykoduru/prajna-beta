import { useParams } from 'react-router-dom'
import Shell from './Shell'
import { moduleByLabel, type ModuleSpec } from './modules'
import { useModuleData } from './useModuleData'
import './Dashboard.css'

/**
 * One screen for every backend module, driven by the registry.
 *
 * It always attempts the real call. If the service answers, the data renders.
 * If it does not, the page says precisely why — and specifically distinguishes
 * "you are not permitted" from "this is not deployed", because telling a
 * faculty member their record is empty when the service simply does not exist
 * is a different and wrong claim.
 *
 * Nothing here needs editing when a module ships.
 */

function cellText(value: unknown): string {
  if (value == null) return '—'
  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }
  return JSON.stringify(value)
}

function DataTable({ spec, rows }: { spec: ModuleSpec; rows: unknown[] }) {
  const objectRows = rows.filter((r) => r && typeof r === 'object') as Record<string, unknown>[]

  // Prefer the configured columns, but only those actually present, so a
  // service whose shape differs from the contract still renders usefully.
  const configured = (spec.columns ?? []).filter((c) =>
    objectRows.some((r) => r[c.field] !== undefined),
  )
  const columns = configured.length
    ? configured
    : Array.from(new Set(objectRows.flatMap((r) => Object.keys(r))))
        .slice(0, 6)
        .map((f) => ({ field: f, header: f }))

  if (!columns.length) {
    return <pre className="module-raw">{JSON.stringify(rows, null, 2)}</pre>
  }

  return (
    <table className="lb-table">
      <thead>
        <tr>
          {columns.map((c) => (
            <th key={c.field}>{c.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {objectRows.map((r, i) => (
          <tr key={i}>
            {columns.map((c) => (
              <td key={c.field}>{cellText(r[c.field])}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default function ModulePage() {
  const { label = '' } = useParams()
  const spec = moduleByLabel(decodeURIComponent(label))

  if (!spec) {
    return (
      <Shell active={decodeURIComponent(label)}>
        <div className="pagehead">
          <h1>{decodeURIComponent(label)}</h1>
          <p>Unknown section.</p>
        </div>
      </Shell>
    )
  }

  return <ModuleScreen spec={spec} />
}

function ModuleScreen({ spec }: { spec: ModuleSpec }) {
  const status = useModuleData(spec)

  return (
    <Shell active={spec.label}>
      <div className="pagehead">
        <h1>{spec.label}</h1>
        <p>{spec.blurb}</p>
      </div>

      <section className="card">
        {status.state === 'loading' && <p className="muted-13">Loading…</p>}

        {status.state === 'signed-out' && (
          <div className="panel-empty">
            <p className="panel-empty__title">Sign in to view this</p>
          </div>
        )}

        {status.state === 'ready' && status.rows.length > 0 && (
          <DataTable spec={spec} rows={status.rows} />
        )}

        {status.state === 'ready' && status.rows.length === 0 && (
          <div className="panel-empty">
            <p className="panel-empty__title">Nothing here yet</p>
            <p className="panel-empty__detail">
              {spec.moduleNo} is live and responding — you have no records in this
              section yet. Anything you submit will appear here.
            </p>
          </div>
        )}

        {status.state === 'forbidden' && (
          <div className="panel-empty">
            <p className="panel-empty__title">Not available to your role</p>
            <p className="panel-empty__detail">{status.reason}</p>
          </div>
        )}

        {status.state === 'unhealthy' && (
          <div className="panel-empty">
            <p className="panel-empty__title">{spec.moduleNo} is not responding</p>
            <p className="panel-empty__detail">
              {status.reason} The route is published, so this screen will start
              working as soon as the service is healthy — no change needed here.
            </p>
          </div>
        )}

        {status.state === 'not-deployed' && (
          <div className="panel-empty">
            <p className="panel-empty__title">Waiting on {spec.moduleNo}</p>
            <p className="panel-empty__detail">
              {spec.moduleName} is not deployed yet. This screen is already wired
              to <code>{spec.endpoint}</code> and will populate automatically once
              the module is live.
            </p>
          </div>
        )}
      </section>
    </Shell>
  )
}
