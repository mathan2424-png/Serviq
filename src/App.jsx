import React, { useState, useEffect } from 'react'
import {
  QrCode,
  ChefHat,
  Navigation,
  LayoutDashboard,
  Settings,
  ChevronRight,
  Bell,
  Sun,
  Moon,
  UtensilsCrossed,
  Layers,
  Inbox,
  FolderLock,
  Calculator,
  UserCheck,
  Users,
  Maximize2,
  Building,
  CreditCard,
  Activity,
  LogOut,
  Grid
} from 'lucide-react'
import './App.css'

// Import components
import AdminDashboard from './components/AdminDashboard'
import IncomingOrders from './components/IncomingOrders'
import MenuManagement from './components/MenuManagement'
import CustomerApp from './components/CustomerApp'
import KitchenDisplay from './components/KitchenDisplay'
import WaiterApp from './components/WaiterApp'
import BillingSystem from './components/BillingSystem'
import Login from './components/Login'
import StaffMaster from './components/StaffMaster'
import SuperAdminDashboard from './components/SuperAdminDashboard'
import TableManagement from './components/TableManagement'

// Define default menu items matching wireframes
const INITIAL_MENU = [
  {
    id: 1,
    name: 'Paneer Tikka',
    category: 'Starters',
    price: 180,
    description: 'Charcoal grilled cottage cheese cubes marinated in rich Indian spices.',
    available: true,
    image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 2,
    name: 'Chicken Biryani',
    category: 'Mains',
    price: 320,
    description: 'Fragrant basmati rice cooked with tender chicken, herbs, and spices.',
    available: true,
    image: 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 3,
    name: 'Masala Dosa',
    category: 'Mains',
    price: 120,
    description: 'Crispy rice-lentil crepe stuffed with spiced potato mash.',
    available: false, // Matching Masala Dosa "Unavailable" switch in Menu Management wireframe
    image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 4,
    name: 'Dal Makhani',
    category: 'Mains',
    price: 160,
    description: 'Slow-cooked black lentils cooked overnight with butter and fresh cream.',
    available: true,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 5,
    name: 'Gulab Jamun',
    category: 'Desserts',
    price: 80,
    description: 'Deep-fried milk dumplings soaked in cardamom flavored sugar syrup.',
    available: true,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 6,
    name: 'Masala Chai',
    category: 'Drinks',
    price: 40,
    description: 'Traditional Indian tea infused with aromatic spices and ginger.',
    available: true,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 7,
    name: 'Lassi',
    category: 'Drinks',
    price: 60,
    description: 'Creamy yogurt beverage sweetened with sugar and rose water.',
    available: true,
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 8,
    name: 'Veg Thali',
    category: 'Mains',
    price: 250,
    description: 'A complete Indian platter featuring assorted curries, bread, and rice.',
    available: true,
    image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 9,
    name: 'Butter Naan',
    category: 'Mains',
    price: 40,
    description: 'Soft tandoori flatbread brushed generously with butter.',
    available: true,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60'
  },
  {
    id: 10,
    name: 'Filter Coffee',
    category: 'Drinks',
    price: 50,
    description: 'Traditional South Indian frothy chicory blend coffee.',
    available: true,
    image: 'https://images.unsplash.com/photo-1497534446932-c925b458314e?w=500&auto=format&fit=crop&q=60'
  }
]

// Define initial tables matching tables section of the wireframe
const INITIAL_TABLES = [
  { id: 'T-01', name: 'Table 01', status: 'Occupied', seats: 4 },
  { id: 'T-02', name: 'Table 02', status: 'Free', seats: 2 },
  { id: 'T-03', name: 'Table 03', status: 'Occupied', seats: 6 },
  { id: 'T-04', name: 'Table 04', status: 'Cleaning', seats: 4 },
  { id: 'T-05', name: 'Table 05', status: 'Free', seats: 8 },
  { id: 'T-06', name: 'Table 06', status: 'Occupied', seats: 4 },
  { id: 'T-07', name: 'Table 07', status: 'Free', seats: 2 }
]

// Define initial staff terminals
const INITIAL_STAFF = [
  { id: 1, name: 'Chef Rajesh', role: 'kitchen', email: 'chef@serviq.com', position: 'Head Chef', phone: '9876543210', status: 'Active' },
  { id: 2, name: 'Waiter Amit', role: 'waiter', email: 'waiter1@serviq.com', position: 'Lead Waiter', phone: '9876543211', status: 'Active' }
]

// Define initial restaurant admins
const INITIAL_ADMINS = [
  { id: 'ADM-01', name: 'Rajesh Kumar', email: 'rajesh@serviq.com', phone: '+91 98765 43210', restaurantName: 'Serviq Grand Bistro', role: 'Branch Admin', status: 'Active', lastLogin: '2026-06-02 12:45 PM' },
  { id: 'ADM-02', name: 'Amit Patel', email: 'amit@serviq.com', phone: '+91 98765 11111', restaurantName: 'Serviq Express Cafe', role: 'Branch Manager', status: 'Active', lastLogin: '2026-06-02 11:30 AM' },
  { id: 'ADM-03', name: 'Vikram Singh', email: 'vikram@serviq.com', phone: '+91 98765 22222', restaurantName: 'Serviq Lounge & Bar', role: 'Branch Admin', status: 'Disabled', lastLogin: '2026-05-30 09:15 PM' }
]

