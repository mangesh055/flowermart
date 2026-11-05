import { useState, useEffect } from 'react'
import {
  Truck,
  MapPin,
  Calendar,
  Clock,
  Phone,
  User,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { orderService } from '@/services/orderService'
import type { Order } from '@/types/database'
import { formatINR, formatDateIST, cn } from '@/lib/utils'

export function AdminDeliveriesPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState<'today' | 'upcoming' | 'all'>('today')

  useEffect(() => {
    orderService.getAllOrders().then((all) => {
      // Filter for orders with fulfilment_type === 'delivery'
      const deliveryOrders = all.filter((o) => o.fulfilment_type === 'delivery')
      setOrders(deliveryOrders)
    })
  }, [])

  const todayStr = new Date().toISOString().split('T')[0]
  const todayDeliveries = orders.filter((o) => o.required_date === todayStr)
  const upcomingDeliveries = orders.filter((o) => o.required_date > todayStr)

  const displayedOrders =
    activeTab === 'today'
      ? todayDeliveries
      : activeTab === 'upcoming'
      ? upcomingDeliveries
      : orders

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream pb-4">
        <div>
          <span className="badge-tag bg-green-100 text-green-800 border border-green-200">
            Logistics & Despatches
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-brown">
            Delivery Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Track daily home deliveries, driver dispatches, addresses, and navigation links
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-cream">
        <button
          onClick={() => setActiveTab('today')}
          className={cn(
            'px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all',
            activeTab === 'today'
              ? 'border-saffron text-saffron'
              : 'border-transparent text-muted-foreground hover:text-brown'
          )}
        >
          Today&apos;s Deliveries ({todayDeliveries.length})
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={cn(
            'px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all',
            activeTab === 'upcoming'
              ? 'border-saffron text-saffron'
              : 'border-transparent text-muted-foreground hover:text-brown'
          )}
        >
          Upcoming Deliveries ({upcomingDeliveries.length})
        </button>
        <button
          onClick={() => setActiveTab('all')}
          className={cn(
            'px-5 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-all',
            activeTab === 'all'
              ? 'border-saffron text-saffron'
              : 'border-transparent text-muted-foreground hover:text-brown'
          )}
        >
          All Despatches ({orders.length})
        </button>
      </div>

      {/* Deliveries List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {displayedOrders.length === 0 ? (
          <div className="col-span-2 bg-white rounded-3xl p-12 text-center border border-cream space-y-3">
            <Truck className="w-12 h-12 text-muted-foreground mx-auto" />
            <h3 className="font-display font-semibold text-lg text-brown">
              No Deliveries Scheduled for this Filter
            </h3>
            <p className="text-xs text-muted-foreground">
              New customer orders opting for doorstep delivery will appear here automatically.
            </p>
          </div>
        ) : (
          displayedOrders.map((ord) => {
            const mapsQuery = encodeURIComponent(
              `${ord.delivery_address || ''}, Mumbai`
            )
            const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`

            return (
              <div
                key={ord.id}
                className="bg-white rounded-3xl p-6 border border-cream shadow-sm space-y-4 hover:border-saffron/40 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-cream pb-3">
                    <div>
                      <span className="font-mono font-bold text-sm text-brown">
                        {ord.order_number}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {formatDateIST(ord.required_date)} • {ord.required_time || 'Morning'}
                      </p>
                    </div>

                    <span
                      className={cn(
                        'badge-tag text-[10px] capitalize',
                        ord.status === 'out_for_delivery'
                          ? 'bg-amber-100 text-amber-800'
                          : ord.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-ivory text-brown border border-cream'
                      )}
                    >
                      {ord.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Customer & Address */}
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-saffron shrink-0" />
                      <span className="font-semibold text-brown">{ord.customer_name}</span>
                      <a
                        href={`tel:${ord.customer_phone}`}
                        className="text-saffron hover:underline font-mono text-xs ml-auto"
                      >
                        {ord.customer_phone}
                      </a>
                    </div>

                    <div className="flex items-start gap-2 bg-ivory/60 p-3 rounded-2xl border border-cream text-xs">
                      <MapPin className="w-4 h-4 text-rose shrink-0 mt-0.5" />
                      <span className="text-brown leading-relaxed flex-1">
                        {ord.delivery_address || 'Address not provided'}
                      </span>
                    </div>

                    {/* Items */}
                    <div className="text-xs text-muted-foreground pt-1">
                      <strong>Garlands:</strong> {ord.items?.map((i) => `${i.product_name} (x${i.quantity})`).join(', ') || 'Custom Garland'}
                    </div>

                    <div className="flex justify-between items-center pt-1 text-xs">
                      <span className="text-muted-foreground">Delivery Charge:</span>
                      <span className="font-bold text-brown">{formatINR(ord.delivery_charge)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-cream flex items-center justify-between gap-3">
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-saffron text-xs py-2 px-3 flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Navigate on Google Maps</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>

                  <a
                    href={`tel:${ord.customer_phone}`}
                    className="p-2 rounded-xl bg-cream/50 text-brown hover:bg-cream"
                    title="Call Customer"
                  >
                    <Phone className="w-4 h-4" />
                  </a>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

