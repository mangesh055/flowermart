import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft,
  MessageCircle,
  Store,
  Calendar,
  Clock,
  Phone,
  User,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  IndianRupee,
  CreditCard,
  Wallet,
} from 'lucide-react'
import { useCartStore } from '@/stores/cartStore'
import { useSettingsStore } from '@/stores/settingsStore'
import { orderService } from '@/services/orderService'
import { formatINR, cn } from '@/lib/utils'

export function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCartStore()
  const settings = useSettingsStore((state) => state.settings)

  // Customer Information Fields
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [alternatePhone, setAlternatePhone] = useState('')

  // Deal & Advance Payment Fields
  const [advancePaid, setAdvancePaid] = useState<number | ''>(0)
  const [paymentNote, setPaymentNote] = useState('Will Pay on Pickup')

  // Date, Time & Instructions
  const [requiredDate, setRequiredDate] = useState('')
  const [requiredTime, setRequiredTime] = useState('06:30 AM - Morning Pooja')
  const [specialInstructions, setSpecialInstructions] = useState('')

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Default date to tomorrow
  useEffect(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    setRequiredDate(tomorrow.toISOString().split('T')[0])
  }, [])

  // If cart is empty, redirect back
  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart')
    }
  }, [items, navigate])

  const totalDealAmount = subtotal
  const numericAdvance = typeof advancePaid === 'number' ? Math.max(0, advancePaid) : 0
  const balanceDue = Math.max(0, totalDealAmount - numericAdvance)

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!customerName.trim() || customerName.trim().length < 2) {
      newErrors.customerName = 'Please enter your full name'
    }

    const cleanDigits = customerPhone.replace(/\D/g, '')
    if (!cleanDigits || cleanDigits.length < 10) {
      newErrors.customerPhone = 'Please enter a valid 10-digit mobile number'
    }

    if (!requiredDate) {
      newErrors.requiredDate = 'Please select the required pickup date'
    }

    if (numericAdvance > totalDealAmount) {
      newErrors.advancePaid = `Advance amount cannot exceed total deal of ${formatINR(totalDealAmount)}`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm() || isSubmitting) return

    setIsSubmitting(true)

    // Generate unique idempotency key for this submission
    const idempotencyKey = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    try {
      const result = await orderService.createOrder(
        {
          customer_name: customerName,
          customer_phone: customerPhone,
          customer_alternate_phone: alternatePhone,
          fulfilment_type: 'pickup',
          required_date: requiredDate,
          required_time: requiredTime,
          special_instructions: specialInstructions,
          advance_paid: numericAdvance,
          payment_note: paymentNote,
          idempotency_key: idempotencyKey,
          items: items.map((i) => ({
            product_id: i.product_id,
            quantity: i.quantity,
            customization_notes: i.customization_notes,
          })),
        },
        {
          default_delivery_charge: 0,
          store_name: settings.store_name,
        }
      )

      if (result.success && result.order) {
        // Clear local cart
        clearCart()

        // Construct WhatsApp URL
        const encodedMsg = encodeURIComponent(result.whatsappMessage || '')
        const cleanWhatsAppNumber = settings.whatsapp_number.replace(/\D/g, '')
        const targetNumber =
          cleanWhatsAppNumber.length === 10 ? `91${cleanWhatsAppNumber}` : cleanWhatsAppNumber
        const waUrl = `https://wa.me/${targetNumber}?text=${encodedMsg}`

        // Open WhatsApp in new tab
        window.open(waUrl, '_blank', 'noopener,noreferrer')

        // Redirect customer to Order Success page
        navigate(`/order-success/${result.order.order_number}`, {
          state: { order: result.order, whatsappUrl: waUrl },
        })
      } else {
        alert(result.error || 'Failed to process order. Please try again.')
      }
    } catch (err: any) {
      alert(err?.message || 'An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="py-8 sm:py-12 bg-ivory min-h-screen">
      <div className="section-container space-y-8">
        {/* Back Link */}
        <div>
          <Link
            to="/cart"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-brown transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Cart
          </Link>
        </div>

        {/* Header */}
        <div className="space-y-1 border-b border-cream pb-4">
          <span className="badge-tag bg-green-100 text-green-800 border border-green-200">
            WhatsApp Direct Checkout & Deal Confirmation
          </span>
          <h1 className="font-display font-bold text-3xl sm:text-4xl text-brown">
            Customer & Deal Payment Details
          </h1>
          <p className="text-sm text-muted-foreground">
            No gateway required! Enter your details, specify how much you have paid or wish to advance, and coordinate directly with the shop owner on WhatsApp.
          </p>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left 8 Cols: Form inputs */}
            <div className="lg:col-span-8 space-y-6">
              {/* Customer Information Card */}
              <div className="bg-white rounded-3xl p-6 border border-cream shadow-sm space-y-4">
                <h3 className="font-display font-semibold text-lg text-brown flex items-center gap-2 border-b border-cream pb-3">
                  <User className="w-4 h-4 text-saffron" />
                  1. Your Contact Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brown">
                      Full Name <span className="text-rose">*</span>
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ramesh Kulkarni"
                      className={cn(
                        'w-full py-2.5 px-3 rounded-xl border bg-ivory/30 text-sm focus:outline-none focus:ring-2 transition-all',
                        errors.customerName
                          ? 'border-rose focus:ring-rose/30'
                          : 'border-cream focus:ring-saffron/40'
                      )}
                    />
                    {errors.customerName && (
                      <p className="text-[11px] text-rose font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.customerName}
                      </p>
                    )}
                  </div>

                  {/* Phone */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brown">
                      WhatsApp Mobile Number <span className="text-rose">*</span>
                    </label>
                    <input
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="10-digit mobile number"
                      className={cn(
                        'w-full py-2.5 px-3 rounded-xl border bg-ivory/30 text-sm focus:outline-none focus:ring-2 transition-all',
                        errors.customerPhone
                          ? 'border-rose focus:ring-rose/30'
                          : 'border-cream focus:ring-saffron/40'
                      )}
                    />
                    {errors.customerPhone && (
                      <p className="text-[11px] text-rose font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.customerPhone}
                      </p>
                    )}
                  </div>

                  {/* Alternate Phone */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-brown">
                      Alternate Contact Number <span className="text-muted-foreground font-normal">(Optional)</span>
                    </label>
                    <input
                      type="tel"
                      value={alternatePhone}
                      onChange={(e) => setAlternatePhone(e.target.value)}
                      placeholder="e.g. Landline or family member number"
                      className="w-full py-2.5 px-3 rounded-xl border border-cream bg-ivory/30 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
                    />
                  </div>
                </div>
              </div>

              {/* Deal Payment & Advance Section (Replacing Delivery Options) */}
              <div className="bg-white rounded-3xl p-6 border border-cream shadow-sm space-y-5">
                <div className="border-b border-cream pb-3">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-5 h-5 text-saffron" />
                    <h3 className="font-display font-semibold text-lg text-brown">
                      2. Deal Payment & Advance Details
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Record how much you have already paid or wish to advance towards this total deal.
                  </p>
                </div>

                {/* Live Deal Computation Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  {/* Total Deal Amount */}
                  <div className="p-4 rounded-2xl bg-ivory border border-cream text-center space-y-1">
                    <span className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider block">
                      Total Deal
                    </span>
                    <p className="font-display font-bold text-xl sm:text-2xl text-brown">
                      {formatINR(totalDealAmount)}
                    </p>
                    <span className="text-[10px] text-muted-foreground block">
                      {items.reduce((s, i) => s + i.quantity, 0)} items selected
                    </span>
                  </div>

                  {/* Advance / Paid Amount */}
                  <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-center space-y-1">
                    <span className="text-[11px] text-green-800 font-semibold uppercase tracking-wider block">
                      Advance / Paid
                    </span>
                    <p className="font-display font-bold text-xl sm:text-2xl text-green-700">
                      {formatINR(numericAdvance)}
                    </p>
                    <span className="text-[10px] text-green-700/80 block">
                      {numericAdvance >= totalDealAmount && totalDealAmount > 0
                        ? '100% Fully Paid'
                        : numericAdvance > 0
                        ? 'Partial Advance'
                        : 'No Advance Yet'}
                    </span>
                  </div>

                  {/* Balance Due on Pickup */}
                  <div className="p-4 rounded-2xl bg-saffron/10 border border-saffron/30 text-center space-y-1">
                    <span className="text-[11px] text-saffron-800 font-semibold uppercase tracking-wider block">
                      Remaining Balance Due
                    </span>
                    <p className="font-display font-bold text-xl sm:text-2xl text-saffron">
                      {formatINR(balanceDue)}
                    </p>
                    <span className="text-[10px] text-saffron-800/80 block">
                      Payable on pickup at shop
                    </span>
                  </div>
                </div>

                {/* Input for Advance Paid */}
                <div className="space-y-3 pt-1">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brown flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-saffron" />
                        How much have you paid towards this deal?
                      </span>
                      <span className="text-muted-foreground text-[11px] font-normal">
                        Max: {formatINR(totalDealAmount)}
                      </span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-brown">
                        ₹
                      </span>
                      <input
                        type="number"
                        min={0}
                        max={totalDealAmount}
                        value={advancePaid}
                        onChange={(e) => {
                          const val = e.target.value === '' ? '' : Number(e.target.value)
                          setAdvancePaid(val)
                        }}
                        placeholder="Enter advance amount paid (e.g. 500)"
                        className={cn(
                          'w-full pl-8 pr-3 py-2.5 rounded-xl border bg-ivory/30 text-sm font-bold text-brown focus:outline-none focus:ring-2 transition-all',
                          errors.advancePaid
                            ? 'border-rose focus:ring-rose/30'
                            : 'border-cream focus:ring-saffron/40'
                        )}
                      />
                    </div>
                    {errors.advancePaid && (
                      <p className="text-[11px] text-rose font-medium flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {errors.advancePaid}
                      </p>
                    )}
                  </div>

                  {/* Fast Quick Select Chips */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-xs text-muted-foreground font-medium mr-1">Quick Select:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAdvancePaid(0)
                        setPaymentNote('Will Pay Full on Pickup')
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
                        numericAdvance === 0
                          ? 'bg-brown text-white border-brown shadow-sm'
                          : 'bg-ivory border-cream text-brown hover:bg-cream'
                      )}
                    >
                      ₹0 (Pay on Pickup)
                    </button>

                    {totalDealAmount >= 500 && (
                      <button
                        type="button"
                        onClick={() => {
                          setAdvancePaid(500)
                          setPaymentNote('₹500 Advance via GPay / UPI')
                        }}
                        className={cn(
                          'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
                          numericAdvance === 500
                            ? 'bg-saffron text-white border-saffron shadow-sm'
                            : 'bg-ivory border-cream text-brown hover:bg-cream'
                        )}
                      >
                        ₹500 Advance
                      </button>
                    )}

                    {totalDealAmount >= 1000 && (
                      <button
                        type="button"
                        onClick={() => {
                          setAdvancePaid(1000)
                          setPaymentNote('₹1000 Advance via GPay / UPI')
                        }}
                        className={cn(
                          'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
                          numericAdvance === 1000
                            ? 'bg-saffron text-white border-saffron shadow-sm'
                            : 'bg-ivory border-cream text-brown hover:bg-cream'
                        )}
                      >
                        ₹1,000 Advance
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setAdvancePaid(totalDealAmount)
                        setPaymentNote('100% Full Payment via UPI / GPay')
                      }}
                      className={cn(
                        'px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all',
                        numericAdvance === totalDealAmount
                          ? 'bg-green-700 text-white border-green-700 shadow-sm'
                          : 'bg-ivory border-cream text-brown hover:bg-cream'
                      )}
                    >
                      Full 100% ({formatINR(totalDealAmount)})
                    </button>
                  </div>

                  {/* Payment Note / Method */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-xs font-semibold text-brown">
                      Payment Mode / Reference Note
                    </label>
                    <input
                      type="text"
                      value={paymentNote}
                      onChange={(e) => setPaymentNote(e.target.value)}
                      placeholder="e.g. Paid via GPay / PhonePe / Cash given at shop / Will pay on pickup"
                      className="w-full py-2.5 px-3 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm text-brown focus:outline-none focus:ring-2 focus:ring-saffron/40 font-medium"
                    />
                  </div>
                </div>

                {/* Store Pickup Collection Notice */}
                <div className="p-3.5 rounded-2xl bg-ivory border border-cream text-xs text-brown/80 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-saffron/15 text-saffron flex items-center justify-center shrink-0 mt-0.5">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-brown">
                      Order Collection: Dadar Flower Mandi Shop
                    </h4>
                    <p className="text-muted-foreground mt-0.5 leading-relaxed">
                      All fresh garlands are crafted and packaged for convenient store pickup at Shop No. 4, Dadar Flower Market.
                    </p>
                  </div>
                </div>
              </div>

              {/* Date, Time & Special Instructions */}
              <div className="bg-white rounded-3xl p-6 border border-cream shadow-sm space-y-4">
                <h3 className="font-display font-semibold text-lg text-brown flex items-center gap-2 border-b border-cream pb-3">
                  <Calendar className="w-4 h-4 text-saffron" />
                  3. Pickup Date & Ceremony Timing
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Required Date */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brown">
                      Required Pickup Date <span className="text-rose">*</span>
                    </label>
                    <input
                      type="date"
                      value={requiredDate}
                      onChange={(e) => setRequiredDate(e.target.value)}
                      className={cn(
                        'w-full py-2.5 px-3 rounded-xl border bg-ivory/30 text-sm focus:outline-none focus:ring-2 font-medium text-brown',
                        errors.requiredDate ? 'border-rose' : 'border-cream focus:ring-saffron/40'
                      )}
                    />
                    {errors.requiredDate && (
                      <p className="text-[11px] text-rose font-medium">{errors.requiredDate}</p>
                    )}
                  </div>

                  {/* Required Time */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-brown">
                      Pickup / Muhurat Timing
                    </label>
                    <select
                      value={requiredTime}
                      onChange={(e) => setRequiredTime(e.target.value)}
                      className="w-full py-2.5 px-3 rounded-xl border border-cream bg-ivory/30 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40 font-medium text-brown"
                    >
                      <option value="05:30 AM - Early Muhurat">05:30 AM (Early Muhurat)</option>
                      <option value="06:30 AM - Morning Pooja">06:30 AM (Morning Pooja)</option>
                      <option value="08:00 AM - Morning Event">08:00 AM (Morning Event)</option>
                      <option value="10:00 AM - Midday">10:00 AM</option>
                      <option value="12:00 PM - Afternoon">12:00 PM</option>
                      <option value="04:00 PM - Evening Reception">04:00 PM (Evening Reception)</option>
                      <option value="06:30 PM - Night Muhurat">06:30 PM (Night Muhurat)</option>
                    </select>
                  </div>

                  {/* Special Instructions */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-brown">
                      Special Notes or Garland Instructions for the Artisan
                    </label>
                    <textarea
                      rows={2}
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      placeholder="e.g. Please wrap in fresh leaves for extra cooling, or notify 30 mins before pickup..."
                      className="w-full p-3 rounded-xl border border-cream bg-ivory/30 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40 resize-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Order Summary & Place Order */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl p-6 border border-cream shadow-sm space-y-5">
                <h3 className="font-display font-bold text-xl text-brown border-b border-cream pb-3">
                  Deal Summary ({items.length} items)
                </h3>

                {/* Items mini list */}
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {items.map((item) => (
                    <div key={item.product_id} className="flex justify-between text-xs py-1 border-b border-cream/50">
                      <div>
                        <p className="font-semibold text-brown line-clamp-1">{item.product_name}</p>
                        <p className="text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold text-brown">{formatINR(item.line_total)}</span>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="space-y-2.5 pt-2 border-t border-cream text-xs sm:text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total Deal Amount</span>
                    <span className="font-semibold text-brown text-base">{formatINR(totalDealAmount)}</span>
                  </div>

                  <div className="flex justify-between text-green-700">
                    <span>Advance / Paid Amount</span>
                    <span className="font-bold text-green-700">
                      - {formatINR(numericAdvance)}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-cream flex justify-between items-baseline">
                    <div>
                      <span className="font-display font-bold text-sm text-brown block">
                        Balance Due on Pickup
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Pay at shop counter
                      </span>
                    </div>
                    <span className="font-display font-bold text-2xl text-saffron">
                      {formatINR(balanceDue)}
                    </span>
                  </div>
                </div>

                {/* WhatsApp Order Flow explanation */}
                <div className="p-4 rounded-2xl bg-green-50 border border-green-200 text-xs text-green-900 space-y-2">
                  <p className="font-bold flex items-center gap-1.5 text-green-800">
                    <MessageCircle className="w-4 h-4 fill-green-600 text-white" />
                    Direct WhatsApp Order
                  </p>
                  <p className="leading-relaxed text-green-800/90">
                    Clicking below saves your deal and opens WhatsApp with a pre-formatted breakdown of your items, advance paid, and remaining balance.
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-green text-sm py-4 flex items-center justify-center gap-2 shadow-premium font-bold text-white hover:scale-[1.02] active:scale-95 transition-all"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span>{isSubmitting ? 'Saving Order...' : 'Confirm Order on WhatsApp'}</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
