import React, { useState } from 'react'
import { IndianRupee, ClipboardList, Eye, Users, RefreshCw, TrendingUp, Activity, ArrowRight } from 'lucide-react'

export default function AdminDashboard({
  orders,
  tables,
  onNavigate,
  stats,
  showToast
}) {
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount)
  }

  // Get active and total tables info
  const activeTablesCount = tables.filter(t => t.status === 'Occupied').length
  const totalTablesCount = tables.length
  const occupancyPercentage = Math.round((activeTablesCount / totalTablesCount) * 100) || 0

  // Filter to show active orders in the live feed
  const liveFeedOrders = [...orders]
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 6)

  // Status badge styling helper
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'New':
        return {
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: '#ffffff',
          boxShadow: '0 2px 4px rgba(15,23,42,0.15)'
        }
      case 'Preparing':
        return {
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          border: '1px solid var(--primary)',
          boxShadow: '0 2px 4px rgba(234,88,12,0.1)'
        }
      case 'Ready':
        return {
          background: '#d1fae5',
          color: '#065f46',
          border: '1px solid #10b981',
          boxShadow: '0 2px 4px rgba(16,185,129,0.1)'
        }
      case 'Done':
      case 'Billed':
        return {
          background: '#f1f5f9',
          color: '#64748b',
          border: '1px solid #cbd5e1'
        }
      default:
        return {
          background: '#f1f5f9',
          color: '#64748b'
        }
    }
  }

  return (
    <div className="dashboard-grid animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px', padding: '24px 30px' }}>

      {/* Left Main Section */}
      <div className="dashboard-left" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* Statistics Cards Row */}
        <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>

          {/* Card 1: Today's Revenue */}
          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #ea580c 0%, #c2410c 100%)',
            color: '#fff',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 10px 20px -5px rgba(234, 88, 12, 0.3)'
          }}>
            <div className="stat-info" style={{ zIndex: 2 }}>
              <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', opacity: 0.85, letterSpacing: '0.5px' }}>Today's Revenue</span>
              <div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0', fontFamily: 'var(--font-headings)' }}>
                {formatCurrency(stats.revenue)}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.15)', padding: '4px 8px', borderRadius: '20px', width: 'fit-content', fontSize: '0.75rem', fontWeight: '600' }}>
                <TrendingUp style={{ width: '12px', height: '12px' }} />
                <span>+12% from yesterday</span>
              </div>
            </div>
            <div style={{
              position: 'absolute',
              right: '-10px',
              bottom: '-10px',
              opacity: 0.15,
              transform: 'scale(2.5)',
              zIndex: 1
            }}>
              <IndianRupee style={{ width: '48px', height: '48px' }} />
            </div>
          </div>

          {/* Card 2: Total Orders */}
          <div className="stat-card" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div className="stat-info">
              <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Total Orders</span>
              <div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0', color: 'var(--text-main)', fontFamily: 'var(--font-headings)' }}>
                {stats.totalOrdersCount}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }}></span>
                <span>{orders.filter(o => o.status === 'Preparing').length} in progress</span>
              </div>
            </div>
            <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '12px', borderRadius: '12px', height: 'fit-content' }}>
              <ClipboardList style={{ width: '22px', height: '22px' }} />
            </div>
          </div>

          {/* Card 3: Active Tables */}
          <div className="stat-card" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)',
            gap: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', width: '100%' }}>
              <div className="stat-info">
                <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Active Tables</span>
                <div className="stat-value" style={{ fontSize: '1.4rem', fontWeight: '800', margin: '4px 0 0 0', color: 'var(--text-main)', fontFamily: 'var(--font-headings)' }}>
                  {activeTablesCount} / {totalTablesCount}
                </div>
              </div>
              <div style={{ background: '#ffffff', color: '#475569', padding: '10px', borderRadius: '12px' }}>
                <Users style={{ width: '20px', height: '20px' }} />
              </div>
            </div>
            {/* Visual Occupancy Progress Bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '4px', width: '100%' }}>
                <span>Occupancy Rate</span>
                <span>{occupancyPercentage}%</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: '#e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ width: `${occupancyPercentage}%`, height: '100%', background: 'var(--primary)', borderRadius: '10px' }}></div>
              </div>
            </div>
          </div>

          {/* Card 4: Pending Action */}
          <div className="stat-card" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div className="stat-info">
              <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>Pending Orders</span>
              <div className="stat-value" style={{ fontSize: '1.5rem', fontWeight: '800', margin: '4px 0', color: 'var(--text-main)', fontFamily: 'var(--font-headings)' }}>
                {stats.pendingOrdersCount}
              </div>
              <span className="badge badge-new" style={{ fontSize: '0.65rem', background: '#fee2e2', color: '#ef4444', fontWeight: '700', border: '1px solid #fca5a5' }}>Needs attention</span>
            </div>
            <div style={{ background: '#fef2f2', color: '#ef4444', padding: '12px', borderRadius: '12px', height: 'fit-content' }}>
              <RefreshCw style={{ width: '22px', height: '22px', animation: 'spin 12s linear infinite' }} />
            </div>
          </div>

        </div>

        {/* Live Order Feed Table Section */}
        <div className="feed-card" style={{ border: '1px solid var(--border-color)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', background: 'var(--bg-card)', overflow: 'hidden' }}>
          <div className="feed-header" style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F95E10', color: '#ffffff' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900', letterSpacing: '-0.3px', color: '#ffffff' }}>Live Order Feed</h3>
              <span style={{ fontSize: '0.8rem', opacity: 0.9, fontWeight: '500' }}>Real-time synchronization active</span>
            </div>
            <div className="live-indicator" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: '#10b981', fontWeight: '700', textTransform: 'uppercase', background: '#ffffff', padding: '4px 10px', borderRadius: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
              <div className="live-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#10b981' }}></div>
              Live Server
            </div>
          </div>

          <div className="table-wrapper" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '16px',
            padding: '24px'
          }}>
            {liveFeedOrders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontSize: '0.9rem', width: '100%' }}>
                No active orders at the moment. Seating customers to start ordering!
              </div>
            ) : (
              liveFeedOrders.map((order) => (
                <div
                  key={order.id}
                  style={{
                    width: '100%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '12px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '12px',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.05)';
                    e.currentTarget.style.borderColor = 'var(--primary)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    e.currentTarget.style.borderColor = 'var(--border-color)';
                  }}
                >
                  {/* Subtle top indicator bar representing status */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: getStatusBadgeStyle(order.status).color || 'var(--primary)'
                  }} />

                  {/* Header: Order ID & Table */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                    <span style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.95rem' }}>
                      {order.id}
                    </span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '700',
                      background: 'var(--primary-light)',
                      color: 'var(--primary)',
                      padding: '4px 10px',
                      borderRadius: '20px'
                    }}>
                      {order.table}
                    </span>
                  </div>

                  {/* Items List */}
                  <div style={{ flex: 1, minHeight: '70px', display: 'flex', flexDirection: 'column', gap: '8px', padding: '4px 0' }}>
                    <span style={{ fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
                      Ordered Items
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {order.items.map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{item.name}</span>
                          <span style={{ fontWeight: '700', color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                            × {item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Divider line */}
                  <div style={{ borderTop: '1px solid var(--border-color)', margin: '2px 0' }}></div>

                  {/* Footer: Time & Status */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                      {order.time}
                    </span>
                    <span
                      style={{
                        display: 'inline-block',
                        padding: '6px 14px',
                        borderRadius: '30px',
                        fontSize: '0.7rem',
                        fontWeight: '700',
                        textAlign: 'center',
                        ...getStatusBadgeStyle(order.status)
                      }}
                    >
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Charts Row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '24px' }}>

          {/* Card 1: Sales By Category */}
          <div className="feed-card" style={{ border: '1px solid var(--border-color)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', background: 'var(--bg-card)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.8px' }}>Sales by Category</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '4px' }}>
              {[
                { name: 'Mains', percentage: 72, color: '#e26a09' },
                { name: 'Starters', percentage: 58, color: '#0f4c81' },
                { name: 'Drinks', percentage: 34, color: '#7c3aed' },
                { name: 'Desserts', percentage: 21, color: '#0d7a5c' }
              ].map((cat, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '80px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'right' }}>{cat.name}</span>
                  <div style={{ flex: 1, height: '8px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${cat.percentage}%`, height: '100%', background: cat.color, borderRadius: '10px' }}></div>
                  </div>
                  <span style={{ width: '40px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', textAlign: 'left' }}>{cat.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Order Status Overview */}
          <div className="feed-card" style={{ border: '1px solid var(--border-color)', borderRadius: '16px', boxShadow: 'var(--shadow-sm)', background: 'var(--bg-card)', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.8px' }}>Order Status Overview</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '4px' }}>
              {[
                { name: 'Paid', percentage: 60, color: '#0d7a5c' },
                { name: 'Delivered', percentage: 15, color: '#e26a09' },
                { name: 'Preparing', percentage: 12, color: '#0f4c81' },
                { name: 'Pending', percentage: 8, color: '#b45309' },
                { name: 'Cancelled', percentage: 5, color: '#dc2626' }
              ].map((status, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ width: '80px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-muted)', textAlign: 'right' }}>{status.name}</span>
                  <div style={{ flex: 1, height: '8px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${status.percentage}%`, height: '100%', background: status.color, borderRadius: '10px' }}></div>
                  </div>
                  <span style={{ width: '40px', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-main)', textAlign: 'left' }}>{status.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  )
}
