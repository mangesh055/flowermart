import { Flower2, ShieldCheck, Clock, Award, PhoneCall, Sparkles } from 'lucide-react'

export function WhyChooseUs() {
  const points = [
    {
      icon: Flower2,
      title: 'Daily Fresh Dadar Harvest',
      desc: 'Sourced before dawn directly from trusted growers and the iconic Dadar flower mandi for maximum freshness and aroma.',
    },
    {
      icon: Award,
      title: 'Generational Craftsmanship',
      desc: 'Our master garland makers possess decades of expertise in complex weaving styles, tight stringing and durable finishes.',
    },
    {
      icon: Clock,
      title: 'Early Morning Timings',
      desc: 'Need garlands at 6:00 AM for an auspicious wedding muhurat or Satyanarayan pooja? We have you covered.',
    },
    {
      icon: Sparkles,
      title: '100% Customization',
      desc: 'Choose your desired color scheme, length in metres, thickness, and flower types (Dutch roses, Mogra, Carnations, Orchids).',
    },
    {
      icon: PhoneCall,
      title: 'Instant WhatsApp Booking',
      desc: 'No complicated forms or payment friction. Browse, choose your items, and coordinate directly with the shop owner on WhatsApp.',
    },
    {
      icon: ShieldCheck,
      title: 'Transparent Pricing',
      desc: 'Clear rates per piece, pair, or metre with zero hidden costs. Honest, fair pricing respected throughout Mumbai.',
    },
  ]

  return (
    <section className="py-20 bg-white border-y border-cream">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="badge-tag bg-saffron/15 text-saffron border border-saffron/30 mb-2">
            The SPB Promise
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-brown">
            Why Mumbai Chooses Santosh Pushpa Bhandar
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground mt-2">
            Bringing purity, elegance, and traditional splendor to your most sacred family occasions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {points.map((pt) => {
            const Icon = pt.icon
            return (
              <div
                key={pt.title}
                className="p-6 rounded-2xl bg-ivory/60 border border-cream hover:border-saffron/40 hover:bg-ivory hover:shadow-card transition-all duration-300 space-y-3"
              >
                <div className="w-12 h-12 rounded-xl bg-saffron/15 text-saffron flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-display font-semibold text-lg text-brown">
                  {pt.title}
                </h3>
                <p className="text-sm text-brown/70 leading-relaxed font-body">
                  {pt.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

