import { Link } from 'react-router-dom'
import { MessageSquare, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'
import { useSettingsStore } from '@/stores/settingsStore'
import { buildWhatsAppLink } from '@/lib/utils'

export function HeroBanner() {
  const settings = useSettingsStore((state) => state.settings)
  const defaultWhatsAppText = `Namaste ${settings.store_name}, I want to enquire about fresh garlands for my event.`

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream/40 via-ivory to-ivory pt-8 pb-20 md:py-24">
      {/* Decorative floral background accents */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-saffron/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-rose/10 blur-3xl pointer-events-none" />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-saffron/30 shadow-sm text-saffron-700 text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-saffron fill-saffron" />
              <span>Dadar Flower Market • 100% Fresh Daily Harvest</span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-brown tracking-tight leading-[1.15]">
              Beautiful Garlands{' '}
              <span className="text-saffron block sm:inline">for Every Special</span>{' '}
              <span className="text-rose">Occasion</span>
            </h1>

            <p className="text-base sm:text-lg text-brown/80 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-body">
              Handcrafted wedding varmalas, sacred temple pooja garlands, and fragrant mogra venis prepared fresh every morning by skilled generational garland artisans.
            </p>

            {/* Value Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs font-medium text-brown/80 max-w-lg mx-auto lg:mx-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>Direct WhatsApp Order</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>Custom Sizing & Blooms</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                <span>Early Morning Delivery</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                to="/catalogue"
                className="w-full sm:w-auto btn-saffron text-base px-7 py-3.5 flex items-center justify-center gap-2 shadow-premium"
              >
                <span>Explore Catalogue</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href={buildWhatsAppLink(settings.whatsapp_number, defaultWhatsAppText)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto btn-green text-base px-6 py-3.5 flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4 fill-current" />
                <span>WhatsApp Enquiry</span>
              </a>
            </div>
          </div>

          {/* Right Image Showcase Column */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              {/* Main Prominent Photo */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=85"
                  alt="Traditional Indian Wedding Varmala by Santosh Pushpa Bhandar"
                  className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown/70 via-transparent to-transparent flex items-end p-6">
                  <div className="text-white space-y-1">
                    <span className="badge-tag bg-saffron text-white">Signature Collection</span>
                    <h2 className="font-display font-semibold text-lg sm:text-xl">
                      Royal Rose & Orchid Varmala
                    </h2>
                    <p className="text-xs text-cream/90 font-marathi">
                      लग्न वरमाला विशेष जोडी
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-cream max-w-[200px] hidden sm:block">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-saffron/15 text-saffron flex items-center justify-center text-xl shrink-0 font-bold">
                    40+
                  </div>
                  <div>
                    <p className="text-xs font-bold text-brown">Years of Trust</p>
                    <p className="text-[11px] text-muted-foreground">In Dadar Market</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

