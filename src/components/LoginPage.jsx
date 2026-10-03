import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/codlix-logo.png'
import MoltenMetal from './MoltenMetal.jsx'
import { useAuth } from '../auth/AuthContext.jsx'
import './LoginPage.css'

function landingPathFor(role) {
  return role === 'social-media-manager' ? '/marketing/social' : '/dashboard'
}

function LoginPage() {
  const navigate = useNavigate()
  const { user, login } = useAuth()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (user) navigate(landingPathFor(user.role), { replace: true })
  }, [user, navigate])

  async function handleSubmit(e) {
    e.preventDefault()

    const nextErrors = {}
    if (!username.trim()) nextErrors.username = 'Username is required.'
    if (!password) nextErrors.password = 'Password is required.'
    else if (password.length < 6)
      nextErrors.password = 'Password must be at least 6 characters.'

    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    setLoading(true)
    const result = await login(username.trim(), password)
    setLoading(false)
    if (!result.ok) {
      setErrors({ form: result.error })
      return
    }
    navigate(landingPathFor(result.user.role))
  }

  return (
    <div className="login-page">
      <div className="login-page__bg">
        <MoltenMetal
          color1="#140b33"
          color2="#6448F4"
          color3="#c9bdff"
          speed={0.22}
          scale={5.5}
          detail={4}
          glow={2.1}
          coreSize={0.16}
          swirl={0.6}
          fold={-0.32}
          blackPoint={0.08}
          brightness={1.15}
          colorMode="molten"
          grain={true}
          grainIntensity={0.035}
          mouseInteraction={true}
          mouseStrength={0.25}
          opacity={0.9}
        />
      </div>
      <div className="login-page__vignette" />

      <div className="login-page__content">
        <form className="login-card" onSubmit={handleSubmit} noValidate>
          <div className="login-card__brand">
            <div className="login-card__logo-ring">
              <img src={logo} alt="Codlix Technologies" className="login-card__logo" />
            </div>
            <span className="login-card__brand-name">Codlix Technologies</span>
          </div>

          <div className="login-card__head">
            <h1>Welcome back</h1>
            <p>Sign in to your CRM workspace to continue.</p>
          </div>

          <div className="login-field">
            <label htmlFor="username">Username</label>
            <div className="login-field__control">
              <svg className="login-field__icon" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
                <path d="M4.5 19.5c1.4-3.2 4.2-5 7.5-5s6.1 1.8 7.5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
              />
            </div>
            {errors.username && <span className="login-field__error">{errors.username}</span>}
          </div>

          <div className="login-field">
            <label htmlFor="password">Password</label>
            <div className="login-field__control">
              <svg className="login-field__icon" viewBox="0 0 24 24" fill="none">
                <rect x="4.5" y="10.5" width="15" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <path d="M7.5 10.5V7.75a4.5 4.5 0 0 1 9 0V10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="login-field__toggle"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M3 3l18 18M10.6 10.6a3 3 0 0 0 4.24 4.24M6.6 6.6C4.5 8 3 12 3 12s3.6 7 9 7c1.6 0 3-.5 4.2-1.2M9.9 4.6A9.4 9.4 0 0 1 12 4.5c5.4 0 9 6.5 9 6.5a15 15 0 0 1-2.6 3.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none">
                    <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <span className="login-field__error">{errors.password}</span>}
          </div>

          <label className="checkbox">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            <span className="checkbox__box" />
            Remember me
          </label>

          {errors.form && <span className="login-field__error">{errors.form}</span>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <span className="btn-primary__spinner" /> : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
