import React from 'react'
import { ChefHat, Play, CheckCircle } from 'lucide-react'

export default function KitchenDisplay({ orders, onUpdateStatus }) {
  // Filter active kitchen orders: either 'New' or 'Preparing'
  const kitchenOrders = orders.filter(o => o.status === 'New' || o.status === 'Preparing')

  // Helper to calculate time elapsed in minutes
  const getMinutesElapsed = (timestamp) => {
    const elapsedMs = new Date() - new Date(timestamp)
    const minutes = Math.floor(elapsedMs / 60000)
    return minutes <= 0 ? 'Just now' : `${minutes} min ago`
  }

  return (
    <div className="kds-container animate-fade-in">
      <div className="kds-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <ChefHat style={{ width: '32px', height: '32px', color: 'var(--primary)' }} />
          <h2>Kitchen Display System (KDS)</h2>
        </div>
        <div className="kds-stats">
          <div className="kds-stat-item">
            New Orders: <span>{orders.filter(o => o.status === 'New').length}</span>
          </div>
          <div className="kds-stat-item">
            In Progress: <span>{orders.filter(o => o.status === 'Preparing').length}</span>
          </div>
        </div>
      </div>

      {kitchenOrders.length === 0 ? (
        <div className="glass-card" style={{ padding: '80px 20px', textAlign: 'center', color: 'var(--text-muted)', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
          <ChefHat style={{ width: '64px', height: '64px', color: 'var(--text-light)', marginBottom: '16px' }} />
          <h3>Kitchen is Clear!</h3>
          <p style={{ fontSize: '0.95rem', marginTop: '6px' }}>There are no active orders waiting to be prepared.</p>
        </div>
      ) : (
        <div className="kds-grid">
          {kitchenOrders.map(order => (
            <div key={order.id} className={`kds-card ${order.status.toLowerCase()}`}>
              <div className="kds-card-header">
                <h4>{order.table}</h4>
                <span className="kds-time-elapsed">{getMinutesElapsed(order.timestamp)}</span>
              </div>
              <div className="kds-card-body">
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                  ORDER ID: {order.id}
                </div>
                
                <ul className="kds-items-list">
                  {order.items.map((item, index) => (
                    <li key={index} className="kds-item">
                      <span>{item.name}</span>
                      <span className="kds-item-qty">×{item.quantity}</span>
                    </li>
                  ))}
                </ul>

                {order.note && (
                  <div className="kds-note">
                    <strong>Note:</strong> {order.note}
                  </div>
                )}
              </div>
              <div className="kds-actions">
                {order.status === 'New' ? (
                  <button 
                    className="btn-black"
                    onClick={() => onUpdateStatus(order.id, 'Preparing')}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <Play style={{ width: '16px', height: '16px' }} />
                    Start Cooking
                  </button>
                ) : (
                  <button 
                    className="btn-black"
                    onClick={() => onUpdateStatus(order.id, 'Ready')}
                    style={{ background: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <CheckCircle style={{ width: '16px', height: '16px' }} />
                    Mark Ready
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
