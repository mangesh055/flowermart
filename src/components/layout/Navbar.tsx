import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Menu, X, Sparkles, PhoneCall } from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { cn } from '@/lib/utils'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const itemCount = useCartStore((state) => state.getItemCount())
  const settings = useSettingsStore((state) => state.settings)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location.pathname])

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Garland Catalogue', href: '/catalogue' },
    { label: 'Custom Design', href: '/custom-request' },
    { label: 'Contact Us', href: '/contact' },
  ]

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-40 transition-all duration-300',
        isScrolled
          ? 'bg-ivory/95 backdrop-blur-md shadow-md border-b border-cream py-2.5'
          : 'bg-ivory/80 backdrop-blur-sm border-b border-cream/50 py-3.5'
      )}
    >
      <div className="section-container">
        <div className="flex items-center justify-between">
          {/* Logo & Store Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-saffron via-rose to-saffron-400 p-0.5 shadow-md group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-ivory rounded-[14px] flex items-center justify-center">
                <span className="text-2xl">🌸</span>
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-display font-bold text-xl md:text-2xl tracking-tight text-brown leading-tight">
                  {settings.store_name}
                </h1>
                <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-saffron/15 text-saffron border border-saffron/30">
                  Dadar
                </span>
              </div>
              <p className="font-marathi text-xs text-rose font-medium tracking-wide">
                {settings.store_name_marathi || 'संतोष पुष्प भंडार'}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'text-sm font-medium transition-colors hover:text-saffron relative py-1',
                    isActive
                      ? 'text-saffron font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-saffron after:rounded-full'
                      : 'text-brown/85'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right Action Icons (Contact, Cart, Mobile Toggle) */}
          <div className="flex items-center gap-3">
            {/* Quick Call Button (Desktop) */}
            <a
              href={`tel:${settings.contact_number}`}
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 px-3 py-1.5 rounded-full transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-green-600" />
              <span>{settings.contact_number}</span>
            </a>

            {/* Shopping Cart Button */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-white border border-cream hover:border-saffron/40 hover:bg-cream/40 transition-all shadow-sm active:scale-95 group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-brown group-hover:text-saffron transition-colors" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full bg-saffron text-white text-[11px] font-bold flex items-center justify-center shadow-md animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Admin quick entry (subtle) */}
            <Link
              to="/admin"
              className="hidden md:inline-flex items-center justify-center p-2 rounded-xl text-brown/50 hover:text-brown hover:bg-cream/50 transition-colors text-xs"
              title="Admin Portal"
            >
              <Sparkles className="w-4 h-4" />
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 rounded-xl bg-white border border-cream text-brown hover:bg-cream/40 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="lg:hidden mt-3 p-4 bg-white rounded-2xl border border-cream shadow-xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? location.pathname === '/'
                  : location.pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    'block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-saffron text-white font-semibold'
                      : 'text-brown hover:bg-cream/60'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="pt-2 border-t border-cream flex flex-col gap-2">
              <a
                href={`tel:${settings.contact_number}`}
                className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold text-green-700 bg-green-50 border border-green-200"
              >
                <PhoneCall className="w-4 h-4" /> Call {settings.contact_number}
              </a>
              <Link
                to="/admin"
                className="text-center py-2 text-xs text-brown/60 hover:text-brown"
              >
                Store Owner Portal →
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

