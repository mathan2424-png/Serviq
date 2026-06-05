import React, { useState } from 'react'
import { Plus, Edit2, Trash2, Eye, QrCode, ArrowLeft, Printer, List, Map } from 'lucide-react'

export default function TableManagement({
  tables,
  orders,
  onAddTable,
  onUpdateTable,
  onDeleteTable,
  showToast,
  staffMembers = []
}) {
  const [activeTab, setActiveTab] = useState('list') // 'list' or 'map'
  const [editingTableId, setEditingTableId] = useState(null) // 'new' or table.id
  const [viewingTable, setViewingTable] = useState(null) // table object

  const [formState, setFormState] = useState({
    id: '',
    name: '',
    seats: 4,
    status: 'Available',
    waiter: ''
  })

  // Table Status options
  const statusOptions = ['Available', 'Occupied', 'Cleaning']

  // Find active order & waiter for a table
  const getActiveOrderInfo = (tableId) => {
    const activeOrder = orders.find(o =>
      (o.table === tableId || o.table === `Table ${tableId.replace('T-', '')}`) &&
      o.status !== 'Billed' &&
      o.status !== 'Done' &&
      o.status !== 'Paid'
    )
    return activeOrder ? { id: activeOrder.id, waiter: activeOrder.waiter } : null
  }

  // Open inline view for add
  const handleAddNewClick = () => {
    setEditingTableId('new')
    setViewingTable(null)
    setFormState({
      id: `T-0${tables.length + 1}`,
      name: `Table 0${tables.length + 1}`,
      seats: 4,
      status: 'Available',
      waiter: ''
    })
  }

  // Open inline view for edit
  const handleEditClick = (table) => {
    setEditingTableId(table.id)
    setViewingTable(null)
    setFormState({
      id: table.id,
      name: table.name,
      seats: table.seats,
      status: table.status === 'Free' ? 'Available' : table.status,
      waiter: table.waiter || ''
    })
  }

  // Open inline view for details
  const handleViewClick = (table) => {
    setViewingTable(table)
    setEditingTableId(null)
  }

  // Save table form
  const handleSaveTable = (e) => {
    e.preventDefault()
    if (!formState.id.trim() || !formState.name.trim()) {
      showToast('error', 'Table ID and Name are required.')
      return
    }

    const dbStatus = formState.status === 'Available' ? 'Free' : formState.status

    if (editingTableId === 'new') {
      const exists = tables.some(t => t.id.toLowerCase() === formState.id.trim().toLowerCase())
      if (exists) {
        showToast('error', `Table with ID ${formState.id} already exists.`)
        return
      }
      onAddTable({
        id: formState.id.trim(),
        name: formState.name.trim(),
        seats: parseInt(formState.seats) || 4,
        status: dbStatus,
        waiter: formState.waiter
      })
      showToast('success', `Table ${formState.name} registered successfully!`)
    } else {
      const tableToUpdate = tables.find(t => t.id === editingTableId)
      onUpdateTable(editingTableId, {
        ...tableToUpdate,
        id: formState.id.trim(),
        name: formState.name.trim(),
        seats: parseInt(formState.seats) || 4,
        status: dbStatus,
        waiter: formState.waiter
      })
      showToast('success', `Table ${formState.name} updated successfully!`)
    }

    setEditingTableId(null)
  }

  // Render Status Badge
  const renderStatusBadge = (status) => {
    let style = {}
    let text = status === 'Free' ? 'Available' : status

    if (text === 'Available') {
      style = { color: '#10b981', background: '#d1fae5', border: '1px solid #a7f3d0' }
    } else if (text === 'Occupied') {
      style = { color: '#d97706', background: '#fef3c7', border: '1px solid #fde68a' }
    } else {
      style = { color: '#ef4444', background: '#fee2e2', border: '1px solid #fca5a5' }
    }

    return (
      <span style={{
        display: 'inline-block',
        padding: '4px 10px',
        borderRadius: '30px',
        fontSize: '0.75rem',
        fontWeight: '700',
        textTransform: 'capitalize',
        textAlign: 'center',
        ...style
      }}>
        {text}
      </span>
    )
  }

  return (
    <>
      {/* Styles Block */}
      <style dangerouslySetInnerHTML={{
        __html: `
        .tables-sub-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 0px;
          margin-bottom: 24px;
        }

        .view-toggle-container {
          display: inline-flex;
          background: #e2e8f0;
          padding: 4px;
          border-radius: 12px;
          gap: 4px;
        }

        .dark-mode .view-toggle-container {
          background: #1e293b;
        }

        .view-toggle-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          border: none;
          background: transparent;
          color: var(--text-muted);
          padding: 8px 16px;
          font-size: 0.9rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          border-radius: 8px;
        }

        .view-toggle-btn.active {
          background: var(--bg-card);
          color: var(--primary);
          box-shadow: var(--shadow-sm);
          font-weight: 700;
        }

        .tables-table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        .tables-table th {
          padding: 14px 18px;
          background: var(--bg-app);
          color: var(--text-muted);
          font-size: 0.75rem;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border-bottom: 1px solid var(--border-color);
        }

        .tables-table td {
          padding: 14px 18px;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.9rem;
          color: var(--text-main);
          vertical-align: middle;
        }

        .tables-table tr:last-child td {
          border-bottom: none;
        }

        .tables-table tr:hover {
          background-color: rgba(0, 0, 0, 0.005);
        }

        .tables-action-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          color: var(--text-light);
          transition: color 0.15s;
          border-radius: 6px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }

        .tables-action-btn:hover {
          color: var(--text-main);
          background: var(--bg-app);
        }

        .tables-action-btn.delete:hover {
          color: #ef4444;
          background: #fee2e2;
        }

        /* Live Map Styles */
        .live-map-grid {
          display: flex;
          flex-direction: column;
          gap: 28px;
        }

        .zone-section {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 16px;
          padding: 20px 24px;
          box-shadow: var(--shadow-sm);
        }

        .zone-header {
          font-size: 1rem;
          font-weight: 800;
          margin-bottom: 16px;
          color: var(--text-main);
          display: flex;
          align-items: center;
          gap: 8px;
          border-bottom: 1px dashed var(--border-color);
          padding-bottom: 8px;
        }

        .zone-tables-layout {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 16px;
        }

        .map-table-card {
          border-radius: 12px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease-in-out;
          position: relative;
          box-shadow: var(--shadow-sm);
        }

        .map-table-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .map-table-id {
          font-size: 1.15rem;
          font-weight: 850;
          margin-bottom: 4px;
        }

        .map-table-seats {
          font-size: 0.72rem;
          font-weight: 700;
          opacity: 0.8;
          text-transform: uppercase;
        }

        .map-table-waiter {
          font-size: 0.78rem;
          font-weight: 600;
          margin-top: 6px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 100%;
        }

        .qr-print-box {
          border: 1.5px dashed var(--border-color);
          border-radius: 16px;
          background: #ffffff;
          padding: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          box-shadow: var(--shadow-sm);
        }

        @media print {
          body * {
            visibility: hidden;
          }
          #printable-qr-code,
          #printable-qr-code * {
            visibility: visible;
          }
          #printable-qr-code {
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) scale(1.4);
            border: 1px solid #cbd5e1 !important;
            border-radius: 16px !important;
            background: #ffffff !important;
            padding: 24px !important;
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            gap: 16px !important;
            box-shadow: none !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      ` }} />

      <div className="menu-workspace-grid" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '24px 30px' }}>

        {/* Navigation Breadcrumbs for Inline views */}
        {editingTableId ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <button
              onClick={() => setEditingTableId(null)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                borderRadius: '50%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                transition: 'all 0.2s',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <ArrowLeft style={{ width: '16px', height: '16px' }} />
            </button>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Tables Registry</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                {editingTableId === 'new' ? 'Register New Table Profile' : `Update Table ${editingTableId} Details`}
              </h2>
            </div>
          </div>
        ) : viewingTable ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <button
              onClick={() => setViewingTable(null)}
              style={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '8px',
                borderRadius: '50%',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-main)',
                transition: 'all 0.2s',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <ArrowLeft style={{ width: '16px', height: '16px' }} />
            </button>
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Tables Registry</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Table Showcase & QR Profile
              </h2>
            </div>
          </div>
        ) : null}

        {/* Dynamic Inline Content Render */}
        {editingTableId ? (
          /* Inline Add/Edit Form page */
          <div className="glass-card animate-fade-in" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: 'var(--shadow-md)',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <form onSubmit={handleSaveTable} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Table ID</label>
                  <input
                    type="text"
                    value={formState.id}
                    onChange={(e) => setFormState({ ...formState, id: e.target.value })}
                    disabled={editingTableId !== 'new'}
                    placeholder="e.g. T-08"
                    required
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', background: editingTableId !== 'new' ? '#f8fafc' : 'var(--bg-card)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Display Name</label>
                  <input
                    type="text"
                    value={formState.name}
                    onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                    placeholder="e.g. Table 08"
                    required
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Seats Count</label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formState.seats}
                    onChange={(e) => setFormState({ ...formState, seats: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none' }}
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Status Override</label>
                  <select
                    value={formState.status}
                    onChange={(e) => setFormState({ ...formState, status: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none' }}
                  >
                    {statusOptions.map(o => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Assign Waiter</label>
                  <select
                    value={formState.waiter}
                    onChange={(e) => setFormState({ ...formState, waiter: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', background: 'var(--bg-card)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none' }}
                  >
                    <option value="">Unassigned</option>
                    {staffMembers.filter(s => s.role === 'waiter').map(w => (
                      <option key={w.id} value={w.name}>{w.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="menu-form-actions" style={{ display: 'flex', flexDirection: 'row', gap: '16px', marginTop: '24px', maxWidth: '400px' }}>
                <button type="submit" className="btn-black" style={{ flex: 1, padding: '12px', fontWeight: '700', borderRadius: '8px', cursor: 'pointer' }}>
                  {editingTableId === 'new' ? 'Register Table' : 'Save Changes'}
                </button>
                <button type="button" className="btn-outline" onClick={() => setEditingTableId(null)} style={{ flex: 1, padding: '12px', fontWeight: '700', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        ) : viewingTable ? (
          /* Inline View Showcase & QR code page */
          <div className="glass-card animate-fade-in" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: 'var(--shadow-md)',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '36px' }}>

              {/* Left Column: Table Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', margin: 0 }}>Terminal Connection Profile</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Display Name</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '700' }}>{viewingTable.name}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Seating Capacity</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '700' }}>{viewingTable.seats} seats</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Current Status</span>
                    <span>{renderStatusBadge(viewingTable.status)}</span>
                  </div>
                </div>

                {/* Active Order Details */}
                {(() => {
                  const orderInfo = getActiveOrderInfo(viewingTable.id)
                  if (orderInfo) {
                    return (
                      <div style={{ background: 'var(--bg-app)', border: '1px solid var(--border-color)', padding: '18px', borderRadius: '12px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ fontSize: '0.72rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>Active Table Session</div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Order ID:</span>
                          <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--text-main)' }}>{orderInfo.id}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                          <span style={{ color: 'var(--text-muted)', fontWeight: '500' }}>Assigned Waiter:</span>
                          <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{orderInfo.waiter}</span>
                        </div>
                      </div>
                    )
                  } else {
                    return (
                      <div style={{ padding: '14px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem', border: '1px dashed var(--border-color)', borderRadius: '12px' }}>
                        No active dining session at the moment.
                      </div>
                    )
                  }
                })()}

                <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
                  <button
                    className="btn-black"
                    style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
                    onClick={() => setViewingTable(null)}
                  >
                    Back to Registry
                  </button>
                </div>
              </div>

              {/* Right Column: QR Code Generation */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div className="qr-print-box" id="printable-qr-code">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center', borderBottom: '1.5px solid var(--border-color)', width: '100%', paddingBottom: '12px' }}>
                    <div style={{ background: 'var(--primary)', color: '#fff', width: '28px', height: '28px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🍽️</div>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.5px' }}>Serviq</span>
                  </div>

                  <div style={{ fontSize: '0.9rem', fontWeight: '800', color: '#1e293b', textAlign: 'center', marginTop: '4px' }}>
                    Scan to View Menu & Order
                  </div>

                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.02)' }}>
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`http://localhost:5173/?table=${viewingTable.id}`)}`}
                      alt={`Table ${viewingTable.id} QR Code`}
                      style={{ width: '150px', height: '150px', display: 'block' }}
                    />
                  </div>

                  <div style={{ textAlign: 'center' }}>
                    <span style={{ fontSize: '1.2rem', fontWeight: '850', color: '#0f172a', letterSpacing: '-0.5px' }}>
                      {viewingTable.name}
                    </span>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', fontWeight: '600' }}>
                      {viewingTable.seats} Seats
                    </p>
                  </div>
                </div>

                <button
                  className="btn-outline"
                  onClick={() => {
                    window.print();
                  }}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '16px', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
                >
                  <Printer style={{ width: '16px', height: '16px' }} />
                  Print QR code
                </button>
              </div>

            </div>
          </div>
        ) : (
          /* Normal List View or Map View */
          <>
            {/* Header selection section */}
            <div className="tables-sub-header">
              <div className="view-toggle-container">
                <button
                  onClick={() => setActiveTab('list')}
                  className={`view-toggle-btn ${activeTab === 'list' ? 'active' : ''}`}
                >
                  <List style={{ width: '16px', height: '16px' }} />
                  List View
                </button>
                <button
                  onClick={() => setActiveTab('map')}
                  className={`view-toggle-btn ${activeTab === 'map' ? 'active' : ''}`}
                >
                  <Map style={{ width: '16px', height: '16px' }} />
                  Live Map
                </button>
              </div>

              <button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  whiteSpace: 'nowrap',
                  borderRadius: '10px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  background: '#000000',
                  color: '#ffffff',
                  fontWeight: '700',
                  border: 'none',
                  boxShadow: 'var(--shadow-sm)',
                  fontSize: '0.9rem',
                  transition: 'opacity 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = '0.85'}
                onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                onClick={handleAddNewClick}
              >
                <Plus style={{ width: '16px', height: '16px', strokeWidth: 3 }} />
                Add Table
              </button>
            </div>

            {activeTab === 'list' ? (
              /* Table List Grid UI */
              <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
                <table className="tables-table">
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'center', padding: '14px 12px', width: '60px', color: 'var(--text-muted)' }}>S.No</th>
                      <th>Table</th>
                      <th>Capacity</th>
                      <th>Status</th>
                      <th>Waiter</th>
                      <th>Order</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tables.map((table, index) => {
                      const orderInfo = getActiveOrderInfo(table.id)
                      return (
                        <tr key={table.id}>
                          <td style={{ padding: '14px 12px', textAlign: 'center', fontWeight: '700', color: 'var(--text-muted)' }}>{index + 1}</td>
                          <td style={{ fontWeight: '800', color: 'var(--text-main)' }}>{table.id}</td>
                          <td style={{ fontWeight: '700' }}>{table.seats} seats</td>
                          <td>{renderStatusBadge(table.status)}</td>
                          <td style={{ fontWeight: '700' }}>{orderInfo ? orderInfo.waiter : (table.waiter || '-')}</td>
                          <td style={{ fontFamily: 'monospace', fontWeight: '700', color: orderInfo ? 'var(--primary)' : 'var(--text-muted)' }}>{orderInfo ? orderInfo.id : '-'}</td>
                          <td style={{ textAlign: 'right' }}>
                            <button className="tables-action-btn" title="View Table details & QR Code" onClick={() => handleViewClick(table)}>
                              <Eye style={{ width: '16px', height: '16px' }} />
                            </button>
                            <button className="tables-action-btn" title="Edit Table details" onClick={() => handleEditClick(table)}>
                              <Edit2 style={{ width: '14px', height: '14px' }} />
                            </button>
                            <button className="tables-action-btn" title="View QR Code directly" onClick={() => handleViewClick(table)}>
                              <QrCode style={{ width: '16px', height: '16px', color: 'var(--primary)' }} />
                            </button>
                            <button className="tables-action-btn delete" title="Delete Table Profile" onClick={() => onDeleteTable(table.id)}>
                              <Trash2 style={{ width: '16px', height: '16px' }} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Live Map View UI */
              <div className="live-map-grid" style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: 'var(--shadow-sm)'
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                  gap: '16px'
                }}>
                  {tables.map(table => {
                    const orderInfo = getActiveOrderInfo(table.id)
                    const statusText = table.status === 'Free' ? 'Available' : table.status
                    
                    const statusColor = statusText === 'Available' ? '#10b981' : statusText === 'Occupied' ? '#f59e0b' : '#ef4444'
                    const statusBg = statusText === 'Available' ? 'rgba(16, 185, 129, 0.1)' : statusText === 'Occupied' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)'
                    const statusIcon = statusText === 'Available' ? '🍽️' : statusText === 'Occupied' ? '🔥' : '⏳'
                    const assignedWaiter = orderInfo ? orderInfo.waiter : table.waiter

                    return (
                      <div
                        key={table.id}
                        className="glass-card map-table-card-premium"
                        style={{
                          padding: '20px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '14px',
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '16px',
                          cursor: 'pointer',
                          transition: 'transform 0.2s, box-shadow 0.2s',
                          boxShadow: 'var(--shadow-sm)'
                        }}
                        onMouseOver={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.transform = 'none'
                          e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                        }}
                        onClick={() => handleViewClick(table)}
                      >
                        <div style={{ background: statusBg, color: statusColor, width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>
                          {statusIcon}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            {table.seats} Seats
                          </span>
                          <h3 style={{ margin: '2px 0', fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)' }}>{table.id}</h3>
                          <span style={{ fontSize: '0.65rem', color: statusColor, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: statusColor }}></div>
                            {statusText} {assignedWaiter ? `• ${assignedWaiter.split(' ')[0]}` : ''}
                          </span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