// Define initial restaurant details for superadmin configurations (5+ restaurants)
const INITIAL_RESTAURANTS = [
  {
    id: 'R-01',
    name: 'Serviq Grand Bistro',
    legalName: 'Serviq Hospitality Pvt. Ltd.',
    ownerName: 'Rajesh Kumar',
    mobileNumber: '+91 98765 43210',
    phone: '+91 98765 43210',
    email: 'contact@serviqbistro.com',
    website: 'https://serviqbistro.com',
    address: '12, Khader Nawaz Khan Road, Nungambakkam',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    license: 'FSSAI-12345678901234',
    gstin: '33AAAAA1111A1Z1',
    currency: 'INR',
    taxRate: 5, // 5% GST
    serviceCharge: 5, // 5% Service Charge
    openingTime: '11:00 AM',
    closingTime: '11:00 PM',
    status: 'Active', // 'Active', 'Suspended', 'Inactive'
    subscriptionPlan: 'Enterprise',
    createdDate: '2025-01-15',
    logo: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=120&auto=format&fit=crop&q=60',
    banner: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&auto=format&fit=crop&q=60'
  },
  {
    id: 'R-02',
    name: 'Serviq Express Cafe',
    legalName: 'Serviq QSR Pvt. Ltd.',
    ownerName: 'Amit Patel',
    mobileNumber: '+91 98765 11111',
    phone: '+91 98765 11111',
    email: 'contact@serviqcafe.com',
    website: 'https://serviqcafe.com',
    address: '45, Usman Road, T-Nagar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    license: 'FSSAI-56789012345678',
    gstin: '33BBBBB2222B2Z2',
    currency: 'INR',
    taxRate: 5,
    serviceCharge: 0,
    openingTime: '08:00 AM',
    closingTime: '10:00 PM',
    status: 'Active',
    subscriptionPlan: 'Premium',
    createdDate: '2025-03-22',
    logo: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=120&auto=format&fit=crop&q=60',
    banner: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=1000&auto=format&fit=crop&q=60'
  },
  {
    id: 'R-03',
    name: 'Serviq Lounge & Bar',
    legalName: 'Serviq Entertainment India',
    ownerName: 'Vikram Singh',
    mobileNumber: '+91 98765 22222',
    phone: '+91 98765 22222',
    email: 'contact@serviqlounge.com',
    website: 'https://serviqlounge.com',
    address: '78, Rajiv Gandhi Salai, OMR',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    license: 'FSSAI-90123456789012',
    gstin: '33CCCCC3333C3Z3',
    currency: 'INR',
    taxRate: 18,
    serviceCharge: 7.5,
    openingTime: '04:00 PM',
    closingTime: '12:00 AM',
    status: 'Active',
    subscriptionPlan: 'Enterprise',
    createdDate: '2025-06-10',
    logo: 'https://images.unsplash.com/photo-1574096079513-d8259312b785?w=120&auto=format&fit=crop&q=60',
    banner: 'https://images.unsplash.com/photo-1485686531765-ba63b07845a7?w=1000&auto=format&fit=crop&q=60'
  },
  {
    id: 'R-04',
    name: 'Serviq Traditional',
    legalName: 'Serviq South Indian Foods',
    ownerName: 'Deepa Venkat',
    mobileNumber: '+91 98765 33333',
    phone: '+91 98765 33333',
    email: 'contact@serviqsouth.com',
    website: 'https://serviqsouth.com',
    address: '9, East Mada Street, Mylapore',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    license: 'FSSAI-23456789012345',
    gstin: '33DDDDD4444D4Z4',
    currency: 'INR',
    taxRate: 5,
    serviceCharge: 2.5,
    openingTime: '06:00 AM',
    closingTime: '09:00 PM',
    status: 'Active',
    subscriptionPlan: 'Standard',
    createdDate: '2025-09-05',
    logo: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=120&auto=format&fit=crop&q=60',
    banner: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=1000&auto=format&fit=crop&q=60'
  },
  {
    id: 'R-05',
    name: 'Serviq Bakery & Sweets',
    legalName: 'Serviq Patisseries Ltd.',
    ownerName: 'Siddharth Rao',
    mobileNumber: '+91 98765 44444',
    phone: '+91 98765 44444',
    email: 'contact@serviqbakery.com',
    website: 'https://serviqbakery.com',
    address: '23, Sardar Patel Road, Adyar',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    license: 'FSSAI-34567890123456',
    gstin: '33EEEEE5555E5Z5',
    currency: 'INR',
    taxRate: 12,
    serviceCharge: 0,
    openingTime: '09:00 AM',
    closingTime: '09:30 PM',
    status: 'Active',
    subscriptionPlan: 'Standard',
    createdDate: '2025-11-18',
    logo: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=120&auto=format&fit=crop&q=60',
    banner: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&auto=format&fit=crop&q=60'
  }
]

