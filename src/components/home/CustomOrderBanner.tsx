import { Link } from 'react-router-dom'
import { Sparkles, Camera, ArrowRight, MessageSquare } from 'lucide-react'
import { useSettingsStore } from '@/stores/settingsStore'
import { buildWhatsAppLink } from '@/lib/utils'

export function CustomOrderBanner() {
  const settings = useSettingsStore((state) => state.settings)
  const defaultMsg = `Hello ${settings.store_name}, I have a custom garland reference image that I would like to recreate.`

  return (
    <section className="py-16 bg-ivory">
      <div className="section-container">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brown via-brown/95 to-rose/90 text-white p-8 sm:p-12 shadow-2xl">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-saffron/20 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-5 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron text-white text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Bespoke Garland Styling
            </span>

            <h2 className="font-display font-bold text-3xl sm:text-4xl text-white leading-tight">
              Have a Specific Garland Design in Mind?
            </h2>

            <p className="text-sm sm:text-base text-cream/90 leading-relaxed font-body">
              Upload your Pinterest or Instagram reference photograph, specify your wedding outfit colors, flower preferences, and budget. We will quote and craft it meticulously.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
              <Link
                to="/custom-request"
                className="w-full sm:w-auto btn-saffron text-sm px-6 py-3 flex items-center justify-center gap-2"
              >
                <Camera className="w-4 h-4" />
                <span>Upload Reference Photo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={buildWhatsAppLink(settings.whatsapp_number, defaultMsg)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-white/30 hover:bg-white/10 text-white text-sm font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Enquire on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

