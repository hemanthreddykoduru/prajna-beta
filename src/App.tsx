import { useEffect, useState, type FormEvent } from 'react'
import './App.css'
import { FIVE_MINUTES, quoteAt } from './quotes'
import { isBackendConfigured } from './config'
import { signIn, AuthError } from './auth'

import campusBengaluru from './assets/campus3.png'
import campusHyderabad from './assets/campus.png'
import campusVisakhapatnam from './assets/campus2.png'

// slide order — Bengaluru leads, it's the campus that built this
const slides = [
  { src: campusBengaluru, name: 'Bengaluru Campus' },
  { src: campusHyderabad, name: 'Hyderabad Campus' },
  { src: campusVisakhapatnam, name: 'Visakhapatnam Campus' },
]

// the caption fades on the same schedule as its image
const slideStyle = (i: number) => ({
  animationDuration: `${slides.length * SLIDE_SECONDS}s`,
  animationDelay: `${-i * SLIDE_SECONDS}s`,
})

import gitamLogo from './assets/gitam-logo.png'
import quoteMark from './assets/quote.svg'
import iconTeacher from './assets/teacher.svg'
import iconMicroscope from './assets/microscope.svg'
import iconGlobal from './assets/global.svg'
import iconUser from './assets/user.svg'
import iconLock from './assets/lock.svg'
import iconEyeOff from './assets/eye-off.svg'
import iconGoogle from './assets/google.svg'

const SLIDE_SECONDS = 5

const features = [
  { icon: iconTeacher, title: 'Excellence in Education', lines: ['Empowering minds,', 'transforming lives'] },
  { icon: iconMicroscope, title: 'Research & Innovation', lines: ['Pioneering research for', 'a better tomorrow'] },
  { icon: iconGlobal, title: 'Global Impact', lines: ['Creating solutions for', 'a sustainable world'] },
]

export default function App() {
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // re-render on the 5-minute boundary so a page left open keeps rotating
  const [[quote, author], setQuote] = useState(() => quoteAt(Date.now()))
  useEffect(() => {
    const id = setInterval(() => setQuote(quoteAt(Date.now())), FIVE_MINUTES)
    return () => clearInterval(id)
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const data = new FormData(e.currentTarget)
    const username = String(data.get('username') ?? '').trim()
    const password = String(data.get('password') ?? '')

    // No backend configured (local design work): keep the original behaviour
    // of walking straight into the dashboard on bundled sample data.
    if (!isBackendConfigured) {
      window.location.assign('/dashboard')
      return
    }

    setSubmitting(true)
    try {
      await signIn(username, password)
      // Full navigation, not client-side routing: the screens derive
      // module-scope constants from the score payload, so they must be
      // imported fresh after the bootstrap in main.tsx hydrates it.
      window.location.assign('/dashboard')
    } catch (err) {
      setError(err instanceof AuthError ? err.message : 'Sign-in failed. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <div className="login">
      <aside className="brand">
        {slides.map((slide, i) => (
          <img
            className={`brand__bg${slides.length > 1 ? ' brand__bg--cycling' : ''}`}
            key={slide.src}
            src={slide.src}
            alt=""
            style={slideStyle(i)}
          />
        ))}
        <div className="brand__content">
          <img className="brand__logo" src={gitamLogo} alt="GITAM Deemed to be University" />

          <div className="brand__body">
            <div className="quote">
              <img className="quote__mark" src={quoteMark} alt="" />
              <p className="quote__text">{quote}</p>
              <p className="quote__author">— {author}</p>
            </div>

            <p className="brand__campus">
              GITAM
              <br />
              <span className="brand__campus-name">
                {slides.map((slide, i) => (
                  <span
                    className={slides.length > 1 ? 'brand__bg--cycling' : undefined}
                    key={slide.name}
                    style={slideStyle(i)}
                  >
                    {slide.name}
                  </span>
                ))}
              </span>
            </p>
          </div>

          <ul className="features">
            {features.map((f) => (
              <li className="feature" key={f.title}>
                <span className="feature__icon">
                  <img src={f.icon} alt="" />
                </span>
                <span className="feature__copy">
                  <span className="feature__title">{f.title}</span>
                  <span className="feature__desc">
                    {f.lines[0]}
                    <br />
                    {f.lines[1]}
                  </span>
                </span>
              </li>
            ))}
          </ul>

          <p className="brand__legal">© GITAM Deemed to be University. All rights reserved.</p>
        </div>
      </aside>

      <main className="panel">
        <form className="form" onSubmit={handleSubmit}>
          <header className="form__header">
            <h1>Welcome Back!</h1>
            <p>Login to access your Faculty Portal</p>
          </header>

          <div className="field">
            <label className="field__label" htmlFor="username">
              Username / Email ID
            </label>
            <div className="input">
              <img className="input__icon" src={iconUser} alt="" />
              <input id="username" name="username" type="text" placeholder="Enter your email or username" required />
            </div>
          </div>

          <div className="field">
            <div className="field__row">
              <label className="field__label" htmlFor="password">
                Password
              </label>
              <a className="field__link" href="#forgot">
                Forgot Password?
              </a>
            </div>
            <div className="input">
              <img className="input__icon" src={iconLock} alt="" />
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                className="input__toggle"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                aria-pressed={showPassword}
                onClick={() => setShowPassword((v) => !v)}
              >
                <img src={iconEyeOff} alt="" />
              </button>
            </div>
          </div>

          <label className="remember">
            <input type="checkbox" name="remember" />
            Remember me
          </label>

          {error && (
            <p className="form__error" role="alert">
              {error}
            </p>
          )}

          <button className="btn btn--primary" type="submit" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Login'}
          </button>

          <div className="divider">
            <span>OR</span>
          </div>

          <button className="btn btn--google" type="button">
            <img src={iconGoogle} alt="" />
            Continue with Google
          </button>

          <div className="help">
            <p className="help__title">Need help?</p>
            <p className="help__line">
              Contact IT Support: <a href="mailto:support@gitam.edu">support@gitam.edu</a>
            </p>
          </div>
        </form>

        <footer className="legal">
          <a href="#privacy">Privacy Policy</a>
          <span />
          <a href="#terms">Terms of Use</a>
          <span />
          <a href="#help">Help &amp; Support</a>
        </footer>
      </main>
    </div>
  )
}