// Define initial active orders matching dashboard live order feed and the user-provided screenshot
const INITIAL_ORDERS = [
  {
    id: '#ORD-042',
    table: 'T-01',
    waiter: 'Ravi M.',
    items: [
      { name: 'Paneer Tikka', quantity: 2, price: 140 },
      { name: 'Dal Makhani', quantity: 1, price: 160 }
    ],
    time: '12:34',
    timestamp: new Date(Date.now() - 600000),
    status: 'Preparing',
    payment: 'Pending',
    note: ''
  },
  {
    id: '#ORD-043',
    table: 'T-03',
    waiter: 'Rahul S.',
    items: [
      { name: 'Butter Chicken', quantity: 2, price: 260 },
      { name: 'Gulab Jamun', quantity: 1, price: 80 }
    ],
    time: '12:21',
    timestamp: new Date(Date.now() - 1200000),
    status: 'Ready',
    payment: 'Pending',
    note: ''
  },
  {
    id: '#ORD-044',
    table: 'T-06',
    waiter: 'Arjun K.',
    items: [
      { name: 'Chicken 65', quantity: 1, price: 180 },
      { name: 'Masala Chai', quantity: 2, price: 40 }
    ],
    time: '12:10',
    timestamp: new Date(Date.now() - 1800000),
    status: 'Delivered',
    payment: 'Paid',
    note: ''
  },
  {
    id: '#ORD-045',
    table: 'T-08',
    waiter: 'Ravi M.',
    items: [
      { name: 'Fish Curry', quantity: 2, price: 250 },
      { name: 'Mango Lassi', quantity: 2, price: 60 }
    ],
    time: '12:40',
    timestamp: new Date(Date.now() - 300000),
    status: 'Pending',
    payment: 'Pending',
    note: ''
  },
  {
    id: '#ORD-040',
    table: 'T-02',
    waiter: 'Rahul S.',
    items: [
      { name: 'Paneer Tikka', quantity: 1, price: 140 },
      { name: 'Masala Chai', quantity: 1, price: 40 }
    ],
    time: '11:55',
    timestamp: new Date(Date.now() - 3600000),
    status: 'Paid',
    payment: 'Paid',
    note: ''
  }
]

