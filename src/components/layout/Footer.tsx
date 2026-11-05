import { Link } from 'react-router-dom'
import { MapPin, Phone, Clock, MessageSquare, Heart, Sparkles } from 'lucide-react'
import { useSettingsStore } from '@/stores/settingsStore'
import { buildWhatsAppLink } from '@/lib/utils'

export function Footer() {
  const settings = useSettingsStore((state) => state.settings)
  const currentYear = new Date().getFullYear()

  const categories = [
    { label: 'Traditional Garlands', href: '/category/traditional-garlands' },
    { label: 'Wedding Varmala', href: '/category/wedding-varmala' },
    { label: 'Rose Garlands', href: '/category/rose-garlands' },
    { label: 'Fresh Mogra (Jasmine)', href: '/category/jasmine-garlands' },
    { label: 'Pooja Garlands', href: '/category/pooja-garlands' },
    { label: 'Mandap Decoration', href: '/category/mandap-decoration' },
  ]

  const quickLinks = [
    { label: 'Home Catalogue', href: '/catalogue' },
    { label: 'Custom Garland Design', href: '/custom-request' },
    { label: 'Cart & WhatsApp Checkout', href: '/cart' },
    { label: 'Contact & Shop Location', href: '/contact' },
    { label: 'Admin Login', href: '/admin/login' },
  ]

  return (
    <footer className="bg-brown text-cream border-t-4 border-saffron mt-20">
      <div className="section-container pt-16 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-saffron flex items-center justify-center text-2xl shadow-sm">
                🌸
              </div>
              <div>
                <h3 className="font-display font-bold text-xl text-white">
                  {settings.store_name}
                </h3>
                <p className="font-marathi text-xs text-saffron-300">
                  {settings.store_name_marathi || 'संतोष पुष्प भंडार'}
                </p>
              </div>
            </div>
            <p className="text-sm text-cream/80 leading-relaxed">
              Traditional and luxury fresh flower garlands woven with reverence, fragrance, and artistry for weddings, religious ceremonies, and auspicious celebrations.
            </p>
            <div className="pt-2">
              <a
                href={buildWhatsAppLink(settings.whatsapp_number, 'Hello, I would like to order fresh garlands.')}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-semibold shadow transition-all active:scale-95"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-lg text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-saffron" />
              Popular Varieties
            </h4>
            <ul className="space-y-2.5 text-sm text-cream/80">
              {categories.map((c) => (
                <li key={c.label}>
                  <Link
                    to={c.href}
                    className="hover:text-saffron transition-colors inline-block hover:translate-x-1 duration-150"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold text-lg text-white mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm text-cream/80">
              {quickLinks.map((q) => (
                <li key={q.label}>
                  <Link
                    to={q.href}
                    className="hover:text-saffron transition-colors inline-block hover:translate-x-1 duration-150"
                  >
                    {q.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Hours */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold text-lg text-white mb-4">
              Visit or Contact Us
            </h4>
            <ul className="space-y-3 text-sm text-cream/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
                <span>
                  {settings.address}
                  {settings.city && `, ${settings.city}`}
                  {settings.pincode && ` - ${settings.pincode}`}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-saffron shrink-0" />
                <a
                  href={`tel:${settings.contact_number}`}
                  className="hover:text-saffron transition-colors font-medium"
                >
                  {settings.contact_number}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
                <span>{settings.opening_hours || 'Mon - Sun: 5:00 AM - 10:00 PM'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/15 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-cream/60">
          <p>
            © {currentYear} {settings.store_name}. All rights reserved.
          </p>
          <p className="flex items-center gap-1.5 font-medium">
            Handcrafted with <Heart className="w-3.5 h-3.5 text-rose fill-rose" /> for auspicious ceremonies
          </p>
        </div>
      </div>
    </footer>
  )
}

