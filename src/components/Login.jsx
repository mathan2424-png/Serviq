import React, { useState } from 'react'
import { Lock, Mail, Eye, EyeOff, ChefHat, LayoutDashboard, QrCode, Navigation, UtensilsCrossed, FolderLock } from 'lucide-react'

export default function Login({ onLogin, darkMode, onToggleDarkMode, showToast }) {
  const [email, setEmail] = useState('admin@serviq.com')
  const [password, setPassword] = useState('password123')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRole, setSelectedRole] = useState('admin') // 'admin', 'superadmin', 'kitchen', 'waiter', 'customer'

  // Quick credentials mapping for the simulator ease-of-use
  const quickAccounts = [
    { role: 'admin', email: 'admin@serviq.com', label: 'Admin Terminal', icon: <LayoutDashboard style={{ width: '16px', height: '16px' }} /> },
    { role: 'superadmin', email: 'superadmin@serviq.com', label: 'Super Admin Deck', icon: <FolderLock style={{ width: '16px', height: '16px' }} /> }
  ]

  const handleQuickSelect = (acc) => {
    setSelectedRole(acc.role)
    setEmail(acc.email)
    setPassword('password123')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate authenticating for 900ms for a premium micro-interaction experience
    setTimeout(() => {
      setIsLoading(false)
      onLogin(selectedRole)
    }, 900)
  }

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: 'var(--bg-app)',
      transition: 'all var(--transition-normal)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      
      {/* Decorative background visual shapes */}
      <div style={{
        position: 'absolute',
        top: '-15%',
        right: '-10%',
        width: '50vw',
        height: '50vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 70%)',
        opacity: 0.6,
        zIndex: 1
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-10%',
        width: '60vw',
        height: '60vw',
        borderRadius: '50%',
        background: 'radial-gradient(circle, var(--primary-light) 0%, transparent 60%)',
        opacity: 0.4,
        zIndex: 1
      }}></div>

      {/* Main container splits into decorative splash left, form right */}
      <div style={{
        display: 'flex',
        flex: 1,
        zIndex: 2,
        maxWidth: '1200px',
        margin: 'auto',
        padding: '20px',
        width: '100%',
        height: '90vh',
        minHeight: '600px'
      }}>
        
        {/* Decorative Left Splash (Hidden on mobile viewports) */}
        <div style={{
          flex: 1.2,
          background: 'linear-gradient(135deg, #1e1b4b 0%, #0f0728 100%)',
          borderRadius: '24px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '40px',
          color: '#fff',
          boxShadow: 'var(--shadow-premium)',
          position: 'relative',
          overflow: 'hidden',
          marginRight: '24px'
        }} className="login-splash">
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              background: 'var(--primary)',
              color: '#fff',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem'
            }}>
              🍽️
            </div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800', margin: 0, color: '#fff' }}>QRMenu</h3>
          </div>

          {/* Core content */}
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1.25', color: '#fff', marginBottom: '16px' }}>
              The complete restaurant <br/>
              <span style={{ color: 'var(--primary)' }}>ordering lifecycle</span> in one click.
            </h1>
            <p style={{ opacity: 0.8, fontSize: '0.95rem', maxWidth: '420px', lineHeight: '1.6' }}>
              Simulate customer QR scanning, mobile app ordering, KDS ticket cooking, waiter dispatches, and premium billing settlements in real-time.
            </p>
          </div>

          {/* Footer info */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.7, fontSize: '0.8rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '20px' }}>
            <span>Powered by Serviq Engineering</span>
            <span>Version 1.2.0</span>
          </div>

          {/* Floating graphic overlay */}
          <div style={{
            position: 'absolute',
            bottom: '-40px',
            right: '-40px',
            fontSize: '10rem',
            opacity: 0.04,
            transform: 'rotate(-25deg)',
            pointerEvents: 'none'
          }}>
            🍽️
          </div>
        </div>

        {/* Right Form Card */}
        <div className="glass-card" style={{
          flex: 1,
          background: 'var(--bg-card)',
          borderRadius: '24px',
          border: '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '48px',
          boxShadow: 'var(--shadow-premium)',
          backdropFilter: 'blur(20px)'
        }}>
          
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>Terminal Entrance</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>Select an operational account or sign in with credentials.</p>
          </div>

          {/* Quick simulation accounts tab selector */}
          <div style={{ margin: '24px 0' }}>
            <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '8px', letterSpacing: '0.5px' }}>Quick Roles Simulation</span>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {quickAccounts.map(acc => (
                <button
                  type="button"
                  key={acc.role}
                  onClick={() => handleQuickSelect(acc)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: selectedRole === acc.role ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    background: selectedRole === acc.role ? 'var(--primary-light)' : 'var(--bg-app)',
                    color: selectedRole === acc.role ? 'var(--primary)' : 'var(--text-main)',
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    textAlign: 'left'
                  }}
                >
                  {acc.icon}
                  <span>{acc.label}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Email input */}
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>Operational Email</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ width: '16px', height: '16px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@restaurant.com"
                  required
                  style={{
                    paddingLeft: '38px',
                    width: '100%',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-app)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>
            </div>

            {/* Password input */}
            <div className="form-group" style={{ margin: 0 }}>
              <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '6px', display: 'block' }}>Security Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ width: '16px', height: '16px', position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  style={{
                    paddingLeft: '38px',
                    paddingRight: '38px',
                    width: '100%',
                    paddingTop: '10px',
                    paddingBottom: '10px',
                    borderRadius: '10px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-app)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', marginTop: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked style={{ accentColor: '#000' }} />
                <span>Remember this terminal</span>
              </label>
              <a href="#" onClick={(e) => { e.preventDefault(); alert('In SimStudio, passwords are simulated as password123!') }} style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Forgot?</a>
            </div>

            {/* Submit button */}
            <button 
              type="submit" 
              className="btn-black" 
              style={{ 
                marginTop: '10px', 
                padding: '12px', 
                fontSize: '0.9rem', 
                fontWeight: '700', 
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff',
                    borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite'
                  }}></div>
                  <span>Securing Simulation...</span>
                </>
              ) : (
                <span>Launch Operational Deck</span>
              )}
            </button>
          </form>

        </div>

      </div>
      
    </div>
  )
}
