import { ScorePage } from './PrajnaScore'
import { atTopTier, bandOf, bandProgress, bandRange, ladder, score } from './score'
import './TierProgress.css'

import iconChecked from './assets/dash/check-box.svg'
import iconCheckCircle from './assets/dash/check-circle.svg'
import iconUnchecked from './assets/dash/check-empty.svg'
import iconTrophy from './assets/dash/trophy.svg'

// tiers, ranges and progress all come from the contract — nothing hardcoded here
const current = bandOf(score.totalScore)

const checklist = [
  { label: 'Publish 1 research paper', done: true },
  { label: 'Complete 1 FDP or workshop', done: true },
  { label: 'Complete pending admin approvals', done: true },
  { label: 'File a patent', done: false, progress: '0/1' },
  { label: 'Secure a research grant', done: false, progress: '0/1' },
]

const actions = [
  { label: 'Publish 1 research paper (Q1, first author)', pts: 54 },
  { label: 'Complete 1 FDP or workshop', pts: 20 },
  { label: 'Complete pending admin approvals', pts: 15 },
  { label: 'Update missing profile details', pts: 10 },
]

const activity = [
  { label: '+54 Research Paper', date: 'Jul 4, 2026' },
  { label: '+10 FDP Score', date: 'Jul 3, 2026' },
  { label: '+15 Teaching Score', date: 'Jul 2, 2026' },
]

export default function TierProgress() {
  return (
    <ScorePage
      title="Tier Progress"
      subtitle="See your current PRAJNA tier and progress to the next level"
      meta={`Academic Year ${score.academicYear} · ${score.campus} · ${score.approvedCount} approved submissions`}
      active="Tier Progress"
    >
      <div className="row row--tier">
        <section className="card card--raised tier-now">
          <p className="kicker">CURRENT TIER</p>
          <div className="tier-now__badge-row">
            <span className={`tier-badge tier-badge--${current.tier.toLowerCase()}`}>{current.displayName[0]}</span>
            <span>
              <span className="tier-now__name">{current.displayName}</span>
              <span className="muted-13">{bandRange(current)}</span>
            </span>
          </div>
          <hr />
          <p className="tier-now__score">
            Current Score: {score.totalScore} / {score.maxScore} pts
          </p>
          <p className="muted-13">{score.tierMeaning}</p>
        </section>

        <section className="card card--raised tier-next">
          <h2>Progress to Next Tier</h2>
          <div className="tier-next__ends">
            <span className="tier-next__label">
              {score.totalScore} pts · {bandProgress(score.totalScore).toFixed(0)}% through {current.displayName}
            </span>
            <span className="tier-next__goal">
              {score.nextTierName}
              <span className="tier-badge tier-badge--mini">{score.nextTierName[0]}</span>
            </span>
          </div>
          <div className="track track--thick">
            <span style={{ width: `${bandProgress(score.totalScore)}%` }} />
          </div>
          <p className="tier-next__remaining">
            {atTopTier ? 'Highest tier reached' : `${score.pointsToNextTier} points to unlock ${score.nextTierName}`}
          </p>
        </section>
      </div>

      <section className="card card--raised ladder-card">
        <h2>Tier Ladder</h2>
        <ol className="ladder">
          {ladder.map((band) => {
            const state =
              band.tier === current.tier ? 'Current' : band.minScore < current.minScore ? 'Unlocked' : 'Locked'
            return (
              <li className={`step${state === 'Current' ? ' step--current' : ''}`} key={band.tier}>
                <span className={`tier-badge tier-badge--${band.tier.toLowerCase()}`}>{band.displayName[0]}</span>
                <span className="step__name" title={band.meaning}>
                  {band.displayName}
                </span>
                <span className="step__range">{bandRange(band)}</span>
                <span className={`step__state step__state--${state.toLowerCase()}`}>{state}</span>
              </li>
            )
          })}
        </ol>
      </section>

      <div className="row row--tier-bottom">
        <section className="card card--raised checklist-card">
          <h2>Achievement Checklist</h2>
          <ul className="checklist">
            {checklist.map((c) => (
              <li key={c.label}>
                <img src={c.done ? iconChecked : iconUnchecked} alt="" />
                <span className="checklist__label">{c.label}</span>
                {c.done ? <img src={iconCheckCircle} alt="Done" /> : <span className="muted-12">{c.progress}</span>}
              </li>
            ))}
          </ul>
        </section>

        <section className="card card--raised actions-card">
          <h2>Suggested Actions to Reach {score.nextTierName}</h2>
          <ul className="actions">
            {actions.map((a) => (
              <li key={a.label}>
                <span className="dot dot--sm dot--green" />
                <span className="actions__label">{a.label}</span>
                <span className="pts-pill">+{a.pts} pts</span>
              </li>
            ))}
          </ul>
        </section>

        <div className="tier-side">
          <section className="card estimate">
            <p className="estimate__title">Estimated {score.nextTierName}</p>
            <div className="estimate__body">
              <img src={iconTrophy} alt="" />
              <span>
                <span className="estimate__date">August 2026</span>
                <span className="muted-13">Based on your current contribution rate.</span>
              </span>
            </div>
          </section>

          <section className="card recent">
            <p className="estimate__title">Recent Activity</p>
            <ul className="recent__list">
              {activity.map((a) => (
                <li key={a.label}>
                  <span className="dot dot--sm dot--green" />
                  <span className="recent__label">{a.label}</span>
                  <span className="recent__date">{a.date}</span>
                </li>
              ))}
            </ul>
            <a className="link" href="#activity">
              View All Activity →
            </a>
          </section>
        </div>
      </div>
    </ScorePage>
  )
}
