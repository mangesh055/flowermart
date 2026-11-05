import { Link, useNavigate } from 'react-router-dom'
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  MessageCircle,
} from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { formatINR, formatPriceUnitShort } from '@/lib/utils'

export function CartPage() {
  const navigate = useNavigate()
  const { items, subtotal, delivery_charge, total, updateQuantity, removeItem, clearCart } =
    useCartStore()
  const settings = useSettingsStore((state) => state.settings)

  if (items.length === 0) {
    return (
      <div className="section-container py-20 text-center space-y-5">
        <div className="w-20 h-20 rounded-full bg-cream mx-auto flex items-center justify-center text-4xl shadow-inner">
          🛒
        </div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-brown">
          Your Shopping Cart is Empty
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          Explore our collection of fresh marigold pooja malas, bridal varmalas, and fragrant mogra strands to begin your order.
        </p>
        <div className="pt-2">
          <Link to="/catalogue" className="btn-saffron inline-flex items-center gap-2">
            <span>Explore Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 sm:py-12 bg-ivory min-h-screen">
      <div className="section-container space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cream pb-6">
          <div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-brown">
              Your Garland Cart
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Review your items and proceed to WhatsApp order confirmation
            </p>
          </div>
          <button
            onClick={clearCart}
            className="text-xs text-rose hover:text-rose-700 font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All Items
          </button>
        </div>

        {/* Cart Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.product_id}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-cream shadow-sm flex flex-col sm:flex-row items-center gap-4 transition-all hover:border-saffron/30"
              >
                {/* Thumbnail */}
                <div className="w-24 h-24 rounded-xl overflow-hidden bg-cream/40 shrink-0 border border-cream">
                  <img
                    src={item.image_url || 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&auto=format&fit=crop&q=80'}
                    alt={item.product_name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 space-y-1 text-center sm:text-left w-full sm:w-auto">
                  <Link
                    to={`/product/${item.product_slug}`}
                    className="font-display font-semibold text-base sm:text-lg text-brown hover:text-saffron transition-colors line-clamp-1"
                  >
                    {item.product_name}
                  </Link>

                  <div className="text-xs text-muted-foreground flex items-center justify-center sm:justify-start gap-2">
                    <span>
                      {formatINR(item.unit_price)} {formatPriceUnitShort(item.price_unit)}
                    </span>
                    {item.required_date && (
                      <span className="text-saffron font-medium">
                        • Required: {item.required_date}
                      </span>
                    )}
                  </div>

                  {item.customization_notes && (
                    <p className="text-[11px] text-brown/70 italic line-clamp-1">
                      Note: &ldquo;{item.customization_notes}&rdquo;
                    </p>
                  )}
                </div>

                {/* Quantity Controls & Line Total */}
                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-cream">
                  {/* Quantity Stepper */}
                  <div className="flex items-center gap-2 bg-ivory rounded-xl border border-cream p-1">
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-cream text-brown transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center font-bold text-xs sm:text-sm text-brown">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-cream text-brown transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Line Total */}
                  <div className="text-right min-w-[80px]">
                    <span className="font-display font-bold text-base sm:text-lg text-brown">
                      {formatINR(item.line_total)}
                    </span>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.product_id)}
                    className="p-2 text-muted-foreground hover:text-rose transition-colors rounded-lg hover:bg-rose/10"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Back to Shopping button */}
            <div className="pt-2">
              <Link
                to="/catalogue"
                className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-brown transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Continue Exploring Catalogue
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Proceed to Checkout */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-3xl p-6 border border-cream shadow-sm space-y-5">
              <h3 className="font-display font-bold text-xl text-brown border-b border-cream pb-3">
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
                  <span className="text-brown font-semibold">{formatINR(subtotal)}</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Items Count</span>
                  <span className="text-brown font-semibold">{items.reduce((s, i) => s + i.quantity, 0)} items</span>
                </div>

                <div className="flex justify-between text-muted-foreground">
                  <span>Fulfillment</span>
                  <span className="text-brown font-semibold">Store Pickup (Dadar Mandi)</span>
                </div>

                <div className="pt-3 border-t border-cream flex justify-between items-baseline">
                  <span className="font-display font-bold text-base text-brown">
                    Total Deal Amount
                  </span>
                  <span className="font-display font-bold text-2xl text-saffron">
                    {formatINR(subtotal)}
                  </span>
                </div>
              </div>

              {/* Notice */}
              <div className="p-3.5 rounded-2xl bg-cream/50 text-xs text-brown/80 space-y-1">
                <p className="font-semibold text-brown flex items-center gap-1">
                  <MessageCircle className="w-3.5 h-3.5 text-green-600" />
                  Instant WhatsApp Booking
                </p>
                <p>
                  No payment gateway required! Next, enter your details and send your order straight to the shop owner on WhatsApp.
                </p>
              </div>

              {/* Proceed Button */}
              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-saffron text-sm py-3.5 flex items-center justify-center gap-2 shadow-premium"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Satisfaction Guarantee card */}
            <div className="bg-white rounded-2xl p-4 border border-cream space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center gap-2 text-brown font-semibold">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                <span>Handmade by Santosh Pushpa Bhandar</span>
              </div>
              <p>
                Prices are confirmed directly by the owner. Store pickup available at Dadar Flower Market.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

