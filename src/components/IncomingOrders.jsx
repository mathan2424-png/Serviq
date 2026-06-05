import React, { useState, useMemo } from 'react'
import { Eye, Pencil, X, Calendar, Plus, Trash2, Clock, AlertTriangle, Check, CreditCard, User, Utensils, ArrowLeft } from 'lucide-react'

export default function IncomingOrders({ orders, onUpdateStatus, onDeleteOrder, onUpdateOrder, showToast }) {
  // Filters State
  const [statusFilter, setStatusFilter] = useState('All')
  const [waiterFilter, setWaiterFilter] = useState('All')
  const [dateFilter, setDateFilter] = useState('2026-05-28') // Match screenshot default date

  // Modals State
  const [viewingOrder, setViewingOrder] = useState(null)
  const [editingOrder, setEditingOrder] = useState(null)
  const [deletingOrderId, setDeletingOrderId] = useState(null)

  // Popular items menu for adding/editing items
  const POPULAR_ITEMS = [
    { name: 'Paneer Tikka', price: 140 },
    { name: 'Dal Makhani', price: 160 },
    { name: 'Butter Chicken', price: 260 },
    { name: 'Gulab Jamun', price: 80 },
    { name: 'Chicken 65', price: 180 },
    { name: 'Masala Chai', price: 40 },
    { name: 'Fish Curry', price: 250 },
    { name: 'Mango Lassi', price: 60 }
  ]

  // Get unique waiters dynamically for the dropdown
  const uniqueWaiters = useMemo(() => {
    const waiters = orders.map(o => o.waiter).filter(Boolean)
    return ['All', ...Array.from(new Set(waiters))]
  }, [orders])

  // Filter orders based on status, waiter, and date
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Status Filter
      if (statusFilter !== 'All') {
        const orderStatus = order.status.toLowerCase()
        const filter = statusFilter.toLowerCase()
        if (filter === 'new') {
          if (orderStatus !== 'pending' && orderStatus !== 'new') {
            return false
          }
        } else if (filter === 'done') {
          if (orderStatus !== 'delivered' && orderStatus !== 'paid' && orderStatus !== 'done' && orderStatus !== 'billed') {
            return false
          }
        } else {
          if (orderStatus !== filter) {
            return false
          }
        }
      }

      // Waiter Filter
      if (waiterFilter !== 'All') {
        if (!order.waiter || order.waiter.toLowerCase() !== waiterFilter.toLowerCase()) {
          return false
        }
      }

      // Date Filter (If we want to match date, we can do it here. 
      // In this demo, we assume all mock data is for the selected date, but if the date is changed we can still show them 
      // or filter by date string. Let's keep it flexible so changing it doesn't empty the list completely unless desired.)
      return true
    })
  }, [orders, statusFilter, waiterFilter])

  // Helpers
  const formatItemsText = (items) => {
    if (!items || items.length === 0) return 'No items'
    const text = items.map(item => `${item.name} x${item.quantity}`).join(', ')
    if (text.length > 35) {
      return text.substring(0, 32) + '...'
    }
    return text
  }

  const calculateTotal = (items) => {
    if (!items) return 0
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }

  // Handle Edit Order save
  const handleSaveEdit = (e) => {
    e.preventDefault()
    if (!editingOrder) return

    if (!editingOrder.table.trim()) {
      showToast('error', 'Table name cannot be empty')
      return
    }
    if (editingOrder.items.length === 0) {
      showToast('error', 'Order must have at least one item')
      return
    }

    onUpdateOrder(editingOrder)
    setEditingOrder(null)
  }

  // Handle adding an item in edit modal
  const handleAddItemToEditing = () => {
    const defaultItem = POPULAR_ITEMS[0]
    setEditingOrder({
      ...editingOrder,
      items: [
        ...editingOrder.items,
        { name: defaultItem.name, quantity: 1, price: defaultItem.price }
      ]
    })
  }

  // Handle removing an item in edit modal
  const handleRemoveItemFromEditing = (index) => {
    const updatedItems = editingOrder.items.filter((_, i) => i !== index)
    setEditingOrder({
      ...editingOrder,
      items: updatedItems
    })
  }

  // Handle editing item attribute
  const handleEditItemProperty = (index, property, value) => {
    const updatedItems = editingOrder.items.map((item, i) => {
      if (i === index) {
        if (property === 'name') {
          const matched = POPULAR_ITEMS.find(p => p.name === value)
          return { ...item, name: value, price: matched ? matched.price : item.price }
        }
        return { ...item, [property]: value }
      }
      return item
    })
    setEditingOrder({
      ...editingOrder,
      items: updatedItems
    })
  }

  return (
    <div className="incoming-orders-wrapper animate-fade-in">
      <style>{`
        .incoming-orders-wrapper {
          padding: 24px 30px;
          background-color: var(--bg-app);
          min-height: 100%;
          font-family: 'Inter', system-ui, sans-serif;
        }

        .filters-header-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .status-tabs-container {
          display: flex;
          align-items: center;
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 10px;
          padding: 4px;
          gap: 4px;
          width: fit-content;
          box-shadow: var(--shadow-sm);
        }

        .status-tab-btn {
          background: transparent;
          border: none;
          border-radius: 8px;
          padding: 8px 18px;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-muted);
          cursor: pointer;
          transition: all var(--transition-fast);
          outline: none;
        }

        .status-tab-btn:hover {
          color: var(--text-main);
          background-color: var(--bg-app);
        }

        .status-tab-btn.active {
          background-color: var(--text-main);
          color: var(--bg-card);
        }

        .custom-select-filter {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-main);
          cursor: pointer;
          outline: none;
          min-width: 150px;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
          padding-right: 36px;
          transition: border-color 0.2s;
        }

        .custom-select-filter:hover {
          border-color: var(--text-light);
        }

        .custom-date-filter {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 8px 16px;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-main);
          outline: none;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: border-color 0.2s;
        }

        .custom-date-filter:hover {
          border-color: var(--text-light);
        }

        .custom-date-filter input {
          border: none;
          outline: none;
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-main);
          background: transparent;
          cursor: pointer;
          padding: 0;
          width: 105px;
        }

        .table-card-container {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          box-shadow: var(--shadow-sm);
          overflow: hidden;
        }

        .table-scroll-wrapper {
          overflow-x: auto;
          width: 100%;
          -webkit-overflow-scrolling: touch;
        }

        .orders-data-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          text-align: left;
          min-width: 900px;
        }

        .orders-data-table th {
          padding: 16px 20px;
          background-color: var(--bg-app);
          border-bottom: 1px solid var(--border-color);
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 0.5px;
          color: var(--text-muted);
          text-transform: uppercase;
          white-space: nowrap;
        }

        .orders-data-table td {
          padding: 16px 20px;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.9rem;
          color: var(--text-main);
          vertical-align: middle;
          white-space: nowrap;
        }

        .orders-data-table tr:last-child td {
          border-bottom: none;
        }

        .orders-data-table tr:hover td {
          background-color: var(--bg-app);
        }

        .sno-cell {
          font-weight: 600;
          color: var(--text-muted);
        }

        .order-id-cell {
          font-weight: 700;
          color: var(--text-main);
        }

        .table-name-cell {
          font-weight: 500;
          color: var(--text-main);
        }

        .waiter-name-cell {
          color: var(--text-muted);
        }

        .items-cell {
          color: var(--text-muted);
          max-width: 250px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .total-cell {
          font-weight: 750;
          color: var(--text-main);
        }

        /* Badge pills matching screenshot colors */
        .status-pill {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 600;
          text-align: center;
        }

        .status-preparing {
          background-color: var(--status-preparing-bg);
          color: var(--status-preparing);
        }

        .status-ready {
          background-color: var(--status-ready-bg);
          color: var(--status-ready);
        }

        .status-delivered {
          background-color: var(--status-done-bg);
          color: var(--status-done);
        }

        .status-pending {
          background-color: var(--status-new-bg);
          color: var(--status-new);
        }

        .status-paid {
          background-color: var(--status-ready-bg);
          color: var(--status-ready);
        }

        .payment-pill {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.8rem;
          font-weight: 600;
          text-align: center;
        }

        .payment-pending {
          background-color: var(--status-new-bg);
          color: var(--status-new);
        }

        .payment-paid {
          background-color: var(--status-ready-bg);
          color: var(--status-ready);
        }

        .action-buttons-cell {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .action-btn {
          background-color: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          width: 34px;
          height: 34px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
          padding: 0;
          outline: none;
        }

        .action-btn:hover {
          background-color: var(--bg-app);
          color: var(--text-main);
          border-color: var(--text-light);
          box-shadow: var(--shadow-sm);
        }

        .action-btn.delete-btn:hover {
          background-color: rgba(239, 68, 68, 0.15);
          color: #ef4444;
          border-color: rgba(239, 68, 68, 0.3);
        }

        /* Modal styling */
        .orders-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          animation: fadeIn 0.15s ease-out;
        }

        .orders-modal-container {
          background-color: var(--bg-card);
          border-radius: 16px;
          box-shadow: var(--shadow-premium);
          width: 95%;
          max-width: 500px;
          max-height: 85vh;
          overflow-y: auto;
          padding: 24px;
          position: relative;
          animation: scaleUp 0.15s ease-out;
          border: 1px solid var(--border-color);
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleUp {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .orders-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 12px;
        }

        .orders-modal-header h3 {
          font-size: 1.2rem;
          font-weight: 800;
          color: var(--text-main);
          margin: 0;
        }

        .modal-close-icon {
          cursor: pointer;
          color: var(--text-light);
          transition: color 0.2s;
        }

        .modal-close-icon:hover {
          color: var(--text-main);
        }

        .modal-field-group {
          margin-bottom: 16px;
        }

        .modal-field-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          color: var(--text-muted);
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .modal-field-group input,
        .modal-field-group select,
        .modal-field-group textarea {
          width: 100%;
          padding: 10px 12px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          font-size: 0.9rem;
          color: var(--text-main);
          background-color: var(--bg-card);
          outline: none;
          box-sizing: border-box;
        }

        .modal-field-group input:focus,
        .modal-field-group select:focus,
        .modal-field-group textarea:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 2px var(--primary-light);
        }

        .items-editor-container {
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 12px;
          background-color: var(--bg-app);
          max-height: 200px;
          overflow-y: auto;
          margin-bottom: 8px;
        }

        .item-editor-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }

        .item-editor-row:last-child {
          margin-bottom: 0;
        }

        .item-editor-select {
          flex: 2;
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-card);
          color: var(--text-main);
          font-size: 0.85rem;
        }

        .item-editor-qty {
          width: 60px;
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-card);
          color: var(--text-main);
          text-align: center;
          font-size: 0.85rem;
        }

        .item-editor-price {
          width: 80px;
          padding: 6px 10px;
          border-radius: 6px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-app);
          color: var(--text-muted);
          text-align: right;
          font-size: 0.85rem;
        }

        .btn-add-item-modal {
          background-color: var(--bg-card);
          border: 1px dashed var(--border-color);
          color: var(--text-muted);
          padding: 8px;
          border-radius: 8px;
          width: 100%;
          cursor: pointer;
          font-size: 0.85rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.2s;
        }

        .btn-add-item-modal:hover {
          background-color: var(--bg-app);
          color: var(--text-main);
          border-color: var(--text-light);
        }

        .modal-action-footer {
          display: flex;
          gap: 12px;
          margin-top: 24px;
          border-top: 1px solid var(--border-color);
          padding-top: 16px;
        }

        .modal-btn-cancel {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          background-color: var(--bg-card);
          color: var(--text-muted);
          font-weight: 600;
          cursor: pointer;
          transition: background-color 0.2s;
        }

        .modal-btn-cancel:hover {
          background-color: var(--bg-app);
          color: var(--text-main);
        }

        .modal-btn-save {
          flex: 1;
          padding: 10px;
          border-radius: 8px;
          border: none;
          background-color: var(--primary);
          color: #ffffff;
          font-weight: 600;
          cursor: pointer;
          transition: opacity 0.2s;
        }

        .modal-btn-save:hover {
          background-color: var(--primary-hover);
        }

        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px dashed var(--border-color);
          font-size: 0.9rem;
        }

        .detail-row:last-child {
          border-bottom: none;
        }

        .detail-label {
          color: var(--text-muted);
          font-weight: 500;
        }

        .detail-val {
          color: var(--text-main);
          font-weight: 600;
        }

        .detail-items-list {
          list-style: none;
          padding: 0;
          margin: 12px 0 0 0;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          background-color: var(--bg-app);
        }

        .detail-item-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 14px;
          border-bottom: 1px solid var(--border-color);
          font-size: 0.85rem;
        }

        .detail-item-row:last-child {
          border-bottom: none;
        }
      `}</style>

      {/* Header/Breadcrumbs when in Edit or View sub-pages */}
      {editingOrder ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <button
            onClick={() => setEditingOrder(null)}
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
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Orders Registry</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Edit Order {editingOrder.id}
            </h2>
          </div>
        </div>
      ) : viewingOrder ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <button
            onClick={() => setViewingOrder(null)}
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
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Orders Registry</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Order details: {viewingOrder.id}
            </h2>
          </div>
        </div>
      ) : null}

      {/* Main Page Area */}
      {editingOrder ? (
        /* Inline Edit Form Page - Full Width */
        <div className="glass-card animate-fade-in" style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: 'var(--shadow-md)',
          width: '100%'
        }}>
          <form onSubmit={handleSaveEdit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="modal-field-group">
                <label>Table Number / ID</label>
                <input
                  type="text"
                  value={editingOrder.table}
                  onChange={(e) => setEditingOrder({ ...editingOrder, table: e.target.value })}
                  placeholder="e.g. T-01"
                />
              </div>

              <div className="modal-field-group">
                <label>Order Status</label>
                <select
                  value={editingOrder.status}
                  onChange={(e) => setEditingOrder({ ...editingOrder, status: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Ready">Ready</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>

              <div className="modal-field-group">
                <label>Payment status</label>
                <select
                  value={editingOrder.payment || 'Pending'}
                  onChange={(e) => setEditingOrder({ ...editingOrder, payment: e.target.value })}
                >
                  <option value="Pending">Pending</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div className="modal-field-group">
                <label>Order Time</label>
                <input
                  type="text"
                  value={editingOrder.time}
                  onChange={(e) => setEditingOrder({ ...editingOrder, time: e.target.value })}
                  placeholder="e.g. 12:34"
                />
              </div>
              <div />
            </div>

            <div className="modal-field-group" style={{ marginTop: '10px' }}>
              <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>Order Items</span>
                <span style={{ color: '#0284c7', fontSize: '0.75rem', textTransform: 'none', cursor: 'pointer', fontWeight: '700' }} onClick={handleAddItemToEditing}>
                  + Add Item
                </span>
              </label>
              <div className="items-editor-container" style={{ maxHeight: '300px' }}>
                {editingOrder.items.map((item, index) => (
                  <div key={index} className="item-editor-row" style={{ marginBottom: '12px' }}>
                    <select
                      className="item-editor-select"
                      value={item.name}
                      onChange={(e) => handleEditItemProperty(index, 'name', e.target.value)}
                      style={{ padding: '8px 12px', borderRadius: '8px' }}
                    >
                      {POPULAR_ITEMS.map(p => (
                        <option key={p.name} value={p.name}>{p.name} (₹{p.price})</option>
                      ))}
                    </select>

                    <input
                      type="number"
                      className="item-editor-qty"
                      min="1"
                      max="20"
                      value={item.quantity}
                      onChange={(e) => handleEditItemProperty(index, 'quantity', parseInt(e.target.value) || 1)}
                      style={{ padding: '8px 10px', borderRadius: '8px' }}
                    />

                    <div className="item-editor-price" style={{ minWidth: '80px', fontWeight: '700' }}>
                      ₹{item.price * item.quantity}
                    </div>

                    <button
                      type="button"
                      className="action-btn delete-btn"
                      style={{ width: '36px', height: '36px', flexShrink: 0, borderRadius: '8px' }}
                      onClick={() => handleRemoveItemFromEditing(index)}
                    >
                      <Trash2 style={{ width: '16px', height: '16px' }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-field-group">
              <label>Kitchen Note / Requests</label>
              <textarea
                value={editingOrder.note || ''}
                onChange={(e) => setEditingOrder({ ...editingOrder, note: e.target.value })}
                placeholder="e.g. Allergy info, spicy level preference"
                rows="3"
                style={{ padding: '10px 12px', borderRadius: '8px' }}
              />
            </div>

            <div className="modal-action-footer" style={{ maxWidth: '400px', display: 'flex', gap: '12px' }}>
              <button type="button" className="modal-btn-cancel" onClick={() => setEditingOrder(null)}>
                Cancel
              </button>
              <button type="submit" className="modal-btn-save">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      ) : viewingOrder ? (
        /* Inline View Order Page - Full Width */
        <div className="glass-card animate-fade-in" style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: 'var(--shadow-md)',
          width: '100%'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
            {/* Left: Summary Info */}
            <div style={{
              background: 'var(--bg-app)',
              padding: '24px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              height: 'fit-content'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '1.5rem' }}>📋</span>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800', margin: 0 }}>Order Summary</h4>
                  <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-muted)' }}>{viewingOrder.id}</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Table</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '700' }}>{viewingOrder.table}</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Time</span>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '700' }}>{viewingOrder.time}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Order Status</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    color: 'var(--primary)',
                    background: 'var(--primary-light)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>{viewingOrder.status}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Payment Status</span>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    color: viewingOrder.payment === 'Paid' ? '#10b981' : 'var(--text-muted)',
                    background: viewingOrder.payment === 'Paid' ? 'rgba(16,185,129,0.1)' : 'var(--status-new-bg)',
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}>{viewingOrder.payment || 'Pending'}</span>
                </div>
              </div>
            </div>

            {/* Right: Items Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', margin: '0 0 12px 0' }}>Items in Order</h3>
                <ul className="detail-items-list" style={{ margin: 0 }}>
                  {viewingOrder.items.map((item, idx) => (
                    <li key={idx} className="detail-item-row" style={{ padding: '12px 18px' }}>
                      <span>{item.name} <strong style={{ marginLeft: '4px' }}>× {item.quantity}</strong></span>
                      <span style={{ fontWeight: '700' }}>₹{item.price * item.quantity}</span>
                    </li>
                  ))}
                  <li className="detail-item-row" style={{ background: 'var(--bg-app)', fontWeight: '800', borderTop: '2px solid var(--border-color)', fontSize: '1rem', padding: '14px 18px' }}>
                    <span>Total Amount:</span>
                    <span>₹{calculateTotal(viewingOrder.items)}</span>
                  </li>
                </ul>
              </div>

              {viewingOrder.note && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span className="detail-label" style={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 700 }}>Kitchen Note / Special Instructions</span>
                  <div style={{ padding: '12px 16px', background: 'var(--status-preparing-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--status-preparing)', width: '100%', boxSizing: 'border-box', lineHeight: '1.4' }}>
                    {viewingOrder.note}
                  </div>
                </div>
              )}

              <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                <button
                  className="btn-black"
                  style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
                  onClick={() => setViewingOrder(null)}
                >
                  Back to Registry
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Normal Registry Grid View */
        <>
          {/* FILTER BAR ROW */}
          <div className="filters-header-row">
            {/* Status Tabs instead of select dropdown */}
            <div className="status-tabs-container">
              {['All', 'New', 'Preparing', 'Ready', 'Done'].map((status) => (
                <button
                  key={status}
                  type="button"
                  className={`status-tab-btn ${statusFilter === status ? 'active' : ''}`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status}
                </button>
              ))}
            </div>



            {/* Date Picker showing 05/28/2026 by default */}
            <div className="custom-date-filter">
              <Calendar style={{ width: '16px', height: '16px', color: '#64748b' }} />
              <input
                type="text"
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                placeholder="MM/DD/YYYY"
              />
            </div>
          </div>

          {/* ORDERS DATA TABLE CONTAINER */}
          <div className="table-card-container">
            {filteredOrders.length === 0 ? (
              <div style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Clock style={{ width: '48px', height: '48px', color: 'var(--border-color)', marginBottom: '16px', display: 'inline-block' }} />
                <h3>No orders matching filters found</h3>
                <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Try resetting your filter selections above.</p>
              </div>
            ) : (
              <div className="table-scroll-wrapper">
                <table className="orders-data-table">
                  <thead>
                    <tr>
                      <th style={{ width: '60px' }}>S.No.</th>
                      <th>Order #</th>
                      <th>Table</th>

                      <th>Items</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Time</th>
                      <th>Payment</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order, index) => {
                      const totalVal = calculateTotal(order.items)
                      const isPaidStatus = order.status.toLowerCase() === 'paid'
                      const isDeliveredStatus = order.status.toLowerCase() === 'delivered'
                      const isReadyStatus = order.status.toLowerCase() === 'ready'
                      const isPreparingStatus = order.status.toLowerCase() === 'preparing'

                      let statusClass = 'status-pending'
                      if (isPreparingStatus) statusClass = 'status-preparing'
                      else if (isReadyStatus) statusClass = 'status-ready'
                      else if (isDeliveredStatus) statusClass = 'status-delivered'
                      else if (isPaidStatus) statusClass = 'status-paid'

                      const isPaymentPaid = order.payment && order.payment.toLowerCase() === 'paid'
                      const paymentClass = isPaymentPaid ? 'payment-paid' : 'payment-pending'

                      return (
                        <tr key={order.id}>
                          <td className="sno-cell">{index + 1}</td>
                          <td className="order-id-cell">{order.id}</td>
                          <td className="table-name-cell">{order.table}</td>

                          <td className="items-cell" title={order.items.map(i => `${i.name} x${i.quantity}`).join(', ')}>
                            {formatItemsText(order.items)}
                          </td>
                          <td className="total-cell">₹{totalVal}</td>
                          <td>
                            <span className={`status-pill ${statusClass}`}>
                              {order.status}
                            </span>
                          </td>
                          <td>{order.time}</td>
                          <td>
                            <span className={`payment-pill ${paymentClass}`}>
                              {order.payment || 'Pending'}
                            </span>
                          </td>
                          <td className="action-buttons-cell">
                            {/* VIEW BUTTON */}
                            <button
                              className="action-btn"
                              onClick={() => setViewingOrder(order)}
                              title="View Details"
                            >
                              <Eye style={{ width: '16px', height: '16px' }} />
                            </button>

                            {/* EDIT BUTTON */}
                            <button
                              className="action-btn"
                              onClick={() => setEditingOrder(JSON.parse(JSON.stringify(order)))} // Deep copy
                              title="Edit Order"
                            >
                              <Pencil style={{ width: '14px', height: '14px' }} />
                            </button>

                            {/* DELETE BUTTON */}
                            <button
                              className="action-btn delete-btn"
                              onClick={() => setDeletingOrderId(order.id)}
                              title="Delete Order"
                            >
                              <Trash2 style={{ width: '16px', height: '16px', color: 'red' }} />
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* 3. DELETE CONFIRMATION MODAL */}
      {deletingOrderId && (
        <div className="orders-modal-overlay" onClick={() => setDeletingOrderId(null)}>
          <div className="orders-modal-container animate-fade-in" style={{ maxWidth: '380px', textAlign: 'center' }} onClick={(e) => e.stopPropagation()}>
            <h4 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 10px 0' }}>
              Delete Order Registration
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete order <strong>{deletingOrderId}</strong>? This action will remove it from the system lists and cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                className="modal-btn-cancel"
                onClick={() => setDeletingOrderId(null)}
              >
                Cancel
              </button>
              <button
                className="modal-btn-save"
                style={{ backgroundColor: '#ef4444' }}
                onClick={() => {
                  onDeleteOrder(deletingOrderId)
                  setDeletingOrderId(null)
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
