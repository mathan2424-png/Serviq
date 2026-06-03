import React, { useState } from 'react'
import { QrCode, ShoppingCart, ArrowLeft, Send, CheckCircle2, Trash2, Plus, Minus, X } from 'lucide-react'

export default function CustomerApp({ menuItems, activeTable, onSetActiveTable, onPlaceOrder, activeCustomerOrder }) {
  // Phases: 'scan', 'welcome', 'menu', 'cart', 'tracker'
  const [phase, setPhase] = useState(activeTable ? 'welcome' : 'scan')
  const [cart, setCart] = useState([])
  const [instructions, setInstructions] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Items')
  const [searchQuery, setSearchQuery] = useState('')
  
  // Item Detail Modal states
  const [selectedItem, setSelectedItem] = useState(null)
  const [modalQty, setModalQty] = useState(1)
  const [itemNote, setItemNote] = useState('')

  // Categories for customer App
  const categories = ['All Items', 'Starters', 'Mains', 'Desserts', 'Drinks']

  // Handle QR scanning simulation
  const handleScan = (tableId) => {
    onSetActiveTable(tableId)
    setPhase('welcome')
  }

  // Open item detail sheet modal
  const openItemDetail = (item) => {
    setSelectedItem(item)
    const existing = cart.find(i => i.id === item.id)
    setModalQty(existing ? existing.quantity : 1)
    setItemNote(existing && existing.note ? existing.note : '')
  }

  // Add item from modal to cart
  const handleAddFromModal = () => {
    if (!selectedItem) return
    const existingIndex = cart.findIndex(i => i.id === selectedItem.id)
    if (existingIndex >= 0) {
      const updatedCart = [...cart]
      updatedCart[existingIndex] = {
        ...updatedCart[existingIndex],
        quantity: modalQty,
        note: itemNote
      }
      setCart(updatedCart)
    } else {
      setCart([...cart, { ...selectedItem, quantity: modalQty, note: itemNote }])
    }
    setSelectedItem(null)
  }

  // Quick increment/decrement inside Cart list
  const updateCartQty = (itemId, newQty) => {
    if (newQty <= 0) {
      setCart(cart.filter(i => i.id !== itemId))
    } else {
      setCart(cart.map(i => i.id === itemId ? { ...i, quantity: newQty } : i))
    }
  }

  // Remove item entirely from cart
  const removeCartItem = (itemId) => {
    setCart(cart.filter(i => i.id !== itemId))
  }

  // Get quantity of item in cart
  const getItemQty = (itemId) => {
    const item = cart.find(i => i.id === itemId)
    return item ? item.quantity : 0
  }

  // Filter available menu items
  const displayItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All Items' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Pricing calculations matching GST (5%) wireframe totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const gst = Math.round(subtotal * 0.05)
  const grandTotal = subtotal + gst
  const cartQty = cart.reduce((sum, item) => sum + item.quantity, 0)

  // Tracker calculations
  const trackerSubtotal = activeCustomerOrder 
    ? activeCustomerOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0) 
    : 0
  const trackerGst = Math.round(trackerSubtotal * 0.05)
  const trackerTotal = trackerSubtotal + trackerGst

  // Submit Order
  const handlePlaceOrderSubmit = () => {
    if (cart.length === 0) return
    
    // Convert cart format to match parent: pass notes inside individual items or instructions
    onPlaceOrder(cart, instructions)
    
    // Clear local cart
    setCart([])
    setInstructions('')
    setPhase('tracker')
  }

  return (
    <div className="simulator-container">
      <div className="phone-frame" style={{ border: '4px solid var(--primary)' }}>
        <div className="phone-notch"></div>
        <div className="phone-screen" style={{ background: 'var(--bg-app)' }}>
          
          {/* HEADER (Conditional based on phase) */}
          {phase !== 'scan' && phase !== 'welcome' && (
            <div className="phone-header">
              {phase === 'menu' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button 
                    style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '50%' }}
                    onClick={() => setPhase('welcome')}
                    title="Back to Welcome Page"
                  >
                    <ArrowLeft style={{ width: '18px', height: '18px', color: 'var(--text-main)' }} />
                  </button>
                  <div className="phone-restaurant">
                    <div className="phone-restaurant-logo">QM</div>
                    <div className="phone-restaurant-name">
                      <h4 style={{ fontWeight: '800' }}>QR Restaurant</h4>
                      <p>Authentic Dining</p>
                    </div>
                  </div>
                </div>
              ) : (
                <button 
                  style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-main)' }}
                  onClick={() => setPhase('menu')}
                >
                  <ArrowLeft style={{ width: '16px', height: '16px' }} />
                  Menu
                </button>
              )}
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div className="phone-table-badge">{activeTable}</div>
                {phase === 'menu' && cartQty > 0 && (
                  <button 
                    style={{ background: 'none', border: 'none', position: 'relative', cursor: 'pointer' }}
                    onClick={() => setPhase('cart')}
                  >
                    <ShoppingCart style={{ width: '20px', height: '20px', color: 'var(--text-main)' }} />
                    <span style={{ position: 'absolute', top: '-6px', right: '-8px', background: 'var(--primary)', color: '#fff', fontSize: '0.65rem', fontWeight: '700', padding: '1px 5px', borderRadius: '10px' }}>{cartQty}</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* PHASE 1: SCAN QR CODE */}
          {phase === 'scan' && (
            <div className="qr-scanner-mock">
              <div className="qr-box">
                <QrCode style={{ width: '120px', height: '120px', color: 'var(--text-main)' }} />
                <div className="qr-scanner-line"></div>
              </div>
              <h3 className="qr-selector-title">Scan QR Menu Code</h3>
              <p className="qr-selector-desc">Select a table number to simulate scanning the table's QR code.</p>
              
              <select 
                className="qr-table-select" 
                onChange={(e) => handleScan(e.target.value)}
                defaultValue=""
              >
                <option value="" disabled>Select Table Number...</option>
                <option value="Table 01">Table 01</option>
                <option value="Table 02">Table 02</option>
                <option value="Table 03">Table 03</option>
                <option value="Table 04">Table 04</option>
                <option value="Table 05">Table 05</option>
                <option value="Table 06">Table 06</option>
                <option value="Table 07">Table 07</option>
              </select>
              
              <p style={{ fontSize: '0.7rem', color: 'var(--text-light)', textAlign: 'center', maxWidth: '80%', margin: '0 auto' }}>
                QR scan simulates binding your mobile session to that table.
              </p>
            </div>
          )}

          {/* PHASE 2: WELCOME SCREEN (NEW WIREFRAME MATCH) */}
          {phase === 'welcome' && (
            <div className="welcome-container animate-fade-in">
              <div className="welcome-logo-box">
                Restaurant Logo
              </div>
              
              <h2 className="welcome-title">Welcome to<br/>The Grand Bistro</h2>
              <p className="welcome-subtitle">Scan • Order • Enjoy</p>
              
              <div className="welcome-card">
                <div className="welcome-card-label">Your Table</div>
                <div className="welcome-card-table">{activeTable}</div>
                <div className="welcome-card-sub">Assigned via QR Code</div>
              </div>
              
              <div className="welcome-info-box">
                ℹ️ Menu and order will be linked to this table. Call staff if table number is wrong.
              </div>
              
              <button className="welcome-btn" onClick={() => setPhase('menu')}>
                Start Ordering
              </button>
              
              <div style={{ marginTop: 'auto', fontSize: '0.7rem', color: 'var(--text-light)' }}>
                Powered by QRMenu • Free Plan
              </div>
            </div>
          )}

          {/* PHASE 3: BROWSE MENU */}
          {phase === 'menu' && (
            <>
              <div className="phone-content">
                {/* Search */}
                <div style={{ background: '#fff', display: 'flex', gap: '8px', padding: '10px 14px', borderRadius: '12px', border: '1px solid #e2e8f0', alignItems: 'center' }}>
                  <ShoppingCart style={{ width: '16px', height: '16px', color: 'var(--text-light)' }} />
                  <input 
                    type="text" 
                    placeholder="Search menu..." 
                    style={{ border: 'none', outline: 'none', background: 'transparent', fontSize: '0.8rem', width: '100%', color: 'var(--text-main)' }}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Categories Scrollable slider */}
                <div className="phone-categories">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className={`phone-category-tag ${selectedCategory === cat ? 'active' : ''}`}
                      onClick={() => setSelectedCategory(cat)}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                
                <div style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-light)', letterSpacing: '0.5px', marginBottom: '4px' }}>
                  {selectedCategory.toUpperCase()} • {displayItems.length} DISHES
                </div>

                {/* Dish Item Cards */}
                <div className="phone-dish-list">
                  {displayItems.map(item => {
                    const qty = getItemQty(item.id)
                    const isVeg = item.name.toLowerCase().includes('paneer') || item.name.toLowerCase().includes('dosa') || item.name.toLowerCase().includes('dal') || item.name.toLowerCase().includes('gulab') || item.name.toLowerCase().includes('lassi') || item.name.toLowerCase().includes('naan') || item.name.toLowerCase().includes('coffee') || item.name.toLowerCase().includes('chai')
                    
                    return (
                      <div 
                        key={item.id} 
                        className="phone-dish-card" 
                        style={{ opacity: item.available ? 1 : 0.6, cursor: item.available ? 'pointer' : 'default' }}
                        onClick={() => item.available && openItemDetail(item)}
                      >
                        <div className="phone-dish-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9', overflow: 'hidden' }}>
                          {item.image ? (
                            <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-light)' }}>Photo</span>
                          )}
                        </div>
                        <div className="phone-dish-info">
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <h5 style={{ margin: 0, fontWeight: '800' }}>{item.name}</h5>
                              <span style={{ fontSize: '0.6rem', padding: '1px 6px', borderRadius: '4px', background: isVeg ? '#d1fae5' : '#fee2e2', color: isVeg ? '#065f46' : '#991b1b', fontWeight: '800', textTransform: 'uppercase' }}>
                                {isVeg ? 'Veg' : 'Non-Veg'}
                              </span>
                            </div>
                            <p className="phone-dish-desc">{item.description}</p>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span className="phone-dish-price">₹{item.price}</span>
                            
                            {!item.available ? (
                              <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: '600' }}>Out of stock</span>
                            ) : qty > 0 ? (
                              <div className="phone-qty-control" onClick={(e) => e.stopPropagation()}>
                                <button className="phone-qty-btn" onClick={() => updateCartQty(item.id, qty - 1)}>-</button>
                                <span className="phone-qty-value">{qty}</span>
                                <button className="phone-qty-btn" onClick={() => updateCartQty(item.id, qty + 1)}>+</button>
                              </div>
                            ) : (
                              <button 
                                className="phone-add-btn"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  openItemDetail(item)
                                }}
                              >
                                + Add
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Sticky Cart Footer */}
              {cartQty > 0 && (
                <div className="phone-footer-cart" style={{ boxShadow: '0 -4px 10px rgba(0,0,0,0.05)' }}>
                  <div className="phone-cart-summary">
                    <h5 style={{ fontWeight: '500' }}>{cartQty} {cartQty === 1 ? 'Item' : 'Items'}</h5>
                    <p style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--primary)' }}>₹{subtotal}</p>
                  </div>
                  <button className="phone-view-cart-btn" onClick={() => setPhase('cart')}>
                    View Cart 🛒
                  </button>
                </div>
              )}

              {/* View Tracker if active customer order exists */}
              {activeCustomerOrder && (
                <button 
                  onClick={() => setPhase('tracker')}
                  style={{
                    background: '#1e293b',
                    color: '#fff',
                    border: 'none',
                    padding: '12px',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                    cursor: 'pointer',
                    width: '100%',
                    letterSpacing: '0.5px'
                  }}
                >
                  Track Active Order ({activeCustomerOrder.status}) ➜
                </button>
              )}
            </>
          )}

          {/* PHASE 4: VIEW CART (NEW WIREFRAME MATCH) */}
          {phase === 'cart' && (
            <div className="phone-content phone-cart-panel" style={{ paddingBottom: '20px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', marginBottom: '4px' }}>Your Selected Items</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{activeTable} • Dine-in</p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto', flex: 1, maxHeight: '280px', paddingRight: '2px' }}>
                {cart.map(item => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}>
                    <div style={{ flex: 1 }}>
                      <h5 style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>{item.name}</h5>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>₹{item.price}</span>
                      {item.note && (
                        <p style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: '600', margin: '4px 0 0 0' }}>
                          Note: {item.note}
                        </p>
                      )}
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                      <div className="phone-qty-control" style={{ margin: 0 }}>
                        <button className="phone-qty-btn" onClick={() => updateCartQty(item.id, item.quantity - 1)}>-</button>
                        <span className="phone-qty-value">{item.quantity}</span>
                        <button className="phone-qty-btn" onClick={() => updateCartQty(item.id, item.quantity + 1)}>+</button>
                      </div>
                      
                      <button 
                        style={{ background: 'none', border: 'none', color: '#dc2626', fontSize: '0.65rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '2px', padding: 0 }}
                        onClick={() => removeCartItem(item.id)}
                      >
                        <Trash2 style={{ width: '10px', height: '10px' }} /> Remove
                      </button>
                    </div>
                  </div>
                ))}
                
                {cart.length === 0 && (
                  <p style={{ textAlign: 'center', fontSize: '0.8rem', color: 'var(--text-light)', padding: '20px' }}>Your cart is empty.</p>
                )}
              </div>

              {/* Special Instructions */}
              <div className="phone-instruction-box">
                <label>Order Notes (Optional)</label>
                <textarea 
                  rows="2" 
                  placeholder="Any special instructions for the kitchen..." 
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                />
              </div>

              {/* Invoice Summary with 5% GST Match */}
              <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem', padding: '14px', background: 'var(--bg-card)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>Subtotal</span>
                  <span style={{ fontWeight: '600' }}>₹{subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                  <span>GST (5%)</span>
                  <span style={{ fontWeight: '600' }}>₹{gst}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', borderTop: '1px dashed #e2e8f0', paddingTop: '8px', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                  <span>Total</span>
                  <span style={{ color: 'var(--primary)' }}>₹{grandTotal}</span>
                </div>
              </div>

              <button 
                className="phone-view-cart-btn" 
                style={{ width: '100%', padding: '12px', justifyContent: 'center', marginTop: 'auto', background: 'var(--primary)', color: '#fff', borderRadius: '12px', fontWeight: '800' }}
                onClick={handlePlaceOrderSubmit}
                disabled={cart.length === 0}
              >
                Place Order • ₹{grandTotal}
              </button>
              
              <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-light)', margin: '4px 0 0 0' }}>
                Order will be sent to kitchen after confirmation
              </p>
            </div>
          )}

          {/* PHASE 5: LIVE TRACKER (NEW WIREFRAME MATCH) */}
          {phase === 'tracker' && (
            <div className="phone-content phone-tracker" style={{ paddingBottom: '20px' }}>
              <div className="phone-tracker-header">
                <CheckCircle2 style={{ width: '48px', height: '48px', color: '#10b981', margin: '0 auto 10px auto' }} />
                <h4 style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>Order Confirmed!</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Your order has been received. Please wait while it is being prepared.
                </p>
              </div>

              {/* Stat grid */}
              <div className="tracker-header-grid">
                <div className="tracker-stat-box">
                  <span>Order ID</span>
                  <h6>{activeCustomerOrder ? `#ORD-${String(activeCustomerOrder.id.replace('#', '')).padStart(5, '0')}` : '#ORD-TBD'}</h6>
                </div>
                <div className="tracker-stat-box">
                  <span>Table</span>
                  <h6>{activeTable || 'TBD'}</h6>
                </div>
                <div className="tracker-stat-box">
                  <span>Est. Time</span>
                  <h6>25-30 min</h6>
                </div>
              </div>

              {/* Status steps tracker */}
              <div className="tracker-steps" style={{ margin: '10px 0' }}>
                <div className={`tracker-step ${activeCustomerOrder ? 'completed' : 'active'}`}>
                  <div className="tracker-step-dot"></div>
                  <div className="tracker-step-info">
                    <h6>Order Received</h6>
                    <p>Confirmed and logged in system</p>
                  </div>
                </div>

                <div className={`tracker-step ${
                  activeCustomerOrder?.status === 'Preparing' ? 'active' : 
                  (activeCustomerOrder?.status === 'Ready' || activeCustomerOrder?.status === 'Done') ? 'completed' : ''
                }`}>
                  <div className="tracker-step-dot"></div>
                  <div className="tracker-step-info">
                    <h6>Preparing in Kitchen</h6>
                    <p>Chef is cooking your fresh meal</p>
                  </div>
                </div>

                <div className={`tracker-step ${
                  activeCustomerOrder?.status === 'Ready' ? 'active' : 
                  activeCustomerOrder?.status === 'Done' ? 'completed' : ''
                }`}>
                  <div className="tracker-step-dot"></div>
                  <div className="tracker-step-info">
                    <h6>Ready to Serve</h6>
                    <p>Food is gathered at KDS counter</p>
                  </div>
                </div>

                <div className={`tracker-step ${activeCustomerOrder?.status === 'Done' ? 'completed' : ''}`}>
                  <div className="tracker-step-dot"></div>
                  <div className="tracker-step-info">
                    <h6>Completed</h6>
                    <p>Enjoy your hot meal!</p>
                  </div>
                </div>
              </div>

              {/* Items Ordered breakdown */}
              {activeCustomerOrder && (
                <div className="tracker-items-list">
                  <div style={{ fontSize: '0.7rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px', marginBottom: '6px' }}>
                    Items Ordered
                  </div>
                  {activeCustomerOrder.items.map((item, idx) => (
                    <div key={idx} className="tracker-item-row">
                      <span style={{ color: 'var(--text-main)', fontWeight: '500' }}>{item.quantity}× {item.name}</span>
                      <span style={{ color: 'var(--text-muted)' }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  <div className="tracker-item-total">
                    <span>Subtotal</span>
                    <span>₹{trackerSubtotal}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    <span>GST (5%)</span>
                    <span>₹{trackerGst}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: '800', borderTop: '1px dashed var(--border-color)', paddingTop: '6px', marginTop: '6px', color: 'var(--text-main)' }}>
                    <span>Grand Total</span>
                    <span style={{ color: 'var(--primary)' }}>₹{trackerTotal}</span>
                  </div>
                </div>
              )}

              <div style={{ marginTop: 'auto', width: '100%' }}>
                <button 
                  className="welcome-btn" 
                  style={{ width: '100%', padding: '12px', background: '#000' }}
                  onClick={() => setPhase('menu')}
                >
                  View Full Menu
                </button>
              </div>
            </div>
          )}

          {/* ITEM DETAIL SLIDE-UP MODAL OVERLAY (NEW WIREFRAME MATCH) */}
          {selectedItem && (
            <div className="item-detail-overlay animate-fade-in" onClick={() => setSelectedItem(null)}>
              <div className="item-detail-modal" onClick={(e) => e.stopPropagation()}>
                <div className="item-detail-header-nav">
                  <span>Menu / Item Detail</span>
                  <button className="item-detail-close-btn" onClick={() => setSelectedItem(null)}>
                    <X style={{ width: '18px', height: '18px' }} />
                  </button>
                </div>
                
                <div className="item-detail-scroll">
                  <div className="item-detail-img" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#e2e8f0', height: '160px', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
                    {selectedItem.image ? (
                      <img src={selectedItem.image} alt={selectedItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-light)' }}>Food Photo</span>
                    )}
                  </div>
                  
                  <div className="item-detail-meta">
                    <h3>{selectedItem.name}</h3>
                    <span className="item-detail-price">₹{selectedItem.price}</span>
                  </div>
                  
                  <div className="item-detail-diet">
                    {selectedItem.name.toLowerCase().includes('paneer') || selectedItem.name.toLowerCase().includes('dosa') || selectedItem.name.toLowerCase().includes('dal') || selectedItem.name.toLowerCase().includes('gulab') || selectedItem.name.toLowerCase().includes('lassi') || selectedItem.name.toLowerCase().includes('naan') || selectedItem.name.toLowerCase().includes('coffee') || selectedItem.name.toLowerCase().includes('chai') ? 'Veg • Starter Course' : 'Non-Veg • Main Course'}
                  </div>
                  
                  <div className="item-detail-section-title">Description</div>
                  <p className="item-detail-desc">{selectedItem.description}</p>
                  
                  <div className="item-detail-qty-row">
                    <span className="item-detail-section-title" style={{ margin: 0 }}>Quantity</span>
                    <div className="phone-qty-control" style={{ margin: 0 }}>
                      <button className="phone-qty-btn" onClick={() => setModalQty(Math.max(1, modalQty - 1))}>-</button>
                      <span className="phone-qty-value">{modalQty}</span>
                      <button className="phone-qty-btn" onClick={() => setModalQty(modalQty + 1)}>+</button>
                    </div>
                  </div>
                  
                  <div className="item-detail-notes-box">
                    <label className="item-detail-section-title">Special Notes</label>
                    <textarea 
                      rows="2" 
                      placeholder="e.g. Less spicy, no onion..." 
                      value={itemNote}
                      onChange={(e) => setItemNote(e.target.value)}
                    />
                  </div>
                  
                  <button 
                    className="welcome-btn" 
                    onClick={handleAddFromModal}
                    style={{ background: 'var(--primary)', color: '#fff', padding: '14px', borderRadius: '12px', fontWeight: '800' }}
                  >
                    Add to Cart • ₹{selectedItem.price * modalQty}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
