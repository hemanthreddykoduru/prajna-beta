import { useParams } from 'react-router-dom'
import Shell from './Shell'
import { nav } from './Shell'
import './Dashboard.css'

/**
 * Landing page for a sidebar tab whose backing microservice is not deployed.
 *
 * Exists so a dead tab explains itself. Previously these were `#Label`
 * anchors: clicking did nothing at all, which is indistinguishable from the
 * app being broken.
 */
export default function Unavailable() {
  const { label = '' } = useParams()
  const decoded = decodeURIComponent(label)
  const item = nav.find((n) => n.label === decoded)

  return (
    <Shell active={decoded}>
      <div className="pagehead">
        <h1>{decoded}</h1>
        <p>This section is not available yet.</p>
      </div>

      <section className="card">
        <div className="panel-empty">
          <p className="panel-empty__title">Waiting on a backend service</p>
          <p className="panel-empty__detail">
            {item?.blocked ??
              'The microservice behind this section has not been deployed yet.'}
          </p>
          <p className="panel-empty__detail">
            The screen will start working as soon as that module is deployed — no
            change is needed here.
          </p>
        </div>
      </section>
    </Shell>
  )
}
