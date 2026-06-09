import React, { useState } from 'react'
import {
  Building,
  CreditCard,
  Activity,
  FileText,
  CheckCircle,
  RefreshCw,
  TrendingUp,
  Settings,
  AlertTriangle,
  Save,
  Percent,
  ShieldCheck,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Clock,
  FileSpreadsheet,
  ArrowRight,
  Plus,
  Trash2,
  Edit2,
  Eye,
  Users,
  Lock,
  Unlock,
  Key,
  Layers,
  ChevronDown,
  Crown,
  X,
  Gem,
  Award,
  Star
} from 'lucide-react'

export default function SuperAdminDashboard({
  restaurantDetails,
  onUpdateRestaurantDetails,
  orders = [],
  tables = [],
  menuItems = [],
  staffMembers = [],
  stats = {},
  showToast,
  onUpdateTables,
  onUpdateOrders,
  activeTab: propActiveTab = 'details',
  isMerged = false,
  restaurants = [],
  activeRestaurantId,
  onSetActiveRestaurantId,
  onUpdateRestaurants,
  restaurantAdmins = [],
  onUpdateRestaurantAdmins
}) {
  const [activeTabState, setActiveTabState] = useState('details')
  const activeTab = isMerged ? propActiveTab : activeTabState
  const setActiveTab = isMerged ? () => { } : setActiveTabState
  const [formState, setFormState] = useState({ ...restaurantDetails })
  const [usersDropdownOpen, setUsersDropdownOpen] = useState(false)
  const [formErrors, setFormErrors] = useState({})

  React.useEffect(() => {
    if (activeTab === 'admins' || activeTab === 'roles') {
      setUsersDropdownOpen(true)
    }
  }, [activeTab])

  // Edit / View restaurant states
  const [editingRestId, setEditingRestId] = useState(null)
  const [viewingRestId, setViewingRestId] = useState(null)
  const [viewingPerfRestId, setViewingPerfRestId] = useState(null)
  const [editFormState, setEditFormState] = useState(null)
  const [hoveredRestBtnId, setHoveredRestBtnId] = useState(null)

  // Restaurant Admin states
  const [showAddAdminModal, setShowAddAdminModal] = useState(false)
  const [editingAdminId, setEditingAdminId] = useState(null)
  const [resettingPasswordAdminId, setResettingPasswordAdminId] = useState(null)
  const [adminFormState, setAdminFormState] = useState({
    name: '',
    email: '',
    phone: '',
    restaurantName: '',
    role: 'Branch Admin',
    status: 'Active',
    password: ''
  })
  const [plans, setPlans] = useState([
    { id: 'plan-standard', name: 'Standard Plan', monthlyPrice: 1999, annualPrice: 19999, branchLimit: 2, userLimit: 5, orderLimit: 1000, features: ['QR Menu Seating', 'Live Orders', 'Waiter Apps', 'Kitchen KDS'], status: 'Active' },
    { id: 'plan-premium', name: 'Premium Plan', monthlyPrice: 4999, annualPrice: 49999, branchLimit: 5, userLimit: 15, orderLimit: 5000, features: ['QR Menu Seating', 'Live Orders', 'Waiter Apps', 'Kitchen KDS', 'Advanced Billing System', 'Live Analytics Deck'], status: 'Active' },
    { id: 'plan-enterprise', name: 'Enterprise Plan', monthlyPrice: 9999, annualPrice: 99999, branchLimit: 99999, userLimit: 99999, orderLimit: 99999, features: ['QR Menu Seating', 'Live Orders', 'Waiter Apps', 'Kitchen KDS', 'Advanced Billing System', 'Live Analytics Deck', 'Multi-Branch Super Deck', '24/7 Dedicated Support'], status: 'Active' }
  ])
  const [editingPlanId, setEditingPlanId] = useState(null)
  const [planFormState, setPlanFormState] = useState({
    name: '',
    monthlyPrice: 0,
    annualPrice: 0,
    branchLimit: 1,
    userLimit: 5,
    orderLimit: 1000,
    features: '',
    status: 'Active'
  })
  const [changingPlanRestId, setChangingPlanRestId] = useState(null)

  // Revenue & Billing states
  const [invoices, setInvoices] = useState([
    { id: 'INV-2026-001', restaurantName: 'Serviq', subscriptionPlan: 'Premium Plan', amount: 4999, paymentMethod: 'UPI', paymentDate: '2026-06-01', dueDate: '2026-07-01', status: 'Paid' },
    { id: 'INV-2026-002', restaurantName: 'Sunset Diner', subscriptionPlan: 'Standard Plan', amount: 1999, paymentMethod: 'Credit Card', paymentDate: '2026-05-28', dueDate: '2026-06-28', status: 'Paid' },
    { id: 'INV-2026-003', restaurantName: 'Ocean Breeze Grill', subscriptionPlan: 'Enterprise Plan', amount: 9999, paymentMethod: 'Net Banking', paymentDate: '', dueDate: '2026-06-15', status: 'Pending' },
    { id: 'INV-2026-004', restaurantName: 'Mountain Lodge Cafe', subscriptionPlan: 'Premium Plan', amount: 4999, paymentMethod: 'UPI', paymentDate: '2026-05-15', dueDate: '2026-06-15', status: 'Refunded' },
    { id: 'INV-2026-005', restaurantName: 'Downtown Bakery', subscriptionPlan: 'Free Plan', amount: 0, paymentMethod: 'N/A', paymentDate: '2026-05-20', dueDate: '2026-06-20', status: 'Paid' }
  ])
  const [showGenerateInvoiceModal, setShowGenerateInvoiceModal] = useState(false)
  const [newInvoiceFormState, setNewInvoiceFormState] = useState({
    restaurantName: '',
    subscriptionPlan: 'Standard Plan',
    amount: 1999,
    paymentMethod: 'UPI',
    paymentDate: '',
    dueDate: '',
    status: 'Paid'
  })
  const [viewingInvoice, setViewingInvoice] = useState(null)
  const [refundModalInvoice, setRefundModalInvoice] = useState(null)
  const [refundReason, setRefundReason] = useState('')
  const [invoiceSearchQuery, setInvoiceSearchQuery] = useState('')
  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState('All')
  const [passwordResetValue, setPasswordResetValue] = useState('')
  const [passwordConfirmValue, setPasswordConfirmValue] = useState('')
  const [confirmModal, setConfirmModal] = useState(null)


  const handleCreatePlan = (e) => {
    e.preventDefault()

    const errors = {}
    const requiredFields = {
      name: 'Plan Name',
      monthlyPrice: 'Monthly Price',
      annualPrice: 'Annual Price',
      branchLimit: 'Branch Limit',
      userLimit: 'User Limit',
      orderLimit: 'Order Limit',
      features: 'Features'
    }

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!planFormState[field] || String(planFormState[field]).trim() === '') {
        errors[field] = `${label} is Required`
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})

    const nextPlanId = `plan-${planFormState.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    const newPlan = {
      id: nextPlanId,
      name: planFormState.name,
      monthlyPrice: parseFloat(planFormState.monthlyPrice) || 0,
      annualPrice: parseFloat(planFormState.annualPrice) || 0,
      branchLimit: parseInt(planFormState.branchLimit) || 1,
      userLimit: parseInt(planFormState.userLimit) || 1,
      orderLimit: parseInt(planFormState.orderLimit) || 1,
      features: planFormState.features.split(',').map(f => f.trim()).filter(Boolean),
      status: planFormState.status
    }
    setPlans([...plans, newPlan])
    setEditingPlanId(null)
    showToast('success', `Subscription plan "${newPlan.name}" created successfully!`)
  }

  const handleModifyPlan = (e) => {
    e.preventDefault()

    const errors = {}
    const requiredFields = {
      name: 'Plan Name',
      monthlyPrice: 'Monthly Price',
      annualPrice: 'Annual Price',
      branchLimit: 'Branch Limit',
      userLimit: 'User Limit',
      orderLimit: 'Order Limit',
      features: 'Features'
    }

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!planFormState[field] || String(planFormState[field]).trim() === '') {
        errors[field] = `${label} is Required`
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})

    const updated = plans.map(p => p.id === editingPlanId ? {
      ...p,
      name: planFormState.name,
      monthlyPrice: parseFloat(planFormState.monthlyPrice) || 0,
      annualPrice: parseFloat(planFormState.annualPrice) || 0,
      branchLimit: parseInt(planFormState.branchLimit) || 1,
      userLimit: parseInt(planFormState.userLimit) || 1,
      orderLimit: parseInt(planFormState.orderLimit) || 1,
      features: planFormState.features.split(',').map(f => f.trim()).filter(Boolean),
      status: planFormState.status
    } : p)
    setPlans(updated)
    setEditingPlanId(null)
    showToast('success', `Plan "${planFormState.name}" modified successfully!`)
  }

  const handleAssignPlan = (restaurantId, planName) => {
    const updated = restaurants.map(r => r.id === restaurantId ? {
      ...r,
      subscriptionPlan: planName
    } : r)
    onUpdateRestaurants(updated)
    setChangingPlanRestId(null)
    showToast('success', `Branch plan updated to ${planName}!`)
  }

  const handleToggleAutoRenewal = (restaurant) => {
    const nextVal = !restaurant.autoRenewal
    const updated = restaurants.map(r => r.id === restaurant.id ? {
      ...r,
      autoRenewal: nextVal
    } : r)
    onUpdateRestaurants(updated)
    showToast('info', `Auto-renewal for ${restaurant.name} is now ${nextVal ? 'ENABLED' : 'DISABLED'}`)
  }

  const handleGenerateInvoiceSubmit = (e) => {
    e.preventDefault()

    const errors = {}
    const requiredFields = {
      restaurantName: 'Restaurant Name',
      subscriptionPlan: 'Subscription Plan',
      amount: 'Amount',
      status: 'Payment Status',
      dueDate: 'Due Date',
    }

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!newInvoiceFormState[field] || String(newInvoiceFormState[field]).trim() === '') {
        errors[field] = `${label} is Required`
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})

    const year = new Date().getFullYear()
    const nextNum = invoices.length > 0
      ? Math.max(...invoices.map(inv => {
        const parts = inv.id.split('-')
        return parseInt(parts[parts.length - 1]) || 0
      })) + 1
      : 1
    const nextInvId = `INV-${year}-${String(nextNum).padStart(3, '0')}`

    const newInv = {
      id: nextInvId,
      restaurantName: newInvoiceFormState.restaurantName || (restaurants[0]?.name || 'Serviq Bistro'),
      subscriptionPlan: newInvoiceFormState.subscriptionPlan,
      amount: parseFloat(newInvoiceFormState.amount) || 0,
      paymentMethod: newInvoiceFormState.status === 'Pending' ? 'N/A' : newInvoiceFormState.paymentMethod,
      paymentDate: newInvoiceFormState.status === 'Pending' ? '' : (newInvoiceFormState.paymentDate || new Date().toISOString().split('T')[0]),
      dueDate: newInvoiceFormState.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      status: newInvoiceFormState.status
    }

    setInvoices([newInv, ...invoices])
    setShowGenerateInvoiceModal(false)
    showToast('success', `Invoice ${nextInvId} generated successfully!`)

    setNewInvoiceFormState({
      restaurantName: restaurants[0]?.name || '',
      subscriptionPlan: 'Standard Plan',
      amount: 1999,
      paymentMethod: 'UPI',
      paymentDate: '',
      dueDate: '',
      status: 'Paid'
    })
  }

  const handleRefundSubmit = (e) => {
    e.preventDefault()

    const errors = {}

    if (!refundReason || String(refundReason).trim() === '') {
      errors.refundReason = "Reason for Refund is Required"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})

    if (!refundModalInvoice) return

    const updated = invoices.map(inv => inv.id === refundModalInvoice.id ? {
      ...inv,
      status: 'Refunded'
    } : inv)
    setInvoices(updated)

    showToast('success', `Refund of ₹${refundModalInvoice.amount.toLocaleString()} for ${refundModalInvoice.restaurantName} processed successfully.`)
    setRefundModalInvoice(null)
    setRefundReason('')
  }

  // Synchronize new invoice default restaurant selection
  React.useEffect(() => {
    if (restaurants.length > 0 && !newInvoiceFormState.restaurantName) {
      setNewInvoiceFormState(prev => ({ ...prev, restaurantName: restaurants[0].name }))
    }
  }, [restaurants])


  // Synchronize new admin initial restaurant assign
  React.useEffect(() => {
    if (restaurants.length > 0 && !adminFormState.restaurantName) {
      setAdminFormState(prev => ({ ...prev, restaurantName: restaurants[0].name }))
    }
  }, [restaurants])

  const handleCreateAdminSubmit = (e) => {
    e.preventDefault()

    const errors = {}
    const requiredFields = {
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Mobile Number',
      role: 'System Role',
    }

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!adminFormState[field] || String(adminFormState[field]).trim() === '') {
        errors[field] = `${label} is Required`
      }
    }

    if (!adminFormState.password || String(adminFormState.password).trim() === '') {
      errors.password = "Temporary Password is Required"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})

    const nextIdNum = restaurantAdmins.length > 0
      ? Math.max(...restaurantAdmins.map(a => parseInt(a.id.replace('ADM-', '')))) + 1
      : 4
    const newId = `ADM-${String(nextIdNum).padStart(2, '0')}`

    const newAdmin = {
      id: newId,
      name: adminFormState.name,
      email: adminFormState.email,
      phone: adminFormState.phone,
      restaurantName: adminFormState.restaurantName || restaurants[0]?.name || 'Serviq Grand Bistro',
      role: adminFormState.role,
      status: adminFormState.status,
      lastLogin: 'Never logged in',
      password: adminFormState.password || 'Serviq@123'
    }

    onUpdateRestaurantAdmins([...restaurantAdmins, newAdmin])
    setShowAddAdminModal(false)
    showToast('success', `User account "${newAdmin.name}" registered successfully!`)

    setAdminFormState({
      name: '',
      email: '',
      phone: '',
      restaurantName: restaurants[0]?.name || '',
      role: 'Branch Admin',
      status: 'Active',
      password: ''
    })
  }

  const handleEditAdminClick = (admin) => {
    setEditingAdminId(admin.id)
    setAdminFormState({
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      restaurantName: admin.restaurantName,
      role: admin.role,
      status: admin.status,
      password: ''
    })
  }

  const handleUpdateAdminSubmit = (e) => {
    e.preventDefault()

    const errors = {}
    const requiredFields = {
      name: 'Full Name',
      email: 'Email Address',
      phone: 'Mobile Number',
      role: 'System Role',
    }

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!adminFormState[field] || String(adminFormState[field]).trim() === '') {
        errors[field] = `${label} is Required`
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})

    const updated = restaurantAdmins.map(a => a.id === editingAdminId ? {
      ...a,
      name: adminFormState.name,
      email: adminFormState.email,
      phone: adminFormState.phone,
      restaurantName: adminFormState.restaurantName,
      role: adminFormState.role,
      status: adminFormState.status
    } : a)
    onUpdateRestaurantAdmins(updated)
    setEditingAdminId(null)
    showToast('success', `User profile for "${adminFormState.name}" updated successfully!`)
  }

  const handleResetPasswordSubmit = (e) => {
    e.preventDefault()

    const errors = {}

    if (!passwordResetValue || String(passwordResetValue).trim() === '') {
      errors.passwordResetValue = "New Password is Required"
    }

    if (!passwordConfirmValue || String(passwordConfirmValue).trim() === '') {
      errors.passwordConfirmValue = "Confirm Password is Required"
    }

    if (passwordResetValue !== passwordConfirmValue) {
      errors.passwordConfirmValue = 'Passwords do not match'
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})

    const updated = restaurantAdmins.map(a => a.id === resettingPasswordAdminId ? {
      ...a,
      password: passwordResetValue
    } : a)
    onUpdateRestaurantAdmins(updated)
    setResettingPasswordAdminId(null)
    setPasswordResetValue('')
    setPasswordConfirmValue('')
    showToast('success', 'User security password successfully updated!')
  }

  const handleToggleAdminStatus = (adminId) => {
    const target = restaurantAdmins.find(a => a.id === adminId)
    if (!target) return
    const nextStatus = target.status === 'Active' ? 'Disabled' : 'Active'
    const updated = restaurantAdmins.map(a => a.id === adminId ? { ...a, status: nextStatus } : a)
    onUpdateRestaurantAdmins(updated)
    showToast('info', `User "${target.name}" status changed to ${nextStatus.toUpperCase()}`)
  }

  const handleDeleteAdmin = (adminId) => {
    const target = restaurantAdmins.find(a => a.id === adminId)
    if (!target) return
    setConfirmModal({
      title: "Delete User Account",
      message: `Are you sure you want to permanently delete the user profile for "${target.name}"? This action cannot be undone.`,
      confirmText: "Confirm Delete",
      confirmColor: "#ef4444",
      onConfirm: () => {
        onUpdateRestaurantAdmins(restaurantAdmins.filter(a => a.id !== adminId))
        showToast('error', `User account "${target.name}" deleted.`)
      }
    })
  }

  const handleEditClick = (rest) => {
    setViewingRestId(null)
    setEditingRestId(rest.id)
    setEditFormState({ ...rest })
  }

  const handleUpdateRestaurantSubmit = (e) => {
    e.preventDefault()

    const errors = {}
    const requiredFields = {
      name: 'Business Name',
      legalName: 'Legal Entity Name',
      ownerName: 'Owner Name',
      mobileNumber: 'Mobile Number',
      email: 'Email',
      address: 'Registered Location Address',
      city: 'City',
      state: 'State',
      country: 'Country',
      license: 'FSSAI License Number',
      gstin: 'GSTIN Number',
      pan: 'PAN Number',
      openingTime: 'Opening Time',
      closingTime: 'Closing Time',
    }

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!editFormState[field] || String(editFormState[field]).trim() === '') {
        errors[field] = `${label} is Required`
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})

    const updatedRestaurants = restaurants.map(r => r.id === editingRestId ? editFormState : r)
    onUpdateRestaurants(updatedRestaurants)

    if (editingRestId === activeRestaurantId) {
      onUpdateRestaurantDetails(editFormState)
    }

    setEditingRestId(null)
    showToast('success', `Branch details for "${editFormState.name}" updated successfully!`)
  }

  // Keep form state in sync when restaurantDetails changes dynamically
  React.useEffect(() => {
    setFormState({ ...restaurantDetails })
  }, [restaurantDetails])

  // Multi-restaurant selector modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [newRestState, setNewRestState] = useState({
    name: '',
    legalName: '',
    branch: '',
    license: '',
    gstin: '',
    pan: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    currency: 'INR',
    taxRate: 5,
    serviceCharge: 5,
    openingTime: '11:00 AM',
    closingTime: '11:00 PM',
    status: 'Active',
    subscriptionPlan: 'Standard',
    createdDate: new Date().toISOString().split('T')[0],
    ownerName: '',
    mobileNumber: '',
    city: '',
    state: '',
    country: '',
    logo: '',
    banner: ''
  })

  const [systemLogs, setSystemLogs] = useState([
    { id: 1, time: '10:04 AM', type: 'info', msg: 'System initialized successfully.' },
    { id: 2, time: '10:15 AM', type: 'success', msg: 'Admin Terminal authenticated from IP 192.168.1.42.' },
    { id: 3, time: '10:30 AM', type: 'warning', msg: 'High occupancy warning: 85% table capacity reached.' },
    { id: 4, time: '11:02 AM', type: 'info', msg: 'Kitchen KDS Terminal connected successfully.' },
    { id: 5, time: '11:15 AM', type: 'success', msg: 'UPI dynamic QR endpoint initialized on Port 3001.' }
  ])

  // Users state
  const [systemRoles, setSystemRoles] = useState([
    {
      id: 'role-1',
      name: 'Super Admin',
      status: 'Active',
      desc: 'Complete control over all restaurants and billing.',
      perms: {
        dashboard: { view: true, add: true, edit: true, delete: true },
        restaurants: { view: true, add: true, edit: true, delete: true },
        roles: { view: true, add: true, edit: true, delete: true },
        adminUsers: { view: true, add: true, edit: true, delete: true },
        subscriptions: { view: true, add: true, edit: true, delete: true },
        revenue: { view: true, add: true, edit: true, delete: true }
      }
    },
    {
      id: 'role-2',
      name: 'Branch Admin',
      status: 'Active',
      desc: 'Manage specific restaurant branch settings and staff.',
      perms: {
        dashboard: { view: true, add: true, edit: true, delete: true },
        restaurants: { view: true, add: true, edit: true, delete: true },
        roles: { view: true, add: true, edit: true, delete: true },
        adminUsers: { view: true, add: true, edit: true, delete: true },
        subscriptions: { view: true, add: true, edit: true, delete: true },
        revenue: { view: false, add: false, edit: false, delete: false }
      }
    },
    {
      id: 'role-3',
      name: 'Branch Manager',
      status: 'Active',
      desc: 'Oversees day-to-day operations and staff.',
      perms: {
        dashboard: { view: false, add: false, edit: false, delete: false },
        restaurants: { view: false, add: false, edit: false, delete: false },
        roles: { view: true, add: true, edit: true, delete: true },
        adminUsers: { view: true, add: true, edit: true, delete: true },
        subscriptions: { view: true, add: true, edit: true, delete: true },
        revenue: { view: false, add: false, edit: false, delete: false }
      }
    },
    {
      id: 'role-4',
      name: 'Cashier',
      status: 'Active',
      desc: 'Handles billing and payment collections.',
      perms: {
        dashboard: { view: true, add: true, edit: true, delete: true },
        restaurants: { view: false, add: false, edit: false, delete: false },
        roles: { view: false, add: false, edit: false, delete: false },
        adminUsers: { view: false, add: false, edit: false, delete: false },
        subscriptions: { view: false, add: false, edit: false, delete: false },
        revenue: { view: false, add: false, edit: false, delete: false }
      }
    },
    {
      id: 'role-5',
      name: 'Waiter',
      status: 'Active',
      desc: 'Takes orders and serves tables.',
      perms: {
        dashboard: { view: false, add: false, edit: false, delete: false },
        restaurants: { view: false, add: false, edit: false, delete: false },
        roles: { view: false, add: false, edit: false, delete: false },
        adminUsers: { view: true, add: true, edit: true, delete: true },
        subscriptions: { view: true, add: true, edit: true, delete: true },
        revenue: { view: false, add: false, edit: false, delete: false }
      }
    },
    {
      id: 'role-6',
      name: 'Kitchen Staff',
      status: 'Active',
      desc: 'Prepares food and updates order status.',
      perms: {
        dashboard: { view: false, add: false, edit: false, delete: false },
        restaurants: { view: false, add: false, edit: false, delete: false },
        roles: { view: false, add: false, edit: false, delete: false },
        adminUsers: { view: false, add: false, edit: false, delete: false },
        subscriptions: { view: true, add: true, edit: true, delete: true },
        revenue: { view: false, add: false, edit: false, delete: false }
      }
    }
  ])
  const [editingRoleId, setEditingRoleId] = useState(null)
  const [roleFormErrors, setRoleFormErrors] = useState({})
  const [roleFormState, setRoleFormState] = useState({
    name: '',
    desc: '',
    status: 'Active',
    perms: {
      dashboard: { view: false, add: false, edit: false, delete: false },
      restaurants: { view: false, add: false, edit: false, delete: false },
      roles: { view: false, add: false, edit: false, delete: false },
      adminUsers: { view: false, add: false, edit: false, delete: false },
      subscriptions: { view: false, add: false, edit: false, delete: false },
      revenue: { view: false, add: false, edit: false, delete: false }
    }
  })

  // Local Form state change handler
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: name === 'taxRate' || name === 'serviceCharge' ? parseFloat(value) || 0 : value
    }))
  }

  // Handle saving details back to root App
  const handleSaveDetails = (e) => {
    e.preventDefault()
    onUpdateRestaurantDetails(formState)
    showToast('success', 'Global restaurant settings successfully synchronized system-wide!')

    // Append to system logs
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setSystemLogs(prev => [
      { id: Date.now(), time: now, type: 'success', msg: `Restaurant configuration modified: "${formState.name}"` },
      ...prev
    ])
  }

  // Financial Data Calculations
  // Baseline static metrics from design specs + dynamic active orders
  const billedOrders = orders.filter(o => o.status === 'Billed' || o.status === 'Done')
  const dynamicBilledRevenue = billedOrders.reduce((acc, order) => {
    return acc + order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }, 0)

  // Dynamic accumulated total revenue (₹12,480 base + new simulated ones)
  const totalRevenue = (stats.revenue || 0) + dynamicBilledRevenue
  const taxAmount = (totalRevenue * (formState.taxRate / 100))
  const serviceChargeAmount = (totalRevenue * (formState.serviceCharge / 100))

  // Total orders count
  const totalOrdersCount = stats.totalOrdersCount + orders.length
  const averageTicket = totalOrdersCount > 0 ? Math.round(totalRevenue / totalOrdersCount) : 0

  // Today's active simulated orders
  const todaysOrdersCount = 12 + orders.filter(o => o.status !== 'Voided').length

  // Total Users count (active diners, staff members, registered operators)
  const totalUsersCount = Math.round(totalOrdersCount * 3.5) + (staffMembers.length * restaurants.length)

  // Monthly Revenue estimation (including other historical weeks in current month)
  const monthlyRevenue = Math.round(totalRevenue * 8.5)

  // Subscription Revenue from branches (Active branches * ₹4,999 base fee/month)
  const activeRestaurants = restaurants.filter(r => r.status === 'Active')
  const subscriptionRevenue = activeRestaurants.length * 4999

  // Subscription Plan Distributions for Donut/Pie Chart
  const standardCount = restaurants.filter(r => r.subscriptionPlan?.includes('Standard')).length || 0
  const premiumCount = restaurants.filter(r => r.subscriptionPlan?.includes('Premium')).length || 0
  const enterpriseCount = restaurants.filter(r => r.subscriptionPlan?.includes('Enterprise')).length || 0
  const totalPlans = standardCount + premiumCount + enterpriseCount || 1
  const standardPct = (standardCount / totalPlans) * 100
  const premiumPct = (premiumCount / totalPlans) * 100
  const enterprisePct = (enterpriseCount / totalPlans) * 100

  // Donut chart stroke math (Circumference C = 251.2 for r = 40)
  const donutCircumference = 251.2
  const standardDash = (standardCount / totalPlans) * donutCircumference
  const premiumDash = (premiumCount / totalPlans) * donutCircumference
  const enterpriseDash = (enterpriseCount / totalPlans) * donutCircumference

  // Category distributions for visualization
  const categorySales = [
    { name: 'Starters', percentage: 28, value: Math.round(totalRevenue * 0.28), color: 'hsl(var(--primary-hue), 95%, 52%)' },
    { name: 'Mains', percentage: 46, value: Math.round(totalRevenue * 0.46), color: '#3b82f6' },
    { name: 'Drinks', percentage: 16, value: Math.round(totalRevenue * 0.16), color: '#10b981' },
    { name: 'Desserts', percentage: 10, value: Math.round(totalRevenue * 0.1), color: '#fbbf24' }
  ]

  // Add a new warning logs generator
  const triggerDiagnostics = () => {
    const errors = ['Database socket ping took 142ms', 'UPI callback server response delayed', 'Memory garbage collector swept 14.2MB heap']
    const randErr = errors[Math.floor(Math.random() * errors.length)]
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    setSystemLogs(prev => [
      { id: Date.now(), time: now, type: 'warning', msg: randErr },
      ...prev
    ])
    showToast('info', 'System diagnostics completed. Diagnostic warnings loaded in logs deck.')
  }

  // Reset simulator
  const handleResetSimulator = () => {
    setConfirmModal({
      title: "Reset Simulator Database",
      message: "Are you sure you want to restore the simulation database back to defaults? All tables will reset to original occupancies and active mock orders will clear.",
      confirmText: "Reset Database",
      confirmColor: "#ef4444",
      onConfirm: () => {
        onUpdateTables([
          { id: 'T-01', name: 'Table 01', status: 'Occupied', seats: 4 },
          { id: 'T-02', name: 'Table 02', status: 'Occupied', seats: 2 },
          { id: 'T-03', name: 'Table 03', status: 'Occupied', seats: 4 },
          { id: 'T-04', name: 'Table 04', status: 'Free', seats: 6 },
          { id: 'T-05', name: 'Table 05', status: 'Occupied', seats: 2 },
          { id: 'T-06', name: 'Table 06', status: 'Free', seats: 4 },
          { id: 'T-07', name: 'Table 07', status: 'Occupied', seats: 8 }
        ])

        onUpdateOrders([
          {
            id: '#847',
            table: 'Table 03',
            items: [
              { name: 'Chicken Biryani', quantity: 1, price: 320 },
              { name: 'Masala Chai', quantity: 2, price: 40 }
            ],
            time: '1:28 PM',
            timestamp: new Date(Date.now() - 120000),
            status: 'New',
            note: 'Less spicy please'
          },
          {
            id: '#846',
            table: 'Table 07',
            items: [
              { name: 'Paneer Tikka', quantity: 2, price: 180 }
            ],
            time: '1:22 PM',
            timestamp: new Date(Date.now() - 480000),
            status: 'Preparing',
            note: ''
          }
        ])

        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        setSystemLogs(prev => [
          { id: Date.now(), time: now, type: 'success', msg: 'Simulation database purged & hard reloaded to factory defaults.' },
          ...prev
        ])
        showToast('success', 'Simulator data base restored to initial seed successfully!')
      }
    })
  }

  // Handle Void order
  const handleVoidOrder = (orderId) => {
    setConfirmModal({
      title: "Void Transaction",
      message: `Void transaction ${orderId}? This will remove it from simulated revenue totals.`,
      confirmText: "Confirm Void",
      confirmColor: "#ef4444",
      onConfirm: () => {
        onUpdateOrders(orders.map(o => o.id === orderId ? { ...o, status: 'Voided' } : o))
        showToast('error', `Transaction ${orderId} marked as VOID / REFUNDED.`)
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        setSystemLogs(prev => [
          { id: Date.now(), time: now, type: 'warning', msg: `Order ${orderId} was voided/refunded by super admin.` },
          ...prev
        ])
      }
    })
  }

  // Handle Create Restaurant
  const handleCreateRestaurant = (e) => {
    e.preventDefault()

    const errors = {}
    const requiredFields = {
      name: 'Business Name',
      legalName: 'Legal Entity Name',
      ownerName: 'Owner Name',
      mobileNumber: 'Mobile Number',
      email: 'Email',
      address: 'Registered Location Address',
      city: 'City',
      state: 'State',
      country: 'Country',
      license: 'FSSAI License Number',
      gstin: 'GSTIN Number',
      pan: 'PAN Number',
      openingTime: 'Opening Time',
      closingTime: 'Closing Time',
      createdDate: 'Created Date'
    }

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!newRestState[field] || String(newRestState[field]).trim() === '') {
        errors[field] = `${label} is Required`
      }
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setFormErrors({})
    const nextIdNum = restaurants.length > 0
      ? Math.max(...restaurants.map(r => parseInt(r.id.replace('R-', '')))) + 1
      : 6
    const newId = `R-${String(nextIdNum).padStart(2, '0')}`
    const restaurantToAdd = { ...newRestState, id: newId }
    onUpdateRestaurants([...restaurants, restaurantToAdd])
    onSetActiveRestaurantId(newId)
    setShowAddModal(false)
    showToast('success', `Branch "${newRestState.name}" registered successfully under code ${newId}!`)

    // Clear state
    setNewRestState({
      name: '',
      legalName: '',
      branch: '',
      license: '',
      gstin: '',
      pan: '',
      phone: '',
      email: '',
      website: '',
      address: '',
      currency: 'INR',
      taxRate: 5,
      serviceCharge: 5,
      openingTime: '11:00 AM',
      closingTime: '11:00 PM',
      status: 'Active',
      subscriptionPlan: 'Standard',
      createdDate: new Date().toISOString().split('T')[0],
      ownerName: '',
      mobileNumber: '',
      city: '',
      state: '',
      country: '',
      logo: '',
      banner: ''
    })
  }

  // Handle Delete Restaurant
  const handleDeleteRestaurant = (id) => {
    const targetRest = restaurants.find(r => r.id === id)
    if (!targetRest) return
    setConfirmModal({
      title: "Delete Franchise Branch",
      message: `Are you sure you want to permanently delete the branch "${targetRest.name}"? This action cannot be undone.`,
      confirmText: "Confirm Delete",
      confirmColor: "#ef4444",
      onConfirm: () => {
        const remaining = restaurants.filter(r => r.id !== id)
        onUpdateRestaurants(remaining)
        if (id === activeRestaurantId && remaining.length > 0) {
          onSetActiveRestaurantId(remaining[0].id)
          onUpdateRestaurantDetails(remaining[0])
        }
        showToast('error', `Branch "${targetRest.name}" successfully removed.`)
      }
    })
  }

  // Handle Role save and delete
  const handleSaveRole = (e) => {
    e.preventDefault()

    const errors = {}
    if (!roleFormState.name || !roleFormState.name.trim()) {
      errors.name = 'Role Name is Required'
    }

    if (Object.keys(errors).length > 0) {
      setRoleFormErrors(errors)
      return
    }

    setRoleFormErrors({})

    if (editingRoleId === 'new') {
      const nextIdNum = systemRoles.length > 0 ? Math.max(...systemRoles.map(r => parseInt(r.id.replace('role-', '')))) + 1 : 1
      const newId = `role-${nextIdNum}`
      setSystemRoles([...systemRoles, { ...roleFormState, id: newId }])
      showToast('success', 'Custom Role created successfully!')
    } else {
      setSystemRoles(systemRoles.map(r => r.id === editingRoleId ? { ...roleFormState, id: editingRoleId } : r))
      showToast('success', 'Role updated successfully!')
    }
    setEditingRoleId(null)
  }

  const handleDeleteRole = (id) => {
    setConfirmModal({
      title: "Delete Role",
      message: "Are you sure you want to permanently delete this role?",
      confirmText: "Confirm Delete",
      confirmColor: "#ef4444",
      onConfirm: () => {
        setSystemRoles(systemRoles.filter(r => r.id !== id))
        showToast('error', 'Role has been deleted.')
      }
    })
  }

  const handleToggleRoleStatus = (roleId) => {
    const target = systemRoles.find(r => r.id === roleId)
    if (!target) return
    const nextStatus = target.status === 'Active' ? 'Disabled' : 'Active'
    const updated = systemRoles.map(r => r.id === roleId ? { ...r, status: nextStatus } : r)
    setSystemRoles(updated)
    showToast('info', `Role "${target.name}" status changed to ${nextStatus.toUpperCase()}`)
  }

  const renderPerformanceModal = () => {
    if (!viewingPerfRestId) return null;
    const viewedRest = restaurants.find(r => r.id === viewingPerfRestId);
    if (!viewedRest) return null;

    const seedMap = {
      'R-01': { grossSales: 384200, orders: 1205, speed: '9.8 min', startersRatio: 32, mainsRatio: 48, drinksRatio: 12, dessertsRatio: 8 },
      'R-02': { grossSales: 129500, orders: 492, speed: '7.2 min', startersRatio: 18, mainsRatio: 32, drinksRatio: 44, dessertsRatio: 6 },
      'R-03': { grossSales: 592000, orders: 1845, speed: '14.5 min', startersRatio: 42, mainsRatio: 30, drinksRatio: 22, dessertsRatio: 6 },
      'R-04': { grossSales: 243100, orders: 904, speed: '11.2 min', startersRatio: 15, mainsRatio: 68, drinksRatio: 12, dessertsRatio: 5 },
      'R-05': { grossSales: 189000, orders: 742, speed: '8.5 min', startersRatio: 10, mainsRatio: 20, drinksRatio: 15, dessertsRatio: 55 },
    };
    const defaultPerf = { grossSales: 150000, orders: 500, speed: '10.0 min', startersRatio: 25, mainsRatio: 45, drinksRatio: 20, dessertsRatio: 10 };
    const perf = seedMap[viewedRest.id] || defaultPerf;

    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(9, 13, 22, 0.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 99999, padding: '20px'
      }} onClick={() => setViewingPerfRestId(null)}>
        <div className="menu-edit-panel animate-fade-in" style={{
          background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '20px', padding: '36px',
          width: '90%', maxWidth: '850px', boxShadow: 'var(--shadow-lg)', position: 'relative', top: 'auto'
        }} onClick={(e) => e.stopPropagation()}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ background: 'var(--primary)', color: '#fff', padding: '6px 12px', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '900' }}>PERFORMANCE ANALYTICS</span>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>{viewedRest.name} ({viewedRest.id})</h3>
            </div>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }} onClick={() => setViewingPerfRestId(null)}><X style={{ width: '16px', height: '16px' }} /></button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <div style={{ padding: '20px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Gross Simulated Revenue</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>₹{perf.grossSales.toLocaleString()}</h3>
                <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: '700' }}>↑ 14.2% MoM Growth</span>
              </div>
              <div style={{ padding: '20px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Simulated Tickets</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>{perf.orders.toLocaleString()}</h3>
                <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: '700' }}>Average Ticket: ₹{Math.round(perf.grossSales / perf.orders)}</span>
              </div>
              <div style={{ padding: '20px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>KDS Preparation Speed</span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#10b981', margin: 0 }}>{perf.speed}</h3>
                <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: '700' }}>Optimal Efficiency Rate</span>
              </div>
            </div>
            <div style={{ padding: '20px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-main)' }}>Daily Sales Peak Velocity</h4>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Simulated Peak Capacity</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '120px', padding: '10px 0' }}>
                {[
                  { hr: '11am', val: 20 }, { hr: '1pm', val: perf.orders > 1000 ? 92 : 74, highlight: true }, { hr: '3pm', val: 40 },
                  { hr: '5pm', val: 30 }, { hr: '7pm', val: 65 }, { hr: '9pm', val: perf.orders > 1000 ? 98 : 88, highlight: true }, { hr: '11pm', val: 45 }
                ].map((bar, idx) => (
                  <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '45px', gap: '6px' }}>
                    <div style={{ width: '100%', height: `${bar.val}px`, background: bar.highlight ? 'linear-gradient(180deg, var(--primary) 0%, var(--primary-hover) 100%)' : 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', transition: 'height 0.3s' }}></div>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '600' }}>{bar.hr}</span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '20px' }}>
              <div style={{ padding: '20px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-main)' }}>Dish Category Share</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { name: 'Starters', pct: perf.startersRatio, color: 'var(--primary)' }, { name: 'Mains', pct: perf.mainsRatio, color: '#3b82f6' },
                    { name: 'Drinks', pct: perf.drinksRatio, color: '#10b981' }, { name: 'Desserts', pct: perf.dessertsRatio, color: '#f59e0b' }
                  ].map((cat, idx) => (
                    <div key={idx}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', marginBottom: '4px' }}>
                        <span style={{ color: 'var(--text-main)' }}>{cat.name}</span><span style={{ color: cat.color }}>{cat.pct}%</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${cat.pct}%`, height: '100%', background: cat.color, borderRadius: '3px' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '20px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ margin: 0, fontSize: '0.85rem', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-main)' }}>Top Performing Menu Items</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    { rank: '1', name: 'Paneer Tikka', category: 'Starters', value: '430 orders', image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=60&auto=format&fit=crop&q=60' },
                    { rank: '2', name: 'Chicken Biryani', category: 'Mains', value: '382 orders', image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=60&auto=format&fit=crop&q=60' },
                    { rank: '3', name: 'Masala Dosa', category: 'Mains', value: '298 orders', image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=60&auto=format&fit=crop&q=60' }
                  ].map((dish, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: idx < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--primary)' }}>#{dish.rank}</span>
                        <div style={{ width: '32px', height: '32px', borderRadius: '4px', overflow: 'hidden' }}><img src={dish.image} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                        <div><span style={{ display: 'block', fontSize: '0.8rem', fontWeight: '800', color: 'var(--text-main)' }}>{dish.name}</span><span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{dish.category}</span></div>
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-main)' }}>{dish.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
            <button className="btn-black" style={{ padding: '10px 24px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }} onClick={() => setViewingPerfRestId(null)}>Close Analytics Deck</button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Reusable validated input component ───────────────────────────────────
  const ValidatedInput = ({ label, type = 'text', value, onChange, placeholder, required, error, setError, ...rest }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '0.75rem', fontWeight: '700', color: error ? '#ef4444' : 'var(--text-main)' }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          value={value}
          onChange={(e) => {
            onChange(e)
            if (error && setError) setError('')
          }}
          placeholder={placeholder}
          required={required}
          style={{
            width: '100%',
            padding: '9px 12px',
            border: `1.5px solid ${error ? '#ef4444' : 'var(--border-color)'}`,
            background: error ? 'rgba(239,68,68,0.04)' : 'var(--bg-app)',
            color: 'var(--text-main)',
            borderRadius: '8px',
            fontSize: '0.82rem',
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'border-color 0.15s'
          }}
          {...rest}
        />
        {error && (
          <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: '#ef4444', pointerEvents: 'none', display: 'flex' }}><AlertTriangle style={{ width: '14px', height: '14px' }} /></span>
        )}
      </div>
      {error && <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: '600' }}>{error}</span>}
    </div>
  )

  // ─── Reusable validated select component ──────────────────────────────────
  const ValidatedSelect = ({ label, value, onChange, required, error, setError, children, ...rest }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
      <label style={{ fontSize: '0.75rem', fontWeight: '700', color: error ? '#ef4444' : 'var(--text-main)' }}>
        {label}{required && <span style={{ color: '#ef4444', marginLeft: '2px' }}>*</span>}
      </label>
      <select
        value={value}
        onChange={(e) => {
          onChange(e)
          if (error && setError) setError('')
        }}
        required={required}
        style={{
          width: '100%',
          padding: '9px 12px',
          border: `1.5px solid ${error ? '#ef4444' : 'var(--border-color)'}`,
          background: error ? 'rgba(239,68,68,0.04)' : 'var(--bg-app)',
          color: 'var(--text-main)',
          borderRadius: '8px',
          fontSize: '0.82rem',
          outline: 'none',
          cursor: 'pointer',
          boxSizing: 'border-box',
          transition: 'border-color 0.15s'
        }}
        {...rest}
      >
        {children}
      </select>
      {error && <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: '600' }}>{error}</span>}
    </div>
  )

  return (
    <>
      <div className="superadmin-wrapper animate-fade-in" style={{ display: 'grid', gridTemplateColumns: isMerged ? '1fr' : '260px 1fr', gap: '24px', padding: '24px 30px', width: '100%', minHeight: isMerged ? 'none' : 'calc(100vh - 60px)', background: '#ffffff', transition: 'background-color var(--transition-normal)' }}>

        {/* Super Admin Control Navigation (Left) */}
        {!isMerged && (
          <div className="menu-categories-card" style={{ position: 'sticky', top: '90px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '20px', height: 'fit-content' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
              <div style={{ background: 'var(--primary)', color: '#fff', width: '32px', height: '32px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Crown style={{ width: '18px', height: '18px' }} /></div>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>Super Admin Deck</h4>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block', fontWeight: '600' }}>Terminal: #0001-A</span>
              </div>
            </div>

            <ul className="menu-categories-list" style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '6px', padding: 0 }}>
              <li
                onClick={() => setActiveTab('revenue')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: activeTab === 'revenue' ? 'var(--primary)' : 'var(--text-main)',
                  background: activeTab === 'revenue' ? 'var(--primary-light)' : 'transparent',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <TrendingUp style={{ width: '16px', height: '16px' }} />
                <span>Dashboard Deck</span>
              </li>

              <li
                onClick={() => setActiveTab('details')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: activeTab === 'details' ? 'var(--primary)' : 'var(--text-main)',
                  background: activeTab === 'details' ? 'var(--primary-light)' : 'transparent',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Building style={{ width: '16px', height: '16px' }} />
                <span>Restaurants</span>
              </li>

              {/* Users Dropdown Menu */}
              <li style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                <div
                  onClick={() => setUsersDropdownOpen(!usersDropdownOpen)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: '700',
                    color: (activeTab === 'admins' || activeTab === 'roles') ? 'var(--primary)' : 'var(--text-main)',
                    background: (activeTab === 'admins' || activeTab === 'roles') ? 'var(--primary-light)' : 'transparent',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Users style={{ width: '16px', height: '16px' }} />
                    <span>Users</span>
                  </div>
                  <ChevronDown
                    style={{
                      width: '12px',
                      height: '12px',
                      transition: 'transform 0.2s',
                      transform: usersDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                    }}
                  />
                </div>

                {usersDropdownOpen && (
                  <div style={{
                    paddingLeft: '12px',
                    marginTop: '4px',
                    marginBottom: '4px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    borderLeft: '1px solid var(--border-color)',
                    marginLeft: '20px'
                  }}>
                    <div
                      onClick={() => setActiveTab('roles')}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        color: activeTab === 'roles' ? 'var(--primary)' : 'var(--text-main)',
                        background: activeTab === 'roles' ? 'var(--primary-light)' : 'transparent',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      Roles & Permissions
                    </div>
                    <div
                      onClick={() => setActiveTab('admins')}
                      style={{
                        padding: '8px 12px',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '700',
                        color: activeTab === 'admins' ? 'var(--primary)' : 'var(--text-main)',
                        background: activeTab === 'admins' ? 'var(--primary-light)' : 'transparent',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      Users
                    </div>
                  </div>
                )}
              </li>

              <li
                onClick={() => setActiveTab('plans')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: activeTab === 'plans' ? 'var(--primary)' : 'var(--text-main)',
                  background: activeTab === 'plans' ? 'var(--primary-light)' : 'transparent',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <Layers style={{ width: '16px', height: '16px' }} />
                <span>Subscription & Plans</span>
              </li>

              <li
                onClick={() => setActiveTab('billing')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: '700',
                  color: activeTab === 'billing' ? 'var(--primary)' : 'var(--text-main)',
                  background: activeTab === 'billing' ? 'var(--primary-light)' : 'transparent',
                  transition: 'all var(--transition-fast)'
                }}
              >
                <CreditCard style={{ width: '16px', height: '16px' }} />
                <span>Revenue & Billing</span>
              </li>
            </ul>

            {/* Database Status Widget */}
            <div style={{ marginTop: '24px', padding: '14px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Database Health</span>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', display: 'block', color: 'var(--text-main)' }}>4.82 MB / SQLite3</span>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{tables.length} tables â€¢ {menuItems.length} menu items</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Workspace Area (Right) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', minWidth: 0 }}>

          {/* Tab 1: Restaurant Details Layout */}
          {activeTab === 'details' && (
            showAddModal ? (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '32px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', letterSpacing: '0.5px' }}>Branch Registration</span>
                      <h3 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)' }}>Register New Restaurant Branch</h3>
                    </div>
                    <button
                      className="btn-outline"
                      style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                      onClick={() => setShowAddModal(false)}
                    >
                      Back to Registry
                    </button>
                  </div>

                  <form onSubmit={handleCreateRestaurant} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <ValidatedInput
                        label="Business Name"
                        type="text"
                        value={newRestState.name}
                        onChange={(e) => setNewRestState({ ...newRestState, name: e.target.value })}
                        placeholder="e.g. Serviq"
                        required
                        error={formErrors.name}
                        setError={(val) => setFormErrors({ ...formErrors, name: val })}
                      />
                      <ValidatedInput
                        label="Legal Entity Name"
                        type="text"
                        value={newRestState.legalName}
                        onChange={(e) => setNewRestState({ ...newRestState, legalName: e.target.value })}
                        placeholder="e.g. Serviq Hospitality Pvt. Ltd."
                        required
                        error={formErrors.legalName}
                        setError={(val) => setFormErrors({ ...formErrors, legalName: val })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <ValidatedInput
                        label="Owner Name"
                        type="text"
                        value={newRestState.ownerName}
                        onChange={(e) => setNewRestState({ ...newRestState, ownerName: e.target.value })}
                        placeholder="e.g. Rajesh Kumar"
                        required
                        error={formErrors.ownerName}
                        setError={(val) => setFormErrors({ ...formErrors, ownerName: val })}
                      />
                      <ValidatedInput
                        label="Mobile Number"
                        type="text"
                        value={newRestState.mobileNumber}
                        onChange={(e) => setNewRestState({ ...newRestState, mobileNumber: e.target.value, phone: e.target.value })}
                        placeholder="e.g. +91 98765 43210"
                        required
                        error={formErrors.mobileNumber}
                        setError={(val) => setFormErrors({ ...formErrors, mobileNumber: val })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <ValidatedInput
                        label="Email"
                        type="email"
                        value={newRestState.email}
                        onChange={(e) => setNewRestState({ ...newRestState, email: e.target.value })}
                        placeholder="e.g. contact@serviqbistro.com"
                        required
                        error={formErrors.email}
                        setError={(val) => setFormErrors({ ...formErrors, email: val })}
                      />
                      <ValidatedInput
                        label="Website Domain"
                        type="text"
                        value={newRestState.website}
                        onChange={(e) => setNewRestState({ ...newRestState, website: e.target.value })}
                        placeholder="e.g. https://serviqbistro.com"
                        error={formErrors.website}
                        setError={(val) => setFormErrors({ ...formErrors, website: val })}
                      />
                    </div>

                    <ValidatedInput
                      label="Registered Location Address"
                      type="text"
                      value={newRestState.address}
                      onChange={(e) => setNewRestState({ ...newRestState, address: e.target.value })}
                      placeholder="e.g. 12, Khader Nawaz Khan Road, Nungambakkam"
                      required
                      error={formErrors.address}
                      setError={(val) => setFormErrors({ ...formErrors, address: val })}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <ValidatedInput
                        label="City"
                        type="text"
                        value={newRestState.city}
                        onChange={(e) => setNewRestState({ ...newRestState, city: e.target.value, branch: `${e.target.value}` })}
                        placeholder="e.g. Chennai"
                        required
                        error={formErrors.city}
                        setError={(val) => setFormErrors({ ...formErrors, city: val })}
                      />
                      <ValidatedInput
                        label="State"
                        type="text"
                        value={newRestState.state}
                        onChange={(e) => setNewRestState({ ...newRestState, state: e.target.value })}
                        placeholder="e.g. Tamil Nadu"
                        required
                        error={formErrors.state}
                        setError={(val) => setFormErrors({ ...formErrors, state: val })}
                      />
                      <ValidatedInput
                        label="Country"
                        type="text"
                        value={newRestState.country}
                        onChange={(e) => setNewRestState({ ...newRestState, country: e.target.value })}
                        placeholder="e.g. India"
                        required
                        error={formErrors.country}
                        setError={(val) => setFormErrors({ ...formErrors, country: val })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <ValidatedInput
                        label="FSSAI License Number"
                        type="text"
                        value={newRestState.license}
                        onChange={(e) => setNewRestState({ ...newRestState, license: e.target.value })}
                        placeholder="FSSAI-12345678901234"
                        required
                        error={formErrors.license}
                        setError={(val) => setFormErrors({ ...formErrors, license: val })}
                      />
                      <ValidatedInput
                        label="GSTIN Number"
                        type="text"
                        value={newRestState.gstin}
                        onChange={(e) => setNewRestState({ ...newRestState, gstin: e.target.value })}
                        placeholder="33AAAAA1111A1Z1"
                        required
                        error={formErrors.gstin}
                        setError={(val) => setFormErrors({ ...formErrors, gstin: val })}
                      />
                      <ValidatedInput
                        label="PAN Number"
                        type="text"
                        value={newRestState.pan}
                        onChange={(e) => setNewRestState({ ...newRestState, pan: e.target.value })}
                        placeholder="ABCDE1234F"
                        required
                        error={formErrors.pan}
                        setError={(val) => setFormErrors({ ...formErrors, pan: val })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <ValidatedInput
                        label="Opening Time"
                        type="text"
                        value={newRestState.openingTime}
                        onChange={(e) => setNewRestState({ ...newRestState, openingTime: e.target.value })}
                        placeholder="e.g. 11:00 AM"
                        required
                        error={formErrors.openingTime}
                        setError={(val) => setFormErrors({ ...formErrors, openingTime: val })}
                      />
                      <ValidatedInput
                        label="Closing Time"
                        type="text"
                        value={newRestState.closingTime}
                        onChange={(e) => setNewRestState({ ...newRestState, closingTime: e.target.value })}
                        placeholder="e.g. 11:00 PM"
                        required
                        error={formErrors.closingTime}
                        setError={(val) => setFormErrors({ ...formErrors, closingTime: val })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                      <ValidatedInput
                        label="Tax Rate (%)"
                        type="number"
                        value={newRestState.taxRate}
                        onChange={(e) => setNewRestState({ ...newRestState, taxRate: parseFloat(e.target.value) || 0 })}
                        min="0" max="30" step="0.5" required
                        error={formErrors.taxRate}
                        setError={(val) => setFormErrors({ ...formErrors, taxRate: val })}
                      />
                      <ValidatedInput
                        label="Service Fee (%)"
                        type="number"
                        value={newRestState.serviceCharge}
                        onChange={(e) => setNewRestState({ ...newRestState, serviceCharge: parseFloat(e.target.value) || 0 })}
                        min="0" max="20" step="0.5" required
                        error={formErrors.serviceCharge}
                        setError={(val) => setFormErrors({ ...formErrors, serviceCharge: val })}
                      />
                      <ValidatedSelect
                        label="Initial Status"
                        value={newRestState.status}
                        onChange={(e) => setNewRestState({ ...newRestState, status: e.target.value })}
                        error={formErrors.status}
                        setError={(val) => setFormErrors({ ...formErrors, status: val })}
                      >
                        <option value="Active">Active</option>
                        <option value="Suspended">Suspended</option>
                        <option value="Inactive">Inactive</option>
                      </ValidatedSelect>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <ValidatedSelect
                        label="Subscription Plan"
                        value={newRestState.subscriptionPlan || 'Standard'}
                        onChange={(e) => setNewRestState({ ...newRestState, subscriptionPlan: e.target.value })}
                        error={formErrors.subscriptionPlan}
                        setError={(val) => setFormErrors({ ...formErrors, subscriptionPlan: val })}
                      >
                        <option value="Standard">Standard Plan</option>
                        <option value="Premium">Premium Plan</option>
                        <option value="Enterprise">Enterprise Plan</option>
                      </ValidatedSelect>
                      <ValidatedInput
                        label="Created Date"
                        type="date"
                        value={newRestState.createdDate || ''}
                        onChange={(e) => setNewRestState({ ...newRestState, createdDate: e.target.value })}
                        required
                        error={formErrors.createdDate}
                        setError={(val) => setFormErrors({ ...formErrors, createdDate: val })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <ValidatedInput
                        label="Restaurant Logo URL"
                        type="text"
                        value={newRestState.logo}
                        onChange={(e) => setNewRestState({ ...newRestState, logo: e.target.value })}
                        placeholder="https://images.unsplash.com/... (Logo)"
                        error={formErrors.logo}
                        setError={(val) => setFormErrors({ ...formErrors, logo: val })}
                      />
                      <ValidatedInput
                        label="Restaurant Banner URL"
                        type="text"
                        value={newRestState.banner}
                        onChange={(e) => setNewRestState({ ...newRestState, banner: e.target.value })}
                        placeholder="https://images.unsplash.com/... (Banner)"
                        error={formErrors.banner}
                        setError={(val) => setFormErrors({ ...formErrors, banner: val })}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                      <button type="button" onClick={() => setShowAddModal(false)} style={{ padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#ffffff', color: '#64748b', border: '1px solid #cbd5e1' }}>Cancel</button>
                      <button type="submit" style={{ padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#000000', color: '#ffffff', border: 'none' }}>Register Branch</button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'stretch', transition: 'all 0.3s ease' }} className="animate-fade-in">

                {/* Multi-Restaurant Switcher Header Selector Table */}
                {!viewingRestId && !editingRestId && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)' }}>Restaurant Management</h3>
                      </div>
                      <button
                        onClick={() => { setViewingRestId(null); setEditingRestId(null); setShowAddModal(true); }}
                        className="btn-black"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
                      >
                        <Plus style={{ width: '16px', height: '16px' }} /> Register
                      </button>
                    </div>

                    <div className="dish-admin-list" style={{ overflowX: 'auto', background: '#ffffff', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'relative' }}>
                      <table className="menu-data-table" style={{ width: '100%', borderCollapse: 'collapse', background: '#ffffff' }}>
                        <thead>
                          <tr>
                            <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', width: '60px', whiteSpace: 'nowrap' }}>S.No</th>
                            <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', width: '120px', whiteSpace: 'nowrap' }}>Restaurant ID</th>
                            <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Restaurant Name</th>
                            <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Owner Name</th>
                            <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Email</th>
                            <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Subscription Plan</th>
                            <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Phone Number</th>
                            <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', width: '120px', whiteSpace: 'nowrap' }}>Status</th>
                            <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'right', padding: '12px 60px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', width: '220px', whiteSpace: 'nowrap' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {restaurants.map((rest, index) => {
                            const isActive = rest.id === activeRestaurantId

                            return (
                              <tr
                                key={rest.id}
                                onClick={() => onSetActiveRestaurantId(rest.id)}
                                style={{
                                  borderBottom: '1px solid var(--border-color)',
                                  background: isActive ? 'var(--primary-light)' : 'transparent',
                                  transition: 'background-color 0.2s',
                                  cursor: 'pointer'
                                }}
                              >
                                <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', whiteSpace: 'nowrap' }}>
                                  {index + 1}
                                </td>
                                <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: '800', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>
                                  {rest.id}
                                </td>
                                <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div className="dish-admin-img" style={{ width: '38px', height: '38px', flexShrink: 0, padding: 0, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '6px', border: isActive ? '2px solid var(--primary)' : '1px solid var(--border-color)' }}>
                                      <img src={rest.logo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120&auto=format&fit=crop&q=60'} alt={rest.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', overflow: 'hidden' }}>
                                      <h4 style={{ fontSize: '0.85rem', fontWeight: '800', color: isActive ? 'var(--primary)' : 'var(--text-main)', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        {rest.name}
                                      </h4>
                                    </div>
                                  </div>
                                </td>
                                <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: '700', whiteSpace: 'nowrap' }}>
                                  {rest.ownerName || '—'}
                                </td>
                                <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', whiteSpace: 'nowrap' }}>
                                  {rest.email || '—'}
                                </td>
                                <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                                  <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: '800',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    background: rest.subscriptionPlan?.includes('Enterprise') ? 'rgba(124, 58, 237, 0.1)' : rest.subscriptionPlan?.includes('Premium') ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                                    color: rest.subscriptionPlan?.includes('Enterprise') ? '#7c3aed' : rest.subscriptionPlan?.includes('Premium') ? '#3b82f6' : '#10b981',
                                    border: rest.subscriptionPlan?.includes('Enterprise') ? '1px solid rgba(124, 58, 237, 0.2)' : rest.subscriptionPlan?.includes('Premium') ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid rgba(16, 185, 129, 0.2)'
                                  }}>
                                    {rest.subscriptionPlan || 'Standard Plan'}
                                  </span>
                                </td>
                                <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', whiteSpace: 'nowrap' }}>
                                  {rest.phone || rest.mobileNumber || '—'}
                                </td>
                                <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                                  <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: '800',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    background: rest.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : rest.status === 'Suspended' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: rest.status === 'Active' ? '#10b981' : rest.status === 'Suspended' ? '#f59e0b' : '#ef4444',
                                    display: 'inline-block',
                                    border: rest.status === 'Active' ? '1px solid rgba(16, 185, 129, 0.2)' : rest.status === 'Suspended' ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
                                  }}>
                                    {rest.status || 'Active'}
                                  </span>
                                </td>
                                <td style={{ padding: '14px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>

                                    {/* Suspend / Resume action */}
                                    <button
                                      style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '6px',
                                        color: rest.status === 'Suspended' ? '#ef4444' : '#10b981',
                                        transition: 'opacity 0.2s',
                                        display: 'flex',
                                        alignItems: 'center'
                                      }}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        const nextStatus = rest.status === 'Suspended' ? 'Active' : 'Suspended'
                                        const updated = { ...rest, status: nextStatus }
                                        onUpdateRestaurants(restaurants.map(r => r.id === rest.id ? updated : r))
                                        if (rest.id === activeRestaurantId) {
                                          onUpdateRestaurantDetails(updated)
                                        }
                                        showToast('info', `Branch "${rest.name}" status updated to ${nextStatus.toUpperCase()}`)
                                      }}
                                      title={rest.status === 'Suspended' ? "Activate Restaurant" : "Suspend Restaurant"}
                                    >
                                      {rest.status === 'Suspended' ? (
                                        <Lock style={{ width: '16px', height: '16px' }} />
                                      ) : (
                                        <Unlock style={{ width: '16px', height: '16px' }} />
                                      )}
                                    </button>

                                    <button
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--text-muted)', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                                      onClick={(e) => { e.stopPropagation(); setEditingRestId(null); setViewingRestId(rest.id); }}
                                      title="View Branch Showcase"
                                      onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                                      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                    >
                                      <Eye style={{ width: '16px', height: '16px' }} />
                                    </button>

                                    <button
                                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--text-muted)', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                                      onClick={(e) => { e.stopPropagation(); handleEditClick(rest); }}
                                      title="Edit Branch Details"
                                      onMouseOver={(e) => e.currentTarget.style.color = 'var(--text-main)'}
                                      onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                                    >
                                      <Edit2 style={{ width: '16px', height: '16px' }} />
                                    </button>

                                    {restaurants.length > 1 && (
                                      <button
                                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#ef4444', transition: 'opacity 0.2s', display: 'flex', alignItems: 'center' }}
                                        onClick={(e) => { e.stopPropagation(); handleDeleteRestaurant(rest.id); }}
                                        title="Delete Branch"
                                        onMouseOver={(e) => e.currentTarget.style.opacity = '0.7'}
                                        onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                                      >
                                        <Trash2 style={{ width: '16px', height: '16px' }} />
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {viewingRestId && (() => {
                  const viewedRest = restaurants.find(r => r.id === viewingRestId)
                  if (!viewedRest) return null
                  return (
                    <div className="glass-card animate-fade-in" style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '16px',
                      padding: '32px',
                      boxShadow: 'var(--shadow-sm)',
                      width: '100%',
                      position: 'relative'
                    }}>
                      {/* Header */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ background: 'var(--primary)', color: '#fff', padding: '4px 8px', borderRadius: '6px', fontSize: '0.65rem', fontWeight: '900' }}>
                            {viewedRest.id}
                          </span>
                          <h3 style={{ fontSize: '1.1rem', fontWeight: '900', color: 'var(--text-main)', margin: 0 }}>
                            {viewedRest.name}
                          </h3>
                        </div>
                        <button
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
                          onClick={() => setViewingRestId(null)}
                        >
                          <X style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>

                      {/* Body */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* Photo & Basic Details Banner */}
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center', background: 'var(--bg-app)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                          <div style={{ width: '70px', height: '70px', overflow: 'hidden', borderRadius: '8px', flexShrink: 0, border: '1px solid var(--border-color)' }}>
                            <img
                              src={viewedRest.logo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=120&auto=format&fit=crop&q=60'}
                              alt={viewedRest.name}
                              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflow: 'hidden' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {viewedRest.city || 'Chennai'}, {viewedRest.state || 'Tamil Nadu'}, {viewedRest.country || 'India'}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{
                                fontSize: '0.7rem',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                fontWeight: '800',
                                background: viewedRest.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
                                color: viewedRest.status === 'Active' ? '#10b981' : '#ef4444'
                              }}>
                                STATUS: {viewedRest.status ? viewedRest.status.toUpperCase() : 'ACTIVE'}
                              </span>
                              {viewedRest.id === activeRestaurantId && (
                                <span style={{ fontSize: '0.7rem', background: 'var(--primary)', color: '#fff', padding: '3px 8px', borderRadius: '4px', fontWeight: '800' }}>
                                  ACTIVE DIRECTORY ROOT
                                </span>
                              )}
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              <MapPin style={{ width: '12px', height: '12px', display: 'inline', marginRight: '4px' }} />{viewedRest.address}
                            </span>
                          </div>
                        </div>

                        {/* Corporate Credentials */}
                        <div style={{ padding: '14px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Corporate Credentials
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>Owner Name</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: '700' }}>{viewedRest.ownerName || 'Rajesh Kumar'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>Legal Entity Corporate Name</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: '700', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={viewedRest.legalName}>{viewedRest.legalName}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>FSSAI Food License Number</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: '700', fontFamily: 'monospace' }}>{viewedRest.license}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>Tax Identification Number (GSTIN)</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: '700', fontFamily: 'monospace' }}>{viewedRest.gstin}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>PAN Number</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: '700', fontFamily: 'monospace' }}>{viewedRest.pan || 'N/A'}</span>
                            </div>
                          </div>
                        </div>

                        {/* Tariffs & Operating Hours */}
                        <div style={{ padding: '14px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '10px' }}>
                          <h4 style={{ margin: '0 0 10px 0', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Tariffs & Operating Hours
                          </h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>Accrued GST</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: '700' }}>{viewedRest.taxRate}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>Service Fee</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: '700' }}>{viewedRest.serviceCharge}%</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>Operating Schedule</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}><Clock style={{ width: '12px', height: '12px' }} />{viewedRest.openingTime} - {viewedRest.closingTime}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>Subscription Plan</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}><Gem style={{ width: '12px', height: '12px' }} />{viewedRest.subscriptionPlan || 'Free Plan'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>Created Date</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar style={{ width: '12px', height: '12px' }} />{viewedRest.createdDate || '—'}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>Simulated Base Currency</span>
                              <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: '700' }}>
                                {viewedRest.currency === 'INR' ? 'Indian Rupee (₹)' : viewedRest.currency === 'USD' ? 'US Dollar ($)' : 'Euro (€)'}
                              </span>
                            </div>
                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                              <button
                                className="btn-black"
                                style={{ padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '700' }}
                                onClick={() => setViewingRestId(null)}
                              >
                                Close Showcase
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })()}

                {editingRestId && editFormState && (
                  <div className="glass-card animate-fade-in" style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '16px',
                    padding: '32px',
                    boxShadow: 'var(--shadow-sm)',
                    width: '100%',
                    position: 'relative'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                        Update Restaurant Branch: {editFormState.id}
                      </h3>
                      <button
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '1.2rem', padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        onClick={() => setEditingRestId(null)}
                      >
                        <X style={{ width: '16px', height: '16px' }} />
                      </button>
                    </div>

                    <form onSubmit={handleUpdateRestaurantSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '70vh', overflowY: 'auto', paddingRight: '8px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <ValidatedInput
                          label="Business Name"
                          type="text"
                          value={editFormState.name}
                          onChange={(e) => setEditFormState({ ...editFormState, name: e.target.value })}
                          placeholder="e.g. Serviq"
                          required
                          error={formErrors.name}
                          setError={(val) => setFormErrors({ ...formErrors, name: val })}
                        />
                        <ValidatedInput
                          label="Legal Entity Name"
                          type="text"
                          value={editFormState.legalName}
                          onChange={(e) => setEditFormState({ ...editFormState, legalName: e.target.value })}
                          placeholder="e.g. Serviq Hospitality Pvt. Ltd."
                          required
                          error={formErrors.legalName}
                          setError={(val) => setFormErrors({ ...formErrors, legalName: val })}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <ValidatedInput
                          label="Owner Name"
                          type="text"
                          value={editFormState.ownerName || ''}
                          onChange={(e) => setEditFormState({ ...editFormState, ownerName: e.target.value })}
                          placeholder="e.g. Rajesh Kumar"
                          required
                          error={formErrors.ownerName}
                          setError={(val) => setFormErrors({ ...formErrors, ownerName: val })}
                        />
                        <ValidatedInput
                          label="Mobile Number"
                          type="text"
                          value={editFormState.mobileNumber || editFormState.phone || ''}
                          onChange={(e) => setEditFormState({ ...editFormState, mobileNumber: e.target.value, phone: e.target.value })}
                          placeholder="e.g. +91 98765 43210"
                          required
                          error={formErrors.mobileNumber}
                          setError={(val) => setFormErrors({ ...formErrors, mobileNumber: val })}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <ValidatedInput
                          label="Email"
                          type="email"
                          value={editFormState.email}
                          onChange={(e) => setEditFormState({ ...editFormState, email: e.target.value })}
                          placeholder="e.g. contact@serviqbistro.com"
                          required
                          error={formErrors.email}
                          setError={(val) => setFormErrors({ ...formErrors, email: val })}
                        />
                        <ValidatedInput
                          label="Website Domain"
                          type="text"
                          value={editFormState.website}
                          onChange={(e) => setEditFormState({ ...editFormState, website: e.target.value })}
                          placeholder="e.g. https://serviqbistro.com"
                          error={formErrors.website}
                          setError={(val) => setFormErrors({ ...formErrors, website: val })}
                        />
                      </div>

                      <ValidatedInput
                        label="Registered Location Address"
                        type="text"
                        value={editFormState.address}
                        onChange={(e) => setEditFormState({ ...editFormState, address: e.target.value })}
                        placeholder="e.g. 12, Khader Nawaz Khan Road, Nungambakkam"
                        required
                        error={formErrors.address}
                        setError={(val) => setFormErrors({ ...formErrors, address: val })}
                      />

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <ValidatedInput
                          label="City"
                          type="text"
                          value={editFormState.city || ''}
                          onChange={(e) => setEditFormState({ ...editFormState, city: e.target.value, branch: `${e.target.value}` })}
                          placeholder="e.g. Chennai"
                          required
                          error={formErrors.city}
                          setError={(val) => setFormErrors({ ...formErrors, city: val })}
                        />
                        <ValidatedInput
                          label="State"
                          type="text"
                          value={editFormState.state || ''}
                          onChange={(e) => setEditFormState({ ...editFormState, state: e.target.value })}
                          placeholder="e.g. Tamil Nadu"
                          required
                          error={formErrors.state}
                          setError={(val) => setFormErrors({ ...formErrors, state: val })}
                        />
                        <ValidatedInput
                          label="Country"
                          type="text"
                          value={editFormState.country || ''}
                          onChange={(e) => setEditFormState({ ...editFormState, country: e.target.value })}
                          placeholder="e.g. India"
                          required
                          error={formErrors.country}
                          setError={(val) => setFormErrors({ ...formErrors, country: val })}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <ValidatedInput
                          label="FSSAI License Number"
                          type="text"
                          value={editFormState.license}
                          onChange={(e) => setEditFormState({ ...editFormState, license: e.target.value })}
                          placeholder="FSSAI-12345678901234"
                          required
                          error={formErrors.license}
                          setError={(val) => setFormErrors({ ...formErrors, license: val })}
                        />
                        <ValidatedInput
                          label="GSTIN Number"
                          type="text"
                          value={editFormState.gstin}
                          onChange={(e) => setEditFormState({ ...editFormState, gstin: e.target.value })}
                          placeholder="33AAAAA1111A1Z1"
                          required
                          error={formErrors.gstin}
                          setError={(val) => setFormErrors({ ...formErrors, gstin: val })}
                        />
                        <ValidatedInput
                          label="PAN Number"
                          type="text"
                          value={editFormState.pan}
                          onChange={(e) => setEditFormState({ ...editFormState, pan: e.target.value })}
                          placeholder="ABCDE1234F"
                          required
                          error={formErrors.pan}
                          setError={(val) => setFormErrors({ ...formErrors, pan: val })}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <ValidatedInput
                          label="Opening Time"
                          type="text"
                          value={editFormState.openingTime}
                          onChange={(e) => setEditFormState({ ...editFormState, openingTime: e.target.value })}
                          placeholder="e.g. 11:00 AM"
                          required
                          error={formErrors.openingTime}
                          setError={(val) => setFormErrors({ ...formErrors, openingTime: val })}
                        />
                        <ValidatedInput
                          label="Closing Time"
                          type="text"
                          value={editFormState.closingTime}
                          onChange={(e) => setEditFormState({ ...editFormState, closingTime: e.target.value })}
                          placeholder="e.g. 11:00 PM"
                          required
                          error={formErrors.closingTime}
                          setError={(val) => setFormErrors({ ...formErrors, closingTime: val })}
                        />
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                        <ValidatedInput
                          label="Tax Rate (%)"
                          type="number"
                          value={editFormState.taxRate}
                          onChange={(e) => setEditFormState({ ...editFormState, taxRate: parseFloat(e.target.value) || 0 })}
                          min="0" max="30" step="0.5" required
                          error={formErrors.taxRate}
                          setError={(val) => setFormErrors({ ...formErrors, taxRate: val })}
                        />
                        <ValidatedInput
                          label="Service Fee (%)"
                          type="number"
                          value={editFormState.serviceCharge}
                          onChange={(e) => setEditFormState({ ...editFormState, serviceCharge: parseFloat(e.target.value) || 0 })}
                          min="0" max="20" step="0.5" required
                          error={formErrors.serviceCharge}
                          setError={(val) => setFormErrors({ ...formErrors, serviceCharge: val })}
                        />
                        <ValidatedSelect
                          label="Status"
                          value={editFormState.status}
                          onChange={(e) => setEditFormState({ ...editFormState, status: e.target.value })}
                          error={formErrors.status}
                          setError={(val) => setFormErrors({ ...formErrors, status: val })}
                        >
                          <option value="Active">Active</option>
                          <option value="Suspended">Suspended</option>
                          <option value="Inactive">Inactive</option>
                        </ValidatedSelect>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <ValidatedInput
                          label="Restaurant Logo URL"
                          type="text"
                          value={editFormState.logo || ''}
                          onChange={(e) => setEditFormState({ ...editFormState, logo: e.target.value })}
                          placeholder="https://images.unsplash.com/... (Logo)"
                          error={formErrors.logo}
                          setError={(val) => setFormErrors({ ...formErrors, logo: val })}
                        />
                        <ValidatedInput
                          label="Restaurant Banner URL"
                          type="text"
                          value={editFormState.banner || ''}
                          onChange={(e) => setEditFormState({ ...editFormState, banner: e.target.value })}
                          placeholder="https://images.unsplash.com/... (Banner)"
                          error={formErrors.banner}
                          setError={(val) => setFormErrors({ ...formErrors, banner: val })}
                        />
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                        <button type="button" className="btn-outline" onClick={() => setEditingRestId(null)} style={{ padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#ffffff', color: '#64748b', border: '1px solid #cbd5e1' }}>Cancel</button>
                        <button type="submit" className="btn-black" style={{ padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#000000', color: '#ffffff', border: 'none' }}>Save Changes</button>
                      </div>
                    </form>
                  </div>
                )}

              </div>
            )
          )}

          {/* Tab 2: Premium Super Admin Dashboard & Analytics */}
          {activeTab === 'revenue' && (
            <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* KPI Metrics Row 1: Restaurants & Users */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {/* Card 1: Total Restaurants */}
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                  <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Building style={{ width: '22px', height: '22px' }} /></div>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Total Restaurants</span>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900' }}>{restaurants.length}</h3>
                    <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: '700' }}>100% Registered</span>
                  </div>
                </div>

                {/* Card 2: Active Restaurants */}
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle style={{ width: '22px', height: '22px' }} /></div>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Active Restaurants</span>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900' }}>{restaurants.filter(r => r.status === 'Active').length}</h3>
                    <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: '700' }}>Online & Serving</span>
                  </div>
                </div>

                {/* Card 3: Inactive Restaurants */}
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                  <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><AlertTriangle style={{ width: '22px', height: '22px' }} /></div>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Inactive Restaurants</span>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900' }}>{restaurants.filter(r => r.status !== 'Active').length}</h3>
                    <span style={{ fontSize: '0.65rem', color: '#f59e0b', fontWeight: '700' }}>Suspended/Offline</span>
                  </div>
                </div>


              </div>

              {/* KPI Metrics Row 2: Orders & Financials */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
                {/* Card 5: Standard Plan Count */}
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                  <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Award style={{ width: '22px', height: '22px' }} /></div>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Standard Plan</span>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900' }}>{restaurants.filter(r => r.subscriptionPlan?.includes('Standard')).length}</h3>
                    <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: '700' }}>Active Branches</span>
                  </div>
                </div>

                {/* Card 6: Premium Plan Count */}
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                  <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Award style={{ width: '22px', height: '22px' }} /></div>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Premium Plan</span>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900' }}>{restaurants.filter(r => r.subscriptionPlan?.includes('Premium')).length}</h3>
                    <span style={{ fontSize: '0.65rem', color: '#3b82f6', fontWeight: '700' }}>Active Branches</span>
                  </div>
                </div>

                {/* Card 7: Enterprise Plan Count */}
                <div className="glass-card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px' }}>
                  <div style={{ background: 'rgba(124, 58, 237, 0.1)', color: '#7c3aed', width: '42px', height: '42px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Award style={{ width: '22px', height: '22px' }} /></div>
                  <div>
                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block' }}>Enterprise Plan</span>
                    <h3 style={{ margin: 0, fontSize: '1.4rem', fontWeight: '900' }}>{restaurants.filter(r => r.subscriptionPlan?.includes('Enterprise')).length}</h3>
                    <span style={{ fontSize: '0.65rem', color: '#7c3aed', fontWeight: '700' }}>Active Branches</span>
                  </div>
                </div>

              </div>

              {/* Split Cards Container */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>

                {/* Card 1: Subscription Revenue Trend */}
                <div className="glass-card animate-fade-in" style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>Subscription Revenue Trend</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monthly recurring revenue from franchise plans</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: 'var(--primary)' }}>₹{subscriptionRevenue.toLocaleString()}</h2>
                      <span style={{ fontSize: '0.75rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '4px 10px', borderRadius: '6px', fontWeight: '800' }}>+12.5% vs Last Month</span>
                    </div>
                  </div>

                  <div style={{ position: 'relative', width: '100%', height: '220px', marginTop: 'auto' }}>
                    <svg viewBox="0 0 600 220" style={{ width: '100%', height: '100%', overflow: 'visible' }} preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                        </linearGradient>
                        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                          <feGaussianBlur stdDeviation="4" result="blur" />
                          <feComposite in="SourceGraphic" in2="blur" operator="over" />
                        </filter>
                      </defs>

                      {/* Background Grid Lines */}
                      <line x1="0" y1="20" x2="600" y2="20" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="5,5" />
                      <line x1="0" y1="90" x2="600" y2="90" stroke="var(--border-color)" strokeWidth="1" strokeDasharray="5,5" />
                      <line x1="0" y1="160" x2="600" y2="160" stroke="var(--border-color)" strokeWidth="1" />

                      {/* Area fill (Smooth Cubic Bezier) */}
                      <path
                        d="M 50,160 L 50,148 C 100,148 100,90 150,90 C 200,90 200,125 250,125 C 300,125 300,55 350,55 C 400,55 400,78 450,78 C 500,78 500,20 550,20 L 550,160 Z"
                        fill="url(#areaGradient)"
                      />

                      {/* Guideline for June */}
                      <line x1="550" y1="20" x2="550" y2="160" stroke="var(--primary)" strokeWidth="1.5" strokeDasharray="3,3" opacity="0.5" />

                      {/* Smooth Cubic Bezier Line */}
                      <path
                        d="M 50,148 C 100,148 100,90 150,90 C 200,90 200,125 250,125 C 300,125 300,55 350,55 C 400,55 400,78 450,78 C 500,78 500,20 550,20"
                        fill="none"
                        stroke="var(--primary)"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      {/* Data Points (Elegant Rings) */}
                      <circle cx="50" cy="148" r="4" fill="var(--bg-card)" stroke="var(--primary)" strokeWidth="2.5" />
                      <circle cx="150" cy="90" r="4" fill="var(--bg-card)" stroke="var(--primary)" strokeWidth="2.5" />
                      <circle cx="250" cy="125" r="4" fill="var(--bg-card)" stroke="var(--primary)" strokeWidth="2.5" />
                      <circle cx="350" cy="55" r="4" fill="var(--bg-card)" stroke="var(--primary)" strokeWidth="2.5" />
                      <circle cx="450" cy="78" r="4" fill="var(--bg-card)" stroke="var(--primary)" strokeWidth="2.5" />

                      {/* Active Data Point */}
                      <circle cx="550" cy="20" r="6" fill="var(--primary)" stroke="var(--bg-card)" strokeWidth="2.5" filter="url(#glow)" />

                      {/* Value Labels */}
                      <text x="50" y="130" textAnchor="middle" fontSize="11" fill="var(--text-muted)" fontWeight="700">₹{(subscriptionRevenue * 0.45 / 1000).toFixed(1)}K</text>
                      <text x="150" y="72" textAnchor="middle" fontSize="11" fill="var(--text-muted)" fontWeight="700">₹{(subscriptionRevenue * 0.7 / 1000).toFixed(1)}K</text>
                      <text x="250" y="107" textAnchor="middle" fontSize="11" fill="var(--text-muted)" fontWeight="700">₹{(subscriptionRevenue * 0.55 / 1000).toFixed(1)}K</text>
                      <text x="350" y="37" textAnchor="middle" fontSize="11" fill="var(--text-muted)" fontWeight="700">₹{(subscriptionRevenue * 0.85 / 1000).toFixed(1)}K</text>
                      <text x="450" y="60" textAnchor="middle" fontSize="11" fill="var(--text-muted)" fontWeight="700">₹{(subscriptionRevenue * 0.75 / 1000).toFixed(1)}K</text>

                      {/* Active Month Floating Tooltip */}
                      <g filter="url(#glow)">
                        <rect x="500" y="-30" width="100" height="32" rx="8" fill="var(--bg-card)" stroke="var(--primary)" strokeWidth="1.5" />
                        <text x="550" y="-10" textAnchor="middle" fontSize="12" fontWeight="800" fill="var(--text-main)">₹{(subscriptionRevenue / 1000).toFixed(1)}K</text>
                      </g>

                      {/* X-Axis Labels */}
                      <text x="50" y="190" textAnchor="middle" fontSize="13" fill="var(--text-muted)" fontWeight="600">Jan</text>
                      <text x="150" y="190" textAnchor="middle" fontSize="13" fill="var(--text-muted)" fontWeight="600">Feb</text>
                      <text x="250" y="190" textAnchor="middle" fontSize="13" fill="var(--text-muted)" fontWeight="600">Mar</text>
                      <text x="350" y="190" textAnchor="middle" fontSize="13" fill="var(--text-muted)" fontWeight="600">Apr</text>
                      <text x="450" y="190" textAnchor="middle" fontSize="13" fill="var(--text-muted)" fontWeight="600">May</text>
                      <text x="550" y="190" textAnchor="middle" fontSize="13" fill="var(--primary)" fontWeight="800">Jun (Current)</text>
                    </svg>
                  </div>
                </div>

                {/* Card 2: Subscription Plan Distribution */}
                <div className="glass-card animate-fade-in" style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '900' }}>Subscription Plan Distribution</h3>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active branch plan types and percentages</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: '900', color: '#10b981' }}>{standardCount + premiumCount + enterpriseCount}</h2>
                      <span style={{ fontSize: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '4px 10px', borderRadius: '6px', fontWeight: '800' }}>Active Branches</span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flex: 1, padding: '10px 0', marginTop: 'auto' }}>
                    {/* SVG Donut Chart */}
                    <div style={{ position: 'relative', width: '130px', height: '130px', flexShrink: 0 }}>
                      <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
                        {/* Grey Track under segments */}
                        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border-color)" strokeWidth="12" />

                        {/* Standard segment (Emerald green) */}
                        <circle
                          cx="50" cy="50" r="40" fill="none"
                          stroke="#10b981" strokeWidth="12"
                          strokeDasharray={`${standardDash} ${donutCircumference}`}
                          strokeDashoffset={0}
                          strokeLinecap="round"
                        />

                        {/* Premium segment (Blue) */}
                        <circle
                          cx="50" cy="50" r="40" fill="none"
                          stroke="#3b82f6" strokeWidth="12"
                          strokeDasharray={`${premiumDash} ${donutCircumference}`}
                          strokeDashoffset={-standardDash}
                          strokeLinecap="round"
                        />

                        {/* Enterprise segment (Purple) */}
                        <circle
                          cx="50" cy="50" r="40" fill="none"
                          stroke="#7c3aed" strokeWidth="12"
                          strokeDasharray={`${enterpriseDash} ${donutCircumference}`}
                          strokeDashoffset={-(standardDash + premiumDash)}
                          strokeLinecap="round"
                        />
                      </svg>

                      {/* Text inside the Donut hole */}
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center'
                      }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)', display: 'block', lineHeight: 1 }}>
                          {standardCount + premiumCount + enterpriseCount}
                        </span>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '0.5px' }}>
                          Branches
                        </span>
                      </div>
                    </div>

                    {/* Donut Chart Legend Panel */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                      {/* Standard */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>Standard Plan</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', display: 'block' }}>{standardCount}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>{standardPct.toFixed(0)}%</span>
                        </div>
                      </div>

                      {/* Premium */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>Premium Plan</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', display: 'block' }}>{premiumCount}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>{premiumPct.toFixed(0)}%</span>
                        </div>
                      </div>

                      {/* Enterprise */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '6px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#7c3aed', flexShrink: 0 }} />
                          <span style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-main)' }}>Enterprise Plan</span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', display: 'block' }}>{enterpriseCount}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>{enterprisePct.toFixed(0)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Section 4: Top Performing Restaurants directory & Ledger */}
              <div className="glass-card animate-fade-in" style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden' }}>
                <div style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '900' }}>Ranked Top Performing Restaurants Deck</h3>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Financial index rating computed across all active and suspended franchise codes.</span>
                  </div>
                  <button
                    onClick={() => {
                      showToast('success', 'Excel Spreadsheet report generated and downloaded (Simulated).')
                    }}
                    className="btn-outline"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', padding: '6px 12px', cursor: 'pointer' }}
                  >
                    <FileSpreadsheet style={{ width: '14px', height: '14px' }} /> Download Excel Sheet
                  </button>
                </div>

                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)' }}>
                      <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Restaurant</th>
                      <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Code ID</th>
                      <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>City / Location</th>
                      <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Operational Status</th>
                      <th style={{ textAlign: 'right', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Subscription Plan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {restaurants.map((rest, i) => {
                      const salesRatio = i === 0 ? 0.35 : i === 1 ? 0.25 : i === 2 ? 0.20 : i === 3 ? 0.12 : 0.08
                      const earnings = Math.round(totalRevenue * salesRatio)
                      const score = i === 0 ? '98/100' : i === 1 ? '92/100' : i === 2 ? '86/100' : i === 3 ? '78/100' : '72/100'
                      const rankIcon = i === 0 ? <Award style={{ width: '16px', height: '16px', color: '#7c3aed' }} /> : i === 1 ? <Award style={{ width: '16px', height: '16px', color: '#3b82f6' }} /> : i === 2 ? <Award style={{ width: '16px', height: '16px', color: '#10b981' }} /> : <Star style={{ width: '14px', height: '14px', color: '#f59e0b' }} />

                      return (
                        <tr key={rest.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s', ':hover': { backgroundColor: 'var(--bg-app)' } }}>
                          <td style={{ padding: '14px 18px', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <img src={rest.logo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=60&auto=format&fit=crop&q=60'} alt={rest.name} style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover', border: '1px solid var(--border-color)' }} />
                              <span>{rest.name}</span>
                            </div>
                          </td>
                          <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: '700' }}>{rest.id}</td>
                          <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: '600' }}>{rest.city || 'Chennai'}</td>
                          <td style={{ padding: '14px 18px' }}>
                            <span style={{
                              fontSize: '0.65rem',
                              fontWeight: '800',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              background: rest.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                              color: rest.status === 'Active' ? '#10b981' : '#ef4444'
                            }}>
                              {rest.status ? rest.status.toUpperCase() : 'ACTIVE'}
                            </span>
                          </td>
                          <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                            <span style={{
                              fontSize: '0.75rem',
                              fontWeight: '800',
                              padding: '4px 10px',
                              borderRadius: '6px',
                              background: rest.subscriptionPlan?.includes('Enterprise') ? 'rgba(124, 58, 237, 0.1)' : rest.subscriptionPlan?.includes('Premium') ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                              color: rest.subscriptionPlan?.includes('Enterprise') ? '#7c3aed' : rest.subscriptionPlan?.includes('Premium') ? '#3b82f6' : '#10b981'
                            }}>
                              {rest.subscriptionPlan || 'Standard Plan'}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {activeTab === 'billing' && (
            showGenerateInvoiceModal ? (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  background: '#ffffff',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '32px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', letterSpacing: '0.5px' }}>Revenue & Billing Ledger</span>
                      <h3 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)' }}>Generate Subscription Invoice</h3>
                    </div>
                    <button
                      className="btn-outline"
                      style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                      onClick={() => setShowGenerateInvoiceModal(false)}
                    >
                      Back to Ledger
                    </button>
                  </div>

                  <form onSubmit={handleGenerateInvoiceSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <ValidatedSelect
                      label="Restaurant Name"
                      value={newInvoiceFormState.restaurantName}
                      onChange={(e) => setNewInvoiceFormState({ ...newInvoiceFormState, restaurantName: e.target.value })}
                      required
                      error={formErrors.restaurantName}
                      setError={(val) => setFormErrors({ ...formErrors, restaurantName: val })}
                    >
                      {restaurants.map(rest => (
                        <option key={rest.id} value={rest.name}>{rest.name}</option>
                      ))}
                    </ValidatedSelect>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <ValidatedSelect
                        label="Subscription Plan"
                        value={newInvoiceFormState.subscriptionPlan}
                        onChange={(e) => {
                          const selectedPlanName = e.target.value
                          const foundPlan = plans.find(p => p.name === selectedPlanName)
                          const price = foundPlan ? foundPlan.monthlyPrice : 0
                          setNewInvoiceFormState({
                            ...newInvoiceFormState,
                            subscriptionPlan: selectedPlanName,
                            amount: price
                          })
                        }}
                        required
                        error={formErrors.subscriptionPlan}
                        setError={(val) => setFormErrors({ ...formErrors, subscriptionPlan: val })}
                      >
                        {plans.map(p => (
                          <option key={p.id} value={p.name}>{p.name}</option>
                        ))}
                      </ValidatedSelect>

                      <ValidatedInput
                        label="Amount (₹)"
                        type="number"
                        value={newInvoiceFormState.amount}
                        onChange={(e) => setNewInvoiceFormState({ ...newInvoiceFormState, amount: parseFloat(e.target.value) || 0 })}
                        placeholder="e.g. 4999"
                        required
                        min="0"
                        error={formErrors.amount}
                        setError={(val) => setFormErrors({ ...formErrors, amount: val })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <ValidatedSelect
                        label="Payment Method"
                        value={newInvoiceFormState.paymentMethod}
                        onChange={(e) => setNewInvoiceFormState({ ...newInvoiceFormState, paymentMethod: e.target.value })}
                        disabled={newInvoiceFormState.status === 'Pending'}
                        error={formErrors.paymentMethod}
                        setError={(val) => setFormErrors({ ...formErrors, paymentMethod: val })}
                      >
                        <option value="UPI">UPI</option>
                        <option value="Credit Card">Credit Card</option>
                        <option value="Net Banking">Net Banking</option>
                        <option value="N/A">N/A</option>
                      </ValidatedSelect>

                      <ValidatedSelect
                        label="Payment Status"
                        value={newInvoiceFormState.status}
                        onChange={(e) => {
                          const nextStatus = e.target.value
                          setNewInvoiceFormState({
                            ...newInvoiceFormState,
                            status: nextStatus,
                            paymentMethod: nextStatus === 'Pending' ? 'N/A' : (newInvoiceFormState.paymentMethod === 'N/A' ? 'UPI' : newInvoiceFormState.paymentMethod),
                            paymentDate: nextStatus === 'Pending' ? '' : (newInvoiceFormState.paymentDate || new Date().toISOString().split('T')[0])
                          })
                        }}
                        required
                        error={formErrors.status}
                        setError={(val) => setFormErrors({ ...formErrors, status: val })}
                      >
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                      </ValidatedSelect>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <ValidatedInput
                        label="Payment Date"
                        type="date"
                        value={newInvoiceFormState.paymentDate}
                        onChange={(e) => setNewInvoiceFormState({ ...newInvoiceFormState, paymentDate: e.target.value })}
                        disabled={newInvoiceFormState.status === 'Pending'}
                        error={formErrors.paymentDate}
                        setError={(val) => setFormErrors({ ...formErrors, paymentDate: val })}
                      />

                      <ValidatedInput
                        label="Due Date"
                        type="date"
                        value={newInvoiceFormState.dueDate}
                        onChange={(e) => setNewInvoiceFormState({ ...newInvoiceFormState, dueDate: e.target.value })}
                        required
                        error={formErrors.dueDate}
                        setError={(val) => setFormErrors({ ...formErrors, dueDate: val })}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                      <button type="button" className="btn-outline" onClick={() => setShowGenerateInvoiceModal(false)} style={{ padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#ffffff', color: '#64748b', border: '1px solid #cbd5e1' }}>Cancel</button>
                      <button type="submit" className="btn-black" style={{ padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#000000', color: '#ffffff', border: 'none' }}>Generate Invoice</button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                <div className="glass-card animate-fade-in" style={{ background: 'var(--bg-card)', borderRadius: '16px', border: '1px solid var(--border-color)', overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '0' }}>
                  <div style={{ padding: '20px 20px 10px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: '900' }}>Revenue & Billing Ledger</h3>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Generate subscription invoices, download PDFs, and process refunds.</span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                      <input
                        type="text"
                        placeholder="Search Invoice or Branch..."
                        value={invoiceSearchQuery}
                        onChange={(e) => setInvoiceSearchQuery(e.target.value)}
                        style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', fontSize: '0.75rem', width: '180px' }}
                      />

                      <select
                        value={invoiceStatusFilter}
                        onChange={(e) => setInvoiceStatusFilter(e.target.value)}
                        style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        <option value="All">All Statuses</option>
                        <option value="Paid">Paid</option>
                        <option value="Pending">Pending</option>
                        <option value="Failed">Failed</option>
                        <option value="Refunded">Refunded</option>
                      </select>

                      <button
                        onClick={() => {
                          setShowGenerateInvoiceModal(true)
                          setNewInvoiceFormState({
                            restaurantName: restaurants[0]?.name || '',
                            subscriptionPlan: 'Standard Plan',
                            amount: 1999,
                            paymentMethod: 'UPI',
                            paymentDate: new Date().toISOString().split('T')[0],
                            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            status: 'Paid'
                          })
                        }}
                        className="btn-black"
                        style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', padding: '7px 14px', borderRadius: '8px', cursor: 'pointer', border: 'none' }}
                      >
                        <Plus style={{ width: '14px', height: '14px' }} /> Generate Invoice
                      </button>
                    </div>
                  </div>

                  <div style={{ padding: '20px 20px 10px' }}>
                    <div className="dish-admin-list" style={{ overflowX: 'auto', background: 'var(--bg-app)', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'relative' }}>
                      <table className="menu-data-table">
                        <thead>
                          <tr style={{ background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)' }}>
                            <th style={{ textAlign: 'left', padding: '12px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', width: '60px', whiteSpace: 'nowrap' }}>S.No.</th>
                            <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Invoice Number</th>
                            <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Restaurant Name</th>
                            <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Subscription Plan</th>
                            <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Amount</th>
                            <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Payment Method</th>
                            <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Payment Date</th>
                            <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Due Date</th>
                            <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Payment Status</th>
                            <th style={{ textAlign: 'right', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {invoices
                            .filter(inv => {
                              const matchesSearch = inv.id.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
                                inv.restaurantName.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
                                inv.subscriptionPlan.toLowerCase().includes(invoiceSearchQuery.toLowerCase());
                              const matchesStatus = invoiceStatusFilter === 'All' || inv.status === invoiceStatusFilter;
                              return matchesSearch && matchesStatus;
                            })
                            .map((inv, idx) => (
                              <tr key={inv.id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background-color 0.2s' }}>
                                <td style={{ padding: '14px 24px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '700', whiteSpace: 'nowrap' }}>
                                  {idx + 1}
                                </td>
                                <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace', fontWeight: '700', whiteSpace: 'nowrap' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <FileText style={{ width: '14px', height: '14px', color: 'var(--primary)' }} />
                                    <span>{inv.id}</span>
                                  </div>
                                </td>
                                <td style={{ padding: '14px 18px', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>{inv.restaurantName}</td>
                                <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                                  <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: '800',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    background: inv.subscriptionPlan.includes('Enterprise') ? 'rgba(124, 58, 237, 0.1)' : inv.subscriptionPlan.includes('Premium') ? 'rgba(59, 130, 246, 0.1)' : inv.subscriptionPlan.includes('Standard') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                                    color: inv.subscriptionPlan.includes('Enterprise') ? '#7c3aed' : inv.subscriptionPlan.includes('Premium') ? '#3b82f6' : inv.subscriptionPlan.includes('Standard') ? '#10b981' : '#64748b',
                                    display: 'inline-block'
                                  }}>{inv.subscriptionPlan}</span>
                                </td>
                                <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: '700', whiteSpace: 'nowrap' }}>
                                  ₹{inv.amount.toLocaleString()}
                                </td>
                                <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', whiteSpace: 'nowrap' }}>
                                  {inv.paymentMethod}
                                </td>
                                <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', whiteSpace: 'nowrap' }}>
                                  {inv.paymentDate || '—'}
                                </td>
                                <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', whiteSpace: 'nowrap' }}>
                                  {inv.dueDate}
                                </td>
                                <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                                  <span style={{
                                    fontSize: '0.7rem',
                                    fontWeight: '800',
                                    padding: '4px 10px',
                                    borderRadius: '6px',
                                    background: inv.status === 'Paid' ? 'rgba(16, 185, 129, 0.1)' : inv.status === 'Pending' ? 'rgba(245, 158, 11, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    color: inv.status === 'Paid' ? '#10b981' : inv.status === 'Pending' ? '#f59e0b' : '#ef4444',
                                    display: 'inline-block',
                                    border: inv.status === 'Paid' ? '1px solid rgba(16, 185, 129, 0.2)' : inv.status === 'Pending' ? '1px solid rgba(245, 158, 11, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
                                  }}>
                                    {inv.status.toUpperCase()}
                                  </span>
                                </td>
                                <td style={{ padding: '14px 18px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                                    <button
                                      onClick={() => setViewingInvoice(inv)}
                                      className="btn-outline"
                                      style={{
                                        padding: '5px 10px',
                                        fontSize: '0.7rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        cursor: 'pointer',
                                        borderRadius: '6px'
                                      }}
                                      title="Download Invoice"
                                    >
                                      <FileSpreadsheet style={{ width: '12px', height: '12px' }} /> Download
                                    </button>

                                    <button
                                      onClick={() => {
                                        if (inv.status === 'Paid') {
                                          setRefundModalInvoice(inv)
                                          setRefundReason('')
                                        } else {
                                          showToast('info', 'Refunds can only be processed on Paid invoices.')
                                        }
                                      }}
                                      disabled={inv.status !== 'Paid'}
                                      className="btn-outline"
                                      style={{
                                        padding: '5px 10px',
                                        fontSize: '0.7rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '4px',
                                        cursor: inv.status === 'Paid' ? 'pointer' : 'not-allowed',
                                        borderRadius: '6px',
                                        borderColor: inv.status === 'Paid' ? '#7c3aed' : 'var(--border-color)',
                                        color: inv.status === 'Paid' ? '#7c3aed' : 'var(--text-muted)',
                                        opacity: inv.status === 'Paid' ? 1 : 0.5
                                      }}
                                      title="Refund Process"
                                    >
                                      <RefreshCw style={{ width: '12px', height: '12px' }} /> Refund
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          {invoices.filter(inv => {
                            const matchesSearch = inv.id.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
                              inv.restaurantName.toLowerCase().includes(invoiceSearchQuery.toLowerCase()) ||
                              inv.subscriptionPlan.toLowerCase().includes(invoiceSearchQuery.toLowerCase());
                            const matchesStatus = invoiceStatusFilter === 'All' || inv.status === invoiceStatusFilter;
                            return matchesSearch && matchesStatus;
                          }).length === 0 && (
                              <tr>
                                <td colSpan="10" style={{ textAlign: 'center', padding: '30px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                  No invoice records found matching your filters.
                                </td>
                              </tr>
                            )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}



          {/* Tab 4: Restaurant Admin Management */}
          {(activeTab === 'admins' || activeTab === 'platform-admins' || activeTab === 'users') && (
            showAddAdminModal ? (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '32px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', letterSpacing: '0.5px' }}></span>
                      <h3 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)' }}>Create New Restaurant User</h3>
                    </div>
                    <button
                      className="btn-outline"
                      style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                      onClick={() => setShowAddAdminModal(false)}
                    >
                      Back to Users
                    </button>
                  </div>

                  <form onSubmit={handleCreateAdminSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <ValidatedInput
                      label="Full Name"
                      type="text"
                      value={adminFormState.name}
                      onChange={(e) => setAdminFormState({ ...adminFormState, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      required
                      error={formErrors.name}
                      setError={(val) => setFormErrors({ ...formErrors, name: val })}
                    />

                    <ValidatedInput
                      label="Email Address"
                      type="email"
                      value={adminFormState.email}
                      onChange={(e) => setAdminFormState({ ...adminFormState, email: e.target.value })}
                      placeholder="e.g. ramesh@serviq.com"
                      required
                      error={formErrors.email}
                      setError={(val) => setFormErrors({ ...formErrors, email: val })}
                    />

                    <ValidatedInput
                      label="Phone Number"
                      type="text"
                      value={adminFormState.phone}
                      onChange={(e) => setAdminFormState({ ...adminFormState, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      required
                      error={formErrors.phone}
                      setError={(val) => setFormErrors({ ...formErrors, phone: val })}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                      <ValidatedSelect
                        label="Access Role"
                        value={adminFormState.role}
                        onChange={(e) => setAdminFormState({ ...adminFormState, role: e.target.value })}
                        required
                        error={formErrors.role}
                        setError={(val) => setFormErrors({ ...formErrors, role: val })}
                      >
                        <option value="Branch Admin">Branch Admin</option>
                        <option value="Branch Manager">Branch Manager</option>
                        <option value="Super Admin">Super Admin</option>
                      </ValidatedSelect>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <ValidatedSelect
                        label="Account Status"
                        value={adminFormState.status}
                        onChange={(e) => setAdminFormState({ ...adminFormState, status: e.target.value })}
                        required
                        error={formErrors.status}
                        setError={(val) => setFormErrors({ ...formErrors, status: val })}
                      >
                        <option value="Active">Active</option>
                        <option value="Disabled">Disabled</option>
                      </ValidatedSelect>
                      <ValidatedInput
                        label="Security Password"
                        type="password"
                        value={adminFormState.password}
                        onChange={(e) => setAdminFormState({ ...adminFormState, password: e.target.value })}
                        placeholder="Default: Serviq@123"
                        error={formErrors.password}
                        setError={(val) => setFormErrors({ ...formErrors, password: val })}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                      <button type="button" onClick={() => setShowAddAdminModal(false)} style={{ padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#ffffff', color: '#64748b', border: '1px solid #cbd5e1' }}>Cancel</button>
                      <button type="submit" style={{ padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#000000', color: '#ffffff', border: 'none' }}>Create Account</button>
                    </div>
                  </form>
                </div>
              </div>
            ) : editingAdminId ? (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '32px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', letterSpacing: '0.5px' }}>Branch Security & Credentials</span>
                      <h3 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)' }}>Edit User Profile: {editingAdminId}</h3>
                    </div>
                    <button
                      className="btn-outline"
                      style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                      onClick={() => setEditingAdminId(null)}
                    >
                      Back to Users
                    </button>
                  </div>

                  <form onSubmit={handleUpdateAdminSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <ValidatedInput
                      label="Full Name"
                      type="text"
                      value={adminFormState.name}
                      onChange={(e) => setAdminFormState({ ...adminFormState, name: e.target.value })}
                      placeholder="e.g. Ramesh Kumar"
                      required
                      error={formErrors.name}
                      setError={(val) => setFormErrors({ ...formErrors, name: val })}
                    />

                    <ValidatedInput
                      label="Email Address"
                      type="email"
                      value={adminFormState.email}
                      onChange={(e) => setAdminFormState({ ...adminFormState, email: e.target.value })}
                      placeholder="e.g. ramesh@serviq.com"
                      required
                      error={formErrors.email}
                      setError={(val) => setFormErrors({ ...formErrors, email: val })}
                    />

                    <ValidatedInput
                      label="Phone Number"
                      type="text"
                      value={adminFormState.phone}
                      onChange={(e) => setAdminFormState({ ...adminFormState, phone: e.target.value })}
                      placeholder="e.g. +91 98765 43210"
                      required
                      error={formErrors.phone}
                      setError={(val) => setFormErrors({ ...formErrors, phone: val })}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                      <ValidatedSelect
                        label="Access Role"
                        value={adminFormState.role}
                        onChange={(e) => setAdminFormState({ ...adminFormState, role: e.target.value })}
                        required
                        error={formErrors.role}
                        setError={(val) => setFormErrors({ ...formErrors, role: val })}
                      >
                        <option value="Branch Admin">Branch Admin</option>
                        <option value="Branch Manager">Branch Manager</option>
                        <option value="Super Admin">Super Admin</option>
                      </ValidatedSelect>
                    </div>

                    <ValidatedSelect
                      label="Account Status"
                      value={adminFormState.status}
                      onChange={(e) => setAdminFormState({ ...adminFormState, status: e.target.value })}
                      required
                      error={formErrors.status}
                      setError={(val) => setFormErrors({ ...formErrors, status: val })}
                    >
                      <option value="Active">Active</option>
                      <option value="Disabled">Disabled</option>
                    </ValidatedSelect>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
                      <button type="button" onClick={() => setEditingAdminId(null)} style={{ padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#ffffff', color: '#64748b', border: '1px solid #cbd5e1' }}>Cancel</button>
                      <button type="submit" style={{ padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#000000', color: '#ffffff', border: 'none' }}>Save Changes</button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>

                {/* Header / Top Control Panel */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)', minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', letterSpacing: '0.5px' }}></span>
                      <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)' }}>Users List</h3>
                    </div>
                    <button
                      onClick={() => {
                        setShowAddAdminModal(true)
                        setAdminFormState({
                          name: '',
                          email: '',
                          phone: '',
                          restaurantName: restaurants[0]?.name || '',
                          role: 'Branch Admin',
                          status: 'Active',
                          password: ''
                        })
                      }}
                      className="btn-black"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Plus style={{ width: '16px', height: '16px' }} /> Create User
                    </button>
                  </div>

                  {/* Data Table */}
                  <div className="dish-admin-list" style={{ overflowX: 'auto', background: 'var(--bg-app)', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'relative' }}>
                    <table className="menu-data-table">
                      <thead>
                        <tr>
                          <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', padding: '12px 24px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap', width: '60px' }}>S.No.</th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>User ID</th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Name</th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Email</th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Phone</th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Restaurant Name</th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Role</th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Status</th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Last Login Tracker</th>
                          <th style={{ position: 'sticky', top: 0, zIndex: 10, background: 'var(--bg-app)', borderBottom: '1px solid var(--border-color)', textAlign: 'right', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', whiteSpace: 'nowrap' }}>Operational Control</th>
                        </tr>
                      </thead>
                      <tbody>
                        {restaurantAdmins.map((admin, idx) => (
                          <tr key={admin.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '14px 24px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', whiteSpace: 'nowrap' }}>{idx + 1}</td>
                            <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', whiteSpace: 'nowrap' }}>{admin.id}</td>
                            <td style={{ padding: '14px 18px', fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', whiteSpace: 'nowrap' }}>{admin.name}</td>
                            <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-main)', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>{admin.email}</td>
                            <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', whiteSpace: 'nowrap' }}>{admin.phone || 'N/A'}</td>
                            <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: '700', whiteSpace: 'nowrap' }}>{admin.restaurantName}</td>
                            <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                              <span className="badge badge-new" style={{ fontSize: '0.65rem', textTransform: 'uppercase' }}>{admin.role}</span>
                            </td>
                            <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: '800',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                background: admin.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: admin.status === 'Active' ? '#10b981' : '#ef4444',
                                display: 'inline-block',
                                border: admin.status === 'Active' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
                              }}>{admin.status}</span>
                            </td>
                            <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600', whiteSpace: 'nowrap' }}>
                              {admin.lastLogin}
                            </td>
                            <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                                <button
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--primary)', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                                  onClick={() => setResettingPasswordAdminId(admin.id)}
                                  title="Reset Password"
                                >
                                  <Key style={{ width: '16px', height: '16px' }} />
                                </button>
                                <button
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    color: admin.status === 'Active' ? '#10b981' : '#ef4444',
                                    transition: 'opacity 0.2s',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                  onClick={() => handleToggleAdminStatus(admin.id)}
                                  title={admin.status === 'Active' ? "Disable Account" : "Enable Account"}
                                >
                                  {admin.status === 'Active' ? (
                                    <Unlock style={{ width: '16px', height: '16px' }} />
                                  ) : (
                                    <Lock style={{ width: '16px', height: '16px' }} />
                                  )}
                                </button>
                                <button
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--text-muted)', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                                  onClick={() => handleEditAdminClick(admin)}
                                  title="Edit Admin"
                                >
                                  <Edit2 style={{ width: '16px', height: '16px' }} />
                                </button>
                                <button
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#ef4444', transition: 'opacity 0.2s', display: 'flex', alignItems: 'center' }}
                                  onClick={() => handleDeleteAdmin(admin.id)}
                                  title="Delete Admin"
                                >
                                  <Trash2 style={{ width: '16px', height: '16px' }} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          )}

          {activeTab === 'roles' && (() => {
            const handlePermChange = (module, action, checked) => {
              setRoleFormState(prev => ({
                ...prev,
                perms: {
                  ...prev.perms,
                  [module]: {
                    ...prev.perms[module],
                    [action]: checked
                  }
                }
              }))
            }

            const toggleSelectAll = (action) => {
              const allChecked = ['dashboard', 'restaurants', 'roles', 'adminUsers', 'subscriptions', 'revenue'].every(
                module => roleFormState.perms[module]?.[action]
              )
              const updatedPerms = { ...roleFormState.perms }
              const nextVal = !allChecked
                ;['dashboard', 'restaurants', 'roles', 'adminUsers', 'subscriptions', 'revenue'].forEach(module => {
                  updatedPerms[module] = {
                    ...updatedPerms[module],
                    [action]: nextVal
                  }
                })
              setRoleFormState(prev => ({
                ...prev,
                perms: updatedPerms
              }))
            }

            const isAllChecked = (action) => {
              return ['dashboard', 'restaurants', 'roles', 'adminUsers', 'subscriptions', 'revenue'].every(
                module => roleFormState.perms[module]?.[action]
              )
            }

            return editingRoleId ? (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '32px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: '4px 0 0 0', fontSize: '1.4rem', fontWeight: '900', color: 'var(--text-main)' }}>
                        {editingRoleId === 'new' ? 'Add New Role' : 'Edit Role & Permissions'}
                      </h3>
                    </div>
                    <button
                      className="btn-outline"
                      style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                      onClick={() => setEditingRoleId(null)}
                    >
                      Back to Roles
                    </button>
                  </div>

                  <form onSubmit={handleSaveRole} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                      <div className="form-group">
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: roleFormErrors.name ? '#dc2626' : '#334155', display: 'block', marginBottom: '6px' }}>
                          Role Name <span style={{ color: '#d81b60' }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            value={roleFormState.name}
                            onChange={(e) => {
                              setRoleFormState({ ...roleFormState, name: e.target.value })
                              if (roleFormErrors.name) setRoleFormErrors({ ...roleFormErrors, name: null })
                            }}
                            placeholder="E.g. Sales Manager"
                            style={{
                              width: '100%',
                              padding: '12px 16px',
                              paddingRight: roleFormErrors.name ? '40px' : '16px',
                              border: roleFormErrors.name ? '1px solid #dc2626' : '1px solid #cbd5e1',
                              background: '#ffffff',
                              color: roleFormErrors.name ? '#dc2626' : '#0f172a',
                              borderRadius: '8px',
                              fontSize: '0.9rem',
                              outline: 'none',
                              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
                            }}
                          />
                          {roleFormErrors.name && (
                            <AlertTriangle style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#dc2626', width: '18px', height: '18px' }} />
                          )}
                        </div>
                        {roleFormErrors.name && (
                          <span style={{ color: '#dc2626', fontSize: '0.75rem', marginTop: '6px', display: 'block' }}>{roleFormErrors.name}</span>
                        )}
                      </div>

                      <div className="form-group">
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                          Slug
                        </label>
                        <input
                          type="text"
                          value={roleFormState.slug || ''}
                          onChange={(e) => setRoleFormState({ ...roleFormState, slug: e.target.value })}
                          placeholder="e.g. sales-manager"
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#0f172a',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            outline: 'none',
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
                          }}
                        />
                      </div>

                      <div className="form-group">
                        <label style={{ fontSize: '0.85rem', fontWeight: '700', color: '#334155', display: 'block', marginBottom: '6px' }}>
                          Role Status
                        </label>
                        <select
                          value={roleFormState.status || 'Active'}
                          onChange={(e) => setRoleFormState({ ...roleFormState, status: e.target.value })}
                          required
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            border: '1px solid #cbd5e1',
                            background: '#ffffff',
                            color: '#0f172a',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            outline: 'none',
                            height: '46px',
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
                          }}
                        >
                          <option value="Active">Active</option>
                          <option value="Disabled">Disabled</option>
                        </select>
                      </div>
                    </div>


                    <div style={{ marginTop: '16px' }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '0.95rem', color: '#334155', fontWeight: '800' }}>Access Permissions</h4>
                      <div style={{ overflowX: 'auto', border: '1px solid #cbd5e1', borderRadius: '12px' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#ffffff', minWidth: '600px' }}>
                          <thead>
                            <tr style={{ background: '#d81b60', color: '#ffffff' }}>
                              <th style={{ padding: '16px 20px', textAlign: 'left', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: 'none' }}>Modules</th>
                              {['view', 'add', 'edit', 'delete'].map(action => (
                                <th key={action} style={{ padding: '16px 20px', textAlign: 'center', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: 'none', width: '100px' }}>
                                  <div style={{ marginBottom: '6px' }}>{action}</div>
                                  <div
                                    onClick={() => toggleSelectAll(action)}
                                    style={{
                                      width: '18px',
                                      height: '18px',
                                      borderRadius: '50%',
                                      border: '2px solid #ffffff',
                                      background: isAllChecked(action) ? '#ffffff' : 'transparent',
                                      display: 'inline-flex',
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                      cursor: 'pointer',
                                      transition: 'all 0.2s',
                                      margin: '0 auto'
                                    }}
                                  >
                                    {isAllChecked(action) && (
                                      <div style={{
                                        width: '8px',
                                        height: '8px',
                                        borderRadius: '50%',
                                        background: 'var(--text-main)'
                                      }} />
                                    )}
                                  </div>
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {['dashboard', 'restaurants', 'roles', 'adminUsers', 'subscriptions', 'revenue'].map((module, idx) => {
                              const displayNames = {
                                dashboard: 'Dashboard',
                                restaurants: 'Restaurants',
                                roles: 'Roles & Permissions',
                                adminUsers: 'Admin Users',
                                subscriptions: 'Subscription & Plans',
                                revenue: 'Revenue & Billing'
                              }
                              return (
                                <tr key={module} style={{ borderBottom: idx === 5 ? 'none' : '1px solid #f1f5f9' }}>
                                  <td style={{ padding: '16px 20px', fontWeight: '700', color: '#1e293b', fontSize: '0.85rem' }}>
                                    {displayNames[module]}
                                  </td>
                                  {['view', 'add', 'edit', 'delete'].map(action => {
                                    const checked = !!roleFormState.perms[module]?.[action]
                                    return (
                                      <td key={action} style={{ padding: '16px 20px', textAlign: 'center' }}>
                                        <div
                                          onClick={() => handlePermChange(module, action, !checked)}
                                          style={{
                                            width: '18px',
                                            height: '18px',
                                            borderRadius: '50%',
                                            border: `2px solid ${checked ? 'var(--text-main)' : '#cbd5e1'}`,
                                            background: checked ? 'var(--text-main)' : 'transparent',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            margin: '0 auto'
                                          }}
                                        >
                                          {checked && (
                                            <div style={{
                                              width: '6px',
                                              height: '6px',
                                              borderRadius: '50%',
                                              background: '#ffffff'
                                            }} />
                                          )}
                                        </div>
                                      </td>
                                    )
                                  })}
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                      <button type="button" className="btn-outline" onClick={() => setEditingRoleId(null)} style={{ padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#ffffff', color: '#64748b', border: '1px solid #cbd5e1' }}>Cancel</button>
                      <button type="submit" className="btn-black" style={{ padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#000000', color: '#ffffff', border: 'none' }}>{editingRoleId === 'new' ? 'Create Role' : 'Save Changes'}</button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', background: 'var(--bg-card)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <h3 style={{ margin: '4px 0 0 0', fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)' }}>Roles & Permissions</h3>
                    </div>
                    <button
                      onClick={() => {
                        setEditingRoleId('new')
                        setRoleFormErrors({})
                        setRoleFormState({
                          name: '',
                          desc: '',
                          status: 'Active',
                          perms: {
                            dashboard: { view: false, add: false, edit: false, delete: false },
                            restaurants: { view: false, add: false, edit: false, delete: false },
                            roles: { view: false, add: false, edit: false, delete: false },
                            adminUsers: { view: false, add: false, edit: false, delete: false },
                            subscriptions: { view: false, add: false, edit: false, delete: false },
                            revenue: { view: false, add: false, edit: false, delete: false }
                          }
                        })
                      }}
                      className="btn-black"
                      style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
                    >
                      <Plus style={{ width: '16px', height: '16px' }} /> Add Custom Role
                    </button>
                  </div>

                  <div style={{ overflowX: 'auto', background: 'var(--bg-app)', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'relative' }}>
                    <table className="menu-data-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                      <thead>
                        <tr>
                          <th style={{ padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', borderBottom: '1px solid var(--border-color)', width: '60px' }}>S.No</th>
                          <th style={{ padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', borderBottom: '1px solid var(--border-color)' }}>Role Name</th>
                          <th style={{ padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', borderBottom: '1px solid var(--border-color)' }}>Status</th>
                          <th style={{ padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', borderBottom: '1px solid var(--border-color)', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {systemRoles.map((role, index) => (
                          <tr key={role.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                            <td style={{ padding: '14px 18px', fontWeight: '600', color: 'var(--text-muted)' }}>{index + 1}</td>
                            <td style={{ padding: '14px 18px', fontWeight: '800', color: 'var(--text-main)' }}>{role.name}</td>
                            <td style={{ padding: '14px 18px', whiteSpace: 'nowrap' }}>
                              <span style={{
                                fontSize: '0.7rem',
                                fontWeight: '800',
                                padding: '4px 10px',
                                borderRadius: '6px',
                                background: (role.status || 'Active') === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                color: (role.status || 'Active') === 'Active' ? '#10b981' : '#ef4444',
                                display: 'inline-block',
                                border: (role.status || 'Active') === 'Active' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(239, 68, 68, 0.2)'
                              }}>{role.status || 'Active'}</span>
                            </td>
                            <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', alignItems: 'center' }}>
                                <button
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    cursor: 'pointer',
                                    padding: '6px',
                                    color: (role.status || 'Active') === 'Active' ? '#10b981' : '#ef4444',
                                    transition: 'opacity 0.2s',
                                    display: 'flex',
                                    alignItems: 'center'
                                  }}
                                  onClick={() => handleToggleRoleStatus(role.id)}
                                  title={(role.status || 'Active') === 'Active' ? "Disable Role" : "Enable Role"}
                                >
                                  {(role.status || 'Active') === 'Active' ? (
                                    <Unlock style={{ width: '16px', height: '16px' }} />
                                  ) : (
                                    <Lock style={{ width: '16px', height: '16px' }} />
                                  )}
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingRoleId(role.id)
                                    setRoleFormErrors({})
                                    setRoleFormState(role)
                                  }}
                                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--text-muted)', transition: 'color 0.2s', display: 'flex', alignItems: 'center' }}
                                  title="Edit Role"
                                >
                                  <Edit2 style={{ width: '16px', height: '16px' }} />
                                </button>
                                {role.id !== 'role-1' && (
                                  <button
                                    onClick={() => handleDeleteRole(role.id)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: '#ef4444', transition: 'opacity 0.2s', display: 'flex', alignItems: 'center' }}
                                    title="Delete Role"
                                  >
                                    <Trash2 style={{ width: '16px', height: '16px' }} />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          })()}


          {activeTab === 'plans' && (
            editingPlanId ? (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '16px',
                  padding: '32px',
                  boxShadow: 'var(--shadow-sm)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
                    <div>
                      <h3 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)' }}>
                        {editingPlanId === 'new' ? 'Create Subscription Plan' : 'Modify Subscription Plan'}
                      </h3>
                    </div>
                    <button
                      className="btn-outline"
                      style={{ padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700' }}
                      onClick={() => setEditingPlanId(null)}
                    >
                      Back to Plans
                    </button>
                  </div>

                  <form onSubmit={editingPlanId === 'new' ? handleCreatePlan : handleModifyPlan} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <ValidatedInput
                      label="Plan Name"
                      type="text"
                      value={planFormState.name}
                      onChange={(e) => setPlanFormState({ ...planFormState, name: e.target.value })}
                      placeholder="e.g. Starter Plan"
                      required
                      error={formErrors.name}
                      setError={(val) => setFormErrors({ ...formErrors, name: val })}
                    />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <ValidatedInput
                        label="Monthly Price (₹)"
                        type="number"
                        value={planFormState.monthlyPrice}
                        onChange={(e) => setPlanFormState({ ...planFormState, monthlyPrice: e.target.value })}
                        placeholder="e.g. 1999"
                        required
                        min="0"
                        error={formErrors.monthlyPrice}
                        setError={(val) => setFormErrors({ ...formErrors, monthlyPrice: val })}
                      />
                      <ValidatedInput
                        label="Annual Price (₹)"
                        type="number"
                        value={planFormState.annualPrice}
                        onChange={(e) => setPlanFormState({ ...planFormState, annualPrice: e.target.value })}
                        placeholder="e.g. 19999"
                        required
                        min="0"
                        error={formErrors.annualPrice}
                        setError={(val) => setFormErrors({ ...formErrors, annualPrice: val })}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      <ValidatedInput
                        label="Branch Limit"
                        type="number"
                        value={planFormState.branchLimit}
                        onChange={(e) => setPlanFormState({ ...planFormState, branchLimit: e.target.value })}
                        placeholder="Unlimited: 99999"
                        required
                        min="1"
                        error={formErrors.branchLimit}
                        setError={(val) => setFormErrors({ ...formErrors, branchLimit: val })}
                      />
                      <ValidatedInput
                        label="User Limit"
                        type="number"
                        value={planFormState.userLimit}
                        onChange={(e) => setPlanFormState({ ...planFormState, userLimit: e.target.value })}
                        placeholder="Unlimited: 99999"
                        required
                        min="1"
                        error={formErrors.userLimit}
                        setError={(val) => setFormErrors({ ...formErrors, userLimit: val })}
                      />
                      <ValidatedInput
                        label="Order Limit"
                        type="number"
                        value={planFormState.orderLimit}
                        onChange={(e) => setPlanFormState({ ...planFormState, orderLimit: e.target.value })}
                        placeholder="Unlimited: 99999"
                        required
                        min="1"
                        error={formErrors.orderLimit}
                        setError={(val) => setFormErrors({ ...formErrors, orderLimit: val })}
                      />
                    </div>

                    <ValidatedInput
                      label="Features Included (comma-separated)"
                      type="text"
                      value={planFormState.features}
                      onChange={(e) => setPlanFormState({ ...planFormState, features: e.target.value })}
                      placeholder="e.g. Waiter Apps, Kitchen KDS, Advanced Billing"
                      required
                      error={formErrors.features}
                      setError={(val) => setFormErrors({ ...formErrors, features: val })}
                    />

                    <ValidatedSelect
                      label="Status"
                      value={planFormState.status}
                      onChange={(e) => setPlanFormState({ ...planFormState, status: e.target.value })}
                      error={formErrors.status}
                      setError={(val) => setFormErrors({ ...formErrors, status: val })}
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </ValidatedSelect>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '32px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
                      <button type="button" className="btn-outline" onClick={() => setEditingPlanId(null)} style={{ padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#ffffff', color: '#64748b', border: '1px solid #cbd5e1' }}>Cancel</button>
                      <button type="submit" className="btn-black" style={{ padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#000000', color: '#ffffff', border: 'none' }}>{editingPlanId === 'new' ? 'Create Plan' : 'Save Changes'}</button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', minWidth: 0 }}>

                {/* Top Banner / Actions Control */}
                <div className="glass-card" style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: '4px 0 0 0', fontSize: '1.25rem', fontWeight: '900', color: 'var(--text-main)' }}>Subscription Tier Configurations</h3>
                  </div>
                  <button
                    onClick={() => {
                      setEditingPlanId('new')
                      setPlanFormState({
                        name: '',
                        monthlyPrice: '',
                        annualPrice: '',
                        branchLimit: '',
                        userLimit: '',
                        orderLimit: '',
                        features: '',
                        status: 'Active'
                      })
                    }}
                    className="btn-black"
                    style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}
                  >
                    <Plus style={{ width: '16px', height: '16px' }} /> Create Plan
                  </button>
                </div>

                {/* Plans Cards Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  {plans.map(plan => (
                    <div key={plan.id} className="glass-card" style={{
                      padding: '24px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-color)',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '16px',
                      position: 'relative'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: 'var(--text-main)' }}>{plan.name}</h4>
                          <span style={{
                            fontSize: '0.65rem',
                            fontWeight: '800',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: plan.status === 'Active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            color: plan.status === 'Active' ? '#10b981' : '#ef4444',
                            display: 'inline-block',
                            marginTop: '6px'
                          }}>{plan.status}</span>
                        </div>

                        <button
                          onClick={() => {
                            setEditingPlanId(plan.id)
                            setPlanFormState({
                              name: plan.name,
                              monthlyPrice: plan.monthlyPrice.toString(),
                              annualPrice: plan.annualPrice.toString(),
                              branchLimit: plan.branchLimit.toString(),
                              userLimit: plan.userLimit.toString(),
                              orderLimit: plan.orderLimit.toString(),
                              features: plan.features.join(', '),
                              status: plan.status
                            })
                          }}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', color: 'var(--text-muted)' }}
                          title="Modify Plan"
                        >
                          <Edit2 style={{ width: '16px', height: '16px' }} />
                        </button>
                      </div>

                      <div style={{ borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '12px 0', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Monthly Price</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '800' }}>₹{plan.monthlyPrice.toLocaleString()}/mo</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Annual Price</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '800' }}>₹{plan.annualPrice.toLocaleString()}/yr</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Branch Limit:</span>
                          <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{plan.branchLimit === 99999 ? 'Unlimited' : `${plan.branchLimit} Branch(es)`}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>User Limit:</span>
                          <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{plan.userLimit === 99999 ? 'Unlimited' : `${plan.userLimit} User(s)`}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: 'var(--text-muted)' }}>Order Limit:</span>
                          <span style={{ fontWeight: '700', color: 'var(--text-main)' }}>{plan.orderLimit === 99999 ? 'Unlimited' : `${plan.orderLimit.toLocaleString()} Orders/mo`}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '4px' }}>
                        {plan.features.map((feat, idx) => (
                          <span key={idx} style={{
                            fontSize: '0.6rem',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            background: 'var(--bg-app)',
                            color: 'var(--text-muted)',
                            border: '1px solid var(--border-color)'
                          }}>{feat}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Branch Subscriptions Control List */}
                <div className="glass-card" style={{ padding: '24px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: '800', color: 'var(--text-main)' }}>Active Branch Subscription Assignments</h4>

                  <div style={{ overflowX: 'auto', background: 'var(--bg-app)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <table className="menu-data-table">
                      <thead>
                        <tr>
                          <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', width: '60px', whiteSpace: 'nowrap' }}>S.No</th>
                          <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Branch Name</th>
                          <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Plan Classification</th>
                          <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Tariff Rate</th>
                          <th style={{ textAlign: 'left', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Auto Renewal</th>
                          <th style={{ textAlign: 'right', padding: '12px 18px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800', width: '220px' }}>Upgrade/Downgrade Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {restaurants.map((rest, idx) => {
                          const matchingPlan = plans.find(p => p.name.toLowerCase().includes(rest.subscriptionPlan?.toLowerCase())) || plans[0]
                          const isAutoRenew = rest.autoRenewal !== false
                          return (
                            <tr key={rest.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                              <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '700', whiteSpace: 'nowrap' }}>
                                {idx + 1}
                              </td>
                              <td style={{ padding: '14px 18px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <img src={rest.logo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=60&auto=format&fit=crop&q=60'} alt={rest.name} style={{ width: '28px', height: '28px', borderRadius: '6px', objectFit: 'cover' }} />
                                  <div>
                                    <span style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--text-main)', display: 'block' }}>{rest.name}</span>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Code: {rest.id} • {rest.city}</span>
                                  </div>
                                </div>
                              </td>
                              <td style={{ padding: '14px 18px' }}>
                                <span style={{
                                  fontSize: '0.7rem',
                                  fontWeight: '800',
                                  padding: '4px 10px',
                                  borderRadius: '6px',
                                  background: rest.subscriptionPlan === 'Enterprise' ? 'rgba(124, 58, 237, 0.1)' : rest.subscriptionPlan === 'Premium' ? 'rgba(59, 130, 246, 0.1)' : rest.subscriptionPlan === 'Standard' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                                  color: rest.subscriptionPlan === 'Enterprise' ? '#7c3aed' : rest.subscriptionPlan === 'Premium' ? '#3b82f6' : rest.subscriptionPlan === 'Standard' ? '#10b981' : '#64748b',
                                  display: 'inline-block'
                                }}>{rest.subscriptionPlan || 'Free Plan'}</span>
                              </td>
                              <td style={{ padding: '14px 18px', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: '700' }}>
                                ₹{matchingPlan.monthlyPrice.toLocaleString()}/mo
                              </td>
                              <td style={{ padding: '14px 18px' }}>
                                <label className="switch-label" style={{ margin: 0, gap: '6px' }}>
                                  <input
                                    type="checkbox"
                                    className="switch-input"
                                    checked={isAutoRenew}
                                    onChange={() => handleToggleAutoRenewal(rest)}
                                  />
                                  <div className="switch-track" style={{ width: '28px', height: '16px', background: isAutoRenew ? 'var(--primary)' : '#cbd5e1' }}>
                                    <div className="switch-thumb" style={{ width: '12px', height: '12px', left: isAutoRenew ? '13px' : '3px' }}></div>
                                  </div>
                                  <span style={{ fontSize: '0.75rem', minWidth: '40px', color: isAutoRenew ? 'var(--text-main)' : 'var(--text-muted)' }}>
                                    {isAutoRenew ? 'Active' : 'Disabled'}
                                  </span>
                                </label>
                              </td>
                              <td style={{ padding: '14px 18px', textAlign: 'right' }}>
                                {changingPlanRestId === rest.id ? (
                                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                    <select
                                      defaultValue={rest.subscriptionPlan}
                                      onChange={(e) => handleAssignPlan(rest.id, e.target.value)}
                                      style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border-color)', background: 'var(--bg-app)', color: 'var(--text-main)', fontSize: '0.75rem', cursor: 'pointer' }}
                                    >
                                      {plans.map(p => (
                                        <option key={p.id} value={p.name}>{p.name}</option>
                                      ))}
                                    </select>
                                    <button onClick={() => setChangingPlanRestId(null)} style={{ background: 'none', border: 'none', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer', fontWeight: '700', display: 'flex', alignItems: 'center' }}><X style={{ width: '14px', height: '14px' }} /></button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setChangingPlanRestId(rest.id)}
                                    className="btn-outline"
                                    style={{ padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}
                                  >
                                    Modify Plan
                                  </button>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )
          )}

        </div>
      </div>

      {/* Branch Performance Modal */}



      {/* Dynamic Reset Password Modal Overlay */}
      {resettingPasswordAdminId && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(9, 13, 22, 0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999,
          padding: '20px'
        }} onClick={() => { setResettingPasswordAdminId(null); setPasswordResetValue(''); setPasswordConfirmValue(''); }}>
          <div className="menu-edit-panel animate-fade-in" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '32px',
            width: '90%',
            maxWidth: '400px',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
            top: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Reset Security Password
              </h3>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
                onClick={() => { setResettingPasswordAdminId(null); setPasswordResetValue(''); setPasswordConfirmValue(''); }}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <form onSubmit={handleResetPasswordSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '12px', background: 'var(--primary-light)', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Key style={{ width: '14px', height: '14px', flexShrink: 0 }} /> Updating password credentials for User Account ID: {resettingPasswordAdminId}
              </div>

              <ValidatedInput
                label="New Secret Password"
                type="password"
                value={passwordResetValue}
                onChange={(e) => setPasswordResetValue(e.target.value)}
                placeholder="Enter new strong password"
                required
                error={formErrors.passwordResetValue}
                setError={(val) => setFormErrors({ ...formErrors, passwordResetValue: val })}
              />

              <ValidatedInput
                label="Confirm Secret Password"
                type="password"
                value={passwordConfirmValue}
                onChange={(e) => setPasswordConfirmValue(e.target.value)}
                placeholder="Confirm new secret password"
                required
                error={formErrors.passwordConfirmValue}
                setError={(val) => setFormErrors({ ...formErrors, passwordConfirmValue: val })}
              />

              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button type="submit" className="btn-black" style={{ flex: 1, padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#000000', color: '#ffffff', border: 'none' }}>Update Password</button>
                <button type="button" className="btn-outline" onClick={() => { setResettingPasswordAdminId(null); setPasswordResetValue(''); setPasswordConfirmValue(''); }} style={{ flex: 1, padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#ffffff', color: '#64748b', border: '1px solid #cbd5e1' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Branch Performance Modal */}
      {renderPerformanceModal()}



      {/* Invoice PDF Preview Modal Overlay */}
      {viewingInvoice && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(9, 13, 22, 0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999,
          padding: '20px'
        }} onClick={() => setViewingInvoice(null)}>
          <div className="menu-edit-panel animate-fade-in" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px',
            width: '95%',
            maxWidth: '600px',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
            top: 'auto',
            maxHeight: '90vh',
            overflowY: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                  Invoice Receipt: {viewingInvoice.id}
                </h3>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Serviq Subscription Billing System</span>
              </div>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
                onClick={() => setViewingInvoice(null)}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <div id="printable-invoice-card" style={{ padding: '24px', background: 'var(--bg-app)', border: '1px solid var(--border-color)', borderRadius: '12px', color: 'var(--text-main)', fontSize: '0.8rem', fontFamily: 'sans-serif' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: 'var(--primary)', margin: '0 0 4px 0', letterSpacing: '-0.5px' }}>SERVIQ</h2>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block' }}>E-Commerce POS & Operations</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Tech Park, Chennai, TN, India</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: '0.95rem', fontWeight: '800' }}>INVOICE</h4>
                  <span style={{ fontSize: '0.75rem', fontWeight: '700', fontFamily: 'monospace', color: 'var(--text-muted)', display: 'block' }}>{viewingInvoice.id}</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Status: <strong>{viewingInvoice.status.toUpperCase()}</strong></span>
                </div>
              </div>

              <div style={{ borderTop: '1px dashed var(--border-color)', margin: '16px 0' }}></div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div>
                  <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Billed To:</span>
                  <strong style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>{viewingInvoice.restaurantName}</strong>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>Operational Branch</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Invoice Date: </span>
                    <span style={{ fontWeight: '700' }}>{viewingInvoice.paymentDate || viewingInvoice.dueDate}</span>
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Due Date: </span>
                    <span style={{ fontWeight: '700' }}>{viewingInvoice.dueDate}</span>
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Payment Method: </span>
                    <span style={{ fontWeight: '700' }}>{viewingInvoice.paymentMethod}</span>
                  </div>
                </div>
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)' }}>
                    <th style={{ textAlign: 'left', paddingBottom: '8px', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Item Description</th>
                    <th style={{ textAlign: 'right', paddingBottom: '8px', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Qty</th>
                    <th style={{ textAlign: 'right', paddingBottom: '8px', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Unit Rate</th>
                    <th style={{ textAlign: 'right', paddingBottom: '8px', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: '800' }}>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 0', fontWeight: '700', color: 'var(--text-main)' }}>
                      Subscription Plan: {viewingInvoice.subscriptionPlan}
                      <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 'normal', marginTop: '2px' }}>Monthly recurring platform license fee</span>
                    </td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: '700' }}>1</td>
                    <td style={{ padding: '10px 0', textAlign: 'right' }}>₹{viewingInvoice.amount.toLocaleString()}</td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: '800', color: 'var(--text-main)' }}>₹{viewingInvoice.amount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" style={{ padding: '10px 0' }}></td>
                    <td style={{ padding: '10px 0', textAlign: 'right', color: 'var(--text-muted)', fontWeight: '600' }}>Subtotal</td>
                    <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: '700', color: 'var(--text-main)' }}>₹{viewingInvoice.amount.toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td colSpan="2" style={{ padding: '4px 0' }}></td>
                    <td style={{ padding: '4px 0', textAlign: 'right', color: 'var(--text-muted)', fontWeight: '600' }}>Tax (GST 18% Incl.)</td>
                    <td style={{ padding: '4px 0', textAlign: 'right', color: 'var(--text-muted)' }}>₹0.00</td>
                  </tr>
                  <tr style={{ borderTop: '2px solid var(--border-color)' }}>
                    <td colSpan="2" style={{ padding: '12px 0' }}></td>
                    <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: '800', fontSize: '0.85rem', color: 'var(--text-main)' }}>Grand Total</td>
                    <td style={{ padding: '12px 0', textAlign: 'right', fontWeight: '900', fontSize: '0.9rem', color: 'var(--primary)' }}>₹{viewingInvoice.amount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>

              <div style={{ borderTop: '1px dashed var(--border-color)', margin: '16px 0' }}></div>

              <div style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                <span>Thank you for choosing Serviq platform operations!</span>
                <span style={{ display: 'block', marginTop: '4px' }}>For billing disputes or support: billing@serviq.com</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                onClick={() => {
                  window.print()
                  showToast('success', `Simulating print download for Invoice ${viewingInvoice.id}`)
                }}
                className="btn-black"
                style={{ flex: 1, padding: '10px', fontWeight: '700', borderRadius: '8px', cursor: 'pointer', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <FileSpreadsheet style={{ width: '16px', height: '16px' }} /> Print / Download PDF
              </button>
              <button
                type="button"
                className="btn-outline"
                onClick={() => setViewingInvoice(null)}
                style={{ flex: 1, padding: '10px', fontWeight: '700', borderRadius: '8px', cursor: 'pointer' }}
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Refund Management Processing Modal Overlay */}
      {refundModalInvoice && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(9, 13, 22, 0.45)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 99999,
          padding: '20px'
        }} onClick={() => setRefundModalInvoice(null)}>
          <div className="menu-edit-panel animate-fade-in" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '32px',
            width: '90%',
            maxWidth: '450px',
            boxShadow: 'var(--shadow-lg)',
            position: 'relative',
            top: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: 'var(--text-main)', margin: 0 }}>
                Process Payment Refund
              </h3>
              <button
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}
                onClick={() => setRefundModalInvoice(null)}
              >
                <X style={{ width: '16px', height: '16px' }} />
              </button>
            </div>

            <form onSubmit={handleRefundSubmit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ padding: '14px', background: 'rgba(124, 58, 237, 0.08)', border: '1px solid rgba(124, 58, 237, 0.2)', borderRadius: '8px', fontSize: '0.75rem', color: '#7c3aed', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div><strong>Invoice Reference:</strong> <span style={{ fontFamily: 'monospace', fontWeight: 'bold' }}>{refundModalInvoice.id}</span></div>
                <div><strong>Restaurant Branch:</strong> <span>{refundModalInvoice.restaurantName}</span></div>
                <div><strong>Refund Amount:</strong> <span style={{ fontWeight: 'bold' }}>₹{refundModalInvoice.amount.toLocaleString()}</span></div>
                <div><strong>Original Method:</strong> <span>{refundModalInvoice.paymentMethod}</span></div>
              </div>

              <div className="form-group" style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: '700', color: formErrors.refundReason ? '#ef4444' : 'var(--text-main)' }}>Reason for Refund {formErrors.refundReason && '*'}</label>
                <div style={{ position: 'relative' }}>
                  <textarea
                    value={refundReason}
                    onChange={(e) => {
                      setRefundReason(e.target.value)
                      if (formErrors.refundReason) {
                        setFormErrors({ ...formErrors, refundReason: '' })
                      }
                    }}
                    placeholder="Provide detailed description for processing this refund request (e.g. Overcharged billing tier error)..."
                    required
                    rows="3"
                    style={{ width: '100%', padding: '8px 12px', border: `1px solid ${formErrors.refundReason ? '#ef4444' : 'var(--border-color)'}`, background: formErrors.refundReason ? 'rgba(239, 68, 68, 0.05)' : 'var(--bg-app)', color: 'var(--text-main)', borderRadius: '6px', fontSize: '0.8rem', resize: 'vertical' }}
                  />
                  {formErrors.refundReason && (
                    <div style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#ef4444', pointerEvents: 'none' }}>
                      <AlertTriangle style={{ width: '16px', height: '16px' }} />
                    </div>
                  )}
                </div>
                {formErrors.refundReason && <span style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: '600', marginTop: '2px' }}>{formErrors.refundReason}</span>}
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
                <button type="submit" className="btn-black" style={{ flex: 1, padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#000000', color: '#ffffff', border: 'none' }}>Approve & Refund</button>
                <button type="button" className="btn-outline" onClick={() => setRefundModalInvoice(null)} style={{ flex: 1, padding: '10px 24px', fontWeight: '600', borderRadius: '8px', cursor: 'pointer', background: '#ffffff', color: '#64748b', border: '1px solid #cbd5e1' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirm Action Modal Overlay */}
      {confirmModal && (
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
          onClick={() => setConfirmModal(null)}
        >
          <div
            className="animate-fade-in"
            style={{
              background: '#ffffff',
              borderRadius: '20px',
              padding: '36px 32px 28px',
              width: '90%',
              maxWidth: '440px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.18)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 12px', fontSize: '1.15rem', fontWeight: '800', color: '#0f172a' }}>
              {confirmModal.title}
            </h3>
            <p style={{ margin: '0 0 28px', fontSize: '0.9rem', color: '#64748b', lineHeight: '1.6' }}>
              {confirmModal.message}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setConfirmModal(null)}
                style={{
                  flex: 1,
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#64748b',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'background 0.18s'
                }}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  confirmModal.onConfirm();
                  setConfirmModal(null);
                }}
                style={{
                  flex: 1,
                  padding: '10px 24px',
                  borderRadius: '8px',
                  border: 'none',
                  background: confirmModal.confirmColor || '#ef4444',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'background 0.18s'
                }}
              >
                {confirmModal.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
