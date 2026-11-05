import { useState, useEffect } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom'
import {
  CheckCircle2,
  MessageCircle,
  RotateCw,
  ShoppingBag,
  Store,
  Truck,
  Calendar,
  Clock,
  Phone,
  User,
  MapPin,
  AlertCircle,
} from 'lucide-react'
import { orderService } from '@/services/orderService'
import { useSettingsStore } from '@/stores/settingsStore'
import type { Order } from '@/types/database'
import { formatINR, formatDateIST, formatPriceUnitShort, buildWhatsAppLink } from '@/lib/utils'
import { generateOrderWhatsAppMessage } from '@/services/whatsappService'

export function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>()
  const location = useLocation()
  const settings = useSettingsStore((state) => state.settings)

  const [order, setOrder] = useState<Order | null>(
    (location.state as any)?.order || null
  )
  const [isLoading, setIsLoading] = useState(!order)

  useEffect(() => {
    if (!order && id) {
      orderService.getOrderByIdOrNumber(id).then((found) => {
        setOrder(found)
        setIsLoading(false)
      })
    }
  }, [id, order])

  if (isLoading) {
    return (
      <div className="section-container py-20 text-center animate-pulse">
        <div className="h-8 bg-cream/50 rounded-xl w-1/3 mx-auto mb-4" />
        <div className="h-20 bg-cream/50 rounded-2xl max-w-lg mx-auto" />
      </div>
    )
  }

  if (!order) {
    return (
      <div className="section-container py-20 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose mx-auto" />
        <h2 className="font-display font-bold text-2xl text-brown">Order Details Not Found</h2>
        <p className="text-sm text-muted-foreground">
          We could not load the order with reference: {id}
        </p>
        <Link to="/catalogue" className="btn-saffron inline-flex">
          Return to Catalogue
        </Link>
      </div>
    )
  }

  // Construct retry WhatsApp link
  const orderMessage = generateOrderWhatsAppMessage(order, settings.store_name)
  const whatsAppLink = buildWhatsAppLink(settings.whatsapp_number, orderMessage)

  return (
    <div className="py-10 sm:py-16 bg-ivory min-h-screen">
      <div className="section-container max-w-3xl space-y-8">
        {/* Success Card Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-cream shadow-md text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
          </div>

          <div className="space-y-1">
            <span className="badge-tag bg-green-100 text-green-800">
              Order Registered Successfully
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-brown">
              Thank You, {order.customer_name}!
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Your order number is <strong className="text-brown font-mono">{order.order_number}</strong>
            </p>
          </div>

          {/* Important Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 text-left space-y-1.5">
            <p className="font-bold flex items-center gap-1.5 text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
              Final Confirmation via WhatsApp
            </p>
            <p className="leading-relaxed">
              Your order is recorded in our system. Please make sure you have sent the WhatsApp message to the shop owner to confirm garland length, delivery time, and final acceptance.
            </p>
          </div>

          {/* WhatsApp Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto btn-green text-sm px-6 py-3.5 flex items-center justify-center gap-2 font-bold shadow-md"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span>Open in WhatsApp</span>
            </a>

            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-cream hover:bg-cream/40 text-brown text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Retry Sending WhatsApp Message</span>
            </a>
          </div>
        </div>

        {/* Order Details Breakdown Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-cream shadow-sm space-y-6">
          <h2 className="font-display font-bold text-lg text-brown border-b border-cream pb-3">
            Order Specifications & Items
          </h2>

          {/* Pickup & Time Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Store className="w-4 h-4 text-saffron" />
                Collection Type:
              </span>
              <p className="font-semibold text-brown capitalize">
                Store Pickup (Dadar Flower Mandi)
              </p>
              <p className="text-xs text-muted-foreground pt-0.5">
                Shop No. 4, Station Road, Dadar (West)
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-saffron" />
                Pickup Date & Timing:
              </span>
              <p className="font-semibold text-brown">
                {formatDateIST(order.required_date)}
              </p>
              {order.required_time && (
                <p className="text-xs text-muted-foreground">
                  Time: {order.required_time}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <User className="w-4 h-4 text-saffron" />
                Customer:
              </span>
              <p className="font-semibold text-brown">{order.customer_name}</p>
              <p className="text-xs text-muted-foreground">Phone: {order.customer_phone}</p>
            </div>

            <div className="space-y-1">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <ShoppingBag className="w-4 h-4 text-saffron" />
                Deal Status:
              </span>
              <p className="font-semibold text-saffron capitalize">
                {order.status.replace('_', ' ')}
              </p>
            </div>
          </div>

          {/* Line items list */}
          <div className="border-t border-cream pt-4 space-y-3">
            <h3 className="font-semibold text-xs text-muted-foreground uppercase tracking-wider">
              Ordered Garlands
            </h3>
            {order.items?.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex items-center justify-between text-xs sm:text-sm py-2 border-b border-cream/50"
              >
                <div>
                  <p className="font-semibold text-brown">{item.product_name}</p>
                  <p className="text-muted-foreground text-xs">
                    {formatINR(item.unit_price)} {formatPriceUnitShort(item.price_unit)} × {item.quantity}
                  </p>
                </div>
                <span className="font-bold text-brown">{formatINR(item.line_total)}</span>
              </div>
            ))}
          </div>

          {/* Deal & Advance Paid Breakdown */}
          <div className="border-t border-cream pt-3 space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Total Deal Amount:</span>
              <span className="font-semibold text-brown text-base">{formatINR(order.total_amount)}</span>
            </div>
            <div className="flex justify-between text-green-700">
              <span>Advance / Amount Paid:</span>
              <span className="font-bold text-green-700">
                - {formatINR(order.advance_paid ?? 0)}
              </span>
            </div>
            {order.payment_note && (
              <div className="flex justify-between text-muted-foreground text-[11px]">
                <span>Payment Note:</span>
                <span className="font-medium text-brown">{order.payment_note}</span>
              </div>
            )}
            <div className="pt-2 border-t border-cream flex justify-between text-sm sm:text-base font-bold">
              <span className="text-brown">Balance Due on Pickup:</span>
              <span className="text-saffron font-display text-xl">
                {formatINR(order.balance_amount ?? Math.max(0, order.total_amount - (order.advance_paid ?? 0)))}
              </span>
            </div>
          </div>
        </div>

        {/* Home navigation */}
        <div className="text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-brown font-semibold">
            ← Return to Santosh Pushpa Bhandar Homepage
          </Link>
        </div>
      </div>
    </div>
  )
}

