import React, { useState, useRef } from 'react'
import { Eye, EyeOff, LayoutDashboard, FolderLock } from 'lucide-react'

export default function Login({ onLogin, darkMode, onToggleDarkMode, showToast }) {
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState(['', '', '', ''])
  const [showPin, setShowPin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState('admin')

  const pinRefs = [useRef(null), useRef(null), useRef(null), useRef(null)]

  const quickAccounts = [
    { role: 'admin', label: 'Admin', icon: <LayoutDashboard style={{ width: '14px', height: '14px' }} /> },
    { role: 'superadmin', label: 'Super Admin', icon: <FolderLock style={{ width: '14px', height: '14px' }} /> }
  ]

  const handlePinChange = (index, value) => {
    const cleaned = value.replace(/\D/g, '').slice(-1)
    const newPin = [...pin]
    newPin[index] = cleaned
    setPin(newPin)
    if (cleaned && index < 3) {
      pinRefs[index + 1].current?.focus()
    }
  }

  const handlePinKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      pinRefs[index - 1].current?.focus()
    }
  }

  const handlePinPaste = (e) => {
    const text = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (text.length === 4) {
      setPin(text.split(''))
      pinRefs[3].current?.focus()
    }
    e.preventDefault()
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      onLogin(selectedRole)
    }, 900)
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: "'Inter', system-ui, sans-serif"
    }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes floatUp {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }

        .login-bg-layer {
          position: absolute;
          inset: 0;
          background-image: url('/login-bg.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          filter: brightness(0.35) saturate(1.2);
          z-index: 0;
        }

        .login-bg-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #ea580c 0%, #c2410c 50%, #9a3412 100%);
          opacity: 0.72;
          z-index: 1;
        }

        .login-card {
          position: relative;
          z-index: 2;
          background: #ffffff;
          border-radius: 24px;
          padding: 28px 36px 24px;
          width: 100%;
          max-width: 420px;
          box-shadow: 0 32px 80px rgba(0,0,0,0.35), 0 8px 24px rgba(0,0,0,0.2);
         
          overflow: hidden;
        }

        .login-logo-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 14px;
        }

        .login-logo-icon {
          width: 42px;
          height: 42px;
          background: linear-gradient(135deg, #ea580c, #c2410c);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.3rem;
          box-shadow: 0 4px 14px rgba(234, 88, 12, 0.4);
        }

        .login-logo-text {
          font-size: 1.8rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ea580c, #c2410c);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
          font-family: 'Outfit', 'Inter', sans-serif;
        }

        .login-title {
          text-align: center;
          font-size: 1.5rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px 0;
          font-family: 'Outfit', 'Inter', sans-serif;
        }

        .login-subtitle {
          text-align: center;
          font-size: 0.82rem;
          color: #64748b;
          margin: 0 0 16px 0;
          font-weight: 500;
        }

        .role-switcher {
          display: flex;
          background: #f1f5f9;
          border-radius: 12px;
          padding: 4px;
          gap: 4px;
          margin-bottom: 16px;
        }

        .role-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 9px 12px;
          border-radius: 9px;
          border: none;
          font-size: 0.78rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          background: transparent;
          color: #64748b;
        }

        .role-btn.active {
          background: #ffffff;
          color: #ea580c;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }

        .login-label {
          display: block;
          font-size: 0.78rem;
          font-weight: 700;
          color: #374151;
          margin-bottom: 7px;
          letter-spacing: 0.3px;
        }

        .phone-input-wrap {
          position: relative;
          margin-bottom: 14px;
        }

        .phone-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #94a3b8;
          font-size: 1rem;
          pointer-events: none;
        }

        .phone-input {
          width: 100%;
          padding: 10px 14px 10px 42px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          font-size: 0.88rem;
          color: #0f172a;
          background: #f8fafc;
          outline: none;
          box-sizing: border-box;
          font-weight: 500;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .phone-input:focus {
          border-color: #ea580c;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.12);
          background: #fff;
        }

        .phone-input::placeholder {
          color: #94a3b8;
          font-weight: 400;
        }

        .pin-label-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .pin-boxes {
          display: flex;
          gap: 10px;
          margin-bottom: 6px;
          width: 100%;
        }

        .pin-box {
          flex: 1;
          min-width: 0;
          height: 46px;
          border: 1.5px solid #e2e8f0;
          border-radius: 12px;
          background: #f8fafc;
          text-align: center;
          font-size: 1.25rem;
          font-weight: 700;
          color: #0f172a;
          outline: none;
          box-sizing: border-box;
          transition: border-color 0.2s, box-shadow 0.2s;
          caret-color: #ea580c;
        }

        .pin-box:focus {
          border-color: #ea580c;
          box-shadow: 0 0 0 3px rgba(234, 88, 12, 0.12);
          background: #fff;
        }

        .pin-box.filled {
          border-color: #ea580c;
          background: rgba(234, 88, 12, 0.05);
        }

        .eye-toggle {
          background: none;
          border: none;
          cursor: pointer;
          color: #94a3b8;
          padding: 4px;
          display: flex;
          align-items: center;
          transition: color 0.2s;
          border-radius: 6px;
        }

        .eye-toggle:hover {
          color: #ea580c;
        }

        .forgot-pin {
          display: block;
          text-align: right;
          font-size: 0.82rem;
          font-weight: 700;
          color: #ea580c;
          text-decoration: none;
          margin-bottom: 16px;
          margin-top: 4px;
          transition: opacity 0.2s;
        }

        .forgot-pin:hover {
          opacity: 0.75;
        }

        .sign-in-btn {
          width: 100%;
          padding: 12px;
          background: linear-gradient(135deg, #ea580c 0%, #c2410c 100%);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          letter-spacing: 0.3px;
          box-shadow: 0 4px 16px rgba(234, 88, 12, 0.4);
          font-family: 'Outfit', 'Inter', sans-serif;
        }

        .sign-in-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(234, 88, 12, 0.5);
        }

        .sign-in-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .sign-in-btn:disabled {
          opacity: 0.8;
          cursor: not-allowed;
        }

        .spin-icon {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255,255,255,0.35);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.65s linear infinite;
        }

        .card-footer-note {
          text-align: center;
          margin-top: 12px;
          font-size: 0.72rem;
          color: #94a3b8;
          font-weight: 500;
        }

        .card-footer-note strong {
          color: #64748b;
        }

        /* Floating food emojis in background */
        .bg-emoji {
          position: absolute;
          font-size: 2.5rem;
          opacity: 0.12;
          z-index: 1;
          pointer-events: none;
          animation: floatUp 4s ease-in-out infinite;
        }
      `}</style>

      {/* Background layers */}
      <div className="login-bg-layer" />
      <div className="login-bg-overlay" />

      {/* Floating decorative emojis */}
      <span className="bg-emoji" style={{ top: '8%', left: '6%', animationDelay: '0s' }}>🍽️</span>
      <span className="bg-emoji" style={{ top: '20%', right: '8%', animationDelay: '1.5s', fontSize: '2rem' }}>🍜</span>
      <span className="bg-emoji" style={{ bottom: '15%', left: '10%', animationDelay: '0.8s', fontSize: '2rem' }}>🥘</span>
      <span className="bg-emoji" style={{ bottom: '25%', right: '6%', animationDelay: '2s', fontSize: '3rem' }}>🍛</span>
      <span className="bg-emoji" style={{ top: '50%', left: '3%', animationDelay: '1s', fontSize: '1.8rem' }}>🥗</span>
      <span className="bg-emoji" style={{ top: '35%', right: '3%', animationDelay: '2.5s', fontSize: '1.6rem' }}>☕</span>

      {/* Login Card */}
      <div className="login-card">
        
        {/* Logo */}
        <div className="login-logo-wrap">
          <div className="login-logo-icon">🍽️</div>
          <span className="login-logo-text">Serviq</span>
        </div>

        {/* Title */}
        <h2 className="login-title">Sign In</h2>
        <p className="login-subtitle">Enter your credentials to access the dashboard</p>

        {/* Role Switcher */}
        <div className="role-switcher">
          {quickAccounts.map(acc => (
            <button
              key={acc.role}
              type="button"
              className={`role-btn ${selectedRole === acc.role ? 'active' : ''}`}
              onClick={() => setSelectedRole(acc.role)}
            >
              {acc.icon}
              {acc.label}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit}>

          {/* Phone Number */}
          <label className="login-label">Phone Number</label>
          <div className="phone-input-wrap">
            <span className="phone-icon">📞</span>
            <input
              type="tel"
              className="phone-input"
              placeholder="Enter Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={10}
            />
          </div>

          {/* PIN */}
          <div className="pin-label-row">
            <label className="login-label" style={{ margin: 0 }}>PIN</label>
            <button type="button" className="eye-toggle" onClick={() => setShowPin(!showPin)}>
              {showPin
                ? <EyeOff style={{ width: '18px', height: '18px' }} />
                : <Eye style={{ width: '18px', height: '18px' }} />
              }
            </button>
          </div>

          <div className="pin-boxes">
            {pin.map((digit, i) => (
              <input
                key={i}
                ref={pinRefs[i]}
                type={showPin ? 'text' : 'password'}
                className={`pin-box ${digit ? 'filled' : ''}`}
                maxLength={1}
                value={digit}
                onChange={(e) => handlePinChange(i, e.target.value)}
                onKeyDown={(e) => handlePinKeyDown(i, e)}
                onPaste={i === 0 ? handlePinPaste : undefined}
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
              />
            ))}
          </div>

          <a
            href="#"
            className="forgot-pin"
            onClick={(e) => {
              e.preventDefault()
              alert('Default PIN is 1234 for simulation mode.')
            }}
          >
            Forgot PIN?
          </a>

          {/* Sign In Button */}
          <button type="submit" className="sign-in-btn" disabled={isLoading}>
            {isLoading ? (
              <>
                <div className="spin-icon" />
                <span>Signing in...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <p className="card-footer-note">
          Simulation mode · <strong>PIN: 1234</strong> · Powered by Serviq
        </p>
      </div>
    </div>
  )
}
