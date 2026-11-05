import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom'
import {
  LayoutDashboard,
  Flower2,
  FolderTree,
  ShoppingBag,
  Sparkles,
  Truck,
  BarChart3,
  QrCode,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react'
import { useSettingsStore } from '@/stores/settingsStore'
import { cn } from '@/lib/utils'

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const settings = useSettingsStore((state) => state.settings)

  // Simple auth check: if admin_auth session token exists or user is authenticated
  useEffect(() => {
    const isAuthed = localStorage.getItem('spb_admin_authenticated') === 'true'
    if (!isAuthed && location.pathname !== '/admin/login') {
      navigate('/admin/login')
    }
  }, [location.pathname, navigate])

  const handleLogout = () => {
    localStorage.removeItem('spb_admin_authenticated')
    navigate('/admin/login')
  }

  const navItems = [
    { label: 'Overview Dashboard', href: '/admin', icon: LayoutDashboard },
    { label: 'Order Management', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Product Catalogue', href: '/admin/products', icon: Flower2 },
    { label: 'Categories', href: '/admin/categories', icon: FolderTree },
    { label: 'Custom Design Requests', href: '/admin/custom-requests', icon: Sparkles },
    { label: 'Deliveries & Logistics', href: '/admin/deliveries', icon: Truck },
    { label: 'Sales Reports & CSV', href: '/admin/reports', icon: BarChart3 },
    { label: 'Catalogue QR Generator', href: '/admin/qr-code', icon: QrCode },
    { label: 'Store Settings', href: '/admin/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-ivory/50 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="md:hidden bg-brown text-white p-4 flex items-center justify-between shadow-md sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">🌸</span>
          <div>
            <h1 className="font-display font-bold text-sm leading-tight">
              {settings.store_name}
            </h1>
            <p className="text-[10px] text-saffron font-medium">Owner Dashboard</p>
          </div>
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 rounded-lg bg-brown/80 text-white"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-72 bg-brown text-cream flex flex-col justify-between transition-transform duration-300 md:static md:translate-x-0 border-r border-cream/10 shadow-2xl md:shadow-none',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 space-y-6">
          {/* Logo Brand */}
          <div className="flex items-center gap-3 pb-6 border-b border-cream/10">
            <div className="w-10 h-10 rounded-xl bg-saffron flex items-center justify-center text-xl shadow-sm">
              🌸
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-white leading-tight">
                {settings.store_name}
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-saffron font-semibold">
                <ShieldCheck className="w-3 h-3" />
                <span>Admin Portal</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === '/admin'
                  ? location.pathname === '/admin'
                  : location.pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all',
                    isActive
                      ? 'bg-saffron text-white shadow-md font-semibold'
                      : 'text-cream/80 hover:bg-cream/10 hover:text-white'
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-5 border-t border-cream/10 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between text-xs text-cream/70 hover:text-white px-2 py-1.5 rounded-lg hover:bg-cream/5 transition-colors"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

