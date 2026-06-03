import React from 'react'
import { Navigation, Bell, CheckCircle, Clock } from 'lucide-react'

export default function WaiterApp({ orders, onUpdateStatus }) {
  // Filter orders that are ready to be served
  const readyOrders = orders.filter(o => o.status === 'Ready')

  // Helper to calculate time elapsed in minutes
  const getMinutesElapsed = (timestamp) => {
    if (!timestamp) return 'Just now'
    const elapsedMs = new Date() - new Date(timestamp)
    const minutes = Math.floor(elapsedMs / 60000)
    return minutes <= 0 ? 'Just now' : `${minutes} min ago`
  }

  return (
    <div className="kds-container animate-fade-in" style={{ padding: '24px 30px' }}>
      {/* Top Header Panel */}
      <div className="kds-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Navigation style={{ width: '32px', height: '32px', color: 'var(--primary)', transform: 'rotate(45deg)' }} />
          <div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: '800', fontFamily: 'var(--font-headings)' }}>Waiter Dashboard</h2>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>Operational view for table service & dish delivery</p>
          </div>
        </div>
        
        <div className="kds-stats">
          <div className="kds-stat-item">
            Ready to Deliver: <span style={{ color: 'var(--primary)' }}>{readyOrders.length}</span>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-color)', paddingLeft: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }}></div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>Active:</span>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '700' }}>Waiter #1 (Floor A)</span>
          </div>
        </div>
      </div>

      {/* Main Delivery Queue Grid */}
      {readyOrders.length === 0 ? (
        <div className="glass-card animate-fade-in" style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '350px' }}>
          <CheckCircle style={{ width: '64px', height: '64px', color: '#10b981', marginBottom: '16px' }} />
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>All Served!</h3>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '6px', maxWidth: '400px' }}>
            There are no orders waiting to be served. Sit back or check the KDS for upcoming dishes.
          </p>
        </div>
      ) : (
        <div className="kds-grid animate-fade-in">
          {readyOrders.map(order => (
            <div key={order.id} className="kds-card" style={{ borderColor: 'var(--primary)', borderWidth: '2px' }}>
              
              {/* Card Header */}
              <div className="kds-card-header" style={{ background: 'var(--primary-light)', borderBottom: '1px solid var(--border-color)' }}>
                <h4 style={{ color: 'hsl(var(--primary-hue), 95%, 25%)', fontWeight: '800', fontSize: '1rem' }}>{order.table}</h4>
                <span className="kds-time-elapsed" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                  <Clock style={{ width: '12px', height: '12px' }} />
                  {getMinutesElapsed(order.timestamp)}
                </span>
              </div>

              {/* Card Body */}
              <div className="kds-card-body">
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <span>ORDER ID: {order.id}</span>
                  <span style={{ color: 'var(--primary)', fontWeight: '850' }}>READY FOR SERVICE</span>
                </div>
                
                <ul className="kds-items-list" style={{ marginTop: '10px' }}>
                  {order.items.map((item, index) => (
                    <li key={index} className="kds-item">
                      <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{item.name}</span>
                      <span className="kds-item-qty" style={{ background: 'var(--primary-light)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '800' }}>×{item.quantity}</span>
                    </li>
                  ))}
                </ul>

                {order.note && (
                  <div className="kds-note" style={{ marginTop: '12px' }}>
                    <strong>Note:</strong> {order.note}
                  </div>
                )}
              </div>
              
              {/* Card Action Button */}
              <div className="kds-actions" style={{ padding: '16px', background: 'var(--bg-app)', borderTop: '1px solid var(--border-color)' }}>
                <button 
                  className="waiter-btn"
                  onClick={() => onUpdateStatus(order.id, 'Done')}
                  style={{ 
                    width: '100%', 
                    background: '#10b981', 
                    color: '#fff', 
                    border: 'none', 
                    padding: '12px', 
                    borderRadius: 'var(--radius-sm)', 
                    fontWeight: '700', 
                    fontSize: '0.9rem', 
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'opacity var(--transition-fast)'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                >
                  <CheckCircle style={{ width: '18px', height: '18px' }} />
                  Mark as Delivered
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}

