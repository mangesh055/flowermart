import { useState, useEffect } from 'react'
import {
  ShoppingBag,
  MessageCircle,
  Printer,
  Edit,
  Eye,
  CheckCircle2,
  Clock,
  User,
  Phone,
  MapPin,
  Calendar,
  X,
  Search,
} from 'lucide-react'
import { orderService } from '@/services/orderService'
import { useSettingsStore } from '@/stores/settingsStore'
import type { Order, OrderStatus } from '@/types/database'
import { formatINR, formatDateIST, formatPriceUnitShort, buildWhatsAppLink, cn } from '@/lib/utils'

const ALL_STATUSES: OrderStatus[] = [
  'pending',
  'accepted',
  'preparing',
  'ready',
  'out_for_delivery',
  'completed',
  'cancelled',
]

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [noteInput, setNoteInput] = useState('')
  const settings = useSettingsStore((state) => state.settings)

  const loadOrders = () => {
    orderService.getAllOrders().then(setOrders)
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    await orderService.updateOrderStatus(orderId, newStatus, noteInput.trim() || undefined)
    setNoteInput('')
    loadOrders()
    if (selectedOrder && selectedOrder.id === orderId) {
      const updated = await orderService.getOrderByIdOrNumber(orderId)
      setSelectedOrder(updated)
    }
  }

  const handlePrintReceipt = (ord: Order) => {
    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    const itemsRows = ord.items
      ?.map(
        (i, idx) => `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #ddd;">${idx + 1}. ${i.product_name}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: center;">${i.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatINR(i.unit_price)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${formatINR(i.line_total)}</td>
        </tr>`
      )
      .join('')

    printWindow.document.write(`
      <html>
        <head>
          <title>Order Receipt - ${ord.order_number}</title>
          <style>
            body { font-family: sans-serif; padding: 24px; color: #333; max-width: 600px; margin: auto; }
            h1 { margin-bottom: 2px; color: #493629; }
            .header { text-align: center; border-bottom: 2px solid #E98A26; padding-bottom: 12px; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th { background: #F6EBD7; padding: 8px; text-align: left; font-size: 12px; }
            .totals { margin-top: 16px; text-align: right; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${settings.store_name}</h1>
            <p style="font-size: 12px; margin: 0;">${settings.address || 'Dadar Flower Market, Mumbai'}</p>
            <p style="font-size: 12px; margin: 4px 0;">Phone: ${settings.contact_number}</p>
          </div>
          <div>
            <p><strong>Order Number:</strong> ${ord.order_number}</p>
            <p><strong>Customer:</strong> ${ord.customer_name} (${ord.customer_phone})</p>
            <p><strong>Required Date:</strong> ${formatDateIST(ord.required_date)} (${ord.required_time || 'General'})</p>
            <p><strong>Fulfilment:</strong> ${ord.fulfilment_type.toUpperCase()} ${ord.delivery_address ? `- ${ord.delivery_address}` : ''}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows}
            </tbody>
          </table>
          <div class="totals">
            <p><strong>Total Deal Amount:</strong> ${formatINR(ord.total_amount)}</p>
            <p><strong>Advance / Amount Paid:</strong> ${formatINR(ord.advance_paid ?? 0)}</p>
            <h3 style="color: #E98A26; margin: 4px 0;">Remaining Balance Due: ${formatINR(ord.balance_amount ?? Math.max(0, ord.total_amount - (ord.advance_paid ?? 0)))}</h3>
            ${ord.payment_note ? `<p style="font-size: 11px; margin: 4px 0;">Payment Method / Note: ${ord.payment_note}</p>` : ''}
          </div>
          <p style="text-align: center; font-size: 11px; margin-top: 24px; color: #777;">Thank you for your patronage! Har Har Mahadev.</p>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== 'all' && o.status !== statusFilter) return false
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        o.order_number.toLowerCase().includes(q) ||
        o.customer_name.toLowerCase().includes(q) ||
        o.customer_phone.includes(q)
      )
    }
    return true
  })

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cream pb-4">
        <div>
          <span className="badge-tag bg-green-100 text-green-800 border border-green-200">
            Fulfillment
          </span>
          <h1 className="font-display font-bold text-2xl sm:text-3xl text-brown">
            Customer Orders Management
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Accept, track status history, contact customers on WhatsApp, and print receipts
          </p>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-cream shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, phone, customer..."
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-cream bg-ivory/30 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
          />
        </div>

        {/* Status Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={cn(
              'px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors',
              statusFilter === 'all'
                ? 'bg-brown text-white'
                : 'bg-ivory hover:bg-cream text-brown border border-cream'
            )}
          >
            All ({orders.length})
          </button>
          {ALL_STATUSES.map((st) => {
            const count = orders.filter((o) => o.status === st).length
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-xs font-semibold capitalize whitespace-nowrap transition-colors',
                  statusFilter === st
                    ? 'bg-saffron text-white shadow-sm'
                    : 'bg-ivory hover:bg-cream text-brown border border-cream'
                )}
              >
                {st.replace('_', ' ')} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-cream shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-ivory text-muted-foreground uppercase text-[11px] font-semibold border-b border-cream">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Required Date & Time</th>
                <th className="py-3 px-4">Items Summary</th>
                <th className="py-3 px-4">Deal Total</th>
                <th className="py-3 px-4">Paid / Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream/60">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-muted-foreground text-xs">
                    No orders match the selected filter.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-cream/20 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-brown">{ord.order_number}</p>
                      <p className="text-[11px] text-muted-foreground">{formatDateIST(ord.created_at)}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-brown">{ord.customer_name}</p>
                      <a
                        href={`tel:${ord.customer_phone}`}
                        className="text-xs text-saffron hover:underline font-mono"
                      >
                        {ord.customer_phone}
                      </a>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-brown">{formatDateIST(ord.required_date)}</p>
                      <p className="text-xs text-muted-foreground">{ord.required_time || 'General'}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="text-xs font-medium text-brown">
                        {ord.items?.length || 1} garland types
                      </p>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {ord.items?.map((i) => i.product_name).join(', ')}
                      </p>
                    </td>

                    <td className="py-3 px-4 font-bold text-brown">
                      {formatINR(ord.total_amount)}
                    </td>

                    <td className="py-3 px-4">
                      <p className="text-xs font-semibold text-green-700">
                        Paid: {formatINR(ord.advance_paid ?? 0)}
                      </p>
                      <p className="text-[11px] font-bold text-saffron">
                        Bal: {formatINR(ord.balance_amount ?? Math.max(0, ord.total_amount - (ord.advance_paid ?? 0)))}
                      </p>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={cn(
                          'badge-tag capitalize text-[10px]',
                          ord.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : ord.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : ord.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-saffron/20 text-saffron-800'
                        )}
                      >
                        {ord.status.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* WhatsApp Customer Link */}
                        <a
                          href={buildWhatsAppLink(
                            ord.customer_phone,
                            `Namaste ${ord.customer_name}, regards your order ${ord.order_number} at ${settings.store_name}: `
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100"
                          title="Message Customer on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                        </a>

                        {/* Print Receipt */}
                        <button
                          onClick={() => handlePrintReceipt(ord)}
                          className="p-1.5 rounded-lg hover:bg-cream text-brown"
                          title="Print Receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        {/* View & Update Status */}
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="p-1.5 rounded-lg hover:bg-cream text-brown"
                          title="View / Update Status"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-cream shadow-2xl my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-cream pb-3">
              <div>
                <span className="badge-tag bg-saffron text-white">Order Details</span>
                <h2 className="font-display font-bold text-xl text-brown mt-1">
                  {selectedOrder.order_number}
                </h2>
              </div>
              <button onClick={() => setSelectedOrder(null)}>
                <X className="w-5 h-5 text-muted-foreground hover:text-brown" />
              </button>
            </div>

            {/* Customer & Event Details */}
            <div className="grid grid-cols-2 gap-4 text-xs sm:text-sm bg-ivory/50 p-4 rounded-2xl border border-cream">
              <div>
                <p className="text-muted-foreground">Customer Name:</p>
                <p className="font-semibold text-brown">{selectedOrder.customer_name}</p>
                <p className="text-xs text-saffron">{selectedOrder.customer_phone}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Required Date & Time:</p>
                <p className="font-semibold text-brown">{formatDateIST(selectedOrder.required_date)}</p>
                <p className="text-xs text-muted-foreground">{selectedOrder.required_time || 'General'}</p>
              </div>

              <div className="col-span-2">
                <p className="text-muted-foreground">Fulfilment Type & Address:</p>
                <p className="font-semibold text-brown capitalize">{selectedOrder.fulfilment_type}</p>
                {selectedOrder.delivery_address && (
                  <p className="text-xs text-brown/80 pt-0.5">{selectedOrder.delivery_address}</p>
                )}
              </div>

              {selectedOrder.special_instructions && (
                <div className="col-span-2 border-t border-cream pt-2">
                  <p className="text-muted-foreground">Special Instructions:</p>
                  <p className="italic text-xs text-brown">{selectedOrder.special_instructions}</p>
                </div>
              )}
            </div>

            {/* Line Items */}
            <div className="space-y-2">
              <h3 className="font-semibold text-xs text-muted-foreground uppercase">Garland Items</h3>
              <div className="divide-y divide-cream/60 border border-cream rounded-2xl p-3">
                {selectedOrder.items?.map((it) => (
                  <div key={it.id} className="py-2 flex justify-between items-center text-xs sm:text-sm">
                    <div>
                      <p className="font-semibold text-brown">{it.product_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatINR(it.unit_price)} × {it.quantity}
                      </p>
                    </div>
                    <span className="font-bold text-brown">{formatINR(it.line_total)}</span>
                  </div>
                ))}
                <div className="pt-2 flex justify-between font-bold text-sm text-brown">
                  <span>Total Amount</span>
                  <span className="text-saffron">{formatINR(selectedOrder.total_amount)}</span>
                </div>
              </div>
            </div>

            {/* Status Change Selector & Internal Note */}
            <div className="space-y-3 bg-cream/30 p-4 rounded-2xl border border-cream">
              <h4 className="font-semibold text-xs text-brown">Update Order Status</h4>
              <div className="flex flex-wrap gap-2">
                {ALL_STATUSES.map((st) => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                    className={cn(
                      'px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all',
                      selectedOrder.status === st
                        ? 'bg-brown text-white shadow-sm'
                        : 'bg-white hover:bg-cream text-brown border border-cream'
                    )}
                  >
                    {st.replace('_', ' ')}
                  </button>
                ))}
              </div>

              <div className="pt-2">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Optional internal note (e.g. Advised customer on WhatsApp that red roses will be Dutch blooms)..."
                  className="w-full py-2 px-3 rounded-xl border border-cream bg-white text-xs focus:outline-none focus:ring-2 focus:ring-saffron/40"
                />
              </div>
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                onClick={() => handlePrintReceipt(selectedOrder)}
                className="btn-outline-saffron text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Order Receipt</span>
              </button>

              <button
                onClick={() => setSelectedOrder(null)}
                className="btn-saffron text-xs py-2 px-5"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

