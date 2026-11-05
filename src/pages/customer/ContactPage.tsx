import { useState } from 'react'
import {
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  ExternalLink,
  Store,
  Truck,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { useSettingsStore } from '@/stores/settingsStore'
import { buildWhatsAppLink } from '@/lib/utils'

export function ContactPage() {
  const settings = useSettingsStore((state) => state.settings)
  const [quickMsg, setQuickMsg] = useState('')

  const handleQuickWhatsApp = (e: React.FormEvent) => {
    e.preventDefault()
    const text = quickMsg.trim() || `Namaste ${settings.store_name}, I would like to visit or place a flower order.`
    const url = buildWhatsAppLink(settings.whatsapp_number, text)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="py-8 sm:py-12 bg-ivory min-h-screen">
      <div className="section-container space-y-10 max-w-5xl">
        {/* Header */}
        <div className="text-center space-y-2 border-b border-cream pb-6">
          <span className="badge-tag bg-saffron/15 text-saffron border border-saffron/30">
            Get in Touch
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-brown">
            Contact Santosh Pushpa Bhandar
          </h1>
          <p className="font-marathi text-base text-rose font-medium">
            {settings.store_name_marathi || 'संतोष पुष्प भंडार - दादर'}
          </p>
          <p className="text-sm text-muted-foreground font-body max-w-xl mx-auto pt-1">
            Visit our shop at Dadar flower mandi or contact us on WhatsApp for rapid assistance with garland designs, muhurat deliveries and quotations.
          </p>
        </div>

        {/* Contact Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Address Card */}
          <div className="bg-white rounded-3xl p-6 border border-cream shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-saffron/15 text-saffron flex items-center justify-center">
                <MapPin className="w-6 h-6" />
              </div>
              <h2 className="font-display font-semibold text-lg text-brown">Shop Location</h2>
              <p className="text-sm text-brown/80 leading-relaxed font-body">
                {settings.address}
                {settings.city && `, ${settings.city}`}
                {settings.state && `, ${settings.state}`}
                {settings.pincode && ` - ${settings.pincode}`}
              </p>
              {settings.address_marathi && (
                <p className="font-marathi text-xs text-muted-foreground">
                  {settings.address_marathi}
                </p>
              )}
            </div>

            {settings.google_maps_link && (
              <a
                href={settings.google_maps_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-saffron hover:text-saffron-600 transition-colors pt-2"
              >
                <span>Open in Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>

          {/* Calling & WhatsApp Card */}
          <div className="bg-white rounded-3xl p-6 border border-cream shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-green-100 text-green-700 flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <h2 className="font-display font-semibold text-lg text-brown">Call & WhatsApp</h2>
              <div className="space-y-1.5 text-sm">
                <div>
                  <span className="text-xs text-muted-foreground block">Direct Call:</span>
                  <a
                    href={`tel:${settings.contact_number}`}
                    className="font-bold text-brown hover:text-saffron transition-colors"
                  >
                    {settings.contact_number}
                  </a>
                </div>
                {settings.alternate_number && (
                  <div>
                    <span className="text-xs text-muted-foreground block">Alternate:</span>
                    <a
                      href={`tel:${settings.alternate_number}`}
                      className="text-brown hover:text-saffron transition-colors"
                    >
                      {settings.alternate_number}
                    </a>
                  </div>
                )}
                <div>
                  <span className="text-xs text-muted-foreground block">WhatsApp Click-to-Chat:</span>
                  <span className="font-bold text-green-700 font-mono">
                    {settings.whatsapp_number}
                  </span>
                </div>
              </div>
            </div>

            <a
              href={buildWhatsAppLink(settings.whatsapp_number, 'Namaste, I would like to enquire about garland orders.')}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-green text-xs py-2.5 px-4 flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* Operating Hours Card */}
          <div className="bg-white rounded-3xl p-6 border border-cream shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose/15 text-rose flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
              <h2 className="font-display font-semibold text-lg text-brown">Market Timings</h2>
              <p className="text-sm text-brown/80 font-body leading-relaxed">
                {settings.opening_hours || 'Mon - Sun: 5:00 AM - 10:00 PM'}
              </p>
              <div className="p-3 rounded-xl bg-ivory text-xs text-brown/80 space-y-1">
                <p className="font-semibold text-saffron">🌅 Early Morning Muhurats:</p>
                <p>
                  Special 5:00 AM fresh batches available for temple abhishekams and wedding muhurat delivery.
                </p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground">
              Open 365 days a year including festival days.
            </div>
          </div>
        </div>

        {/* Quick Message Box & Interactive Map Placeholder */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Quick Message Form */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-cream shadow-sm space-y-4">
            <h2 className="font-display font-bold text-xl text-brown">
              Send a Direct WhatsApp Message
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground font-body">
              Type your question below and click send — it will open directly in WhatsApp with the owner.
            </p>

            <form onSubmit={handleQuickWhatsApp} className="space-y-3 pt-2">
              <textarea
                rows={4}
                value={quickMsg}
                onChange={(e) => setQuickMsg(e.target.value)}
                placeholder="Write your enquiry here (e.g. Do you have 10-foot marigold toran available for this Friday morning?)..."
                className="w-full p-3.5 rounded-2xl border border-cream bg-ivory/30 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40 resize-none text-brown"
              />
              <button
                type="submit"
                className="w-full btn-green text-sm py-3.5 flex items-center justify-center gap-2 font-bold shadow-md"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Launch WhatsApp Chat</span>
              </button>
            </form>
          </div>

          {/* Map & Landmark View */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-cream shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-display font-bold text-xl text-brown">
                  How to Reach Dadar Flower Mandi
                </h2>
                <p className="text-xs text-muted-foreground">
                  Conveniently situated right outside Dadar Railway Station (West)
                </p>
              </div>
              <span className="badge-tag bg-saffron/15 text-saffron">Dadar West</span>
            </div>

            {/* Visual Route Info */}
            <div className="space-y-3 text-xs sm:text-sm text-brown/80 pt-2 font-body">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-ivory">
                <Store className="w-4 h-4 text-saffron shrink-0 mt-0.5" />
                <span>
                  <strong>From Dadar Station:</strong> 2 minutes walking distance from Platform No. 1 / West exit, near the iconic flower bridge.
                </span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-ivory">
                <Truck className="w-4 h-4 text-green-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Vehicle Delivery & Parking:</strong> Tempo and vehicle loading bays accessible via Senapati Bapat Marg before 7:00 AM.
                </span>
              </div>
            </div>

            {/* Google Map Link Button */}
            {settings.google_maps_link && (
              <div className="pt-2">
                <a
                  href={settings.google_maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl border border-saffron text-saffron hover:bg-saffron hover:text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MapPin className="w-4 h-4" />
                  <span>Open Navigation on Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
