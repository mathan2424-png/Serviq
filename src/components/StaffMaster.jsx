import React, { useState } from 'react'
import { Plus, Search, Edit2, Trash2, X, Key, Shield, UserCheck, Smartphone, Eye, ArrowLeft } from 'lucide-react'

export default function StaffMaster({ staffMembers, onUpdateStaffMember, onDeleteStaffMember, onAddStaffMember, showToast }) {
  const [selectedRole, setSelectedRole] = useState('All Staff')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingStaffId, setEditingStaffId] = useState(null) // holds ID or 'new'
  const [viewingStaff, setViewingStaff] = useState(null)
  const [formState, setFormState] = useState({
    name: '',
    role: 'kitchen',
    email: '',
    position: '',
    phone: '',
    status: 'Active'
  })

  // Role selections
  const roles = ['All Staff', 'kitchen', 'waiter']
  const getRoleLabel = (r) => {
    if (r === 'All Staff') return 'All Staff'
    if (r === 'kitchen') return 'KDS Terminals'
    if (r === 'waiter') return 'Waiter Apps'
    return r
  }

  const getRoleCount = (roleName) => {
    if (roleName === 'All Staff') return staffMembers.length
    return staffMembers.filter(s => s.role === roleName).length
  }

  // Filtered list
  const filteredStaff = staffMembers.filter(s => {
    const matchesRole = selectedRole === 'All Staff' || s.role === selectedRole
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (s.position && s.position.toLowerCase().includes(searchQuery.toLowerCase())) ||
                          (s.phone && s.phone.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesRole && matchesSearch
  })

  // Set form state when edit button is clicked
  const handleEditClick = (staff) => {
    setEditingStaffId(staff.id)
    setFormState({
      name: staff.name,
      role: staff.role,
      email: staff.email,
      position: staff.position || '',
      phone: staff.phone || '',
      status: staff.status || 'Active'
    })
  }

  // Set form state for new item creation
  const handleAddNewClick = () => {
    setEditingStaffId('new')
    setFormState({
      name: '',
      role: 'kitchen',
      email: '',
      position: '',
      phone: '',
      status: 'Active'
    })
  }

  // Toggle status
  const handleToggleStatus = (staff) => {
    const nextStatus = staff.status === 'Active' ? 'Inactive' : 'Active'
    onUpdateStaffMember(staff.id, { ...staff, status: nextStatus })
    showToast('info', `${staff.name} status set to ${nextStatus}.`)
  }

  // Save changes
  const handleSave = (e) => {
    e.preventDefault()
    const isWaiter = formState.role === 'waiter'
    if (!formState.name || !formState.email || (!isWaiter && !formState.position) || !formState.phone) {
      showToast('error', `Please fill out all fields: Name, Email, ${isWaiter ? '' : 'Position, '}and Phone Number.`)
      return
    }

    if (editingStaffId === 'new') {
      onAddStaffMember({
        name: formState.name,
        role: formState.role,
        email: formState.email,
        position: isWaiter ? (formState.position || 'Waiter') : formState.position,
        phone: formState.phone,
        status: formState.status
      })
      showToast('success', 'New staff profile added successfully!')
    } else {
      onUpdateStaffMember(editingStaffId, {
        name: formState.name,
        role: formState.role,
        email: formState.email,
        position: isWaiter ? (formState.position || 'Waiter') : formState.position,
        phone: formState.phone,
        status: formState.status
      })
      showToast('success', 'Staff profile updated successfully!')
    }

    setEditingStaffId(null)
  }

  return (
    <>
      <div className="menu-workspace-grid animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px 30px' }}>
        
        {/* Header/Breadcrumbs when in Edit or View sub-pages */}
        {editingStaffId ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <button 
              onClick={() => setEditingStaffId(null)}
              style={{
                background: 'none',
                border: 'none',
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
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Staff Registry</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                {editingStaffId === 'new' ? 'Register New Staff Terminal' : 'Update Terminal Credentials'}
              </h2>
            </div>
          </div>
        ) : viewingStaff ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <button 
              onClick={() => setViewingStaff(null)}
              style={{
                background: 'none',
                border: 'none',
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
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Staff Registry</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Staff Profile Showcase
              </h2>
            </div>
          </div>
        ) : (
          /* Horizontal Tab Switcher in Image Style */
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '6px',
            width: 'fit-content',
            boxShadow: 'var(--shadow-sm)',
            gap: '4px'
          }}>
            {roles.map(r => {
              const isActive = selectedRole === r;
              return (
                <button
                  key={r}
                  onClick={() => setSelectedRole(r)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 20px',
                    borderRadius: '12px',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: isActive ? 'var(--bg-card)' : 'var(--text-muted)',
                    background: isActive ? 'var(--text-main)' : 'transparent',
                    transition: 'all 0.2s ease',
                    outline: 'none'
                  }}
                >
                  <span>{getRoleLabel(r)}</span>
                  <span style={{
                    fontSize: '0.75rem',
                    border: '1px solid currentColor',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    fontWeight: '700',
                    opacity: 0.8
                  }}>
                    {getRoleCount(r)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Conditional content render */}
        {editingStaffId ? (
          /* Inline Add/Edit Form page instead of popup */
          <div className="glass-card animate-fade-in" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: 'var(--shadow-md)',
            width: '100%'
          }}>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Simulated Role Type</label>
                <select 
                  value={formState.role} 
                  onChange={(e) => setFormState({ ...formState, role: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none' }}
                >
                  <option value="kitchen">Kitchen Display KDS Terminal 🍳</option>
                  <option value="waiter">Waiter Operations App 🏃</option>
                </select>
              </div>

              {formState.role === 'waiter' ? (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Waiter Full Name</label>
                      <input 
                        type="text" 
                        value={formState.name} 
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="e.g. Waiter Amit"
                        required
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none' }}
                      />
                    </div>
                    
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Simulated Email/Username</label>
                      <input 
                        type="email" 
                        value={formState.email} 
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="waiter1@serviq.com"
                        required
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Phone Number</label>
                      <input 
                        type="tel" 
                        value={formState.phone} 
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        placeholder="e.g. 9876543211"
                        required
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none' }}
                      />
                    </div>
                    <div />
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Kitchen Staff Full Name</label>
                      <input 
                        type="text" 
                        value={formState.name} 
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="e.g. Chef Rajesh"
                        required
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none' }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Chef Position / Title</label>
                      <input 
                        type="text" 
                        value={formState.position} 
                        onChange={(e) => setFormState({ ...formState, position: e.target.value })}
                        placeholder="e.g. Head Chef, Sous Chef"
                        required
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none' }}
                      />
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>KDS Terminal Login (Email)</label>
                      <input 
                        type="email" 
                        value={formState.email} 
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                        placeholder="chef@serviq.com"
                        required
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none' }}
                      />
                    </div>

                    <div className="form-group" style={{ margin: 0 }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>Phone Number</label>
                      <input 
                        type="tel" 
                        value={formState.phone} 
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                        placeholder="e.g. 9876543210"
                        required
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', borderRadius: '8px', outline: 'none' }}
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="menu-form-actions" style={{ display: 'flex', flexDirection: 'row', gap: '16px', marginTop: '24px', maxWidth: '400px' }}>
                <button type="submit" className="btn-black" style={{ flex: 1, padding: '12px', fontWeight: '700', borderRadius: '8px', cursor: 'pointer' }}>
                  {editingStaffId === 'new' ? 'Register Terminal' : 'Save Credentials'}
                </button>
                <button type="button" className="btn-outline" onClick={() => setEditingStaffId(null)} style={{ flex: 1, padding: '12px', fontWeight: '700', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        ) : viewingStaff ? (
          /* Inline View Profile Showcase instead of popup */
          <div className="glass-card animate-fade-in" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: 'var(--shadow-md)',
            width: '100%'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
              {/* Profile Card Left */}
              <div style={{
                background: 'var(--bg-app)',
                padding: '28px 20px',
                borderRadius: '12px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                gap: '16px',
                height: 'fit-content'
              }}>
                <div style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  background: viewingStaff.role === 'kitchen' ? 'var(--primary-light)' : '#f1f5f9',
                  color: viewingStaff.role === 'kitchen' ? 'var(--primary)' : '#475569',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  fontWeight: '800',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  {viewingStaff.role === 'kitchen' ? '🍳' : '🏃'}
                </div>
                <div>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 4px 0' }}>{viewingStaff.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '700', textTransform: 'uppercase' }}>{viewingStaff.position || 'Staff member'}</span>
                </div>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  color: viewingStaff.status === 'Active' ? '#10b981' : '#ef4444',
                  background: viewingStaff.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                  padding: '4px 12px',
                  borderRadius: '12px',
                  textTransform: 'uppercase'
                }}>
                  {viewingStaff.status}
                </div>
              </div>

              {/* Profile Details Right */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px', margin: 0 }}>Terminal Connection Profile</h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Role Classification</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '700' }}>
                      {viewingStaff.role === 'kitchen' ? '🍳 Kitchen KDS' : '🏃 Waiter Operations'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Simulated Login Email</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontFamily: 'monospace', fontWeight: '700' }}>{viewingStaff.email}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Simulated Password</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontFamily: 'monospace', fontWeight: '800' }}>password123</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Phone Connection</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '700' }}>{viewingStaff.phone || 'Not Configured'}</span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Terminal ID Reference</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontFamily: 'monospace', fontWeight: '700' }}>#TRM-{viewingStaff.id}</span>
                  </div>
                </div>

                <div style={{ marginTop: '20px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button 
                    className="btn-outline" 
                    style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
                    onClick={() => {
                      const currentViewing = viewingStaff;
                      setViewingStaff(null);
                      handleEditClick(currentViewing);
                    }}
                  >
                    Edit Credentials
                  </button>
                  <button 
                    className="btn-black" 
                    style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
                    onClick={() => setViewingStaff(null)}
                  >
                    Back to Registry
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Normal List View (Search bar and table) */
          <div className="menu-items-section" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
              <div className="menu-search-bar" style={{ 
                flex: 1, 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px', 
                background: 'var(--bg-card)', 
                border: '1px solid var(--border-color)', 
                borderRadius: '10px', 
                padding: '8px 14px' 
              }}>
                <Search style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search staff registry by name or email..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: 'none', border: 'none', color: 'var(--text-main)', fontSize: '0.85rem', width: '100%', outline: 'none' }}
                />
              </div>
              
              <button 
                className="btn-black" 
                style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap', borderRadius: '10px', padding: '10px 16px', cursor: 'pointer' }} 
                onClick={handleAddNewClick}
              >
                <Plus style={{ width: '16px', height: '16px' }} />
                Register Staff Terminal
              </button>
            </div>

            {/* Staff Table Grid */}
            <div style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', boxShadow: 'var(--shadow-sm)' }}>
              {filteredStaff.length === 0 ? (
                <div style={{ padding: '60px 40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No staff members registered matching selection.
                </div>
              ) : (
                <table className="menu-data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ textAlign: 'center', padding: '14px 12px', fontSize: '0.8rem', color: 'var(--text-muted)', width: '50px' }}>S.No</th>
                      <th style={{ textAlign: 'left', padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>Staff Member</th>
                      <th style={{ textAlign: 'left', padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', width: '140px' }}>Role</th>
                      <th style={{ textAlign: 'left', padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', width: '220px' }}>Contact Info</th>
                      <th style={{ textAlign: 'left', padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', width: '100px' }}>Status</th>
                      <th style={{ textAlign: 'right', padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', width: '140px' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.map((staff, index) => (
                      <tr key={staff.id} style={{ borderBottom: '1px solid var(--border-color)', lastChild: { borderBottom: 'none' } }}>
                        <td style={{ padding: '14px 12px', textAlign: 'center', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>{index + 1}</td>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                              width: '38px',
                              height: '38px',
                              borderRadius: '50%',
                              background: staff.role === 'kitchen' ? 'var(--primary-light)' : '#f1f5f9',
                              color: staff.role === 'kitchen' ? 'var(--primary)' : '#475569',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: '800',
                              fontSize: '0.8rem',
                              flexShrink: 0
                            }}>
                              {staff.role === 'kitchen' ? <Shield style={{ width: '16px', height: '16px' }} /> : <Smartphone style={{ width: '16px', height: '16px' }} />}
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                              <h4 style={{ fontSize: '0.9rem', fontWeight: '800', color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap' }}>{staff.name}</h4>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>•</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600', margin: 0, whiteSpace: 'nowrap' }}>{staff.position || 'Staff'}</span>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <span className="badge badge-new" style={{
                            fontSize: '0.65rem',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            background: staff.role === 'kitchen' ? 'rgba(234,88,12,0.1)' : 'rgba(59,130,246,0.1)',
                            color: staff.role === 'kitchen' ? 'var(--primary)' : '#2563eb'
                          }}>
                            {staff.role === 'kitchen' ? 'Kitchen KDS' : 'Waiter App'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-main)', fontFamily: 'monospace' }}>{staff.email}</span>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{staff.phone || 'N/A'}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 18px' }}>
                          <label className="switch-label" style={{ margin: 0, gap: '6px' }}>
                            <input 
                              type="checkbox" 
                              className="switch-input"
                              checked={staff.status === 'Active'}
                              onChange={() => handleToggleStatus(staff)}
                            />
                            <div className="switch-track" style={{ width: '28px', height: '16px', background: staff.status === 'Active' ? 'black' : '#cbd5e1' }}>
                              <div className="switch-thumb" style={{ width: '12px', height: '12px', left: staff.status === 'Active' ? '13px' : '3px' }}></div>
                            </div>
                            <span style={{ fontSize: '0.75rem', minWidth: '40px', color: staff.status === 'Active' ? 'var(--text-main)' : 'var(--text-muted)' }}>{staff.status}</span>
                          </label>
                        </td>
                        <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                          <button 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                            onClick={() => setViewingStaff(staff)}
                            title="View Staff Details"
                            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                          >
                            <Eye style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                            onClick={() => handleEditClick(staff)}
                            title="Edit Staff Terminal"
                            onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                          >
                            <Edit2 style={{ width: '16px', height: '16px' }} />
                          </button>
                          <button 
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#ef4444', transition: 'opacity 0.2s' }}
                            onClick={() => onDeleteStaffMember(staff.id)}
                            title="Delete Terminal Registration"
                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            <Trash2 style={{ width: '16px', height: '16px' }} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