export default function App() {
  // Simulator states
  const [role, setRole] = useState('login') // 'login', 'admin', 'customer', 'kitchen', 'waiter', 'billing'
  const [adminTab, setAdminTab] = useState('dashboard') // 'dashboard', 'incoming-orders', 'menu-management', 'billing', 'tables', 'settings'
  const [darkMode, setDarkMode] = useState(false)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)
  const [notifications, setNotifications] = useState([
    'New Order #847 placed on Table 03',
    'Special Request: allergy notes on Table 01 order',
    'Table 05 order marked ready by Kitchen'
  ])
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false)
  const [billingSelectedTableId, setBillingSelectedTableId] = useState(null)


  // Custom interactive notifications and alert modals
  const [toasts, setToasts] = useState([])
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    title: '',
    message: '',
    onConfirm: null
  })

  const showToast = (type, message) => {
    const id = Date.now()
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 4000)
  }

  const showConfirm = (title, message, onConfirm) => {
    setConfirmModal({
      open: true,
      title,
      message,
      onConfirm: () => {
        onConfirm()
        setConfirmModal(prev => ({ ...prev, open: false }))
      }
    })
  }

  // Shared application states
  const [menuItems, setMenuItems] = useState(INITIAL_MENU)
  const [tables, setTables] = useState(INITIAL_TABLES)
  const [orders, setOrders] = useState(INITIAL_ORDERS)
  const [staffMembers, setStaffMembers] = useState(INITIAL_STAFF)
  const [restaurants, setRestaurants] = useState(INITIAL_RESTAURANTS)
  const [activeRestaurantId, setActiveRestaurantId] = useState('R-01')
  const [restaurantAdmins, setRestaurantAdmins] = useState(INITIAL_ADMINS)

  // Dynamic Lookup of active restaurant details
  const restaurantDetails = restaurants.find(r => r.id === activeRestaurantId) || restaurants[0]

  const handleUpdateRestaurantDetails = (updatedDetails) => {
    setRestaurants(restaurants.map(r => r.id === updatedDetails.id ? updatedDetails : r))
  }

  // Customer Specific session states
  const [customerTable, setCustomerTable] = useState(null)
  const [activeCustomerOrder, setActiveCustomerOrder] = useState(null)

  // System Stats states matching wireframe metrics
  const [stats, setStats] = useState({
    revenue: 12480, // Today's Revenue (₹12,480 in screenshot)
    totalOrdersCount: 38 // Total Orders (38 in screenshot)
  })

  // Handle URL Table parameters dynamically (QR code scan simulation)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const tableParam = params.get('table')
    if (tableParam) {
      const matchingTable = tables.find(t => 
        t.id.toLowerCase() === tableParam.toLowerCase() || 
        t.name.toLowerCase() === tableParam.toLowerCase()
      )
      if (matchingTable) {
        setRole('customer')
        setCustomerTable(matchingTable.name)
        showToast('success', `Welcome to ${matchingTable.name}! Direct ordering enabled.`)
      } else {
        showToast('error', `Table ${tableParam} not found in registry.`)
      }
    }
  }, [tables])

  // Synchronize customer active order tracking dynamically based on selected table session
  useEffect(() => {
    if (customerTable) {
      // Find the most recent active order for this table that hasn't been completed/billed yet
      const activeOrder = orders.find(o => o.table === customerTable && o.status !== 'Billed' && o.status !== 'Done')
      if (activeOrder) {
        if (!activeCustomerOrder || activeCustomerOrder.id !== activeOrder.id || activeCustomerOrder.status !== activeOrder.status) {
          setActiveCustomerOrder(activeOrder)
        }
      } else {
        if (activeCustomerOrder) {
          setActiveCustomerOrder(null)
        }
      }
    } else {
      if (activeCustomerOrder) {
        setActiveCustomerOrder(null)
      }
    }
  }, [orders, customerTable, activeCustomerOrder])

  // Automatically compute statistical values
  const getComputedStats = () => {
    const pendingCount = orders.filter(o => o.status !== 'Done' && o.status !== 'Billed').length
    return {
      revenue: stats.revenue,
      totalOrdersCount: stats.totalOrdersCount,
      pendingOrdersCount: pendingCount
    }
  }

  // Handle dark mode toggle
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.body.classList.toggle('dark-mode')
  }

  // EVENT HANDLERS

  // 1. Placing a customer order
  const handlePlaceOrder = (cartItems, note) => {
    const nextOrderNum = orders.length > 0
      ? Math.max(...orders.map(o => {
          const cleanId = o.id.replace('#ORD-', '').replace('#', '')
          const parsed = parseInt(cleanId)
          return isNaN(parsed) ? 0 : parsed
        })) + 1
      : 46

    const formattedId = `#ORD-${nextOrderNum < 10 ? '00' + nextOrderNum : nextOrderNum < 100 ? '0' + nextOrderNum : nextOrderNum}`
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })

    const newOrder = {
      id: formattedId,
      table: customerTable,
      waiter: 'Self Order',
      items: cartItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      time: timeStr,
      timestamp: new Date(),
      status: 'Pending',
      payment: 'Pending',
      note: note
    }

    // Update state
    setOrders([newOrder, ...orders])
    setTables(tables.map(t => t.name === customerTable ? { ...t, status: 'Occupied' } : t))
    setStats(prev => ({
      ...prev,
      totalOrdersCount: prev.totalOrdersCount + 1
    }))
    setActiveCustomerOrder(newOrder)

    // Add system notification
    const alertMsg = `New order ${formattedId} received from ${customerTable}`
    setNotifications([alertMsg, ...notifications])
  }

  // 2. Updating order status (Admin accept / Kitchen prepare / Waiter delivery)
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))

    // Send notifications for key status changes
    if (newStatus === 'Preparing') {
      const order = orders.find(o => o.id === orderId)
      setNotifications([`${orderId} is now being prepared for ${order.table}`, ...notifications])
    } else if (newStatus === 'Ready') {
      const order = orders.find(o => o.id === orderId)
      setNotifications([`${orderId} is READY for delivery to ${order.table}`, ...notifications])
    } else if (newStatus === 'Done' || newStatus === 'Delivered') {
      const order = orders.find(o => o.id === orderId)
      setNotifications([`Order ${orderId} delivered to ${order.table}`, ...notifications])
    }
  }

  // Delete an order
  const handleDeleteOrder = (orderId) => {
    setOrders(orders.filter(o => o.id !== orderId))
    showToast('success', `Order ${orderId} deleted successfully!`)
  }

  // Update/Edit an order fully
  const handleUpdateOrder = (updatedOrder) => {
    setOrders(orders.map(o => o.id === updatedOrder.id ? updatedOrder : o))
    showToast('success', `Order ${updatedOrder.id} updated successfully!`)
  }

  // 3. Billing & checkout for a table
  const handleCheckoutTable = (tableId, billAmount, tableOrderIds) => {
    // Free the table
    setTables(tables.map(t => t.id === tableId ? { ...t, status: 'Free' } : t))

    // Add amount to revenue
    setStats(prev => ({
      ...prev,
      revenue: prev.revenue + billAmount
    }))

    // Clear order associations (set status of these orders to 'Billed' so they leave KDS/Waiter lists)
    setOrders(orders.map(o => tableOrderIds.includes(o.id) ? { ...o, status: 'Billed' } : o))

    // Clear customer sessions matching that table
    const checkTable = tables.find(t => t.id === tableId)
    if (customerTable === checkTable?.name) {
      setCustomerTable(null)
      setActiveCustomerOrder(null)
    }

    setNotifications([`Table ${tableId} completed billing and is now FREE`, ...notifications])
  }

  // Table CRUD operations
  const handleAddTable = (newTable) => {
    setTables([...tables, newTable])
  }

  const handleUpdateTable = (id, updatedTable) => {
    setTables(tables.map(t => t.id === id ? updatedTable : t))
  }

  const handleDeleteTable = (id) => {
    showConfirm(
      'Delete Table Profile',
      'Are you sure you want to permanently delete this table profile registry? This action cannot be undone.',
      () => {
        setTables(tables.filter(t => t.id !== id))
        showToast('success', 'Table profile registry deleted successfully!')
      }
    )
  }

  // 4. Menu CRUD operations
  const handleUpdateMenuItem = (id, updatedItem) => {
    setMenuItems(menuItems.map(item => item.id === id ? updatedItem : item))
  }

  const handleDeleteMenuItem = (id) => {
    showConfirm(
      'Delete Menu Item',
      'Are you sure you want to permanently delete this menu item from the SimStudio registry? This action cannot be undone.',
      () => {
        setMenuItems(menuItems.filter(item => item.id !== id))
        showToast('success', 'Menu item deleted successfully!')
      }
    )
  }

  const handleAddMenuItem = (newItem) => {
    const nextId = menuItems.length > 0 ? Math.max(...menuItems.map(i => i.id)) + 1 : 1
    const itemToAdd = { ...newItem, id: nextId }
    setMenuItems([...menuItems, itemToAdd])
  }

  // 5. Staff CRUD operations
  const handleUpdateStaffMember = (id, updatedStaff) => {
    setStaffMembers(staffMembers.map(s => s.id === id ? updatedStaff : s))
  }

  const handleDeleteStaffMember = (id) => {
    showConfirm(
      'Delete Staff Profile',
      'Are you sure you want to permanently delete this staff member terminal registration? This action cannot be undone.',
      () => {
        setStaffMembers(staffMembers.filter(s => s.id !== id))
        showToast('success', 'Staff terminal registration deleted successfully!')
      }
    )
  }

  const handleAddStaffMember = (newStaff) => {
    const nextId = staffMembers.length > 0 ? Math.max(...staffMembers.map(s => s.id)) + 1 : 1
    const staffToAdd = { ...newStaff, id: nextId }
    setStaffMembers([...staffMembers, staffToAdd])
  }

  // Helper: Format system date and time
  const getSystemDateTime = () => {
    return '' // Removed per user request
  }

  const getTabSubtext = () => {
    switch (adminTab) {
      case 'dashboard': return getSystemDateTime();
      case 'menu-management': return 'Add, edit, and manage your menu items';
      case 'billing': return 'Process payments and generate invoices';
      case 'tables': return 'Monitor and manage restaurant table status';
      case 'staff-master': return 'Manage KDS and Waiter terminals and logins';
      case 'settings': return 'Configure your restaurant dashboard';
      case 'super-plans': return 'Create and configure subscription packages, limits, pricing, and branch models';
      default: return getSystemDateTime();
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: role === 'login' ? 'auto' : '100vh', minHeight: '100vh', overflow: role === 'login' ? 'visible' : 'hidden' }}>

      {role === 'login' ? (
        <Login
          onLogin={(selectedRole) => {
            if (selectedRole === 'billing') {
              setRole('admin')
              setAdminTab('billing')
              setIsSuperAdmin(false)
            } else if (selectedRole === 'superadmin') {
              setRole('admin')
              setAdminTab('super-revenue')
              setIsSuperAdmin(true)
            } else {
              setRole(selectedRole)
              setIsSuperAdmin(false)
              if (selectedRole === 'customer') {
                setCustomerTable('Table 04') // Seed default table
              } else if (selectedRole === 'admin') {
                setAdminTab('dashboard')
              }
            }
          }}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          showToast={showToast}
        />
      ) : (
        <>
          {/* SIMULATOR ROLE CONTROLLER BAR */}
          <div className="simulator-bar">
            <div className="simulator-title">
              <UtensilsCrossed style={{ color: 'var(--primary)' }} />
              <span>QRMenu</span>
            </div>



            {/* Theme and tools */}
            <div className="simulator-actions" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                className="theme-toggle-btn"
                onClick={() => {
                  setRole('login')
                  setCustomerTable(null)
                  setActiveCustomerOrder(null)
                  setIsSuperAdmin(false)
                  setAdminTab('dashboard')
                }}
                title={role === 'customer' ? "Exit Guest Mode" : "Log Out"}
                style={{
                  background: role === 'customer' ? 'rgba(239, 68, 68, 0.12)' : 'rgba(239, 68, 68, 0.1)',
                  color: '#ef4444',
                  border: '1px solid rgba(239, 68, 68, 0.2)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: role === 'customer' ? '6px 14px' : '8px 12px',
                  borderRadius: '20px',
                  fontWeight: '700',
                  fontSize: '0.8rem',
                  gap: '6px'
                }}
              >
                {role === 'customer' ? '🚪 Exit Guest Mode' : (
                  <>
                    <LogOut style={{ width: '16px', height: '16px' }} />
                    <span>Log Out</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* CORE SIMULATED INTERFACE CONTAINER */}
          <div className="app-container" style={{ height: 'auto', flex: 1 }}>

            {/* ROLE: ADMIN (WITH SIDEBAR & TAB CONTENT) */}
            {role === 'admin' && (
              <>
                {/* Sidebar */}
                <div className="sidebar">
                  <div>
                    <div className="sidebar-header">
                      <div className="sidebar-logo-icon">🍽️</div>
                      <div className="sidebar-logo-text">
                        <h3>QRMenu</h3>
                        <span>Standard Plan</span>
                      </div>
                    </div>

                    <ul className="sidebar-nav">
                      {!isSuperAdmin && (
                        <>
                          <li
                            className={`sidebar-item ${adminTab === 'dashboard' ? 'active' : ''}`}
                            onClick={() => setAdminTab('dashboard')}
                          >
                            <LayoutDashboard /> Dashboard
                          </li>
                          <li
                            className={`sidebar-item ${adminTab === 'incoming-orders' ? 'active' : ''}`}
                            onClick={() => setAdminTab('incoming-orders')}
                          >
                            <Inbox /> Incoming Orders
                          </li>
                          <li
                            className={`sidebar-item ${adminTab === 'menu-management' ? 'active' : ''}`}
                            onClick={() => setAdminTab('menu-management')}
                          >
                            <UtensilsCrossed /> Menu Management
                          </li>
                          <li
                            className={`sidebar-item ${adminTab === 'billing' ? 'active' : ''}`}
                            onClick={() => setAdminTab('billing')}
                          >
                            <Calculator /> Billing
                          </li>
                          <li
                            className={`sidebar-item ${adminTab === 'tables' ? 'active' : ''}`}
                            onClick={() => setAdminTab('tables')}
                          >
                            <Grid style={{ width: '18px', height: '18px' }} /> Table Management
                          </li>
                          <li
                            className={`sidebar-item ${adminTab === 'staff-master' ? 'active' : ''}`}
                            onClick={() => setAdminTab('staff-master')}
                          >
                            <Users /> Staff
                          </li>
                        </>
                      )}

                      {/* Super Admin ONLY Unified Menus */}
                      {isSuperAdmin && (
                        <>
                          <li style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '8px 0', listStyleType: 'none' }}></li>
                          <span style={{ fontSize: '0.65rem', fontWeight: '800', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', display: 'block', paddingLeft: '16px', marginBottom: '6px', letterSpacing: '0.5px' }}>Super Deck</span>
                          <li
                             className={`sidebar-item ${adminTab === 'super-revenue' ? 'active' : ''}`}
                             onClick={() => setAdminTab('super-revenue')}
                           >
                             <LayoutDashboard style={{ width: '18px', height: '18px' }} /> Dashboard
                           </li>
                           <li
                             className={`sidebar-item ${adminTab === 'super-details' ? 'active' : ''}`}
                             onClick={() => setAdminTab('super-details')}
                           >
                            <Building style={{ width: '18px', height: '18px' }} /> Restaurants
                           </li>
                           <li
                             className={`sidebar-item ${adminTab === 'super-admins' ? 'active' : ''}`}
                             onClick={() => setAdminTab('super-admins')}
                           >
                             <Users style={{ width: '18px', height: '18px' }} /> Admins
                           </li>
                           <li
                             className={`sidebar-item ${adminTab === 'super-plans' ? 'active' : ''}`}
                             onClick={() => setAdminTab('super-plans')}
                           >
                             <Layers style={{ width: '18px', height: '18px' }} /> Subscription & Plans
                           </li>
                           <li
                             className={`sidebar-item ${adminTab === 'super-billing' ? 'active' : ''}`}
                             onClick={() => setAdminTab('super-billing')}
                           >
                             <CreditCard style={{ width: '18px', height: '18px' }} /> Revenue & Billing
                           </li>
                        </>
                      )}

                      <li
                        className={`sidebar-item ${adminTab === 'settings' ? 'active' : ''}`}
                        onClick={() => setAdminTab('settings')}
                      >
                        <Settings /> Settings
                      </li>
                    </ul>
                  </div>

                  <div className="sidebar-footer">
                    <p>{restaurantDetails.name}</p>
                    <span>admin@email.com</span>
                  </div>
                </div>

                {/* Workspace Area */}
                <div className="workspace">
                  {/* Workspace Header */}
                  <div className="workspace-header">
                    <div className="header-title">
                      <h1 style={{ textTransform: 'capitalize' }}>
                        {adminTab === 'super-revenue' ? 'Dashboard' :
                         adminTab === 'super-details' ? 'Restaurant Management' : 
                         adminTab === 'super-plans' ? 'Subscription & Plans' : 
                         adminTab === 'super-billing' ? 'Revenue & Billing' :
                         adminTab.replace('-', ' ').replace('super ', '')}
                      </h1>
                      {getTabSubtext() && <p>{getTabSubtext()}</p>}
                    </div>

                    <div className="header-actions">
                      <button className="header-btn" onClick={() => showToast('info', 'Profile settings are managed through Settings tab.')}>
                        <UserCheck style={{ width: '16px', height: '16px' }} />
                        Admin Profile
                      </button>
                    </div>
                  </div>

                  {/* RENDER CHOSEN TAB */}
                  {adminTab === 'dashboard' && (
                    <AdminDashboard
                      orders={orders}
                      tables={tables}
                      stats={getComputedStats()}
                      onNavigate={setAdminTab}
                      showToast={showToast}
                    />
                  )}

                  {adminTab === 'incoming-orders' && (
                    <IncomingOrders
                      orders={orders}
                      onUpdateStatus={handleUpdateOrderStatus}
                      onDeleteOrder={handleDeleteOrder}
                      onUpdateOrder={handleUpdateOrder}
                      showToast={showToast}
                    />
                  )}

                  {adminTab === 'menu-management' && (
                    <MenuManagement
                      menuItems={menuItems}
                      onUpdateMenuItem={handleUpdateMenuItem}
                      onDeleteMenuItem={handleDeleteMenuItem}
                      onAddMenuItem={handleAddMenuItem}
                      showToast={showToast}
                    />
                  )}

                  {adminTab === 'billing' && (
                    <BillingSystem
                      orders={orders}
                      tables={tables}
                      onCheckoutTable={handleCheckoutTable}
                      showToast={showToast}
                      initialTableId={billingSelectedTableId}
                      onClearInitialTableId={() => setBillingSelectedTableId(null)}
                    />
                  )}

                  {adminTab === 'tables' && (
                    <TableManagement
                      tables={tables}
                      orders={orders}
                      onAddTable={handleAddTable}
                      onUpdateTable={handleUpdateTable}
                      onDeleteTable={handleDeleteTable}
                      showToast={showToast}
                    />
                  )}

                  {adminTab === 'staff-master' && (
                    <StaffMaster
                      staffMembers={staffMembers}
                      onUpdateStaffMember={handleUpdateStaffMember}
                      onDeleteStaffMember={handleDeleteStaffMember}
                      onAddStaffMember={handleAddStaffMember}
                      showToast={showToast}
                    />
                  )}

                  {adminTab === 'super-details' && (
                    <SuperAdminDashboard
                      restaurants={restaurants}
                      activeRestaurantId={activeRestaurantId}
                      onSetActiveRestaurantId={setActiveRestaurantId}
                      onUpdateRestaurants={setRestaurants}
                      restaurantDetails={restaurantDetails}
                      onUpdateRestaurantDetails={handleUpdateRestaurantDetails}
                      orders={orders}
                      tables={tables}
                      menuItems={menuItems}
                      staffMembers={staffMembers}
                      stats={getComputedStats()}
                      showToast={showToast}
                      onUpdateTables={setTables}
                      onUpdateOrders={setOrders}
                      activeTab="details"
                      isMerged={true}
                      restaurantAdmins={restaurantAdmins}
                      onUpdateRestaurantAdmins={setRestaurantAdmins}
                    />
                  )}

                  {adminTab === 'super-revenue' && (
                    <SuperAdminDashboard
                      restaurants={restaurants}
                      activeRestaurantId={activeRestaurantId}
                      onSetActiveRestaurantId={setActiveRestaurantId}
                      onUpdateRestaurants={setRestaurants}
                      restaurantDetails={restaurantDetails}
                      onUpdateRestaurantDetails={handleUpdateRestaurantDetails}
                      orders={orders}
                      tables={tables}
                      menuItems={menuItems}
                      staffMembers={staffMembers}
                      stats={getComputedStats()}
                      showToast={showToast}
                      onUpdateTables={setTables}
                      onUpdateOrders={setOrders}
                      activeTab="revenue"
                      isMerged={true}
                      restaurantAdmins={restaurantAdmins}
                      onUpdateRestaurantAdmins={setRestaurantAdmins}
                    />
                  )}

                  {adminTab === 'super-billing' && (
                    <SuperAdminDashboard
                      restaurants={restaurants}
                      activeRestaurantId={activeRestaurantId}
                      onSetActiveRestaurantId={setActiveRestaurantId}
                      onUpdateRestaurants={setRestaurants}
                      restaurantDetails={restaurantDetails}
                      onUpdateRestaurantDetails={handleUpdateRestaurantDetails}
                      orders={orders}
                      tables={tables}
                      menuItems={menuItems}
                      staffMembers={staffMembers}
                      stats={getComputedStats()}
                      showToast={showToast}
                      onUpdateTables={setTables}
                      onUpdateOrders={setOrders}
                      activeTab="billing"
                      isMerged={true}
                      restaurantAdmins={restaurantAdmins}
                      onUpdateRestaurantAdmins={setRestaurantAdmins}
                    />
                  )}

                  {adminTab === 'super-admins' && (
                    <SuperAdminDashboard
                      restaurants={restaurants}
                      activeRestaurantId={activeRestaurantId}
                      onSetActiveRestaurantId={setActiveRestaurantId}
                      onUpdateRestaurants={setRestaurants}
                      restaurantDetails={restaurantDetails}
                      onUpdateRestaurantDetails={handleUpdateRestaurantDetails}
                      orders={orders}
                      tables={tables}
                      menuItems={menuItems}
                      staffMembers={staffMembers}
                      stats={getComputedStats()}
                      showToast={showToast}
                      onUpdateTables={setTables}
                      onUpdateOrders={setOrders}
                      activeTab="admins"
                      isMerged={true}
                      restaurantAdmins={restaurantAdmins}
                      onUpdateRestaurantAdmins={setRestaurantAdmins}
                    />
                  )}


                  {adminTab === 'super-plans' && (
                    <SuperAdminDashboard
                      restaurants={restaurants}
                      activeRestaurantId={activeRestaurantId}
                      onSetActiveRestaurantId={setActiveRestaurantId}
                      onUpdateRestaurants={setRestaurants}
                      restaurantDetails={restaurantDetails}
                      onUpdateRestaurantDetails={handleUpdateRestaurantDetails}
                      orders={orders}
                      tables={tables}
                      menuItems={menuItems}
                      staffMembers={staffMembers}
                      stats={getComputedStats()}
                      showToast={showToast}
                      onUpdateTables={setTables}
                      onUpdateOrders={setOrders}
                      activeTab="plans"
                      isMerged={true}
                      restaurantAdmins={restaurantAdmins}
                      onUpdateRestaurantAdmins={setRestaurantAdmins}
                    />
                  )}



                  {adminTab === 'settings' && (
                    <div style={{ padding: '24px 30px', width: '100%', boxSizing: 'border-box' }} className="animate-fade-in">
                      <h3 style={{ marginBottom: '20px' }}>Dashboard Configuration</h3>

                      <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h4 style={{ fontSize: '0.95rem' }}>Automated Service Charge</h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Apply default 5% service charge to generated invoices.</p>
                          </div>
                          <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#000' }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                          <div>
                            <h4 style={{ fontSize: '0.95rem' }}>Auto-print Receipts</h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Send incoming orders to billing printer automatically.</p>
                          </div>
                          <input type="checkbox" style={{ width: '18px', height: '18px', accentColor: '#000' }} />
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                          <div>
                            <h4 style={{ fontSize: '0.95rem' }}>UPI Dynamic QR Code</h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Generate transaction-specific QR code for tables on UPI checkout.</p>
                          </div>
                          <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', accentColor: '#000' }} />
                        </div>

                        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                          <label style={{ fontSize: '0.8rem', fontWeight: '600', display: 'block', marginBottom: '6px' }}>Selected Currency Symbol</label>
                          <select style={{ padding: '8px', borderRadius: '4px', border: '1px solid var(--border-color)', width: '100px' }}>
                            <option value="INR">₹ (INR)</option>
                            <option value="USD">$ (USD)</option>
                            <option value="EUR">€ (EUR)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </>
            )}

            {/* ROLE: CUSTOMER APP */}
            {role === 'customer' && (
              <CustomerApp
                menuItems={menuItems}
                activeTable={customerTable}
                onSetActiveTable={setCustomerTable}
                onPlaceOrder={handlePlaceOrder}
                activeCustomerOrder={activeCustomerOrder}
              />
            )}

            {/* ROLE: KITCHEN DISPLAY */}
            {role === 'kitchen' && (
              <KitchenDisplay
                orders={orders}
                onUpdateStatus={handleUpdateOrderStatus}
              />
            )}

            {/* ROLE: WAITER APP */}
            {role === 'waiter' && (
              <WaiterApp
                orders={orders}
                onUpdateStatus={handleUpdateOrderStatus}
              />
            )}

          </div>



          {/* Custom JQuery-style Toast notifications list */}
          <div style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            zIndex: 99999,
            pointerEvents: 'none'
          }}>
            {toasts.map(toast => (
              <div
                key={toast.id}
                className="animate-fade-in"
                style={{
                  pointerEvents: 'auto',
                  background: toast.type === 'success' ? '#10b981' : toast.type === 'error' ? '#ef4444' : '#3b82f6',
                  color: '#fff',
                  padding: '12px 20px',
                  borderRadius: '10px',
                  boxShadow: 'var(--shadow-lg)',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  minWidth: '240px',
                  animation: 'slideInRight 0.3s ease forwards'
                }}
              >
                <span>{toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}</span>
                <span>{toast.message}</span>
              </div>
            ))}
          </div>

          {/* Custom Interactive Confirm Modal overlay */}
          {confirmModal.open && (
            <div style={{
              position: 'fixed',
              top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(15, 23, 42, 0.6)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 99998,
              backdropFilter: 'blur(6px)'
            }}>
              <div className="glass-card animate-fade-in" style={{
                background: 'var(--bg-card)',
                padding: '24px',
                maxWidth: '400px',
                width: '90%',
                borderRadius: '16px',
                boxShadow: 'var(--shadow-premium)',
                border: '1px solid var(--border-color)',
                textAlign: 'center'
              }}>
                <h4 style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--text-main)', margin: '0 0 10px 0' }}>
                  {confirmModal.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.4' }}>
                  {confirmModal.message}
                </p>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    className="btn-outline"
                    style={{ flex: 1, padding: '10px' }}
                    onClick={() => setConfirmModal(prev => ({ ...prev, open: false }))}
                  >
                    Cancel
                  </button>
                  <button
                    className="welcome-btn"
                    style={{ flex: 1, padding: '10px', background: '#dc2626', color: '#fff' }}
                    onClick={confirmModal.onConfirm}
                  >
                    Confirm Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
