import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import type { Order, OrderItem, FulfilmentType } from '@/types/database'
import { generateOrderNumber } from '@/lib/utils'
import { productService } from './productService'
import { generateOrderWhatsAppMessage } from './whatsappService'

export interface CreateOrderInput {
  customer_name: string
  customer_phone: string
  customer_alternate_phone?: string
  fulfilment_type?: FulfilmentType
  delivery_address?: string
  required_date: string
  required_time?: string
  special_instructions?: string
  idempotency_key: string
  advance_paid?: number
  payment_note?: string
  items: Array<{
    product_id: string
    quantity: number
    customization_notes?: string
  }>
}

export interface CreateOrderResult {
  success: boolean
  order?: Order
  whatsappMessage?: string
  error?: string
}

const LOCAL_ORDERS_STORAGE_KEY = 'santosh_pushpa_orders_v1'

export const orderService = {
  getLocalOrders(): Order[] {
    try {
      const raw = localStorage.getItem(LOCAL_ORDERS_STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  },

  saveLocalOrder(order: Order) {
    try {
      const orders = this.getLocalOrders()
      const existing = orders.findIndex((o) => o.id === order.id || o.order_number === order.order_number)
      if (existing > -1) {
        orders[existing] = order
      } else {
        orders.unshift(order)
      }
      localStorage.setItem(LOCAL_ORDERS_STORAGE_KEY, JSON.stringify(orders))
    } catch (e) {
      console.warn('Could not cache order locally:', e)
    }
  },

  async createOrder(input: CreateOrderInput, storeSettings?: { default_delivery_charge?: number; store_name?: string }): Promise<CreateOrderResult> {
    try {
      // 1. Check idempotency: prevent duplicate double-submissions
      const existingOrders = this.getLocalOrders()
      const duplicate = existingOrders.find((o) => o.idempotency_key === input.idempotency_key)
      if (duplicate) {
        return {
          success: true,
          order: duplicate,
          whatsappMessage: generateOrderWhatsAppMessage(duplicate, storeSettings?.store_name),
        }
      }

      // 2. Fetch fresh server-side prices and verify availability for all items
      const allProducts = await productService.getAll()
      const verifiedItems: OrderItem[] = []
      let calculatedSubtotal = 0

      for (const itemInput of input.items) {
        const product = allProducts.find((p) => p.id === itemInput.product_id)
        if (!product) {
          return { success: false, error: `Product not found: ${itemInput.product_id}` }
        }
        if (!product.is_available) {
          return { success: false, error: `"${product.name}" is currently unavailable.` }
        }

        const lineTotal = product.price * itemInput.quantity
        calculatedSubtotal += lineTotal

        verifiedItems.push({
          id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          order_id: '',
          product_id: product.id,
          product_name: product.name,
          product_sku: product.sku,
          price_unit: product.price_unit,
          unit_price: product.price,
          quantity: itemInput.quantity,
          line_total: lineTotal,
        })
      }

      // 3. No delivery fee - Store pickup direct deal
      const deliveryCharge = 0
      const totalAmount = calculatedSubtotal
      const advancePaid = Math.max(0, Number(input.advance_paid) || 0)
      const balanceAmount = Math.max(0, totalAmount - advancePaid)

      // 4. Generate unique Order number
      const orderNumber = generateOrderNumber()
      const newOrderId = `ord-${Date.now()}`

      const newOrder: Order = {
        id: newOrderId,
        order_number: orderNumber,
        customer_name: input.customer_name.trim(),
        customer_phone: input.customer_phone.trim(),
        customer_alternate_phone: input.customer_alternate_phone?.trim(),
        fulfilment_type: 'pickup',
        delivery_address: undefined,
        required_date: input.required_date,
        required_time: input.required_time,
        special_instructions: input.special_instructions?.trim(),
        subtotal: calculatedSubtotal,
        delivery_charge: deliveryCharge,
        total_amount: totalAmount,
        advance_paid: advancePaid,
        balance_amount: balanceAmount,
        payment_note: input.payment_note?.trim(),
        status: 'pending',
        payment_status: advancePaid >= totalAmount && totalAmount > 0 ? 'paid' : 'pending',
        idempotency_key: input.idempotency_key,
        created_at: new Date().toISOString(),
        items: verifiedItems.map((item) => ({ ...item, order_id: newOrderId })),
        status_history: [
          {
            id: `sh-${Date.now()}`,
            order_id: newOrderId,
            status: 'pending',
            note: advancePaid > 0
              ? `Order submitted. Advance Paid: ₹${advancePaid}, Balance Due: ₹${balanceAmount}`
              : 'Order submitted. Full deal balance due on pickup',
            created_at: new Date().toISOString(),
          },
        ],
      }

      // 5. If Supabase is configured, insert to Supabase transactionally
      if (isSupabaseConfigured) {
        try {
          const { data: dbOrder, error: orderErr } = await supabase
            .from('orders')
            .insert({
              order_number: newOrder.order_number,
              customer_name: newOrder.customer_name,
              customer_phone: newOrder.customer_phone,
              customer_alternate_phone: newOrder.customer_alternate_phone,
              fulfilment_type: newOrder.fulfilment_type,
              delivery_address: newOrder.delivery_address,
              required_date: newOrder.required_date,
              required_time: newOrder.required_time,
              special_instructions: newOrder.special_instructions,
              subtotal: newOrder.subtotal,
              delivery_charge: newOrder.delivery_charge,
              total_amount: newOrder.total_amount,
              status: 'pending',
              payment_status: 'pending',
              idempotency_key: newOrder.idempotency_key,
            })
            .select()
            .single()

          if (!orderErr && dbOrder) {
            newOrder.id = dbOrder.id
            // Insert line items
            const dbItems = verifiedItems.map((i) => ({
              order_id: dbOrder.id,
              product_id: i.product_id,
              product_name: i.product_name,
              product_sku: i.product_sku,
              price_unit: i.price_unit,
              unit_price: i.unit_price,
              quantity: i.quantity,
              line_total: i.line_total,
            }))

            await supabase.from('order_items').insert(dbItems)

            // Insert initial status history
            await supabase.from('order_status_history').insert({
              order_id: dbOrder.id,
              status: 'pending',
              note: 'Order submitted by customer',
            })
          }
        } catch (dbErr) {
          console.warn('Could not sync to Supabase, stored in memory/localStorage:', dbErr)
        }
      }

      // Save locally so customer can review, retry WhatsApp, and admin can see it
      this.saveLocalOrder(newOrder)

      const whatsappMessage = generateOrderWhatsAppMessage(newOrder, storeSettings?.store_name)

      return {
        success: true,
        order: newOrder,
        whatsappMessage,
      }
    } catch (err: any) {
      return {
        success: false,
        error: err?.message || 'Failed to process order',
      }
    }
  },

  async getOrderByIdOrNumber(idOrNumber: string): Promise<Order | null> {
    // Check local storage first
    const local = this.getLocalOrders()
    const foundLocal = local.find((o) => o.id === idOrNumber || o.order_number === idOrNumber)
    if (foundLocal) return foundLocal

    // Check Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, items:order_items(*), status_history:order_status_history(*)')
          .or(`id.eq.${idOrNumber},order_number.eq.${idOrNumber}`)
          .maybeSingle()

        if (!error && data) return data
      } catch (err) {
        console.warn('Error fetching order from Supabase:', err)
      }
    }

    return null
  },

  async getAllOrders(): Promise<Order[]> {
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('orders')
          .select('*, items:order_items(*), status_history:order_status_history(*)')
          .order('created_at', { ascending: false })

        if (!error && data) return data
      } catch (err) {
        console.warn('Error fetching orders from Supabase:', err)
      }
    }
    return this.getLocalOrders()
  },

  async updateOrderStatus(orderId: string, newStatus: Order['status'], note?: string): Promise<boolean> {
    const orders = this.getLocalOrders()
    const target = orders.find((o) => o.id === orderId)
    if (target) {
      target.status = newStatus
      target.status_history = target.status_history || []
      target.status_history.unshift({
        id: `sh-${Date.now()}`,
        order_id: orderId,
        status: newStatus,
        note: note || `Status updated to ${newStatus}`,
        created_at: new Date().toISOString(),
      })
      this.saveLocalOrder(target)
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
        await supabase.from('order_status_history').insert({
          order_id: orderId,
          status: newStatus,
          note: note || `Status updated to ${newStatus}`,
        })
      } catch (err) {
        console.warn('Error updating status in Supabase:', err)
      }
    }

    return true
  },
}

