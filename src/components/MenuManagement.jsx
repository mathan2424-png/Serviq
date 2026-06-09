import React, { useState } from 'react'
import { Plus, Search, Edit2, Trash2, X, Eye, ArrowLeft, AlertTriangle, Upload } from 'lucide-react'

export default function MenuManagement({ menuItems, onUpdateMenuItem, onDeleteMenuItem, onAddMenuItem, showToast }) {
  const [selectedCategory, setSelectedCategory] = useState('All Items')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingItem, setEditingItem] = useState(null) // holds item currently being edited or 'new' for adding new
  const [viewingItem, setViewingItem] = useState(null)
  const [deletingItem, setDeletingItem] = useState(null) // holds item pending delete confirmation
  const [formErrors, setFormErrors] = useState({})
  const [categoryFormErrors, setCategoryFormErrors] = useState({})
  const [formState, setFormState] = useState({
    name: '',
    category: 'Mains',
    price: '',
    description: '',
    available: true,
    image: ''
  })

  // Categories list with counts
  const [categories, setCategories] = useState(['All Items', 'Starters', 'Mains', 'Desserts', 'Drinks'])
  const [addingCategory, setAddingCategory] = useState(false)
  const [categoryFormState, setCategoryFormState] = useState({
    name: '',
    image: '',
    status: 'Active',
    createdDate: new Date().toISOString().split('T')[0],
    updatedDate: new Date().toISOString().split('T')[0]
  })

  const handleSaveCategory = (e) => {
    e.preventDefault()
    
    const errors = {}
    if (!categoryFormState.name || !categoryFormState.name.trim()) errors.name = 'Category Name is Required'
    
    if (Object.keys(errors).length > 0) {
      setCategoryFormErrors(errors)
      showToast('error', 'Please fill out all required fields.')
      return
    }
    setCategoryFormErrors({})

    const formattedName = categoryFormState.name.trim()
    const capitalizedName = formattedName.charAt(0).toUpperCase() + formattedName.slice(1)

    const exists = categories.some(
      (cat) => cat.toLowerCase() === capitalizedName.toLowerCase()
    )
    if (exists) {
      showToast('error', 'Category already exists.')
      return
    }

    setCategories([...categories, capitalizedName])
    showToast('success', `Category "${capitalizedName}" added successfully!`)
    setAddingCategory(false)
    setCategoryFormErrors({})
    setCategoryFormState({
      name: '',
      image: '',
      status: 'Active',
      createdDate: new Date().toISOString().split('T')[0],
      updatedDate: new Date().toISOString().split('T')[0]
    })
  }
  const getCategoryCount = (catName) => {
    if (catName === 'All Items') return menuItems.length
    return menuItems.filter(item => item.category === catName).length
  }

  // Filtered menu items list
  const filteredItems = menuItems.filter(item => {
    const matchesCategory = selectedCategory === 'All Items' || item.category === selectedCategory
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Set form state when edit button is clicked
  const handleEditClick = (item) => {
    setEditingItem(item.id)
    setFormErrors({})
    setFormState({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description,
      available: item.available,
      image: item.image || ''
    })
  }

  // Set form state for new item creation
  const handleAddNewClick = () => {
    const defaultCat = categories.length > 1 ? categories[1] : 'Mains'
    setEditingItem('new')
    setFormErrors({})
    setFormState({
      name: '',
      category: defaultCat,
      price: '',
      description: '',
      available: true,
      image: ''
    })
  }

  // Toggle availability state
  const handleToggleAvailable = (item) => {
    onUpdateMenuItem(item.id, { ...item, available: !item.available })
    showToast('info', `${item.name} is now ${!item.available ? 'Available' : 'Unavailable'}.`)
  }

  // Save changes (update existing or create new)
  const handleSave = (e) => {
    e.preventDefault()
    
    const errors = {}
    if (!formState.name || !formState.name.trim()) errors.name = 'Item Name is Required'
    
    let priceNum;
    if (!formState.price) {
      errors.price = 'Price is Required'
    } else {
      priceNum = parseFloat(formState.price)
      if (isNaN(priceNum)) errors.price = 'Price must be a valid number'
      else if (priceNum < 0) errors.price = 'Price cannot be negative'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      showToast('error', 'Please fill out all required fields correctly.')
      return
    }
    setFormErrors({})

    if (editingItem === 'new') {
      onAddMenuItem({
        name: formState.name,
        category: formState.category,
        price: priceNum,
        description: formState.description,
        available: formState.available,
        image: formState.image
      })
      showToast('success', 'New menu item added successfully!')
    } else {
      onUpdateMenuItem(editingItem, {
        name: formState.name,
        category: formState.category,
        price: priceNum,
        description: formState.description,
        available: formState.available,
        image: formState.image
      })
      showToast('success', 'Menu item details updated successfully!')
    }

    setEditingItem(null)
  }

  return (
    <>
      <style>{`
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
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .status-tab-btn:hover {
          color: var(--text-main);
          background-color: var(--bg-app);
        }

        .status-tab-btn.active {
          background-color: var(--text-main);
          color: var(--bg-card);
        }

        .category-count-badge {
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 6px;
          border-radius: 4px;
          background-color: var(--bg-app);
          color: var(--text-muted);
          transition: all var(--transition-fast);
        }
        
        .status-tab-btn.active .category-count-badge {
          background-color: var(--primary-light);
          color: var(--primary);
        }
      `}</style>

      {/* Header/Breadcrumbs when in Add Category, Edit or View sub-pages */}
      {addingCategory ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '24px 30px 0' }}>
          <button
            onClick={() => setAddingCategory(false)}
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
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Menu Registry</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Add New Category
            </h2>
          </div>
        </div>
      ) : editingItem ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '24px 30px 0' }}>
          <button
            onClick={() => setEditingItem(null)}
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
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Menu Registry</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              {editingItem === 'new' ? 'Add New Menu Item' : 'Edit Menu Item'}
            </h2>
          </div>
        </div>
      ) : viewingItem ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', padding: '24px 30px 0' }}>
          <button
            onClick={() => setViewingItem(null)}
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
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.5px' }}>Menu Registry</span>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
              Dish Showcase: {viewingItem.name}
            </h2>
          </div>
        </div>
      ) : null}

      <div className="menu-workspace-grid animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px 30px' }}>
        {addingCategory ? (
          /* Inline Add Category Form Page - Full Width */
          <div className="glass-card animate-fade-in" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: 'var(--shadow-md)',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <form onSubmit={handleSaveCategory} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label style={{ color: categoryFormErrors.name ? '#dc2626' : 'inherit' }}>Category Name</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={categoryFormState.name}
                      onChange={(e) => {
                        setCategoryFormState({ ...categoryFormState, name: e.target.value })
                        if (categoryFormErrors.name) setCategoryFormErrors({ ...categoryFormErrors, name: null })
                      }}
                      placeholder="e.g. Desserts"
                      style={{ border: categoryFormErrors.name ? '1px solid #dc2626' : undefined, paddingRight: categoryFormErrors.name ? '36px' : undefined, width: '100%', boxSizing: 'border-box' }}
                    />
                    {categoryFormErrors.name && <AlertTriangle style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#dc2626', width: '16px', height: '16px' }} />}
                  </div>
                  {categoryFormErrors.name && <span style={{ color: '#dc2626', fontSize: '0.7rem', marginTop: '4px', display: 'block' }}>{categoryFormErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={categoryFormState.status}
                    onChange={(e) => setCategoryFormState({ ...categoryFormState, status: e.target.value })}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>


              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px' }}>Category Image</label>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {/* Photo Preview Box */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: '#f1f5f9',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {categoryFormState.image ? (
                      <img src={categoryFormState.image} alt="Category Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', fontWeight: '800', textAlign: 'center', lineHeight: '1.2' }}>No<br />Photo</span>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label className="btn-outline" style={{
                      margin: 0,
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <Upload style={{ width: '14px', height: '14px' }} /> Upload Local Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              setCategoryFormState({ ...categoryFormState, image: reader.result })
                              showToast('success', `Local image "${file.name}" loaded!`)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {categoryFormState.image && (
                      <button
                        type="button"
                        onClick={() => setCategoryFormState({ ...categoryFormState, image: '' })}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          padding: '6px 12px'
                        }}
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>

                {/* Clickable Quick Presets Row */}
                <div style={{ marginTop: '16px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Or Tap a Preset Food Photo</span>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 0' }}>
                    {[
                      { label: 'Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
                      { label: 'Dosa', url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=60' },
                      { label: 'Dessert', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60' },
                      { label: 'Chai/Soda', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60' },
                      { label: 'Bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60' }
                    ].map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setCategoryFormState({ ...categoryFormState, image: preset.url })}
                        style={{
                          background: 'var(--bg-app)',
                          border: categoryFormState.image === preset.url ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s',
                          boxShadow: categoryFormState.image === preset.url ? '0 2px 6px rgba(234, 88, 12, 0.15)' : 'none',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ color: categoryFormState.image === preset.url ? 'var(--primary)' : 'var(--text-main)' }}>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="menu-form-actions" style={{ maxWidth: '400px', display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn-black" style={{ flex: 1, padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#000000', color: '#ffffff', border: 'none' }}>Add Category</button>
                <button type="button" className="btn-outline" style={{ flex: 1, padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#ffffff', color: '#64748b', border: '1px solid #cbd5e1' }} onClick={() => setAddingCategory(false)}>Cancel</button>
              </div>
            </form>
          </div>
        ) : editingItem ? (
          /* Inline Edit/Add Form Page - Full Width */
          <div className="glass-card animate-fade-in" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: 'var(--shadow-md)',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <form onSubmit={handleSave} noValidate>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label style={{ color: formErrors.name ? '#dc2626' : 'inherit' }}>Item Name</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="text"
                      value={formState.name}
                      onChange={(e) => {
                        setFormState({ ...formState, name: e.target.value })
                        if (formErrors.name) setFormErrors({ ...formErrors, name: null })
                      }}
                      placeholder="e.g. Garlic Bread"
                      style={{ border: formErrors.name ? '1px solid #dc2626' : undefined, paddingRight: formErrors.name ? '36px' : undefined, width: '100%', boxSizing: 'border-box' }}
                    />
                    {formErrors.name && <AlertTriangle style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#dc2626', width: '16px', height: '16px' }} />}
                  </div>
                  {formErrors.name && <span style={{ color: '#dc2626', fontSize: '0.7rem', marginTop: '4px', display: 'block' }}>{formErrors.name}</span>}
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    value={formState.category}
                    onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                  >
                    {categories.filter(cat => cat !== 'All Items').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div className="form-group">
                  <label style={{ color: formErrors.price ? '#dc2626' : 'inherit' }}>Price (₹)</label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type="number"
                      min="0"
                      value={formState.price}
                      onChange={(e) => {
                        setFormState({ ...formState, price: e.target.value })
                        if (formErrors.price) setFormErrors({ ...formErrors, price: null })
                      }}
                      placeholder="320"
                      style={{ border: formErrors.price ? '1px solid #dc2626' : undefined, paddingRight: formErrors.price ? '36px' : undefined, width: '100%', boxSizing: 'border-box' }}
                    />
                    {formErrors.price && <AlertTriangle style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#dc2626', width: '16px', height: '16px' }} />}
                  </div>
                  {formErrors.price && <span style={{ color: '#dc2626', fontSize: '0.7rem', marginTop: '4px', display: 'block' }}>{formErrors.price}</span>}
                </div>

                <div className="form-group">
                  <label className="switch-label" style={{ marginTop: '26px' }}>
                    <input
                      type="checkbox"
                      className="switch-input"
                      checked={formState.available}
                      onChange={(e) => setFormState({ ...formState, available: e.target.checked })}
                    />
                    <div className="switch-track">
                      <div className="switch-thumb"></div>
                    </div>
                    <span>Initial Status: {formState.available ? 'Available' : 'Unavailable'}</span>
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formState.description}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  placeholder="Write description here..."
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', marginBottom: '8px' }}>Dish Image</label>

                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {/* Photo Preview Box */}
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    background: '#f1f5f9',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {formState.image ? (
                      <img src={formState.image} alt="Dish Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-light)', fontWeight: '800', textAlign: 'center', lineHeight: '1.2' }}>No<br />Photo</span>
                    )}
                  </div>

                  {/* Upload Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label className="btn-outline" style={{
                      margin: 0,
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <Upload style={{ width: '14px', height: '14px' }} /> Upload Local Photo
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0]
                          if (file) {
                            const reader = new FileReader()
                            reader.onloadend = () => {
                              setFormState({ ...formState, image: reader.result })
                              showToast('success', `Local image "${file.name}" loaded!`)
                            }
                            reader.readAsDataURL(file)
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {formState.image && (
                      <button
                        type="button"
                        onClick={() => setFormState({ ...formState, image: '' })}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          fontSize: '0.8rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          padding: '6px 12px'
                        }}
                      >
                        Remove Photo
                      </button>
                    )}
                  </div>
                </div>

                {/* Clickable Quick Presets Row */}
                <div style={{ marginTop: '16px' }}>
                  <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Or Tap a Preset Food Photo</span>
                  <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', padding: '4px 0' }}>
                    {[
                      { label: 'Biryani', url: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=60' },
                      { label: 'Dosa', url: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=60' },
                      { label: 'Dessert', url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60' },
                      { label: 'Chai/Soda', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60' },
                      { label: 'Bread', url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=60' }
                    ].map((preset, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setFormState({ ...formState, image: preset.url })}
                        style={{
                          background: 'var(--bg-app)',
                          border: formState.image === preset.url ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '0.75rem',
                          fontWeight: '600',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s',
                          boxShadow: formState.image === preset.url ? '0 2px 6px rgba(234, 88, 12, 0.15)' : 'none',
                          flexShrink: 0
                        }}
                      >
                        <img
                          src={preset.url}
                          alt={preset.label}
                          style={{ width: '18px', height: '18px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ color: formState.image === preset.url ? 'var(--primary)' : 'var(--text-main)' }}>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="menu-form-actions" style={{ maxWidth: '400px', display: 'flex', gap: '12px', marginTop: '24px' }}>
                <button type="submit" className="btn-black" style={{ flex: 1, padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#000000', color: '#ffffff', border: 'none' }}>Save Changes</button>
                <button type="button" className="btn-outline" style={{ flex: 1, padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#ffffff', color: '#64748b', border: '1px solid #cbd5e1' }} onClick={() => setEditingItem(null)}>Cancel</button>
              </div>
            </form>
          </div>
        ) : viewingItem ? (
          /* Inline View Showcase Page - Full Width */
          <div className="glass-card animate-fade-in" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: 'var(--shadow-md)',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px' }}>
              {/* Left: Image / Quick info */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {viewingItem.image ? (
                  <div style={{ width: '100%', height: '240px', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                    <img src={viewingItem.image} alt={viewingItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ) : (
                  <div style={{ width: '100%', height: '240px', borderRadius: '12px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 'bold', color: 'var(--text-muted)' }}>
                    {viewingItem.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                )}

                <div style={{
                  background: 'var(--bg-app)',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Category</span>
                    <span className="badge badge-new" style={{ fontSize: '0.75rem', textTransform: 'capitalize' }}>{viewingItem.category}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Price</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--primary)' }}>₹{viewingItem.price}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Status</span>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: '800',
                      color: viewingItem.available ? '#10b981' : '#ef4444',
                      background: viewingItem.available ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {viewingItem.available ? 'AVAILABLE' : 'OUT OF STOCK'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right: Description & Actions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', margin: '0 0 16px 0' }}>
                    {viewingItem.name}
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Description</span>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', lineHeight: '1.6', margin: 0, background: 'var(--bg-app)', padding: '20px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      {viewingItem.description || 'No description provided for this menu item.'}
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                  <button
                    className="btn-black"
                    style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
                    onClick={() => setViewingItem(null)}
                  >
                    Back to Registry
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Normal List View */
          <>
            {/* Categories Tabs Row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <div className="status-tabs-container">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    className={`status-tab-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    <span>{cat}</span>
                    <span className="category-count-badge">
                      {getCategoryCount(cat)}
                    </span>
                  </button>
                ))}
              </div>

              <button
                className="btn-outline"
                style={{ fontSize: '0.8rem', padding: '8px 16px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', height: '42px', borderRadius: '10px' }}
                onClick={() => {
                  setAddingCategory(true)
                  setCategoryFormErrors({})
                  setCategoryFormState({
                    name: '',
                    image: '',
                    status: 'Active',
                    createdDate: new Date().toISOString().split('T')[0],
                    updatedDate: new Date().toISOString().split('T')[0]
                  })
                }}
              >
                <Plus style={{ width: '14px', height: '14px' }} />
                Add Category
              </button>
            </div>

            {/* Main Items Section */}
            <div className="menu-items-section" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px' }}>
                <div className="menu-search-bar" style={{ flex: 1 }}>
                  <Search style={{ width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search menu items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="btn-black" style={{ display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap' }} onClick={handleAddNewClick}>
                  <Plus style={{ width: '16px', height: '16px' }} />
                  Add New Item
                </button>
              </div>

              {/* Dish List Table UI */}
              <div className="dish-admin-list" style={{ overflowX: 'auto', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                {filteredItems.length === 0 ? (
                  <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No dishes found matching selection.
                  </div>
                ) : (
                  <table className="menu-data-table">
                    <thead>
                      <tr>
                        <th style={{ width: '50px', textAlign: 'center' }}>S.No</th>
                        <th>Menu Item</th>
                        <th style={{ width: '100px' }}>Category</th>
                        <th style={{ width: '80px' }}>Price</th>
                        <th style={{ width: '120px' }}>Status</th>
                        <th style={{ width: '130px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredItems.map((item, index) => (
                        <tr key={item.id}>
                          <td style={{ textAlign: 'center', fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)' }}>{index + 1}</td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div className="dish-admin-img" style={{ width: '42px', height: '42px', flexShrink: 0, padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                {item.image ? (
                                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                  item.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
                                )}
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                                <h4 style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--text-main)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h4>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>{item.description}</p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge badge-new" style={{ fontSize: '0.65rem', textTransform: 'capitalize', display: 'inline-block' }}>{item.category}</span>
                          </td>
                          <td style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.9rem' }}>₹{item.price}</td>
                          <td>
                            <label className="switch-label" style={{ margin: 0, gap: '6px' }}>
                              <input
                                type="checkbox"
                                className="switch-input"
                                checked={item.available}
                                onChange={() => handleToggleAvailable(item)}
                              />
                              <div className="switch-track" style={{ width: '28px', height: '16px' }}>
                                <div className="switch-thumb" style={{ width: '12px', height: '12px' }}></div>
                              </div>
                            </label>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                              onClick={() => setViewingItem(item)}
                              title="View Item Details"
                              onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                              <Eye style={{ width: '16px', height: '16px' }} />
                            </button>
                            <button
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--text-muted)', transition: 'color 0.2s' }}
                              onClick={() => handleEditClick(item)}
                              title="Edit Item"
                              onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                              onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            >
                              <Edit2 style={{ width: '16px', height: '16px' }} />
                            </button>
                            <button
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#ef4444', transition: 'opacity 0.2s' }}
                              onClick={() => setDeletingItem(item)}
                              title="Delete Item"
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
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deletingItem && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(9, 13, 22, 0.45)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1100,
            padding: '20px'
          }}
          onClick={() => setDeletingItem(null)}
        >
          <div
            className="animate-fade-in"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              padding: '36px 32px 28px',
              width: '90%',
              maxWidth: '440px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 12px', fontSize: '1.15rem', fontWeight: '800', color: 'var(--text-main)' }}>
              Delete Menu Item
            </h3>
            <p style={{ margin: '0 0 28px', fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              Are you sure you want to permanently delete this menu item from the SimStudio registry? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setDeletingItem(null)}
                style={{
                  flex: 1,
                  padding: '13px 0',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'background 0.18s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--bg-app)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'var(--bg-card)'}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDeleteMenuItem(deletingItem.id)
                  showToast('success', `"${deletingItem.name}" has been deleted.`)
                  setDeletingItem(null)
                }}
                style={{
                  flex: 1,
                  padding: '13px 0',
                  borderRadius: '12px',
                  border: 'none',
                  background: '#ef4444',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.95rem',
                  cursor: 'pointer',
                  transition: 'background 0.18s'
                }}
                onMouseOver={(e) => e.currentTarget.style.background = '#dc2626'}
                onMouseOut={(e) => e.currentTarget.style.background = '#ef4444'}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
